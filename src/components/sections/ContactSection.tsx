"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef, type CSSProperties } from "react";

import {
  CONTACT_EXIT_VH,
  CONTACT_HOLD_VH,
  CONTACT_TUCK_VH,
  CONTACT_UNWIND_VH,
} from "@/components/sections/agency-motion";
import { deferSetup } from "@/lib/defer-setup";
import PopButton from "@/components/ui/PopButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EYEBROW = "Let’s Build Something";
const HEADLINE = ["Extraordinary", "Together"];
const COPY =
  "Whether you need a complete brand overhaul, a high-converting web experience, or a full-scale marketing campaign, our team of experts is ready to execute. Tell us about your goals, and let’s turn your vision into reality.";

/** Stable pseudo-random 0–1 per index. */
const rand = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/*
 * The entrance and the exit each move their own element: the exit drives an
 * `*-out` wrapper around what the entrance drives. Both are scrubbed with a
 * little lag, so on a quick scroll the entrance can still be catching up
 * after the exit has started; sharing one element, the entrance's last
 * frames would land on top of the exit and put things back on screen.
 */

/** Letters as separate inline-blocks (words kept whole so lines wrap cleanly). */
function Letters({ text, hook }: { text: string; hook: string }) {
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 ? " " : null}
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((ch, c) => (
          <span key={c} data-contact={`${hook}-out`} className="inline-block">
            <span data-contact={hook} className="inline-block">
              {ch}
            </span>
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

/**
 * Tucked up under the Agency section's exit (see `agency-motion.ts`) and held
 * there (sticky), so its screen is the one the Agency folder has just popped
 * on. Scrubbed while it holds: the eyebrow's letters pop in, the headline
 * bounces in letter by letter, the paragraph rises in word by word and the
 * button pops. Where Our Story pins (`stage:`) it then plays back out and
 * hands its screen to Our Story the same way.
 */
export default function ContactSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      // Far below the fold: set up in its own short task after load rather
      // than in the initial commit (see deferSetup).
      return deferSetup(
        contextSafe!(() => {
        const section = rootRef.current;
        if (!section) return;
        const q = gsap.utils.selector(section);
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              // Held from when its top reaches the top of the screen for the
              // spacer's length; the entrance gets most of it, then a beat.
              start: "top top",
              end: () => `top -${CONTACT_HOLD_VH * 0.85}%`,
              scrub: 0.8,
            },
          });

          tl.fromTo(
            q("[data-contact='eyebrow']"),
            { scale: 0, autoAlpha: 0, rotation: (i) => (rand(i, 3) - 0.5) * 40 },
            { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.35, stagger: 0.025, ease: "back.out(3)" },
            0,
          )
            .fromTo(
              q("[data-contact='letter']"),
              {
                yPercent: -160,
                autoAlpha: 0,
                rotation: (i) => (rand(i, 5) - 0.5) * 50,
                transformOrigin: "50% 100%",
              },
              {
                yPercent: 0,
                autoAlpha: 1,
                rotation: 0,
                duration: 0.7,
                stagger: 0.045,
                ease: "bounce.out",
              },
              0.25,
            )
            .fromTo(
              q("[data-contact='word']"),
              { yPercent: 110, rotation: 6 },
              { yPercent: 0, rotation: 0, duration: 0.5, stagger: 0.02, ease: "back.out(2)" },
              0.9,
            )
            .fromTo(
              q("[data-contact='cta']"),
              { scale: 0, rotation: -25, autoAlpha: 0 },
              { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(2.4)" },
              1.6,
            );
        });

        // Exit into Our Story — only where Our Story pins (`stage:`): still
        // held, everything plays back out, last in first out, leaving an empty
        // screen for Our Story tucked up underneath. Every tween starts from
        // the entrance's end state with `immediateRender: false`.
        media.add(
          "(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 43rem)",
          () => {
            const off = { immediateRender: false } as const;
            const exit = gsap.timeline({
              defaults: { ease: "power2.in" },
              scrollTrigger: {
                trigger: section,
                start: () => `top -${CONTACT_HOLD_VH}%`,
                end: () => `top -${CONTACT_HOLD_VH + CONTACT_UNWIND_VH}%`,
                scrub: 0.8,
              },
            });

            // The button spins away…
            exit
              .fromTo(
                q("[data-contact='cta-out']"),
                { scale: 1, rotation: 0, autoAlpha: 1 },
                { scale: 0, rotation: 25, autoAlpha: 0, duration: 0.4, ease: "back.in(2)", ...off },
                0,
              )
              // …the paragraph drops out, last word first…
              .fromTo(
                q("[data-contact='word-out']"),
                { yPercent: 0, rotation: 0 },
                { yPercent: 110, rotation: 6, duration: 0.4, stagger: { each: 0.012, from: "end" }, ...off },
                0.1,
              )
              // …and the eyebrow pops out, letter by letter.
              .fromTo(
                q("[data-contact='eyebrow-out']"),
                { scale: 1, autoAlpha: 1 },
                { scale: 0, autoAlpha: 0, duration: 0.25, stagger: { each: 0.025, from: "end" }, ease: "back.in(3)", ...off },
                1.0,
              )
              .to({}, { duration: 0.1 });

            // The headline's letters lose their footing one by one and tumble
            // off the bottom of the screen, fading as they go — gone, rather
            // than parked below it, where they'd show again once the section
            // scrolls on.
            q("[data-contact='letter-out']").forEach((letter, i) => {
              const at = 0.45 + rand(i, 9) * 0.5;
              exit
                .fromTo(
                  letter,
                  { y: 0, rotation: 0 },
                  {
                    y: () => window.innerHeight * 0.9,
                    rotation: (rand(i, 7) - 0.5) * 160,
                    duration: 0.7,
                    ease: "power2.in",
                    ...off,
                  },
                  at,
                )
                .fromTo(letter, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "power1.in", ...off }, at + 0.4);
            });
          },
        );
        }),
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      id="contact"
      ref={rootRef}
      // Tucked up under the Agency exit — only with motion; under reduced
      // motion nothing pins, so nothing overlaps. pointer-events-none: the
      // section's box covers the Agency stage while that plays out; the
      // button turns them back on.
      className="pointer-events-none relative isolate motion-safe:-mt-[var(--tuck)]"
      style={{ "--tuck": `${CONTACT_TUCK_VH}vh` } as CSSProperties}
    >
      <div className="flex flex-col justify-center pt-[clamp(3rem,7vw,8rem)] motion-safe:sticky motion-safe:top-0 motion-safe:min-h-svh motion-safe:pt-0">
        <div className="shell flex flex-col gap-y-8 lg:flex-row lg:items-start lg:gap-x-16">
          <header className="flex min-w-0 flex-col gap-2">
            <p className="text-eyebrow leading-none font-bold text-blush uppercase">
              {/* A paragraph can't carry aria-label: the readable text is visually hidden instead. */}
              <span className="sr-only">{EYEBROW}</span>
              <span aria-hidden>
                <Letters text={EYEBROW} hook="eyebrow" />
              </span>
            </p>
            <h2
              aria-label={HEADLINE.join(" ")}
              className="font-display text-section leading-[0.99] break-words text-grape uppercase"
            >
              <span aria-hidden>
                {HEADLINE.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 ? <br /> : null}
                    <Letters text={line} hook="letter" />
                  </Fragment>
                ))}
              </span>
            </h2>
          </header>

          <div className="flex min-w-0 max-w-[38rem] flex-col items-start gap-8">
            <p className="text-body leading-[1.64] text-ink capitalize">
              {COPY.split(" ").map((word, i) => (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden align-bottom">
                    <span data-contact="word-out" className="inline-block">
                      <span data-contact="word" className="inline-block">
                        {word}
                      </span>
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </p>
            <div data-contact="cta-out" className="pointer-events-auto">
              <div data-contact="cta">
                <PopButton href="mailto:hello@pixelpopers.com" label="Schedule a Strategy Call" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The stretch of scroll it stays held for, alongside the Agency stage… */}
      <div aria-hidden className="motion-reduce:hidden" style={{ height: `${CONTACT_HOLD_VH}vh` }} />
      {/* …and then for its exit into Our Story (only where that pins). */}
      <div aria-hidden className="hidden motion-safe:stage:block" style={{ height: `${CONTACT_EXIT_VH}vh` }} />
    </section>
  );
}
