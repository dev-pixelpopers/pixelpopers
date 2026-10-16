"use client";

import gsap from "gsap";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { Burst } from "@/components/inner/motion/bits";
import { burst } from "@/components/inner/motion/kit";
import BrandLogo from "@/components/ui/BrandLogo";
import { finishIntro, firstName, introPending, liftIntroCover, markGreeted, reopenIntro, saveVisitorName, shouldGreet, useIntroOpen, useVisitor, useVisitorName } from "@/lib/visitor";

/*
  The welcome: on a first visit, a full-screen intro warms up ("warming up
  the pixels…") and then chats — Pixel Popers asks the visitor's name, says
  hello, and sweeps away into the page (whose own entrance waits for it; see
  `holdForIntro`). From then on every page greets them by name, once per page
  per visit. The name stays in their browser (see lib/visitor).
*/

type PageKey = "home" | "work" | "caseStudy" | "services" | "service" | "about" | "blog" | "post" | "contact";

/**
 * Animations uploaded in Site settings → Greetings (GIF or MP4). Empty slots
 * use the built-in clips: the waving hello for the welcome, the thumbs-up
 * once they've said their name and on every page's greeting card.
 */
export type GreetingGifs = {
  /** Play the clips' sound (Site settings → Greetings). */
  sound: boolean;
  greeting: string | null;
  thumbs: string | null;
  pages: Record<PageKey, string | null>;
};

export default function VisitorWelcome({ gifs }: { gifs: GreetingGifs }) {
  const open = useIntroOpen();
  // No intro after all (e.g. storage blocked): lift the first-paint cover.
  useEffect(() => {
    if (!introPending()) liftIntroCover();
  }, [open]);
  return (
    <>
      {open ? <Intro gifs={gifs} /> : null}
      <Greeting gifs={gifs} />
    </>
  );
}

const CLIPS = "/assets/badge-video";
const HELLO = `${CLIPS}/person-wave-hello.mp4`;
const THUMBS = `${CLIPS}/person-thumb-up.mp4`;

/** Each page's built-in greeting-card clip (an upload for that page in the CMS replaces it). */
const PAGE_CLIPS: Record<PageKey, string> = {
  home: `${CLIPS}/home-welcome.mp4`,
  work: `${CLIPS}/work-pointing.mp4`,
  caseStudy: `${CLIPS}/case-study-clapping.mp4`,
  services: `${CLIPS}/services-lightbulb.mp4`,
  service: `${CLIPS}/service-ok.mp4`,
  about: `${CLIPS}/about-heart-hands.mp4`,
  blog: `${CLIPS}/blog-glasses.mp4`,
  post: `${CLIPS}/post-coffee.mp4`,
  contact: `${CLIPS}/contact-call-me.mp4`,
};
const helloOf = (g: GreetingGifs) => g.greeting || HELLO;
const thumbsOf = (g: GreetingGifs) => g.thumbs || THUMBS;

/** A visitor who muted the clips stays muted (this browser only). */
const SOUND_PREF = "pp-sound";
const soundMuted = () => {
  try {
    return window.localStorage.getItem(SOUND_PREF) === "off";
  } catch {
    return false;
  }
};
const rememberSound = (on: boolean) => {
  try {
    window.localStorage.setItem(SOUND_PREF, on ? "on" : "off");
  } catch {
    /* ignore */
  }
};

/**
 * A greeting animation: a short clip (MP4/WebM) or a GIF — served as-is (the
 * image optimiser would freeze a GIF). Under reduced motion a clip shows its
 * first frame.
 *
 * With `sound`, a clip plays its soundtrack once, then keeps looping muted.
 * Browsers only allow sound after the visitor has interacted with the page;
 * when it's blocked the clip plays muted with a "Tap for sound" button. A
 * small speaker button mutes / unmutes, and a mute is remembered.
 */
function Gif({ src, className, sound = false, frame = "relative block" }: { src: string; className: string; sound?: boolean; frame?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [audio, setAudio] = useState<"off" | "playing" | "blocked" | "muted">("off");
  const isVideo = /\.(mp4|webm)(\?|$)/i.test(src);

  // After the sound's first run, loop on silently.
  const loopQuietly = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    void v.play().catch(() => {});
  };

  const playWithSound = (v: HTMLVideoElement) => {
    v.currentTime = 0;
    v.muted = false;
    v.loop = false;
    return v.play();
  };

  useEffect(() => {
    const v = ref.current;
    if (!v || !isVideo || reduceMotion()) return;
    if (!sound || soundMuted()) {
      v.muted = true;
      v.loop = true;
      void v.play().catch(() => {});
      if (sound) window.setTimeout(() => setAudio("muted"), 0);
      return;
    }
    playWithSound(v)
      .then(() => setAudio("playing"))
      .catch(() => {
        // Sound not allowed yet: play muted and offer a tap.
        loopQuietly();
        setAudio("blocked");
      });
  }, [src, sound, isVideo]);

  if (!isVideo) return <Image src={src} alt="" width={320} height={320} unoptimized className={className} />;

  const turnOn = () => {
    const v = ref.current;
    if (!v) return;
    rememberSound(true);
    playWithSound(v)
      .then(() => setAudio("playing"))
      .catch(() => setAudio("blocked"));
  };
  const turnOff = () => {
    rememberSound(false);
    loopQuietly();
    setAudio("muted");
  };

  const button = "absolute right-1.5 bottom-1.5 z-10 grid place-items-center rounded-full bg-ink/75 text-cream shadow-md backdrop-blur-sm transition-transform hover:scale-110";
  return (
    <span className={frame}>
      <video ref={ref} src={src} muted playsInline preload="auto" aria-hidden onEnded={loopQuietly} className={className} />
      {audio === "blocked" ? (
        <button type="button" onClick={turnOn} className={`${button} gap-1 px-2.5 py-1 font-copy text-[0.6875rem] font-semibold whitespace-nowrap`}>
          🔊 Tap for sound
        </button>
      ) : audio === "playing" ? (
        <button type="button" onClick={turnOff} aria-label="Mute" className={`${button} size-7 text-[0.8125rem]`}>
          🔊
        </button>
      ) : audio === "muted" ? (
        <button type="button" onClick={turnOn} aria-label="Play with sound" className={`${button} size-7 text-[0.8125rem]`}>
          🔇
        </button>
      ) : null}
    </span>
  );
}

/* ── First-visit intro ────────────────────────────────────────────────── */

type Phase = "loading" | "ask" | "hello" | "leaving";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pop = "motion-safe:animate-[chat-pop_0.38s_cubic-bezier(0.2,0.9,0.3,1.35)_both]";

/** The intro's pixel mosaic: square tiles filling the screen in brand colours. */
const TILE_TONES = ["bg-blush", "bg-grape", "bg-lagoon", "bg-sunbeam", "bg-lav", "bg-blush-deep"];
const LOADING_WORDS = ["Warming up the pixels", "Mixing the colours", "Sharpening the edges", "Adding the pop"];

function useTileGrid() {
  // Client-only (the intro never renders on the server), so the window is there.
  const [grid] = useState(() => {
    const cols = window.innerWidth < 640 ? 7 : window.innerWidth < 1100 ? 11 : 14;
    const rows = Math.ceil(window.innerHeight / (window.innerWidth / cols));
    const tones = Array.from({ length: cols * rows }, (_, i) => TILE_TONES[(i * 7 + Math.floor(i / cols) * 3) % TILE_TONES.length]);
    return { cols, rows, tones };
  });
  return grid;
}

function Intro({ gifs }: { gifs: GreetingGifs }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [askTyped, setAskTyped] = useState(false);
  const [name, setName] = useState("");
  const [hint, setHint] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const helloRef = useRef<HTMLLIElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const confettiRef = useRef<HTMLSpanElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const grid = useTileGrid();

  // Lock the page behind and keep focus inside the intro while it's up.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const behind = [...document.body.children].filter((el) => el !== rootRef.current?.parentElement && el.id !== "pp-intro") as HTMLElement[];
    behind.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      html.style.overflow = prev;
      behind.forEach((el) => el.removeAttribute("inert"));
    };
  }, []);

  /*
    The show (≈3s): a pixel storm pops in from the centre and settles into a
    twinkling dot field while a giant counter races to 100 under a ticker of
    "warming up…" lines; at 100 the number squashes into POP!, a shockwave
    rings out and every pixel explodes off screen in a burst of confetti —
    then the chat. Reduced motion skips straight to the question.
  */
  useEffect(() => {
    if (reduceMotion()) {
      const t = window.setTimeout(() => {
        setPhase("ask");
        setAskTyped(true);
      }, 0);
      return () => window.clearTimeout(t);
    }
    const tiles = tilesRef.current ? [...tilesRef.current.children] : [];
    const count = countRef.current;
    const word = wordRef.current;
    const timers: number[] = [];
    const counter = { v: 0 };
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("ask");
        timers.push(window.setTimeout(() => setAskTyped(true), 700));
      },
    });
    tl.fromTo(
      tiles,
      { scale: 0, rotation: -90, autoAlpha: 0 },
      { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(2.2)", stagger: { grid: [grid.rows, grid.cols], from: "center", amount: 0.75 } },
      0,
    )
      // The mosaic settles into a field of small twinkling dots.
      .to(tiles, { scale: 0.16, autoAlpha: 0.55, duration: 0.55, ease: "power3.inOut", stagger: { grid: [grid.rows, grid.cols], from: "edges", amount: 0.45 } }, 0.95)
      .fromTo(count, { scale: 0.4, autoAlpha: 0, yPercent: 30 }, { scale: 1, autoAlpha: 1, yPercent: 0, duration: 0.6, ease: "back.out(2)" }, 0.55)
      .to(
        counter,
        {
          v: 100,
          duration: 1.75,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count) count.textContent = String(Math.round(counter.v));
            if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
          },
        },
        0.6,
      );

    // The ticker: each line slides up as the last one leaves.
    LOADING_WORDS.forEach((w, i) => {
      tl.call(() => {
        if (word) word.textContent = `${w}…`;
      }, [], 0.6 + i * 0.45).fromTo(word, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power3.out" }, 0.6 + i * 0.45);
    });

    // 100 → POP! A squash, a shockwave and the pixels explode outwards.
    const at = 2.45;
    tl.call(() => {
      if (count) count.textContent = "POP!";
      if (word) word.textContent = "Here we go!";
    }, [], at)
      .to(count, { keyframes: [{ scaleX: 1.35, scaleY: 0.7, duration: 0.1 }, { scaleX: 0.85, scaleY: 1.25, duration: 0.12 }, { scaleX: 1, scaleY: 1, duration: 0.4, ease: "elastic.out(1, 0.45)" }] }, at)
      .fromTo(ringRef.current, { scale: 0, autoAlpha: 0.9 }, { scale: 9, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, at)
      .to(
        tiles,
        {
          x: (_i, el: Element) => {
            const r = el.getBoundingClientRect();
            return (r.left + r.width / 2 - cx) * gsap.utils.random(1.4, 2.4);
          },
          y: (_i, el: Element) => {
            const r = el.getBoundingClientRect();
            return (r.top + r.height / 2 - cy) * gsap.utils.random(1.4, 2.4);
          },
          rotation: () => gsap.utils.random(-260, 260),
          scale: () => gsap.utils.random(0.4, 1.1),
          autoAlpha: 0,
          duration: 0.95,
          ease: "power3.out",
        },
        at + 0.02,
      )
      .to([count, word?.parentElement ?? null, barRef.current?.parentElement ?? null], { autoAlpha: 0, scale: 1.15, duration: 0.35, ease: "power2.in" }, at + 0.65);
    burst(tl, confettiRef.current, at + 0.02, 260);

    return () => {
      tl.kill();
      timers.forEach(window.clearTimeout);
    };
  }, [grid]);

  useEffect(() => {
    if (askTyped && phase === "ask") inputRef.current?.focus();
  }, [askTyped, phase]);

  // The exit: the intro breaks into pixels that spin away from the centre.
  useEffect(() => {
    if (phase !== "leaving" || reduceMotion() || !coverRef.current) return;
    // The pixel cover is painted now, so the first-paint cover can go.
    liftIntroCover();
    const tl = gsap.timeline({ onComplete: finishIntro });
    tl.to([...coverRef.current.children], {
      scale: 0,
      rotation: 90,
      duration: 0.45,
      ease: "power2.in",
      stagger: { grid: [grid.rows, grid.cols], from: "center", amount: 0.55 },
    });
    return () => {
      tl.kill();
    };
  }, [phase, grid]);

  const leave = () => {
    setPhase("leaving");
    markGreeted(pathname); // they've just been greeted — no toast on this page too
    if (reduceMotion()) finishIntro();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) {
      setHint(true);
      inputRef.current?.focus();
      return;
    }
    saveVisitorName(value);
    setPhase("hello");
    if (!reduceMotion()) {
      window.setTimeout(() => {
        const tl = gsap.timeline();
        burst(tl, helloRef.current?.querySelector("[data-wm='burst']") ?? null, 0, 150);
      }, 450);
    }
    window.setTimeout(leave, reduceMotion() ? 1400 : 2300);
  };

  const skip = () => {
    saveVisitorName("");
    leave();
  };

  const first = firstName(name);
  const leaving = phase === "leaving";
  const gridStyle = { gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridTemplateRows: `repeat(${grid.rows}, 1fr)` };

  return createPortal(
    <div
      id="pp-intro"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pp-intro-title"
      onKeyDown={(e) => {
        if (e.key === "Escape" && phase === "ask") skip();
      }}
      className={`fixed inset-0 z-[200] flex flex-col overflow-x-hidden overflow-y-auto text-cream ${leaving ? "pointer-events-none" : "bg-ink"}`}
    >
      {/* Leaving: a full cover of ink pixels (painted the same frame the backdrop goes), which then spin away. */}
      {leaving && !reduceMotion() ? (
        <div ref={coverRef} aria-hidden className="pointer-events-none fixed inset-0 z-10 grid" style={gridStyle}>
          {grid.tones.map((_, i) => (
            <span key={i} className="scale-[1.04] bg-ink" />
          ))}
        </div>
      ) : null}

      {leaving ? null : (
        <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_45%_35%_at_15%_10%,rgb(106_75_151/0.55),transparent_70%),radial-gradient(ellipse_40%_35%_at_90%_90%,rgb(242_119_147/0.35),transparent_70%),radial-gradient(ellipse_30%_25%_at_60%_45%,rgb(63_183_199/0.15),transparent_70%)]" />
      )}

      {phase === "loading" ? (
        <>
          {/* The pixel storm */}
          <div ref={tilesRef} aria-hidden className="pointer-events-none fixed inset-0 grid" style={gridStyle}>
            {grid.tones.map((tone, i) => (
              <span key={i} className={`invisible m-[14%] rounded-[24%] ${tone}`} />
            ))}
          </div>

          <div className="relative m-auto flex flex-col items-center px-5 text-center" role="status" aria-live="polite">
            <span className="sr-only">Loading Pixel Popers</span>
            <span ref={ringRef} aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -mt-16 -ml-16 size-32 rounded-full border-[6px] border-sunbeam opacity-0" />
            <span ref={confettiRef} aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 size-0">
              <Burst pieces={28} ring="border-blush" className="top-0 left-0 size-0" />
            </span>
            <p
              ref={countRef}
              aria-hidden
              className="invisible bg-gradient-to-br from-blush via-sunbeam to-lagoon bg-clip-text font-pop text-[clamp(7rem,22vw,17rem)] leading-[0.9] text-transparent tabular-nums drop-shadow-[0_10px_40px_rgb(242_119_147/0.35)]"
            >
              0
            </p>
            <p aria-hidden className="mt-4 h-[1.4em] overflow-hidden font-display text-[clamp(0.875rem,1.2vw,1.125rem)] tracking-[0.12em] text-cream/80 uppercase">
              <span ref={wordRef} className="inline-block" />
            </p>
            <span aria-hidden className="mt-5 block h-1.5 w-[min(70vw,22rem)] overflow-hidden rounded-full bg-cream/15">
              <span ref={barRef} className="block h-full origin-left rounded-full bg-gradient-to-r from-blush via-sunbeam to-lagoon" style={{ transform: "scaleX(0)" }} />
            </span>
          </div>
        </>
      ) : (
      <div className={`relative m-auto flex w-full max-w-[34rem] flex-col px-5 py-10 ${leaving ? "invisible" : ""}`}>
        <div className={`self-center ${pop}`}>
          <BrandLogo onDark priority className="w-[clamp(9rem,14vw,13rem)]" />
        </div>

        <>
            <h2 id="pp-intro-title" className="sr-only">
              Welcome to Pixel Popers
            </h2>
            {/* The mascot: waves hello, then a thumbs-up once they've told us their name. */}
            {(() => {
              const said = phase === "hello" || (phase === "leaving" && first);
              const src = said ? thumbsOf(gifs) : helloOf(gifs);
              return (
                <div key={src} aria-hidden className={`mt-8 self-center ${pop}`}>
                  <Gif src={src} sound={gifs.sound} className="size-[clamp(8rem,13vw,10.5rem)] rounded-[28px] bg-white object-cover shadow-[0_18px_40px_rgb(0_0_0/0.35)]" />
                </div>
              );
            })()}
            <ol aria-live="polite" className="mt-8 flex flex-col gap-3">
              <Bot>Hey there! 👋 Welcome to Pixel Popers.</Bot>
              {askTyped ? (
                <Bot id="pp-intro-question">
                  Before we pop in — <b>what should we call you?</b>
                </Bot>
              ) : (
                <Typing />
              )}
              {phase === "hello" || (phase === "leaving" && first) ? (
                <>
                  <li className={`self-end rounded-[22px] rounded-br-md bg-blush px-5 py-3 font-copy text-[1.0625rem] text-white ${pop}`}>
                    <span className="sr-only">You: </span>
                    {name.trim()}
                  </li>
                  <li ref={helloRef} className="relative self-start">
                    <Bot as="div">
                      Nice to meet you, <b>{first}</b>! 🎉 Let’s make things pop.
                    </Bot>
                    <Burst pieces={18} ring="border-blush" className="top-1/2 left-16 size-0" />
                  </li>
                </>
              ) : null}
            </ol>

            {phase === "ask" && askTyped ? (
              <form onSubmit={submit} className={`mt-6 ${pop}`}>
                <div className="flex gap-2.5">
                  <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setHint(false);
                    }}
                    aria-labelledby="pp-intro-question"
                    aria-invalid={hint || undefined}
                    autoComplete="given-name"
                    maxLength={60}
                    placeholder="Your first name"
                    className="h-14 min-w-0 flex-1 rounded-[18px] border border-cream/20 bg-cream/10 px-5 font-copy text-[1.0625rem] text-cream placeholder:text-cream/45 focus:border-lagoon focus:outline-2 focus:outline-lagoon"
                  />
                  <button type="submit" className="inline-flex h-14 shrink-0 items-center gap-2 rounded-[18px] bg-blush px-5 font-display text-nav text-white uppercase transition-colors hover:bg-lagoon">
                    Let’s go <span aria-hidden>→</span>
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-copy text-[0.875rem]">
                  <p className={hint ? "text-sunbeam" : "text-cream/50"} role={hint ? "alert" : undefined}>
                    {hint ? "Just a first name is perfect 🙂" : "Only saved in your browser — we use it to say hi."}
                  </p>
                  <button type="button" onClick={skip} className="text-cream/70 underline-offset-4 hover:text-cream hover:underline">
                    Skip — just looking
                  </button>
                </div>
              </form>
            ) : null}
        </>
      </div>
      )}
    </div>,
    document.body,
  );
}

function Bot({ children, id, as = "li" }: { children: React.ReactNode; id?: string; as?: "li" | "div" }) {
  const Tag = as;
  return (
    <Tag className={`flex max-w-[92%] items-end gap-2.5 self-start ${pop}`}>
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-blush font-pop text-[1.35rem] leading-none text-white">
        P
      </span>
      <p id={id} className="rounded-[22px] rounded-bl-md bg-cream/12 px-5 py-3 font-copy text-[1.0625rem] leading-[1.5] text-cream [&_b]:font-semibold [&_b]:text-sunbeam">
        <span className="sr-only">Pixel Popers: </span>
        {children}
      </p>
    </Tag>
  );
}

function Typing() {
  return (
    <li className={`flex items-end gap-2.5 self-start ${pop}`} aria-label="Pixel Popers is typing">
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-blush font-pop text-[1.35rem] leading-none text-white">
        P
      </span>
      <span className="flex gap-1.5 rounded-[22px] rounded-bl-md bg-cream/12 px-5 py-4">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-cream/70 motion-safe:animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </span>
    </li>
  );
}

/* ── Page greetings ───────────────────────────────────────────────────── */

type Greet = { key: PageKey; emoji: string; title: (n: string) => ReactNode; line: string; tone: string; bar: string };

const hi = (n: string) => <span className="text-sunbeam">{n}</span>;

/** What each page says, by path. */
function greetingFor(path: string): Greet {
  if (path === "/") return { key: "home", emoji: "👋", title: (n) => <>Welcome back, {hi(n)}!</>, line: "Good to see you again — grab a scroll, we’ve been busy.", tone: "bg-blush", bar: "bg-blush" };
  if (path === "/work") return { key: "work", emoji: "🔥", title: (n) => <>{hi(n)}, here’s the good stuff</>, line: "Our freshest work — every project built to pop.", tone: "bg-lagoon", bar: "bg-lagoon" };
  if (path.startsWith("/work/")) return { key: "caseStudy", emoji: "✨", title: (n) => <>Enjoy this one, {hi(n)}!</>, line: "It was a fun build — the results speak for themselves.", tone: "bg-sunbeam", bar: "bg-sunbeam" };
  if (path === "/services") return { key: "services", emoji: "🎨", title: (n) => <>Hey {hi(n)}, pick your pop!</>, line: "Brand, web, motion and more — everything we can make for you.", tone: "bg-grape", bar: "bg-lav" };
  if (path.startsWith("/services/")) return { key: "service", emoji: "🎯", title: (n) => <>Good pick, {hi(n)}!</>, line: "This one’s a studio favourite. Scroll on to see how we do it.", tone: "bg-blush", bar: "bg-blush" };
  if (path === "/about") return { key: "about", emoji: "🙌", title: (n) => <>Meet the crew, {hi(n)}!</>, line: "The funky bunch behind every pixel — say hi.", tone: "bg-lagoon", bar: "bg-lagoon" };
  if (path === "/blog") return { key: "blog", emoji: "📚", title: (n) => <>Fresh reads for you, {hi(n)}</>, line: "Ideas on branding, design and growth — no fluff.", tone: "bg-sunbeam", bar: "bg-sunbeam" };
  if (path.startsWith("/blog/")) return { key: "post", emoji: "☕️", title: (n) => <>Grab a coffee, {hi(n)}</>, line: "This one’s a good read — we think you’ll like it.", tone: "bg-grape", bar: "bg-lav" };
  if (path === "/contact") return { key: "contact", emoji: "🚀", title: (n) => <>Ready when you are, {hi(n)}!</>, line: "Tell us what you’re dreaming up — we reply within a day.", tone: "bg-blush", bar: "bg-blush" };
  return { key: "home", emoji: "👋", title: (n) => <>Hey {hi(n)}, glad you’re here!</>, line: "Have a look around — we made it pop just for you.", tone: "bg-blush", bar: "bg-blush" };
}

/** How long a greeting stays (the countdown bar; hovering pauses it). */
const GREETING_MS = 7000;

function Greeting({ gifs }: { gifs: GreetingGifs }) {
  // Visitors who skipped the intro are greeted too — as "Stranger".
  const known = useVisitorName();
  const record = useVisitor();
  const stranger = !known && record?.name === "";
  const name = known || (stranger ? "Stranger" : "");
  const introOpen = useIntroOpen();
  const pathname = usePathname();
  const [toast, setToast] = useState<{ path: string; leaving: boolean } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!name || introOpen) return;
    const t = window.setTimeout(() => {
      if (shouldGreet(pathname)) setToast({ path: pathname, leaving: false });
    }, 1100);
    return () => {
      window.clearTimeout(t);
      setToast(null);
    };
  }, [name, introOpen, pathname]);

  // Bouncy entrance with a confetti burst from the badge.
  useEffect(() => {
    const card = cardRef.current;
    if (!toast || toast.leaving || !card || reduceMotion()) return;
    const tl = gsap.timeline();
    tl.fromTo(card, { y: 90, rotation: -5, scale: 0.85, autoAlpha: 0 }, { y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.9)" })
      .fromTo(card.querySelector("[data-greet='badge']"), { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.4)" }, 0.2);
    burst(tl, card.querySelector("[data-wm='burst']"), 0.45, 110);
    return () => {
      tl.kill();
    };
  }, [toast]);

  const leave = () => {
    setToast((t) => (t ? { ...t, leaving: true } : t));
    window.setTimeout(() => setToast(null), 350);
  };

  if (!toast || toast.path !== pathname || !name) return null;
  const g = greetingFor(pathname);
  // The page's own clip: uploaded in the CMS, else the built-in one for that page.
  const gif = gifs.pages[g.key] || PAGE_CLIPS[g.key] || thumbsOf(gifs);

  return (
    <div
      ref={cardRef}
      role="status"
      className={`group fixed right-[clamp(0.75rem,2vw,2rem)] bottom-[clamp(0.75rem,2vw,2rem)] left-[clamp(0.75rem,2vw,2rem)] z-[150] overflow-hidden rounded-[28px] bg-ink text-cream shadow-[0_28px_70px_rgb(34_1_40/0.45)] ring-1 ring-cream/10 transition-[opacity,translate] duration-300 sm:left-auto sm:w-[27rem] ${
        toast.leaving ? "translate-y-6 opacity-0" : ""
      }`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_0%,rgb(106_75_151/0.55),transparent_70%),radial-gradient(ellipse_50%_70%_at_100%_100%,rgb(242_119_147/0.25),transparent_70%)]" />
      <div className="relative flex gap-4 p-[clamp(1rem,1.4vw,1.375rem)] pr-12">
        <span
          data-greet="badge"
          aria-hidden
          className={`relative grid shrink-0 place-items-center rounded-2xl shadow-[0_8px_20px_rgb(0_0_0/0.25)] ${g.tone} ${
            gif ? "size-[clamp(4.75rem,5.5vw,5.75rem)] self-center" : "size-[clamp(3.5rem,4vw,4.25rem)] text-[clamp(1.75rem,2vw,2.25rem)]"
          }`}
        >
          {gif ? (
            <Gif src={gif} sound={gifs.sound} frame="relative block size-full" className="size-full rounded-2xl bg-white object-cover" />
          ) : (
            <span className="inline-block origin-[70%_80%] motion-safe:animate-[pp-wave_1.6s_ease-in-out_0.8s_2]">{g.emoji}</span>
          )}
          <Burst pieces={14} ring="border-sunbeam" className="top-1/2 left-1/2 size-0" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[clamp(1.0625rem,1.3vw,1.375rem)] leading-tight uppercase">{g.title(name)}</p>
          <p className="mt-1.5 font-copy text-[0.9375rem] leading-snug text-cream/75">{g.line}</p>
          <button type="button" onClick={reopenIntro} className="mt-2.5 font-copy text-[0.8125rem] text-cream/50 underline-offset-2 hover:text-cream hover:underline">
            {stranger ? "Tell us your name →" : `Not ${name}?`}
          </button>
        </div>
      </div>
      <button type="button" onClick={leave} aria-label="Dismiss" className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-lg text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream">
        ×
      </button>
      {/* Countdown: the card leaves when the bar runs out; hovering pauses it. */}
      <span
        aria-hidden
        onAnimationEnd={leave}
        className={`absolute inset-x-0 bottom-0 block h-1 origin-left ${g.bar} animate-[pp-timer_linear_forwards] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]`}
        style={{ animationDuration: `${GREETING_MS}ms` }}
      />
    </div>
  );
}
