"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import PopButton from "@/components/ui/PopButton";
import StudioCube from "@/components/ui/StudioCube";
import { addCubeEntry, V5_TRAVEL_VH, type CubeEntry } from "@/components/ui/studio-cube-entries";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADLINE = "We’re A Funky Creative Studio".split(" ");

/**
 * Looping ribbon in the hero blob's style: it enters bottom-left, loops around
 * the cube and sweeps out under the copy to the top-right.
 */
const RIBBON_PATH =
  "M-120 760C80 640 160 300 380 260C600 220 640 520 470 600C300 680 220 470 360 400C520 320 760 700 1000 720C1240 740 1300 420 1460 360C1560 320 1640 360 1720 300";
const RIBBON_WIDTH = 64;
/** The tracing mask must be wider than the ribbon or it shaves its edges. */
const TRACE_WIDTH = RIBBON_WIDTH * 1.4;
/** Normalised path length for the dash maths — see HeroBlob for why not 1. */
const TRACE_LENGTH = 1000;

/** Hand-drawn swoosh under the headline. */
const SWOOSH_PATH = "M4 30C120 6 260 4 420 14C520 20 600 30 676 22";

/** Floating service badges orbiting the cube. */
const BADGES = [
  { label: "Strategy", rotate: -8, exitX: -160, exitY: -120, className: "top-[4%] left-[2%] bg-sunbeam text-ink" },
  { label: "Branding", rotate: 6, exitX: 180, exitY: -60, className: "top-[38%] -right-[6%] bg-lagoon text-white" },
  { label: "Motion", rotate: -4, exitX: -120, exitY: 160, className: "bottom-[6%] left-[10%] bg-blush text-white" },
];

/**
 * Scrubbed timeline, in timeline units (the whole thing maps onto the sticky
 * scroll range, so only the proportions matter):
 *
 *   0.0  entry   — ribbon starts tracing
 *   0.4  cube    — enters (see `studio-cube-entries.ts`); tumbles with scroll until 7
 *   1.0  reveal  — headline words rise through their masks, badges pop
 *   3.0  detail  — swoosh draws, paragraph wipes in, CTA springs
 *   4.5  focus   — cube swells, badges drift
 *   7.0  exit    — words peel up, swoosh draws off, cube spins away
 */
type StudioSectionProps = {
  /** How the cube enters — TEMPORARY while the entrance versions are compared. */
  cubeEntry?: CubeEntry;
};

export default function StudioSection({ cubeEntry = "original" }: StudioSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const morph = cubeEntry === "v5";

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const badgeRotation = (_i: number, el: Element) =>
        Number((el as HTMLElement).dataset.rotate ?? 0);

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-studio='trace']"), { strokeDashoffset: 0 });
        gsap.set(q("[data-studio='swoosh']"), { strokeDashoffset: 0 });
        gsap.set(q("[data-studio='ribbon']"), { autoAlpha: 0.5 });
        gsap.set(q("[data-studio='badge']"), { rotation: badgeRotation });
      });

      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px)",
        },
        (context) => {
          const { motion } = context.conditions as { motion: boolean };
          if (!motion) return;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: rootRef.current,
              // Entry starts while the section is still sliding up into view,
              // so the stage is never empty when it sticks.
              start: "top 40%",
              // The pin is CSS `sticky`; ScrollTrigger only reports progress.
              end: "bottom bottom",
              scrub: 1,
              // The cube's off-screen start depends on the viewport width.
              invalidateOnRefresh: true,
              // Invalidating reverts every tween, but only the ones at the
              // playhead re-render — the headline, badges, copy and CTA start
              // later, so they would sit fully visible until scrolled into and
              // then snap hidden. Sweeping to the end and back re-renders them
              // all at the current progress. (`self.animation`, not `tl`: the
              // first refresh can fire while the timeline is being built.)
              onRefresh: (self) => {
                const anim = self.animation;
                if (!anim) return;
                const progress = anim.progress();
                anim.progress(1, true).progress(progress, true);
              },
            },
          });

          const cube = q("[data-studio='cube']");
          const words = q("[data-studio='word']");
          const badges = q("[data-studio='badge']");

          // ── Entry ────────────────────────────────────────────────
          addCubeEntry(tl, cubeEntry, q, 0.4);

          tl.fromTo(
            q("[data-studio='trace']"),
            { strokeDashoffset: TRACE_LENGTH },
            { strokeDashoffset: 0, duration: 7, ease: "none" },
            0,
          )
            .fromTo(
              q("[data-studio='ribbon']"),
              { autoAlpha: 0 },
              { autoAlpha: 0.5, duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              q("[data-studio='glow']"),
              { autoAlpha: 0, scale: 0.3 },
              { autoAlpha: 1, scale: 1, duration: 2.5 },
              0,
            )
            // ── Reveal ───────────────────────────────────────────────
            .fromTo(
              words,
              { yPercent: 115, rotation: 7 },
              { yPercent: 0, rotation: 0, duration: 1.5, stagger: 0.25, ease: "power4.out" },
              1,
            )
            .fromTo(
              badges,
              { autoAlpha: 0, scale: 0, rotation: (i, el) => badgeRotation(i, el) - 40 },
              {
                autoAlpha: 1,
                scale: 1,
                rotation: badgeRotation,
                duration: 1,
                stagger: 0.35,
                ease: "back.out(2.2)",
              },
              2,
            )

            // ── Detail ───────────────────────────────────────────────
            .fromTo(
              q("[data-studio='swoosh']"),
              { strokeDashoffset: TRACE_LENGTH },
              { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
              2.8,
            )
            .fromTo(
              q("[data-studio='copy']"),
              { clipPath: "inset(0% 100% 0% 0%)", y: 24 },
              { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.5, ease: "power2.out" },
              3,
            )
            .fromTo(
              q("[data-studio='cta']"),
              { autoAlpha: 0, scale: 0.4, rotation: -12 },
              { autoAlpha: 1, scale: 1, rotation: 0, duration: 1, ease: "back.out(2)" },
              3.6,
            )

            // ── Focus ────────────────────────────────────────────────
            .to(cube, { scale: 1.08, duration: 2.5, ease: "sine.inOut" }, 4.5)
            .to(
              badges,
              { yPercent: (i) => [-60, 40, -30][i] ?? 0, duration: 2.5, ease: "sine.inOut" },
              4.5,
            )

          // ── Exit ─────────────────────────────────────────────────
          // .to(
          //   words,
          //   { yPercent: -115, rotation: -6, duration: 1.2, stagger: 0.15, ease: "power2.in" },
          //   7,
          // )
          // .to(
          //   q("[data-studio='swoosh']"),
          //   { strokeDashoffset: -TRACE_LENGTH, duration: 1, ease: "power2.in" },
          //   7,
          // )
          // .to(
          //   badges,
          //   {
          //     x: (_i, el) => Number((el as HTMLElement).dataset.exitX ?? 0),
          //     y: (_i, el) => Number((el as HTMLElement).dataset.exitY ?? 0),
          //     autoAlpha: 0,
          //     duration: 1.2,
          //     stagger: 0.1,
          //     ease: "power2.in",
          //   },
          //   7.2,
          // )
          // .to(
          //   q("[data-studio='copy']"),
          //   { clipPath: "inset(0% 0% 0% 100%)", y: -24, duration: 1.2, ease: "power2.in" },
          //   7.4,
          // )
          // .to(
          //   q("[data-studio='cta']"),
          //   { autoAlpha: 0, scale: 0.4, rotation: 12, duration: 0.8, ease: "power2.in" },
          //   7.8,
          // )
          // .to(
          //   cube,
          //   {
          //     rotation: 160,
          //     scale: 0.4,
          //     xPercent: mobile ? 0 : -60,
          //     yPercent: mobile ? -60 : 0,
          //     autoAlpha: 0,
          //     duration: 2.2,
          //     ease: "power2.in",
          //   },
          //   7.6,
          // )
          // .to(q("[data-studio='glow']"), { autoAlpha: 0, scale: 1.6, duration: 2 }, 8)
          // .to(q("[data-studio='ribbon']"), { autoAlpha: 0, duration: 1, ease: "none" }, 9);
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      id="studio"
      ref={rootRef}
      className="relative h-[240vh] md:h-[300vh] motion-reduce:h-auto"
      // V5: tucked up under the slider, whose pinned stage carries the video
      // cube down over this section as it scrolls in.
      style={morph ? { marginTop: `-${V5_TRAVEL_VH}vh` } : undefined}
    >
      <div className="sticky top-0 isolate flex h-svh items-center overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:py-[clamp(4rem,10vw,12rem)]">
        {/* Background ribbon, drawn on via a tracing mask like the hero blob. */}
        <svg
          aria-hidden
          focusable="false"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        >
          <defs>
            <linearGradient
              id="studio-ribbon-stroke"
              x1="0"
              y1="450"
              x2="1600"
              y2="450"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="#6A4B97" />
            </linearGradient>
            <mask
              id="studio-ribbon-reveal"
              maskUnits="userSpaceOnUse"
              x={-400}
              y={-200}
              width={2400}
              height={1300}
            >
              <path
                data-studio="trace"
                d={RIBBON_PATH}
                stroke="white"
                strokeWidth={TRACE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={TRACE_LENGTH}
                strokeDasharray={TRACE_LENGTH}
              />
            </mask>
          </defs>
          <g data-studio="ribbon" mask="url(#studio-ribbon-reveal)" opacity={0.5}>
            <path
              d={RIBBON_PATH}
              stroke="url(#studio-ribbon-stroke)"
              strokeWidth={RIBBON_WIDTH}
              strokeDasharray="4.21 4.21"
            />
          </g>
        </svg>

        <div className="shell flex flex-col items-center gap-8 md:flex-row md:gap-10">
          {/* Container for the cube's `cqw` sizing — its depth scales with it. */}
          <div className="@container relative flex w-[60%] justify-center md:w-[30%]">
            <Image
              data-studio="glow"
              src="/icons/hero-ellipse-glow.svg"
              alt=""
              aria-hidden
              width={2128}
              height={2128}
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[220%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70 [mask-image:radial-gradient(circle,black_30%,transparent_65%)]"
            />
            <StudioCube video={morph} />

            {BADGES.map((badge) => (
              <span
                key={badge.label}
                data-studio="badge"
                data-rotate={badge.rotate}
                data-exit-x={badge.exitX}
                data-exit-y={badge.exitY}
                aria-hidden
                className={`absolute rounded-full border-2 border-ink px-[0.9em] py-[0.35em] font-display text-nav whitespace-nowrap uppercase shadow-card ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <div className="flex w-full flex-col items-start gap-8 md:w-[70%]">
            <h2 className="relative font-display text-hero-sm leading-[1.09] text-blush">
              {HEADLINE.map((word, i) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-studio="word" className="inline-block origin-bottom-left">
                    {word}
                    {i < HEADLINE.length - 1 && " "}
                  </span>
                </span>
              ))}
              <svg
                aria-hidden
                focusable="false"
                viewBox="0 0 680 36"
                fill="none"
                className="pointer-events-none absolute -bottom-[0.25em] left-0 w-[70%]"
              >
                <path
                  data-studio="swoosh"
                  d={SWOOSH_PATH}
                  stroke="var(--color-grape)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  pathLength={TRACE_LENGTH}
                  strokeDasharray={TRACE_LENGTH}
                />
              </svg>
            </h2>
            <p
              data-studio="copy"
              className="max-w-[34rem] text-body leading-[1.64] text-ink capitalize"
            >
              From strategy to execution, we offer a full suite of creative services
              designed to elevate your brand and captivate your audience.
            </p>
            <div data-studio="cta" className="origin-left">
              <PopButton href="#contact" label="Start a Project" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
