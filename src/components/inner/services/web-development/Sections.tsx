import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import { mono } from "@/lib/inner-fonts";
import type { ServiceDetail } from "@/lib/service-content";
import { BrowserPreview, Checklist, CmsEditor, CodeEditor, Devices, Gauge, Keyboard, Terminal } from "./Parts";
import ShipMotion from "./ShipMotion";

/*
  Concept: code + browser. Figma frame 374:21 "03.4 — Service: WEB
  DEVELOPMENT". The hero sits on a dark "Dark hero" band (1920 × 1260 from the
  very top of the frame), so the band is pulled up behind the site header as
  a decorative layer. Collages are single-cell grids on desktop: pieces share
  one cell and are placed with percentage margins (they resolve against the
  cell width, so the collage scales as one); below `lg` they stack.
*/

const lgAt = "lg:col-start-1 lg:row-start-1 lg:self-start lg:justify-self-start";

const gauges = [
  { score: 98, label: "Performance", color: "#F27793", numberTone: "text-blush" },
  { score: 100, label: "Accessibility", color: "#3FB7C7", numberTone: "text-lagoon" },
  { score: 100, label: "Best practices", color: "#6A4B97", numberTone: "text-grape" },
  { score: 100, label: "SEO", color: "#F5C255", numberTone: "text-ink" },
];

const pipeline = [
  { step: "Commit", dot: "bg-blush" },
  { step: "Build", dot: "bg-grape" },
  { step: "Test", dot: "bg-lagoon" },
  { step: "Deploy", dot: "bg-sunbeam" },
];

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, l3] = service.heroLines;

  return (
    <ShipMotion className="flex flex-col pb-[clamp(5rem,11.2vw,13.4375rem)]">
      {/* ── Hero: code editor + browser on the dark band ───────────── */}
      <section aria-labelledby="hero-title" className="relative isolate pb-[clamp(4rem,8.65vw,10.375rem)] text-white">
        {/*
          Decorative dark band: it has to run up behind the (transparent) site
          header to the very top of the page, so it can't sit in flow. The
          overshoot above the page is simply never visible.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-80 bottom-0 -z-10 rounded-b-[clamp(2rem,3.33vw,4rem)] bg-dusk"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 34% 40% at 15% 28%, rgb(106 75 151 / 0.6), transparent 72%), radial-gradient(ellipse 30% 34% at 86% 78%, rgb(242 119 147 / 0.35), transparent 72%), radial-gradient(ellipse 20% 26% at 62% 22%, rgb(63 183 199 / 0.2), transparent 72%), linear-gradient(to right, rgb(255 255 255 / 0.03) 1px, transparent 1px)",
            backgroundSize: "auto, auto, auto, 4.1667vw 100%",
          }}
        />

        <div className="shell grid items-start gap-y-12 lg:grid-cols-[minmax(0,784fr)_minmax(0,804fr)]">
          <div className="pt-[clamp(1rem,2.6vw,3.125rem)]">
            <Breadcrumb
              items={[{ label: "Services", href: "/services" }, { label: service.name }]}
              className="[&_a]:text-white/60 [&_li>span]:text-white/60"
            />
            <h1 id="hero-title" className="mt-[clamp(1.5rem,3.3vw,3.9rem)] uppercase">
              <span className="block font-display text-[clamp(3.5rem,6.77vw,8.125rem)] leading-[1.077] text-blush">{l1}</span>
              <span className="block font-haas text-[clamp(2.375rem,5.52vw,6.625rem)] leading-[1.32] tracking-[-0.04em] text-white">{l2}</span>
              <span className="block font-display text-[clamp(1.75rem,3.75vw,4.5rem)] leading-[1.28] text-lagoon">{l3}</span>
            </h1>
            <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light text-white/85">{service.heroIntro}</p>
            <PopButton
              href="/contact"
              label={service.heroCta}
              className="mt-[clamp(1.75rem,2.19vw,2.625rem)] [&>span:first-child]:bg-blush hover:[&>span:first-child]:bg-sunbeam [&>span:last-child]:text-white"
            />
            <p
              className={`${mono.className} mt-[clamp(1.5rem,1.67vw,2rem)] flex h-[clamp(2.75rem,2.71vw,3.25rem)] w-fit items-center rounded-full border border-white/20 bg-white/8 px-[clamp(1rem,1.15vw,1.375rem)] text-[clamp(0.875rem,0.885vw,1.0625rem)] text-sunbeam`}
            >
              $ npx create-pop-app
            </p>
          </div>

          {/* Code + browser collage — 900 × 904 Figma units, bleeding into the right gutter. */}
          <div
            role="img"
            aria-label="A code editor writing the Pixel Popers hero component next to a browser preview of the finished site"
            className="@container flex flex-col gap-6 lg:-mt-[0.52vw] lg:-mr-[clamp(1.25rem,5vw,6rem)] lg:grid lg:aspect-[900/904] lg:gap-0"
          >
            <CodeEditor className={`w-full ${lgAt} lg:ml-[5.56%] lg:w-[86.67%]`} />
            <BrowserPreview priority className={`relative -mt-12 w-[85%] self-end sm:-mt-28 ${lgAt} lg:mt-[45.56%] lg:ml-[30%] lg:w-[68.89%]`} />
            <div className="relative flex flex-wrap items-center justify-center gap-4 lg:contents">
              <span data-pop className={`relative w-fit ${lgAt} lg:mt-[75.27%] lg:ml-[0.9%]`}>
                <span
                  data-float="6"
                  className={`${mono.className} block rotate-[4deg] rounded-[max(0.75rem,1.56cqw)] border border-[#2ec27e]/60 bg-code px-[max(1rem,2.11cqw)] py-[max(0.6rem,1.44cqw)] text-[max(0.8125rem,1.78cqw)] leading-none whitespace-nowrap text-[#2ec27e]`}
                >
                  ✓ Compiled in 1.2s
                </span>
              </span>
              <span data-pop className={`relative w-fit ${lgAt} lg:mt-[95.54%] lg:ml-[72.39%]`}>
                <span
                  data-float="8"
                  className="block rotate-[-5deg] rounded-[max(0.75rem,1.56cqw)] bg-sunbeam px-[max(1rem,2cqw)] py-[max(0.6rem,1.33cqw)] font-display text-[max(0.8125rem,1.78cqw)] leading-none whitespace-nowrap text-ink shadow-[0_12px_30px_rgb(0_0_0/0.25)]"
                >
                  ⚡ 98 PERFORMANCE
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lighthouse scores ──────────────────────────────────────── */}
      <section aria-labelledby="scores-title" className="shell mt-[clamp(4rem,7.29vw,8.75rem)]">
        <SectionTitle align="center" eyebrow="Speed is a feature" title={<span id="scores-title">Scores we build for</span>} />
        <div data-reveal-stagger className="mx-auto mt-[clamp(2rem,3.44vw,4.125rem)] grid grid-cols-2 gap-[clamp(1rem,3.125vw,3.75rem)] md:grid-cols-4 lg:w-[96.98%]">
          {gauges.map((g) => (
            <Gauge key={g.label} {...g} />
          ))}
        </div>
        <p data-reveal className="mt-[clamp(2rem,4.69vw,5.625rem)] text-center font-copy text-small font-light text-ink/70">
          Measured with Lighthouse on every release — not just launch day.
        </p>
      </section>

      {/* ── The stack: keycaps ─────────────────────────────────────── */}
      <section aria-labelledby="stack-title" className="shell mt-[clamp(3.5rem,4.06vw,4.875rem)] grid items-start gap-y-10 lg:grid-cols-[minmax(0,594fr)_minmax(0,994fr)]">
        <div>
          <SectionTitle
            eyebrow="The stack"
            title={
              <span id="stack-title">
                Modern tools.
                <br />
                No duct tape.
              </span>
            }
            titleClassName="!text-[clamp(1.75rem,2.71vw,3.25rem)] !leading-[1.19]"
          />
          <p data-reveal className="mt-[clamp(1rem,1.56vw,1.875rem)] max-w-[32.5rem] font-copy text-body leading-[1.64] font-light">
            We pick the right tool for the job — not the trendiest one — so your site is fast today and easy to grow tomorrow.
          </p>
        </div>
        <Keyboard className="w-full" />
      </section>

      {/* ── Responsive devices ─────────────────────────────────────── */}
      <section aria-labelledby="screens-title" className="shell mt-[clamp(4rem,6.77vw,8.125rem)]">
        <SectionTitle align="center" eyebrow="Responsive by default" title={<span id="screens-title">One site. Every screen.</span>} />
        <Devices className="mt-[clamp(2rem,3.23vw,3.875rem)] w-full lg:ml-[8.44%] lg:w-[90.05%]" />
      </section>

      {/* ── Ship it: deploy terminal + pipeline ────────────────────── */}
      <section aria-labelledby="ship-title" className="shell mt-[clamp(4rem,7.81vw,9.375rem)] grid items-start gap-y-10 lg:grid-cols-[minmax(0,1000fr)_minmax(0,514fr)] lg:gap-x-[3.85vw]">
        <Terminal className="order-2 w-full lg:order-none" />
        <div className="lg:pt-[1.04vw]">
          <SectionTitle
            eyebrow="Ship it"
            title={
              <span id="ship-title">
                Push to
                <br />
                production
                <br />
                in minutes
              </span>
            }
            titleClassName="!text-[clamp(1.75rem,2.92vw,3.5rem)] !leading-[1.18]"
          />
          <ol data-reveal-stagger className="mt-[clamp(1.25rem,1.875vw,2.25rem)]">
            {pipeline.map((p, i) => (
              <li key={p.step} className="grid grid-cols-[clamp(1.25rem,1.46vw,1.75rem)_1fr] gap-x-[clamp(0.75rem,0.83vw,1rem)]">
                <span aria-hidden className={`aspect-square rounded-full ${p.dot}`} />
                <span className="self-center font-display text-[clamp(0.9375rem,1.04vw,1.25rem)] leading-none uppercase">{p.step}</span>
                {i < pipeline.length - 1 ? <span aria-hidden className="mx-auto h-[clamp(0.875rem,1.04vw,1.25rem)] w-[clamp(3px,0.21vw,4px)] bg-ink/20" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CMS editor ─────────────────────────────────────────────── */}
      <section aria-labelledby="cms-title" className="shell mt-[clamp(4.5rem,10.42vw,12.5rem)]">
        <SectionTitle align="center" eyebrow="Edit it yourself" title={<span id="cms-title">A CMS your team will actually use</span>} titleClassName="!text-[clamp(1.75rem,3.54vw,4.25rem)]" />
        <div data-reveal className="mt-[clamp(2rem,4.375vw,5.25rem)]">
          <CmsEditor />
        </div>
      </section>

      {/* ── Launch checklist ───────────────────────────────────────── */}
      <section aria-labelledby="launch-title" className="shell mt-[clamp(4rem,7.81vw,9.375rem)] grid items-start gap-y-10 lg:grid-cols-[minmax(0,922fr)_minmax(0,594fr)] lg:gap-x-[3.75vw]">
        <div className="@container order-2 flex flex-col lg:order-none lg:grid lg:aspect-[922/712]">
          <Checklist className={`w-full rotate-[2deg] ${lgAt} lg:w-[82.44%]`} />
          <p
            data-reveal
            aria-hidden
            className={`-mt-6 mr-2 grid aspect-square w-[max(9rem,32.54%)] -rotate-12 place-items-center self-end rounded-full bg-blush text-center font-display text-[max(1.375rem,4.77cqw)] leading-[1.227] text-white uppercase shadow-[0_24px_60px_rgb(34_1_40/0.15)] ${lgAt} lg:mt-[44.74%] lg:mr-0 lg:ml-[67.46%] lg:w-[32.54%]`}
          >
            Ready
            <br />
            to
            <br />
            ship
          </p>
        </div>
        <div className="lg:pt-[1.4vw]">
          <SectionTitle
            title={
              <span id="launch-title">
                Nothing
                <br />
                left to
                <br />
                chance
              </span>
            }
            titleClassName="!mt-0 !leading-[1.16]"
          />
          <p data-reveal className="mt-[clamp(1rem,1.35vw,1.625rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">
            Every launch runs through the same 40-point checklist — security, SEO, speed, accessibility and tracking — so day one is a celebration, not a fire drill.
          </p>
          <p data-reveal className="mt-[clamp(1.5rem,2.19vw,2.625rem)] font-display text-[clamp(0.875rem,0.94vw,1.125rem)] text-blush">+ 3 months of free care after launch</p>
        </div>
      </section>
    </ShipMotion>
  );
}
