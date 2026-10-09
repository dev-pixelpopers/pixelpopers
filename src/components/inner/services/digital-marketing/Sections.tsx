import Breadcrumb from "@/components/inner/Breadcrumb";
import RevealCard from "@/components/inner/RevealCard";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import type { ServiceDetail } from "@/lib/service-content";
import GrowthMotion from "./GrowthMotion";
import {
  ContentCalendar,
  Dashboard,
  PostPhone,
  ProfilePhone,
  ResultsChart,
  SearchResults,
  StoryAd,
  cardShadow,
  type Story,
} from "./Parts";

/*
  Concept: the page is a growth dashboard. Figma frame 371:21 "03.3 — Service:
  DIGITAL MARKETING". Collages (hero, channel orbit) are single-cell grids on
  desktop: every piece shares one cell and is placed with percentage margins,
  which resolve against the cell width so the collage scales as one. Below
  `lg`/`md` the same pieces fall back to a plain stacked flow.
*/

const headingGap = "mt-[clamp(2.5rem,3.96vw,4.75rem)]";
/** Story "tap forward": the ad slides out and the step frame slides in (spelled out for Tailwind). */
const frontOut =
  "group-hover:-translate-x-1/3 group-hover:opacity-0 group-focus-visible:-translate-x-1/3 group-focus-visible:opacity-0 group-data-[open=true]:-translate-x-1/3 group-data-[open=true]:opacity-0";
const backIn = "group-hover:translate-x-0 group-focus-visible:translate-x-0 group-data-[open=true]:translate-x-0";
const progressFill = "group-hover:w-full group-focus-visible:w-full group-data-[open=true]:w-full";

const sectionGap = "mt-[clamp(4.5rem,9.375vw,11.25rem)]";
const lgAt =
  "lg:col-start-1 lg:row-start-1 lg:self-start lg:justify-self-start";

const toasts = [
  {
    label: "♥  12.4K",
    tone: "bg-blush text-white",
    tilt: "rotate-[6deg]",
    at: "lg:mt-[67.99%] lg:ml-[35.49%]",
  },
  {
    label: "●  New lead: Sarah from Lahore",
    tone: "bg-white text-ink",
    tilt: "rotate-[-3deg]",
    at: "lg:mt-[59.15%] lg:ml-[50.64%]",
  },
  {
    label: "ROAS 3.2×",
    tone: "bg-sunbeam text-ink",
    tilt: "rotate-[4deg]",
    at: "lg:mt-[71.02%] lg:ml-[79.81%]",
  },
  {
    label: "CTR 4.8%",
    tone: "bg-lagoon text-white",
    tilt: "rotate-[-5deg]",
    at: "lg:mt-[48.89%] lg:ml-[86.51%]",
  },
];

/* Orbit planets, clockwise from the top. Positions are % of the 1048-unit orbit box. */
const planets = [
  {
    name: "Social",
    note: "+48% followers",
    bg: "bg-blush",
    tone: "text-white",
    at: "md:ml-[40.46%] md:mt-0",
  },
  {
    name: "SEO",
    note: "Page 1 rankings",
    bg: "bg-lagoon",
    tone: "text-white",
    at: "md:ml-[80.92%] md:mt-[23.38%]",
  },
  {
    name: "Paid ads",
    note: "3.2× ROAS",
    bg: "bg-sunbeam",
    tone: "text-ink",
    at: "md:ml-[80.92%] md:mt-[70.13%]",
  },
  {
    name: "Email",
    note: "42% open rate",
    bg: "bg-lav",
    tone: "text-white",
    at: "md:ml-[40.46%] md:mt-[93.51%]",
  },
  {
    name: "Content",
    note: "Reels & posts",
    bg: "bg-blush",
    tone: "text-white",
    at: "md:ml-0 md:mt-[70.13%]",
  },
  {
    name: "Analytics",
    note: "Monthly reports",
    bg: "bg-lagoon",
    tone: "text-white",
    at: "md:ml-0 md:mt-[23.38%]",
    small: true,
  },
];

const funnel = [
  {
    stage: "Awareness",
    how: "Reels, collabs & paid reach",
    result: "1.2M reached",
    bar: "bg-blush text-white",
    value: "text-blush-ink",
    cols: "lg:grid-cols-[1fr_67.71%_1fr]",
    w: "w-full",
  },
  {
    stage: "Interest",
    how: "Content, SEO & retargeting",
    result: "86K visits",
    bar: "bg-grape text-white",
    value: "text-grape",
    cols: "lg:grid-cols-[1fr_56.25%_1fr]",
    w: "w-[92%]",
  },
  {
    stage: "Consideration",
    how: "Reviews, email & landing pages",
    result: "12K leads",
    bar: "bg-lagoon text-white",
    value: "text-lagoon",
    cols: "lg:grid-cols-[1fr_44.79%_1fr]",
    w: "w-[84%]",
  },
  {
    stage: "Conversion",
    how: "Offers, checkout & ads",
    result: "3.4K sales",
    bar: "bg-sunbeam text-ink",
    value: "text-[#d9a12f] lg:text-sunbeam",
    cols: "lg:grid-cols-[1fr_33.33%_1fr]",
    w: "w-[76%]",
  },
  {
    stage: "Loyalty",
    how: "Email flows & community",
    result: "42% repeat",
    bar: "bg-ink text-white",
    value: "text-grape",
    cols: "lg:grid-cols-[1fr_21.88%_1fr]",
    w: "w-[68%]",
  },
];

const kpiStickers = [
  {
    value: "+160%",
    label: "Revenue in 6 months",
    tone: "bg-blush text-white",
    tilt: "rotate-[-2deg]",
  },
  {
    value: "4.8%",
    label: "Avg. click-through",
    tone: "bg-lagoon text-white",
    tilt: "rotate-[1deg]",
  },
  {
    value: "−38%",
    label: "Cost per lead",
    tone: "bg-sunbeam text-ink",
    tilt: "rotate-[-1deg]",
  },
];

const stories: Story[] = [
  {
    img: "radiance.webp",
    w: 1024,
    h: 1174,
    alt: "Skincare story ad: “Radiance that feels alive” with a glowing portrait",
    headline: "Glow in 7 days",
    cta: "Shop now",
    progress: "w-[38.96%]",
    frame: "bg-blush",
    button: "bg-blush text-white",
    tilt: "rotate-[2deg]",
  },
  {
    img: "fifth-sip.webp",
    w: 857,
    h: 1200,
    alt: "Fifth Sip coffee story ad with branded cups, bag and menus",
    headline: "Your 5th sip is on us",
    cta: "Claim offer",
    progress: "w-[51.95%]",
    frame: "bg-sunbeam",
    button: "bg-sunbeam text-ink",
    tilt: "rotate-[-1deg] lg:mt-[2.08vw]",
  },
  {
    img: "digital-marketing/flavour-drop.webp",
    w: 1600,
    h: 891,
    alt: "Colourful drinks brand story ad announcing a new flavour drop",
    headline: "Bold flavor. New drop.",
    cta: "Order now",
    progress: "w-[64.94%]",
    frame: "bg-lagoon",
    button: "bg-lagoon text-white",
    tilt: "rotate-[1deg]",
  },
  {
    img: "fortis-homes.webp",
    w: 736,
    h: 920,
    alt: "Real-estate story ad for 2 and 3 BHK apartments",
    headline: "2 & 3 BHK from 49L",
    cta: "Book a visit",
    progress: "w-[77.92%]",
    frame: "bg-grape",
    button: "bg-grape text-white",
    tilt: "rotate-[-2deg] lg:mt-[2.08vw]",
  },
];

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, l3] = service.heroLines;

  return (
    <GrowthMotion className="flex flex-col pb-[clamp(5rem,9.9vw,11.875rem)]">
      {/* ── Hero: campaign dashboard ───────────────────────────────── */}
      <section aria-labelledby="hero-title" className="relative isolate">
        {/* Decorative glows bleed up behind the header, so they can't live in flow. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-60 -z-10 h-[calc(100%+15rem)] bg-[radial-gradient(ellipse_34%_44%_at_18%_14%,rgb(242_119_147/0.3),transparent_72%),radial-gradient(ellipse_34%_48%_at_76%_42%,rgb(63_183_199/0.28),transparent_72%)]"
        />

        <div className="shell grid items-start gap-y-12 lg:grid-cols-[minmax(0,734fr)_minmax(0,854fr)]">
          <div className="pt-[clamp(1rem,2.6vw,3.125rem)]">
            <Breadcrumb
              items={[
                { label: "Services", href: "/services" },
                { label: service.name },
              ]}
            />
            <h1
              id="hero-title"
              className="mt-[clamp(1.5rem,3.1vw,3.6rem)] uppercase"
            >
              <span className="block font-display text-[clamp(3rem,6.25vw,7.5rem)] leading-[1.08] text-blush-ink">
                {l1}
              </span>
              <span className="block font-haas text-[clamp(3rem,6.25vw,7.5rem)] leading-[1.25] tracking-[-0.05em] text-grape">
                {l2}
              </span>
              <span className="block font-display text-[clamp(1.75rem,3.75vw,4.5rem)] leading-[1.28] text-lagoon">
                {l3}
              </span>
            </h1>
            <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">
              {service.heroIntro}
            </p>
            <PopButton
              href="/contact"
              label={service.heroCta}
              className="mt-[clamp(2rem,3.54vw,4.25rem)] [&>span:last-child]:text-ink"
            />
          </div>

          {/* Dashboard collage — 950 × 1023 Figma units, bleeding into the right gutter. */}
          <div
            aria-label="Live campaign dashboard with a sponsored post and new-result notifications"
            role="img"
            className="@container flex flex-col items-center gap-6 lg:-mt-[0.52vw] lg:-mr-[clamp(1.25rem,5vw,6rem)] lg:grid lg:aspect-[950/1023] lg:gap-0"
          >
            <Dashboard
              className={`w-full ${lgAt} lg:ml-[10.53%] lg:w-[86.32%]`}
            />
            <PostPhone
              className={`-mt-16 w-[62%] max-w-[20rem] self-start rotate-[5deg] sm:ml-[8%] ${lgAt} lg:mt-[40.29%] lg:ml-[0.16%] lg:w-[33.68%] lg:max-w-none`}
            />
            <div className="flex flex-wrap justify-center gap-3 lg:contents">
              {toasts.map((t) => (
                <span
                  key={t.label}
                  data-pop
                  className={`w-fit ${lgAt} ${t.at}`}
                >
                  <span
                    data-float="6"
                    className={`block rounded-[max(0.875rem,1.89cqw)] px-[max(1rem,2.1cqw)] py-[max(0.6rem,1.47cqw)] font-copy text-[max(0.8125rem,1.89cqw)] leading-none font-bold whitespace-nowrap shadow-[0_12px_30px_rgb(34_1_40/0.18)] ${t.tone} ${t.tilt}`}
                  >
                    {t.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Growth engine: channel orbit ───────────────────────────── */}
      <section
        aria-labelledby="engine-title"
        className="shell mt-[clamp(3.5rem,4.43vw,5.3125rem)]"
      >
        <SectionTitle
          align="center"
          eyebrow="The growth engine"
          title={<span id="engine-title">One brand. Six channels.</span>}
        />
        <div className="@container mx-auto mt-[clamp(2rem,3.44vw,4.125rem)] flex flex-col items-center gap-8 md:grid md:aspect-[1048/1180] md:w-[80%] md:gap-0 lg:w-[66%]">
          <span
            aria-hidden
            data-spin="120"
            className="hidden aspect-square rounded-full border-2 border-dashed border-grape/50 md:col-start-1 md:row-start-1 md:mt-[9.54%] md:ml-[3.24%] md:block md:w-[93.51%] md:self-start md:justify-self-start"
          />
          <span
            aria-hidden
            data-spin="80"
            className="hidden aspect-square rounded-full border-2 border-dotted border-blush/50 md:col-start-1 md:row-start-1 md:mt-[23.85%] md:ml-[17.56%] md:block md:w-[64.89%] md:self-start md:justify-self-start"
          />
          <span
            aria-hidden
            className="hidden aspect-square rounded-full border-2 border-lagoon/50 md:col-start-1 md:row-start-1 md:mt-[38.17%] md:ml-[31.87%] md:block md:w-[36.26%] md:self-start md:justify-self-start"
          />
          <p
            data-reveal
            className={`grid aspect-square w-[60%] max-w-[16rem] place-items-center rounded-full bg-grape text-center font-display text-[max(1.5rem,3.82cqw)] leading-[1.15] text-white uppercase md:col-start-1 md:row-start-1 md:mt-[41.98%] md:ml-[35.69%] md:w-[28.63%] md:max-w-none md:self-start md:justify-self-start ${cardShadow}`}
          >
            Your
            <br />
            brand
          </p>
          <ul
            data-reveal-stagger
            className="grid w-full grid-cols-2 justify-items-center gap-5 sm:grid-cols-3 md:contents"
          >
            {planets.map((p) => (
              <li
                key={p.name}
                className={`@container flex aspect-square w-full max-w-[10rem] flex-col items-center justify-center rounded-full text-center md:col-start-1 md:row-start-1 md:w-[19.08%] md:max-w-none md:self-start md:justify-self-start ${p.bg} ${p.tone} ${p.at} ${cardShadow}`}
              >
                <h3
                  className={`font-display uppercase ${p.small ? "text-[max(0.75rem,10cqw)]" : "text-[max(0.875rem,13cqw)]"} leading-[1.2]`}
                >
                  {p.name}
                </h3>
                <p className="mt-[4cqw] font-copy text-[max(0.6875rem,7.5cqw)] font-medium opacity-90">
                  {p.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The funnel ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="funnel-title"
        className="mt-[clamp(4rem,4.69vw,5.625rem)]"
      >
        <div className="shell">
          <SectionTitle
            align="center"
            size="md"
            eyebrow="The funnel, fixed"
            title={
              <span id="funnel-title">From “who?” to “where do I pay?”</span>
            }
          />
        </div>
        <ol
          data-reveal-stagger
          className="mx-auto mt-[clamp(2rem,4.58vw,5.5rem)] flex w-full max-w-[1920px] flex-col gap-[clamp(1.25rem,1.04vw,1.25rem)] px-5 lg:px-0"
        >
          {funnel.map((f) => (
            <li
              key={f.stage}
              className={`flex flex-col items-center lg:grid lg:items-center ${f.cols}`}
            >
              <h3
                className={`flex h-[clamp(3.25rem,5.21vw,6.25rem)] items-center justify-center rounded-full font-display text-[clamp(1rem,1.5625vw,1.875rem)] uppercase shadow-[0_12px_24px_rgb(34_1_40/0.12)] lg:col-start-2 lg:row-start-1 lg:w-full ${f.w} ${f.bar}`}
              >
                {f.stage}
              </h3>
              <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 text-center lg:contents">
                <p className="font-copy text-[clamp(0.8125rem,0.9375vw,1.125rem)] font-medium text-ink/75 lg:col-start-1 lg:row-start-1 lg:pr-[2.6vw] lg:text-right">
                  {f.how}
                </p>
                <p
                  className={`font-copy text-[clamp(1rem,1.46vw,1.75rem)] font-extrabold lg:col-start-3 lg:row-start-1 lg:pl-[1.56vw] lg:text-left ${f.value}`}
                >
                  {f.result}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Social media: profile grid + content calendar ──────────── */}
      <section
        aria-labelledby="social-title"
        className="shell mt-[clamp(4.5rem,8.33vw,10rem)] grid items-start gap-y-12 lg:grid-cols-[minmax(0,440fr)_minmax(0,994fr)] lg:gap-x-[8.02vw]"
      >
        <div
          data-reveal
          className="order-2 mx-auto w-[78%] max-w-[22rem] lg:order-none lg:-mt-[1.04vw] lg:-ml-[1.67vw] lg:w-full lg:max-w-none"
        >
          <ProfilePhone className="rotate-[4deg]" />
        </div>
        <div>
          <SectionTitle
            eyebrow="Social media"
            title={
              <span id="social-title">
                Feeds that
                <br />
                actually pop
              </span>
            }
          />
          <p
            data-reveal
            className="mt-[clamp(1.25rem,1.46vw,1.75rem)] max-w-[40rem] font-copy text-body leading-[1.64] font-light"
          >
            We plan, shoot, design and post — a consistent feed with a clear
            look, a steady rhythm and content people save and share.
          </p>
          <ContentCalendar className="mt-[clamp(2rem,4.58vw,5.5rem)] lg:w-[90.54%]" />
        </div>
      </section>

      {/* ── Results: before / after bars + KPI stickers ────────────── */}
      <section
        aria-labelledby="results-title"
        className="shell mt-[clamp(4.5rem,11.46vw,13.75rem)]"
      >
        <SectionTitle
          eyebrow="Results, not vanity"
          title={<span id="results-title">Watch the bars go up</span>}
        />
        <div
          className={`grid items-start gap-[clamp(1.5rem,2.81vw,3.375rem)] lg:grid-cols-[minmax(0,1100fr)_minmax(0,420fr)] ${headingGap}`}
        >
          <ResultsChart className="w-full" />
          <ul
            data-reveal-stagger
            className="grid gap-[clamp(1rem,1.5625vw,1.875rem)] sm:grid-cols-3 lg:grid-cols-1"
          >
            {kpiStickers.map((k) => (
              <li key={k.label} className={`@container ${k.tilt}`}>
                <p
                  className={`flex aspect-[420/180] flex-col rounded-[7.62cqw] px-[7.62cqw] pt-[3.33cqw] ${k.tone} ${cardShadow}`}
                >
                  <span
                    data-count
                    className="font-pop text-[22.86cqw] leading-[1.146]"
                  >
                    {k.value}
                  </span>
                  <span className="font-display text-[max(0.625rem,3.81cqw)] uppercase">
                    {k.label}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SEO: the #1 search result ──────────────────────────────── */}
      <section aria-labelledby="seo-title" className={`shell ${sectionGap}`}>
        <SectionTitle
          align="center"
          eyebrow="SEO"
          title={<span id="seo-title">Be the first thing they find</span>}
        />
        <div
          data-reveal
          className={`@container mx-auto grid w-full lg:w-[75.57%] ${headingGap}`}
        >
          <SearchResults className="col-start-1 row-start-1" />
          <span
            aria-hidden
            data-float="10"
            className={`col-start-1 row-start-1 -mt-[6%] ml-[84%] grid aspect-square w-[16%] -rotate-12 place-items-center self-start justify-self-start rounded-full bg-sunbeam font-pop text-[max(1.75rem,7.5cqw)] leading-none text-ink lg:mt-[2.73%] lg:ml-[95.33%] lg:w-[12.5%] ${cardShadow}`}
          >
            #1
          </span>
        </div>
      </section>

      {/* ── Process as story ads — hover / tap skips to the next frame ── */}
      <section aria-labelledby="ads-title" className={`shell ${sectionGap}`}>
        <SectionTitle eyebrow="How we do it" title={<span id="ads-title">Four stories to growth</span>} />
        <p className="mt-5 font-haas text-[clamp(0.9375rem,0.94vw,1.125rem)] text-blush-deep uppercase">
          <span className="hidden [@media(hover:hover)]:inline">Hover</span>
          <span className="[@media(hover:hover)]:hidden">Tap</span> a story to skip to the next frame&nbsp;&nbsp;↘
        </p>
        <ol
          data-reveal-stagger
          className="mt-[clamp(2rem,3.6vw,4.375rem)] grid items-start gap-x-[clamp(1rem,3.125vw,3.75rem)] gap-y-8 sm:grid-cols-2 lg:w-[96.98%] lg:grid-cols-4"
        >
          {stories.map((s, i) => {
            const step = service.process[i];
            const next = service.process[i + 1];
            const n = String(i + 1).padStart(2, "0");
            const light = s.frame === "bg-sunbeam";
            return (
              <li key={s.headline} className={`mx-auto w-full max-w-[22rem] sm:max-w-none ${s.tilt}`}>
                <RevealCard as="div" label={`Step ${n}: ${step.title} — skip to the next frame`} className="block rounded-[2rem]">
                  <div className="grid overflow-hidden rounded-[2rem]">
                    <div className={`col-start-1 row-start-1 transition-[translate,opacity] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${frontOut}`}>
                      <StoryAd story={{ ...s, tilt: "" }} />
                    </div>
                    {/* Next frame: the process step */}
                    <div className={`@container col-start-1 row-start-1 translate-x-full transition-[translate] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${backIn}`}>
                      <div className={`flex aspect-[340/600] flex-col rounded-[9.41cqw] ${s.frame} ${light ? "text-ink" : "text-white"}`}>
                        <span aria-hidden className="mx-[4.71cqw] mt-[4.12cqw] flex gap-[2.35cqw]">
                          <span className="h-[1.18cqw] flex-1 rounded-full bg-current" />
                          <span className="h-[1.18cqw] flex-1 overflow-hidden rounded-full bg-current/35">
                            <span className={`block h-full w-0 rounded-full bg-current transition-[width] delay-150 duration-[2400ms] ease-linear ${progressFill}`} />
                          </span>
                        </span>
                        <span className="mt-[4.12cqw] px-[5.88cqw] font-copy text-[max(0.625rem,4.12cqw)] font-bold opacity-85">Pixel Popers · Sponsored</span>
                        <span aria-hidden className="mt-[2cqw] px-[4.1cqw] font-pop text-[44cqw] leading-[0.9] opacity-20">{n}</span>
                        <span className="mt-auto px-[5.88cqw] font-haas text-[max(0.625rem,4.12cqw)] uppercase">Step {n} of 04</span>
                        <h3 className="mt-[1.5cqw] px-[5.88cqw] font-display text-[max(1.125rem,11.8cqw)] leading-[1.2] uppercase">{step.title}</h3>
                        <p className="mt-[3cqw] px-[5.88cqw] font-copy text-[max(0.75rem,5cqw)] leading-[1.53]">{step.body}</p>
                        <span
                          aria-hidden
                          className={`mx-[5.88cqw] mt-[6cqw] mb-[8.24cqw] grid h-[15.29cqw] shrink-0 place-items-center rounded-full font-copy text-[max(0.6875rem,5cqw)] font-bold ${light ? "bg-ink text-white" : "bg-white text-ink"}`}
                        >
                          {next ? `Next: ${next.title}` : "Start growing"}&nbsp;&nbsp;↑
                        </span>
                      </div>
                    </div>
                  </div>
                </RevealCard>
              </li>
            );
          })}
        </ol>
      </section>
    </GrowthMotion>
  );
}
