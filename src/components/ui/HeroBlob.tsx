"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { ambient } from "@/lib/ambient";
import { safeIn } from "@/lib/gsap-safe";
import { HERO_MOTION } from "@/lib/hero-motion";
import { holdForIntro } from "@/lib/visitor";

gsap.registerPlugin(useGSAP);

/** Exported from Figma as `public/icons/hero-blob.svg`, inlined so GSAP can reach the path. */
const BLOB_PATH =
  "M1435.2 51.9869C1275.61 21.6354 1247.69 457.418 1088.12 426.941C990.224 408.244 985.403 214.075 887.414 231.958C793.944 249.015 813.99 401.569 736.859 470.173C524.925 658.68 260.881 -45.0799 94.9937 253.583C-145.927 687.336 675.948 713.136 536.312 1048.65C460.091 1231.8 157.462 1136.05 185.025 1339.86C226.478 1646.38 636.587 1230.48 792.285 1460.49C896.411 1614.32 748.533 1881.62 896.129 1961.17C1068.06 2053.84 1066.77 1626.73 1241.89 1544.09C1554.19 1396.73 1774.42 2266.23 2021.2 1983.85C2268.58 1700.8 1619.28 1356.43 1742.29 965.177C1801.96 775.389 2096.79 776.127 2037.11 586.34C1973.84 385.125 1713.72 685.447 1568.91 568.763C1424.99 452.785 1604.18 84.1238 1435.2 51.9869Z";

/** Stroke width of the visible ribbon, straight from the Figma export. */
const RIBBON_WIDTH = 100.942;
const VIEW_W = 2128.4;
const VIEW_H = 2091.13;
/** How long the ribbon takes to draw itself on. */
const DRAW_SECONDS = 2.2;

/**
 * The draw-on runs on a canvas, not the SVG. The ribbon is a 100px stroke
 * cut into thousands of 4px dashes; revealing the SVG through an animated
 * mask re-rasterised every dash on every frame (it once dominated the page's
 * main-thread time). Here the dashed ribbon is painted once into an offscreen
 * canvas, and each frame only strokes one thick reveal line and composites
 * that bitmap through it. When the line is complete the crisp SVG takes over.
 */
function makeRibbonDrawer(canvas: HTMLCanvasElement, box: DOMRect) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const scale = Math.min((box.width * dpr) / VIEW_W, 2600 / VIEW_W);
  const w = Math.round(VIEW_W * scale);
  const h = Math.round(VIEW_H * scale);
  canvas.width = w;
  canvas.height = h;
  const out = canvas.getContext("2d");
  if (!out) return null;

  const path = new Path2D(BLOB_PATH);
  const cache = document.createElement("canvas");
  cache.width = w;
  cache.height = h;
  const c = cache.getContext("2d");
  if (!c) return null;
  c.setTransform(scale, 0, 0, scale, 0, 0);
  const gradient = c.createLinearGradient(734.45, 1146.78, 2077.93, 1045.57);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "#6A4B97");
  c.strokeStyle = gradient;
  c.lineWidth = RIBBON_WIDTH;
  c.setLineDash([4.21, 4.21]);
  c.stroke(path);

  // The blob path's length in viewBox units, for the reveal's dash maths.
  const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
  probe.setAttribute("d", BLOB_PATH);
  const length = probe.getTotalLength();

  return (progress: number) => {
    out.setTransform(1, 0, 0, 1, 0, 0);
    out.globalCompositeOperation = "source-over";
    out.clearRect(0, 0, w, h);
    if (progress <= 0) return;
    out.setTransform(scale, 0, 0, scale, 0, 0);
    out.lineWidth = RIBBON_WIDTH * 1.4; // wider than the ribbon, so its edges aren't shaved
    out.lineCap = "round";
    out.lineJoin = "round";
    out.setLineDash([length * progress, length]);
    out.strokeStyle = "#000";
    out.stroke(path);
    out.globalCompositeOperation = "source-in";
    out.setTransform(1, 0, 0, 1, 0, 0);
    out.globalAlpha = HERO_MOTION.blobOpacity;
    out.drawImage(cache, 0, 0);
    out.globalAlpha = 1;
  };
}

export default function HeroBlob() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;

      // GSAP owns the blob's transform outright, so the base orientation is set
      // here rather than as a Tailwind `rotate-90` it would overwrite. This runs
      // before paint, and the ribbon is hidden until the reveal, so there is no
      // flash of the un-rotated artwork.
      gsap.set(root, { rotation: HERO_MOTION.blobRotation, transformOrigin: "50% 50%" });
      const group = root.querySelector("[data-hero-blob='group']");

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(group, { autoAlpha: HERO_MOTION.blobOpacity });
      });

      media.add("(prefers-reduced-motion: no-preference)", (branch) => {
        const draw = makeRibbonDrawer(canvas, root.getBoundingClientRect());
        if (!draw) {
          gsap.set(group, { autoAlpha: HERO_MOTION.blobOpacity });
          return;
        }
        gsap.set(group, { autoAlpha: 0 });
        gsap.set(canvas, { autoAlpha: 1 });
        draw(0);

        const state = { p: 0 };
        let stopIdle: (() => void) | undefined;
        const tl = gsap.timeline();
        tl.fromTo(root, { scale: 0.94 }, { scale: 1, duration: DRAW_SECONDS + 0.4, ease: "power2.out" }, 0)
          // The ribbon draws itself on along its path…
          .to(state, { p: 1, duration: DRAW_SECONDS, ease: "power2.inOut", onUpdate: () => draw(state.p) }, 0.15)
          // …then the crisp vector takes over from the bitmap.
          .set(group, { autoAlpha: HERO_MOTION.blobOpacity })
          .set(canvas, { autoAlpha: 0 })
          // Idle float — only after the first interaction and while the blob is
          // on screen (see `ambient`). It transforms the whole blob, never the
          // ribbon inside it.
          .call(
            safeIn(branch)(() => {
              const float = gsap.to(root, {
                rotation: HERO_MOTION.blobRotation + 1.5,
                scale: 1.03,
                duration: 7,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              });
              stopIdle = ambient(float, root);
            }),
          );
        // On a first visit the welcome intro is up: the ribbon draws as it leaves.
        const release = holdForIntro(tl);
        return () => {
          release();
          stopIdle?.();
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden className="relative block w-[130%] max-w-none opacity-50">
      <svg focusable="false" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full">
        <defs>
          <linearGradient id="hero-blob-stroke" x1="734.45" y1="1146.78" x2="2077.93" y2="1045.57" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#6A4B97" />
          </linearGradient>
        </defs>

        <g data-hero-blob="group" style={{ opacity: 0, visibility: "hidden" }}>
          <path d={BLOB_PATH} fill="none" stroke="url(#hero-blob-stroke)" strokeWidth={RIBBON_WIDTH} strokeDasharray="4.21 4.21" />
        </g>
      </svg>
      {/* The draw-on animation (see makeRibbonDrawer); hidden once the SVG takes over. */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" style={{ opacity: 0, visibility: "hidden" }} />
    </div>
  );
}
