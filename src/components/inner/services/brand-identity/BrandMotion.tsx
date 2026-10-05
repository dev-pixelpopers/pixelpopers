"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Small motion layer for the brand-book page.
 *  - `data-float`     → gentle idle bob (stickers, swatch dots). Value = px travel.
 *  - `data-parallax`  → scroll-scrubbed drift. Value = yPercent travel.
 *  - `data-fan`       → children fan in from a stacked pile when scrolled into view.
 * CSS `rotate` (Tailwind v4 individual transform) is left untouched, so the
 * Figma tilt is kept while GSAP animates `transform`. Reduced-motion users
 * get the static layout.
 */
export default function BrandMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          const travel = Number(el.dataset.float) || 10;
          gsap.to(el, {
            y: -travel,
            duration: 2.2 + (i % 3) * 0.45,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.2,
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.parallax) || -8,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-fan]").forEach((group) => {
          gsap.from(group.children, {
            x: (i: number) => (1.5 - i) * 60,
            y: 60,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
