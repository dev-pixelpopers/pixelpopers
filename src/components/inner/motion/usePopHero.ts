"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

import { POP_WAVE } from "@/components/inner/motion/kit";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Q = (selector: string) => Element[];
type Extra = (tl: gsap.core.Timeline, q: Q) => void | (() => void);

/*
  The inner pages' hero motion — the same "pop" family as the home page hero.
  Markup hooks (`data-whero`):
    glow-out > glow       the background glows
    crumb-out > crumb     the breadcrumb
    reveal / data-whero-reveal   small extras that ship `invisible` so they
                          don't flash before their entrance — never the
                          headline or anything large (LCP)
    [data-whero-line=1…3] the lines, each holding `char` letters
  The `*-out` wrappers and the line spans belong to the exit, what's inside
  them to the entrance, so the two never fight over a property.

  Entrance, on load (the headline is visible from the first paint — it is
  the page's Largest Contentful Paint, so it is never hidden):
    0.15  the glows bloom, the breadcrumb drops in
    0.25  a squash-and-stretch wave rolls through the letters, line by line
  then `entrance` adds the page's own pieces (from ~1.4), and once landed
  every letter bounces when hovered.

  Exit, scrubbed as the hero scrolls away: line 1 flies up-left, line 2
  sinks back, line 3 slides off right, all blurring; glow and breadcrumb
  fade; `exit` adds the page's own pieces on the same 0–1 timeline.
*/
export function usePopHero(rootRef: RefObject<HTMLElement | null>, { entrance, exit }: { entrance?: Extra; exit?: Extra } = {}) {
  useGSAP(
    (_context, contextSafe) => {
      const q = gsap.utils.selector(rootRef);
      const line = (n: number) => q(`[data-whero-line='${n}'] [data-whero='char']`);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-whero='reveal'], [data-whero-reveal]"), { autoAlpha: 1 });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q("[data-whero='reveal'], [data-whero-reveal]"), { autoAlpha: 1 });
        gsap.set(q("[data-whero='char']"), { transformOrigin: "50% 100%" });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(q("[data-whero='glow']"), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0.15)
          .fromTo(q("[data-whero='crumb']"), { y: -12 }, { y: 0, duration: 0.6 }, 0.2);
        // The headline is on screen from the first paint (it's the page's
        // LCP); the entrance is a squash-and-stretch wave rolling through
        // the three lines, transform-only.
        [1, 2, 3].forEach((n, k) => tl.to(line(n), { keyframes: POP_WAVE, stagger: 0.035 }, 0.25 + k * 0.3));
        const cleanEntrance = entrance?.(tl, q);

        // Every letter bounces with a squash and stretch when hovered (only
        // where there is a real hover, and only once it has landed).
        const chars = q("[data-whero='char']");
        const bounce = contextSafe!((event: Event) => {
          gsap.to(event.currentTarget as Element, {
            keyframes: [
              { yPercent: -32, scaleX: 0.9, scaleY: 1.12, duration: 0.18, ease: "power2.out" },
              { yPercent: 0, scaleX: 1.14, scaleY: 0.84, duration: 0.16, ease: "power2.in" },
              { scaleX: 1, scaleY: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" },
            ],
            overwrite: true,
          });
        });
        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        let armed = false;
        tl.call(
          () => {
            if (!canHover) return;
            armed = true;
            gsap.set(chars, { transformOrigin: "50% 100%" });
            chars.forEach((char) => char.addEventListener("pointerenter", bounce));
          },
          [],
          2.4,
        );

        // ── Exit ─────────────────────────────────────────────────────────
        const out = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: 1, invalidateOnRefresh: true },
        });
        const lineEl = (n: number) => q(`[data-whero-line='${n}']`);
        out
          .to(lineEl(1), { x: () => -innerWidth * 0.18, y: () => -innerHeight * 0.12, scale: 0.85, opacity: 0, filter: "blur(8px)" }, 0)
          .to(lineEl(2), { scale: 0.7, opacity: 0, filter: "blur(10px)" }, 0)
          .to(lineEl(3), { x: () => innerWidth * 0.22, scale: 0.9, opacity: 0, filter: "blur(8px)" }, 0)
          .to(q("[data-whero='crumb-out']"), { y: -24, opacity: 0, duration: 0.5 }, 0)
          .to(q("[data-whero='glow-out']"), { scale: 1.3, opacity: 0 }, 0);
        const cleanExit = exit?.(out, q);
        out.to({}, { duration: 0.01 }, 1);

        return () => {
          if (armed) chars.forEach((char) => char.removeEventListener("pointerenter", bounce));
          cleanEntrance?.();
          cleanExit?.();
        };
      });
    },
    { scope: rootRef },
  );
}
