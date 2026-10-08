"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import HeroFrame from "@/components/hero/HeroFrame";
import { letterBounce, POP_LANDED, popEntrance, scrollHandOff } from "@/components/hero/hero-animations";
import { revealStatic } from "@/components/hero/hero-shared";

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

          if (!hover) return;

          // The bounce overwrites a letter's tweens, so arming it mid-entrance
          // would cut that letter's pop short — wait until everything has landed.
          let stopBounce: (() => void) | undefined;
          entrance.call(() => {
            stopBounce = letterBounce(q, contextSafe);
          }, [], POP_LANDED);

          return () => stopBounce?.();
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
