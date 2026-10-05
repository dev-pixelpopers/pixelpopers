"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Motion layer for the editorial content-writing page (opt-in data attributes):
 *  - `data-caret`        → typing caret blink.
 *  - `data-strike="h"`   → a strike line (background image, `h` thick) is drawn
 *                          left-to-right like a red pen, across line breaks.
 *  - `data-insert`       → the replacement words land after the strike.
 *  - `data-slider="v"`   → tone sliders glide from the middle (`--v` 50) to `v`.
 *  - `data-float`        → idle bob (pencil, stickers). Value = px travel.
 * The static markup already shows every final state, so reduced-motion users
 * (and no-JS visitors) get the finished page.
 */
export default function ContentFx({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-caret]").forEach((el) => {
          gsap.to(el, { autoAlpha: 0, duration: 0.55, ease: "steps(1)", repeat: -1, yoyo: true });
        });

        gsap.utils.toArray<HTMLElement>("[data-strike]").forEach((el) => {
          const h = el.dataset.strike || "2px";
          const scope = el.closest("[data-edit]") ?? el;
          const tl = gsap.timeline({ scrollTrigger: { trigger: scope, start: "top 85%", once: true }, delay: 0.5 });
          tl.fromTo(el, { backgroundSize: `0% ${h}` }, { backgroundSize: `100% ${h}`, duration: 1.1, ease: "power2.inOut" });
          const insert = scope.querySelectorAll("[data-insert]");
          if (insert.length) tl.from(insert, { autoAlpha: 0, y: -8, duration: 0.5, ease: "back.out(2)", stagger: 0.15 });
        });

        gsap.utils.toArray<HTMLElement>("[data-slider]").forEach((el, i) => {
          gsap.fromTo(el, { "--v": 50 }, {
            "--v": Number(el.dataset.slider) || 50,
            duration: 1.4,
            delay: (i % 4) * 0.12,
            ease: "elastic.out(1, 0.6)",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: -(Number(el.dataset.float) || 8),
            duration: 2 + (i % 3) * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.2,
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
