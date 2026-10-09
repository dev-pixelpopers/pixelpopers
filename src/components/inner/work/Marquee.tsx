"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { marquees } from "@/lib/pages/work";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = marquees.services.map((s) => `${s} ✦ `).join("");
const next = `${marquees.next} ✦ `;

/**
 * Two crossing ticker bands (lagoon +2°, sunbeam −2°) from Figma 333:21.
 * Each track holds the phrase twice and slides by half its width, so the
 * loop is seamless. The bands overlap via a single-cell grid.
 *
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
            { xPercent: i === 0 ? 0 : -50 },
            { xPercent: i === 0 ? -50 : 0, duration: i === 0 ? 38 : 32, ease: "none", repeat: -1 },
          ),
        );

        gsap.utils.toArray<HTMLElement>("[data-band]").forEach((band, i) => {
          gsap.fromTo(
            band,
            { scaleX: 0, transformOrigin: i === 0 ? "0% 50%" : "100% 50%" },
            {
              scaleX: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 55%", scrub: 0.8 },
            },
          );
        });

        // Scroll speed drives the tickers: a burst of pace, then back to idle.
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

  const band = (text: string, cls: string, tilt: string, extra: string) => (
    <div data-band className={`col-start-1 row-start-1 -mx-[5vw] overflow-hidden py-[clamp(0.75rem,1.25vw,1.5rem)] ${cls} ${tilt} ${extra}`}>
      <p data-track className="flex w-max font-display text-[clamp(1.5rem,2.71vw,3.25rem)] leading-none whitespace-nowrap uppercase">
        <span className="pr-[0.3em]">{text.repeat(4)}</span>
        <span aria-hidden className="pr-[0.3em]">
          {text.repeat(4)}
        </span>
      </p>
    </div>
  );

  return (
    <div ref={root} aria-hidden className="grid overflow-x-clip py-[clamp(1rem,2vw,2.5rem)]">
      {band(services, "bg-lagoon text-white", "rotate-2", "self-start")}
      {band(next, "bg-sunbeam text-ink", "-rotate-2", "mt-[clamp(3.5rem,4.17vw,5rem)] self-start")}
    </div>
  );
}
