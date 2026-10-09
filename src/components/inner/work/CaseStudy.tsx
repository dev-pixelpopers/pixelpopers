import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/inner/Breadcrumb";
import { owners } from "@/lib/site-content";
import type { Project } from "@/lib/pages/work";
import { accentBg, cardShadow, wide } from "./tokens";

/*
  Case-study template — Figma frame 334:21 "05 — Case Study (Fifth Sip)".
  Every section reads its copy from the project record, so all case studies
  share this layout. Overlapping pieces (sticker and doodle on the cover)
  live in single-cell grids.
*/

const cell = "col-start-1 row-start-1";
const label = "font-haas text-[clamp(1.75rem,2.5vw,3rem)] leading-[1.08] uppercase";
const heading = "font-display text-[clamp(1.875rem,3.44vw,4.125rem)] leading-[1.18] text-grape uppercase";
const shell = "shell";

export function CaseHero({ project }: { project: Project }) {
  const p = project;
  const meta = [
    { k: "Client", v: p.client },
    { k: "Services", v: p.services.join(", ") },
    { k: "Year", v: String(p.year) },
    { k: "Timeline", v: p.timeline },
  ];

  return (
    <section aria-labelledby="case-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(36rem,52vw,62rem)] bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_24%_24%_at_86%_52%,rgb(159_201_204/0.5),transparent_75%)]"
      />

      <div className={`${shell} pt-[clamp(1rem,2.6vw,3.125rem)]`}>
        <Breadcrumb items={[{ label: "Work", href: "/work" }, { label: p.name }]} />
        <p data-reveal className="mt-[clamp(2rem,3.65vw,4.375rem)] font-haas text-[clamp(1.25rem,2.08vw,2.5rem)] leading-[1.1] text-blush-ink uppercase">
          {p.discipline}
        </p>
        <h1
          id="case-title"
          data-reveal
          className="-ml-[0.03em] font-display text-[clamp(3.25rem,11.46vw,13.75rem)] leading-[1.09] text-grape uppercase"
        >
          {p.name}
        </h1>

        <dl data-reveal-stagger className="mt-[clamp(2rem,3.125vw,3.75rem)] grid grid-cols-2 gap-x-[clamp(1rem,2.08vw,2.5rem)] gap-y-8 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.k} className="flex flex-col gap-[clamp(0.5rem,0.6vw,0.75rem)] border-t border-ink/20 pt-[clamp(1rem,1.25vw,1.5rem)]">
              <dt className="font-display text-micro text-blush-ink uppercase">{m.k}</dt>
              <dd className="font-copy text-copy font-medium text-ink">{m.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={`${wide} mt-[clamp(3rem,5.6vw,6.75rem)] grid grid-cols-1`}>
        <div
          className={`${cell} aspect-[1680/940] overflow-hidden rounded-[clamp(1.5rem,2.5vw,3rem)] ${cardShadow}`}
          style={{ backgroundColor: p.coverBg }}
        >
          <Image
            src={p.cover.src}
            alt={p.cover.alt}
            width={p.cover.w}
            height={p.cover.h}
            priority
            sizes="(min-width: 1920px) 1680px, 92vw"
            style={{ objectPosition: p.cover.position ?? "50% 50%" }}
            className="size-full object-cover"
          />
        </div>
        <p
          className={`${cell} relative -mt-[clamp(1rem,2.08vw,2.5rem)] -mr-[clamp(0rem,2.08vw,2.5rem)] -rotate-6 self-start justify-self-end rounded-full bg-sunbeam px-[clamp(1.25rem,2.3vw,2.75rem)] py-[clamp(0.75rem,1.46vw,1.75rem)] font-display text-[clamp(0.75rem,0.94vw,1.125rem)] leading-none text-ink uppercase max-sm:mr-2`}
        >
          {p.sticker}
        </p>
        <Image
          aria-hidden
          src="/icons/doodle-flower.svg"
          alt=""
          width={256}
          height={251}
          className={`${cell} relative -mr-[4.5%] -mb-[5%] hidden h-auto w-[12.7%] -rotate-[57deg] self-end justify-self-end md:block`}
        />
      </div>
    </section>
  );
}

export function Brief({ project }: { project: Project }) {
  const p = project;
  return (
    <section aria-label="The brief" className={`${shell} grid gap-12 md:grid-cols-2 md:gap-[clamp(2rem,6.25vw,7.5rem)]`}>
      <div data-reveal>
        <h2 className={`${label} text-blush-ink`}>The challenge</h2>
        <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[45rem] font-copy text-copy leading-[1.67] font-light text-ink">{p.intro.challenge}</p>
      </div>
      <div data-reveal>
        <h2 className={`${label} text-lagoon`}>The approach</h2>
        <p className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[45rem] font-copy text-copy leading-[1.67] font-light text-ink">{p.intro.approach}</p>
      </div>
    </section>
  );
}

export function BrandSystem({ project }: { project: Project }) {
  const { brand } = project;
  return (
    <section aria-labelledby="brand-system-title">
      <h2 id="brand-system-title" data-reveal className={`${shell} ${label} text-grape`}>
        The brand system
      </h2>
      <div className={`${wide} mt-[clamp(1.75rem,2.6vw,3rem)] grid gap-[clamp(1rem,1.56vw,1.875rem)] lg:grid-cols-[minmax(0,1000fr)_minmax(0,650fr)]`}>
        <Image
          data-reveal
          src={brand.detail.src}
          alt={brand.detail.alt}
          width={brand.detail.w}
          height={brand.detail.h}
          sizes="(min-width: 1920px) 1000px, (min-width: 1024px) 52vw, 92vw"
          style={{ objectPosition: brand.detail.position ?? "50% 50%" }}
          className={`aspect-[1000/720] size-full rounded-[clamp(1.25rem,2.08vw,2.5rem)] bg-white object-cover ${cardShadow}`}
        />
        <div className="grid content-between gap-[clamp(1rem,1.04vw,1.25rem)]">
          <ul data-reveal-stagger aria-label="Colour palette" className="grid grid-cols-3 gap-[clamp(0.375rem,0.52vw,0.625rem)]">
            {brand.swatches.map((s) => (
              <li
                key={s.name}
                className={`flex aspect-[210/340] flex-col justify-end rounded-[clamp(1.25rem,1.67vw,2rem)] p-[clamp(1rem,1.25vw,1.5rem)] pb-[clamp(2rem,3.4vw,4rem)] ${cardShadow} ${s.dark ? "text-ink" : "text-white"}`}
                style={{ backgroundColor: s.hex }}
              >
                <span className="font-display text-[clamp(1rem,1.15vw,1.375rem)] uppercase">{s.name}</span>
                <span className="mt-1 font-copy text-[clamp(0.8125rem,0.94vw,1.125rem)] font-medium opacity-80">{s.hex}</span>
              </li>
            ))}
          </ul>
          <div
            data-reveal
            className={`flex aspect-[650/360] flex-col justify-between rounded-[clamp(1.25rem,1.67vw,2rem)] bg-white px-[clamp(1.25rem,1.67vw,2rem)] pb-[clamp(1.5rem,2vw,2.5rem)] max-sm:aspect-auto max-sm:gap-4 max-sm:pt-4 ${cardShadow}`}
          >
            <div className="flex flex-wrap items-center gap-x-[clamp(1rem,1.5vw,1.75rem)]">
              <span aria-hidden className="font-pop text-[clamp(5rem,10.4vw,12.5rem)] leading-[1.1]" style={{ color: brand.swatches[0].hex }}>
                Aa
              </span>
              <p className="font-copy text-small leading-[1.6] text-ink">
                {brand.type.display}
                <br />
                {brand.type.body}
              </p>
            </div>
            <p aria-hidden className="font-display text-[clamp(0.8125rem,1.04vw,1.25rem)] break-all text-ink/60">
              ABCDEFGHIJKLM 0123456789
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Results({ project }: { project: Project }) {
  return (
    <section aria-labelledby="results-title" className={wide}>
      <div className="overflow-hidden rounded-[clamp(1.5rem,2.5vw,3rem)] bg-lagoon bg-[radial-gradient(ellipse_22%_60%_at_85%_20%,rgb(255_255_255/0.3),transparent_75%)] px-[clamp(1.5rem,4.17vw,5rem)] pt-[clamp(2rem,3.65vw,4.375rem)] pb-[clamp(2.5rem,4.4vw,5.25rem)]">
        <h2 id="results-title" data-reveal className="font-haas text-[clamp(1.5rem,2.08vw,2.5rem)] leading-[1.1] text-white uppercase">
          The results
        </h2>
        <dl data-reveal-stagger className="grid gap-y-6 sm:grid-cols-[540fr_540fr_440fr]">
          {project.results.map((r, i) => (
            <div key={r.label} className="flex flex-col-reverse">
              <dt className="pl-1 font-copy text-copy font-medium text-white">{r.label}</dt>
              <dd className={`font-pop text-[clamp(3.5rem,7.2vw,8.5rem)] leading-[1.12] 2xl:text-[min(8.85vw,10.625rem)] ${i === 1 ? "text-sunbeam" : "text-white"}`}>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function PullQuote({ project }: { project: Project }) {
  const { quote } = project;
  return (
    <figure className={`${shell} grid gap-x-[clamp(1rem,4.6vw,5.5rem)] sm:grid-cols-[auto_minmax(0,1fr)]`}>
      <span aria-hidden className="font-pop text-[clamp(7rem,15.6vw,18.75rem)] leading-none text-blush-ink max-sm:-mb-8">
        “
      </span>
      <div className="sm:pt-[clamp(1.5rem,4.17vw,5rem)]">
        <blockquote data-reveal className="font-display text-[clamp(1.5rem,2.81vw,3.375rem)] leading-[1.33] text-grape uppercase">
          <p>{quote.text}</p>
        </blockquote>
        <figcaption className="mt-[clamp(1.5rem,5.2vw,6.25rem)] flex items-center gap-6">
          <span aria-hidden className="size-[clamp(3.5rem,4.17vw,5rem)] shrink-0 rounded-full bg-sunbeam" />
          <span className="flex flex-col gap-1.5">
            <span className="font-copy text-[clamp(1.0625rem,1.15vw,1.375rem)] font-bold text-ink">{quote.author}</span>
            <span className="font-copy text-[clamp(0.9375rem,0.94vw,1.125rem)] text-ink/60">{quote.since}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

/** Figma "Long-form · The full story": sticky intro column beside challenge / approach / results, then the client's words. */
export function FullStory({ project }: { project: Project }) {
  const p = project;
  const blocks = [
    { title: "The challenge", body: p.story.challenge },
    { title: "Our approach", body: p.story.approach },
    { title: "The results", body: p.story.results },
  ];
  return (
    <section aria-labelledby="full-story-title" className={`${shell} flex flex-col gap-[clamp(3rem,4.17vw,5rem)]`}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,620fr)_minmax(0,848fr)] lg:gap-[clamp(3rem,6.25vw,7.5rem)]">
        <div data-reveal className="flex flex-col gap-[clamp(1rem,1.46vw,1.75rem)] lg:sticky lg:top-10 lg:self-start">
          <p className="font-haas text-eyebrow leading-none text-blush-ink uppercase">The full story</p>
          <h2 id="full-story-title" className="font-display text-h3 leading-[1.16] text-grape uppercase">
            How {p.name} found its {p.slug === "fifth-sip" ? "ritual" : "pop"}
          </h2>
          <p className="font-copy text-lead leading-[1.53] text-ink">{p.story.lead}</p>
        </div>
        <div className="flex flex-col gap-[clamp(2.25rem,2.9vw,3.5rem)]">
          {blocks.map((b) => (
            <div key={b.title} data-reveal className="flex flex-col gap-5">
              <h3 className="font-display text-[clamp(1.5rem,2.08vw,2.5rem)] leading-[1.2] text-grape uppercase">{b.title}</h3>
              <p className="font-copy text-copy leading-[1.67] font-light text-ink/85">{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      <figure data-reveal className="flex flex-col gap-6 rounded-3xl bg-white p-[clamp(1.75rem,2.9vw,3.5rem)]">
        <figcaption className="order-first font-haas text-[clamp(1rem,1.25vw,1.5rem)] leading-none text-blush-ink uppercase">In the client’s words</figcaption>
        <blockquote className="font-copy text-lead leading-[1.53] text-ink">
          <p>{p.story.clientQuote}</p>
        </blockquote>
        <p className="font-copy text-small font-bold text-ink/70">
          {p.quote.author} — {p.quote.since.toLowerCase()}
        </p>
      </figure>
    </section>
  );
}

export function Gallery({ project }: { project: Project }) {
  const [big, a, b] = project.gallery;
  const img = (g: Project["gallery"][number], cls: string, sizes: string) => (
    <Image
      src={g.src}
      alt={g.alt}
      width={g.w}
      height={g.h}
      sizes={sizes}
      style={{ objectPosition: g.position ?? "50% 50%" }}
      className={`size-full rounded-[clamp(1.25rem,1.875vw,2.25rem)] bg-white object-cover ${cardShadow} ${cls}`}
    />
  );
  return (
    <section aria-labelledby="gallery-title">
      <div data-reveal className={shell}>
        <p className={`${label} text-blush-ink`}>The gallery</p>
        <h2 id="gallery-title" className={`mt-[clamp(0.5rem,0.73vw,0.875rem)] ${heading}`}>
          {project.galleryHeading}
        </h2>
      </div>
      <div data-reveal-stagger className={`${wide} mt-[clamp(1.75rem,2.9vw,3.5rem)] grid gap-[clamp(1rem,1.56vw,1.875rem)] md:grid-cols-[minmax(0,1000fr)_minmax(0,650fr)] md:grid-rows-2`}>
        {img(big, "aspect-[1000/660] md:row-span-2", "(min-width: 1920px) 1000px, (min-width: 768px) 52vw, 92vw")}
        {img(a, "aspect-[650/315]", "(min-width: 1920px) 650px, (min-width: 768px) 34vw, 92vw")}
        {img(b, "aspect-[650/315]", "(min-width: 1920px) 650px, (min-width: 768px) 34vw, 92vw")}
      </div>
    </section>
  );
}

export function Delivered({ project }: { project: Project }) {
  const { delivered } = project;
  return (
    <section aria-labelledby="delivered-title" className={`${shell} grid gap-8 lg:grid-cols-[minmax(0,560fr)_minmax(0,980fr)] lg:gap-[clamp(2rem,4.9vw,5.875rem)]`}>
      <div data-reveal>
        <h2 id="delivered-title" className={`${label} text-blush-ink`}>
          What we delivered
        </h2>
        <p className="mt-[clamp(1rem,1.46vw,1.75rem)] font-copy text-body leading-[1.64] font-light text-ink">{delivered.intro}</p>
      </div>
      <ul data-reveal-stagger className="flex flex-wrap content-start gap-x-3 gap-y-[clamp(0.75rem,1.2vw,1.4375rem)]">
        {delivered.items.map((d) => (
          <li key={d} className="rounded-full bg-white px-[clamp(1rem,1.25vw,1.5rem)] py-3 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-none font-medium text-grape">
            {d}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Timeline({ project }: { project: Project }) {
  const weeks = Math.max(...project.phases.map((ph) => Math.ceil(ph.end)));
  const cols = Array.from({ length: weeks }, (_, i) => i + 1);
  const lines = {
    backgroundImage: `repeating-linear-gradient(90deg, rgb(34 1 40 / 0.08) 0 1px, transparent 1px calc(100% / ${weeks}))`,
  };
  return (
    <section aria-labelledby="timeline-title">
      <div data-reveal className={shell}>
        <p className={`${label} text-blush-ink`}>The timeline</p>
        <h2 id="timeline-title" className={`mt-[clamp(0.5rem,0.73vw,0.875rem)] ${heading}`}>
          {weeks} weeks, start to pop
        </h2>
      </div>
      <div className={`${wide} mt-[clamp(1.75rem,2.9vw,3.5rem)]`}>
        <div data-reveal className={`overflow-x-auto rounded-[clamp(1.25rem,1.875vw,2.25rem)] bg-white ${cardShadow}`}>
          <div className="grid min-w-[40rem] grid-cols-[minmax(9rem,250fr)_minmax(0,1320fr)] gap-x-[clamp(0.75rem,2.08vw,2.5rem)] px-[clamp(1rem,2.08vw,2.5rem)] pt-[clamp(1.25rem,1.67vw,2rem)] pb-[clamp(1.25rem,1.56vw,1.875rem)]">
            <span aria-hidden />
            <div aria-hidden className="grid" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
              {cols.map((w) => (
                <span key={w} className="pl-[0.6rem] font-display text-[clamp(0.6875rem,0.78vw,0.9375rem)] text-ink/50 uppercase">
                  Week {w}
                </span>
              ))}
            </div>
            <ol className="contents">
              {project.phases.map((ph) => (
                <li key={ph.label} className="contents">
                  <span className="flex items-center py-2.5 font-copy text-[clamp(0.875rem,0.99vw,1.1875rem)] font-medium text-ink">{ph.label}</span>
                  <span className="flex items-center py-2.5" style={lines}>
                    <span
                      className={`block h-[clamp(1.75rem,2.3vw,2.75rem)] rounded-full ${accentBg[ph.color]}`}
                      style={{ marginLeft: `${(ph.start / weeks) * 100}%`, width: `${((ph.end - ph.start) / weeks) * 100}%` }}
                    >
                      <span className="sr-only">
                        Week {Math.floor(ph.start) + 1} to week {Math.ceil(ph.end)}
                      </span>
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Team({ project }: { project: Project }) {
  return (
    <section aria-labelledby="team-title" className={shell}>
      <h2 id="team-title" data-reveal className={`${label} text-blush-ink`}>
        The team behind it
      </h2>
      <ul data-reveal-stagger className="mt-[clamp(1.5rem,2.08vw,2.5rem)] flex flex-wrap gap-[clamp(1rem,2.08vw,2.5rem)]">
        {project.team.map((m) => {
          const o = owners.find((x) => x.name === m.name);
          return (
            <li
              key={m.name}
              className={`flex w-full items-center gap-[clamp(1rem,1.04vw,1.25rem)] rounded-full bg-white p-[clamp(0.75rem,1.04vw,1.25rem)] pr-8 sm:w-[clamp(18rem,25vw,30rem)] ${cardShadow}`}
            >
              <span className={`grid size-[clamp(4rem,5.2vw,6.25rem)] shrink-0 place-items-center overflow-hidden rounded-full ${accentBg[o?.accent ?? "blush"]}`}>
                {o ? <Image src={o.avatar} alt={`Portrait of ${o.name}`} width={200} height={200} className="size-full object-cover" /> : null}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="font-display text-[clamp(1.125rem,1.35vw,1.625rem)] leading-tight text-grape uppercase">{m.name}</span>
                <span className="font-copy text-[clamp(0.9375rem,0.94vw,1.125rem)] text-ink/70">{m.role}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function NextProject({ next }: { next: Project }) {
  return (
    <section aria-labelledby="next-title" className={wide}>
      <Link
        href={`/work/${next.slug}`}
        className="group grid overflow-hidden rounded-[clamp(1.5rem,2.5vw,3rem)] bg-[#22062b] bg-[radial-gradient(ellipse_30%_60%_at_8%_15%,rgb(106_75_151/0.75),transparent_75%)] md:grid-cols-2"
      >
        <div className="flex flex-col justify-center px-[clamp(1.5rem,4.17vw,5rem)] py-[clamp(2.5rem,4.7vw,5.625rem)]">
          <p className="font-display text-[clamp(0.875rem,1.04vw,1.25rem)] text-sunbeam uppercase">Next project</p>
          <h2 id="next-title" className="mt-[clamp(1rem,1.9vw,2.25rem)] font-display text-[clamp(2.75rem,5.73vw,6.875rem)] leading-[1.09] text-white uppercase">
            {next.name}
          </h2>
          <div className="mt-6 flex items-end justify-between gap-6">
            <p className="font-copy text-[clamp(1rem,1.15vw,1.375rem)] font-medium text-white/75">{next.tagline}</p>
            <span
              aria-hidden
              className="grid size-[clamp(4rem,6.25vw,7.5rem)] shrink-0 place-items-center rounded-full bg-blush font-copy text-[clamp(1.75rem,2.5vw,3rem)] font-bold text-white transition-transform duration-300 group-hover:translate-x-2"
            >
              →
            </span>
          </div>
        </div>
        <Image
          src={next.cover.src}
          alt={next.cover.alt}
          width={next.cover.w}
          height={next.cover.h}
          sizes="(min-width: 1920px) 840px, (min-width: 768px) 46vw, 92vw"
          style={{ objectPosition: next.cover.position ?? "50% 50%" }}
          className="aspect-[840/560] size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>
    </section>
  );
}
