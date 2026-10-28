# Design System Cleanup Plan

A running checklist for the consolidation pass. Nothing here gets deleted while
any page still depends on it.

**Scope note:** the v2 format may stay limited to the **Best Summer Programs (BSP)
pages** for a while. Older case studies might not get new copy for some time. Plan
for **both systems (legacy + v2) to coexist**. Cleanup happens in two stages:
1. Consolidate what's **v2-only** as soon as all BSP pages are converted
   (new classes become the norm, and inline experiments get promoted to classes).
2. Delete **legacy-only** rules only once no page uses them.

Last updated: 2026-10-11

---

## Status

- [x] **Phase 1: Add the new system without breaking anything** (done 2026-10-11)
- [ ] **Phase 2: Rewrite the case studies in the v2 format** (in progress, see the tracker below)
- [ ] **Phase 3: Consolidate and delete** (blocked on Phase 2)

---

## How to write pages now (Phase 2 conventions)

Reference page: `src/pages/work/best-summer-programs/competitionsv2.astro`

```html
<div class="p-detail">
  <p class="text-heading"><span class="text-sup">Problem</span>…statement…</p>
  <p>Supporting copy…</p>
</div>
```

- Statement lines: `class="text-heading"`. **Don't** set `font-size` inline.
- Eyebrows on statements: `<span class="text-sup">`.
- Supporting copy: plain `<p>`, which renders at `--text-body`.
- Bold inside copy: `<strong>`, not `<span style="font-weight: bold">`.
- Inline styles for quick experiments are fine. They get counted in the
  **Inline style log** below, and repeated ones get promoted to classes.

**Layout (8-col grid, 2026-10-27).** Pages never set widths; `ProjectLayout.astro`
places every block by zone:
- Hero: `<img slot="hero" …>` (or `<video slot="hero">`). Full 8 cols. Top-most image only.
- Media: `.p-media`, `.p-media-2col`, `.p-media-3col`, `.p-card-grid`. Cols 2–7.
- Everything else (title, `slot="meta"` row, statements, copy, dividers): cols 3–6.
- Wrapping blocks in an extra div? Add `class="p-flow"` so its children keep their zones.
- Not yet on the hero slot: marvel, nirvananoir, podpocalypse, stream-predicts
  (their first image still renders at 6 cols).

---

## The type scale (target end state)

Four sizes. Defined in `src/styles/tokens.css`.

| Token | Desktop / phone | Role |
|---|---|---|
| `--text-heading` | 36 / 28px | statement lines, h1 |
| `--text-body` | 18 / 16px | paragraphs, intro, About modal, eyebrows (`.text-sup`) |
| `--text-small` | 15 / 14px | UI: nav, cards, status chips, captions |
| `--text-label` | 12 / 12px | `.label`, tags, TOC, "Not my work" pill |

Weights: 400 / 500 / 600. Line-heights: `--leading-tight` (1.2, headings) and
`--leading-normal` (1.4, everything else).

Root font size: `1rem` = 12px above 600px wide and 16px at or below. Phone values are
set in the `@media (max-width: 600px)` block in tokens.css.

---

## Phase 2 tracker: case studies to rewrite

Each of these still uses legacy `h1`–`h4`, `.p-section-open` and/or old tokens.

**BSP pages (first priority):**
- [x] best-summer-programs/competitionsv2 (reference page)
- [ ] best-summer-programs/competitions (old version; delete once v2 replaces it?)
- [~] best-summer-programs/index (hub page). Uses `.text-heading` + `.text-sup`,
      but still has inline colors and `<div style="margin-top: 3rem">`.
- [ ] best-summer-programs/compare-bookmarks
- [ ] best-summer-programs/navigation-redesign
- [~] best-summer-programs/ui-illustrations. Uses `.text-heading` + `.text-sup`,
      but still has inline red/green statement colors.

**Other case studies (may stay legacy for a long time):**
- [ ] marvel
- [ ] nirvananoir
- [ ] podpocalypse
- [ ] stream-predicts/index
- [ ] about.astro: still uses `.text-md` / `.text-sm` / `.link`. The nav opens the
      About **modal**, so check whether this page is still linked. If not, delete it.

Before starting Phase 3, confirm nothing old remains:

```bash
grep -rnE "<h[2-4]|p-section-open|text-(xs|sm|md|lg|xl|2xl)\b|font-size: ?[0-9]+px" src
```

---

## P-structures assessment (`.p-*` classes in ProjectLayout.astro)

**Goal:** decide, from actual usage, which layout classes to keep, merge, rename or
delete. **Promote** a pattern to a class when the same inline style shows up 3+ times.
**Delete** a class that only legacy pages use (once they're gone) or that nothing uses.

### Inventory (baseline 2026-10-11, counts = occurrences in `src/pages`)

| Class | Used by | v2 (BSP) uses it? | Verdict so far |
|---|---|---|---|
| `.p-media` | all 10 pages (82×) | yes | **keep**: core block |
| `.p-detail` | all 9 case studies (52×) | yes | **keep, rename** (`.p-text` / `.p-beat`), fix internal gap |
| `.p-header` | all 10 pages | yes | **keep** |
| `.p-divider` | 6 pages (18×) | yes (1×) | keep; 2 legacy pages override its `margin-top` inline |
| `.p-media-2col` | 6 pages (13×) | yes | keep |
| `.p-media-3col` | marvel, nirvananoir, podpocalypse | no | legacy-only for now; keep while those pages exist |
| `.p-section-open` | marvel, nirvananoir, podpocalypse (16×) | no | **legacy-only**. Delete when those pages convert. |
| `.p-meta-grid` | 5 pages (6×) | BSP hub only | keep; podpocalypse overrides its columns + margin inline |
| `.p-not-mine` | competitionsv2, ui-illustrations | yes | keep (v2 pattern) |
| `.p-card-grid` | BSP hub only (1×) | yes | keep |
| `.p-media-ph` | competitionsv2 (1×, draft) | yes (draft) | keep as draft helper; should hit 0 before publishing |
| `.p-wip` | **nothing** | — | **dead**. Delete candidate. |
| `.p-head`, `.p-hero`, `.p-meta-row` | layout internals only | — | keep (structural, not authoring classes). `.p-sidebar*` removed 2026-10-27 |

Also used on project pages: `.label` (75×), `.caption` (66×), `.text-heading`, `.text-sup`.

### Inline style log

Add a line every time an inline style is written on a project page. When a pattern
reaches 3+ occurrences, promote it to a class or change the default of the class it overrides.

| Pattern | Where | Count | What it suggests |
|---|---|---|---|
| `style="margin-top: 1rem"` on supporting `<p>` in `.p-detail` | competitionsv2 | 2 | `.p-detail` gap is too small. Change the default to `--space-4`. |
| `style="margin-bottom: var(--space-1)"` on `.p-media` | competitions, compare-bookmarks (2) | 3 | Media followed by tightly-coupled media. Consider a `.p-media--tight` variant, or a smaller default. **Hit 3, so promote.** |
| `style="margin-top: var(--space-4)"` on `.p-divider` | marvel, nirvananoir | 2 | Divider right after the header wants less space. Watch it. |
| `style="margin-top: 0"` on `.p-detail` inside `.p-meta-grid` | podpocalypse | 2 | Nested `.p-detail` shouldn't add top margin. Fix in CSS (`.p-meta-grid > .p-detail`). |
| `style="grid-template-columns:1fr 1fr; …"` on `.p-meta-grid` | podpocalypse | 1 | One-off. |
| `style="margin-top: var(--space-16)"` on `.p-section-open` | nirvananoir | 1 | One-off, legacy. |
| `<div style="margin-top: 3rem">` | BSP hub | 1 | One-off spacer. Check whether a block class should own it. |
| `style="text-align:center"` on `.label` | nirvananoir | 1 | One-off. |
| Statement colors: red / `rgb(0,168,0)` / `rgb(0,128,0)` | competitionsv2, ui-illustrations | 6 | **Promote:** add `--color-problem` / `--color-solution` tokens + classes. Unify the two greens. |
| Statement colors: `black`, `#ffaa00aa`, `#ce5bffaa` | BSP hub | 3 | Brand/highlight accents. Decide whether they're tokens. |
| `style="font-weight: bold"` | competitionsv2 | 1 | Use `<strong>`. |

To refresh this table:

```bash
grep -rhoE 'style="[^"]+"' src/pages/work | sort | uniq -c | sort -rn
```

```bash
for c in $(grep -oE "^\s*\.p-[a-z0-9-]+" src/layouts/ProjectLayout.astro | tr -d ' .' | sort -u); do echo "$c: $(grep -rlE "class=\"[^\"]*\b$c\b" src/pages | wc -l | tr -d ' ') files"; done
```

### Open questions
- Does the v2 format need `.p-media-3col`, or is 2-col + full-width enough?
- Should `.label` and `.caption` move into typography.css as part of the 4-size scale?
  They're type styles that currently live in the layout file.
- With `.text-sup` eyebrows, is `.label` above a statement still needed in v2?
  It's only used in the page header ("Case Study 2").

---

## Phase 3: consolidation checklist

### Typography: `src/styles/typography.css`
- [ ] Replace the `h1`–`h6` size/weight rules with a reset
      (`font-size: inherit; font-weight: inherit`). Headings become semantic only,
      and classes drive the look.
- [ ] Delete `h2`, `h3`, `h4` rules.
- [ ] Delete the legacy utilities `.text-xl`, `.text-lg`, `.text-md`, `.text-sm`, `.text-xs`.
- [ ] Delete the unused color utilities `.text-primary`, `.text-secondary`, `.text-accent`.
      (Keep `.text-muted`, which AboutModal uses.)
- [ ] Add `strong, b { font-weight: var(--weight-semibold); }`.
- [ ] Keep: `p`, `.text-heading`, `.text-sup`, `.text-muted`, `a.link`.

### Tokens: `src/styles/tokens.css`
- [ ] Delete the LEGACY type block (`--text-xs/sm/md/lg/xl/2xl`). First rename
      every usage:
  - `--text-xs` → `--text-label` (ProjectLayout, ProjectTOC, ProjectCard)
  - `--text-sm` → `--text-small` (global.css, Nav, ProjectCard, StatusChip, ProjectLayout, BaseLayout)
  - `--text-md` → `--text-body` (AboutModal, BaseLayout)
- [ ] Delete `--weight-light` (300), `--weight-bold` (800), `--weight-extrabold` (1000).
  - Before that: `.label` in ProjectLayout uses `--weight-bold`, so switch it to `--weight-semibold`.
- [ ] Delete `--leading-loose`. `.about-bio` in AboutModal uses it, so switch to `--leading-normal`.
- [ ] Delete tokens that nothing uses (re-verify first):
      `--shadow-sm/md/lg`, `--color-text-inverse`, `--duration-page`,
      `--ease-in-out`, `--label-padding`.
- [ ] Re-run the unused-token check (counts `var(--x)` usages per token):

```bash
cd src && for v in $(grep -oE "^\s*--[a-z0-9-]+" styles/tokens.css | tr -d ' ' | sort -u); do echo "$(grep -rF -- "var($v)" . | wc -l | tr -d ' ') $v"; done | sort -n | head -30
```

### Layout blocks: `src/layouts/ProjectLayout.astro`
- [ ] **Rename `.p-detail`** to something like `.p-text` or `.p-beat`. In the v2 format it's
      the only text block type, so the "sub-point within a section" name no longer fits.
- [ ] **Delete `.p-section-open`**. competitionsv2 doesn't use it.
- [ ] **Fix the `.p-detail` internal gap.** It's `--space-2` (6px), but the supporting paragraphs
      get `style="margin-top: 1rem"` inline in competitionsv2. Change the gap to
      `--space-4` and remove the inline margins.
- [ ] Update the header comment block (TYPOGRAPHY / LAYOUT BLOCKS) to describe
      the v2 conventions instead of "plain `<h1> <h2> <h3> <p>`".
- [ ] Delete `.p-wip` (no pages use it). Keep `.p-media-ph` as a draft helper.
- [ ] Act on every pattern in the inline style log that reached 3+ occurrences.

### Markup cleanup
- [ ] Header statement in each case study: `<p class="text-heading">` →
      `<h1 class="text-heading">` (one real h1 per page). Do this after the heading
      reset above, so the h1 doesn't pick up legacy heading styles.
- [ ] Remove any remaining inline `style=` (font-size, font-weight, margin-top, colors).
- [ ] Colored statement spans (`style="color: red"`, `rgb(0, 168, 0)`): if these
      stay in the design, turn them into tokens + classes (e.g. `--color-problem`,
      `--color-solution`).
- [ ] competitionsv2: the Solution section's second `<p>` is missing its closing `</p>`.
- [ ] competitionsv2: `<hr class="p-divider"></hr>`. `<hr>` is a void element, so drop the `</hr>`.

---

## Phase 1 changelog (already done, 2026-10-11)

- Added `--text-heading/body/small/label` plus phone values at 600px.
- Pointed `--text-xs/sm/md` at the new sizes. `lg/xl/2xl` were left as legacy.
- Removed the 768px font-size override. It caused 9px tags and 10.5px UI text on
  tablets, because `1rem` was still 12px there.
- `--text-md` no longer shrinks via `2vw`, so body text no longer drops below caption size on tablets.
- `--leading-tight` changed from 1.1 to 1.2 for `.text-heading`.
- Added `.text-heading`. `.text-sup` now uses `--text-body` instead of `0.5em`.
- `--text-small` now exists. It was referenced in 3 places but never defined.
- Removed the broken `border-radius: var(--)` from `.label` in ProjectLayout.
- competitionsv2: 10 inline 36px styles → `.text-heading`, and removed a stray `</strong>`.

---

## Found along the way

Add things here while writing case studies (an inline style worth turning into a class,
a size that feels off, etc.).

-
