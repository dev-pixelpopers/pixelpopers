"use client";

import { Fragment, useRef } from "react";

import Breadcrumb from "@/components/inner/Breadcrumb";
import { Burst } from "@/components/inner/motion/bits";
import { burst } from "@/components/inner/motion/kit";
import { usePopHero } from "@/components/inner/motion/usePopHero";
import PopButton from "@/components/ui/PopButton";
import { servicesHero } from "@/lib/pages/services";

/** Each letter in its own inline-block (words kept whole so lines wrap cleanly). */
function Chars({ text }: { text: string }) {
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 ? " " : null}
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((ch, c) => (
          <span key={c} data-whero="char" className="inline-block will-change-transform">
            {ch}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

/*
  Hero of Figma frame 332:21. Offsets are percentages of the shell's content
  width (1588 at 1920): "WHAT WE" / "DO BEST" and the intro row start at
  x 495 (20.7%), "& DO LOUD" hangs out to x 324 (9.95%).

  Motion: the shared pop hero (see `usePopHero`), plus the intro row — its
  words rise in and the quote button pops with a burst; on the way out the
  copy blurs down and the button spins away.
*/
export default function Hero() {
  const [l1, l2, l3] = servicesHero.lines;
  const rootRef = useRef<HTMLElement>(null);

  usePopHero(rootRef, {
    entrance: (tl, q) => {
      tl.fromTo(
        q("[data-whero='cta']"),
        { scale: 0, rotation: -25, autoAlpha: 0 },
        { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(2.4)" },
        1.75,
      );
      burst(tl, q("[data-whero='cta-burst'] [data-wm='burst']")[0] ?? null, 1.9, 110);
    },
    exit: (out, q) => {
      out
        .to(q("[data-whero='intro-out']"), { y: 60, opacity: 0, filter: "blur(6px)", duration: 0.5 }, 0.05)
        .to(q("[data-whero='cta-out']"), { scale: 0, rotation: 30, opacity: 0, duration: 0.35, ease: "back.in(2)" }, 0.1);
    },
  });

  return (
    <section ref={rootRef} aria-labelledby="services-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div aria-hidden data-whero="glow-out" className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)]">
        <div
          data-whero="glow"
          className="absolute inset-0 bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_36%_22%_at_49%_62%,rgb(159_201_204/0.5),transparent_75%)]"
        />
      </div>

      <div className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <div data-whero="crumb-out">
          <div data-whero="crumb">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
          </div>
        </div>

        <h1 id="services-title" aria-label={`${l1} ${l2} ${l3}`} className="mt-[clamp(2rem,3.1vw,3.75rem)] uppercase">
          <span aria-hidden className="block">
            <span data-whero-line="1" className="ml-[6%] block font-display text-hero-sm leading-[1.07] text-blush sm:ml-[20.7%]">
              <Chars text={l1} />
            </span>
            <span
              data-whero-line="2"
              className="ml-[6%] block font-haas text-hero-md leading-[1.14] tracking-[-0.033em] text-grape sm:ml-[20.7%]"
            >
              <Chars text={l2} />
            </span>
            <span
              data-whero-line="3"
              className="block font-display text-[clamp(2.5rem,6.67vw,8rem)] leading-[1.17] whitespace-nowrap text-lagoon sm:ml-[9.95%]"
            >
              <Chars text={l3} />
            </span>
          </span>
        </h1>

        <div
          className="mt-[clamp(1.75rem,4.6vw,5.5rem)] flex flex-wrap items-center gap-x-[clamp(2rem,4.7vw,5.625rem)] gap-y-6 sm:ml-[20.7%]"
        >
          <p data-whero="intro-out" className="max-w-[clamp(18rem,32.3vw,38.75rem)] font-copy text-body leading-[1.64] font-light text-ink">
            {servicesHero.intro.split(" ").map((word, i) => (
              <Fragment key={i}>
                <span className="inline-block overflow-hidden align-bottom">
                  <span data-whero="word" className="inline-block">
                    {word}
                  </span>
                </span>{" "}
              </Fragment>
            ))}
          </p>
          {/* The button ships hidden (small — never the LCP) so it doesn't flash before it pops. */}
          <div data-whero="cta-burst" data-whero-reveal className="invisible relative">
            <div data-whero="cta-out">
              <div data-whero="cta">
                <PopButton href={servicesHero.cta.href} label={servicesHero.cta.label} className="[&>span:last-child]:text-ink" />
              </div>
            </div>
            <Burst pieces={14} ring="border-blush" className="top-1/2 left-[2.5rem] size-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
