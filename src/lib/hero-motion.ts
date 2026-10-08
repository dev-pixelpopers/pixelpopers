/** Timings for the hero blob (`components/ui/HeroBlob.tsx`). */
export const HERO_MOTION = {
  /** Time for the blob to trace itself into view; it lands with the headline. */
  blobDraw: 2.4,
  /** Cross-fade of the blob group from hidden to its design opacity. */
  blobFade: 0.7,
  /** Design opacity of the blob group (the SVG's own `opacity` attribute). */
  blobOpacity: 0.5,
  /** Base orientation of the blob artwork, in degrees. */
  blobRotation: 90,
} as const;
