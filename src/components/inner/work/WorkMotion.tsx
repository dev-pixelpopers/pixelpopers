"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import {
  all,
  closingCta,
  headingIn,
  one,
  paragraphs,
  quoteCards,
  scrubbed,
  statsBand,
  tipInCards,
} from "@/components/inner/motion/kit";
import { idleSetup } from "@/lib/defer-setup";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Coming soon: the cards rise out of a blur; the pills never stop wobbling. */
function teasers(section: HTMLElement) {
  const items = all(section, "[data-wm='teaser']");
  if (!items.length) return;
  const soon = all(section, "[data-wm='soon']");
  scrubbed(items[0].parentElement!, "top 92%", "top 45%")
    .fromTo(
      items,
      { y: 120, scale: 0.9, filter: "blur(18px)", autoAlpha: 0 },
      { y: 0, scale: 1, filter: "blur(0px)", autoAlpha: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
      0,
    )
    .fromTo(soon, { scale: 0 }, { scale: 1, duration: 0.5, stagger: 0.15, ease: "back.out(2.6)" }, 0.6);
  // Idle: "coming soon" jiggles like it can't wait.
  gsap.fromTo(soon, { rotation: -4 }, { rotation: 4, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.3 });
}

/**
 * The Work page's scroll motion for everything below the project grid (the
 * hero, the grid and the folder section animate themselves). Built from the
 * shared inner-page kit; reduced motion gets none of it.
 */
export default function WorkMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const scope = root.current;
      if (!scope) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: (void | (() => void))[] = [];
        // One idle task per section instead of one long task at hydration
        // (see idleSetup).
        const later = (job: () => void) => cleanups.push(idleSetup(contextSafe!(job)));

        later(() => all(scope, "[data-wm='heading']").forEach(headingIn));
        later(() => {
          const intro = one(scope, "[data-wm='intro']");
          if (!intro) return;
          paragraphs(intro);
          const list = one(intro, "[data-wm='success']");
          if (list) tipInCards(list, "[data-wm='success-card']");
        });
        later(() => {
          const band = one(scope, "[data-wm='band']");
          if (band) cleanups.push(statsBand(band));
        });
        later(() => {
          const quotes = one(scope, "[data-wm='quotes']");
          if (quotes) quoteCards(quotes);
        });
        later(() => {
          const oven = one(scope, "[data-wm='teasers']");
          if (oven) teasers(oven);
        });
        later(() => {
          const cta = one(scope, "[data-wm='cta']");
          if (cta) closingCta(cta);
        });

        return () => cleanups.forEach((c) => c?.());
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
