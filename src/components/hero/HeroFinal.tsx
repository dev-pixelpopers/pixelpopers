"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import HeroFrame from "@/components/hero/HeroFrame";
import { doodleIdle, letterBounce, POP_LANDED, popEntrance, scrollHandOff } from "@/components/hero/hero-animations";
import { revealStatic, splitHeroChars } from "@/components/hero/hero-shared";
import { ambient } from "@/lib/ambient";
import { holdForIntro } from "@/lib/visitor";
import { safeIn } from "@/lib/gsap-safe";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The home page hero: glow, blob, headline and the project carousel, with a
 * letter-by-letter "pop" entrance, a scroll hand-off into the carousel and a
 * squash-and-stretch bounce on hovered letters (see `hero-animations.ts`).
 * Under reduced motion the copy is simply shown.
 */
export default function HeroFinal({ children, lines }: { children?: ReactNode; lines?: readonly string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => revealStatic(q));

      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          hover: "(hover: hover) and (pointer: fine)",
        },
        (mm) => {
          const { motion, hover } = mm.conditions as { motion: boolean; hover: boolean };
          if (!motion) return;

          // Callbacks that run later belong to this branch (see safeIn).
          const contextSafe = safeIn(mm) as Parameters<typeof letterBounce>[1];

          // The scroll hand-off moves whole lines, not letters: set up now so
          // its ScrollTrigger keeps its place in the page's refresh order.
          scrollHandOff(q);

          // The letter entrance waits until the headline has been painted as plain
          // text. On a slow phone the page's JavaScript can finish before
          // the stylesheet does — before anything is on screen — and
          // splitting the lines into letters then would make the first
          // paint a few dozen tiny boxes instead of one big headline, so the
          // browser would pick the small header logo as the Largest
          // Contentful Paint. Two animation frames = the first paint has
          // happened. The entrance starts 0.25s in anyway, so nothing shows.
          let cleanup: (() => void) | undefined;
          const start = contextSafe(() => {
            // The letters exist only while the motion does (see splitHeroChars).
            const unsplit = splitHeroChars(root);
            const entrance = popEntrance(q);
            // On a first visit the welcome intro is up: the entrance plays as it leaves.
            const release = holdForIntro(entrance);

            // Once everything has landed: the doodles' idle wobble (only while
            // the hero is on screen, after the first interaction) and, with a
            // fine pointer, the letter bounce — which overwrites a letter's
            // tweens, so arming it mid-entrance would cut that letter's pop short.
            let stopIdle: (() => void) | undefined;
            let stopBounce: (() => void) | undefined;
            if (hover) entrance.call(contextSafe(() => (stopBounce = letterBounce(q, contextSafe))), [], POP_LANDED);
            // The flower's burst settles at 2.6s.
            entrance.call(contextSafe(() => (stopIdle = ambient(doodleIdle(q), q("[data-hero-frame='headline']")[0] ?? root))), [], 2.6);

            cleanup = () => {
              unsplit();
              release();
              stopIdle?.();
              stopBounce?.();
            };
          });
          let frame = requestAnimationFrame(() => (frame = requestAnimationFrame(start)));

          return () => {
            cancelAnimationFrame(frame);
            cleanup?.();
          };
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <HeroFrame ref={rootRef} chars lines={lines}>
      {children}
    </HeroFrame>
  );
}
