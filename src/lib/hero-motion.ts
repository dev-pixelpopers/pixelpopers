/**
 * Shared timings for the hero entrance.
 *
 * The blob lives in `app/page.tsx` (it sits behind the hero *and* the carousel)
 * while the headline lives in `HeroSection`, so the sequence is driven by two
 * scoped `useGSAP` calls rather than one timeline. Keeping the numbers here is
 * what makes them read as a single cohesive run.
 *
 * Rough shape of the sequence, in seconds from mount:
 *
 *   0.00  blob begins tracing in
 *   0.45  headline lines start landing, staggered
 *   1.00  doodles spring in
 *   1.80  blob finishes; idle float begins
 */
export const HERO_MOTION = {
  /** Time for the blob to trace itself into view. */
  blobDraw: 10,
  /** Cross-fade of the blob group from hidden to its design opacity. */
  blobFade: 0.7,
  /** Design opacity of the blob group (the SVG's own `opacity` attribute). */
  blobOpacity: 0.5,
  /** Base orientation of the blob artwork, in degrees. */
  blobRotation: 90,

  /** When the headline starts, relative to mount. */
  linesStart: 0.45,
  lineDuration: 0.9,
  lineStagger: 0.12,

  /** When the decorative doodles spring in, relative to mount. */
  doodlesStart: 1,
  doodleDuration: 0.8,
  doodleStagger: 0.1,
} as const;
