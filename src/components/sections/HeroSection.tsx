"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

import { HERO_MOTION } from "@/lib/hero-motion";

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const lines = "[data-hero='line']";
      const doodles = "[data-hero='doodle']";
      // Each doodle carries the yaw it should settle at, so GSAP can own the
      // whole transform instead of fighting a Tailwind `rotate-*` class.
      const settleRotation = (_i: number, el: Element) =>
        Number((el as HTMLElement).dataset.rotate ?? 0);

      const media = gsap.matchMedia();

      // Reduced motion still has to *reveal* the copy — the markup ships hidden.
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(lines, { autoAlpha: 1, yPercent: 0 });
        gsap.set(doodles, { autoAlpha: 1, scale: 1, rotation: settleRotation });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          lines,
          { autoAlpha: 0, yPercent: 55 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: HERO_MOTION.lineDuration,
            stagger: HERO_MOTION.lineStagger,
          },
          HERO_MOTION.linesStart,
        ).fromTo(
          doodles,
          { autoAlpha: 0, scale: 0.4, rotation: (i, el) => settleRotation(i, el) - 45 },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: settleRotation,
            duration: HERO_MOTION.doodleDuration,
            stagger: HERO_MOTION.doodleStagger,
            // Slight overshoot so the doodles land with a spring rather than a fade.
            ease: "back.out(2.2)",
          },
          HERO_MOTION.doodlesStart,
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="top" ref={rootRef} className="w-full pb-8">
      {/*
        Without JS the entrance never runs, so the hidden initial state would
        strand the headline. `!important` in a stylesheet beats the inline
        styles the markup ships with.
      */}
      <noscript>
        <style>{`
          [data-hero], [data-hero-blob="group"] {
            visibility: visible !important;
            opacity: 1 !important;
          }
          [data-hero-blob="trace"] { stroke-dashoffset: 0 !important; }
        `}</style>
      </noscript>

      <div className="shell relative flex flex-col items-center pt-[clamp(2rem,6vw,7rem)]">
        <h1 className="flex flex-col items-start leading-none uppercase">
          <span
            data-hero="line"
            className="gsap-reveal relative font-display text-hero-sm text-blush"
          >
            {/* Decorative doodle flanking the first line. The wrapper keeps the
                Tailwind positioning; GSAP animates the artwork inside it. */}
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-full hidden w-[clamp(5rem,14.7vw,17.7rem)] -translate-y-1/3 sm:block"
            >
              <Image
                data-hero="doodle"
                data-rotate="15"
                src="/icons/doodle-sparkle.svg"
                alt=""
                width={244}
                height={206}
                className="gsap-reveal w-full max-w-none"
              />
            </span>
            We Make
          </span>

          <span
            data-hero="line"
            className="gsap-reveal text-hero-md font-bold tracking-[-0.05em] text-grape"
          >
            Your Website
          </span>

          <span
            data-hero="line"
            className="gsap-reveal relative -ml-[2vw] font-display text-hero-lg tracking-[-0.03em] text-lagoon"
          >
            Poppin’
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-full hidden w-[clamp(5rem,17.8vw,21.4rem)] -translate-y-1/2 sm:block"
            >
              <Image
                data-hero="doodle"
                data-rotate="57"
                src="/icons/doodle-flower.svg"
                alt=""
                width={256}
                height={251}
                className="gsap-reveal w-full max-w-none"
              />
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}
