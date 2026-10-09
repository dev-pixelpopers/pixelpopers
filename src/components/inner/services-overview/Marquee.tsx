"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { marquee } from "@/lib/pages/services";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Band({ words, className }: { words: string[]; className: string }) {
  const run = words.map((w) => `${w} ✦ `).join("");
  return (
    <div data-band className={`-mx-[10vw] overflow-hidden py-[clamp(0.75rem,1.25vw,1.5rem)] ${className}`}>
      <div data-track className="flex w-max font-display text-[clamp(1.5rem,2.7vw,3.25rem)] leading-[1.27] whitespace-nowrap uppercase">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} aria-hidden={k > 0} className="pr-[0.3em]">
            {run}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The two crossed, tilted ticker bands under the service rows. The tracks
 * hold the phrase four times and slide by a quarter, so the loop is seamless.
 * As they scroll in the bands swing out from flat (scrubbed), and the tickers
 * rush along with the scroll — the faster you scroll, the faster they run —
 * then ease back to their idle pace.
 */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loops = gsap.utils.toArray<HTMLElement>("[data-track]").map((track, i) =>
          gsap.fromTo(
            track,
            { xPercent: i === 0 ? 0 : -25 },
            { xPercent: i === 0 ? -25 : 0, duration: 38, ease: "none", repeat: -1 },
          ),
        );
        gsap.utils.toArray<HTMLElement>("[data-band]").forEach((band, i) => {
          gsap.fromTo(
            band,
            { scaleX: 0, transformOrigin: i === 0 ? "0% 50%" : "100% 50%" },
            { scaleX: 1, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 55%", scrub: 0.8 } },
          );
        });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8);
            loops.forEach((loop) => {
              gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true });
              gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2, ease: "power2.out" });
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="overflow-x-clip py-[clamp(1rem,2vw,2.5rem)]">
      <Band words={marquee.top} className="-rotate-3 bg-blush text-white" />
      <Band words={marquee.bottom} className="-mt-[clamp(0.5rem,1.56vw,1.875rem)] rotate-[2.5deg] bg-sunbeam text-ink" />
    </div>
  );
}
