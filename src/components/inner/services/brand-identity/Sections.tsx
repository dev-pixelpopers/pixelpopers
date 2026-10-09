import Image from "next/image";
import type { ReactNode } from "react";
import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import type { ServiceDetail } from "@/lib/service-content";
import BeforeAfter from "./BeforeAfter";
import BrandMotion from "./BrandMotion";
import RevealCard from "@/components/inner/RevealCard";

/*
  Concept: the page is a brand book. Figma frame 364:21 "03.1 — Service: BRAND
  IDENTITY". Collages (hero book stack, construction canvas, stationery
  flat-lay) are single-cell grids: every layer sits in the same cell and is
  placed with percentage margins (which resolve against the cell width, so
  the whole collage scales as one). Text inside a collage piece uses `cqw`
  units of its nearest `@container`, measured off the 1920 Figma frame.
*/

const layer = "col-start-1 row-start-1 self-start justify-self-start";

const contents = [
  { n: "01", label: "Strategy", href: "#chapters", color: "text-blush-ink" },
  { n: "02", label: "Logo", href: "#logo", color: "text-grape" },
  { n: "03", label: "Colour", href: "#colour", color: "text-lagoon" },
  { n: "04", label: "Type", href: "#type", color: "text-sunbeam" },
  { n: "05", label: "Applications", href: "#applications", color: "text-blush-ink" },
  { n: "06", label: "Guidelines", href: "#glow-up", color: "text-grape" },
];

const anatomy = [
  { title: "Clear space", body: "Keep one “P-height” free around the mark.", dot: "bg-lagoon" },
  { title: "Minimum size", body: "24px on screen · 10mm in print.", dot: "bg-blush" },
  { title: "The don’ts", body: "No stretching, recolouring or outlining.", dot: "bg-sunbeam" },
];

const swatches = [
  { role: "Primary", name: "Pop Pink", hex: "#F27793", rgb: "242 · 119 · 147", cmyk: "0 · 51 · 39 · 5", bg: "bg-blush", tone: "text-white" },
  { role: "Primary", name: "Grape", hex: "#6A4B97", rgb: "106 · 75 · 151", cmyk: "30 · 50 · 0 · 41", bg: "bg-grape", tone: "text-white" },
  { role: "Accent", name: "Fizz", hex: "#3FB7C7", rgb: "63 · 183 · 199", cmyk: "68 · 8 · 0 · 22", bg: "bg-lagoon", tone: "text-white" },
  { role: "Accent", name: "Sunny", hex: "#F5C255", rgb: "245 · 194 · 85", cmyk: "0 · 21 · 65 · 4", bg: "bg-sunbeam", tone: "text-ink" },
  { role: "Text", name: "Midnight", hex: "#220128", rgb: "34 · 1 · 40", cmyk: "15 · 98 · 0 · 84", bg: "bg-ink", tone: "text-white" },
];

const chapters = [
  { blurb: "Brand workshop, competitor scan & audience deep-dive.", bg: "bg-blush", text: "text-blush-ink", tone: "text-white", stripe: "bg-white/30", tilt: "rotate-[-1.5deg]" },
  { blurb: "Story, voice & the one idea your brand owns.", bg: "bg-grape", text: "text-grape", tone: "text-white", stripe: "bg-white/30", tilt: "rotate-[1deg]" },
  { blurb: "Three routes, refined into one bold identity.", bg: "bg-lagoon", text: "text-lagoon", tone: "text-white", stripe: "bg-white/30", tilt: "rotate-[-1deg]" },
  { blurb: "Guidelines, assets & launch support.", bg: "bg-sunbeam", text: "text-sunbeam", tone: "text-ink", stripe: "bg-ink/30", tilt: "rotate-[1.5deg]" },
];

const chapterWords = ["one", "two", "three", "four"];
/** Applied to the flipper when the chapter is hovered, focused or tapped open. */
const flipOpen =
  "group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)] group-data-[open=true]:[transform:rotateY(180deg)]";

const cardShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.15)]";
const pieceShadow = "shadow-[0_clamp(0.5rem,1.4cqw,1.375rem)_clamp(1rem,2.5cqw,2.5rem)_rgb(0_0_0/0.35)]";
const headingGap = "mt-[clamp(2.5rem,3.96vw,4.75rem)]";

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, l3] = service.heroLines;

  return (
    <BrandMotion className="flex flex-col pb-[clamp(5rem,9.4vw,11.25rem)]">
      {/* ── Hero: the brand book stack ─────────────────────────────── */}
      <section aria-labelledby="hero-title" className="relative isolate">
        {/* Decorative glows bleed up behind the header, so they can't live in flow. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[calc(100%+10rem)] bg-[radial-gradient(ellipse_32%_42%_at_18%_14%,rgb(242_119_147/0.32),transparent_72%),radial-gradient(ellipse_30%_38%_at_78%_52%,rgb(245_194_85/0.26),transparent_72%)]" />

        <div className="shell grid items-start gap-y-12 lg:grid-cols-[minmax(0,854fr)_minmax(0,734fr)]">
          <div className="pt-[clamp(1rem,2.6vw,3.125rem)]">
            <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.name }]} />
            <h1 id="hero-title" className="mt-[clamp(1.5rem,3.3vw,3.9rem)] uppercase">
              <span className="block font-display text-[clamp(3rem,6.77vw,8.125rem)] leading-[1.08] text-blush-ink">{l1}</span>
              <span className="block font-haas text-[clamp(3.25rem,7.81vw,9.375rem)] leading-[1.2] tracking-[-0.05em] text-grape">{l2}</span>
              <span className="block font-display text-[clamp(1.75rem,4.17vw,5rem)] leading-[1.28] text-lagoon">{l3}</span>
            </h1>
            <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">{service.heroIntro}</p>
            <PopButton href="/contact" label={service.heroCta} className="mt-[clamp(2rem,3vw,3.625rem)] [&>span:last-child]:text-ink" />
            <a href="#brand-book" className="mt-[clamp(1.5rem,1.67vw,2rem)] block w-fit font-display text-micro text-blush-deep uppercase transition-colors hover:text-grape">
              See the brand book ↓
            </a>
          </div>

          {/* Book stack collage — 900 × ~930 Figma units, bleeding into the right gutter. */}
          <div aria-hidden className="@container grid lg:-mt-[3.65vw] lg:-mr-[clamp(1.25rem,8.65vw,10.375rem)]">
            <div data-parallax="-6" className={`${layer} mt-[2.4%] ml-[37.06%] aspect-[500/660] w-[55.56%] rotate-[-10deg] rounded-[2.67cqw] bg-sunbeam ${cardShadow}`} />
            <div data-parallax="-3" className={`${layer} mt-[6.5%] ml-[18.7%] aspect-[500/660] w-[55.56%] rotate-[2deg] rounded-[2.67cqw] bg-lagoon ${cardShadow}`} />
            <div className={`${layer} @container mt-[14.62%] ml-[1.29%] aspect-[500/660] w-[55.56%] rotate-[8deg] overflow-hidden rounded-[2.67cqw] bg-grape ${cardShadow}`}>
              <div className="grid h-full">
                <span className="col-start-1 row-start-1 h-full w-[5.6cqw] bg-ink/25" />
                <span className={`${layer} mt-[8cqw] ml-[24cqw] font-pop text-[88cqw] leading-[88cqw] text-blush-ink`}>P</span>
                <span className={`${layer} mt-[100cqw] ml-[12cqw] font-display text-[5.2cqw] leading-[1.27] whitespace-nowrap text-white`}>
                  BRAND GUIDELINES
                  <span className="mt-[1.2cqw] block font-copy text-[3.2cqw] font-medium text-white/80">VOL. 01 · 2026</span>
                </span>
                <Image src="/assets/logo-pixelpopers.png" alt="" width={1906} height={933} sizes="120px" className={`${layer} mt-[116cqw] ml-[66cqw] h-auto w-[26.8cqw]`} />
              </div>
            </div>
            <div data-parallax="-10" className={`${layer} mt-[62.43%] ml-[37.43%] aspect-[520/350] w-[57.78%] rotate-[-6deg] overflow-hidden rounded-[2.67cqw] border-[1.11cqw] border-white ${cardShadow}`}>
              <Image
                src="/assets/inner/brand-identity/fifth-sip-packaging.webp"
                alt=""
                width={980}
                height={640}
                sizes="(min-width: 1024px) 28vw, 60vw"
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <div className={`${layer} mt-[95.56%] ml-[10%] flex`}>
              {["bg-blush", "bg-grape", "bg-lagoon", "bg-sunbeam", "bg-ink"].map((c, i) => (
                <span key={c} data-float="5" className={`size-[7.11cqw] rounded-full border-[0.44cqw] border-cream ${c} ${i ? "-ml-[2.67cqw]" : ""}`} />
              ))}
            </div>
            <span data-float="10" className={`${layer} mt-[19.57%] ml-[67.05%] w-[33.33%] rotate-[-9deg] rounded-full bg-sunbeam py-[2.4cqw] text-center font-display text-[2.22cqw] leading-none text-ink shadow-[0_10px_24px_rgb(34_1_40/0.15)]`}>
              LOGO TO LAUNCH ✦
            </span>
          </div>
        </div>
      </section>

      {/* ── Brand book contents strip ──────────────────────────────── */}
      <nav id="brand-book" aria-label="Brand book contents" className="shell mt-[clamp(3.5rem,6.8vw,8.125rem)] scroll-mt-8">
        <div data-reveal className={`rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white px-[clamp(1.25rem,2.08vw,2.5rem)] pt-[clamp(1.25rem,1.46vw,1.75rem)] pb-[clamp(1.5rem,1.77vw,2.125rem)] ${cardShadow}`}>
          <p className="font-display text-micro text-blush-deep uppercase">Contents</p>
          <ol className="mt-[clamp(0.75rem,0.94vw,1.125rem)] grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {contents.map((c, i) => (
              <li key={c.n} className={i % 6 ? "lg:border-l lg:border-ink/10 lg:pl-[1.3vw]" : ""}>
                <a href={c.href} className="group block w-fit">
                  <span className={`block font-pop text-[clamp(2.75rem,3.33vw,4rem)] leading-[1.125] ${c.color}`}>{c.n}</span>
                  <span className="mt-[0.4em] block font-display text-[clamp(0.875rem,1.04vw,1.25rem)] text-grape uppercase transition-colors group-hover:text-blush-deep">
                    {c.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ── Logo anatomy ───────────────────────────────────────────── */}
      <section id="logo" aria-labelledby="logo-title" className="shell mt-[clamp(4.5rem,7.8vw,9.375rem)] grid scroll-mt-8 items-start gap-y-12 lg:grid-cols-[minmax(0,640fr)_minmax(0,900fr)] lg:gap-x-[2.8vw]">
        <div>
          <SectionTitle
            eyebrow="Logo anatomy"
            title={
              <span id="logo-title">
                Every curve
                <br />
                has a reason
              </span>
            }
            titleClassName="!text-[clamp(2rem,3.54vw,4.25rem)] !leading-[1.18]"
          />
          <p data-reveal className="mt-[clamp(1.25rem,1.77vw,2.125rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">
            We design marks on a grid, test them at 16px and on a billboard, and document every rule so your logo never gets squished again.
          </p>
          <ul data-reveal-stagger className="mt-[clamp(2rem,2.7vw,3.25rem)] flex flex-col gap-[clamp(1.5rem,2.45vw,2.9rem)]">
            {anatomy.map((a) => (
              <li key={a.title} className="flex gap-4">
                <span aria-hidden className={`mt-[0.3em] size-[clamp(1rem,1.15vw,1.375rem)] shrink-0 rounded-full ${a.dot}`} />
                <div>
                  <h3 className="font-display text-[clamp(1rem,1.15vw,1.375rem)] leading-[1.27] text-grape uppercase">{a.title}</h3>
                  <p className="mt-1.5 font-copy text-[clamp(0.875rem,0.99vw,1.1875rem)] text-ink/80">{a.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <figure data-reveal className={`@container grid aspect-[900/820] overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white ${cardShadow}`}>
          <svg viewBox="0 0 900 820" aria-hidden className="col-start-1 row-start-1 h-full w-full">
            <defs>
              <pattern id="bi-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M0 0V50M0 0H50" fill="none" stroke="#6A4B97" strokeOpacity="0.08" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="900" height="820" fill="url(#bi-grid)" />
            <text x="452" y="563" textAnchor="middle" fontSize="620" fill="#F27793" className="font-pop">
              P
            </text>
            <circle cx="450" cy="380" r="259" fill="none" stroke="#3FB7C7" strokeWidth="2" strokeDasharray="10 8" />
            <circle cx="480" cy="350" r="149" fill="none" stroke="#6A4B97" strokeWidth="2" strokeDasharray="10 8" />
            <rect x="209" y="91" width="482" height="638" fill="none" stroke="#F27793" strokeWidth="2" strokeDasharray="10 8" />
            <line x1="170" y1="700" x2="730" y2="350" stroke="#3FB7C7" strokeWidth="2" />
            <rect x="208" y="50" width="60" height="2" fill="#220128" />
            <text x="236" y="42" textAnchor="middle" fontSize="22" fill="#220128" className="font-display">
              x
            </text>
            <rect x="203" y="85" width="10" height="10" fill="#fff" stroke="#F27793" strokeWidth="2" />
            <rect x="687" y="725" width="10" height="10" fill="#fff" stroke="#3FB7C7" strokeWidth="2" />
          </svg>
          <div className="col-start-1 row-start-1 flex justify-between self-start px-[3.1cqw] pt-[2.67cqw] pr-[7.4cqw] font-display text-[max(0.625rem,1.56cqw)] text-grape/60 uppercase">
            <span>Grid 50px</span>
            <span>Mark · v3 final</span>
          </div>
          <figcaption className="sr-only">Construction grid for the Pixel Popers “P” mark, showing clear space, construction circles and the diagonal guide.</figcaption>
        </figure>
      </section>

      {/* ── Colour system ──────────────────────────────────────────── */}
      <section id="colour" aria-labelledby="colour-title" className="mt-[clamp(3.5rem,4.17vw,5rem)] scroll-mt-8">
        <div className="shell">
          <SectionTitle align="center" eyebrow="Colour system" title={<span id="colour-title">Palettes that feel like you</span>} />
        </div>
        <ul data-reveal-stagger className={`mx-auto grid max-w-[1920px] sm:grid-cols-2 lg:grid-cols-5 ${headingGap}`}>
          {swatches.map((s, i) => (
            <li
              key={s.name}
              className={`flex min-h-[15rem] flex-col px-[clamp(1.25rem,1.67vw,2rem)] pt-[clamp(1.25rem,1.875vw,2.25rem)] pb-[clamp(1.5rem,4.9vw,5.875rem)] lg:aspect-[384/680] ${s.bg} ${s.tone} ${i % 2 ? "lg:mt-[2.08vw]" : ""} ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="flex items-start justify-between">
                <span className="mt-[0.2em] font-display text-[clamp(0.6875rem,0.73vw,0.875rem)] uppercase opacity-80">{s.role}</span>
                <span aria-hidden className="-mt-[clamp(0.5rem,1.35vw,1.625rem)] -mr-[clamp(0.25rem,0.73vw,0.875rem)] font-pop text-[clamp(3.5rem,6.25vw,7.5rem)] leading-[1.08] opacity-25">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-auto">
                <h3 className="font-display text-[clamp(1.375rem,2.08vw,2.5rem)] leading-[1.27] uppercase">{s.name}</h3>
                <p className="mt-[0.25em] font-haas text-[clamp(1.0625rem,1.35vw,1.625rem)]">{s.hex}</p>
                <p className="mt-[clamp(0.75rem,1.15vw,1.375rem)] font-copy text-[clamp(0.8125rem,0.885vw,1.0625rem)] opacity-85">RGB&nbsp;&nbsp;{s.rgb}</p>
                <p className="mt-[0.6em] font-copy text-[clamp(0.8125rem,0.885vw,1.0625rem)] opacity-85">CMYK&nbsp;&nbsp;{s.cmyk}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Type specimen ──────────────────────────────────────────── */}
      <section id="type" aria-labelledby="type-title" className="shell mt-[clamp(3.5rem,4.17vw,5rem)] scroll-mt-8">
        <div data-reveal className={`grid overflow-hidden rounded-[clamp(1.75rem,2.08vw,2.5rem)] bg-white lg:grid-cols-[minmax(0,580fr)_1px_minmax(0,948fr)] ${cardShadow}`}>
          <p aria-hidden className="px-[clamp(1.25rem,2.08vw,2.5rem)] pt-[clamp(0.5rem,1.04vw,1.25rem)] font-pop text-[clamp(8rem,23.96vw,28.75rem)] leading-[1.04] text-grape">
            Aa
          </p>
          <span aria-hidden className="mx-[clamp(1.25rem,2.08vw,2.5rem)] h-px bg-ink/10 lg:mx-0 lg:my-[3.125vw] lg:h-auto lg:w-px" />
          <div className="px-[clamp(1.25rem,3.125vw,3.75rem)] pt-[clamp(1.75rem,2.9vw,3.5rem)] pb-[clamp(2rem,3.125vw,3.75rem)]">
            <h2 id="type-title" className="font-haas text-[clamp(1.75rem,2.5vw,3rem)] leading-[1.08] text-blush-ink uppercase">
              Typography
            </h2>
            <p className="mt-[clamp(1.25rem,1.67vw,2rem)] font-display text-[clamp(0.6875rem,0.78vw,0.9375rem)] text-blush-deep uppercase">Display — Nevera</p>
            <p className="mt-1 font-display text-[clamp(2.25rem,5vw,6rem)] leading-[1.27] text-grape uppercase">Pop! Wow. Yes.</p>
            <p className="mt-[clamp(0.75rem,1.15vw,1.375rem)] font-display text-[clamp(0.6875rem,0.78vw,0.9375rem)] text-blush-deep uppercase">Body — Haas Grot Disp</p>
            <p className="mt-3 max-w-[52.5rem] font-haas text-[clamp(1.0625rem,1.25vw,1.5rem)] leading-[1.58] text-ink">
              A typeface pairing with attitude: loud, rounded headlines meet a crisp, friendly grotesk that stays readable at every size.
            </p>
            <p className="mt-[clamp(1.75rem,2.4vw,2.875rem)] font-display text-[clamp(0.6875rem,0.78vw,0.9375rem)] text-blush-deep uppercase">Running copy — Archivo</p>
            <ul aria-label="Copy weights" className="mt-2 flex flex-wrap gap-x-[clamp(1.25rem,1.875vw,2.25rem)] gap-y-2 font-copy text-[clamp(1.25rem,1.77vw,2.125rem)] text-ink">
              <li className="font-light">Light</li>
              <li className="font-normal">Regular</li>
              <li className="font-medium">Medium</li>
              <li className="font-bold">Bold</li>
              <li className="font-extrabold">ExtraBold</li>
            </ul>
            <p className="mt-[clamp(1.5rem,2.24vw,2.6875rem)] font-haas text-[clamp(0.875rem,1.15vw,1.375rem)] break-words text-ink/55">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ&nbsp; abcdefghijklm&nbsp; 0123456789&nbsp; !?&amp;@
            </p>
            <p className="mt-[clamp(1.25rem,1.875vw,2.25rem)] font-display text-[clamp(0.625rem,0.73vw,0.875rem)] text-grape/60 uppercase">
              H1 120 · H2 76 · Body 22 / 36
            </p>
          </div>
        </div>
      </section>

      {/* ── Brand in the wild ──────────────────────────────────────── */}
      <section id="applications" aria-labelledby="wild-title" className="shell mt-[clamp(4.5rem,7.3vw,8.75rem)] scroll-mt-8">
        <SectionTitle eyebrow="Brand in the wild" title={<span id="wild-title">Every touchpoint, on brand</span>} />
        <div data-reveal-stagger className={`grid gap-[clamp(1rem,1.56vw,1.875rem)] lg:grid-cols-[minmax(0,980fr)_minmax(0,578fr)] ${headingGap}`}>
          <Photo src="fifth-sip-packaging.webp" w={980} h={640} label="Packaging" alt="Fifth Sip coffee packaging: branded cups, tray, carrier bag, coffee pouch and menus" className="aspect-[980/640] rounded-[clamp(1.5rem,1.875vw,2.25rem)]" sizes="(min-width: 1024px) 51vw, 100vw" />
          <div className="grid gap-[clamp(1rem,1.56vw,1.875rem)] sm:grid-cols-2 lg:grid-cols-1">
            <Photo src="fifth-sip-merch.webp" w={578} h={305} label="Merch" alt="Fifth Sip carrier bag and decaf coffee pouch" className="aspect-[578/305] rounded-[clamp(1.5rem,1.67vw,2rem)]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
            <Photo src="kern-social.webp" w={578} h={305} label="Social" alt="Kern café social media grid with branded cups and aprons" className="aspect-[578/305] rounded-[clamp(1.5rem,1.67vw,2rem)]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
          </div>
        </div>

        <StationeryFlatLay />
      </section>

      {/* ── Before / after ─────────────────────────────────────────── */}
      <section id="glow-up" aria-labelledby="glow-title" className="shell mt-[clamp(4.5rem,6.8vw,8.125rem)] scroll-mt-8">
        <SectionTitle align="center" eyebrow="The glow-up" title={<span id="glow-title">Before &amp; after</span>} />
        <div data-reveal className={headingGap}>
          <BeforeAfter />
        </div>
      </section>

      {/* ── Four chapters (process) — hover / tap flips a chapter to its page ── */}
      <section id="chapters" aria-labelledby="chapters-title" className="shell mt-[clamp(4.5rem,9.4vw,11.25rem)] scroll-mt-8">
        <SectionTitle eyebrow="How we do it" title={<span id="chapters-title">Four chapters to a brand</span>} />
        <p className="mt-5 font-haas text-[clamp(0.9375rem,0.94vw,1.125rem)] text-blush-deep uppercase">
          <span className="hidden [@media(hover:hover)]:inline">Hover</span>
          <span className="[@media(hover:hover)]:hidden">Tap</span> a chapter to flip it open&nbsp;&nbsp;↘
        </p>
        <ol data-fan className="mt-[clamp(2rem,4.2vw,5rem)] grid gap-x-[clamp(0.75rem,1.15vw,1.375rem)] gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.slice(0, 4).map((step, i) => {
            const c = chapters[i];
            const n = String(i + 1).padStart(2, "0");
            return (
              <li key={step.title} className={`mx-auto w-full max-w-[24rem] sm:max-w-none ${c.tilt}`}>
                <RevealCard as="div" label={`Chapter ${n}: ${step.title} — flip to read`} className="block rounded-[clamp(0.625rem,0.73vw,0.875rem)] [perspective:1800px]">
                  <div className={`grid transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d] ${flipOpen}`}>
                    {/* Front: the book spine */}
                    <div className={`@container col-start-1 row-start-1 overflow-hidden rounded-[clamp(0.625rem,0.73vw,0.875rem)] [backface-visibility:hidden] ${c.bg} ${c.tone} ${cardShadow}`}>
                      <div className="grid aspect-[380/600]">
                        <span aria-hidden className={`${layer} mt-[7.9cqw] h-[2.63cqw] w-full ${c.stripe}`} />
                        <span aria-hidden className={`${layer} mt-[147.4cqw] h-[2.63cqw] w-full ${c.stripe}`} />
                        <span className={`${layer} mt-[18.4cqw] ml-[8.4cqw] font-display text-[max(0.625rem,4.74cqw)] opacity-80`}>CH.{n}</span>
                        <p className={`${layer} mt-[31.6cqw] ml-[39.5cqw] w-[52.6cqw] font-copy text-[max(0.75rem,5cqw)] leading-[1.58]`}>{c.blurb}</p>
                        <span aria-hidden className={`${layer} mt-[102.6cqw] ml-[44.7cqw] font-pop text-[42.1cqw] leading-[44.7cqw] opacity-25`}>{n}</span>
                        <h3 className="col-start-1 row-start-1 mb-[21cqw] ml-[15.8cqw] rotate-180 self-end justify-self-start font-display text-[16.84cqw] leading-[21.6cqw] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    {/* Back: the chapter page with the full step */}
                    <div className={`@container col-start-1 row-start-1 overflow-hidden rounded-[clamp(0.625rem,0.73vw,0.875rem)] bg-[#fff8f1] text-ink [backface-visibility:hidden] [transform:rotateY(180deg)] ${cardShadow}`}>
                      <div className="flex aspect-[380/600] flex-col">
                        <span aria-hidden className={`mt-[7.9cqw] h-[2.63cqw] w-full shrink-0 ${c.bg}`} />
                        <div className="flex min-h-0 flex-1 flex-col px-[8.4cqw] pt-[6.6cqw]">
                          <p className={`font-haas text-[max(0.6875rem,3.95cqw)] uppercase ${i === 3 ? "text-[#c9952b]" : c.text}`}>
                            CH.{n} · Chapter {chapterWords[i]}
                          </p>
                          <p aria-hidden className="mt-[2.6cqw] font-display text-[max(1.25rem,11.6cqw)] leading-[1.18] text-grape uppercase">{step.title}</p>
                          <p
                            className="mt-[4.2cqw] font-copy text-[max(0.8125rem,5cqw)] leading-[7.9cqw] font-light text-ink/90"
                            style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent calc(7.9cqw - 1px), rgb(34 1 40 / 0.07) calc(7.9cqw - 1px), rgb(34 1 40 / 0.07) 7.9cqw)" }}
                          >
                            {step.body}
                          </p>
                          <div className="mt-auto mb-[3.2cqw] flex items-center justify-between font-copy text-[max(0.625rem,3.4cqw)] text-ink/45">
                            <span aria-hidden className="font-display">— {n} —</span>
                            <span aria-hidden className="font-bold">↺ flip back</span>
                          </div>
                        </div>
                        <span aria-hidden className={`mb-[7.9cqw] h-[2.63cqw] w-full shrink-0 ${c.bg}`} />
                      </div>
                    </div>
                  </div>
                </RevealCard>
              </li>
            );
          })}
        </ol>
      </section>
    </BrandMotion>
  );
}

function Photo({ src, w, h, label, alt, className, sizes }: { src: string; w: number; h: number; label: string; alt: string; className: string; sizes: string }) {
  return (
    <figure className={`grid overflow-hidden ${cardShadow} ${className}`}>
      <Image src={`/assets/inner/brand-identity/${src}`} alt={alt} width={w} height={h} sizes={sizes} className="col-start-1 row-start-1 h-full w-full object-cover" />
      <figcaption className="col-start-1 row-start-1 m-[clamp(1rem,1.56vw,1.875rem)] self-end font-display text-[clamp(0.75rem,0.94vw,1.125rem)] text-white uppercase drop-shadow-[0_1px_6px_rgb(0_0_0/0.35)]">
        {label}
      </figcaption>
    </figure>
  );
}

/** Wrapper that is a stacked tile on small screens and dissolves (`lg:contents`) into the collage cell on desktop. */
function Piece({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col items-center gap-3 lg:contents ${className}`}>{children}</div>;
}

function Label({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`w-fit rounded-2xl border border-white/25 bg-white/12 px-[1.15em] py-[0.65em] font-display text-[clamp(0.6875rem,0.82cqw,0.8125rem)] leading-none text-white uppercase lg:col-start-1 lg:row-start-1 lg:self-start lg:justify-self-start ${className}`}>
      {children}
    </span>
  );
}

/** Figma "Stationery flat-lay" (389:21): a dark desk with the identity applied to print and digital pieces. */
function StationeryFlatLay() {
  const at = "lg:col-start-1 lg:row-start-1 lg:self-start lg:justify-self-start";
  return (
    <figure
      data-reveal
      aria-label="Stationery kit: letterhead, envelope, business cards, social post, app icon and sticker sheet"
      className="@container mt-[clamp(1rem,2.08vw,2.5rem)] grid grid-cols-2 items-start gap-x-4 gap-y-10 overflow-hidden rounded-[clamp(1.5rem,2.08vw,2.5rem)] bg-[#2a0a33] px-5 pt-6 pb-10 sm:grid-cols-3 lg:aspect-[1588/660] lg:grid-cols-1 lg:gap-0 lg:p-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 40% 75% at 16% 12%, rgb(106 75 151 / 0.7), transparent 70%), radial-gradient(ellipse 40% 75% at 88% 92%, rgb(242 119 147 / 0.35), transparent 70%), linear-gradient(to right, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 5.0378% 100%",
      }}
    >
      <figcaption className={`col-span-full font-display text-[clamp(0.75rem,1cqw,1rem)] text-sunbeam uppercase ${at} lg:mt-[2.02%] lg:ml-[2.52%]`}>Stationery kit</figcaption>

      <Piece>
        <div className={`@container flex aspect-[320/440] w-[80%] rotate-[6deg] flex-col overflow-hidden rounded-[1.9%/1.4%] bg-[#fffbf4] ${pieceShadow} ${at} lg:mt-[6.9%] lg:ml-[5.68%] lg:w-[20.15%]`}>
          <div className="flex items-start justify-between px-[8.75cqw] pt-[5cqw]">
            <span className="font-pop text-[21.9cqw] leading-[23.75cqw] text-blush-ink">P</span>
            <span className="mt-[7.5cqw] font-display text-[3.75cqw] text-grape">PIXEL POPERS</span>
          </div>
          <span className="mx-[8.75cqw] mt-[5.6cqw] h-[0.625cqw] bg-blush" />
          <div className="mt-[11.9cqw] flex flex-col gap-[5.6cqw] px-[8.75cqw]">
            {[82.5, 75, 78.75, 62.5, 82.5, 71.9, 50].map((w, i) => (
              <span key={i} className="h-[2.5cqw] rounded-full bg-ink/10" style={{ width: `${w}cqw` }} />
            ))}
          </div>
          <span className="mt-[11.25cqw] px-[8.75cqw] font-haas text-[4.06cqw] text-ink">Barry Allen</span>
          <span className="mt-auto flex h-[9.4cqw] items-center bg-grape px-[8.75cqw] font-copy text-[3.125cqw] font-medium text-white">
            hello@pixelpopers.com · pixelpopers.com
          </span>
        </div>
        <Label className="lg:mt-[36.52%] lg:ml-[6.05%]">Letterhead</Label>
      </Piece>

      <Piece>
        <div className={`@container grid aspect-[420/240] w-[92%] rotate-[-4deg] overflow-hidden rounded-[1.9%/3.3%] bg-blush ${pieceShadow} ${at} lg:mt-[20.78%] lg:ml-[20.77%] lg:w-[26.45%]`}>
          <span className="col-start-1 row-start-1 h-[33.33cqw] w-full self-start bg-[#e0627f] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <span className="col-start-1 row-start-1 mt-[28.6cqw] self-start justify-self-center font-pop text-[19cqw] leading-[21.4cqw] text-white">P</span>
        </div>
        <Label className="lg:mt-[37.78%] lg:ml-[25.19%]">Envelope</Label>
      </Piece>

      <Piece className="sm:row-span-1">
        <div className={`@container grid aspect-[360/210] w-[88%] rotate-[8deg] rounded-[3.9%/6.7%] border border-white/10 bg-ink ${pieceShadow} ${at} lg:mt-[7.56%] lg:ml-[43.43%] lg:w-[22.67%]`}>
          <span className="col-start-1 row-start-1 mt-[6.1cqw] ml-[7.8cqw] self-start justify-self-start font-pop text-[41.7cqw] leading-[44.4cqw] text-blush-ink">P</span>
          <span className="col-start-1 row-start-1 mt-[33.3cqw] ml-[55.6cqw] self-start justify-self-start font-display text-[5.56cqw] leading-[6.67cqw] text-white">
            PIXEL
            <br />
            POPERS
          </span>
        </div>
        <div className={`@container -mt-[18%] aspect-[360/210] w-[88%] rotate-[-5deg] rounded-[3.9%/6.7%] bg-sunbeam text-ink ${pieceShadow} ${at} lg:mt-[20.78%] lg:ml-[47.89%] lg:w-[22.67%]`}>
          <div className="flex flex-col px-[7.8cqw] pt-[8.3cqw]">
          <span className="font-display text-[6.67cqw] leading-[1.3]">BARRY ALLEN</span>
          <span className="mt-[1.4cqw] font-copy text-[3.89cqw] font-medium">Founder &amp; Creative Director</span>
          <span className="mt-[8cqw] h-[0.83cqw] w-[11.1cqw] bg-blush" />
          <span className="mt-[3.6cqw] font-copy text-[3.61cqw] leading-[5.56cqw] font-medium">
            hello@pixelpopers.com
            <br />
            +00 000 000 000
            <br />
            pixelpopers.com
          </span>
          </div>
        </div>
        <Label className="lg:mt-[37.15%] lg:ml-[49.75%]">Business cards</Label>
      </Piece>

      <Piece>
        <Label className="order-last lg:order-none lg:mt-[2.52%] lg:ml-[74.31%]">Social</Label>
        <div className={`@container flex aspect-square w-[78%] rotate-[-6deg] flex-col items-center rounded-[6.9%] bg-grape ${pieceShadow} ${at} lg:mt-[5.65%] lg:ml-[72.41%] lg:w-[16.37%]`}>
          <span className="mt-[23cqw] font-pop text-[36.9cqw] leading-[42.3cqw] text-sunbeam">POP!</span>
          <span className="mt-[11.5cqw] font-display text-[5cqw] text-white">NEW DROP · FRIDAY</span>
        </div>
      </Piece>

      <Piece>
        <div className={`@container grid aspect-square w-[52%] rotate-[8deg] place-items-start justify-center rounded-[24%] bg-lagoon ${pieceShadow} ${at} lg:mt-[25.8%] lg:ml-[74.3%] lg:w-[9.45%]`}>
          <span className="mt-[2.7cqw] font-pop text-[86.7cqw] leading-[93.3cqw] text-white">P</span>
        </div>
        <Label className="lg:mt-[37.78%] lg:ml-[73.68%]">App icon</Label>
      </Piece>

      <Piece>
        <div className={`@container aspect-[200/250] w-[66%] rotate-[-7deg] rounded-[8%/6.4%] bg-white ${pieceShadow} ${at} lg:mt-[20.77%] lg:ml-[85.67%] lg:w-[12.59%]`}>
          <div className="flex flex-col px-[10cqw] pt-[12cqw]">
          <div className="grid grid-cols-2 gap-x-[8cqw] gap-y-[12cqw]">
            <span className="grid aspect-square place-items-center rounded-full bg-blush font-pop text-[22cqw] leading-none text-white">P</span>
            <span className="grid aspect-square place-items-center rounded-full bg-sunbeam font-haas text-[18cqw] leading-none text-ink">✦</span>
            <span className="grid aspect-square place-items-center rounded-full bg-lagoon font-pop text-[22cqw] leading-none text-white">!</span>
            <span className="grid aspect-square place-items-center rounded-full bg-grape font-haas text-[18cqw] leading-none text-[#ff4d6d]">♥</span>
          </div>
          <span className="mt-[11cqw] font-display text-[5.5cqw] text-grape">STICKER SHEET</span>
          </div>
        </div>
        <Label className="lg:mt-[37.78%] lg:ml-[90.68%]">Stickers</Label>
      </Piece>
    </figure>
  );
}
