/** Timings for the hero blob (`components/ui/HeroBlob.tsx`). */
export const HERO_MOTION = {
  /** Base time for the blob's reveal (it fades and scales in over 60% of it). */
  blobDraw: 2.4,
  /** Design opacity of the blob group (the SVG's own `opacity` attribute). */
  blobOpacity: 0.5,
  /** Base orientation of the blob artwork, in degrees. */
  blobRotation: 90,
} as const;
