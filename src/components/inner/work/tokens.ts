import type { Accent } from "@/lib/pages/work";

/** Literal class names per accent so Tailwind can see them. */
export const accentBg: Record<Accent, string> = {
  blush: "bg-blush",
  grape: "bg-grape",
  lagoon: "bg-lagoon",
  sunbeam: "bg-sunbeam",
  lav: "bg-lav",
};

/** Text colour that reads on each accent fill (Figma uses ink on sunbeam). */
export const onAccent: Record<Accent, string> = {
  blush: "text-white",
  grape: "text-white",
  lagoon: "text-white",
  sunbeam: "text-ink",
  lav: "text-ink",
};

/** Figma card shadow: 0 20 50 at ~15% ink. */
export const cardShadow = "shadow-[0_clamp(0.75rem,1.04vw,1.25rem)_clamp(1.75rem,2.6vw,3.125rem)_rgb(34_1_40/0.15)]";

/** 1680px-wide Figma blocks sit 120px from the frame edge rather than the 166px shell. */
export const wide = "mx-auto w-full max-w-[1920px] px-[clamp(1.25rem,6.25vw,7.5rem)]";

export const SITE = "https://pixelpopers.vercel.app";
