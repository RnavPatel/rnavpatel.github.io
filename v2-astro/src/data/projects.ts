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

import type { Status } from "../components/StatusChip.astro";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  href: string;
  /** Path relative to /public, e.g. "/images/Marvel/hero.mp4" */
  image: string;
  mediaType: "image" | "video";
  /** "square" = 1:1, "wide" = 2:1 (spans ~2 columns) */
  size: "square" | "wide";
  /** If true: desktop shows 🔒 before the title on hover; mobile shows a persistent 🔒 badge */
  locked?: boolean;
  /** Optional chip right of the title: "shipped" | "in-construction" | "coming-soon" */
  status?: Status;
}

export const projects: Project[] = [
  // Row 1: square + wide + square  (fills the row perfectly)
  {
    id: "placeholder-1",
    title: "BestSummerProgram",
    subtitle: "Education Discovery Platform",
    locked: false,
    tags: ["Product Design", "UIUX", "Design Systems"],
    href: "/work/best-summer-programs",
    image: "/images/Placeholders/BSP_Hero_V3.png",
    status: "shipped",
    mediaType: "image",
    size: "wide",
  },

    {
    id: "BSP Illustration Case Study",
    title: "BestSummerProgram",
    subtitle: "UI Illustration Case Study",
    locked: false,
    tags: ["UI Illustration", "Visual Identity"],
    href: "/work/best-summer-programs/ui-illustrations",
    image: "/images/Placeholders/UI_Illustrations.mp4",
    status: "shipped",
    mediaType: "video",
    size: "square",
  },
  /*
      {
    id: "placeholde-2",
    title: "BestSummerProgram",
    subtitle: "Illustration System Case Study",
    locked: false,
    tags: ["Product Design", "UIUX", "Motion Design", "Design Systems"],
    href: "/work/best-summer-programs/ui-illustrations",
    image: "/images/BestSummerPrograms/BSP_UI_Illustrations_Hero_v2.png",
    mediaType: "image",
    size: "square",
  },
  */
  {
    id: "StreamPredicts Dashboard",
    title: "StreamPredicts",
    subtitle: "Prediction Market Dashboard",
    locked: true,
    tags: ["Product Design", "UIUX", "Visual Identity", "Design Systems"],
    href: "",
    image: "/images/Placeholders/StreamPredicts_Dashboard_CS_Hero.png",
    status: "in-construction",
    mediaType: "image",
    size: "square",
  },
      {
    id: "StreamPredicts Overlay",
    title: "StreamPredicts",
    subtitle: "Gamified Livestream Interface",
    locked: false,
    tags: ["UIUX", "Motion Design"],
    href: "/work/stream-predicts",
    image: "/images/Placeholders/StreamPredicts_Test.mp4",
    mediaType: "video",
    size: "square",
  },

  {
    id: "podpocalypse",
    title: "Podpocalypse",
    subtitle: "Local Couch-Party Videogame",
    tags: ["UIUX", "Motion Design", "Design Systems", "Game Design"],
    href: "/work/podpocalypse",
    image: "/images/Placeholders/Podpoc_HeroImage_Testv1.png",
    mediaType: "image",
    size: "wide",
  },
  {
    id: "nirvana-noir",
    title: "Nirvana Noir",
    subtitle: "Cinematic Puzzle RPG",
    tags: ["Technical Art", "Production", "UIUX"],
    href: "/work/nirvananoir",
    image: "/images/Placeholders/FCD_Hero_v1.png",
    mediaType: "image",
    size: "square",
  }
  /*
        {
    id: "marvel",
    title: "Marvel Fracture",
    subtitle: "Experiential Marvel Activation",
    tags: ["UIUX", "Motion Design", "IxD"],
    href: "/work/marvel",
    image: "/images/Marvel/HeroAttempt1.mp4",
    mediaType: "video",
    size: "square",
  },
  */
];
