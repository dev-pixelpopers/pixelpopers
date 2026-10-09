"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";

import Breadcrumb from "@/components/inner/Breadcrumb";
import { Burst } from "@/components/inner/motion/bits";
import { burst } from "@/components/inner/motion/kit";
import { usePopHero } from "@/components/inner/motion/usePopHero";
import PopButton from "@/components/ui/PopButton";
import { aboutHero } from "@/lib/pages/about";

/*
  Hero of Figma frame 330:21. The three headline lines share one `w-fit`
  block sized by the widest line ("BEHIND THE POP"), so the first two lines
  and the intro row can be indented by the same percentage as in Figma
  (171 / 1256 ≈ 13.6%). The image band is a single-cell grid: the
  three-photo collage and both stickers occupy the same cell.

  Motion: the shared pop hero (see `usePopHero`), plus — the intro words rise
  and the button pops with a burst; the three photos are dealt in (left and
  right swing in from the sides, the middle rises), and the stickers stamp
  down spinning. On the way out the photos fan apart and both stickers burst.
*/

const layer = "col-start-1 row-start-1";

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

export default function Hero() {
  const [l1, l2, l3] = aboutHero.lines;
  const [left, middle, right] = aboutHero.images;
  const rootRef = useRef<HTMLElement>(null);

  usePopHero(rootRef, {
    entrance: (tl, q) => {
      tl.fromTo(
          q("[data-whero='cta']"),
          { scale: 0, rotation: -25, autoAlpha: 0 },
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(2.4)" },
          1.7,
        )
        // The photos are on screen from the first paint (one of them can be
        // the LCP); they just settle into place, transform-only.
        .fromTo(
          q("[data-whero='photo']"),
          { y: (i) => (i === 1 ? 40 : 20), rotation: (i) => [-4, 0, 4][i], scale: 0.95 },
          { y: 0, rotation: 0, scale: 1, duration: 0.9, stagger: 0.1, ease: "back.out(1.4)" },
          0.6,
        )
        .fromTo(
          q("[data-whero='sticker']"),
          { scale: 0, rotation: (i) => (i ? 200 : -200), autoAlpha: 0 },
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2, ease: "back.out(2.2)" },
          1.9,
        );
      burst(tl, q("[data-whero='cta-burst'] [data-wm='burst']")[0] ?? null, 1.85, 110);
    },
    exit: (out, q) => {
      out
        .to(q("[data-whero='intro-out']"), { y: 60, opacity: 0, duration: 0.5 }, 0.05)
        .to(q("[data-whero='cta-out']"), { scale: 0, rotation: 30, opacity: 0, duration: 0.35, ease: "back.in(2)" }, 0.1)
        .to(
          q("[data-whero='photo-out']"),
          {
            x: (i) => [-1, 0, 1][i] * innerWidth * 0.12,
            y: (i) => (i === 1 ? -40 : 30),
            rotation: (i) => [-8, 0, 8][i],
            scale: (i) => (i === 1 ? 0.9 : 0.95),
          },
          0,
        );
      const stickers = q("[data-whero='sticker-out']");
      stickers.forEach((sticker, i) => {
        const at = 0.3 + i * 0.12;
        // Swells, then pops.
        out.to(sticker, { keyframes: [{ scale: 1.25, duration: 0.12 }, { scale: 0, opacity: 0, duration: 0.05 }] }, at - 0.12);
        burst(out, sticker.parentElement?.querySelector("[data-wm='burst']") ?? null, at + 0.05, 100);
      });
    },
  });

  return (
    <section ref={rootRef} aria-labelledby="about-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div aria-hidden data-whero="glow-out" className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)]">
        <div
          data-whero="glow"
          className="absolute inset-0 bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_36%_22%_at_49%_62%,rgb(159_201_204/0.5),transparent_75%)]"
        />
      </div>

      <div data-whero="crumb-out" className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <div data-whero="crumb">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        </div>
      </div>

      <div className="mx-auto mt-[clamp(2rem,3.1vw,3.75rem)] w-fit max-w-full px-5">
        <h1 id="about-title" aria-label={`${l1} ${l2} ${l3}`} className="uppercase">
          <span aria-hidden className="block">
            <span data-whero-line="1" className="ml-[13.6%] block font-display text-hero-sm leading-[1.12] text-blush-ink">
              <Chars text={l1} />
            </span>
            <span data-whero-line="2" className="ml-[13.6%] block font-haas text-hero-md leading-[1.05] tracking-[-0.05em] text-grape">
              <Chars text={l2} />
            </span>
            <span data-whero-line="3" className="block font-display text-[clamp(1.75rem,6.67vw,8rem)] leading-[1.17] whitespace-nowrap text-lagoon">
              <Chars text={l3} />
            </span>
          </span>
        </h1>

        <div
          className="mt-[clamp(2rem,5.6vw,6.75rem)] flex flex-wrap items-start gap-x-[clamp(2rem,4.7vw,5.625rem)] gap-y-8 sm:ml-[13.6%]"
        >
          <p data-whero="intro-out" className="max-w-[clamp(18rem,32.3vw,38.75rem)] font-copy text-body leading-[1.64] font-light text-ink">
            {aboutHero.intro.split(" ").map((word, i) => (
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
          <div data-whero="cta-burst" data-whero-reveal className="invisible relative mt-2.5">
            <div data-whero="cta-out">
              <div data-whero="cta">
                <PopButton href={aboutHero.cta.href} label={aboutHero.cta.label} className="[&>span:last-child]:text-ink" />
              </div>
            </div>
            <Burst pieces={14} ring="border-blush" className="top-1/2 left-[2.5rem] size-0" />
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-[clamp(2.5rem,4.8vw,5.75rem)] grid max-w-[1920px] px-[clamp(1.25rem,6.25vw,7.5rem)]"
      >
        <div className={`${layer} grid grid-cols-[600fr_440fr_600fr] items-center gap-[clamp(0.5rem,1.04vw,1.25rem)]`}>
          {[left, middle, right].map((img, i) => (
            <div key={img.src} data-whero="photo-out">
              <div data-whero="photo">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  priority={i === 1}
                  sizes="(min-width: 1920px) 600px, 33vw"
                  className="h-auto w-full rounded-[clamp(0.875rem,2.08vw,2.5rem)] object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div data-whero-reveal className={`${layer} invisible relative mt-[1.2%] ml-[1.8%] self-start justify-self-start`}>
          <div data-whero="sticker-out">
            <p
              data-whero="sticker"
              className="rotate-[7deg] rounded-full bg-sunbeam px-[clamp(0.875rem,2.1vw,2.5rem)] py-[clamp(0.5rem,1.4vw,1.75rem)] font-display text-[clamp(0.625rem,1.04vw,1.25rem)] leading-none text-ink uppercase"
            >
              {aboutHero.stickers[0]}
            </p>
          </div>
          <Burst pieces={12} className="top-1/2 left-1/2 size-0" />
        </div>
        <div data-whero-reveal className={`${layer} invisible relative mr-[1.2%] -mb-[0.4%] self-end justify-self-end`}>
          <div data-whero="sticker-out">
            <p
              data-whero="sticker"
              className="-rotate-6 rounded-full bg-blush px-[clamp(0.875rem,2.1vw,2.5rem)] py-[clamp(0.5rem,1.4vw,1.75rem)] font-display text-[clamp(0.625rem,1.04vw,1.25rem)] leading-none text-white uppercase"
            >
              {aboutHero.stickers[1]}
            </p>
          </div>
          <Burst pieces={12} ring="border-blush" className="top-1/2 left-1/2 size-0" />
        </div>
      </div>
    </section>
  );
}
