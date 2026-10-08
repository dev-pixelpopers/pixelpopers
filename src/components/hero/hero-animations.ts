import type { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { settleRotation, type Q } from "@/components/hero/hero-shared";

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
 *   0.30  "We Make"       letters slide up through a mask
 *   0.55  sparkle doodle  springs in
 *   0.60  "Your Website"  letters drop from above, blur clearing as they land
 *   1.05  "Poppin'"       letters pop out of nothing with squash and stretch
 *   1.60  flower doodle   bursts in and throws a ring of sparks
 *   2.60  doodles         settle into a gentle endless wobble
 *
 * Call from a `(prefers-reduced-motion: no-preference)` branch. Returns the timeline; the
 * entrance has fully landed by `POP_LANDED` seconds (the idle wobble after
 * that repeats forever, so the timeline itself never completes).
 */
export function popEntrance(q: Q) {
  const line1 = q("[data-line='1'] [data-hero='char']");
  const line2 = q("[data-line='2'] [data-hero='char']");
  const line3 = q("[data-line='3'] [data-hero='char']");
  const [sparkle, flower] = q("[data-hero='doodle']");
  const sparks = q("[data-hero='spark']");

  // Line 1 rises through its own mask; the others need to overflow it.
  gsap.set(q("[data-line='1'] [data-hero='mask']"), { overflow: "hidden" });
  // Start states for the two keyframed tweens below (keyframes belong
  // to `.to()`, so their "from" is set up front).
  gsap.set(line3, { transformOrigin: "50% 100%", autoAlpha: 0, scaleX: 0, scaleY: 0 });
  gsap.set(flower, {
    autoAlpha: 0,
    scale: 0,
    rotation: (i: number, el: Element) => settleRotation(i, el) - 120,
  });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    line1,
    { yPercent: 110 },
    { yPercent: 0, duration: 0.7, stagger: 0.035, ease: "power4.out" },
    0.3,
  )
    .fromTo(
      sparkle,
      { autoAlpha: 0, scale: 0.4, rotation: (i, el) => settleRotation(i, el) - 45 },
      { autoAlpha: 1, scale: 1, rotation: settleRotation, duration: 0.8, ease: "back.out(2.2)" },
      0.55,
    )
    .fromTo(
      line2,
      {
        autoAlpha: 0,
        yPercent: -130,
        rotation: (i) => (i % 2 ? 9 : -9),
        filter: "blur(12px)",
      },
      {
        autoAlpha: 1,
        yPercent: 0,
        rotation: 0,
        filter: "blur(0px)",
        duration: 0.75,
        stagger: 0.04,
        ease: "back.out(1.7)",
        // Leaves no filter behind once landed — a lingering one would
        // keep each letter on its own compositing layer.
        clearProps: "filter",
      },
      0.6,
    )
    .to(
      line3,
      {
        keyframes: [
          { autoAlpha: 1, scaleX: 1.3, scaleY: 0.55, duration: 0.18, ease: "power2.out" },
          { scaleX: 0.85, scaleY: 1.22, duration: 0.14, ease: "power1.inOut" },
          { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" },
        ],
        stagger: 0.075,
      },
      1.05,
    )
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
    .to(sparks, { autoAlpha: 0, scale: 0, duration: 0.35, ease: "power1.in" }, 2.1)

    // Idle: the doodles never quite stop moving.
    .to(
      [sparkle, flower],
      {
        rotation: (i, el) => settleRotation(i, el) + 6,
        y: -8,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.7,
      },
      2.6,
    );

  // Lines are only containers here — the letters carry the reveal.
  gsap.set(q("[data-hero='line']"), { autoAlpha: 1 });

  return tl;
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
  // uses x/y/scale/filter and the *mask* opacity, so the two compose
  // instead of fighting over the same properties.
  const mask = (line: number) => q(`[data-line='${line}'] [data-hero='mask']`);

  tl.to(mask(1), { x: () => -innerWidth * 0.18, y: () => -innerHeight * 0.18, scale: 0.85, opacity: 0, filter: "blur(8px)" }, 0)
    .to(mask(2), { scale: 0.7, opacity: 0, filter: "blur(10px)" }, 0)
    .to(mask(3), { x: () => innerWidth * 0.22, scale: 0.9, opacity: 0, filter: "blur(8px)" }, 0)
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
