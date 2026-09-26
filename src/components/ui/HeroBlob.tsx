"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { HERO_MOTION } from "@/lib/hero-motion";

gsap.registerPlugin(useGSAP);

/** Exported from Figma as `public/icons/hero-blob.svg`, inlined so GSAP can reach the path. */
const BLOB_PATH =
  "M1435.2 51.9869C1275.61 21.6354 1247.69 457.418 1088.12 426.941C990.224 408.244 985.403 214.075 887.414 231.958C793.944 249.015 813.99 401.569 736.859 470.173C524.925 658.68 260.881 -45.0799 94.9937 253.583C-145.927 687.336 675.948 713.136 536.312 1048.65C460.091 1231.8 157.462 1136.05 185.025 1339.86C226.478 1646.38 636.587 1230.48 792.285 1460.49C896.411 1614.32 748.533 1881.62 896.129 1961.17C1068.06 2053.84 1066.77 1626.73 1241.89 1544.09C1554.19 1396.73 1774.42 2266.23 2021.2 1983.85C2268.58 1700.8 1619.28 1356.43 1742.29 965.177C1801.96 775.389 2096.79 776.127 2037.11 586.34C1973.84 385.125 1713.72 685.447 1568.91 568.763C1424.99 452.785 1604.18 84.1238 1435.2 51.9869Z";

/** Stroke width of the visible ribbon, straight from the Figma export. */
const RIBBON_WIDTH = 100.942;
/** The tracing mask must be wider than the ribbon or it shaves its edges. */
const TRACE_WIDTH = RIBBON_WIDTH * 1.4;
/**
 * `pathLength` normalises the path for dash maths, so the trace needs no
 * getTotalLength() measurement and stays SSR-safe. It must NOT be 1: GSAP
 * rounds px values, which would leave the tween only two integer steps and
 * snap 1 -> 0 at the midpoint instead of easing. 1000 gives ample resolution.
 */
const TRACE_LENGTH = 1000;

export default function HeroBlob() {
  const rootRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = rootRef.current;
      if (!svg) return;

      // GSAP owns the SVG's transform outright, so the base orientation is set
      // here rather than as a Tailwind `rotate-90` it would overwrite. This runs
      // before paint, and the group is hidden until the reveal, so there is no
      // flash of the un-rotated artwork.
      gsap.set(svg, { rotation: HERO_MOTION.blobRotation, transformOrigin: "50% 50%" });

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-blob='trace']", { strokeDashoffset: 0 });
        gsap.set("[data-hero-blob='group']", { autoAlpha: HERO_MOTION.blobOpacity });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();

        // Runs against the normalised TRACE_LENGTH, so no getTotalLength()
        // measurement is needed and the markup can ship already hidden.
        tl.fromTo(
          "[data-hero-blob='trace']",
          { strokeDashoffset: TRACE_LENGTH },
          { strokeDashoffset: 0, duration: HERO_MOTION.blobDraw, ease: "power1.inOut" },
          0,
        ).to(
          "[data-hero-blob='group']",
          { autoAlpha: HERO_MOTION.blobOpacity, duration: HERO_MOTION.blobFade, ease: "power2.out" },
          0,
        );

        // Idle float, handed off once the trace lands. It transforms the whole
        // SVG rather than the masked group so the mask is not re-rasterised
        // every frame.
        tl.to(
          svg,
          {
            rotation: HERO_MOTION.blobRotation + 1.5,
            scale: 1.03,
            duration: 7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
          HERO_MOTION.blobDraw,
        );
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

        {/*
          The ribbon's own `strokeDasharray` is what gives it its combed
          texture, so it cannot double as a draw-on. A second, solid path
          masks it instead: tracing the mask reveals the ribbon while leaving
          its dash pattern untouched.
        */}
        <mask
          id="hero-blob-reveal"
          maskUnits="userSpaceOnUse"
          x={-TRACE_WIDTH}
          y={-TRACE_WIDTH}
          width={2128.4 + TRACE_WIDTH * 2}
          height={2091.13 + TRACE_WIDTH * 2}
        >
          <path
            data-hero-blob="trace"
            d={BLOB_PATH}
            fill="none"
            stroke="white"
            strokeWidth={TRACE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={TRACE_LENGTH}
            strokeDasharray={TRACE_LENGTH}
            // Starts fully offset so the blob is hidden in the SSR markup —
            // there is nothing to flash before GSAP takes over.
            strokeDashoffset={TRACE_LENGTH}
          />
        </mask>
      </defs>

      <g
        data-hero-blob="group"
        mask="url(#hero-blob-reveal)"
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
