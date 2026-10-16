"use client";

import gsap from "gsap";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { Burst } from "@/components/inner/motion/bits";
import { burst } from "@/components/inner/motion/kit";
import BrandLogo from "@/components/ui/BrandLogo";
import { finishIntro, firstName, markGreeted, reopenIntro, saveVisitorName, shouldGreet, useIntroOpen, useVisitorName } from "@/lib/visitor";

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
  greeting: string | null;
  thumbs: string | null;
  pages: Record<PageKey, string | null>;
};

export default function VisitorWelcome({ gifs }: { gifs: GreetingGifs }) {
  const open = useIntroOpen();
  return (
    <>
    </>
  );
}

const HELLO = "/assets/badge-video/person-wave-hello.mp4";
const THUMBS = "/assets/badge-video/person-thumb-up.mp4";
const helloOf = (g: GreetingGifs) => g.greeting || HELLO;
const thumbsOf = (g: GreetingGifs) => g.thumbs || THUMBS;

/**
 * A greeting animation: a short muted, looping clip (MP4/WebM) or a GIF —
 * served as-is (the image optimiser would freeze a GIF). Under reduced motion
 * a clip shows its first frame.
 */
function Gif({ src, className }: { src: string; className: string }) {
  if (/\.(mp4|webm)(\?|$)/i.test(src)) {
    const still = reduceMotion();
    return <video src={src} autoPlay={!still} loop={!still} muted playsInline preload="auto" aria-hidden className={className} />;
  }
  return <Image src={src} alt="" width={320} height={320} unoptimized className={className} />;
}

/* ── First-visit intro ────────────────────────────────────────────────── */

type Phase = "loading" | "ask" | "hello" | "leaving";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pop = "motion-safe:animate-[chat-pop_0.38s_cubic-bezier(0.2,0.9,0.3,1.35)_both]";

function Intro({ gifs }: { gifs: GreetingGifs }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const [askTyped, setAskTyped] = useState(false);
  const [name, setName] = useState("");
  const [hint, setHint] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const helloRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

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

  // "Warming up the pixels…": a quick count to 100 (none under reduced motion), then the question.
  useEffect(() => {
    if (reduceMotion()) {
      const t = window.setTimeout(() => {
        setProgress(100);
        setPhase("ask");
        setAskTyped(true);
      }, 0);
      return () => window.clearTimeout(t);
    }
    const start = performance.now();
    const duration = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(100 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        window.setTimeout(() => {
          setPhase("ask");
          window.setTimeout(() => setAskTyped(true), 750);
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (askTyped && phase === "ask") inputRef.current?.focus();
  }, [askTyped, phase]);

  const leave = () => {
    setPhase("leaving");
    markGreeted(pathname); // they've just been greeted — no toast on this page too
    window.setTimeout(finishIntro, reduceMotion() ? 0 : 750);
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
    window.setTimeout(leave, reduceMotion() ? 1400 : 2100);
  };

  const skip = () => {
    saveVisitorName("");
    leave();
  };

  const first = firstName(name);

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
      className={`fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-ink text-cream transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
        phase === "leaving" ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]"
      }`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_15%_10%,rgb(106_75_151/0.55),transparent_70%),radial-gradient(ellipse_40%_35%_at_90%_90%,rgb(242_119_147/0.35),transparent_70%),radial-gradient(ellipse_30%_25%_at_60%_45%,rgb(63_183_199/0.15),transparent_70%)]" />

      <div className="relative m-auto flex w-full max-w-[34rem] flex-col px-5 py-10">
        <div className={`self-center ${phase === "loading" ? "motion-safe:animate-[chat-pop_0.6s_cubic-bezier(0.2,0.9,0.3,1.35)_both]" : ""}`}>
          <BrandLogo onDark priority className="w-[clamp(9rem,14vw,13rem)]" />
        </div>

        {phase === "loading" ? (
          <div className="mt-10" role="status" aria-live="polite">
            <p className="flex justify-between font-display text-micro tracking-wide text-cream/70 uppercase">
              <span>Warming up the pixels…</span>
              <span className="tabular-nums">{progress}%</span>
            </p>
            <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-cream/15">
              <span className="block h-full rounded-full bg-gradient-to-r from-blush via-sunbeam to-lagoon" style={{ width: `${progress}%` }} />
            </span>
          </div>
        ) : (
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
                  <Gif src={src} className="size-[clamp(8rem,13vw,10.5rem)] rounded-[28px] bg-white object-cover shadow-[0_18px_40px_rgb(0_0_0/0.35)]" />
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
        )}
      </div>
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
  const name = useVisitorName();
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
  // Every page's card gives a thumbs-up (unless that page has its own animation).
  const gif = gifs.pages[g.key] || thumbsOf(gifs);

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
            <Gif src={gif} className="size-full rounded-2xl bg-white object-cover" />
          ) : (
            <span className="inline-block origin-[70%_80%] motion-safe:animate-[pp-wave_1.6s_ease-in-out_0.8s_2]">{g.emoji}</span>
          )}
          <Burst pieces={14} ring="border-sunbeam" className="top-1/2 left-1/2 size-0" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[clamp(1.0625rem,1.3vw,1.375rem)] leading-tight uppercase">{g.title(name)}</p>
          <p className="mt-1.5 font-copy text-[0.9375rem] leading-snug text-cream/75">{g.line}</p>
          <button type="button" onClick={reopenIntro} className="mt-2.5 font-copy text-[0.8125rem] text-cream/50 underline-offset-2 hover:text-cream hover:underline">
            Not {name}?
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
