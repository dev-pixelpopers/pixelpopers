"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import {
  all,
  burst,
  headingIn,
  one,
  paragraphs,
  quoteCards,
  scrubbed,
  squashPop,
  tipInCards,
} from "@/components/inner/motion/kit";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** What happens next: the three step cards are dealt in from a stack; their big numbers rise. */
function nextSteps(list: HTMLElement) {
  const cards = all(list, "[data-wm='next-card']");
  scrubbed(list, "top 90%", "top 35%")
    .fromTo(
      cards,
      {
        x: (i) => (1 - i) * 260,
        y: 180,
        rotation: (i) => [-18, 6, 22][i] ?? 0,
        scale: 0.8,
        autoAlpha: 0,
      },
      { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 1, stagger: 0.15, ease: "back.out(1.3)" },
      0,
    )
    .fromTo(all(list, "[data-wm='big-num']"), { yPercent: 50, scale: 0.5, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.8)" }, 0.45);
}

/** Other ways to say hi: the channel cards flip over one after another; their big letters rise. */
function channels(list: HTMLElement) {
  scrubbed(list, "top 90%", "top 40%")
    .fromTo(
      all(list, "[data-wm='channel']"),
      { rotationY: -90, transformPerspective: 1000, transformOrigin: "0% 50%", autoAlpha: 0 },
      { rotationY: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.4)" },
      0,
    )
    .fromTo(all(list, "[data-wm='big-num']"), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.12 }, 0.4);
}

/**
 * The chat FAQ plays like a conversation: each question bubble pops up from
 * its tail on the right, then the answer pops up from its tail on the left.
 */
function chat(list: HTMLElement) {
  const tl = scrubbed(list, "top 85%", "bottom 75%");
  all(list, "[data-wm='chat-pair']").forEach((pair, i) => {
    const at = i * 0.6;
    tl.fromTo(
      one(pair, "[data-wm='ask']"),
      { scale: 0, autoAlpha: 0, transformOrigin: "100% 100%" },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)" },
      at,
    ).fromTo(
      one(pair, "[data-wm='answer']"),
      { scale: 0, autoAlpha: 0, transformOrigin: "0% 100%" },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)" },
      at + 0.3,
    );
  });
}

/** After you hit send: the step cards slide in from the right; their numbers pop with a burst. */
function afterSend(list: HTMLElement) {
  all(list, "[data-wm='after-step']").forEach((step) => {
    const num = one(step, "[data-wm='after-num']");
    if (num) gsap.set(num, { scale: 0, autoAlpha: 0 });
    const tl = scrubbed(step, "top 92%", "top 60%");
    tl.fromTo(step, { x: 160, rotation: 3, autoAlpha: 0 }, { x: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0);
    if (num) {
      tl.to(num, squashPop(0.6), 0.35);
      burst(tl, step.querySelector("[data-wm='burst']"), 0.45, 70);
    }
  });
}

/**
 * The Contact page's scroll motion for everything below the intro (whose
 * headline, "say hello" column and form animate themselves). Built from the
 * shared inner-page kit; every piece is scrubbed, so scrolling back plays it
 * backwards; reduced motion gets none.
 */
export default function ContactMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const each = (sel: string, fn: (el: HTMLElement) => void) => all(scope, sel).forEach(fn);
        each("[data-wm='heading']", headingIn);
        each("[data-wm='next']", nextSteps);
        each("[data-wm='channels']", channels);
        each("[data-wm='chat']", chat);
        each("[data-wm='after']", afterSend);
        each("[data-wm='where-section']", paragraphs);
        each("[data-wm='where']", (list) => void tipInCards(list, "[data-wm='where-card']"));
        each("[data-wm='quotes']", quoteCards);
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
