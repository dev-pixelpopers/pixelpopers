import Image from "@/components/inner/services/ServiceImage";
import type { CSSProperties } from "react";
import Breadcrumb from "@/components/inner/Breadcrumb";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import { serif } from "@/lib/inner-fonts";
import type { ServiceDetail } from "@/lib/service-content";
import ContentFx from "./ContentFx";
import HeroSubheading from "@/components/inner/service/HeroSubheading";
import SectionText from "@/components/inner/service/SectionText";
import { contentCopy, type ContentCopy } from "./copy";

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

/* Looks by position; every word on this page comes from copy.ts / the CMS (contentCopy). */
const sliderLooks = [
  { fill: "bg-blush", ring: "border-blush" },
  { fill: "bg-lagoon", ring: "border-lagoon" },
  { fill: "bg-grape", ring: "border-grape" },
  { fill: "bg-sunbeam", ring: "border-sunbeam" },
];

const issueTones = ["text-blush-ink", "text-lagoon", "text-sunbeam", "text-blush-ink", "text-lagoon", "text-lav", "text-sunbeam", "text-blush-ink"];

const keywordLooks = [
  { tone: "bg-blush text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.9375rem,1.51vw,1.8125rem)]" },
  { tone: "bg-lagoon text-white", tilt: "rotate-[-3deg]", size: "text-[clamp(0.875rem,1.25vw,1.5rem)]" },
  { tone: "bg-grape text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.875rem,1.33vw,1.59375rem)]" },
  { tone: "bg-sunbeam text-ink", tilt: "rotate-[-3deg]", size: "text-[clamp(0.8125rem,1.06vw,1.275rem)]" },
  { tone: "bg-blush text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.8125rem,1.06vw,1.275rem)]" },
  { tone: "bg-lagoon text-white", tilt: "rotate-[-3deg]", size: "text-[clamp(0.75rem,0.97vw,1.17rem)]" },
  { tone: "bg-grape text-white", tilt: "rotate-[3deg]", size: "text-[clamp(0.75rem,0.97vw,1.17rem)]" },
];

const stickyLooks = [
  { tone: "bg-sunbeam text-ink", tilt: "rotate-[4deg]" },
  { tone: "bg-blush text-white", tilt: "rotate-[-3deg]" },
  { tone: "bg-lagoon text-white", tilt: "rotate-[2deg]" },
  { tone: "bg-lav text-ink", tilt: "rotate-[-4deg]" },
];

const keywordTones = ["text-blush-ink", "text-grape", "text-lagoon"];

/** Text with [[keywords]] marked: the marked words are highlighted, in rotating colours. */
function withKeywords(text: string) {
  return text.split(/(\[\[[^\]]+\]\])/).map((part, i) => {
    const m = part.match(/^\[\[([^\]]+)\]\]$/);
    return m ? (
      <Kw key={i} tone={keywordTones[Math.floor(i / 2) % keywordTones.length]}>
        {m[1]}
      </Kw>
    ) : (
      part
    );
  });
}

export default function Sections({ service }: { service: ServiceDetail }) {
  const [l1, l2, ...rest] = service.heroLines;
  // Extra lines from the CMS join the last line rather than disappearing.
  const l3 = rest.join(" ");
  // The design sections' words (Services → Content Writing → Page sections in the CMS).
  const copy = contentCopy(service);

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
              <span className="block font-display text-[clamp(2.75rem,6.25vw,7.5rem)] leading-[1.275] text-blush-ink">{l1}</span>
              <span className="-mt-[1.2vw] block font-haas text-[clamp(3.25rem,7.81vw,9.375rem)] leading-[1.087] tracking-[-0.05em] text-grape">{l2}</span>
              <span className="mt-[0.89vw] flex items-start gap-[0.52vw]">
                <span className="font-display text-[clamp(1.75rem,4.17vw,5rem)] leading-[1.275] text-lagoon">{l3}</span>
                <span aria-hidden data-caret className="mt-[0.52vw] h-[1.05em] w-[max(3px,0.52vw)] shrink-0 bg-blush text-[clamp(1.75rem,4.17vw,5rem)]" />
              </span>
            </h1>
            <HeroSubheading text={service.heroSubheading} />
            <p className="mt-[clamp(1.25rem,1.98vw,2.375rem)] max-w-[35rem] font-copy text-body leading-[1.64] font-light">{service.heroIntro}</p>
            <PopButton href="/contact" label={service.heroCta} className="mt-[clamp(1.75rem,3.54vw,4.25rem)] [&>span:last-child]:text-ink" />
          </div>

          {/* Clips the oversized mobile desk at the viewport edge (the shell padding is undone, then re-applied). */}
          <div className="-mx-[clamp(1.25rem,8.65vw,10.375rem)] overflow-x-clip px-[clamp(1.25rem,8.65vw,10.375rem)] lg:mx-0 lg:overflow-x-visible lg:px-0">
            <DraftDesk copy={copy.hero} />
          </div>
        </div>
      </section>

      {/* ── The rewrite (before / after) ───────────────────────────── */}
      <section aria-labelledby="rewrite-title" className="shell mt-[clamp(4rem,9.74vw,11.75rem)]">
        <SectionTitle align="center" eyebrow={copy.rewrite.eyebrow} title={<span id="rewrite-title" className="whitespace-pre-line">{copy.rewrite.heading}</span>} />
        <SectionText text={copy.rewrite.text} center />
        <div className={`grid ${headingGap}`}>
          <div className="col-start-1 row-start-1 grid gap-y-[7.5rem] lg:grid-cols-2 lg:gap-x-[3.54vw]">
            <article data-edit data-reveal className="flex min-h-[clamp(18rem,23.96vw,28.75rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] bg-[#E6E0DD] p-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(2rem,3.2vw,3.875rem)]">
              <h3 className="grid h-[clamp(2.125rem,2.08vw,2.5rem)] w-[clamp(7.5rem,7.29vw,8.75rem)] place-items-center rounded-full bg-white font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-[#8C8784]">
                {copy.rewrite.beforeLabel}
              </h3>
              <p className="mt-[clamp(1.5rem,2.08vw,2.5rem)] font-copy text-[clamp(1.25rem,1.67vw,2rem)] leading-[1.44] text-[#8C8784]">
                <span data-strike="0.07em" className="[box-decoration-break:slice]" style={strike("#8C8784", "0.07em")}>
                  {copy.rewrite.before}
                </span>
              </p>
              <p className="mt-auto pt-6 font-copy text-[clamp(0.875rem,0.885vw,1.0625rem)] font-medium whitespace-pre-wrap text-[#8C8784]">{copy.rewrite.beforeNote}</p>
            </article>
            <article data-reveal className={`flex min-h-[clamp(18rem,23.96vw,28.75rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] bg-blush p-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(2rem,3.2vw,3.875rem)] text-white ${paperShadow}`}>
              <h3 className="grid h-[clamp(2.125rem,2.08vw,2.5rem)] w-[clamp(7.5rem,7.29vw,8.75rem)] place-items-center rounded-full bg-white font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-blush-deep">
                {copy.rewrite.afterLabel}
              </h3>
              <p className="mt-[clamp(1.5rem,2.08vw,2.5rem)] max-w-[34rem] font-display text-[clamp(1.75rem,2.71vw,3.25rem)] leading-[1.19] uppercase">{copy.rewrite.after}</p>
              <p className="mt-auto pt-6 font-copy text-[clamp(0.875rem,0.885vw,1.0625rem)] font-medium whitespace-pre-wrap">{copy.rewrite.afterNote}</p>
            </article>
          </div>
          <span
            aria-hidden
            data-float="6"
            className={`col-start-1 row-start-1 grid size-[clamp(6.5rem,9.375vw,11.25rem)] rotate-[10deg] place-items-center place-self-center rounded-full bg-sunbeam text-center font-display text-[clamp(1rem,1.35vw,1.625rem)] leading-[1.38] text-ink ${paperShadow}`}
          >
            <span className="whitespace-pre-line">{copy.rewrite.sticker}</span>
          </span>
        </div>
      </section>

      {/* ── Tone of voice sliders ──────────────────────────────────── */}
      <section aria-labelledby="tone-title" className="shell mt-[clamp(4rem,9.375vw,11.25rem)] grid items-start gap-y-10 lg:grid-cols-[minmax(0,648fr)_minmax(0,940fr)]">
        <div>
          <SectionTitle
            eyebrow={copy.tone.eyebrow}
            title={
              <span id="tone-title" className="whitespace-pre-line">
                {copy.tone.heading}
              </span>
            }
          />
          {copy.tone.text ? (
            <p data-reveal className="mt-[clamp(1.25rem,1.98vw,2.375rem)] max-w-[32.5rem] font-copy text-body leading-[1.64] font-light whitespace-pre-line">
              {copy.tone.text}
            </p>
          ) : null}
        </div>
        <div data-reveal className={`rounded-[clamp(1.5rem,1.875vw,2.25rem)] bg-white px-[clamp(1.25rem,2.5vw,3rem)] pt-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(2rem,3.9vw,4.75rem)] ${cardShadow}`}>
          <h3 className="font-display text-[clamp(0.75rem,0.83vw,1rem)] text-grape uppercase">{copy.tone.profile}</h3>
          <ul className="mt-[clamp(1.75rem,2.6vw,3.125rem)] flex flex-col gap-[clamp(1.75rem,2.3vw,2.75rem)]">
            {copy.tone.sliders.map((s, i) => {
              const look = sliderLooks[i % sliderLooks.length];
              const value = Math.max(0, Math.min(100, parseInt(s.value, 10) || 0));
              return (
              <li key={i} data-slider={value} style={{ "--v": value } as CSSProperties}>
                <p className="flex justify-between font-copy text-[clamp(0.9375rem,1.04vw,1.25rem)] font-bold">
                  <span className="text-ink/60">{s.from}</span>
                  <span className="sr-only">{copy.tone.toWord}</span>
                  <span className="text-ink">{s.to}</span>
                  <span className="sr-only">: {value}{copy.tone.ofTheWay}</span>
                </p>
                <div aria-hidden className="mt-[clamp(0.5rem,0.68vw,0.8125rem)] grid h-[clamp(1.75rem,2.08vw,2.5rem)] items-center">
                  <span className="col-start-1 row-start-1 h-[clamp(0.625rem,0.73vw,0.875rem)] rounded-full bg-[#D9D2DC]/60" />
                  <span className={`col-start-1 row-start-1 h-[clamp(0.625rem,0.73vw,0.875rem)] justify-self-start rounded-full ${look.fill}`} style={{ width: "calc(var(--v) * 1%)" }} />
                  <span
                    className={`col-start-1 row-start-1 aspect-square h-full justify-self-start rounded-full border-[clamp(4px,0.31vw,6px)] bg-white ${look.ring}`}
                    style={{ marginLeft: "calc(var(--v) * 1% - clamp(0.875rem, 1.04vw, 1.25rem))" }}
                  />
                </div>
                <span aria-hidden className="flex justify-between">
                  {Array.from({ length: 11 }, (_, i) => (
                    <span key={i} className="h-2 w-0.5 bg-ink/15" />
                  ))}
                </span>
              </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── The Poppin' Post ───────────────────────────────────────── */}
      <section aria-labelledby="post-title" className="shell mt-[clamp(3.5rem,8.3vw,10rem)]">
        <div className="grid">
          <article data-reveal className={`col-start-1 row-start-1 rotate-[1deg] rounded-[6px] border-[3px] border-ink ${paper} px-[clamp(1rem,2.08vw,2.5rem)] pt-[clamp(1rem,1.56vw,1.875rem)] pb-[clamp(1.25rem,2.08vw,2.5rem)] ${cardShadow}`}>
            <p className="flex flex-wrap justify-between gap-x-6 gap-y-1 font-display text-[clamp(0.5625rem,0.73vw,0.875rem)] text-ink/60 uppercase lg:pr-[6.15vw]">
              <span className="whitespace-pre-wrap">{copy.post.masthead}</span>
              <span>{copy.post.weather}</span>
            </p>
            <h2 id="post-title" className={`${serif.className} mt-[clamp(0.25rem,0.42vw,0.5rem)] text-center text-[clamp(2.25rem,6.25vw,7.5rem)] leading-[1.3] font-black text-ink`}>
              {copy.post.title}
            </h2>
            <span aria-hidden className="block h-[3px] bg-ink lg:h-1" />
            <span aria-hidden className="mt-1.5 block h-px bg-ink" />

            <div className="mt-[clamp(1.25rem,1.3vw,1.5625rem)] grid gap-x-[1.46vw] gap-y-8 lg:grid-cols-[minmax(0,1060fr)_minmax(0,420fr)]">
              <div className="flex flex-col">
                <h3 className={`${serif.className} text-[clamp(1.375rem,2.6vw,3.125rem)] leading-[1.16] font-bold text-ink`}>{copy.post.headline}</h3>
                <p className={`${serif.className} mt-[clamp(0.75rem,1.46vw,1.75rem)] text-[clamp(1rem,1.25vw,1.5rem)] text-blush-ink`}>{copy.post.standfirst}</p>
                <div className="mt-[clamp(1rem,1.46vw,1.75rem)] grid gap-y-4 md:min-h-[19.8vw] md:grid-cols-3 md:divide-x md:divide-ink/30">
                  {copy.post.columns.map(({ text }, i) => (
                    <p key={i} className={`${serif.className} text-[clamp(0.9375rem,0.94vw,1.125rem)] leading-[1.67] text-ink md:px-[0.78vw] md:first:pl-0 md:last:pr-0`}>
                      {text}
                    </p>
                  ))}
                </div>
                <Image
                  slot="post-photo"
                  src="/assets/inner/writing.webp"
                  alt={copy.post.photoAlt}
                  width={698}
                  height={611}
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className="mt-[clamp(1rem,1.04vw,1.25rem)] h-[clamp(8rem,9.375vw,11.25rem)] w-full object-cover object-[50%_62%]"
                />
              </div>

              <nav aria-label={copy.post.issueTitle} className="bg-ink px-[clamp(1.25rem,1.56vw,1.875rem)] pt-[clamp(1.25rem,1.56vw,1.875rem)] pb-8">
                <p className="font-display text-[clamp(0.875rem,1.04vw,1.25rem)] text-sunbeam uppercase">{copy.post.issueTitle}</p>
                <ul className="mt-[clamp(0.5rem,0.5vw,0.6rem)]">
                  {copy.post.issue.map((item, i) => (
                    <li key={i} className="flex items-center justify-between gap-4 border-b border-white/15 py-[clamp(0.75rem,1.15vw,1.375rem)] pr-[clamp(0.25rem,1.2vw,1.4rem)]">
                      <span className={`${serif.className} text-[clamp(1.0625rem,1.25vw,1.5rem)] leading-[1.33] font-bold text-white`}>{item.title}</span>
                      <span className={`font-display text-[clamp(0.75rem,0.83vw,1rem)] ${issueTones[i % issueTones.length]}`}>{item.page}</span>
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
            <span className="whitespace-pre-line">{copy.post.sticker}</span>
          </span>
        </div>
      </section>

      {/* ── SEO content ────────────────────────────────────────────── */}
      <section aria-labelledby="seo-title" className="shell mt-[clamp(4rem,10.4vw,12.5rem)]">
        <SectionTitle
          eyebrow={copy.seo.eyebrow}
          title={
            <span id="seo-title" className="whitespace-pre-line">
              {copy.seo.heading}
            </span>
          }
        />
        <SectionText text={copy.seo.text} />
        <div className="mt-[clamp(2rem,2.8vw,3.375rem)] grid items-start gap-y-12 lg:grid-cols-[minmax(0,820fr)_minmax(0,694fr)] lg:gap-x-[3.85vw]">
          <article data-reveal className={`flex min-h-[clamp(16rem,26vw,31.25rem)] flex-col rounded-[clamp(0.75rem,0.83vw,1rem)] ${paper} p-[clamp(1.25rem,2.08vw,2.5rem)] ${cardShadow}`}>
            <p className={`${serif.className} text-[clamp(1.0625rem,1.25vw,1.5rem)] leading-[1.75] text-ink`}>
              {withKeywords(copy.seo.sample)}
            </p>
            <p className="mt-auto pt-8 font-display text-[clamp(0.6875rem,0.73vw,0.875rem)] text-grape/70">{copy.seo.sampleStats}</p>
          </article>
          <ul aria-label={copy.seo.keywordsLabel} data-reveal-stagger className="flex flex-wrap items-start gap-x-[clamp(0.75rem,0.83vw,1rem)] gap-y-[clamp(1.25rem,2.08vw,2.5rem)] lg:pt-2.5">
            {copy.seo.keywords.map((k, i) => {
              const look = keywordLooks[i % keywordLooks.length];
              return (
              <li key={i} className={`rounded-[clamp(1rem,1.25vw,1.5rem)] px-[clamp(0.875rem,1.46vw,1.75rem)] pt-[clamp(0.75rem,0.83vw,1rem)] pb-[clamp(0.75rem,0.78vw,0.9375rem)] shadow-[0_10px_24px_rgb(34_1_40/0.12)] ${look.tone} ${look.tilt}`}>
                <span className={`block font-display leading-[1.27] ${look.size}`}>{k.term}</span>
                <span className="mt-1 block font-copy text-[clamp(0.75rem,0.73vw,0.875rem)] font-bold opacity-80">{k.volume}</span>
              </li>
              );
            })}
          </ul>
        </div>

        <ul data-reveal-stagger className="mt-[clamp(4rem,12vw,14.375rem)] grid grid-cols-2 gap-[clamp(1.25rem,2.19vw,2.625rem)] lg:grid-cols-4">
          {copy.seo.stickies.map((s, i) => (
            <li key={i} className={`@container grid aspect-square rounded-[6px] ${stickyLooks[i % stickyLooks.length].tone} ${stickyLooks[i % stickyLooks.length].tilt} ${cardShadow}`}>
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
function DraftDesk({ copy }: { copy: ContentCopy["hero"] }) {
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
          <span className="font-copy text-[1.4cqw] font-medium text-ink/45">{copy.file}</span>
          <span className={`${serif.className} mt-[2.5cqw] w-[52cqw] text-[4.4cqw] leading-[5.2cqw] font-bold text-ink`}>{copy.headline}</span>
          <span className={`${serif.className} mt-[2.6cqw] w-[50cqw] text-[2.2cqw] leading-[3.6cqw] text-ink`}>
            {copy.lead}{" "}
            <span data-strike="0.08em" className="text-[#8C8784] [box-decoration-break:slice]" style={strike("#F27793", "0.08em")}>
              {copy.struck}
            </span>{" "}
            <strong data-insert className="inline-block font-bold text-blush-ink">
              {copy.inserted}
            </strong>{" "}
            {copy.body}{" "}
            <strong className="font-bold text-grape underline decoration-[0.06em] underline-offset-[0.2em]">{copy.keyword}</strong>
            {copy.ending}
          </span>
          <span className="mt-[14cqw] font-display text-[1.6cqw] whitespace-pre-wrap text-grape">{copy.tone}</span>
          <span className="mt-[1.6cqw] font-copy text-[1.6cqw] font-medium whitespace-pre-wrap text-ink/60">{copy.stats}</span>
          <span aria-hidden className="mt-[4.7cqw] flex flex-col gap-[2cqw]">
            {[50, 42, 46].map((w) => (
              <span key={w} className="h-[1.4cqw] rounded-full bg-ink/8" style={{ width: `${w}cqw` }} />
            ))}
          </span>
        </div>
        <figcaption className="sr-only">{copy.caption}</figcaption>
      </figure>

      {/* Margin notes (Figma 381:93 / 95 / 97). */}
      <Note className="mt-[23.13%] ml-[62%] rotate-[-6deg] bg-blush lg:ml-[66.16%]">{copy.notes[0].note}</Note>
      <Note className="mt-[36.45%] ml-[68%] rotate-[4deg] bg-grape lg:ml-[73.84%]">{copy.notes[1].note}</Note>
      <Note className="-mt-[2%] ml-[16%] rotate-[6deg] bg-lagoon lg:mt-[7.1%] lg:-ml-[0.27%]">{copy.notes[2].note}</Note>

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
