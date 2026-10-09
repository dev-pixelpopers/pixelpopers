"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import {
  all,
  burst,
  closingCta,
  headingIn,
  one,
  paragraphs,
  popStats,
  quoteCards,
  scrubbed,
  squashPop,
  tipInCards,
} from "@/components/inner/motion/kit";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Our story: the logo pops, the founder cards fly in tilted with their
 * avatars spinning in; the yellow rule draws across; the stat cards rise and
 * their numbers pop, count up and burst.
 */
function story(section: HTMLElement) {
  const founders = one(section, "[data-wm='founders']");
  if (founders) {
    const cards = all(founders, "[data-wm='founder']");
    scrubbed(founders, "top 90%", "top 40%")
      .fromTo(one(section, "[data-wm='story-logo']"), { scale: 0, rotation: -20, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(2.4)" }, 0)
      .fromTo(
        cards,
        { x: -160, rotation: (i) => [-14, 10, -8][i] ?? 0, autoAlpha: 0 },
        { x: 0, rotation: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" },
        0.15,
      )
      .fromTo(all(founders, "[data-wm='avatar']"), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.5, stagger: 0.15, ease: "back.out(2.2)" }, 0.45)
      .fromTo(all(founders, "[data-wm='byline']"), { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 0.6);
  }
  const rule = one(section, "[data-wm='rule']");
  if (rule) scrubbed(rule, "top 92%", "top 70%").fromTo(rule, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, ease: "power2.inOut" });

  const statCards = one(section, "[data-wm='stat-cards']");
  if (!statCards) return;
  const stats = all(statCards, "[data-wm='stat']");
  const tl = scrubbed(statCards, "top 92%", "top 45%");
  tl.fromTo(stats, { y: 80, rotation: (i) => (i - 1) * 6, autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.6)" }, 0);
  return popStats(tl, stats, 0.4, 90);
}

/** A long-form block's stats under its sticky heading: pop, count up, burst. */
function statRow(row: HTMLElement) {
  return popStats(scrubbed(row, "top 92%", "top 55%"), all(row, "[data-wm='stat']"), 0, 70);
}

/**
 * What makes us pop: the doodles spin in, the squiggle sweeps in behind;
 * the four value cards tip up one after another while their giant numbers
 * rise into place.
 */
function values(section: HTMLElement) {
  scrubbed(section, "top 90%", "top 50%").fromTo(
    all(section, "[data-wm='doodle']"),
    { scale: 0, rotation: (i) => (i ? 120 : -120), autoAlpha: 0 },
    { scale: 1, rotation: 0, autoAlpha: 1, duration: 1, stagger: 0.15, ease: "back.out(1.8)" },
  );
  const list = one(section, "[data-wm='value-cards']");
  if (!list) return;
  scrubbed(list, "top 90%", "top 35%")
    .fromTo(
      all(list, "[data-wm='value']"),
      { y: 160, rotationX: -50, rotation: (i) => (i % 2 ? 10 : -10), autoAlpha: 0, transformPerspective: 1100, transformOrigin: "50% 100%" },
      { y: 0, rotationX: 0, rotation: 0, autoAlpha: 1, duration: 1, stagger: 0.14, ease: "power3.out" },
      0,
    )
    .fromTo(all(list, "[data-wm='value-num']"), { yPercent: 60, scale: 0.6 }, { yPercent: 0, scale: 1, duration: 0.7, stagger: 0.14, ease: "back.out(1.6)" }, 0.35);
}

function squiggle(img: HTMLElement) {
  scrubbed(img, "top 95%", "top 30%").fromTo(img, { x: -120, rotation: -8, autoAlpha: 0 }, { x: 0, rotation: 0, autoAlpha: 1, ease: "power2.out" });
}

/**
 * From spark to pop: the dark band stretches open; the step circles
 * squash-pop with a burst one after another while the hairline joining them
 * draws on, and each step's copy rises; the button pops.
 */
function process(section: HTMLElement) {
  const steps = all(section, "[data-wm='step']");
  const dots = all(section, "[data-wm='step-dot']");
  gsap.set(dots, { scale: 0, autoAlpha: 0 });
  const tl = scrubbed(section, "top 90%", "top 15%");
  tl.fromTo(
    section,
    { clipPath: "inset(0% 18% 0% 18% round 999px)" },
    { clipPath: "inset(0% 0% 0% 0% round 64px)", duration: 0.7, ease: "power3.inOut" },
    0,
  ).fromTo(one(section, "[data-wm='process-btn']"), { scale: 0, rotation: -20, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(2.4)" }, 0.5);
  steps.forEach((step, i) => {
    const at = 0.7 + i * 0.3;
    tl.to(dots[i], squashPop(0.6), at);
    burst(tl, step.querySelector("[data-wm='burst']"), at + 0.1, 110);
    tl.fromTo(all(step, "[data-wm='step-text']"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06 }, at + 0.15);
    const line = one(step, "[data-wm='step-line']");
    if (line) tl.fromTo(line, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.3, ease: "power1.inOut" }, at + 0.2);
  });
}

/** Our journey: the years bounce in, the dots pop and the timeline draws on, left to right. */
function journey(list: HTMLElement) {
  const tl = scrubbed(list, "top 90%", "top 35%");
  all(list, "[data-wm='milestone']").forEach((m, i) => {
    const at = i * 0.25;
    tl.fromTo(one(m, "[data-wm='year']"), { yPercent: -120, rotation: (i % 2 ? 12 : -12), autoAlpha: 0 }, { yPercent: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "bounce.out" }, at)
      .fromTo(one(m, "[data-wm='milestone-dot']"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, at + 0.2)
      .fromTo(all(m, "[data-wm='milestone-text']"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06 }, at + 0.25);
    const line = one(m, "[data-wm='milestone-line']");
    if (line) tl.fromTo(line, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.25, ease: "none" }, at + 0.25);
  });
}

/** Life at the studio: the perk cards tip in and their "P" badges pop with a burst. */
function perks(list: HTMLElement) {
  tipInCards(list, "[data-wm='perk']");
}

/**
 * We're hiring: the pink band stretches open, its giant P rises behind, the
 * copy slides up, the role pills pop one by one and the button bursts.
 */
function hiring(band: HTMLElement) {
  const btn = one(band, "[data-wm='hiring-btn']");
  const tl = scrubbed(band, "top 90%", "top 30%");
  tl.fromTo(band, { clipPath: "inset(0% 30% 0% 30% round 999px)" }, { clipPath: "inset(0% 0% 0% 0% round 48px)", duration: 0.7, ease: "power3.inOut" }, 0)
    .fromTo(one(band, "[data-wm='hiring-p']"), { yPercent: 40, rotation: 20, autoAlpha: 0 }, { yPercent: 0, rotation: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.4)" }, 0.3)
    .fromTo(all(band, "[data-wm='hiring-text']"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, 0.4)
    .fromTo(all(band, "[data-wm='role']"), { scale: 0, rotation: (i) => (i % 2 ? 12 : -12) }, { scale: 1, rotation: 0, duration: 0.4, stagger: 0.08, ease: "back.out(2.6)" }, 0.6);
  if (btn) {
    tl.fromTo(btn, { scale: 0, rotation: -20, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.45, ease: "back.out(2.4)" }, 0.9);
    burst(tl, btn.parentElement?.querySelector("[data-wm='burst']") ?? null, 1.05, 110);
  }
}

/** The closing CTA's loop doodle spins in. */
function closingDoodle(section: HTMLElement) {
  const doodle = one(section, "[data-wm='doodle']");
  if (doodle) scrubbed(section, "top 90%", "top 30%").fromTo(doodle, { scale: 0, rotation: -180, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, ease: "back.out(1.8)" });
}

/**
 * The About page's scroll motion for everything below the hero (which
 * animates itself). Built from the shared inner-page kit; every piece is
 * scrubbed, so scrolling back plays it backwards; reduced motion gets none.
 */
export default function AboutMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: (void | (() => void))[] = [];
        const each = (sel: string, fn: (el: HTMLElement) => void | (() => void)) =>
          all(scope, sel).forEach((el) => cleanups.push(fn(el)));

        each("[data-wm='heading']", headingIn);
        each("[data-wm='story']", story);
        each("[data-wm='story'], [data-wm='longform'], [data-wm='audience']", paragraphs);
        each("[data-wm='stat-row']", statRow);
        each("[data-wm='squiggle']", squiggle);
        each("[data-wm='values']", values);
        each("[data-wm='process']", process);
        each("[data-wm='audience-cards']", (list) => void tipInCards(list, "[data-wm='audience-card']"));
        each("[data-wm='journey']", journey);
        each("[data-wm='quotes']", quoteCards);
        each("[data-wm='perks']", perks);
        each("[data-wm='hiring']", hiring);
        each("[data-wm='cta']", (cta) => {
          closingCta(cta);
          closingDoodle(cta);
        });

        return () => cleanups.forEach((c) => c?.());
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
