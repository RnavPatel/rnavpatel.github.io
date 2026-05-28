/* ============================================================
   PROJECT DATA  —  src/data/projects.ts
   The single source of truth for all portfolio projects.

   To add a project: copy any object below, change the values.
   To reorder the grid: change the gridArea values.
   To change card shape: change size to "square" or "wide".

   CARD SIZES:
     "square"  → 1:1 aspect ratio, spans 1 grid column
     "wide"    → 2:1 aspect ratio, spans 2 grid columns
                 (same height as a square card — they're designed to match)

   GRID AREAS (matches the map in index.astro):
     Row 1:  card1  |  card2 (wide)  |  card3
     Row 2:  empty  |  card4         |  card5 (wide)
   ============================================================ */

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  tags: string[];
  href: string;
  /** Path relative to /public */
  image: string;
  mediaType: "image" | "video";
  /** Card shape: "square" (1:1) or "wide" (2:1, spans 2 columns) */
  size: "square" | "wide";
  /** Which named area in the grid this card occupies */
  gridArea: "card1" | "card2" | "card3" | "card4" | "card5";
  /** Optional: password-protected case study */
  protected?: boolean;
}

export const projects: Project[] = [
  {
    id: "placeholder",
    title: "New Project",
    tags: ["Coming Soon"],
    href: "#",
    image: "",
    mediaType: "image",
    size: "square",
    gridArea: "card1",
  },
  {
    id: "marvel",
    title: "Marvel Fracture",
    tags: ["2D Art", "UI/UX", "Development"],
    href: "/work/marvel",
    image: "/images/Marvel/HeroAttempt1.mp4",
    mediaType: "video",
    size: "wide",       /* spans 2 columns */
    gridArea: "card2",
  },
  {
    id: "nirvana-noir",
    title: "Nirvana Noir",
    tags: ["3D Environment Art", "Prop Design", "Production"],
    href: "/work/nirvana-noir",
    image: "/images/FeralCatDen/NirvanaNoirThumbnail.png",
    mediaType: "image",
    size: "square",
    gridArea: "card3",
  },
  {
    id: "catnapped",
    title: "Catnapped!",
    tags: ["2D Art", "UI/UX", "Production"],
    href: "/work/catnapped",
    image: "/images/Catnapped/Catnapped_Thumbnail.mp4",
    mediaType: "video",
    size: "square",
    gridArea: "card4",
  },
  {
    id: "podpocalypse",
    title: "Podpocalypse: Bottom of the Bowl",
    tags: ["UI/UX", "3D Art", "VFX", "Development", "Game Design"],
    href: "/work/podpocalypse",
    image: "/images/PodPocalypse/PodHero.png",
    mediaType: "image",
    size: "wide",       /* spans 2 columns */
    gridArea: "card5",
  },
];
