"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ambientLoops } from "@/lib/ambient";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Motion layer for the code + browser page.
 *  - `data-typing` → its `[data-line]` children are typed in one after another
 *                    (clip-path steps, one step per character — the font is mono).
 *  - `data-type-field` → a CMS field types itself in on scroll.
 *  - `data-term`   → terminal: `[data-line]` children print line by line on scroll.
 *  - `data-gauge`  → Lighthouse ring draws to its score while `[data-count]` counts up.
 *  - `data-count`  → number counts up to the value already in the markup.
 *  - `data-pop`    → toasts / stickers pop in.
 *  - `data-float`  → idle bob (value = px travel).
 *  - `data-blink`  → caret blink.
 *  - `data-checks` → checklist ticks pop in one by one on scroll.
 *  - `data-keys`   → keycaps press down in a quick ripple when scrolled into view.
 * Tailwind `rotate-*` is the individual `rotate` property, so GSAP transforms
 * never clobber the Figma tilts. Reduced motion → the static, final layout
 * (every word and number is already final in the HTML).
 */
export default function ShipMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const restore: (() => void)[] = [];

        const typeLines = (lines: HTMLElement[], tl: gsap.core.Timeline, speed: number) => {
          lines.forEach((line) => {
            const chars = Math.max(1, (line.textContent ?? "").length);
            tl.fromTo(line, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: chars * speed, ease: `steps(${chars})` });
          });
        };

        gsap.utils.toArray<HTMLElement>("[data-typing]").forEach((box) => {
          const lines = gsap.utils.toArray<HTMLElement>(box.querySelectorAll("[data-line]"));
          gsap.set(lines, { clipPath: "inset(0 100% 0 0)" });
          const tl = gsap.timeline({ delay: 0.4, scrollTrigger: { trigger: box, start: "top 85%", once: true } });
          typeLines(lines, tl, 0.022);
        });

        gsap.utils.toArray<HTMLElement>("[data-type-field]").forEach((field) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: field, start: "top 80%", once: true } });
          typeLines([field], tl, 0.07);
        });

        gsap.utils.toArray<HTMLElement>("[data-term]").forEach((box) => {
          const lines = gsap.utils.toArray<HTMLElement>(box.querySelectorAll("[data-line]"));
          const [first, ...rest] = lines;
          gsap.set(lines, { autoAlpha: 0 });
          const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: "top 75%", once: true } });
          if (first) {
            tl.set(first, { autoAlpha: 1 });
            typeLines([first], tl, 0.05);
          }
          rest.forEach((line) => tl.to(line, { autoAlpha: 1, duration: 0.05 }, "+=0.45"));
        });

        gsap.utils.toArray<HTMLElement>("[data-gauge]").forEach((g) => {
          const arc = g.querySelector<SVGCircleElement>("[data-arc]");
          if (!arc) return;
          const full = Number(arc.getAttribute("stroke-dasharray")?.split(" ")[0] ?? 0) + Number(arc.getAttribute("stroke-dasharray")?.split(" ")[1] ?? 0);
          gsap.from(arc, {
            attr: { "stroke-dasharray": `0 ${full}` },
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: g, start: "top 85%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const text = el.textContent ?? "";
          const match = text.match(/^(\D*)(\d+)(.*)$/);
          if (!match) return;
          const [, prefix, num, suffix] = match;
          const state = { v: 0 };
          el.textContent = `${prefix}0${suffix}`;
          restore.push(() => (el.textContent = text));
          gsap.to(state, {
            v: Number(num),
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => (el.textContent = `${prefix}${Math.round(state.v)}${suffix}`),
          });
        });

        gsap.from("[data-pop]", { scale: 0.4, autoAlpha: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.5, delay: 1.6 });

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, { y: -(Number(el.dataset.float) || 8), duration: 2.2 + (i % 3) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 + i * 0.2 });
        });

        gsap.to("[data-blink]", { autoAlpha: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });

        gsap.utils.toArray<HTMLElement>("[data-checks]").forEach((list) => {
          gsap.from(list.querySelectorAll("[data-tick]"), {
            scale: 0,
            duration: 0.45,
            ease: "back.out(2.5)",
            stagger: 0.18,
            scrollTrigger: { trigger: list, start: "top 75%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-keys]").forEach((board) => {
          const keys = board.querySelectorAll("[data-key]");
          gsap.timeline({ scrollTrigger: { trigger: board, start: "top 75%", once: true } }).to(keys, {
            yPercent: 6,
            duration: 0.12,
            ease: "power1.in",
            yoyo: true,
            repeat: 1,
            stagger: 0.07,
          });
        });

        // Endless idle loops only run on screen, after the first interaction.
        const stopLoops = ambientLoops(ctx);
        return () => {
          stopLoops();
          restore.forEach((fn) => fn());
        };
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
