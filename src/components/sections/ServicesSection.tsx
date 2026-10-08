"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type CSSProperties } from "react";

import ServiceTile from "@/components/ui/ServiceTile";
import { CUBE_TRAVEL_VH, STUDIO_EXIT_VH, STUDIO_UNWIND_VH } from "@/components/ui/studio-cube-motion";
import { services } from "@/lib/site-content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Q = (selector: string) => Element[];

/** Tint of each letter's burst, in grid order (P O P / E R S). */
const TONES = ["blush", "lagoon", "sunbeam", "grape", "blush", "lagoon"] as const;

/** Stable pseudo-random 0–1 per index, so the confetti is the same every time. */
const rand = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * The services letters (P O P / E R S). The section is tucked up under the
 * Studio section and its grid pinned there, so as the Studio content plays
 * out, the top row is already on that screen: once the Studio cube has
 * popped, the top row's bubbles swell and pop right there; the rest pop as
 * they scroll up into view after the pin lets go (see `bubblePop`).
 */
export default function ServicesSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Bursts sit on the letters themselves; re-placed whenever the grid
        // resizes (which includes the display font swapping in).
        placeBursts(q);
        const grid = q("[data-service='grid']")[0];
        const observer = new ResizeObserver(() => placeBursts(q));
        if (grid) observer.observe(grid);

        bubblePop(q, section);

        return () => observer.disconnect();
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      id="services"
      ref={rootRef}
      // Tucked up under the Studio section so the grid's top row is already
      // on its exit screen (invisible) as the Studio content plays out — only
      // with motion; under reduced motion nothing pins, so nothing overlaps.
      className="shell py-[clamp(3rem,7vw,8rem)] motion-safe:-mt-[var(--tuck)]"
      aria-label="Our services"
      style={{ "--tuck": `${CUBE_TRAVEL_VH + STUDIO_EXIT_VH}vh` } as CSSProperties}
    >
      <h2 className="sr-only">Our services</h2>
      {/* Held (sticky) on that screen while the top row's bubbles pop. */}
      <div className="top-[clamp(3rem,7vw,8rem)] motion-safe:sticky">
        <div
          data-service="grid"
          className="grid grid-cols-1 gap-x-[clamp(1rem,4vw,5rem)] gap-y-[clamp(1rem,3vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <ServiceTile
              key={service.id}
              service={service}
              fxTone={TONES[i % TONES.length]}
            />
          ))}
        </div>
      </div>
      {/* The stretch of scroll the grid stays pinned for. */}
      <div aria-hidden className="motion-reduce:hidden" style={{ height: `${STUDIO_EXIT_VH}vh` }} />
    </section>
  );
}

/**
 * Centres each tile's burst on its letter and sizes the bubble to it. Offset
 * metrics, so this is right even while the letters are mid-animation.
 */
function placeBursts(q: Q) {
  q("[data-service='tile']").forEach((tile) => {
    const glyph = tile.querySelector<HTMLElement>("[data-service='glyph']");
    const fx = tile.querySelector<HTMLElement>("[data-service='fx']");
    if (!glyph || !fx) return;
    // The glyph's line box is taller than the letter's ink (Modak sits low in
    // it), so the visual centre is a little above the box's middle.
    const x = glyph.offsetLeft + glyph.offsetWidth / 2;
    const y = glyph.offsetTop + glyph.offsetHeight * 0.47;
    const size = Math.min(glyph.offsetWidth, glyph.offsetHeight * 0.72) * 1.05;
    fx.style.setProperty("--fx-x", `${x}px`);
    fx.style.setProperty("--fx-y", `${y}px`);
    fx.style.setProperty("--fx-size", `${size}px`);
  });
}

/**
 * Confetti flying out from a tile's burst point: tweens for a timeline.
 * Shown by a `set` at the burst moment rather than a `fromTo`, whose start
 * state would render up front and leave the pieces sitting visibly in the
 * middle of the letter before anything happens (and again on scrolling back).
 */
function sprayConfetti(tl: gsap.core.Timeline, tile: Element, at: number, reach = 0.75) {
  const pieces = Array.from(tile.querySelectorAll<HTMLElement>("[data-service='particle']"));
  const width = (tile as HTMLElement).offsetWidth;
  tl.set(pieces, { x: 0, y: 0, rotation: 0, scale: 1.2, autoAlpha: 1 }, at).to(
    pieces,
    {
      x: (i) => Math.cos((i / pieces.length) * Math.PI * 2 + rand(i) * 0.6) * width * reach * (0.6 + rand(i, 2) * 0.5),
      y: (i) => Math.sin((i / pieces.length) * Math.PI * 2 + rand(i) * 0.6) * width * reach * (0.6 + rand(i, 2) * 0.5),
      rotation: (i) => (rand(i, 3) - 0.5) * 540,
      scale: 0.3,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
    },
    at,
  );
}

/** A shockwave ring from a tile's burst point — hidden until `at`, like the confetti. */
function shockwave(tl: gsap.core.Timeline, tile: Element, at: number, from: number, to: number, duration: number) {
  const ring = tile.querySelector("[data-service='ring']");
  tl.set(ring, { scale: from, autoAlpha: 1 }, at).to(
    ring,
    { scale: to, autoAlpha: 0, duration, ease: "power2.out" },
    at,
  );
}

/** The label sliding up and the grey dot popping, after the letter. */
function settleDetails(tl: gsap.core.Timeline, tile: Element, at: number) {
  tl.fromTo(
    tile.querySelector("[data-service='label']"),
    { y: 24, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
    at,
  );
  const dot = tile.querySelector("[data-service='dot']");
  if (dot) {
    tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2.6)" }, at + 0.08);
  }
}

/* ── Bubble pop: each letter waits in a bubble that swells, wobbles and pops ── */

const vh = (n: number) => (n / 100) * window.innerHeight;

/** Where the pop lands in each letter's bubble sequence. */
const POP = 1.5;

/**
 * One letter's bubble sequence on a timeline, starting at `at`: the bubble
 * inflates over the letter, strains with a growing wobble, then pops with a
 * ring and droplets, and the letter springs out; the label and dot follow.
 */
function addBubble(tl: gsap.core.Timeline, tile: Element, at: number) {
  const bubble = tile.querySelector("[data-service='bubble']");
  tl.fromTo(bubble, { scale: 0, autoAlpha: 1 }, { scale: 1, duration: 0.6, ease: "back.out(1.6)" }, at)
    .to(
      bubble,
      {
        keyframes: [
          { scaleX: 1.05, scaleY: 0.96, duration: 0.2, ease: "sine.inOut" },
          { scaleX: 0.97, scaleY: 1.04, duration: 0.2, ease: "sine.inOut" },
          { scaleX: 1.08, scaleY: 0.93, duration: 0.18, ease: "sine.inOut" },
          { scaleX: 0.95, scaleY: 1.07, duration: 0.16, ease: "sine.inOut" },
          { scaleX: 1.1, scaleY: 1.1, duration: 0.16, ease: "power1.in" },
        ],
      },
      at + 0.6,
    )
    .to(bubble, { scale: 1.35, autoAlpha: 0, duration: 0.1, ease: "power2.out" }, at + POP)
    .fromTo(
      tile.querySelector("[data-service='glyph']"),
      { scale: 0.4, autoAlpha: 0, transformOrigin: "50% 47%" },
      { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2.6)" },
      at + POP,
    );
  shockwave(tl, tile, at + POP, 0.6, 1.8, 0.45);
  sprayConfetti(tl, tile, at + POP, 0.6);
  settleDetails(tl, tile, at + POP + 0.3);
}

/**
 * Tied to scroll. The top row takes over the Studio section's exit screen:
 * the grid is pinned underneath the Studio stage, and once the Studio content
 * has played out and the cube has popped, the top row's bubbles swell and pop
 * right there (a little staggered). The rest of the letters do the same as
 * they scroll up into view after the pin lets go. Scrolling back reverses it
 * all, frame for frame.
 */
function bubblePop(q: Q, section: HTMLElement) {
  const tiles = q("[data-service='tile']") as HTMLElement[];
  if (!tiles.length) return;
  // The top row: however many tiles share the first tile's row at this width.
  const firstRowTop = tiles[0].offsetTop;
  const topRow = tiles.filter((tile) => tile.offsetTop === firstRowTop);
  const rest = tiles.filter((tile) => tile.offsetTop !== firstRowTop);

  // Top row: on the pinned exit screen, after the Studio content has gone.
  const pinnedTl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: `top -${STUDIO_UNWIND_VH}%`,
      end: `top -${STUDIO_EXIT_VH}%`,
      scrub: 0.6,
    },
  });
  topRow.forEach((tile, i) => addBubble(pinnedTl, tile, i * 0.18));

  // The rest: as each scrolls up into view. Their triggers are measured where
  // the tiles sit at rest (the grid un-pinned), so they are shifted by the
  // pinned stretch — the grid ends up that much lower once it lets go.
  // While the grid is pinned the next row already peeks in at the bottom of
  // the screen, so its bubbles also wait for the pin to let go.
  const release = () => section.getBoundingClientRect().top + window.scrollY + vh(STUDIO_EXIT_VH);
  rest.forEach((tile) => {
    const restingTop = () => tile.getBoundingClientRect().top + window.scrollY + vh(STUDIO_EXIT_VH);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        start: () => Math.max(release(), restingTop() - window.innerHeight),
        end: () => restingTop() - vh(12),
        scrub: 0.6,
      },
    });
    addBubble(tl, tile, 0);
  });
}
