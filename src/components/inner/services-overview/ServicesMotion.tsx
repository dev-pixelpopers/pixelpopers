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
  statsBand,
  tipInCards,
} from "@/components/inner/motion/kit";
import { idleSetup } from "@/lib/defer-setup";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Intro stats under the sticky heading: each value pops, counts up and bursts. */
function statRow(row: HTMLElement) {
  return popStats(scrubbed(row, "top 92%", "top 55%"), all(row, "[data-wm='stat']"), 0, 70);
}

/**
 * The six service rows: the big number squash-pops and bursts, the title
 * slides in, the blurb rises, the tags pop one after another, and the image
 * swings in from the right like a card being dealt onto the table.
 */
function serviceRows(list: HTMLElement) {
  all(list, "[data-wm='row']").forEach((row, i) => {
    const num = one(row, "[data-wm='row-num']");
    if (num) gsap.set(num, { scale: 0, autoAlpha: 0, transformOrigin: "50% 80%" });
    const tl = scrubbed(row, "top 92%", "top 40%");
    if (num) {
      tl.to(num, squashPop(0.7), 0);
      burst(tl, num.parentElement?.querySelector("[data-wm='burst']") ?? null, 0.15, 90);
    }
    tl.fromTo(one(row, "[data-wm='row-title']"), { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0.1)
      .fromTo(one(row, "[data-wm='row-blurb']"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.3)
      .fromTo(
        all(row, "[data-wm='row-tag']"),
        { scale: 0, rotation: (j) => (j % 2 ? 14 : -14) },
        { scale: 1, rotation: 0, duration: 0.4, stagger: 0.06, ease: "back.out(2.6)" },
        0.45,
      )
      .fromTo(one(row, "[data-wm='row-link']"), { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4 }, 0.7)
      .fromTo(
        one(row, "[data-wm='row-img']"),
        { x: 180, y: 40, rotation: i % 2 ? -14 : 14, scale: 0.8, autoAlpha: 0 },
        { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: "back.out(1.4)" },
        0.15,
      );
  });
}

/** FAQ: the questions slide in from the right, their +/– dots spin in; the button pops. */
function faq(scope: HTMLElement) {
  const list = one(scope, "[data-wm='faqs']");
  if (list) {
    scrubbed(list, "top 88%", "top 40%")
      .fromTo(
        all(list, "[data-wm='faq']"),
        { x: 120, rotation: 3, autoAlpha: 0 },
        { x: 0, rotation: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        0,
      )
      .fromTo(
        all(list, "[data-wm='faq-dot']"),
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.45, stagger: 0.1, ease: "back.out(2.4)" },
        0.35,
      );
  }
  const btn = one(scope, "[data-wm='faq-btn']");
  if (btn) {
    scrubbed(btn, "top 95%", "top 70%").fromTo(btn, { scale: 0, rotation: -20, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, ease: "back.out(2.4)" });
  }
}

/**
 * Us vs a typical agency: the grey card shuffles in from the left, tilted and
 * dull; the grape one swings in from the right and its ticks pop one by one.
 */
function compare(block: HTMLElement) {
  const typical = one(block, "[data-wm='cmp-typical']");
  const us = one(block, "[data-wm='cmp-us']");
  const dots = all(block, "[data-wm='cmp-dot']");
  gsap.set(dots, { scale: 0, autoAlpha: 0 });
  const tl = scrubbed(block, "top 88%", "top 30%");
  tl.fromTo(typical, { x: -140, rotation: -7, autoAlpha: 0 }, { x: 0, rotation: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0)
    .fromTo(all(block, "[data-wm='cmp-x']"), { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08 }, 0.4)
    .fromTo(us, { x: 140, rotation: 7, scale: 0.9, autoAlpha: 0 }, { x: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.4)" }, 0.2)
    .fromTo(all(block, "[data-wm='cmp-check']"), { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.1 }, 0.6);
  dots.forEach((dot, i) => tl.to(dot, squashPop(0.5), 0.7 + i * 0.1));
}

/** Industries: the tiles flip over one after another; their big numbers rise. */
function industries(list: HTMLElement) {
  scrubbed(list, "top 90%", "top 40%")
    .fromTo(
      all(list, "[data-wm='industry']"),
      { rotationY: 90, transformPerspective: 900, autoAlpha: 0 },
      { rotationY: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)" },
      0,
    )
    .fromTo(all(list, "[data-wm='ind-num']"), { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 0.3);
}

/** Ways to work: the cards tip in, their colour bars draw across, the chips pop. */
function models(list: HTMLElement) {
  tipInCards(list, "[data-wm='model']", (tl, card) => {
    tl.fromTo(one(card, "[data-wm='model-bar']"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 0.45)
      .fromTo(one(card, "[data-wm='model-chip']"), { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2.6)" }, 0.7);
  });
}

/**
 * The Services page's scroll motion for everything below the hero (which
 * animates itself). Built from the shared inner-page kit; every piece is
 * scrubbed, so scrolling back plays it backwards; reduced motion gets none.
 */
export default function ServicesMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
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

        each("[data-wm='heading']", headingIn);
        each("[data-wm='longform']", paragraphs);
        each("[data-wm='stat-row']", statRow);
        each("[data-wm='rows']", serviceRows);
        each("[data-wm='explained']", (list) => void tipInCards(list, "[data-wm='ex-card']"));
        const faqs = one(scope, "[data-wm='faqs']")?.parentElement;
        if (faqs) faq(faqs);
        each("[data-wm='compare']", compare);
        each("[data-wm='industries']", industries);
        each("[data-wm='models']", models);
        each("[data-wm='band']", statsBand);
        each("[data-wm='quotes']", quoteCards);
        each("[data-wm='cta']", closingCta);

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
