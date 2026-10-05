import Image from "next/image";
import type { CSSProperties } from "react";
import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import { serif } from "@/lib/inner-fonts";
import type { ServiceDetail } from "@/lib/service-content";
import ContentFx from "./ContentFx";

/*
  Concept: editorial paper. Figma frame 381:21 "03.6 — Service: CONTENT
  WRITING". The hero desk (draft, paper behind, margin notes, pencil) is a
  single-cell grid: every layer shares one cell and is placed with percentage
  margins (resolved against the cell width), and the paper's text uses `cqw`
  of the desk (1cqw = 10 Figma px), so the whole desk scales as one. Figma
  rotations are flipped for CSS (Figma +° is counter-clockwise) and the
  positions re-centred, because CSS rotates around the centre.
*/

const layer = "col-start-1 row-start-1 self-start justify-self-start";
const cardShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.15)]";
const paperShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.16)]";
const headingGap = "mt-[clamp(2.5rem,3.96vw,4.75rem)]";
const paper = "bg-[#FFFBF4]";

/** A pen line drawn through text (see ContentFx `data-strike`). Static = fully struck. */
const strike = (color: string, thickness: string): CSSProperties => ({
  backgroundImage: `linear-gradient(${color}, ${color})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 58%",
  backgroundSize: `100% ${thickness}`,
});

const sliders = [
  { from: "Formal", to: "Casual", value: 78, fill: "bg-blush", ring: "border-blush" },
  { from: "Serious", to: "Playful", value: 70, fill: "bg-lagoon", ring: "border-lagoon" },
  { from: "Respectful", to: "Cheeky", value: 55, fill: "bg-grape", ring: "border-grape" },
  { from: "Matter-of-fact", to: "Enthusiastic", value: 82, fill: "bg-sunbeam", ring: "border-sunbeam" },
];

const issue = [
  { title: "Website copy", page: "p.2", tone: "text-blush" },
  { title: "Blog articles", page: "p.4", tone: "text-lagoon" },
  { title: "SEO content", page: "p.6", tone: "text-sunbeam" },
  { title: "Social captions", page: "p.8", tone: "text-blush" },
  { title: "Video scripts", page: "p.10", tone: "text-lagoon" },
  { title: "Email newsletters", page: "p.12", tone: "text-lav" },
  { title: "Tone-of-voice guides", page: "p.14", tone: "text-sunbeam" },
  { title: "Product descriptions", page: "p.16", tone: "text-blush" },
];

const columns = [
  "When Fifth Sip asked for “a few words for the website”, nobody expected the café’s homepage to become the most-shared link in the neighbourhood group chat. The secret? Copy that sounds like an actual person.",
  "“We stopped describing ourselves as a provider of coffee solutions,” says the founder. “Now we just say what we are: the place that makes your Saturday.” Bookings are up, and so is the brunch queue.",
  "Pixel Popers’ writers spent a week listening before writing a single line — interviews, customer reviews, even the chalkboard specials. The result: a voice guide, 12 pages of web copy and a blog people actually finish.",
];

const keywords = [
  { term: "specialty coffee", volume: "12K/mo", tone: "bg-blush text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.9375rem,1.51vw,1.8125rem)]" },
  { term: "brunch near me", volume: "8.1K/mo", tone: "bg-lagoon text-white", tilt: "rotate-[-3deg]", size: "text-[clamp(0.875rem,1.25vw,1.5rem)]" },
  { term: "flat white", volume: "5.4K/mo", tone: "bg-grape text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.875rem,1.33vw,1.59375rem)]" },
  { term: "coffee beans online", volume: "3.2K/mo", tone: "bg-sunbeam text-ink", tilt: "rotate-[-3deg]", size: "text-[clamp(0.8125rem,1.06vw,1.275rem)]" },
  { term: "best café in town", volume: "2.9K/mo", tone: "bg-blush text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.8125rem,1.06vw,1.275rem)]" },
  { term: "single origin", volume: "1.8K/mo", tone: "bg-lagoon text-white", tilt: "rotate-[-3deg]", size: "text-[clamp(0.75rem,0.97vw,1.17rem)]" },
  { term: "coffee subscription", volume: "1.2K/mo", tone: "bg-grape text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.75rem,0.97vw,1.17rem)]" },
];

const stickies = [
  { value: "1,500", label: "Words per blog", tone: "bg-sunbeam text-ink", tilt: "rotate-[4deg]" },
  { value: "48h", label: "To a first draft", tone: "bg-blush text-white", tilt: "rotate-[-3deg]" },
  { value: "2", label: "Rounds of edits", tone: "bg-lagoon text-white", tilt: "rotate-[2deg]" },
  { value: "500+", label: "Articles written", tone: "bg-lav text-ink", tilt: "rotate-[-4deg]" },
];

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, l3] = service.heroLines;

  return (
    <ContentFx className="flex flex-col pb-[clamp(5rem,12.5vw,15rem)]">
      {/* ── Hero: the draft on the desk ────────────────────────────── */}
      <section aria-labelledby="hero-title" className="relative isolate">
        {/* Decorative glows bleed up behind the header, so they can't live in flow. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[calc(100%+10rem)] bg-[radial-gradient(ellipse_32%_48%_at_18%_12%,rgb(242_119_147/0.32),transparent_72%),radial-gradient(ellipse_30%_45%_at_78%_58%,rgb(106_75_151/0.2),transparent_72%)]" />

        <div className="shell grid items-start gap-y-16 lg:grid-cols-[minmax(0,734fr)_minmax(0,854fr)]">
          <div className="relative z-10 pt-[clamp(1rem,2.6vw,3.125rem)]">
            <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.name }]} />
            <h1 id="hero-title" className="mt-[clamp(1.25rem,2.6vw,3.125rem)] uppercase">
              <span className="block font-display text-[clamp(2.75rem,6.25vw,7.5rem)] leading-[1.275] text-blush">{l1}</span>
              <span className="-mt-[1.2vw] block font-haas text-[clamp(3.25rem,7.81vw,9.375rem)] leading-[1.087] tracking-[-0.05em] text-grape">{l2}</span>
              <span className="mt-[0.89vw] flex items-start gap-[0.52vw]">
                <span className="font-display text-[clamp(1.75rem,4.17vw,5rem)] leading-[1.275] text-lagoon">{l3}</span>
                <span aria-hidden data-caret className="mt-[0.52vw] h-[1.05em] w-[max(3px,0.52vw)] shrink-0 bg-blush text-[clamp(1.75rem,4.17vw,5rem)]" />
              </span>
            </h1>
            <p className="mt-[clamp(1.25rem,1.98vw,2.375rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">{service.heroIntro}</p>
            <PopButton href="/contact" label={service.heroCta} className="mt-[clamp(1.75rem,3.54vw,4.25rem)] [&>span:last-child]:text-ink" />
          </div>

          {/* Clips the oversized mobile desk at the viewport edge (the shell padding is undone, then re-applied). */}
          <div className="-mx-[clamp(1.25rem,8.65vw,10.375rem)] overflow-x-clip px-[clamp(1.25rem,8.65vw,10.375rem)] lg:mx-0 lg:overflow-x-visible lg:px-0">
            <DraftDesk />
          </div>
        </div>
      </section>

      {/* ── The rewrite (before / after) ───────────────────────────── */}
      <section aria-labelledby="rewrite-title" className="shell mt-[clamp(4rem,9.74vw,11.75rem)]">
        <SectionTitle align="center" eyebrow="The rewrite" title={<span id="rewrite-title">Same brand. Better words.</span>} />
        <div className={`grid ${headingGap}`}>
          <div className="col-start-1 row-start-1 grid gap-y-[7.5rem] lg:grid-cols-2 lg:gap-x-[3.54vw]">
            <article data-edit data-reveal className="flex min-h-[clamp(18rem,23.96vw,28.75rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] bg-[#E6E0DD] p-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(2rem,3.2vw,3.875rem)]">
              <h3 className="grid h-[clamp(2.125rem,2.08vw,2.5rem)] w-[clamp(7.5rem,7.29vw,8.75rem)] place-items-center rounded-full bg-white font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-[#8C8784]">
                BEFORE
              </h3>
              <p className="mt-[clamp(1.5rem,2.08vw,2.5rem)] font-copy text-[clamp(1.25rem,1.67vw,2rem)] leading-[1.44] text-[#8C8784]">
                <span data-strike="0.07em" className="[box-decoration-break:slice]" style={strike("#8C8784", "0.07em")}>
                  We are a leading provider of innovative, best-in-class solutions for all of your coffee-related needs and requirements.
                </span>
              </p>
              <p className="mt-auto pt-6 font-copy text-[clamp(0.875rem,0.885vw,1.0625rem)] font-medium text-[#8C8784]">38 words of nothing&nbsp; ·&nbsp; 0 personality</p>
            </article>
            <article data-reveal className={`flex min-h-[clamp(18rem,23.96vw,28.75rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] bg-blush p-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(2rem,3.2vw,3.875rem)] text-white ${paperShadow}`}>
              <h3 className="grid h-[clamp(2.125rem,2.08vw,2.5rem)] w-[clamp(7.5rem,7.29vw,8.75rem)] place-items-center rounded-full bg-white font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-blush">
                AFTER
              </h3>
              <p className="mt-[clamp(1.5rem,2.08vw,2.5rem)] max-w-[34rem] font-display text-[clamp(1.75rem,2.71vw,3.25rem)] leading-[1.19] uppercase">Coffee that tastes like Saturday. Every day.</p>
              <p className="mt-auto pt-6 font-copy text-[clamp(0.875rem,0.885vw,1.0625rem)] font-medium">8 words&nbsp; ·&nbsp; 100% you</p>
            </article>
          </div>
          <span
            aria-hidden
            data-float="6"
            className={`col-start-1 row-start-1 grid size-[clamp(6.5rem,9.375vw,11.25rem)] rotate-[10deg] place-items-center place-self-center rounded-full bg-sunbeam text-center font-display text-[clamp(1rem,1.35vw,1.625rem)] leading-[1.38] text-ink ${paperShadow}`}
          >
            <span>
              RE
              <br />
              WRITE
              <br />→
            </span>
          </span>
        </div>
      </section>

      {/* ── Tone of voice sliders ──────────────────────────────────── */}
      <section aria-labelledby="tone-title" className="shell mt-[clamp(4rem,9.375vw,11.25rem)] grid items-start gap-y-10 lg:grid-cols-[minmax(0,648fr)_minmax(0,940fr)]">
        <div>
          <SectionTitle
            eyebrow="Tone of voice"
            title={
              <span id="tone-title">
                Find your
                <br />
                voice
              </span>
            }
          />
          <p data-reveal className="mt-[clamp(1.25rem,1.98vw,2.375rem)] max-w-[32.5rem] font-copy text-body leading-[1.64] font-light">
            Every brand sits somewhere on these dials. We find your spot, write it down, and make sure every word — from homepage to error message — sounds like you.
          </p>
        </div>
        <div data-reveal className={`rounded-[clamp(1.5rem,1.875vw,2.25rem)] bg-white px-[clamp(1.25rem,2.5vw,3rem)] pt-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(2rem,3.9vw,4.75rem)] ${cardShadow}`}>
          <h3 className="font-display text-[clamp(0.75rem,0.83vw,1rem)] text-grape uppercase">Fifth Sip — voice profile</h3>
          <ul className="mt-[clamp(1.75rem,2.6vw,3.125rem)] flex flex-col gap-[clamp(1.75rem,2.3vw,2.75rem)]">
            {sliders.map((s) => (
              <li key={s.from} data-slider={s.value} style={{ "--v": s.value } as CSSProperties}>
                <p className="flex justify-between font-copy text-[clamp(0.9375rem,1.04vw,1.25rem)] font-bold">
                  <span className="text-ink/60">{s.from}</span>
                  <span className="sr-only">to</span>
                  <span className="text-ink">{s.to}</span>
                  <span className="sr-only">: {s.value}% of the way</span>
                </p>
                <div aria-hidden className="mt-[clamp(0.5rem,0.68vw,0.8125rem)] grid h-[clamp(1.75rem,2.08vw,2.5rem)] items-center">
                  <span className="col-start-1 row-start-1 h-[clamp(0.625rem,0.73vw,0.875rem)] rounded-full bg-[#D9D2DC]/60" />
                  <span className={`col-start-1 row-start-1 h-[clamp(0.625rem,0.73vw,0.875rem)] justify-self-start rounded-full ${s.fill}`} style={{ width: "calc(var(--v) * 1%)" }} />
                  <span
                    className={`col-start-1 row-start-1 aspect-square h-full justify-self-start rounded-full border-[clamp(4px,0.31vw,6px)] bg-white ${s.ring}`}
                    style={{ marginLeft: "calc(var(--v) * 1% - clamp(0.875rem, 1.04vw, 1.25rem))" }}
                  />
                </div>
                <span aria-hidden className="flex justify-between">
                  {Array.from({ length: 11 }, (_, i) => (
                    <span key={i} className="h-2 w-0.5 bg-ink/15" />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The Poppin' Post ───────────────────────────────────────── */}
      <section aria-labelledby="post-title" className="shell mt-[clamp(3.5rem,8.3vw,10rem)]">
        <div className="grid">
          <article data-reveal className={`col-start-1 row-start-1 rotate-[1deg] rounded-[6px] border-[3px] border-ink ${paper} px-[clamp(1rem,2.08vw,2.5rem)] pt-[clamp(1rem,1.56vw,1.875rem)] pb-[clamp(1.25rem,2.08vw,2.5rem)] ${cardShadow}`}>
            <p className="flex flex-wrap justify-between gap-x-6 gap-y-1 font-display text-[clamp(0.5625rem,0.73vw,0.875rem)] text-ink/60 uppercase lg:pr-[6.15vw]">
              <span>Vol. 7 &nbsp;·&nbsp; October 2026 &nbsp;·&nbsp; Price: one good idea</span>
              <span>Weather: 100% chance of pop</span>
            </p>
            <h2 id="post-title" className={`${serif.className} mt-[clamp(0.25rem,0.42vw,0.5rem)] text-center text-[clamp(2.25rem,6.25vw,7.5rem)] leading-[1.3] font-black text-ink`}>
              The Poppin’ Post
            </h2>
            <span aria-hidden className="block h-[3px] bg-ink lg:h-1" />
            <span aria-hidden className="mt-1.5 block h-px bg-ink" />

            <div className="mt-[clamp(1.25rem,1.3vw,1.5625rem)] grid gap-x-[1.46vw] gap-y-8 lg:grid-cols-[minmax(0,1060fr)_minmax(0,420fr)]">
              <div className="flex flex-col">
                <h3 className={`${serif.className} text-[clamp(1.375rem,2.6vw,3.125rem)] leading-[1.16] font-bold text-ink`}>LOCAL CAFÉ’S WEBSITE COPY SO GOOD, CUSTOMERS READ IT TWICE</h3>
                <p className={`${serif.className} mt-[clamp(0.75rem,1.46vw,1.75rem)] text-[clamp(1rem,1.25vw,1.5rem)] text-blush`}>Experts baffled as “About Us” page outperforms the brunch menu.</p>
                <div className="mt-[clamp(1rem,1.46vw,1.75rem)] grid gap-y-4 md:min-h-[19.8vw] md:grid-cols-3 md:divide-x md:divide-ink/30">
                  {columns.map((text, i) => (
                    <p key={i} className={`${serif.className} text-[clamp(0.9375rem,0.94vw,1.125rem)] leading-[1.67] text-ink md:px-[0.78vw] md:first:pl-0 md:last:pr-0`}>
                      {text}
                    </p>
                  ))}
                </div>
                <Image
                  src="/assets/inner/writing.webp"
                  alt="A writer at a café table with a laptop and an iced latte"
                  width={698}
                  height={611}
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className="mt-[clamp(1rem,1.04vw,1.25rem)] h-[clamp(8rem,9.375vw,11.25rem)] w-full object-cover object-[50%_62%]"
                />
              </div>

              <nav aria-label="In this issue" className="bg-ink px-[clamp(1.25rem,1.56vw,1.875rem)] pt-[clamp(1.25rem,1.56vw,1.875rem)] pb-8">
                <p className="font-display text-[clamp(0.875rem,1.04vw,1.25rem)] text-sunbeam uppercase">In this issue</p>
                <ul className="mt-[clamp(0.5rem,0.5vw,0.6rem)]">
                  {issue.map((item) => (
                    <li key={item.title} className="flex items-center justify-between gap-4 border-b border-white/15 py-[clamp(0.75rem,1.15vw,1.375rem)] pr-[clamp(0.25rem,1.2vw,1.4rem)]">
                      <span className={`${serif.className} text-[clamp(1.0625rem,1.25vw,1.5rem)] leading-[1.33] font-bold text-white`}>{item.title}</span>
                      <span className={`font-display text-[clamp(0.75rem,0.83vw,1rem)] ${item.tone}`}>{item.page}</span>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </article>
          <span
            aria-hidden
            data-float="6"
            className={`col-start-1 row-start-1 -mt-[3.78%] -mr-[2%] grid aspect-square w-[max(6.5rem,13.85%)] rotate-[-12deg] place-items-center self-start justify-self-end rounded-full bg-blush text-center font-display text-[clamp(0.9375rem,1.67vw,2rem)] leading-[1.375] text-white lg:-mr-[5.42%] ${cardShadow}`}
          >
            <span>
              EXTRA!
              <br />
              EXTRA!
            </span>
          </span>
        </div>
      </section>

      {/* ── SEO content ────────────────────────────────────────────── */}
      <section aria-labelledby="seo-title" className="shell mt-[clamp(4rem,10.4vw,12.5rem)]">
        <SectionTitle
          eyebrow="SEO content"
          title={
            <span id="seo-title">
              Words that rank
              <br />
              (and read nicely)
            </span>
          }
        />
        <div className="mt-[clamp(2rem,2.8vw,3.375rem)] grid items-start gap-y-12 lg:grid-cols-[minmax(0,820fr)_minmax(0,694fr)] lg:gap-x-[3.85vw]">
          <article data-reveal className={`flex min-h-[clamp(16rem,26vw,31.25rem)] flex-col rounded-[clamp(0.75rem,0.83vw,1rem)] ${paper} p-[clamp(1.25rem,2.08vw,2.5rem)] ${cardShadow}`}>
            <p className={`${serif.className} text-[clamp(1.0625rem,1.25vw,1.5rem)] leading-[1.75] text-ink`}>
              Looking for the best <Kw tone="text-blush">specialty coffee</Kw> near you? Fifth Sip roasts <Kw tone="text-grape">single-origin beans</Kw> in-house every morning, pairs them with an{" "}
              <Kw tone="text-lagoon">all-day brunch</Kw> menu and serves the <Kw tone="text-blush">flat white</Kw> locals queue for. <Kw tone="text-grape">Order online</Kw>, book a table, or grab a bag of{" "}
              <Kw tone="text-lagoon">freshly roasted beans</Kw> to brew at home.
            </p>
            <p className="mt-auto pt-8 font-display text-[clamp(0.6875rem,0.73vw,0.875rem)] text-grape/70">6 keywords · readability: easy · 52 words</p>
          </article>
          <ul aria-label="Target keywords and monthly searches" data-reveal-stagger className="flex flex-wrap items-start gap-x-[clamp(0.75rem,0.83vw,1rem)] gap-y-[clamp(1.25rem,2.08vw,2.5rem)] lg:pt-2.5">
            {keywords.map((k) => (
              <li key={k.term} className={`rounded-[clamp(1rem,1.25vw,1.5rem)] px-[clamp(0.875rem,1.46vw,1.75rem)] pt-[clamp(0.75rem,0.83vw,1rem)] pb-[clamp(0.75rem,0.78vw,0.9375rem)] shadow-[0_10px_24px_rgb(34_1_40/0.12)] ${k.tone} ${k.tilt}`}>
                <span className={`block font-display leading-[1.27] ${k.size}`}>{k.term}</span>
                <span className="mt-1 block font-copy text-[clamp(0.75rem,0.73vw,0.875rem)] font-bold opacity-80">{k.volume}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul data-reveal-stagger className="mt-[clamp(4rem,12vw,14.375rem)] grid grid-cols-2 gap-[clamp(1.25rem,2.19vw,2.625rem)] lg:grid-cols-4">
          {stickies.map((s) => (
            <li key={s.label} className={`@container grid aspect-square rounded-[6px] ${s.tone} ${s.tilt} ${cardShadow}`}>
              <span aria-hidden className="col-start-1 row-start-1 -mt-[2.2cqw] h-[9.4cqw] w-[33.3cqw] self-start justify-self-center bg-white/60" />
              <p className="col-start-1 row-start-1 flex flex-col items-center self-start pt-[22.2cqw] text-center">
                <span className="font-pop text-[33.3cqw] leading-[38.9cqw]">{s.value}</span>
                <span className="mt-[8.3cqw] px-[8cqw] font-display text-[max(0.625rem,5.56cqw)] leading-[1.25] uppercase">{s.label}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </ContentFx>
  );
}

function Kw({ tone, children }: { tone: string; children: string }) {
  return <strong className={`font-bold underline decoration-[0.06em] underline-offset-[0.18em] ${tone}`}>{children}</strong>;
}

/** Figma hero desk: "Paper back" (381:44), "Draft paper" (381:63), three margin notes and the pencil. 1000 Figma px wide. */
function DraftDesk() {
  return (
    <div className="@container -ml-[15.5%] grid w-[140%] md:-ml-[4%] md:w-[115%] lg:-mr-[clamp(1.1rem,7.6vw,9.125rem)] lg:ml-0 lg:w-auto">
      {/* Paper behind: 660 × 800, Figma 5° → CSS -5deg. */}
      <div aria-hidden className={`${layer} mt-[-2.03%] ml-[31.36%] flex aspect-[660/800] w-[66%] rotate-[-5deg] flex-col gap-[2.6cqw] rounded-[0.8cqw] bg-[#F3ECFA] px-[6cqw] pt-[12cqw] ${paperShadow}`}>
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className="h-[1cqw] shrink-0 rounded-full bg-lav/35" />
        ))}
      </div>

      {/* The draft itself: 660 × 820, Figma -3° → CSS 3deg. */}
      <figure data-edit className={`${layer} mt-[1.67%] ml-[13.81%] grid aspect-[660/820] w-[66%] rotate-[3deg] overflow-hidden rounded-[0.8cqw] ${paper} ${paperShadow}`}>
        <span
          aria-hidden
          className="col-start-1 row-start-1 mt-[11cqw] h-[64.7cqw] self-start"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgb(63 183 199 / 0.18) 0 1px, transparent 1px 3.4cqw)" }}
        />
        <span aria-hidden className="col-start-1 row-start-1 ml-[5.6cqw] w-[0.2cqw] justify-self-start bg-blush/50" />
        <div className="col-start-1 row-start-1 flex flex-col self-start pt-[3cqw] pl-[8cqw]">
          <span className="font-copy text-[1.4cqw] font-medium text-ink/45">homepage_hero_v3.doc</span>
          <span className={`${serif.className} mt-[2.5cqw] w-[52cqw] text-[4.4cqw] leading-[5.2cqw] font-bold text-ink`}>Coffee that tastes like Saturday morning.</span>
          <span className={`${serif.className} mt-[2.6cqw] w-[50cqw] text-[2.2cqw] leading-[3.6cqw] text-ink`}>
            Fifth Sip{" "}
            <span data-strike="0.08em" className="text-[#8C8784] [box-decoration-break:slice]" style={strike("#F27793", "0.08em")}>
              is a leading provider of premium coffee solutions
            </span>{" "}
            <strong data-insert className="inline-block font-bold text-blush">
              the neighbourhood café
            </strong>{" "}
            where every cup is roasted in-house, poured with care and served with a smile. Come for the{" "}
            <strong className="font-bold text-grape underline decoration-[0.06em] underline-offset-[0.2em]">specialty coffee</strong>, stay for the brunch.
          </span>
          <span className="mt-[14cqw] font-display text-[1.6cqw] text-grape">¶&nbsp; Tone: warm · witty · local</span>
          <span className="mt-[1.6cqw] font-copy text-[1.6cqw] font-medium text-ink/60">Words: 42&nbsp; ·&nbsp; Reading level: easy&nbsp; ·&nbsp; SEO: ✓</span>
          <span aria-hidden className="mt-[4.7cqw] flex flex-col gap-[2cqw]">
            {[50, 42, 46].map((w) => (
              <span key={w} className="h-[1.4cqw] rounded-full bg-ink/8" style={{ width: `${w}cqw` }} />
            ))}
          </span>
        </div>
        <figcaption className="sr-only">A homepage draft with a red-pen edit: “a leading provider of premium coffee solutions” becomes “the neighbourhood café”.</figcaption>
      </figure>

      {/* Margin notes (Figma 381:93 / 95 / 97). */}
      <Note className="mt-[23.13%] ml-[62%] rotate-[-6deg] bg-blush lg:ml-[66.16%]">Too corporate! ✕</Note>
      <Note className="mt-[36.45%] ml-[68%] rotate-[4deg] bg-grape lg:ml-[73.84%]">Keyword ✓</Note>
      <Note className="-mt-[2%] ml-[16%] rotate-[6deg] bg-lagoon lg:mt-[7.1%] lg:-ml-[0.27%]">Punchier headline 🔥</Note>

      {/* Pencil: 420 × 36, Figma -35° → CSS 35deg. */}
      <span aria-hidden data-float="6" className={`${layer} mt-[89.72%] ml-[49.17%] w-[42%] rotate-[35deg]`}>
        <span className="flex h-[3.6cqw] drop-shadow-[0_1.2cqw_1.6cqw_rgb(34_1_40/0.25)]">
          <span className="w-[5cqw] rounded-l-[0.6cqw] bg-blush" />
          <span className="w-[1.4cqw] bg-[#C9C2CC]" />
          <span className="grow bg-sunbeam" />
          <span className="w-[4cqw] bg-[#F3D9B1] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
        </span>
      </span>
    </div>
  );
}

function Note({ className, children }: { className: string; children: string }) {
  return (
    <span
      aria-hidden
      className={`${layer} rounded-[1.4cqw] px-[1.6cqw] py-[1cqw] font-display text-[max(0.625rem,1.6cqw)] leading-none whitespace-nowrap text-white shadow-[0_0.8cqw_2cqw_rgb(34_1_40/0.15)] ${className}`}
    >
      {children}
    </span>
  );
}
