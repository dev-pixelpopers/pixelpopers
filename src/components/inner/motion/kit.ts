import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  Shared scroll-motion pieces for the inner pages (Work, Services…). Pages mark
  their markup with `data-wm="…"` (and split headings with SplitWords
  `name="wm-words"`); a page's motion component wires these up. Everything is
  scrubbed, so scrolling back plays it backwards, and nothing ships hidden —
  start states are set here, only when motion is allowed.
*/

/** Stable pseudo-random 0–1 per index. */
export const rand = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Scope = Element | Document;
export const all = (scope: Scope, sel: string) => Array.from(scope.querySelectorAll<HTMLElement>(sel));
export const one = (scope: Scope, sel: string) => scope.querySelector<HTMLElement>(sel);

/**
 * The element whose position should time `el`'s animation: `el` itself, or —
 * for a sticky element, whose measured position drifts with the scroll — its
 * nearest non-sticky ancestor.
 */
function timingTarget(el: Element) {
  let node: Element | null = el;
  while (node && node.parentElement && getComputedStyle(node).position === "sticky") node = node.parentElement;
  return node ?? el;
}

type Edge = string | (() => string);

/**
 * A timeline scrubbed while `trigger` travels between `start` and `end`.
 * Keep the window short (entering → settled well before mid-screen), so a
 * thing is done animating by the time it's being read.
 */
export const scrubbed = (trigger: Element, start: Edge, end: Edge) =>
  gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: timingTarget(trigger), start, end, scrub: 0.5, invalidateOnRefresh: true },
  });

/** The standard window: starts as the element's top enters, done by ~70% down the screen. */
export const ENTER = "top 94%";
export const SETTLED = "top 70%";

/**
 * Column of `el` among its siblings on the same row (0 = leftmost), so items
 * on one row can enter left to right while each row still times itself.
 */
export function columnOf(el: HTMLElement) {
  const parent = el.parentElement;
  if (!parent) return 0;
  const row = (Array.from(parent.children) as HTMLElement[]).filter((s) => Math.abs(s.offsetTop - el.offsetTop) < 4);
  return Math.max(0, row.indexOf(el));
}

/**
 * Scrubbed per item: each item gets its own window, timed by its own
 * position (with a small left-to-right offset along its row), so a grid's
 * lower rows don't wait on the grid's top edge.
 */
export function perItem(items: HTMLElement[], build: (tl: gsap.core.Timeline, item: HTMLElement, i: number) => void) {
  items.forEach((item, i) => {
    const tl = scrubbed(
      item,
      () => `top ${96 - columnOf(item) * 4}%`,
      () => `top ${72 - columnOf(item) * 4}%`,
    );
    build(tl, item, i);
  });
}

/**
 * A `[data-wm='heading']` block: the eyebrow drops in, then the heading's
 * split words rise through their masks — or, for a heading that isn't split,
 * the whole title rises and untilts.
 */
export function headingIn(block: HTMLElement) {
  const tl = scrubbed(block, "top 92%", "top 68%");
  tl.fromTo(one(block, "[data-wm='eyebrow']"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0);
  const words = all(block, "[data-split='wm-words']");
  if (words.length) {
    tl.fromTo(words, { yPercent: 115, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 0.7, stagger: 0.08, ease: "back.out(1.6)" }, 0.15);
  } else {
    tl.fromTo(
      one(block, "[data-wm='title']"),
      { y: 60, rotation: 3, autoAlpha: 0 },
      { y: 0, rotation: 0, autoAlpha: 1, duration: 0.7, ease: "back.out(1.6)" },
      0.15,
    );
  }
  const lead = one(block, "[data-wm='lead']");
  if (lead) tl.fromTo(lead, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.5);
}

/**
 * A ring and a spray of confetti from a `[data-wm='burst']` at `at` — shown
 * by `set`s at that moment, so nothing of it sits visible beforehand (or
 * after scrolling back above it).
 */
export function burst(tl: gsap.core.Timeline, el: Element | null, at: number, reach = 90) {
  if (!el) return;
  const ring = one(el, "[data-wm='burst-ring']");
  const pieces = all(el, "[data-wm='burst-piece']");
  tl.set(ring, { scale: 0.3, opacity: 1 }, at)
    .to(ring, { scale: 1.8, opacity: 0, duration: 0.4, ease: "power2.out" }, at)
    .set(pieces, { x: 0, y: 0, rotation: 0, scale: 1.2, opacity: 1 }, at)
    .to(
      pieces,
      {
        x: (i) => Math.cos((i / pieces.length) * Math.PI * 2 + rand(i) * 0.6) * reach * (0.6 + rand(i, 2) * 0.6),
        y: (i) => Math.sin((i / pieces.length) * Math.PI * 2 + rand(i) * 0.6) * reach * (0.6 + rand(i, 2) * 0.6),
        rotation: (i) => (rand(i, 3) - 0.5) * 600,
        scale: 0.3,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      },
      at,
    );
}

/**
 * A hop with squash and stretch for something already on screen — the
 * heroes' headline entrance. Transform-only on purpose: the headline is the
 * page's Largest Contentful Paint, and anything hidden until JavaScript runs
 * would hold LCP back until the animation (seconds on a slow phone).
 */
export const POP_WAVE: gsap.TweenVars[] = [
  { yPercent: -30, scaleX: 0.9, scaleY: 1.14, duration: 0.18, ease: "power2.out" },
  { yPercent: 0, scaleX: 1.12, scaleY: 0.86, duration: 0.14, ease: "power2.in" },
  { scaleX: 1, scaleY: 1, duration: 0.45, ease: "elastic.out(1, 0.45)" },
];

/** Squash-and-stretch pop for something that starts at scale 0 (set up front). */
export const squashPop = (duration = 0.6) => ({
  keyframes: [
    { scaleX: 1.3, scaleY: 0.7, autoAlpha: 1, duration: duration * 0.3, ease: "power2.out" },
    { scaleX: 0.88, scaleY: 1.15, duration: duration * 0.25, ease: "power1.inOut" },
    { scaleX: 1, scaleY: 1, duration: duration * 0.45, ease: "elastic.out(1, 0.5)" },
  ],
});

/** "94+" → 94 / "+" ; "3.2×" → 3.2 / "×". */
export function parseStat(text: string) {
  const m = text.match(/^([\d.]+)(.*)$/);
  const value = m ? Number(m[1]) : 0;
  const decimals = m && m[1].includes(".") ? m[1].split(".")[1].length : 0;
  return { value, decimals, suffix: m ? m[2] : text };
}

/**
 * Stats in `stats` (`[data-wm='stat']`, each with a `[data-wm='stat-value']`
 * carrying `data-value`, an optional `[data-wm='stat-label']` and `burst`):
 * each value squash-pops while it counts up, its label rises, and it bursts.
 * Added to `tl` from `at`. Returns a cleanup that restores the real text.
 */
export function popStats(tl: gsap.core.Timeline, stats: HTMLElement[], at: number, reach = 110) {
  const values = stats.map((s) => one(s, "[data-wm='stat-value']")).filter((v): v is HTMLElement => Boolean(v));
  gsap.set(values, { scale: 0, autoAlpha: 0 });
  stats.forEach((stat, i) => {
    const value = values[i];
    if (!value) return;
    const t = at + i * 0.22;
    const { value: target, decimals, suffix } = parseStat(value.dataset.value ?? value.textContent ?? "");
    const counter = { n: 0 };
    tl.to(value, squashPop(0.7), t).to(
      counter,
      {
        n: target,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          value.textContent = `${counter.n.toFixed(decimals)}${suffix}`;
        },
      },
      t,
    );
    const label = one(stat, "[data-wm='stat-label']");
    if (label) tl.fromTo(label, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, t + 0.15);
    burst(tl, one(stat, "[data-wm='burst']"), t + 0.18, reach);
  });
  // The counters write text, which reverting can't undo.
  return () => values.forEach((v) => (v.textContent = v.dataset.value ?? v.textContent));
}

/** A `[data-wm='band']` stretches open from a pill, then its stats pop. */
export function statsBand(band: HTMLElement) {
  const tl = scrubbed(band, "top 92%", "top 45%");
  tl.fromTo(
    band,
    { clipPath: "inset(0% 44% 0% 44% round 999px)" },
    { clipPath: "inset(0% 0% 0% 0% round 48px)", duration: 0.8, ease: "power3.inOut" },
    0,
  );
  return popStats(tl, all(band, "[data-wm='stat']"), 0.7);
}

/** Quote cards (`[data-wm='quote']`): fly in from the sides spinning to their tilt; marks and avatars pop. */
export function quoteCards(section: HTMLElement) {
  const items = all(section, "[data-wm='quote']");
  if (!items.length) return;
  const marks = all(section, "[data-wm='mark']");
  gsap.set(marks, { scale: 0, autoAlpha: 0, transformOrigin: "50% 80%" });
  const wide = window.matchMedia("(min-width: 64rem)").matches;
  const tl = scrubbed(items[0].parentElement!, "top 92%", "top 50%");
  tl.fromTo(
    items,
    {
      x: (i) => (wide ? [-1, 0, 1][i] ?? 0 : i % 2 ? 1 : -1) * innerWidth * 0.35,
      y: (i) => (wide && i === 1 ? 160 : 60),
      rotation: (i) => [-22, 12, 22][i] ?? 0,
      autoAlpha: 0,
    },
    { x: 0, y: 0, rotation: 0, autoAlpha: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
    0,
  );
  items.forEach((item, i) => {
    const at = 0.6 + i * 0.15;
    if (marks[i]) tl.to(marks[i], squashPop(0.6), at);
    tl.fromTo(one(item, "[data-wm='avatar']"), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)" }, at + 0.15)
      .fromTo(one(item, "[data-wm='byline']"), { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4 }, at + 0.25);
  });
}

/** Closing CTA: the heading's letters (`char`) bounce in, the copy rises, the button pops and bursts. */
export function closingCta(section: HTMLElement) {
  const btn = one(section, "[data-wm='cta-btn']");
  const tl = scrubbed(section, "top 90%", "top 50%");
  tl.fromTo(one(section, "[data-wm='eyebrow']"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0)
    .fromTo(
      all(section, "[data-wm='char']"),
      { yPercent: -160, autoAlpha: 0, rotation: (i) => (rand(i, 5) - 0.5) * 50, transformOrigin: "50% 100%" },
      { yPercent: 0, autoAlpha: 1, rotation: 0, duration: 0.7, stagger: 0.035, ease: "bounce.out" },
      0.1,
    )
    .fromTo(one(section, "[data-wm='cta-copy']"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.6);
  if (btn) {
    tl.fromTo(btn, { scale: 0, rotation: -25, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(2.4)" }, 1.0);
    burst(tl, btn.parentElement?.querySelector("[data-wm='burst']") ?? null, 1.2, 120);
  }
}

/** Paragraphs (`[data-wm='para']`) slide up one by one as each enters. */
export function paragraphs(scope: HTMLElement) {
  all(scope, "[data-wm='para']").forEach((p) => {
    scrubbed(p, ENTER, SETTLED).fromTo(p, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power2.out" });
  });
}

/**
 * Cards that tip up out of the floor in 3D — each timed by its own position
 * (see `perItem`) — with an optional number pill (`[data-wm='pill']`, beside
 * a `burst`) that squash-pops as the card lands. `extra` adds more to each
 * card's own timeline (from 0.5).
 */
export function tipInCards(list: HTMLElement, cardSel: string, extra?: (tl: gsap.core.Timeline, card: HTMLElement) => void) {
  const cards = all(list, cardSel);
  gsap.set(all(list, "[data-wm='pill']"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 60%" });
  perItem(cards, (tl, card, i) => {
    tl.fromTo(
      card,
      { y: 120, rotationX: -40, rotation: i % 2 ? 4 : -4, autoAlpha: 0, transformPerspective: 1100, transformOrigin: "50% 100%" },
      { y: 0, rotationX: 0, rotation: 0, autoAlpha: 1, duration: 1, ease: "power3.out" },
      0,
    );
    const pill = one(card, "[data-wm='pill']");
    if (pill) {
      tl.to(pill, squashPop(), 0.6);
      burst(tl, pill.parentElement?.querySelector("[data-wm='burst']") ?? null, 0.72, 60);
    }
    extra?.(tl, card);
  });
}
