import type { Tone } from "@/lib/pages/blog";

/** Solid brand fill + readable text colour for each tone. */
export const toneFill: Record<Tone, string> = {
  blush: "bg-blush text-white",
  lagoon: "bg-lagoon text-white",
  sunbeam: "bg-sunbeam text-ink",
  grape: "bg-grape text-white",
};

export const toneBg: Record<Tone, string> = {
  blush: "bg-blush",
  lagoon: "bg-lagoon",
  sunbeam: "bg-sunbeam",
  grape: "bg-grape",
};

export const toneText: Record<Tone, string> = {
  blush: "text-blush",
  lagoon: "text-lagoon",
  sunbeam: "text-sunbeam",
  grape: "text-grape",
};

/** Figma card shadow: 0 16 40 rgb(34 1 40 / 0.12). */
export const cardShadow = "shadow-[0_16px_40px_rgb(34_1_40/0.12)]";
