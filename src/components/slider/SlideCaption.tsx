"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type RefObject } from "react";

gsap.registerPlugin(useGSAP);

type SlideCaptionProps = {
  active: number;
  count: number;
  title: string;
  /** Filled by `useSliderPlayback` as the active clip plays. */
  barRef: RefObject<HTMLSpanElement | null>;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "01 / 06", the project name and a playback bar, pinned to the bottom of a
 * slider stage. The text rises in afresh each time the active slide changes.
 */
export default function SlideCaption({ active, count, title, barRef, className = "" }: SlideCaptionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-caption='swap']",
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: "power3.out" },
        );
      });
    },
    { scope: rootRef, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <div
      ref={rootRef}
      aria-live="polite"
      className={`shell pointer-events-none absolute inset-x-0 bottom-[clamp(1.25rem,6vh,4rem)] flex items-end gap-6 ${className}`}
    >
      <p className="overflow-hidden font-display text-nav whitespace-nowrap text-blush">
        <span data-caption="swap" className="inline-block">
          {pad(active + 1)}
        </span>
        <span className="text-ink/40"> / {pad(count)}</span>
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="overflow-hidden text-[clamp(0.875rem,1.1vw,1.25rem)] leading-tight font-bold text-ink">
          <span data-caption="swap" className="inline-block truncate align-bottom">
            {title}
          </span>
        </p>
        <span aria-hidden className="block h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
          <span
            ref={barRef}
            className="block h-full w-full origin-left scale-x-0 rounded-full bg-grape"
          />
        </span>
      </div>
    </div>
  );
}
