import type { CSSProperties } from "react";

/**
 * The soft brand glow from Figma's "Ellipse 1" (grape → sunbeam → blush →
 * lagoon, heavily blurred), drawn with CSS instead of the exported SVG. The
 * SVG was a ~1,900px image with a 260px Gaussian blur filter: an extra request
 * that resized the hero when it arrived late (a 0.2 layout shift on desktop)
 * and an expensive paint. A square div with a gradient and a radial mask has
 * a fixed box from the first paint and costs nothing to draw.
 *
 * `falloff` is the radial mask (in `closest-side` units): the blurred circle's
 * soft edge, folded together with any fade the spot used to add on top.
 */
// Colours sampled from the rendered SVG: its blur blends the four brand
// bands into a dusty rose fading to grey-teal, so the bands themselves would
// read far too strong.
const GRADIENT =
  "linear-gradient(to bottom, #b58fa6 18%, #c49b8e 42%, #bba59c 54%, #a9bcbd 68%, #b8c6c2 84%)";

export const HERO_FALLOFF =
  "radial-gradient(circle closest-side, #000 0%, rgb(0 0 0 / 0.9) 30%, rgb(0 0 0 / 0.55) 50%, rgb(0 0 0 / 0.14) 70%, transparent 85%)";
export const STUDIO_FALLOFF =
  "radial-gradient(circle closest-side, #000 0%, rgb(0 0 0 / 0.9) 26%, rgb(0 0 0 / 0.5) 44%, rgb(0 0 0 / 0.12) 62%, transparent 76%)";

export default function GlowOrb({
  className = "",
  falloff = HERO_FALLOFF,
  ...props
}: { className?: string; falloff?: string } & Record<`data-${string}`, string>) {
  const style: CSSProperties = { backgroundImage: GRADIENT, maskImage: falloff, WebkitMaskImage: falloff };
  return <div aria-hidden className={`aspect-square ${className}`} style={style} {...props} />;
}
