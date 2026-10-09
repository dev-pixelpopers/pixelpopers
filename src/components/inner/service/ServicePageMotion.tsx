"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import {
  all,
  burst,
  closingCta,
  ENTER,
  POP_WAVE,
  headingIn,
  one,
  paragraphs,
  perItem,
  popStats,
  scrubbed,
  SETTLED,
  squashPop,
  tipInCards,
} from "@/components/inner/motion/kit";
import { idleSetup } from "@/lib/defer-setup";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
  The shared motion layer of every service detail page (the six concept
  pages keep their own effects — typing, floats, strikes, gauges… — on top).

  - The hero, found by its `#hero-title`, works on whatever markup the concept
    uses: on load the headline lines hop in a squash-and-stretch wave and the
    rest settles into place — transform-only, since the hero holds the page's
    Largest Contentful Paint and must be visible from the first paint; on
    scroll the lines split apart and the hero eases away.
  - Every `data-reveal` block rises and untilts, every `data-reveal-stagger`
    group's children tip up in 3D — scrubbed, so they play backwards on the
    way up. Headings (`data-wm="heading"`) rise word by word instead.
  - The shared long-form and closing blocks have their own pieces below.
*/

/** The concept hero: entrance on load, exit on scroll. */
function hero(scope: HTMLElement) {
  const h1 = one(scope, "#hero-title");
  const section = h1?.closest("section");
  if (!h1 || !section) return;
  const lines = Array.from(h1.children).filter((el) => !el.classList.contains("sr-only")) as HTMLElement[];
  const textCol = h1.parentElement!;
  const kids = Array.from(textCol.children) as HTMLElement[];
  const at = kids.indexOf(h1);
  const before = kids.slice(0, at);
  const after = kids.slice(at + 1);
  const grid = textCol.parentElement!;
  const art = (Array.from(grid.children) as HTMLElement[]).filter((el) => el !== textCol && !el.matches("[aria-hidden]:empty"));

  const [l1, l2, l3] = lines;

  // Everything in the hero is on screen from the first paint — the headline
  // (or the artwork) is the page's Largest Contentful Paint, so nothing here
  // is hidden until JavaScript runs. The entrance is transform-only: the
  // lines hop in a squash-and-stretch wave, the rest settles into place.
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  gsap.set(lines, { transformOrigin: "0% 100%" });
  tl.fromTo(before, { y: -10 }, { y: 0, duration: 0.5 }, 0.1);
  lines.forEach((line, i) => tl.to(line, { keyframes: POP_WAVE }, 0.2 + i * 0.22));
  tl.fromTo(after, { y: 16 }, { y: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)" }, 0.6);
  if (art.length) tl.fromTo(art, { y: 30, scale: 0.96, rotation: 1.5 }, { y: 0, scale: 1, rotation: 0, duration: 0.9, stagger: 0.1, ease: "back.out(1.4)" }, 0.4);

  // Exit: the lines split apart (x / rotation / y — never what the entrance
  // animates on them), the headline and text column fade, the hero eases back.
  const out = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1, invalidateOnRefresh: true },
  });
  if (l1) out.to(l1, { x: () => -innerWidth * 0.18, rotation: -6 }, 0);
  if (l2) out.to(l2, { y: 50 }, 0);
  if (l3) out.to(l3, { x: () => innerWidth * 0.22, rotation: 6 }, 0);
  out.to(h1, { opacity: 0, filter: "blur(8px)", duration: 0.6 }, 0)
    .to(textCol, { y: -40, opacity: 0, duration: 0.8 }, 0.2)
    .to(grid, { scale: 0.96, y: -30, duration: 1 }, 0);
}

/** Already moved by an enclosing reveal — animating it too would double up. */
const insideReveal = (el: HTMLElement) => Boolean(el.parentElement?.closest("[data-reveal], [data-reveal-stagger]"));

/** Any `data-reveal` block (headings excepted): rises and untilts as it enters. */
function reveal(el: HTMLElement) {
  if (el.matches("[data-wm='heading']") || insideReveal(el)) return;
  scrubbed(el, ENTER, SETTLED).fromTo(el, { y: 70, rotation: 1.5, autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, ease: "power3.out" });
}

/** Any `data-reveal-stagger` group: each child tips up out of the floor in 3D as it enters. */
function revealStagger(group: HTMLElement) {
  if (insideReveal(group)) return;
  perItem(Array.from(group.children) as HTMLElement[], (tl, child, i) => {
    tl.fromTo(
      child,
      { y: 110, rotationX: -40, rotation: i % 2 ? 3 : -3, autoAlpha: 0, transformPerspective: 1000, transformOrigin: "50% 100%" },
      { y: 0, rotationX: 0, rotation: 0, autoAlpha: 1, ease: "power3.out" },
    );
  });
}

/* ── Shared long-form ───────────────────────────────────────────────────── */

function statRow(row: HTMLElement) {
  return popStats(scrubbed(row, "top 94%", "top 65%"), all(row, "[data-wm='stat']"), 0, 70);
}

function tools(list: HTMLElement) {
  scrubbed(list, ENTER, SETTLED).fromTo(
    all(list, "[data-wm='tool']"),
    { scale: 0, rotation: (i) => (i % 2 ? 14 : -14) },
    { scale: 1, rotation: 0, duration: 0.4, stagger: 0.06, ease: "back.out(2.6)" },
  );
}

/** Step by step: each step rises as it enters and its number squash-pops. */
function steps(list: HTMLElement) {
  gsap.set(all(list, "[data-wm='step-num']"), { scale: 0, autoAlpha: 0, transformOrigin: "0% 100%" });
  perItem(all(list, "[data-wm='step']"), (tl, step) => {
    tl.fromTo(step, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0);
    const num = one(step, "[data-wm='step-num']");
    if (num) tl.to(num, squashPop(0.6), 0.35);
  });
}

/** Who it's for: each coloured card flips over as it enters and its spark spins. */
function audience(list: HTMLElement) {
  perItem(all(list, "[data-wm='aud-card']"), (tl, card) => {
    tl.fromTo(card, { rotationY: -90, transformPerspective: 1000, transformOrigin: "0% 50%", autoAlpha: 0 }, { rotationY: 0, autoAlpha: 1, duration: 0.7, ease: "back.out(1.4)" }, 0)
      .fromTo(one(card, "[data-wm='spark']"), { scale: 0, rotation: -360 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }, 0.35);
  });
}

/** Why us: the dark band stretches open from a pill; the copy rises. */
function why(band: HTMLElement) {
  scrubbed(band, "top 92%", "top 50%")
    .fromTo(band, { clipPath: "inset(0% 22% 0% 22% round 999px)" }, { clipPath: "inset(0% 0% 0% 0% round 40px)", duration: 0.7, ease: "power3.inOut" }, 0)
    .fromTo(all(band, "[data-wm='why-text']"), { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.12 }, 0.4);
}

/* ── Shared closing ─────────────────────────────────────────────────────── */

/** Packages: dealt in from below, fanned; the popular one lands last with a bounce and a burst. */
function packages(list: HTMLElement) {
  const cards = all(list, "[data-wm='package']");
  const tl = scrubbed(list, "top 94%", "top 50%");
  tl.fromTo(
    cards,
    { y: 220, rotation: (i) => (i - 1) * 12, scale: 0.8, autoAlpha: 0 },
    { y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 1, stagger: 0.15, ease: "back.out(1.3)" },
    0,
  );
  cards.forEach((card) => {
    if (card.dataset.popular === undefined) return;
    tl.to(card, { keyframes: [{ y: -24, duration: 0.18, ease: "power2.out" }, { y: 0, duration: 0.4, ease: "bounce.out" }] }, 1.1);
    burst(tl, card.querySelector("[data-wm='burst']"), 1.15, 140);
  });
}

/** FAQ: each question slides in from the right as it enters; its +/– dot spins in. */
function faq(list: HTMLElement) {
  perItem(all(list, "[data-wm='faq']"), (tl, item) => {
    tl.fromTo(item, { x: 120, rotation: 3, autoAlpha: 0 }, { x: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0)
      .fromTo(one(item, "[data-wm='faq-dot']"), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.4)" }, 0.3);
  });
}

/** More ways to pop: the other services' chips spin in one after another. */
function more(list: HTMLElement) {
  scrubbed(list, ENTER, "top 60%").fromTo(
    all(list, "[data-wm='chip']"),
    { scale: 0, rotation: (i) => (i % 2 ? 200 : -200), autoAlpha: 0 },
    { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.8)" },
  );
}

export default function ServicePageMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const scope = root.current;
      if (!scope) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: (void | (() => void))[] = [];
        // One idle task per section instead of one long task at hydration
        // (see idleSetup).
        const each = (sel: string, fn: (el: HTMLElement) => void | (() => void)) =>
          cleanups.push(idleSetup(contextSafe!(() => all(scope, sel).forEach((el) => cleanups.push(fn(el))))));

        hero(scope);
        each("[data-wm='heading']", headingIn);
        each("[data-reveal]", reveal);
        each("[data-reveal-stagger]", revealStagger);
        each("[data-wm='longform']", paragraphs);
        each("[data-wm='stat-row']", statRow);
        each("[data-wm='tools']", tools);
        each("[data-wm='included']", (list) => void tipInCards(list, "[data-wm='inc-card']"));
        each("[data-wm='steps']", steps);
        each("[data-wm='aud']", audience);
        each("[data-wm='guides']", (list) => void tipInCards(list, "[data-wm='guide']"));
        each("[data-wm='why']", why);
        each("[data-wm='packages']", packages);
        each("[data-wm='faqs']", faq);
        each("[data-wm='more']", more);
        each("[data-wm='cta']", closingCta);

        return () => cleanups.forEach((c) => c?.());
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-service-page className={className}>
      {children}
    </div>
  );
}
