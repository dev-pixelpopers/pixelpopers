import Image from "next/image";
import Breadcrumb from "@/components/inner/Breadcrumb";
import RevealCard from "@/components/inner/RevealCard";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import type { ServiceDetail } from "@/lib/service-content";
import {
  ArtboardDesign,
  ArtboardResearch,
  ArtboardTest,
  ArtboardWireframe,
  ComponentLibrary,
  Cursor,
  FlowBoard,
  Handles,
  Phone,
  PhoneShot,
  WireScreen,
  cardShadow,
  layer,
} from "./Parts";
import UxMotion from "./UxMotion";

/*
  Concept: the page is a design-tool canvas. Figma frame 367:78 "03.2 — Service:
  UI/UX DESIGN" (page background is paper, applied by the registry).
  Collages are single-cell grids: every layer shares one cell and is placed with
  percentage margins (they resolve against the cell width, so the collage
  scales as one piece); type inside uses `cqw` of the nearest `@container`.
*/

const headingGap = "mt-[clamp(2.5rem,3.96vw,4.75rem)]";

const heatChecks = [
  { label: "Click & scroll heatmaps", dot: "bg-blush" },
  { label: "5-second tests", dot: "bg-lagoon" },
  { label: "Task completion rates", dot: "bg-sunbeam" },
  { label: "A/B variants", dot: "bg-grape" },
];

const artboards = [
  { name: "Research", Body: ArtboardResearch },
  { name: "Wireframe", Body: ArtboardWireframe },
  { name: "Design", Body: ArtboardDesign },
  { name: "Test", Body: ArtboardTest },
];

const layers = [
  { icon: "▢", label: "Home — 390", indent: 0, tone: "text-grape" },
  { icon: "#", label: "Nav", indent: 1, tone: "text-grape" },
  { icon: "#", label: "Hero", indent: 1, tone: "text-grape" },
  { icon: "◆", label: "Card / Promo", indent: 2, tone: "text-blush-ink", active: true },
  { icon: "◆", label: "Button / Pop", indent: 2, tone: "text-grape" },
  { icon: "T", label: "Headline", indent: 2, tone: "text-grape" },
  { icon: "▢", label: "Product grid", indent: 1, tone: "text-grape" },
  { icon: "#", label: "Tab bar", indent: 1, tone: "text-grape" },
];

const noteTags = ["→ insights", "→ flows", "→ prototype", "→ handoff"];
/** Visible while an artboard is hovered, keyboard-focused or tapped open. */
const showOnOpen = "group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[open=true]:opacity-100";

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, l3] = service.heroLines;

  return (
    <UxMotion className="flex flex-col pb-[clamp(5rem,9.4vw,11.25rem)]">
      {/* ── Hero: the canvas ───────────────────────────────────────── */}
      <section aria-labelledby="hero-title" className="relative isolate">
        {/* Decorative canvas grid + glow: they run up behind the header, so they can't sit in flow. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-60 bottom-[clamp(-6rem,-5vw,-2rem)] -z-10 bg-paper"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 30% 36% at 73% 42%, rgb(183 155 224 / 0.38), transparent 72%), linear-gradient(to right, rgb(106 75 151 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(106 75 151 / 0.07) 1px, transparent 1px)",
            backgroundSize: "auto, 4.1667vw 4.1667vw, 4.1667vw 4.1667vw",
          }}
        />

        <div className="shell grid items-start lg:grid-cols-1">
          {/* Copy column */}
          <div className="col-start-1 row-start-1 pt-[clamp(1rem,2.6vw,3.125rem)] lg:relative lg:z-10 lg:w-[58%]">
            <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.name }]} />
            <h1 id="hero-title" className="mt-[clamp(1.5rem,3.3vw,3.9rem)] uppercase">
              <span className="block font-display text-[clamp(3rem,6.77vw,8.125rem)] leading-[1.02] text-blush-ink">{l1}</span>
              <span className="mt-10 grid w-full border-2 border-lagoon lg:mt-[max(0.25rem,calc(2.6rem-2vw))] lg:w-[45.3vw]">
                <span className="col-start-1 row-start-1 pl-1 font-haas text-[clamp(3.25rem,7.81vw,9.375rem)] leading-[1.2] tracking-[-0.05em] text-grape">{l2}</span>
                <Handles border="border-lagoon" />
                <span
                  aria-hidden
                  data-tag="H1 / Display  ·  870 × 180"
                  className="col-start-1 row-start-1 -mt-[2.05rem] -ml-0.5 h-6 self-start justify-self-start rounded bg-lagoon px-2.5 font-haas text-[0.8125rem] leading-6 tracking-normal whitespace-pre text-white normal-case before:content-[attr(data-tag)]"
                />
              </span>
              <span className="mt-[clamp(0.25rem,0.42vw,0.5rem)] block font-display text-[clamp(1.75rem,4.17vw,5rem)] leading-[1.28] text-lagoon">{l3}</span>
            </h1>
            <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">{service.heroIntro}</p>
            <PopButton href="/contact" label={service.heroCta} className="mt-[clamp(1.5rem,1.15vw,1.375rem)] [&>span:last-child]:text-ink" />
          </div>

          {/* Canvas collage — 1130 Figma units wide, from the comment pin to the layers panel. */}
          <div
            aria-hidden
            className="@container pointer-events-none col-start-1 row-start-2 mt-12 -ml-[52.7%] grid w-[152.7%] lg:row-start-1 lg:-mt-[0.5vw] lg:ml-[37.4%] lg:w-[71.16%]"
          >
            <span data-pulse className={`${layer} mt-[9.73%] ml-[17.7%] hidden aspect-square w-[4.6%] place-items-center rounded-full bg-sunbeam font-display text-[1.77cqw] text-ink lg:grid`}>
              A
            </span>
            <div className={`${layer} mt-[15.04%] hidden w-[23%] rounded-[1.6cqw] bg-white px-[1.6cqw] pt-[1.24cqw] pb-[1.24cqw] ${cardShadow} lg:block`}>
              <p className="font-haas text-[1.33cqw] text-ink">Adan</p>
              <p className="mt-[0.7cqw] font-copy text-[1.33cqw] leading-[1.95cqw] text-ink">Love it — can the CTA pop even more? 🔥</p>
            </div>
            <div data-drift="28" className={`${layer} mt-[55.75%] ml-[26.55%] hidden flex-col items-start lg:flex`}>
              <Cursor fill="#3FB7C7" className="w-[2.3cqw]" />
              <span className="-mt-[0.2cqw] ml-[1.95cqw] rounded-[0.7cqw] bg-lagoon px-[1.06cqw] py-[0.5cqw] font-haas text-[1.33cqw] leading-none text-white">James</span>
            </div>

            <Phone className={`${layer} ml-[34.51%] w-[35.4%]`}>
              <PhoneShot src="/assets/inner/ui-shop.webp" w={1600} h={900} alt="" sizes="(min-width: 1024px) 22vw, 55vw" />
            </Phone>
            <div className={`${layer} mt-[20.35%] ml-[36.81%] grid aspect-[348/190] w-[30.8%] border-2 border-blush`}>
              <Handles border="border-blush" />
              <span className="col-start-1 row-start-1 -mt-[2.83cqw] -ml-0.5 self-start justify-self-start rounded-[0.35cqw] bg-blush px-[0.9cqw] py-[0.45cqw] font-haas text-[max(0.5rem,1.15cqw)] leading-none whitespace-nowrap text-white">
                Card / Promo&nbsp;&nbsp;·&nbsp;&nbsp;348 × 190
              </span>
            </div>
            <span className={`${layer} mt-[74.34%] ml-[46.9%] grid h-[2.83cqw] w-[10.62%] place-items-center rounded-full bg-grape font-haas text-[max(0.5625rem,1.33cqw)] text-white`}>
              390 × 844
            </span>
            <div data-drift="22" className={`${layer} mt-[36.28%] ml-[65.49%] flex flex-col items-start`}>
              <Cursor fill="#F27793" className="w-[2.3cqw]" />
              <span className="-mt-[0.2cqw] ml-[1.95cqw] rounded-[0.7cqw] bg-blush px-[1.06cqw] py-[0.5cqw] font-haas text-[max(0.5625rem,1.33cqw)] leading-none text-white">Barry</span>
            </div>

            <div className={`${layer} mt-[2.65%] ml-[74.34%] w-[25.66%] rounded-[1.77cqw] bg-white pb-[1.6cqw] ${cardShadow}`}>
              <p className="px-[1.77cqw] pt-[1.6cqw] pb-[1.1cqw] font-display text-[max(0.5rem,1.24cqw)] text-grape uppercase">Layers</p>
              <span className="block h-px bg-ink/8" />
              <ul className="pt-[0.4cqw]">
                {layers.map((l) => (
                  <li
                    key={l.label}
                    className={`mx-[0.53cqw] flex h-[4.25cqw] items-center gap-[1.06cqw] rounded-[0.7cqw] font-copy text-[max(0.5625rem,1.42cqw)] text-ink ${l.active ? "bg-blush/15 font-bold" : ""}`}
                    style={{ paddingLeft: `${1.24 + l.indent * 1.6}cqw` }}
                  >
                    <span className={`w-[1.4cqw] font-haas ${l.tone}`}>{l.icon}</span>
                    {l.label}
                  </li>
                ))}
              </ul>
            </div>
            <span data-float="8" className={`${layer} mt-[47.32%] ml-[74.55%] w-[25.66%] rotate-[-6deg] rounded-full bg-sunbeam py-[1.68cqw] text-center font-display text-[max(0.5625rem,1.59cqw)] leading-none text-ink shadow-[0_10px_24px_rgb(34_1_40/0.15)]`}>
              MULTIPLAYER MODE
            </span>
          </div>
        </div>
      </section>

      {/* ── Wireframe → hi-fi ──────────────────────────────────────── */}
      <section aria-labelledby="sketch-title" className="mt-[clamp(4rem,5.2vw,6.25rem)]">
        <div className="shell">
          <SectionTitle align="center" eyebrow="From sketch to screen" title={
              <span id="sketch-title">
                Wireframe → <span className="whitespace-nowrap">hi-fi</span>
              </span>
            } />
        </div>
        <div className={`@container shell grid grid-cols-2 items-start gap-x-4 gap-y-8 lg:mx-auto lg:max-w-[1920px] lg:grid-cols-1 lg:gap-0 lg:px-0 ${headingGap}`}>
          <span data-float="8" className="col-span-2 w-fit justify-self-center rotate-[8deg] rounded-full bg-lagoon px-8 py-3 font-display text-[clamp(0.875rem,1.04cqw,1.25rem)] text-white shadow-[0_10px_24px_rgb(34_1_40/0.15)] lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mt-[10.75%] lg:ml-[43.44%] lg:w-[12.5%] lg:justify-self-start lg:px-0 lg:py-[1.12cqw] lg:text-center">
            UX MAGIC ✦
          </span>
          <span aria-hidden className="hidden font-pop text-[10.42cqw] leading-none text-blush-ink lg:col-start-1 lg:row-start-1 lg:mt-[14.58%] lg:ml-[44.79%] lg:block lg:w-[10.42%] lg:self-start lg:justify-self-start lg:text-center">
            →
          </span>

          <figure data-reveal className="flex flex-col items-center lg:col-start-1 lg:row-start-1 lg:ml-[17.19%] lg:w-[19.79%] lg:self-start lg:justify-self-start">
            <Phone frame="bg-[#8a7f8f]" className="w-full">
              <WireScreen />
            </Phone>
            <figcaption className="mt-4 font-display text-[clamp(0.875rem,1.04cqw,1.25rem)] text-grape lg:mt-[1.04cqw]">LOW-FI</figcaption>
          </figure>
          <figure data-reveal className="flex flex-col items-center lg:col-start-1 lg:row-start-1 lg:ml-[63.02%] lg:w-[19.79%] lg:self-start lg:justify-self-start">
            <Phone className="w-full">
              <PhoneShot src="/assets/inner/liquidity.webp" w={736} h={552} alt="Hi-fi mobile landing page for a liquidity product, with a clear headline and call to action" sizes="(min-width: 1024px) 20vw, 45vw" />
            </Phone>
            <figcaption className="mt-4 font-display text-[clamp(0.875rem,1.04cqw,1.25rem)] text-blush-deep lg:mt-[1.04cqw]">HI-FI</figcaption>
          </figure>

          {[
            { t: "Content first", c: "bg-grape text-white", p: "lg:mt-[18.92%] lg:ml-[4.63%]" },
            { t: "Hierarchy fixed", c: "bg-sunbeam text-ink", p: "lg:mt-[28.32%] lg:ml-[39.53%]" },
            { t: "CTA above the fold", c: "bg-blush text-white", p: "lg:mt-[9.61%] lg:ml-[85.88%]" },
            { t: "Thumb-friendly nav", c: "bg-lagoon text-white", p: "lg:mt-[32.53%] lg:ml-[85.88%]" },
          ].map((a) => (
            <span
              key={a.t}
              data-float="5"
              className={`hidden rotate-[3deg] rounded-[0.625cqw] px-[0.83cqw] py-[0.52cqw] font-haas text-[0.83cqw] whitespace-nowrap lg:col-start-1 lg:row-start-1 lg:block lg:self-start lg:justify-self-start ${a.c} ${a.p}`}
            >
              {a.t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Design systems ─────────────────────────────────────────── */}
      <section aria-labelledby="system-title" className="shell mt-[clamp(3.5rem,2.86vw,3.4rem)]">
        <SectionTitle eyebrow="Design systems" title={<span id="system-title">Components your devs will love</span>} />
        <div className={headingGap}>
          <ComponentLibrary />
        </div>
      </section>

      {/* ── User flows ─────────────────────────────────────────────── */}
      <section aria-labelledby="flow-title" className="shell mt-[clamp(4rem,7.3vw,8.75rem)]">
        <SectionTitle align="center" eyebrow="User flows" title={<span id="flow-title">Journeys that feel obvious</span>} />
        <div className={headingGap}>
          <FlowBoard />
        </div>
      </section>

      {/* ── Devices band ───────────────────────────────────────────── */}
      <section aria-labelledby="devices-title" className="mx-auto mt-[clamp(4rem,7.3vw,8.75rem)] w-full max-w-[1920px]">
        <div
          className="overflow-hidden rounded-[clamp(2rem,3.33vw,4rem)] bg-dusk pt-[clamp(3rem,4.7vw,5.625rem)] pb-[clamp(2.5rem,3.33vw,4rem)]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 34% 48% at 13% 14%, rgb(106 75 151 / 0.6), transparent 72%), radial-gradient(ellipse 34% 48% at 91% 82%, rgb(242 119 147 / 0.35), transparent 72%), radial-gradient(ellipse 30% 34% at 52% 64%, rgb(63 183 199 / 0.18), transparent 72%), linear-gradient(to right, rgb(255 255 255 / 0.03) 1px, transparent 1px)",
            backgroundSize: "auto, auto, auto, 4.1667% 100%",
          }}
        >
          <div className="shell">
            <SectionTitle align="center" tone="dark" eyebrow="Responsive by default" title={<span id="devices-title" className="text-white">One product. Every screen.</span>} />
          </div>
          <div className="mt-[clamp(1.5rem,2.4vw,2.875rem)] overflow-hidden md:overflow-visible">
            <div aria-hidden className="@container -ml-[25%] grid w-[150%] md:ml-0 md:w-full">
              <span className={`${layer} mt-[29.17%] ml-[18.75%] h-[3.125cqw] w-[62.5%] rounded-full bg-black/45 blur-[2.08cqw]`} />
              <div className={`${layer} ml-[27.08%] grid aspect-[880/550] w-[45.83%] rounded-[1.25cqw] border border-white/12 bg-[#120118] p-[0.83cqw] shadow-[0_2.08cqw_4.17cqw_rgb(0_0_0/0.45)]`}>
                <div className="overflow-hidden rounded-[0.625cqw]">
                  <PhoneShot src="/assets/inner/liquidity.webp" w={736} h={552} alt="" sizes="46vw" />
                </div>
              </div>
              <span className={`${layer} mt-[28.65%] ml-[46.88%] h-[2.08cqw] w-[6.25%] bg-[#120118]`} />
              <span className={`${layer} mt-[30.52%] ml-[42.71%] h-[0.73cqw] w-[14.58%] rounded-full bg-[#120118]`} />
              <div className={`${layer} mt-[6.77%] ml-[17.19%] grid aspect-[340/460] w-[17.71%] rounded-[1.77cqw] border border-white/12 bg-[#120118] p-[0.73cqw] shadow-[0_2.08cqw_4.17cqw_rgb(0_0_0/0.45)]`}>
                <div className="overflow-hidden rounded-[1.15cqw]">
                  <PhoneShot src="/assets/inner/ui-shop.webp" w={1600} h={900} alt="" sizes="18vw" />
                </div>
              </div>
              <div className={`${layer} mt-[7.81%] ml-[69.27%] grid aspect-[220/450] w-[11.46%] rounded-[1.98cqw] border border-white/12 bg-[#120118] p-[0.52cqw] shadow-[0_2.08cqw_4.17cqw_rgb(0_0_0/0.45)]`}>
                <div className="col-start-1 row-start-1 overflow-hidden rounded-[1.56cqw]">
                  <PhoneShot src="/assets/inner/liquidity.webp" w={736} h={552} alt="" sizes="12vw" />
                </div>
                <span className="col-start-1 row-start-1 mt-[0.52cqw] h-[1.04cqw] w-[3.65cqw] self-start justify-self-center rounded-full bg-[#120118]" />
              </div>
              {[
                { t: "Tablet · 768", c: "bg-sunbeam text-ink", p: "ml-[22.34%]" },
                { t: "Desktop · 1440", c: "bg-lagoon text-white", p: "ml-[45.68%]" },
                { t: "Mobile · 390", c: "bg-blush text-white", p: "ml-[71.25%]" },
              ].map((l) => (
                <span key={l.t} className={`${layer} mt-[33.33%] rounded-full px-[0.94cqw] py-[0.47cqw] font-display text-[max(0.5rem,0.73cqw)] uppercase ${l.c} ${l.p}`}>
                  {l.t}
                </span>
              ))}
              {[
                { t: "Fluid type scale ✓", c: "bg-white text-ink rotate-[5deg]", p: "mt-[1.92%] ml-[11.88%]" },
                { t: "Breakpoints: 390 · 768 · 1440", c: "bg-grape text-white rotate-[3deg]", p: "mt-[0.33%] ml-[67.65%]" },
                { t: "Thumb-zone nav ✓", c: "bg-sunbeam text-ink rotate-[-6deg]", p: "mt-[3.7%] ml-[82.37%]" },
              ].map((c) => (
                <span key={c.t} data-float="6" className={`${layer} hidden rounded-[0.73cqw] px-[0.83cqw] py-[0.52cqw] font-copy text-[max(0.625rem,0.83cqw)] font-medium whitespace-nowrap shadow-[0_10px_24px_rgb(0_0_0/0.3)] md:block ${c.c} ${c.p}`}>
                  {c.t}
                </span>
              ))}
            </div>
          </div>
          <p className="sr-only">Every design is delivered for mobile (390px), tablet (768px) and desktop (1440px) breakpoints with a fluid type scale and thumb-friendly navigation.</p>
        </div>
      </section>

      {/* ── Tested with real humans ────────────────────────────────── */}
      <section aria-labelledby="test-title" className="shell mt-[clamp(4rem,8.3vw,10rem)] grid items-start gap-y-12 lg:grid-cols-[minmax(0,654fr)_minmax(0,934fr)]">
        <div>
          <SectionTitle eyebrow="Tested with" title={<span id="test-title">Real humans</span>} />
          <p data-reveal className="mt-[clamp(1.25rem,1.875vw,2.25rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">
            Before anything ships we watch real people use it — tracking where they click, scroll and get stuck — then fix it.
          </p>
          <ul data-reveal-stagger className="mt-[clamp(2rem,3.54vw,4.25rem)] flex flex-col gap-[clamp(1.25rem,1.875vw,2.25rem)]">
            {heatChecks.map((h) => (
              <li key={h.label} className="flex items-center gap-4 font-copy text-[clamp(1.0625rem,1.15vw,1.375rem)] font-medium">
                <span aria-hidden className={`size-[clamp(1rem,1.15vw,1.375rem)] shrink-0 rounded-full ${h.dot}`} />
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        <figure data-reveal className="@container grid">
          <div className={`col-start-1 row-start-1 overflow-hidden rounded-[clamp(1rem,1.04vw,1.25rem)] bg-white ${cardShadow}`}>
            <div className="flex h-[4.71cqw] items-center gap-[1.07cqw] bg-[#f3e6ee] px-[1.93cqw]">
              <span className="size-[1.28cqw] rounded-full bg-blush" />
              <span className="size-[1.28cqw] rounded-full bg-sunbeam" />
              <span className="size-[1.28cqw] rounded-full bg-lagoon" />
              <span className="ml-[2.2cqw] font-copy text-[max(0.625rem,1.6cqw)] font-medium text-ink/55">liquidity.app — heatmap</span>
            </div>
            <div className="grid aspect-[934/596]">
              <Image
                src="/assets/inner/liquidity.webp"
                alt="Heatmap over a landing page: clicks cluster on the headline and the call-to-action button"
                width={736}
                height={552}
                sizes="(min-width: 1024px) 49vw, 100vw"
                className="col-start-1 row-start-1 h-full w-full object-cover object-bottom"
              />
              {[
                { p: "ml-[40.69%] mt-[13.5%] w-[25.7%] aspect-[240/140]", c: "rgb(242 119 147 / 0.55)" },
                { p: "ml-[44.97%] mt-[15.6%] w-[12.85%] aspect-[120/70]", c: "rgb(245 194 85 / 0.7)" },
                { p: "ml-[64.24%] mt-[36%] w-[21.4%] aspect-[200/140]", c: "rgb(242 119 147 / 0.45)" },
                { p: "ml-[68.52%] mt-[38.1%] w-[9.64%] aspect-[90/60]", c: "rgb(245 194 85 / 0.7)" },
                { p: "ml-[16.06%] mt-[4.9%] w-[17.13%] aspect-[160/80]", c: "rgb(63 183 199 / 0.45)" },
              ].map((b, i) => (
                <span key={i} data-pulse className={`${layer} ${b.p} rounded-full blur-[3.2cqw]`} style={{ backgroundColor: b.c }} />
              ))}
              {["ml-[50.32%] mt-[18.84%]", "ml-[70.66%] mt-[41.33%]", "ml-[24.63%] mt-[8.14%]", "ml-[53.53%] mt-[22.06%]", "ml-[73.88%] mt-[43.47%]"].map((p) => (
                <span key={p} aria-hidden className={`${layer} ${p} relative size-[1.71cqw] rounded-full border-[0.43cqw] border-blush bg-white`} />
              ))}
            </div>
          </div>
          <div className={`${layer} mt-[54.31%] ml-[60%] w-[29.98%] rotate-[3deg] rounded-[1.7cqw] bg-ink px-[2.14cqw] pt-[1.93cqw] pb-[2cqw] shadow-[0_24px_60px_rgb(34_1_40/0.25)] sm:ml-[78.96%]`}>
            <p className="font-haas text-[max(0.6875rem,1.93cqw)] text-white">73% clicked the CTA</p>
            <p className="mt-[1.07cqw] font-copy text-[max(0.625rem,1.6cqw)] text-white/70">after redesign (was 31%)</p>
          </div>
        </figure>
      </section>

      {/* ── Four artboards (process) — hover / tap reveals the dev notes ── */}
      <section aria-labelledby="artboards-title" className="shell mt-[clamp(4rem,9.4vw,11.25rem)]">
        <SectionTitle eyebrow="How we do it" title={<span id="artboards-title">Four artboards to launch</span>} />
        <p className="mt-5 font-haas text-[clamp(0.9375rem,0.94vw,1.125rem)] text-blush-deep uppercase">
          <span className="hidden [@media(hover:hover)]:inline">Hover</span>
          <span className="[@media(hover:hover)]:hidden">Tap</span> an artboard to read the dev notes&nbsp;&nbsp;↘
        </p>
        <ol data-reveal-stagger className="mt-[clamp(2rem,3vw,3.5rem)] grid gap-x-[clamp(0.75rem,1.15vw,1.375rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {artboards.map(({ name, Body }, i) => {
            const step = service.process[i];
            const n = String(i + 1).padStart(2, "0");
            return (
              <li key={name} className="mx-auto w-full max-w-[24rem] sm:max-w-none">
                <RevealCard as="div" label={`Artboard ${n}: ${name} — show dev notes`} className="block">
                  <div className="flex items-end justify-between gap-3">
                    <p className="font-copy text-[clamp(0.75rem,0.78vw,0.9375rem)] font-medium text-ink/50">
                      #&nbsp; {n} — {name}
                    </p>
                    <span aria-hidden className={`rounded-[4px] bg-[#0d99ff] px-2 py-0.5 font-copy text-[0.75rem] font-medium text-white opacity-0 transition-opacity ${showOnOpen}`}>
                      380 × 440
                    </span>
                  </div>
                  <div className="mt-3 grid">
                    <div className={`@container col-start-1 row-start-1 grid aspect-[380/440] overflow-hidden rounded-[4px] bg-white ${cardShadow}`}>
                      <div className="col-start-1 row-start-1 min-h-0">
                        <Body />
                      </div>
                      {/* Veil + dev-notes card */}
                      <span aria-hidden className={`col-start-1 row-start-1 bg-white/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 ${showOnOpen}`} />
                      <div
                        className={`col-start-1 row-start-1 m-[4.2cqw] flex translate-y-[12%] flex-col gap-[3.2cqw] self-end rounded-[3.7cqw] bg-ink p-[6.3cqw] text-white opacity-0 shadow-[0_16px_32px_rgb(34_1_40/0.3)] transition-[opacity,translate] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 group-data-[open=true]:translate-y-0 ${showOnOpen}`}
                      >
                        <p className="font-haas text-[max(0.625rem,3.2cqw)] tracking-wide text-lav uppercase">Note · {n} / 04</p>
                        <p aria-hidden className="font-haas text-[max(1rem,6.3cqw)] leading-tight">{step.title}</p>
                        <p className="font-copy text-[max(0.75rem,4.2cqw)] leading-[1.56] font-light text-white/88">{step.body}</p>
                        <span aria-hidden className="self-start rounded-full bg-lagoon px-[3.2cqw] py-[1.6cqw] font-copy text-[max(0.625rem,3.2cqw)] font-bold">
                          {noteTags[i]}
                        </span>
                      </div>
                    </div>
                    {/* Figma-style selection box */}
                    <span aria-hidden className={`col-start-1 row-start-1 -m-[2px] rounded-[4px] border-2 border-[#0d99ff] opacity-0 transition-opacity ${showOnOpen}`} />
                    <span aria-hidden className={`col-start-1 row-start-1 grid opacity-0 transition-opacity ${showOnOpen}`}>
                      <Handles border="border-[#0d99ff]" />
                    </span>
                  </div>
                  <h3 className="mt-[clamp(1rem,1.35vw,1.625rem)] font-display text-[clamp(1.125rem,1.35vw,1.625rem)] text-grape uppercase">{name}</h3>
                </RevealCard>
              </li>
            );
          })}
        </ol>
      </section>
    </UxMotion>
  );
}
