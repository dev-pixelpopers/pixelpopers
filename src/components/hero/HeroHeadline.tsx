import Image from "next/image";
import { Fragment } from "react";

type Doodle = {
  src: string;
  width: number;
  height: number;
  /** Resting yaw in degrees, read by GSAP from `data-rotate`. */
  rotate: number;
  /** Positioning of the wrapper — GSAP animates the artwork inside it. */
  wrapClassName: string;
};

type Line = {
  id: 1 | 2 | 3;
  text: string;
  className: string;
  doodle?: Doodle;
  /** Sparks bursting out of the doodle during the entrance. */
  sparks?: boolean;
};

const LINES: Line[] = [
  {
    id: 1,
    text: "We Make",
    className: "relative font-display text-hero-sm text-blush-ink",
    doodle: {
      src: "/icons/doodle-sparkle.svg",
      width: 244,
      height: 206,
      rotate: 15,
      wrapClassName: "top-1/2 right-full w-[clamp(5rem,14.7vw,17.7rem)] -translate-y-1/3",
    },
  },
  {
    id: 2,
    text: "Your Website",
    className: "text-hero-md font-bold tracking-[-0.05em] text-grape",
  },
  {
    id: 3,
    text: "Poppin’",
    className: "relative -ml-[2vw] font-display text-hero-lg tracking-[-0.03em] text-lagoon",
    doodle: {
      src: "/icons/doodle-flower.svg",
      width: 256,
      height: 251,
      rotate: 57,
      wrapClassName: "top-1/2 left-full w-[clamp(5rem,17.8vw,21.4rem)] -translate-y-1/2",
    },
    sparks: true,
  },
];

const SPARK_COUNT = 8;
const SPARK_TONES = ["bg-sunbeam", "bg-blush", "bg-grape", "bg-lagoon"];

type HeroHeadlineProps = {
  /** Wrap every letter in its own span (`data-hero="char"`) for per-letter motion. */
  chars?: boolean;
};

/**
 * The hero headline markup, with hooks the hero's motion animates:
 *
 *   data-hero="line"        each line (visible from the first paint — it's the LCP)
 *   data-line="1|2|3"       which line
 *   data-hero="mask"        inline-block around the text, for masked reveals
 *   data-hero="char"        each letter, when `chars` is on
 *   data-hero="doodle-wrap" positioned doodle wrapper (free for parallax)
 *   data-hero="doodle"      the doodle artwork (entrance owns its transform)
 *   data-hero="spark"       burst particles by the flower (ship hidden)
 */
export default function HeroHeadline({ chars = false }: HeroHeadlineProps) {
  return (
    <>
      {/*
        Without JS the entrance never runs, so the hidden initial state would
        strand the headline. `!important` in a stylesheet beats inline styles.
      */}
      <noscript>
        <style>{`
          [data-hero="line"], [data-hero="doodle"], [data-hero-blob="group"] {
            visibility: visible !important;
            opacity: 1 !important;
          }
          [data-hero-blob="trace"] { stroke-dashoffset: 0 !important; }
        `}</style>
      </noscript>

      <h1
        data-hero="title"
        aria-label={chars ? LINES.map((line) => line.text).join(" ") : undefined}
        className="flex flex-col items-start leading-none uppercase"
      >
        {LINES.map((line) => (
          <span
            key={line.id}
            data-hero="line"
            data-line={line.id}
            className={line.className}
          >
            {line.doodle ? <HeroDoodle doodle={line.doodle} sparks={line.sparks} /> : null}
            <span
              data-hero="mask"
              aria-hidden={chars || undefined}
              className="inline-block py-[0.08em] -my-[0.08em] align-bottom"
            >
              {chars ? <SplitChars text={line.text} /> : line.text}
            </span>
          </span>
        ))}
      </h1>
    </>
  );
}

function SplitChars({ text }: { text: string }) {
  return text.split("").map((char, i) =>
    char === " " ? (
      <Fragment key={i}> </Fragment>
    ) : (
      <span key={i} data-hero="char" className="inline-block">
        {char}
      </span>
    ),
  );
}

function HeroDoodle({ doodle, sparks }: { doodle: Doodle; sparks?: boolean }) {
  return (
    <span
      data-hero="doodle-wrap"
      aria-hidden
      className={`pointer-events-none absolute hidden sm:block ${doodle.wrapClassName}`}
    >
      <Image
        data-hero="doodle"
        data-rotate={doodle.rotate}
        src={doodle.src}
        alt=""
        width={doodle.width}
        height={doodle.height}
        className="gsap-reveal w-full max-w-none"
      />
      {sparks
        ? Array.from({ length: SPARK_COUNT }, (_, i) => (
            <span
              key={i}
              data-hero="spark"
              data-angle={(360 / SPARK_COUNT) * i}
              className={`gsap-reveal absolute top-1/2 left-1/2 -mt-[0.4vw] -ml-[0.4vw] size-[clamp(0.4rem,0.8vw,0.9rem)] rounded-full ${SPARK_TONES[i % SPARK_TONES.length]}`}
            />
          ))
        : null}
    </span>
  );
}
