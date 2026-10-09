"use client";

import gsap from "gsap";
import { Fragment, useRef } from "react";

import Breadcrumb from "@/components/inner/Breadcrumb";
import { rand } from "@/components/inner/motion/kit";
import { usePopHero } from "@/components/inner/motion/usePopHero";
import { workHero } from "@/lib/pages/work";

/** Confetti thrown when the badge bursts on the way out. */
const BURST_PIECES = 14;
const BURST_TONES = ["bg-blush", "bg-lagoon", "bg-sunbeam", "bg-grape"];

/** Each letter in its own inline-block (words kept whole so lines wrap cleanly). */
function Chars({ text }: { text: string }) {
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 ? " " : null}
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((ch, c) => (
          <span key={c} data-whero="char" className="inline-block">
            {ch}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

/*
  Hero of Figma frame 333:21. "SELECTED" and "WORK THAT" start 495px into the
  frame, "POPS OFF" at 324px; the yellow count badge sits in the same grid
  cell, pinned to the right edge.

  Motion: the shared pop hero (see `usePopHero`), plus the badge — it stamps
  in spinning at 1.45s and counts up to the project total, and on the way out
  it strains, wobbles and bursts into a ring and confetti.
*/
export default function Hero() {
  const [l1, l2, l3] = workHero.lines;
  const rootRef = useRef<HTMLElement>(null);

  usePopHero(rootRef, {
    entrance: (tl, q) => {
      const count = q("[data-whero='count']")[0] as HTMLElement | undefined;
      const counter = { value: 0 };
      const total = workHero.count;
      // `rotate-[10deg]` is the CSS `rotate` property, which adds to GSAP's
      // transform — so the stamp lands at a GSAP rotation of 0.
      gsap.set(q("[data-whero='badge']"), { autoAlpha: 0, scale: 0, rotation: -200 });
      if (count) count.textContent = "0";
      tl.to(
        q("[data-whero='badge']"),
        {
          keyframes: [
            { autoAlpha: 1, scale: 1.25, rotation: 0, duration: 0.45, ease: "back.out(1.6)" },
            { scale: 0.92, duration: 0.12, ease: "power2.in" },
            { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.45)" },
          ],
        },
        1.45,
      ).to(
        counter,
        {
          value: total,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            if (count) count.textContent = String(Math.round(counter.value));
          },
        },
        1.55,
      );
      return () => {
        if (count) count.textContent = String(total);
      };
    },
    exit: (out, q) => {
      // The badge strains…
      out
        .to(
          q("[data-whero='badge-out']"),
          {
            keyframes: [
              { scale: 1.12, rotation: -8, duration: 0.14 },
              { scale: 1.2, rotation: 7, duration: 0.12 },
              { scale: 1.3, rotation: -4, duration: 0.1 },
            ],
          },
          0,
        )
        // …and bursts.
        .to(q("[data-whero='badge-pop']"), { scale: 0, opacity: 0, duration: 0.06 }, 0.36);
      const ring = q("[data-whero='burst-ring']");
      const pieces = q("[data-whero='burst-piece']");
      const reach = () => ((q("[data-whero='badge-out']")[0] as HTMLElement | undefined)?.offsetWidth ?? 160) * 1.3;
      out
        .set(ring, { scale: 0.4, opacity: 1 }, 0.36)
        .to(ring, { scale: 2.4, opacity: 0, duration: 0.3, ease: "power2.out" }, 0.36)
        .set(pieces, { x: 0, y: 0, rotation: 0, scale: 1.2, opacity: 1 }, 0.36)
        .to(
          pieces,
          {
            x: (i) => Math.cos((i / pieces.length) * Math.PI * 2 + rand(i) * 0.5) * reach() * (0.6 + rand(i, 2) * 0.6),
            y: (i) => Math.sin((i / pieces.length) * Math.PI * 2 + rand(i) * 0.5) * reach() * (0.6 + rand(i, 2) * 0.6),
            rotation: (i) => (rand(i, 3) - 0.5) * 720,
            scale: 0.3,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          0.36,
        );
    },
  });

  return (
    <section ref={rootRef} aria-labelledby="work-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div
        aria-hidden
        data-whero="glow-out"
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)]"
      >
        <div
          data-whero="glow"
          className="absolute inset-0 bg-[radial-gradient(ellipse_30%_34%_at_50%_8%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_38%_22%_at_49%_66%,rgb(159_201_204/0.5),transparent_75%)]"
        />
      </div>

      <div data-whero="crumb-out" className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <div data-whero="crumb">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
        </div>
      </div>

      <div className="shell mt-[clamp(1.5rem,3.1vw,3.75rem)] grid">
        <h1 id="work-title" aria-label={`${l1} ${l2} ${l3}`} className="col-start-1 row-start-1 uppercase">
          <span aria-hidden className="block">
            <span
              data-whero-line="1"
              className="block font-display text-hero-sm leading-[1.07] text-blush-ink sm:ml-[min(17.1vw,20.5625rem)]"
            >
              <Chars text={l1} />
            </span>
            <span
              data-whero-line="2"
              className="block font-haas text-hero-md leading-[1.14] tracking-[-0.03em] text-grape sm:ml-[min(17.1vw,20.5625rem)]"
            >
              <Chars text={l2} />
            </span>
            <span
              data-whero-line="3"
              className="block font-display text-[clamp(2.25rem,6.67vw,8rem)] leading-[1.17] text-lagoon sm:ml-[min(8.2vw,9.875rem)]"
            >
              <Chars text={l3} />
            </span>
          </span>
        </h1>

        {/* Ships hidden like the lines (`reveal`), so it doesn't flash before the entrance. */}
        <div
          data-whero="badge-out"
          data-whero-reveal
          className="invisible relative col-start-1 row-start-1 mt-[clamp(0rem,2.6vw,3.125rem)] mr-[1.25vw] self-start justify-self-end max-sm:-mt-6"
        >
          <div data-whero="badge-pop">
            <p
              data-whero="badge"
              className="grid size-[clamp(5.5rem,8.85vw,10.625rem)] rotate-[10deg] content-center justify-items-center rounded-full bg-sunbeam text-ink"
            >
              <span data-whero="count" className="font-pop text-[clamp(2.75rem,4.69vw,5.625rem)] leading-[1.05] tabular-nums">
                {workHero.count}
              </span>
              <span className="font-display text-[clamp(0.625rem,0.83vw,1rem)] uppercase">Projects</span>
            </p>
          </div>

          {/* The badge's burst on the way out, hidden until then. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <span
              data-whero="burst-ring"
              className="absolute inset-0 rounded-full border-[5px] border-solid border-sunbeam opacity-0"
            />
            {Array.from({ length: BURST_PIECES }, (_, i) => (
              <span
                key={i}
                data-whero="burst-piece"
                className={`absolute top-1/2 left-1/2 opacity-0 ${BURST_TONES[i % BURST_TONES.length]} ${
                  i % 2 ? "-mt-1 -ml-2.5 h-2 w-5 rounded-sm" : "-mt-2 -ml-2 size-4 rounded-full"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
