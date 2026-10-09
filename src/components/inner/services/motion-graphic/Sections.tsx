import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import { mono } from "@/lib/inner-fonts";
import type { ServiceDetail } from "@/lib/service-content";
import MotionFx from "./MotionFx";
import VideoPlayer from "./VideoPlayer";

/*
  Concept: the page is a video editor. Figma frame 378:21 "03.5 — Service:
  MOTION GRAPHIC". Collages (hero player + film strip, timeline, storyboard
  panels, reels) are single-cell grids: each layer shares one cell and is
  placed with percentage margins (resolved against the cell width) or `cqw`
  units of the nearest `@container`, measured off the 1920 Figma frame, so a
  whole piece scales as one. Figma rotations are flipped for CSS (Figma +° is
  counter-clockwise) and re-centred, because CSS rotates around the centre.
*/

const layer = "col-start-1 row-start-1 self-start justify-self-start";
const cardShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.15)]";
const headingGap = "mt-[clamp(2.5rem,3.96vw,4.75rem)]";

/** `px` on a Figma piece `base` px wide → `cqw` of that piece. */
const u = (px: number, base: number) => `${+((px / base) * 100).toFixed(3)}cqw`;

/* ── Hero data ─────────────────────────────────────────────────────────── */
const letterLook = [
  { color: "text-blush-ink", rotate: "rotate-[6deg]", drop: 0.215 },
  { color: "text-blush-ink", rotate: "rotate-[-5deg]", drop: 0.031 },
  { color: "text-grape", rotate: "rotate-[3deg]", drop: 0.277 },
  { color: "text-blush-ink", rotate: "rotate-[-7deg]", drop: 0.092 },
  { color: "text-lagoon", rotate: "rotate-[5deg]", drop: 0.246 },
  { color: "text-blush-ink", rotate: "rotate-[-4deg]", drop: 0 },
];
const speedLines = [240, 220, 200, 180, 160, 140, 120];
/** Bounce trail: y offset (Figma px from the line top) and opacity. */
const trail = [
  { y: 40, o: "opacity-20" },
  { y: -10, o: "opacity-40" },
  { y: -30, o: "opacity-60" },
  { y: -10, o: "opacity-80" },
  { y: 40, o: "opacity-100" },
];
const filmFrames = [
  { src: "radiance.webp", w: 1024, h: 1174, alt: "Radiance skincare campaign frame" },
  { src: "campaign-strip.webp", w: 1600, h: 891, alt: "Product campaign set with bold 3D type" },
  { src: "motion.webp", w: 1120, h: 980, alt: "Animation editor style frame" },
  { src: "cube.webp", w: 783, h: 851, alt: "Portrait mapped onto a spinning 3D cube" },
  { src: "fifth-sip.webp", w: 857, h: 1200, alt: "Fifth Sip coffee packaging" },
  { src: "ui-shop.webp", w: 1600, h: 900, alt: "E-commerce interface screens" },
];

/* ── Timeline data (Figma px inside the 1588 × 620 timeline) ───────────── */
const TL = 1588;
const track = { x: 260, w: 1328 };
const at = (x: number) => `${+(((x - track.x) / track.w) * 100).toFixed(3)}%`;
const lanes = [
  { label: "Logo", dot: "bg-blush", clips: [{ x: 350, w: 350, name: "Drop & squash", tone: "bg-blush/85 text-white" }], keys: [350, 500, 600, 700] },
  { label: "Headline", dot: "bg-lagoon", clips: [{ x: 550, w: 550, name: "Type-on", tone: "bg-lagoon/85 text-white" }], keys: [550, 700, 900, 1100] },
  { label: "Background", dot: "bg-grape", clips: [{ x: 300, w: 1200, name: "Gradient loop", tone: "bg-grape/85 text-white" }], keys: [300, 900, 1500] },
  {
    label: "Sparkles",
    dot: "bg-sunbeam",
    clips: [
      { x: 750, w: 200, name: "Burst", tone: "bg-sunbeam/85 text-ink" },
      { x: 1150, w: 200, name: "Burst", tone: "bg-sunbeam/85 text-ink" },
    ],
    keys: [750, 950, 1150, 1350],
  },
];
const wave = Array.from({ length: 151 }, (_, i) => Math.round(8 + 44 * (0.6 * Math.abs(Math.sin(i * 2.3)) + 0.4 * Math.abs(Math.sin(i * 0.37 + 1)))));

/* ── Easing curves (graph is 420 × 300; value 0 at y 270, value 1 at y 50) ─ */
function bounceOut(t: number) {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
}
function curve(f: (t: number) => number) {
  return Array.from({ length: 81 }, (_, i) => {
    const t = i / 80;
    return `${i ? "L" : "M"}${(t * 420).toFixed(1)} ${(270 - f(t) * 220).toFixed(1)}`;
  }).join(" ");
}
const easings = [
  { name: "Ease out", body: "Fast start, soft landing. For things arriving on screen.", ease: "power3.out", stroke: "#3FB7C7", dot: "bg-lagoon", f: (t: number) => 1 - (1 - t) ** 3 },
  { name: "Spring", body: "A little overshoot that feels alive. For buttons & pop-ups.", ease: "elastic.out(1, 0.45)", stroke: "#F27793", dot: "bg-blush", f: (t: number) => 1 - Math.exp(-6 * t) * Math.cos(12 * t) },
  { name: "Bounce", body: "Playful and physical. For logos that land with a thud.", ease: "bounce.out", stroke: "#E0A82E", dot: "bg-sunbeam", f: bounceOut },
];
const ballStops = [
  { x: 6.67, o: "opacity-25" },
  { x: 21.67, o: "opacity-[0.43]" },
  { x: 41.67, o: "opacity-[0.61]" },
  { x: 66.67, o: "opacity-[0.79]" },
  { x: 96.67, o: "opacity-[0.97]" },
];

/* ── Storyboard captions ───────────────────────────────────────────────── */
const scenes = [
  { caption: "The P drops in from above", tilt: "rotate-[1deg]" },
  { caption: "Squash on impact", tilt: "rotate-[-1deg]" },
  { caption: "POP! burst", tilt: "rotate-[1deg]" },
  { caption: "Product reveal", tilt: "rotate-[-1deg]" },
  { caption: "App UI slides up", tilt: "rotate-[1deg]" },
  { caption: "Logo lockup + confetti", tilt: "rotate-[-1deg]" },
];

/* ── Formats ───────────────────────────────────────────────────────────── */
const formats = [
  { ratio: "16:9", use: "YouTube · Web", aspect: "aspect-[16/9]", tone: "border-lagoon bg-lagoon/15 text-lagoon" },
  { ratio: "1:1", use: "Feed posts", aspect: "aspect-square", tone: "border-blush bg-blush/15 text-blush-ink" },
  { ratio: "4:5", use: "Instagram", aspect: "aspect-[4/5]", tone: "border-grape bg-grape/15 text-grape" },
  { ratio: "9:16", use: "Reels · TikTok · Stories", aspect: "aspect-[9/16]", tone: "border-sunbeam bg-sunbeam/15 text-[#C99528]" },
];

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, l3] = service.heroLines;

  return (
    <MotionFx className="flex flex-col pb-[clamp(5rem,8.3vw,10rem)]">
      {/* ── Hero: bouncing title + editor preview ──────────────────── */}
      <section aria-labelledby="hero-title" className="relative isolate">
        {/* Decorative glows bleed up behind the header, so they can't live in flow. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[calc(100%+10rem)] bg-[radial-gradient(ellipse_32%_48%_at_18%_12%,rgb(242_119_147/0.32),transparent_72%),radial-gradient(ellipse_30%_45%_at_78%_58%,rgb(106_75_151/0.22),transparent_72%)]" />

        <div className="shell grid items-start gap-y-14 lg:grid-cols-[minmax(0,834fr)_minmax(0,754fr)]">
          <div className="pt-[clamp(1rem,2.6vw,3.125rem)]">
            <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.name }]} />
            <h1 id="hero-title" className="mt-[clamp(1rem,1.67vw,2rem)] uppercase">
              <span className="grid">
                <span aria-hidden className={`${layer} -ml-[13.85vw] flex h-0 flex-col gap-[max(0.25rem,1.04vw)] pt-[6.15vw]`}>
                  {speedLines.map((w, i) => (
                    <span key={w} className="h-[max(3px,0.3125vw)] shrink-0 rounded-full bg-blush/25" style={{ width: `${w / 19.2}vw`, marginLeft: `${(i * 60) / 19.2}vw` }} />
                  ))}
                </span>
                <span className="sr-only">{l1}</span>
                <span aria-hidden className={`${layer} flex font-display text-[clamp(3rem,6.77vw,8.125rem)] leading-[1.277]`}>
                  {[...l1].map((ch, i) => {
                    const look = letterLook[i % letterLook.length];
                    return (
                      <span key={i} data-bounce className={`inline-block ${look.color} ${look.rotate} ${i ? "-ml-[0.046em]" : ""}`} style={{ marginTop: `${look.drop}em` }}>
                        {ch}
                      </span>
                    );
                  })}
                </span>
              </span>
              <span className="-mt-[1.35vw] block font-haas text-[clamp(3.25rem,7.81vw,9.375rem)] leading-[1.087] tracking-[-0.05em] text-grape">{l2}</span>
              <span className="mt-[0.89vw] flex items-start gap-[2.66vw]">
                <span className="block font-display text-[clamp(1.75rem,4.17vw,5rem)] leading-[1.275] text-lagoon">{l3}</span>
                <span aria-hidden className="flex gap-[0.52vw]">
                  {trail.map((d, i) => (
                    <span key={i} data-float="6" className={`size-[max(0.875rem,1.875vw)] rounded-full bg-sunbeam ${d.o}`} style={{ marginTop: `${d.y / 19.2}vw` }} />
                  ))}
                </span>
              </span>
            </h1>
            <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">{service.heroIntro}</p>
            <PopButton href="/contact" label={service.heroCta} className="mt-[clamp(1.5rem,1.67vw,2rem)] [&>span:last-child]:text-ink" />
          </div>

          {/* Editor collage — 900 Figma px wide, bleeding into the right gutter. */}
          <div className="grid lg:-mr-[clamp(1.1rem,7.6vw,9.125rem)]">
            <VideoPlayer className={`${layer} w-[91.11%]`} />
            <div data-parallax="-12" className={`${layer} mt-[67.03%] w-full rotate-[5deg] lg:-ml-[12.15%] lg:w-[111.11%]`}>
              <FilmStrip />
            </div>
            <span
              data-float="8"
              className={`${layer} mt-[46.52%] ml-[72.68%] grid w-[26.67%] rotate-[-10deg] place-items-center rounded-full bg-sunbeam py-[2.2%] font-display text-[clamp(0.6875rem,1.04vw,1.25rem)] leading-none whitespace-nowrap text-ink shadow-[0_10px_24px_rgb(34_1_40/0.15)]`}
            >
              60 FPS VIBES
            </span>
          </div>
        </div>
      </section>

      {/* ── Keyframe timeline ──────────────────────────────────────── */}
      <section aria-labelledby="timeline-title" className="shell mt-[clamp(5rem,18vw,21.25rem)]">
        <SectionTitle eyebrow="The timeline" title={<span id="timeline-title">Keyframes with character</span>} />
        <div data-reveal className={`${headingGap} overflow-x-auto rounded-[clamp(1.25rem,1.67vw,2rem)] shadow-[0_24px_60px_rgb(34_1_40/0.2)]`}>
          <Timeline />
        </div>
        <p data-reveal className="mt-[clamp(1rem,1.04vw,1.25rem)] max-w-[56rem] font-copy text-body leading-[1.64] font-light">
          Every move has a reason: weight, timing and a little bounce — choreographed frame by frame.
        </p>
      </section>

      {/* ── Easing curves ──────────────────────────────────────────── */}
      <section aria-labelledby="easing-title" className="shell mt-[clamp(3.5rem,4.4vw,5.25rem)]">
        <SectionTitle align="center" eyebrow="The secret sauce" title={<span id="easing-title">Easing curves with attitude</span>} />
        <ul data-reveal-stagger className={`grid gap-[clamp(1rem,1.77vw,2.125rem)] md:grid-cols-3 ${headingGap}`}>
          {easings.map((e) => (
            <li key={e.name} data-ease={e.ease} className={`@container rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white ${cardShadow}`}>
              <div className="px-[9.62cqw] pt-[9.62cqw] pb-[8.85cqw]">
              <svg viewBox="0 0 420 300" aria-hidden className="block w-full overflow-visible rounded-[2.31cqw] bg-paper">
                {[70, 140, 210, 280, 350].map((x) => (
                  <line key={`v${x}`} x1={x} x2={x} y1="0" y2="300" stroke="#6A4B97" strokeOpacity="0.08" />
                ))}
                {[50, 100, 150, 200, 250].map((y) => (
                  <line key={`h${y}`} x1="0" x2="420" y1={y} y2={y} stroke="#6A4B97" strokeOpacity="0.08" />
                ))}
                <path data-curve d={curve(e.f)} fill="none" stroke={e.stroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
              </svg>
              <div aria-hidden className="mt-[3.85cqw] grid">
                {ballStops.map((b) => (
                  <span key={b.x} className={`${layer} aspect-square w-[6.67%] rounded-full ${e.dot} ${b.o}`} style={{ marginLeft: `${b.x - 6.67}%` }} />
                ))}
                <span
                  data-ease-dot
                  className={`${layer} invisible aspect-square w-[6.67%] rounded-full ${e.dot} ring-[0.8cqw] ring-white shadow-[0_4px_12px_rgb(34_1_40/0.25)]`}
                  style={{ "--x": 0, marginLeft: "calc(var(--x) * 90%)" } as CSSProperties}
                />
              </div>
              <h3 className="mt-[2.31cqw] font-display text-[max(1.5rem,6.54cqw)] leading-[1.27] text-grape uppercase">{e.name}</h3>
              <p className="mt-[0.96cqw] font-copy text-[max(0.9375rem,3.65cqw)] leading-[1.47] text-ink/80">{e.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Storyboard ─────────────────────────────────────────────── */}
      <section aria-labelledby="storyboard-title" className="shell mt-[clamp(4rem,6.25vw,7.5rem)]">
        <SectionTitle eyebrow="Storyboard" title={<span id="storyboard-title">Every frame, planned</span>} />
        <ol data-reveal-stagger className={`grid gap-x-[clamp(1rem,2.08vw,2.5rem)] gap-y-[clamp(2rem,4vw,4.8rem)] sm:grid-cols-2 lg:grid-cols-3 ${headingGap} lg:mt-[clamp(2.5rem,4.48vw,5.375rem)]`}>
          {scenes.map((s, i) => (
            <li key={s.caption} className="@container">
              <figure>
                <div className={`grid aspect-[500/300] overflow-hidden rounded-[2.4cqw] border-[max(3px,1.2cqw)] border-ink bg-white ${s.tilt} ${cardShadow}`}>
                  <Panel index={i} />
                </div>
                <figcaption className="mt-[4cqw] font-display text-[clamp(0.8125rem,0.94vw,1.125rem)] text-grape">
                  SC {String(i + 1).padStart(2, "0")} — {s.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Social reels band ──────────────────────────────────────── */}
      <section
        aria-labelledby="reels-title"
        className="mx-auto mt-[clamp(4rem,8.7vw,10.5rem)] w-full max-w-[1920px] overflow-hidden rounded-[clamp(2rem,3.33vw,4rem)] bg-dusk px-5 pt-[clamp(3rem,4.69vw,5.625rem)] pb-[clamp(2.5rem,3.5vw,4rem)]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 42% 55% at 13% 15%, rgb(106 75 151 / 0.6), transparent 72%), radial-gradient(ellipse 42% 55% at 91% 85%, rgb(242 119 147 / 0.35), transparent 72%)",
        }}
      >
        <SectionTitle align="center" tone="dark" eyebrow="Social reels" title={<span id="reels-title">Made for the thumb-stop</span>} titleClassName="!text-white" />
        <ul data-reveal-stagger className="mt-[clamp(1.75rem,2.4vw,2.875rem)] flex items-start justify-center gap-[clamp(0.5rem,1.56vw,1.875rem)]">
          <Reel base={320} img={filmFrames[0]} views="1.2M" title="Glow routine" className="mt-[2.08vw] w-[clamp(6.25rem,16.67vw,20rem)] rotate-[6deg]" />
          <Reel base={380} img={{ src: "motion-graphic/reel-clim.webp", w: 494, h: 480, alt: "Colourful product set for the Clim campaign" }} views="3.4M" title="Bold flavour drop" fit className="w-[clamp(7.5rem,19.79vw,23.75rem)]" />
          <Reel base={320} img={filmFrames[2]} views="860K" title="Behind the motion" className="mt-[2.08vw] w-[clamp(6.25rem,16.67vw,20rem)] rotate-[-6deg]" />
        </ul>
      </section>

      {/* ── Formats ────────────────────────────────────────────────── */}
      <section aria-labelledby="formats-title" className="shell mt-[clamp(4rem,7.3vw,8.75rem)]">
        <SectionTitle eyebrow="Every format" title={<span id="formats-title">One idea. Every screen size.</span>} />
        <ul data-reveal-stagger className="mt-[clamp(2.5rem,8.85vw,10.625rem)] grid grid-cols-2 gap-x-[clamp(1rem,2.08vw,2.5rem)] gap-y-0 md:grid-cols-[minmax(0,560fr)_minmax(0,340fr)_minmax(0,300fr)_minmax(0,240fr)] md:pr-[1.75%]">
          {formats.map((f) => (
            <li key={f.ratio} className="row-span-2 grid grid-rows-subgrid gap-0">
              <div className={`grid place-items-center self-end rounded-[clamp(0.75rem,1.04vw,1.25rem)] border-[3px] border-dashed lg:border-4 ${f.aspect} ${f.tone}`}>
                <span className="font-pop text-[clamp(2.25rem,5.2vw,6.25rem)] leading-[1.1]">{f.ratio}</span>
              </div>
              <p className="mt-[clamp(0.75rem,1.04vw,1.25rem)] mb-8 font-display text-[clamp(0.75rem,0.94vw,1.125rem)] text-grape md:mb-0">{f.use}</p>
            </li>
          ))}
        </ul>
      </section>
    </MotionFx>
  );
}

/** Figma "Film strip" (378:72): 1000 × 170, sprocket holes over six frames (1cqw = 10 Figma px). */
function FilmStrip() {
  const holes = (
    <span aria-hidden className="flex justify-between pr-[1.9cqw] pl-[1.2cqw]">
      {Array.from({ length: 22 }, (_, i) => (
        <span key={i} className="h-[1.6cqw] w-[2.4cqw] rounded-[0.4cqw] bg-cream/80" />
      ))}
    </span>
  );
  return (
    <div className="@container">
      <div className="flex flex-col gap-[1cqw] rounded-[0.8cqw] bg-ink py-[1cqw] shadow-[0_24px_60px_rgb(34_1_40/0.2)]">
        {holes}
        <ul className="flex gap-[0.8cqw] pl-[1.4cqw]">
          {filmFrames.map((f) => (
            <li key={f.src} className="h-[9.8cqw] w-[15.6cqw] shrink-0 overflow-hidden rounded-[0.4cqw]">
              <Image src={`/assets/inner/${f.src}`} alt={f.alt} width={f.w} height={f.h} sizes="(min-width: 1024px) 9vw, 16vw" className="h-full w-full object-cover" />
            </li>
          ))}
        </ul>
        {holes}
      </div>
    </div>
  );
}

/** Figma "Animation timeline" (378:127), 1588 × 620. `--p` (0–1) drives the playhead; MotionFx scrubs it. */
function Timeline() {
  const c = (px: number) => u(px, TL);
  return (
    <div className="@container min-w-[56rem]">
      <div
        data-timeline
        role="img"
        aria-label="Animation timeline over five seconds: the logo drops and squashes, the headline types on, the background gradient loops, sparkles burst twice and a sound waveform runs underneath."
        className="grid bg-code text-white"
        style={{
          "--p": 0.48,
          gridTemplateColumns: `${c(track.x)} 1fr`,
          gridTemplateRows: `${c(64)} repeat(5, ${c(96)}) ${c(76)}`,
        } as CSSProperties}
      >
        <span className="col-start-1 row-span-full row-start-1 bg-white/[0.04]" />

        {/* Ruler: a tick every 0.5s, labelled every second. */}
        <div className="col-start-2 row-start-1 grid">
          {Array.from({ length: 11 }, (_, k) => {
            const x = 300 + k * 125;
            return (
              <span key={k} className={layer} style={{ marginLeft: at(x), marginTop: c(30) }}>
                <span className="block w-px bg-white/40" style={{ height: c(k % 2 ? 10 : 18) }} />
              </span>
            );
          })}
          {Array.from({ length: 6 }, (_, s) => (
            <span key={s} className={`${layer} ${mono.className} leading-none text-white/50`} style={{ marginLeft: at(306 + s * 250), marginTop: c(26), fontSize: `max(0.625rem, ${c(13)})` }}>
              {s}s
            </span>
          ))}
        </div>

        {lanes.map((lane, r) => (
          <LaneRow key={lane.label} row={r + 2} label={lane.label} dot={lane.dot}>
            {lane.clips.map((clip) => (
              <span
                key={clip.x}
                className={`col-start-1 row-start-1 flex items-center self-center justify-self-start font-copy font-bold ${clip.tone}`}
                style={{ marginLeft: at(clip.x), width: `${(clip.w / track.w) * 100}%`, height: c(56), borderRadius: c(12), paddingLeft: c(32), fontSize: `max(0.6875rem, ${c(15)})` }}
              >
                {clip.name}
              </span>
            ))}
            {lane.keys.map((k) => (
              <span
                key={k}
                className="col-start-1 row-start-1 rotate-45 self-center justify-self-start rounded-[2px] bg-white"
                style={{ marginLeft: at(k + 3.3), width: c(16), height: c(16), marginBottom: c(24) }}
              />
            ))}
          </LaneRow>
        ))}

        <LaneRow row={6} label="Sound" last>
          <svg viewBox="0 0 1204 56" preserveAspectRatio="none" className="col-start-1 row-start-1 self-center" style={{ marginLeft: at(300), width: `${(1204 / track.w) * 100}%`, height: c(56) }}>
            {wave.map((h, i) => (
              <rect key={i} x={i * 8} y={28 - h / 2} width="4" height={h} rx="2" fill="#B79BE0" fillOpacity="0.8" />
            ))}
          </svg>
        </LaneRow>

        {/* Playhead: a zero-width column centred on the line, so the label overhangs both sides evenly. */}
        <div className="pointer-events-none col-span-full row-span-full row-start-1 flex" style={{ paddingTop: c(44) }}>
          <div className="flex w-0 flex-col items-center" style={{ marginLeft: `calc((300 + 1250 * var(--p)) / ${TL} * 100%)` }}>
            <span
              data-timecode
              className={`${mono.className} grid shrink-0 place-items-center bg-blush leading-none text-white`}
              style={{ width: c(94), height: c(28), borderRadius: c(8), fontSize: `max(0.6875rem, ${c(14)})` }}
            >
              00:02:12
            </span>
            <span className="grow bg-blush" style={{ width: `max(2px, ${c(3)})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LaneRow({ row, label, dot, last, children }: { row: number; label: string; dot?: string; last?: boolean; children: ReactNode }) {
  const c = (px: number) => u(px, TL);
  return (
    <>
      <span className="col-start-1 flex items-center justify-between font-display uppercase" style={{ gridRow: row, paddingLeft: c(32), paddingRight: c(26), fontSize: `max(0.6875rem, ${c(16)})` }}>
        {label}
        {dot ? <span className={`shrink-0 rounded-full ${dot}`} style={{ width: c(14), height: c(14) }} /> : null}
      </span>
      <div className={`col-start-2 grid ${last ? "" : "border-b border-white/[0.06]"}`} style={{ gridRow: row }}>
        {children}
      </div>
    </>
  );
}

/** The six storyboard panels (Figma 379:97 → 379:124), 500 × 300 each; 1cqw = 5 Figma px. */
function Panel({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <>
          <span aria-hidden className={`${layer} mt-[4cqw] ml-[36cqw] flex items-start gap-[6.8cqw]`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[10cqw] w-[1.2cqw] rounded-full bg-ink/40" style={{ marginTop: `${i * 1.2}cqw` }} />
            ))}
          </span>
          <span className={`${layer} mt-[8cqw] ml-[40cqw] font-pop text-[36cqw] leading-[36cqw] text-blush-ink`}>P</span>
          <span aria-hidden className={`${layer} mt-[50cqw] ml-[12cqw] h-[0.8cqw] w-[76cqw] bg-ink/30`} />
        </>
      );
    case 1:
      return (
        <>
          <span className={`${layer} mt-[19cqw] ml-[30cqw] origin-bottom scale-x-[1.4] scale-y-[0.6] font-pop text-[36cqw] leading-[36cqw] text-blush-ink`}>P</span>
          <span aria-hidden className={`${layer} mt-[46cqw] ml-[24cqw] h-[0.8cqw] w-[6cqw] bg-ink/40`} />
          <span aria-hidden className={`${layer} mt-[46cqw] ml-[72cqw] h-[0.8cqw] w-[6cqw] bg-ink/40`} />
          <span aria-hidden className={`${layer} mt-[50cqw] ml-[12cqw] h-[0.8cqw] w-[76cqw] bg-ink/30`} />
        </>
      );
    case 2:
      return (
        <>
          <svg viewBox="0 0 240 240" aria-hidden className="col-start-1 row-start-1 w-[48cqw] place-self-center fill-sunbeam">
            <polygon
              points={Array.from({ length: 28 }, (_, i) => {
                const a = (i / 28) * Math.PI * 2 - Math.PI / 2;
                const r = i % 2 ? 72 : 120;
                return `${(120 + r * Math.cos(a)).toFixed(1)},${(120 + r * Math.sin(a)).toFixed(1)}`;
              }).join(" ")}
            />
          </svg>
          <span className="col-start-1 row-start-1 place-self-center font-pop text-[14cqw] leading-[16cqw] text-blush-ink">POP!</span>
        </>
      );
    case 3:
      return (
        <>
          <Image
            src="/assets/inner/brand-identity/fifth-sip-packaging.webp"
            alt="Fifth Sip packaging: cups, tray, menu and coffee pouch"
            width={980}
            height={640}
            sizes="(min-width: 1024px) 26vw, (min-width: 640px) 50vw, 100vw"
            className="col-start-1 row-start-1 h-full w-full object-cover"
          />
          <span className={`${layer} mt-[4cqw] ml-[4cqw] grid h-[7.2cqw] w-[24cqw] place-items-center rounded-full bg-ink font-display text-[max(0.5625rem,2.8cqw)] leading-none text-white`}>
            ZOOM IN
          </span>
        </>
      );
    case 4:
      return (
        <>
          <span className={`${layer} mt-[8cqw] ml-[34cqw] h-[56cqw] w-[32cqw] rounded-[4.8cqw] bg-ink p-[1.6cqw]`}>
            <Image src="/assets/inner/ui-shop.webp" alt="Shop app interface sliding up on a phone" width={1600} height={900} sizes="12vw" className="h-full w-full rounded-[3.6cqw] object-cover object-left" />
          </span>
          <svg viewBox="0 0 40 110" aria-hidden className={`${layer} mt-[20cqw] ml-[73cqw] w-[8cqw] fill-none stroke-lagoon`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 104V8M6 24 20 8l14 16" />
          </svg>
        </>
      );
    default:
      return (
        <>
          {[
            [12, 8, "bg-blush"],
            [84, 12, "bg-lagoon"],
            [16, 44, "bg-sunbeam"],
            [80, 42, "bg-blush"],
            [50, 6, "bg-sunbeam"],
            [48, 50, "bg-lagoon"],
          ].map(([x, y, bg]) => (
            <span key={`${x}-${y}`} aria-hidden className={`${layer} size-[3.2cqw] rotate-[-30deg] rounded-[0.6cqw] ${bg}`} style={{ marginLeft: `${x}cqw`, marginTop: `${y}cqw` }} />
          ))}
          <span className="col-start-1 row-start-1 place-self-center text-center font-pop text-[14.4cqw] leading-[15.2cqw] text-grape">
            PIXEL
            <br />
            POPERS
          </span>
        </>
      );
  }
}

/** Figma "Reel 1–3" (380:26 / 34 / 42): phone-shaped reel cards on the dark band. */
function Reel({
  base,
  img,
  views,
  title,
  fit,
  className,
}: {
  base: number;
  img: (typeof filmFrames)[number];
  views: string;
  title: string;
  fit?: boolean;
  className: string;
}) {
  const h = base === 320 ? 570 : 676;
  const c = (px: number) => u(px, base);
  return (
    <li className={`@container shrink-0 ${className}`}>
      <article className="grid overflow-hidden bg-ink shadow-[0_30px_60px_rgb(0_0_0/0.4)]" style={{ aspectRatio: `${base} / ${h}`, borderRadius: c(40), padding: c(10) }}>
        <div className="col-start-1 row-start-1 grid overflow-hidden" style={{ borderRadius: c(32) }}>
          <Image
            src={`/assets/inner/${img.src}`}
            alt={img.alt}
            width={img.w}
            height={img.h}
            sizes="(min-width: 1024px) 20vw, 33vw"
            className={`col-start-1 row-start-1 w-full object-cover ${fit ? "self-start" : "h-full"}`}
            style={fit ? { height: c(350), marginTop: c(153) } : undefined}
          />
          <span className="col-start-1 row-start-1 self-end bg-ink/50" style={{ height: c(190) }} />
        </div>
        <span aria-hidden className="col-start-1 row-start-1 grid place-items-center self-center justify-self-center rounded-full bg-blush" style={{ width: c(90), height: c(90) }}>
          <svg viewBox="0 0 36 36" className="fill-white" style={{ width: c(36), marginLeft: c(6) }}>
            <path d="M4 1 L34 18 L4 35 Z" />
          </svg>
        </span>
        <span aria-hidden className="col-start-1 row-start-1 flex flex-col items-center self-start justify-self-start text-white" style={{ marginTop: c(h - 270), marginLeft: c(base - 70), gap: c(22) }}>
          <svg viewBox="0 0 24 24" fill="#FF4D6D" style={{ width: c(28) }}>
            <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="#fff" style={{ width: c(28) }}>
            <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: c(28) }}>
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
        <div className="col-start-1 row-start-1 self-start justify-self-start text-white" style={{ marginTop: c(h - 160), marginLeft: c(20) }}>
          <p className="font-copy font-bold" style={{ fontSize: `max(0.5rem, ${c(18)})` }}>
            ▶ {views} views
          </p>
          <h3 className="font-display leading-[1.27]" style={{ fontSize: `max(0.5625rem, ${c(22)})`, marginTop: c(10) }}>
            {title}
          </h3>
        </div>
      </article>
    </li>
  );
}
