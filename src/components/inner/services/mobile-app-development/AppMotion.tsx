"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ambientLoops } from "@/lib/ambient";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Motion layer for the mobile app page (section reveals come from ServicePageMotion).
 *  - `data-pop`     → notifications and stickers drop in like push alerts.
 *  - `data-float`   → idle bob (value = px travel).
 *  - `data-install` → an install bar fills to its width when scrolled into view.
 *  - `data-icons`   → home-screen icons wobble in one by one, like a fresh install.
 *  - `data-layers`  → the stack of layers slides together from a fanned-out state.
 * Tailwind `rotate-*` is the individual `rotate` property, so GSAP transforms
 * never clobber the tilts. Reduced motion → the static, final layout.
 */
export default function AppMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        gsap.from("[data-pop]", { y: -24, scale: 0.85, autoAlpha: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.45, delay: 1.2 });

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, { y: -(Number(el.dataset.float) || 8), duration: 2.3 + (i % 3) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 + i * 0.2 });
        });

        gsap.utils.toArray<HTMLElement>("[data-install]").forEach((bar) => {
          gsap.from(bar, { scaleX: 0, transformOrigin: "0% 50%", duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: bar, start: "top 90%", once: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-icons]").forEach((grid) => {
          gsap.from(grid.children, {
            scale: 0.3,
            autoAlpha: 0,
            duration: 0.5,
            ease: "back.out(2.2)",
            stagger: { each: 0.05, grid: "auto", from: "start" },
            scrollTrigger: { trigger: grid, start: "top 80%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-layers]").forEach((stack) => {
          gsap.from(stack.children, {
            y: (i) => (i + 1) * 26,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: stack, start: "top 80%", once: true },
          });
        });

        // Endless idle loops only run on screen, after the first interaction.
        const stopLoops = ambientLoops(ctx);
        return () => stopLoops();
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
