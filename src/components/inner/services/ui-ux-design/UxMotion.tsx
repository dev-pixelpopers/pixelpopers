"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ambientLoops } from "@/lib/ambient";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Motion for the design-tool canvas page.
 *  - `data-float`  → idle bob for stickers and chips (value = px travel).
 *  - `data-drift`  → live-cursor wander: the element and its name tag drift
 *                    around a small loop, like a collaborator moving about.
 *  - `data-pulse`  → soft breathing scale (comment pin, heatmap blobs).
 *  - `data-draw`   → SVG strokes inside draw themselves on scroll (user flow).
 * Tailwind's `rotate-*` uses the individual `rotate` property, so GSAP's
 * `transform` never clobbers the Figma tilts. Reduced motion → static.
 */
export default function UxMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: -(Number(el.dataset.float) || 8),
            duration: 2.2 + (i % 3) * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el, i) => {
          const r = Number(el.dataset.drift) || 24;
          const tl = gsap.timeline({ repeat: -1, delay: i * 0.6, defaults: { ease: "sine.inOut", duration: 1.8 } });
          tl.to(el, { x: r, y: -r * 0.6 })
            .to(el, { x: r * 0.3, y: r * 0.5 })
            .to(el, { x: -r * 0.5, y: r * 0.1 })
            .to(el, { x: 0, y: 0 });
        });

        gsap.utils.toArray<HTMLElement>("[data-pulse]").forEach((el, i) => {
          gsap.to(el, { scale: 1.12, duration: 1.4 + (i % 3) * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

        gsap.utils.toArray<SVGElement>("[data-draw]").forEach((svg) => {
          const paths = svg.querySelectorAll<SVGGeometryElement>("path");
          paths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          });
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: svg, start: "top 80%", once: true },
          });
        });
        // Endless idle loops only run on screen, after the first interaction.
        return ambientLoops(ctx);
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
