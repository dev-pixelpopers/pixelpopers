"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fps = 30;
const timelineSeconds = 5;

/**
 * Motion layer for the motion-graphic page (everything is opt-in via data
 * attributes, so the server markup stays static and readable):
 *  - `data-bounce`     → hero letters drop in, then hop in a loop.
 *  - `data-timeline`   → scroll-scrubs the `--p` playhead variable (0–1) and
 *                        rewrites the `[data-timecode]` label as it moves.
 *  - `data-ease`       → on an easing card: draws `[data-curve]` and runs the
 *                        `[data-ease-dot]` along its track with that GSAP ease.
 *  - `data-float`      → idle bob (stickers, bounce-trail dots). Value = px.
 *  - `data-parallax`   → scroll drift. Value = yPercent travel.
 * CSS `rotate` (Tailwind v4 individual transform) is untouched, so the Figma
 * tilts survive while GSAP animates `transform`. Reduced motion = static page.
 */
export default function MotionFx({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const letters = gsap.utils.toArray<HTMLElement>("[data-bounce]");
        if (letters.length) {
          const tl = gsap.timeline();
          tl.from(letters, { yPercent: -140, autoAlpha: 0, duration: 1.1, ease: "bounce.out", stagger: 0.08 });
          tl.to(letters, {
            keyframes: [
              { yPercent: -22, duration: 0.28, ease: "power2.out" },
              { yPercent: 0, duration: 0.6, ease: "bounce.out" },
            ],
            stagger: 0.07,
            repeat: -1,
            repeatDelay: 2.6,
          });
        }

        gsap.utils.toArray<HTMLElement>("[data-timeline]").forEach((el) => {
          const label = el.querySelector<HTMLElement>("[data-timecode]");
          gsap.fromTo(
            el,
            { "--p": 0 },
            {
              "--p": 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 25%", scrub: 0.6 },
              onUpdate() {
                if (!label) return;
                const p = Number(gsap.getProperty(el, "--p")) || 0;
                const frames = Math.round(p * timelineSeconds * fps);
                const s = Math.floor(frames / fps);
                const f = frames % fps;
                label.textContent = `00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-ease]").forEach((card) => {
          const ease = card.dataset.ease || "power3.out";
          const curve = card.querySelector("[data-curve]");
          const dot = card.querySelector("[data-ease-dot]");
          if (curve) {
            gsap.from(curve, {
              strokeDashoffset: 1,
              duration: 1.4,
              ease: "power2.inOut",
              scrollTrigger: { trigger: card, start: "top 82%", once: true },
            });
          }
          if (dot) {
            gsap.set(dot, { autoAlpha: 1 });
            gsap.fromTo(
              dot,
              { "--x": 0 },
              {
                "--x": 1,
                ease,
                duration: 1.5,
                repeat: -1,
                repeatDelay: 0.9,
                scrollTrigger: { trigger: card, start: "top 90%", end: "bottom top", toggleActions: "play pause resume pause" },
              },
            );
          }
        });

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: -(Number(el.dataset.float) || 10),
            duration: 1.8 + (i % 3) * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.parallax) || -10,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
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
