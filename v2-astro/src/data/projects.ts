/* ============================================================
   PROJECT DATA
   The single source of truth for all portfolio projects.
   To add a new project: add one object to this array.
   The homepage grid and any future index/filter pages
   all read from here — you never touch HTML to update content.
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
  /** Which grid area this card occupies (defined in the grid CSS) */
  gridArea: string;
  /** Optional: for password-protected projects */
  protected?: boolean;
}

export const projects: Project[] = [
  {
    id: "podpocalypse",
    title: "Podpocalypse: Bottom of the Bowl",
    tags: ["UI/UX", "3D Art", "VFX", "Development", "Game Design"],
    href: "/work/podpocalypse",
    image: "/images/PodPocalypse/PodHero.png",
    mediaType: "image",
    gridArea: "card5",
  },
  {
    id: "marvel",
    title: "Marvel Fracture",
    tags: ["2D Art", "UI/UX", "Development"],
    href: "/work/marvel",
    image: "/images/Marvel/HeroAttempt1.mp4",
    mediaType: "video",
    gridArea: "card2",
  },
  {
    id: "nirvana-noir",
    title: "Nirvana Noir",
    tags: ["3D Environment Art", "Prop Design", "Production"],
    href: "/work/nirvana-noir",
    image: "/images/FeralCatDen/NirvanaNoirThumbnail.png",
    mediaType: "image",
    gridArea: "card3",
  },
  {
    id: "catnapped",
    title: "Catnapped!",
    tags: ["2D Art", "UI/UX", "Production"],
    href: "/work/catnapped",
    image: "/images/Catnapped/Catnapped_Thumbnail.mp4",
    mediaType: "video",
    gridArea: "card4",
  },
  {
    id: "placeholder-5",
    title: "New Project",
    tags: ["Coming Soon"],
    href: "#",
    image: "",
    mediaType: "image",
    gridArea: "card1",
  },
];
