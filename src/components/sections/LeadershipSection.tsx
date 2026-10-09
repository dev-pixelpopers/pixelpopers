"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";

import { deferSetup } from "@/lib/defer-setup";
import { LEADERSHIP_TUCK_VH } from "@/components/sections/agency-motion";
import BrandLogo from "@/components/ui/BrandLogo";
import SplitWords from "@/components/ui/SplitWords";
import { owners, studioStats, type Owner } from "@/lib/site-content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const accentRing: Record<Owner["accent"], string> = {
  blush: "ring-blush",
  lagoon: "ring-lagoon",
  sunbeam: "ring-sunbeam",
};

const statTones = ["text-blush-ink", "text-lagoon-ink", "text-sunbeam-ink"];

const HEADLINE = "Three Friends. One Loud Idea.";
const STORY =
  "Pixel Popers started at a kitchen table with a simple belief: brands deserve to be felt, not just seen. Today we are a full-service crew of strategists, designers and developers who obsess over the details that make people stop scrolling — and keep coming back.";
const PHILOSOPHY = "Strategy first. Craft always. Never boring.";

/**
 * Leadership & story. The stage holds in a sticky 100vh frame while the reader
 * takes it in; the entrance plays once the section scrolls into view and
 * reverses only when it is scrolled back above, so it replays on re-entry.
 * Nothing animates out on the way down.
 */
export default function LeadershipSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      // Far below the fold: set up in its own short task after load rather
      // than in the initial commit (see deferSetup).
      return deferSetup(
        contextSafe!(() => {
        const media = gsap.matchMedia();

        media.add(
          {
            motion: "(prefers-reduced-motion: no-preference)",
            stage: "(min-width: 64rem) and (min-height: 43rem)",
          },
          (context) => {
            const { motion, stage } = context.conditions as { motion: boolean; stage: boolean };
            if (!motion) return;
            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: rootRef.current,
                // On `stage:` viewports the section is tucked up under the
                // Contact section's exit, so it starts once it pins — on the
                // screen Contact has just emptied — and plays out over most of
                // the hold. Elsewhere it plays as it scrolls into view.
                start: stage ? "top top" : "top 40%",
                end: stage ? "top -90%" : "bottom bottom",
                scrub: 1,
              },
            });

            // ── Left column: logo, then owners scale up and fade in ────────────
            tl.from("[data-lead='logo']", {
              autoAlpha: 0,
              scale: 0.6,
              duration: 0.9,
              ease: "back.out(1.8)",
            })
              .from(
                "[data-lead='owner']",
                {
                  autoAlpha: 0,
                  y: 70,
                  scale: 0.82,
                  rotation: (i) => [-10, 8, -6][i] ?? 0,
                  duration: 0.9,
                  stagger: 0.14,
                },
                0.25,
              )
              .from(
                "[data-lead='avatar']",
                { scale: 0, rotation: -90, duration: 0.7, stagger: 0.14, ease: "back.out(2.4)" },
                0.45,
              )

              // ── Right column: kinetic type ─────────────────────────────────────
              .from(
                "[data-split='lead-eyebrow']",
                { yPercent: 110, duration: 0.6, stagger: 0.05 },
                0.15,
              )
              .from(
                "[data-split='lead-headline']",
                { yPercent: 115, rotation: 7, duration: 0.9, stagger: 0.07, ease: "power4.out" },
                0.3,
              )
              .from(
                "[data-split='lead-story']",
                { yPercent: 105, autoAlpha: 0, duration: 0.6, stagger: 0.012 },
                0.7,
              )
              .from(
                "[data-lead='rule']",
                { scaleX: 0, transformOrigin: "0% 50%", duration: 0.8, ease: "power2.inOut" },
                1,
              )
              .from(
                "[data-split='lead-philosophy']",
                { yPercent: 110, duration: 0.6, stagger: 0.05 },
                1.15,
              )
              .from(
                "[data-lead='stat']",
                { autoAlpha: 0, y: 40, duration: 0.7, stagger: 0.12 },
                1.2,
              );

            // Counters tick up from zero alongside their cards. Reversing the
            // timeline winds them back down, so they recount on re-entry.
            const counters = gsap.utils.toArray<HTMLElement>("[data-lead='count']");
            counters.forEach((el, i) => {
              const target = Number(el.dataset.value ?? 0);
              const counter = { value: 0 };
              el.textContent = "0";
              tl.to(
                counter,
                {
                  value: target,
                  duration: 1.4,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent = String(Math.round(counter.value));
                  },
                },
                1.25 + i * 0.12,
              );
            });

            // The counters write text, which matchMedia's revert can't undo.
            return () => {
              counters.forEach((el) => {
                el.textContent = el.dataset.value ?? "";
              });
            };
          },
        );
        }),
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      id="leadership"
      ref={rootRef}
      aria-labelledby="leadership-heading"
      // Tucked up under the Contact section's exit, so its stage pins on the
      // screen Contact has just emptied (see `agency-motion.ts`).
      className="relative stage:h-[220vh] motion-safe:stage:-mt-[var(--tuck)]"
      style={{ "--tuck": `${LEADERSHIP_TUCK_VH}vh` } as CSSProperties}
    >
      <div className="stage:sticky stage:top-0 stage:h-svh stage:overflow-hidden flex items-center py-[clamp(3rem,7vw,6rem)] stage:py-0">
        <div className="shell grid w-full gap-[clamp(2.5rem,5vw,6rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center">
          {/* ── Left: brand + the people behind it ───────────────────────── */}
          <div className="flex flex-col items-start gap-[clamp(1.25rem,3vh,2.5rem)]">
            <div data-lead="logo">
              <BrandLogo className="w-[clamp(9rem,13vw,15rem)]" />
            </div>

            <ul className="flex w-full max-w-[26rem] flex-col gap-[clamp(0.75rem,2vh,1.25rem)]">
              {owners.map((owner) => (
                <li
                  key={owner.name}
                  data-lead="owner"
                  className="flex items-center gap-4 rounded-card bg-white p-[clamp(0.75rem,1.6vh,1.125rem)] shadow-card rotate-(--tilt)"
                  style={{ "--tilt": `${owner.rotate}deg` } as CSSProperties}
                >
                  <span
                    data-lead="avatar"
                    className={`block size-[clamp(3.25rem,6.5vh,4.5rem)] shrink-0 overflow-hidden rounded-full ring-4 ring-offset-2 ring-offset-white ${accentRing[owner.accent]}`}
                  >
                    <Image
                      src={owner.avatar}
                      alt={`Portrait of ${owner.name}`}
                      width={240}
                      height={240}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-display text-[clamp(1rem,1.35vw,1.5rem)] leading-tight text-grape uppercase">
                      {owner.name}
                    </span>
                    <span className="text-[clamp(0.8125rem,0.9vw,1rem)] text-ink/70">{owner.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: the story ──────────────────────────────────────────── */}
          <div className="flex flex-col items-start gap-[clamp(1rem,2.6vh,2rem)]">
            <p className="text-eyebrow leading-none font-bold text-blush-ink uppercase">
              <SplitWords text="Our Story" name="lead-eyebrow" />
            </p>

            <h2
              id="leadership-heading"
              className="font-display text-section leading-[0.99] text-grape uppercase"
            >
              <SplitWords text={HEADLINE} name="lead-headline" />
            </h2>

            <p className="max-w-[44rem] text-body leading-[1.64] text-ink">
              <SplitWords text={STORY} name="lead-story" />
            </p>

            <div className="flex w-full max-w-[44rem] flex-col gap-3">
              <span data-lead="rule" aria-hidden className="block h-1 w-24 rounded-full bg-sunbeam" />
              <p className="font-display text-[clamp(1rem,1.5vw,1.75rem)] leading-tight text-ink uppercase">
                <SplitWords text={PHILOSOPHY} name="lead-philosophy" />
              </p>
            </div>

            <dl className="grid w-full max-w-[44rem] grid-cols-3 gap-[clamp(0.75rem,2vw,2rem)]">
              {studioStats.map((stat, i) => (
                <div
                  key={stat.label}
                  data-lead="stat"
                  className="flex flex-col gap-1 rounded-card bg-white/60 px-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(0.75rem,1.8vh,1.25rem)] shadow-card"
                >
                  <dt className="order-2 text-[clamp(0.75rem,0.9vw,1rem)] font-bold text-ink uppercase">
                    {stat.label}
                  </dt>
                  <dd
                    className={`order-1 font-pop text-[clamp(2.5rem,4.5vw,5rem)] leading-none ${statTones[i % statTones.length]}`}
                  >
                    <span data-lead="count" data-value={stat.value}>
                      {stat.value}
                    </span>
                    {stat.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
