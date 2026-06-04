/* ============================================================
   PROJECT DATA  —  src/data/projects.ts
   ============================================================

   ★ THIS IS THE ONLY FILE YOU EDIT TO ADD/REMOVE PROJECTS ★

   HOW TO ADD A PROJECT:
     1. Copy any object below
     2. Change the values (id, title, tags, href, image, size)
     3. Place it where you want it to appear (order = visual order)
     4. Done. No CSS changes needed.

   CARD SIZES:
     "square"  →  1:1 square card
     "wide"    →  2:1 landscape card (roughly twice as wide as square)

   ORDER IN THIS ARRAY = ORDER ON THE PAGE
     Flexbox fills rows left-to-right, then centers each row.
     A row of [square + wide] fills one row.
     A row of [square + wide + square] fills one row.
     Any leftover partial row gets centered automatically.

   IMAGE PATHS:
     Files live in /public/images/ — path starts with /images/
   ============================================================ */

export interface Project {
  id: string;
  title: string;
  tags: string[];
  href: string;
  /** Path relative to /public, e.g. "/images/Marvel/hero.mp4" */
  image: string;
  mediaType: "image" | "video";
  /** "square" = 1:1, "wide" = 2:1 (spans ~2 columns) */
  size: "square" | "wide";
  /** If true: desktop shows 🔒 before the title on hover; mobile shows a persistent 🔒 badge */
  locked?: boolean;
}

export const projects: Project[] = [
  // Row 1: square + wide + square  (fills the row perfectly)
  {
    id: "placeholder-1",
    title: "BestSummerProgram",
    locked: true,
    tags: ["Product Design", "UIUX"],
    href: "#",
    image: "/images/Placeholders/BSP_Placeholder.png",
    mediaType: "image",
    size: "square",
  },
  {
    id: "podpocalypse",
    title: "Podpocalypse: Bottom of the Bowl",
    tags: ["Video Game", "UIUX", "Technical Art", "Development"],
    href: "/work/podpocalypse",
    image: "/images/PodPocalypse/PodHero.png",
    mediaType: "image",
    size: "wide",
  },
  // Row 2: square + wide  (3 units, centers in the row)
  {
    id: "marvel",
    title: "Marvel Fracture",
    tags: ["Visual Identity", "UI/UX", "Technical Art"],
    href: "/work/marvel",
    image: "/images/Marvel/HeroAttempt1.mp4",
    mediaType: "video",
    size: "square",
  },
  {
    id: "nirvana-noir",
    title: "Nirvana Noir",
    tags: ["Video Game", "Technical Art", "Production"],
    href: "/work/nirvananoir",
    image: "/images/FeralCatDen/NirvanaNoirThumbnail.png",
    mediaType: "image",
    size: "wide",
  },
  {
    id: "placeholder-2",
    title: "YC Stealth Startup",
    locked: true,
    tags: ["Brand Identity"],
    href: "#",
    image: "/images/Placeholders/OpenVector_Placeholder.png",
    mediaType: "image",
    size: "square",
  },
];
