"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { ambient } from "@/lib/ambient";
import { HERO_MOTION } from "@/lib/hero-motion";

gsap.registerPlugin(useGSAP);

/** Exported from Figma as `public/icons/hero-blob.svg`, inlined so GSAP can reach the path. */
const BLOB_PATH =
  "M1435.2 51.9869C1275.61 21.6354 1247.69 457.418 1088.12 426.941C990.224 408.244 985.403 214.075 887.414 231.958C793.944 249.015 813.99 401.569 736.859 470.173C524.925 658.68 260.881 -45.0799 94.9937 253.583C-145.927 687.336 675.948 713.136 536.312 1048.65C460.091 1231.8 157.462 1136.05 185.025 1339.86C226.478 1646.38 636.587 1230.48 792.285 1460.49C896.411 1614.32 748.533 1881.62 896.129 1961.17C1068.06 2053.84 1066.77 1626.73 1241.89 1544.09C1554.19 1396.73 1774.42 2266.23 2021.2 1983.85C2268.58 1700.8 1619.28 1356.43 1742.29 965.177C1801.96 775.389 2096.79 776.127 2037.11 586.34C1973.84 385.125 1713.72 685.447 1568.91 568.763C1424.99 452.785 1604.18 84.1238 1435.2 51.9869Z";

/** Stroke width of the visible ribbon, straight from the Figma export. */
const RIBBON_WIDTH = 100.942;

export default function HeroBlob() {
  const rootRef = useRef<SVGSVGElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const svg = rootRef.current;
      if (!svg) return;

      // GSAP owns the SVG's transform outright, so the base orientation is set
      // here rather than as a Tailwind `rotate-90` it would overwrite. This runs
      // before paint, and the group is hidden until the reveal, so there is no
      // flash of the un-rotated artwork.
      gsap.set(svg, { rotation: HERO_MOTION.blobRotation, transformOrigin: "50% 50%" });

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-blob='group']", { autoAlpha: HERO_MOTION.blobOpacity });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // The reveal moves the whole SVG — opacity and scale on its own
        // composited layer — so the ribbon (a 100px stroke cut into thousands
        // of 4px dashes) is rasterised once. It used to be traced on through
        // an animated mask, which re-rasterised all of it every frame for the
        // first 2.4s: the bulk of the desktop main-thread time at load.
        gsap.set("[data-hero-blob='group']", { autoAlpha: HERO_MOTION.blobOpacity });
        const tl = gsap.timeline();
        tl.fromTo(
          svg,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: HERO_MOTION.blobDraw * 0.6, ease: "power2.out" },
          0,
        );

        // Idle float, once the reveal has landed — only after the first
        // interaction and while the blob is on screen (see `ambient`). Like
        // the reveal it transforms the whole SVG, never the ribbon inside it.
        let stopIdle: (() => void) | undefined;
        tl.call(
          contextSafe!(() => {
            const float = gsap.to(svg, {
              rotation: HERO_MOTION.blobRotation + 1.5,
              scale: 1.03,
              duration: 7,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            stopIdle = ambient(float, svg);
          }),
          [],
          HERO_MOTION.blobDraw * 0.6,
        );
        return () => stopIdle?.();
      });
    },
    { scope: rootRef },
  );

  return (
    <svg
      ref={rootRef}
      aria-hidden
      focusable="false"
      viewBox="0 0 2128.4 2091.13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block w-[130%] max-w-none opacity-50"
    >
      <defs>
        <linearGradient
          id="hero-blob-stroke"
          x1="734.45"
          y1="1146.78"
          x2="2077.93"
          y2="1045.57"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#6A4B97" />
        </linearGradient>

      </defs>

      <g
        data-hero-blob="group"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <path
          d={BLOB_PATH}
          fill="none"
          stroke="url(#hero-blob-stroke)"
          strokeWidth={RIBBON_WIDTH}
          strokeDasharray="4.21 4.21"
        />
      </g>
    </svg>
  );
}
