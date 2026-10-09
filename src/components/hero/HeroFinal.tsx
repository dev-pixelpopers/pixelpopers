"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import HeroFrame from "@/components/hero/HeroFrame";
import { doodleIdle, letterBounce, POP_LANDED, popEntrance, scrollHandOff } from "@/components/hero/hero-animations";
import { revealStatic } from "@/components/hero/hero-shared";
import { ambient } from "@/lib/ambient";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The home page hero: glow, blob, headline and the project carousel, with a
 * letter-by-letter "pop" entrance, a scroll hand-off into the carousel and a
 * squash-and-stretch bounce on hovered letters (see `hero-animations.ts`).
 * Under reduced motion the copy is simply shown.
 */
export default function HeroFinal({ children }: { children?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;
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

          const entrance = popEntrance(q);
          scrollHandOff(q);

          // Once everything has landed: the doodles' idle wobble (only while
          // the hero is on screen, after the first interaction) and, with a
          // fine pointer, the letter bounce — which overwrites a letter's
          // tweens, so arming it mid-entrance would cut that letter's pop short.
          let stopIdle: (() => void) | undefined;
          let stopBounce: (() => void) | undefined;
          if (hover) entrance.call(contextSafe(() => (stopBounce = letterBounce(q, contextSafe))), [], POP_LANDED);
          // The flower's burst settles at 2.6s.
          entrance.call(contextSafe(() => (stopIdle = ambient(doodleIdle(q), q("[data-hero-frame='headline']")[0] ?? root))), [], 2.6);

          return () => {
            stopIdle?.();
            stopBounce?.();
          };
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <HeroFrame ref={rootRef} chars>
      {children}
    </HeroFrame>
  );
}
