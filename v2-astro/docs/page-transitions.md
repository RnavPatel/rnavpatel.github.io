# Page Transitions

A living doc for the layered "sheet" page transitions. Update the **Changelog**
and **Ideas / open questions** as we go.

Code: `src/components/PageTransitions.astro` (rendered in the `<head>` of both
`BaseLayout.astro` and `ProjectLayout.astro`).

Last updated: 2026-11-06

---

## The idea

The site is a **stack of sheets**. Each page lives on a layer, and moving
between layers is physical:

| Move | What you see |
|---|---|
| Deeper (home → project, hub → case study) | The new page **slides up from the bottom** over the current one. The page underneath dims slightly. |
| Shallower (case study → hub, project → home) | The current page **slides down** and reveals the page below, which brightens back up. |
| Skipping layers (case study → home via **Work**) | Every layer in between slides too, **staggered**. The case study slides out first, then the hub layer slides out after a short delay. |
| Skipping layers forward (home → a case study card) | Mirror image: the hub layer slides up first, then the case study slides up on top of it. |
| Same depth (project → another project) | Treated as forward: the new page slides up. |

The nav (Back / Work / About) is its own layer. It **stays put on top**, and the
Back pill fades in or out over the same span as the slide.

## Layers come from the URL, so no per-page code

A page's layer is its **URL depth**, not counting the `/work` namespace:

```
/                                         → 0  home
/work/stream-predicts                     → 1  project or hub
/work/best-summer-programs                → 1  hub
/work/best-summer-programs/competitions   → 2  case study
/about                                    → 1
```

**Adding a page:** put it at the right URL nesting. That's all you need to do.
A new case study under a hub (`/work/<hub>/<case-study>`) automatically
becomes layer 2, and slides correctly to and from home, its hub, and siblings.
A third level (`/work/<hub>/<case-study>/<deep-dive>`) would also work: the
code handles any number of skipped layers.

**Rule of thumb:** keep the URL hierarchy matching the site's mental hierarchy
(a case study's URL lives under its hub's URL). If a page ever needs to break
that rule, see "Depth override" in the ideas list below.

## How it works

Native **cross-document View Transitions** (MPA, no client router, no
framework). Each page load stays a normal page load. The browser snapshots the
old page and the new page and animates them with CSS.

1. **Opt in:** `@view-transition { navigation: auto; }`, wrapped in
   `prefers-reduced-motion: no-preference`.
2. **Name each page by its depth:** the inline head script sets
   `<html style="view-transition-name: vt-depth-N">`. Old and new pages
   therefore get **different** names. They become separate layers that can
   stack in any order, instead of one shared root that only crossfades.
3. **On the new page, `pagereveal`:**
   - Find where we came from: `navigation.activation.from`, falling back to a
     `sessionStorage` value written in `pageswap`.
   - Compare depths → forward, back, or sideways.
   - For each skipped layer, add a **ghost sheet**: a page-colored, fixed,
     `z-index: -1` div named `vt-depth-K`. It's invisible on the live page and
     only shows as a snapshot during the slide.
   - Write a small per-navigation `<style>` that gives each layer its
     keyframes, delay and z-order (deeper = higher).
   - When `viewTransition.finished` resolves, remove the style and the ghosts.
4. **Static CSS** (in the component) holds the keyframes. It also turns off the
   default crossfade/blend on layer snapshots (via
   `view-transition-class: vt-layer`) and adds the soft leading-edge shadow.

### Why not Astro's `<ClientRouter />`?
- Its direction comes from **browser history** (back button = backwards). Ours
  comes from **hierarchy**: clicking "Work" from a case study is a forward
  history push, but it should still slide *down*.
- It turns the site into an SPA. Every page script (modal, video observer,
  springs) would need re-init on `astro:page-load`.
- Native MPA transitions keep the site static and simple. Browsers that don't
  support them just get the normal instant load.

## Tuning knobs

All in `src/components/PageTransitions.astro`. Search `Tuning`.

| Knob | Where | Current |
|---|---|---|
| Slide duration | script `DURATION` | 560ms |
| Stagger between layers | script `STAGGER` | 110ms |
| Easing | script `EASING` | `cubic-bezier(0.32, 0.72, 0, 1)` (iOS-sheet feel) |
| Dim of the covered page | CSS `vt-recede` / `vt-emerge` | `brightness(0.9)` |
| Leading-edge shadow | CSS `::view-transition-*(*.vt-layer)` | `0 -10px 40px rgb(0 0 0 / .12)` |
| Ghost sheet color | CSS `.vt-ghost` | `var(--color-bg)` |

**Slow-mo for tuning:** in the browser console, run
`localStorage.setItem("vt:slow", "8")` (8× slower). Undo it with
`localStorage.removeItem("vt:slow")`.

## Browser support

- **Chrome / Edge 126+, Safari 18.2+:** full effect.
- **Firefox:** no cross-document view transitions yet → instant page loads
  (same as before). Nothing breaks.
- **Reduced motion:** transitions are off entirely.
- Transitions only run while the page is visible. A hidden or background tab
  skips them; that's built into the browser.

## Related

- **Speculation rules:** the component also prefetches same-site links on
  hover (`eagerness: "moderate"`). The next page's HTML is usually ready on
  click, so the slide starts right away instead of after a network wait.

## Ideas / open questions

- [ ] **Ghost sheets show the real in-between page?** Right now skipped
      layers are blank page-colored sheets. Option: render a light stand-in
      (e.g. the hub's title) inside the ghost. The data is available from
      `backHref` / `backLabel` on case studies.
- [ ] **Depth override:** if a page ever lives at a URL that doesn't match its
      layer, add an `<html data-vt-depth="N">` override that `depthOf` checks
      first.
- [ ] **Sideways transitions:** "next case study" links between siblings
      currently slide up like forward. Could slide horizontally instead.
- [ ] **Shared-element morph:** project card image on home → hero on the
      project page (`view-transition-name` on both). Would have to be layered
      in with the sheet slide carefully.
- [ ] **About modal** isn't a navigation, so it's unaffected. `/about` as a page
      is depth 1 if anyone lands there.
- [ ] **Mobile check:** confirm the feel on iOS Safari (18.2+), especially
      with the shadow and the address-bar collapse.

## Changelog

- **2026-11-06:** v1. Depth-from-URL layering, forward/back/multi-layer
  stagger with ghost sheets, nav stays fixed on top, reduced-motion opt-out,
  hover prefetch, `vt:slow` debug knob. Checked in headless Chrome (home →
  case study, case study → home, case study → hub, hub → home, home →
  project).
