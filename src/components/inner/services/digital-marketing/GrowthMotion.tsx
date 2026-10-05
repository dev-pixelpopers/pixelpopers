"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Motion layer for the growth-dashboard page.
 *  - `data-float`  → idle bob for toasts and stickers (value = px travel).
 *  - `data-pop`    → notification toasts pop in one after another on load.
 *  - `data-draw`   → solid SVG strokes inside draw themselves on scroll (chart lines).
 *  - `data-fade`   → fades in after the draw (dashed comparison line, end dot).
 *  - `data-count`  → number counts up to the value already in the markup
 *                    (prefix/suffix and decimals are kept).
 *  - `data-grow`   → bar children grow from the baseline on scroll.
 *  - `data-spin`   → slow continuous rotation (orbit rings). Value = seconds per turn.
 *  - `data-type`   → text is typed in (clip-path steps) when scrolled into view.
 * Tailwind `rotate-*` is the individual `rotate` property, so GSAP transforms
 * never clobber the Figma tilts. Reduced-motion users get the static layout,
 * and every number/word is already final in the HTML.
 */
export default function GrowthMotion({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const restore: (() => void)[] = [];
        gsap.from("[data-pop]", {
          scale: 0.4,
          autoAlpha: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.35,
          delay: 0.8,
        });

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: -(Number(el.dataset.float) || 8),
            duration: 2.2 + (i % 3) * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1.6 + i * 0.2,
          });
        });

        gsap.utils.toArray<SVGElement>("[data-draw]").forEach((svg) => {
          const paths = svg.querySelectorAll<SVGGeometryElement>("[data-line]");
          paths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: svg, start: "top 85%", once: true },
          });
          tl.to(paths, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.inOut",
          });
          tl.from(
            svg.querySelectorAll("[data-fade]"),
            {
              autoAlpha: 0,
              scale: 0,
              transformOrigin: "50% 50%",
              duration: 0.5,
              ease: "back.out(2)",
              stagger: 0.1,
            },
            "-=0.4",
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const text = el.textContent ?? "";
          const match = text.match(/^(\D*)([\d.,]+)(.*)$/);
          if (!match) return;
          const [, prefix, num, suffix] = match;
          const target = Number(num.replace(/,/g, ""));
          const decimals = num.includes(".") ? num.split(".")[1].length : 0;
          const comma = num.includes(",");
          const state = { v: 0 };
          el.textContent = prefix + (0).toFixed(decimals) + suffix;
          restore.push(() => (el.textContent = text));
          gsap.to(state, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              const n = state.v.toFixed(decimals);
              el.textContent =
                prefix +
                (comma ? Number(n).toLocaleString("en-GB") : n) +
                suffix;
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((group) => {
          gsap.from(group.querySelectorAll("[data-bar]"), {
            scaleY: 0,
            transformOrigin: "50% 100%",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: group, start: "top 80%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-spin]").forEach((el, i) => {
          gsap.to(el, {
            rotation: i % 2 ? -360 : 360,
            duration: Number(el.dataset.spin) || 90,
            ease: "none",
            repeat: -1,
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-type]").forEach((el) => {
          const chars = Math.max(1, (el.textContent ?? "").length);
          gsap.fromTo(
            el,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: chars * 0.06,
              ease: `steps(${chars})`,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });

        return () => restore.forEach((fn) => fn());
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
