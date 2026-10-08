import gsap from "gsap";

/** Scoped selector returned by `gsap.utils.selector`. */
export type Q = (selector: string) => Element[];

/** Resting yaw of a doodle, from its `data-rotate`. */
export const settleRotation = (_i: number, el: Element) =>
  Number((el as HTMLElement).dataset.rotate ?? 0);

/** Reduced motion still has to reveal the copy — the markup ships hidden. */
export function revealStatic(q: Q) {
  gsap.set(q("[data-hero='line']"), { autoAlpha: 1 });
  gsap.set(q("[data-hero='doodle']"), { autoAlpha: 1, rotation: settleRotation });
}
