# Layout brief — carrying the 4-column grid into project pages

Priming context for the next layout pass. Read this before touching
`ProjectLayout.astro`, `ProjectTOC.astro`, `index.astro` or `tokens.css`.

## Goal

The homepage's 4-column grid is the site's spine. Project pages currently
ignore it. Make every page sit on the same 4 columns so the jump from the
gallery into a case study feels like one system, not two sites.

## Decision: 1x | 2x text | media breaks out to 3x

```
| col 1        | col 2          col 3 | col 4        |
| metadata     | TEXT (2x)            | (empty for   |
| + TOC        |                      |  text)       |
| (sticky)     | MEDIA (2x → 3x) ───────────────────►|
```

- **Col 1 (1x):** role, scope, team, then the TOC. Sticky, not fixed. It's the
  same column as the homepage intro paragraph, so the top-left corner means
  "context about this page" everywhere.
- **Cols 2–3 (2x):** all running text (headings, paragraphs, labels).
- **Cols 2–4 (3x):** media can break out into col 4. Hero images and key UI
  shots span 3x; smaller or supporting images can stay 2x. Col 4 is only ever
  empty next to text, never as a standalone dead strip.
- Optional: the hero can span all 4 columns (1x–4x) as the one full-width
  moment, mirroring a wide gallery tile.

### Why this direction (vs. the two options considered)

**Option A — 1x meta | 3x content**
- Images are big (≈1050px at 1440 wide) and the page feels like the gallery.
- But text at 3x is roughly 150+ characters per line, so it's unreadable. You'd
  have to cap the text inside the 3x anyway, which brings back the off-grid
  "second margin" problem we're trying to remove.
- All the visual weight sits right of center, while the nav is centered.

**Option B — 1x meta | 2x content | 1x negative space**
- Text at 2x is ≈695px wide (about 75 characters per line at 18px), which is
  ideal for reading.
- Cols 2–3 are centered on the page, so the content's center is the same
  gutter the Work/About nav straddles. The nav already lines up with this.
- But images capped at 2x are no bigger than a wide homepage tile. UI case
  studies need size. And on its own, a permanently empty col 4 reads as
  unfinished on large screens.

**Chosen:** B's reading structure, plus A's big images by letting media break
into col 4. That's the intent the project pages already have ("larger images,
smaller text"), but expressed as grid columns instead of two arbitrary vw
margins.

## How the grid works today (verified)

### Homepage (`src/pages/index.astro`, `ProjectCard.astro`)
- `.page-grid` defines `--col-unit: calc((100% - 3 * var(--gap-grid)) / 4)`.
  At 601–1000px it's 3 columns, and at ≤600px it's 1 (cards go 100%).
- The grid is implicit, not a CSS grid. `.gallery` is a wrapping flexbox and
  the columns emerge from tile widths: square = `1 * --col-unit`, wide =
  `2 * --col-unit + --gap-grid`.
- The visible column edges are image edges, not card edges. Each
  `.card-wrapper` has `padding: var(--gap-grid)` (5px), so the visible gutter
  between images is 3 × `--gap-grid` = 15px. Any grid on project pages must
  align to image edges.
- `.intro` is 1 column wide, top-left, with `padding-left: var(--gap-grid)` so
  its text lines up with the first image edge.
- Page side margin is `--page-padding-x: 1rem`. Note that 1rem = 12px on
  desktop because `reset.css` sets `html { font-size: 75% }`, and 16px at
  ≤600px.
- Nav (`Nav.astro`): Work/About sit in a 2-column grid whose center gap equals
  the 15px image gutter, so they straddle the page's center line, which is the
  col 2 | col 3 boundary.

### Project pages (`src/layouts/ProjectLayout.astro`, `ProjectTOC.astro`)
- Nothing references `--col-unit`.
- `.project-page`: `padding-inline: 21vw` (15vw ≤1200px, 1.5rem ≤640px).
- `.project-content`: `max-width: 1100px`, centered, with a text inset of
  `--_text-margin: clamp(2rem, 8vw, 10rem)`. Media (`.p-media`,
  `.p-media-2col/3col`, `.p-card-grid`) uses negative margins to bleed back out
  by that inset.
- `.p-toc` is `position: fixed`, at `left: clamp(1rem, 6vw, 10rem)` and
  vertically centered, and only shows ≥1200px. It floats in the margin and has
  no relationship to any column.
- Metadata (Role / Skills / Team) currently sits in a `.p-meta-grid`
  (3 columns) under the title, not in a sidebar.
- `ProjectLayout` does not use `BaseLayout`. It duplicates the nav, the About
  modal markup and script, and the modal styles. It also has no `flushTop`
  equivalent.

## Implementation notes / constraints for the next pass

1. **One grid definition.** Lift `--col-unit` (and ideally a real
   `grid-template-columns: repeat(4, 1fr)` with the matching gap) out of
   `index.astro` into a shared place, such as a `.grid-4` utility or
   `BaseLayout` `main`. Then the homepage and project pages read the same
   numbers.
2. **Align to image edges.** Account for the card's `--gap-grid` padding. Either
   inset the project grid by `--gap-grid` on both sides, or define project
   column gaps as 3 × `--gap-grid` so the project edges land exactly on the
   homepage image edges. Check by measuring image edges in the browser on both
   pages at 1440px.
3. **Named lines.** Prefer named grid lines/areas (`meta`, `text`, `media`,
   `full`) so authoring stays simple. For example, `.p-media` spans
   `text-start / media-end`, and text blocks span `text`. Keep the existing
   authoring classes (`.p-section-open`, `.p-detail`, `.p-media`,
   `.p-media-2col/3col`, `.p-card-grid`, `.label`, `.caption`) working, so the
   ~8 project pages under `src/pages/work/` don't all need rewriting.
4. **Metadata + TOC into col 1.** Move them into a sticky col-1 sidebar.
   Retire the fixed-position TOC math (`left: clamp(...)`).
5. **Breakpoints must match the homepage.**
   - >1000px: 4 columns as above.
   - 601–1000px (homepage is 3 columns): the sidebar moves above the content.
     Text spans 2 of 3 columns, media spans 3.
   - ≤600px: single column, and everything stacks.
6. **Consider merging `ProjectLayout` onto `BaseLayout`** while restructuring,
   to remove the duplicated nav/modal code. This is optional but it's the
   natural moment to do it.
7. **Type scale stays as consolidated** (see `tokens.css` comments):
   xs 12 / sm 15 / md 18 / lg 24 on desktop.

## Pages affected
`src/pages/work/`: `best-summer-programs/` (hub + 4 sub-pages),
`stream-predicts/index.astro`, `podpocalypse.astro`, `nirvananoir.astro`,
`marvel.astro`.
