import type { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { settleRotation, type Q } from "@/components/hero/hero-shared";
import { POP_WAVE } from "@/components/inner/motion/kit";

/** `@gsap/react` doesn't export this type; derive it from the hook. */
type ContextSafeFunc = ReturnType<typeof useGSAP>["contextSafe"];

/*
 * The hero's three motion pieces. They never touch the same property on the
 * same element:
 *   popEntrance    — letters, doodle artwork, sparks
 *   scrollHandOff  — line masks, doodle wrappers, blob wrapper, carousel stage
 *   letterBounce   — letters, armed only once the entrance has landed
 */

/**
 * "Pop" entrance, letter by letter:
 *
 * The headline itself is visible from the first paint (it's the LCP); its
 * letters hop in a squash-and-stretch wave, line by line:
 *   0.25  "We Make"
 *   0.55  sparkle doodle  springs in
 *   0.55  "Your Website"
 *   0.95  "Poppin'"
 *   1.60  flower doodle   bursts in and throws a ring of sparks
 *   (then `doodleIdle` — the doodles' endless wobble — takes over)
 *
 * Call from a `(prefers-reduced-motion: no-preference)` branch. Returns the
 * timeline; the entrance has fully landed by `POP_LANDED` seconds.
 */
export function popEntrance(q: Q) {
  const line1 = q("[data-line='1'] [data-hero='char']");
  const line2 = q("[data-line='2'] [data-hero='char']");
  const line3 = q("[data-line='3'] [data-hero='char']");
  const [sparkle, flower] = q("[data-hero='doodle']");
  const sparks = q("[data-hero='spark']");

  // The headline is on screen from the first paint — it is the page's
  // Largest Contentful Paint, so it is never hidden waiting for JavaScript;
  // the letters' entrance is a transform-only squash-and-stretch wave.
  gsap.set([...line1, ...line2, ...line3], { transformOrigin: "50% 100%" });
  // Start state for the flower's keyframed tween below (keyframes belong to
  // `.to()`, so its "from" is set up front).
  gsap.set(flower, {
    autoAlpha: 0,
    scale: 0,
    rotation: (i: number, el: Element) => settleRotation(i, el) - 120,
  });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(line1, { keyframes: POP_WAVE, stagger: 0.035 }, 0.25)
    .fromTo(
      sparkle,
      { autoAlpha: 0, scale: 0.4, rotation: (i, el) => settleRotation(i, el) - 45 },
      { autoAlpha: 1, scale: 1, rotation: settleRotation, duration: 0.8, ease: "back.out(2.2)" },
      0.55,
    )
    .to(line2, { keyframes: POP_WAVE, stagger: 0.035 }, 0.55)
    .to(line3, { keyframes: POP_WAVE, stagger: 0.06 }, 0.95)
    .to(
      flower,
      {
        keyframes: [
          { autoAlpha: 1, scale: 1.18, rotation: settleRotation, duration: 0.35, ease: "power3.out" },
          { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
        ],
      },
      1.6,
    )
    // Sparks fly out of the flower's centre in a ring, then wink out.
    .fromTo(
      sparks,
      { autoAlpha: 1, x: 0, y: 0, scale: 0 },
      {
        x: (_i, el) => sparkOffset(el, "x"),
        y: (_i, el) => sparkOffset(el, "y"),
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      },
      1.68,
    )
    .to(sparks, { autoAlpha: 0, scale: 0, duration: 0.35, ease: "power1.in" }, 2.1);

  // Lines are only containers here — the letters carry the reveal.
  gsap.set(q("[data-hero='line']"), { autoAlpha: 1 });

  return tl;
}

/**
 * The doodles' idle wobble, for once the entrance has landed. Paused: hand
 * it to `ambient()`, which only plays it after the visitor's first
 * interaction and while the hero is on screen.
 */
export function doodleIdle(q: Q) {
  const [sparkle, flower] = q("[data-hero='doodle']");
  return gsap.to([sparkle, flower], {
    rotation: (i, el) => settleRotation(i, el) + 6,
    y: -8,
    duration: 2.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    stagger: 0.7,
    paused: true,
  });
}

/** Seconds into `popEntrance` by which every letter has settled. */
export const POP_LANDED = 2.3;

/** Spark travel along its `data-angle`, scaled to the flower's own size. */
function sparkOffset(el: Element, axis: "x" | "y") {
  const angle = (Number((el as HTMLElement).dataset.angle ?? 0) * Math.PI) / 180;
  const radius = ((el.parentElement as HTMLElement | null)?.offsetWidth ?? 200) * 0.75;
  return (axis === "x" ? Math.cos(angle) : Math.sin(angle)) * radius;
}

/**
 * Scroll hand-off into the carousel. Over the scroll it takes the headline to
 * leave the screen — until the carousel reaches the top and sticks — the lines
 * split apart and blur ("We Make" up-left, "Your Website" sinks back,
 * "Poppin'" off to the right), the doodles fly further out, the blob swells
 * and turns as it fades, and the carousel stage rises from behind the
 * headline to full size exactly as it sticks.
 *
 * Call from a `(prefers-reduced-motion: no-preference)` branch. Owns the masks,
 * doodle wrappers, blob wrapper and carousel stage — never the lines, letters
 * or doodle artwork, which belong to the entrance.
 */
export function scrollHandOff(q: Q) {
  const headline = q("[data-hero-frame='headline']")[0] as HTMLElement;
  // The carousel's sticky stage. Its ring has its own GSAP owner; only
  // the stage itself is transformed here.
  const stage = q("#work > div")[0] as HTMLElement | undefined;

  // Every tween starts at 0, so invalidating on refresh re-renders all
  // of them — none is left waiting for the playhead.
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: headline,
      start: "top top",
      // Ends as the carousel's top reaches the top of the viewport.
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // The entrance owns yPercent/autoAlpha on the lines; the hand-off
  // uses x/y/scale and the *mask* opacity, so the two compose
  // instead of fighting over the same properties.
  const mask = (line: number) => q(`[data-line='${line}'] [data-hero='mask']`);

  tl.to(mask(1), { x: () => -innerWidth * 0.18, y: () => -innerHeight * 0.18, scale: 0.85, opacity: 0 }, 0)
    .to(mask(2), { scale: 0.7, opacity: 0 }, 0)
    .to(mask(3), { x: () => innerWidth * 0.22, scale: 0.9, opacity: 0 }, 0)
    .to(
      q("[data-hero='doodle-wrap']"),
      {
        x: (i) => (i === 0 ? -1 : 1) * innerWidth * 0.3,
        y: (i) => (i === 0 ? -0.25 : 0.1) * innerHeight,
        opacity: 0,
      },
      0,
    )
    .to(q("[data-hero-frame='blob']"), { scale: 1.3, rotation: 25, opacity: 0 }, 0);

  if (stage) {
    tl.fromTo(
      stage,
      {
        // Starts tucked up behind the headline, small and hidden.
        y: () => -headline.offsetHeight * 0.55,
        scale: 0.45,
        autoAlpha: 0,
      },
      { y: 0, scale: 1, autoAlpha: 1, ease: "power1.out" },
      0,
    );
  }
}

/**
 * Every letter bounces with a squash and stretch when hovered. Call from a
 * branch gated on a hover-capable pointer and motion. Returns the listener cleanup.
 */
export function letterBounce(q: Q, contextSafe: ContextSafeFunc) {
  // Each hover runs its own short tween and a new hover restarts it, so
  // rapid passes never stack up.
  const chars = q("[data-hero='char']");
  gsap.set(chars, { transformOrigin: "50% 100%" });
  const bounce = contextSafe((event: Event) => {
    gsap.to(event.currentTarget as Element, {
      keyframes: [
        { yPercent: -32, scaleX: 0.9, scaleY: 1.12, duration: 0.18, ease: "power2.out" },
        { yPercent: 0, scaleX: 1.14, scaleY: 0.84, duration: 0.16, ease: "power2.in" },
        { scaleX: 1, scaleY: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" },
      ],
      overwrite: true,
    });
  });

  chars.forEach((char) => char.addEventListener("pointerenter", bounce));
  return () => chars.forEach((char) => char.removeEventListener("pointerenter", bounce));
}
