/**
 * Copy and asset manifest for the landing page, transcribed from the Figma
 * frame `pixles-popers / ui deisgn` (node 25:14).
 */

/** Fill treatment of a giant Modak letter in the services grid. */
export type ServiceFill = "outline" | "grape" | "sunbeam" | "photo";

/**
 * A point inside a letter tile, as a fraction of the tile's own box.
 * Taken straight from the Figma layer offsets so the label and counter dot
 * land on the glyph rather than on the background.
 */
export type TilePoint = { x: number; y: number };

/** Artwork revealed inside a letter on hover. */
export type ServiceMedia =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

export type Service = {
  id: string;
  /** The oversized Modak character that forms the tile. */
  letter: string;
  title: string;
  fill: ServiceFill;
  label: TilePoint;
  /** Omitted where the glyph itself carries the artwork. */
  dot?: TilePoint;
  /** Shown through the glyph on hover. Omit for a letter with no reveal. */
  media?: ServiceMedia;
};

/** Reading across the grid the letters spell the second half of the brand. */
export const services: Service[] = [
  {
    id: "brand-identity",
    letter: "p",
    title: "Brand Identity",
    fill: "photo",
    label: { x: 0.147, y: 0.561 },
    dot: { x: 0.084, y: 0.198 },
    media: { type: "image", src: "/assets/service-photo.png" },
  },
  {
    id: "ui-ux-design",
    letter: "o",
    title: "UI/UX Design",
    fill: "photo",
    label: { x: 0.339, y: 0.632 },
    media: { type: "video", src: "/assets/videos/snackbar-video.mp4" },
  },
  {
    id: "digital-marketing",
    letter: "p",
    title: "Digital Marketing",
    fill: "photo",
    label: { x: 0.157, y: 0.534 },
    dot: { x: 0.071, y: 0.198 },
    media: { type: "image", src: "/assets/featured-snackbar.webp" },
  },
  {
    id: "web-development",
    letter: "e",
    title: "Web Development",
    fill: "grape",
    label: { x: 0.147, y: 0.708 },
    dot: { x: 0.067, y: 0.316 },
    media: { type: "image", src: "/assets/hero-band.png" },
  },
  {
    id: "motion-graphic",
    letter: "r",
    title: "Motion Graphic",
    fill: "photo",
    label: { x: 0.216, y: 0.51 },
    dot: { x: 0.06, y: 0.166 },
    media: { type: "video", src: "/assets/videos/snackbar-video.mp4" },
  },
  {
    id: "content-writing",
    letter: "s",
    title: "Content Writing",
    fill: "sunbeam",
    label: { x: 0.183, y: 0.773 },
    dot: { x: 0.525, y: 0.43 },
    media: { type: "image", src: "/assets/brand-folder.png" },
  },
];

export type Client = {
  name: string;
  src: string;
  width: number;
  height: number;
  /**
   * Some marks are exported as light-on-transparent artwork. Figma paints
   * them by using the export as an alpha mask over a solid colour — this
   * reproduces that so the logo stays legible on a white card.
   */
  tint?: string;
  /** Per-card tilt, in degrees, echoing the scattered Figma layout. */
  rotate: number;
};

export const clients: Client[] = [
  {
    name: "Habitat Pool & Landscape",
    src: "/assets/clients/habitat-pool-landscape.png",
    width: 400,
    height: 126,
    rotate: -7.4,
  },
  {
    name: "October Glory",
    src: "/assets/clients/october-glory.png",
    width: 400,
    height: 170,
    rotate: 5.2,
  },
  {
    name: "Vision Infinie",
    src: "/assets/clients/vision-infinie.webp",
    width: 400,
    height: 214,
    tint: "#c5b8a5",
    rotate: -12.6,
  },
  {
    name: "AVLI",
    src: "/assets/clients/avli.webp",
    width: 400,
    height: 192,
    tint: "#202020",
    rotate: 6.8,
  },
  {
    name: "Snack Bar",
    src: "/assets/clients/snack-bar.png",
    width: 400,
    height: 260,
    rotate: -4.1,
  },
  {
    name: "Beba Yerba",
    src: "/assets/clients/beba-yerba.png",
    width: 400,
    height: 400,
    rotate: 8.3,
  },
  {
    name: "Olivée Beauty",
    src: "/assets/clients/olivee-beauty.png",
    width: 400,
    height: 96,
    rotate: -9.5,
  },
  {
    name: "SQFT Expert",
    src: "/assets/clients/sqft-expert.webp",
    width: 400,
    height: 199,
    tint: "#2f2e2e",
    rotate: 3.6,
  },
  {
    name: "Boditemple",
    src: "/assets/clients/boditemple.webp",
    width: 400,
    height: 182,
    tint: "#0c2cac",
    rotate: -13.9,
  },
  {
    name: "EquaVita Home Watch",
    src: "/assets/clients/equavita.png",
    width: 400,
    height: 300,
    rotate: 11.2,
  },
  {
    name: "HIYD",
    src: "/assets/clients/hiyd.webp",
    width: 400,
    height: 163,
    tint: "#282828",
    rotate: -6.3,
  },
  {
    name: "Citrus Urgent Care",
    src: "/assets/clients/citrus-urgent-care.png",
    width: 400,
    height: 110,
    rotate: 7.9,
  },
  {
    name: "Dr. Clean Laundry",
    src: "/assets/clients/dr-clean-laundry.png",
    width: 400,
    height: 434,
    rotate: -3.2,
  },
  {
    name: "CGG",
    src: "/assets/clients/cgg.webp",
    width: 400,
    height: 284,
    tint: "#000000",
    rotate: 12.9,
  },
  {
    name: "Dilli’s",
    src: "/assets/clients/dillis.svg",
    width: 179,
    height: 98,
    rotate: -8.7,
  },
  {
    name: "MG Boost",
    src: "/assets/clients/mg-boost.svg",
    width: 76,
    height: 30,
    rotate: 4.4,
  },
  {
    name: "CW Agency",
    src: "/assets/clients/cw-agency.svg",
    width: 67,
    height: 50,
    rotate: -10.8,
  },
];

export type Project = {
  id: string;
  /** Used for the tile's accessible label; not rendered as visible text. */
  title: string;
  /** Muted, looping clip played while the tile is centred in the carousel. */
  video: string;
  /**
   * Base layer of the tile — shown before the clip is ready and on off-centre
   * tiles: a 960px WebP still from the clip (`public/assets/posters`), so no
   * video loads until one plays. Without one, the tile keeps its video
   * mounted and shows its first frame.
   */
  /** `small`: a 540px copy for `<video poster>`, which no image optimiser resizes. */
  poster?: { src: string; small: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    id: "snackbar",
    title: "Snackbar — bold flavor meets cutting edge tech",
    video: "/assets/videos/snackbar-video.mp4",
    poster: { src: "/assets/posters/snackbar-video.webp", small: "/assets/posters/snackbar-video-sm.webp", width: 960, height: 540 },
  },
  {
    id: "habitat-pools",
    title: "Habitat Pools",
    video: "/assets/videos/habitat-pools.mp4",
    poster: { src: "/assets/posters/habitat-pools.webp", small: "/assets/posters/habitat-pools-sm.webp", width: 960, height: 540 },
  },
  {
    id: "october-glory",
    title: "October Glory",
    video: "/assets/videos/october-glory.mp4",
    poster: { src: "/assets/posters/october-glory.webp", small: "/assets/posters/october-glory-sm.webp", width: 960, height: 540 },
  },
  {
    id: "the-reserve",
    title: "The Reserve",
    video: "/assets/videos/the-reserve.mp4",
    poster: { src: "/assets/posters/the-reserve.webp", small: "/assets/posters/the-reserve-sm.webp", width: 960, height: 540 },
  },
  {
    id: "threshold-design-lab",
    title: "Threshold Design Lab",
    video: "/assets/videos/thres-hold-design-lab.mp4",
    poster: { src: "/assets/posters/thres-hold-design-lab.webp", small: "/assets/posters/thres-hold-design-lab-sm.webp", width: 960, height: 540 },
  },
  {
    id: "aw",
    title: "AW",
    video: "/assets/videos/aw-video.mp4",
    poster: { src: "/assets/posters/aw-video.webp", small: "/assets/posters/aw-video-sm.webp", width: 960, height: 494 },
  },
];

export type Owner = {
  name: string;
  role: string;
  /** Placeholder until real headshots land. */
  avatar: string;
  /** Ring colour around the avatar — one of the brand palette tokens. */
  accent: "blush" | "lagoon" | "sunbeam";
  /** Per-card tilt, in degrees, matching the scattered client cards. */
  rotate: number;
};

export const owners: Owner[] = [
  {
    name: "Adan J.",
    role: "Partner & Technical Lead",
    avatar: "/assets/images/adan-j.png",
    accent: "sunbeam",
    rotate: -1.2,
  },
  {
    name: "James Allen",
    role: "Co-Founder & Head of Strategy",
    avatar: "/assets/images/james-allen.png",
    accent: "lagoon",
    rotate: 1.8,
  },
  {
    name: "Barry Allen",
    role: "Founder & Creative Director",
    avatar: "/assets/images/barry-allen.png",
    accent: "blush",
    rotate: -2.5,
  },
];

export type StudioStat = {
  value: number;
  suffix: string;
  label: string;
};

export const studioStats: StudioStat[] = [
  { value: 8, suffix: "+", label: "Years Popping" },
  { value: 120, suffix: "+", label: "Brands Launched" },
  { value: 17, suffix: "", label: "Long-Term Partners" },
];
