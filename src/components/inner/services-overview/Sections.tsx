import Link from "next/link";
import PopButton from "@/components/ui/PopButton";
import SectionTitle from "@/components/inner/SectionTitle";
import { serviceDetails } from "@/lib/service-content";
import {
  comparison,
  explained,
  industries,
  marquee,
  models,
  serviceRows,
  servicesCta,
  servicesFaq,
  servicesStats,
  type Tone,
} from "@/lib/pages/services";

const toneBg: Record<Tone, string> = {
  blush: "bg-blush text-white",
  grape: "bg-grape text-white",
  lagoon: "bg-lagoon text-white",
  sunbeam: "bg-sunbeam text-ink",
};
const toneText: Record<Tone, string> = {
  blush: "text-blush",
  grape: "text-grape",
  lagoon: "text-lagoon",
  sunbeam: "text-sunbeam",
};
const toneSoft: Record<Tone, string> = {
  blush: "bg-blush/15",
  grape: "bg-grape/15",
  lagoon: "bg-lagoon/15",
  sunbeam: "bg-sunbeam/15",
};
const toneBar: Record<Tone, string> = {
  blush: "bg-blush",
  grape: "bg-grape",
  lagoon: "bg-lagoon",
  sunbeam: "bg-sunbeam",
};

/* ── Marquee bands ─────────────────────────────────────────────────────── */

function Band({ words, className, reverse }: { words: string[]; className: string; reverse?: boolean }) {
  const run = words.map((w) => `${w} ✦ `).join("");
  return (
    <div className={`-mx-[10vw] overflow-hidden py-[clamp(0.75rem,1.25vw,1.5rem)] ${className}`}>
      <div
        className="flex w-max font-display text-[clamp(1.5rem,2.7vw,3.25rem)] leading-[1.27] whitespace-nowrap uppercase motion-safe:animate-[pp-marquee_38s_linear_infinite]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[0, 1, 2, 3].map((k) => (
          <span key={k} aria-hidden={k > 0} className="pr-[0.3em]">
            {run}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The two crossed, tilted ticker bands under the service rows. */
export function Marquee() {
  return (
    <div className="overflow-x-clip py-[clamp(1rem,2vw,2.5rem)]">
      {/* Keyframes local to this band (globals.css is owned by the lead). */}
      <style>{`@keyframes pp-marquee{from{transform:translateX(0)}to{transform:translateX(-25%)}}`}</style>
      <Band words={marquee.top} className="-rotate-3 bg-blush text-white" />
      <Band words={marquee.bottom} reverse className="-mt-[clamp(0.5rem,1.56vw,1.875rem)] rotate-[2.5deg] bg-sunbeam text-ink" />
    </div>
  );
}

/* ── Every service, explained ─────────────────────────────────────────── */

export function Explained() {
  return (
    <section aria-labelledby="explained-title" className="shell">
      <div data-reveal>
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">{explained.eyebrow}</p>
        <h2 id="explained-title" className="mt-3 font-display text-h2 leading-[1.1] text-grape uppercase">
          {explained.heading}
        </h2>
        <p className="mt-3 max-w-[68.75rem] font-copy text-lead leading-[1.53] text-ink">{explained.lead}</p>
      </div>

      <ul data-reveal-stagger className="mt-[clamp(2rem,2.9vw,3.5rem)] grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {serviceRows.map((row, i) => {
          const detail = serviceDetails.find((s) => s.slug === row.slug)!;
          return (
            <li key={row.slug} className="flex flex-col items-start gap-[1.125rem] rounded-3xl bg-white p-[clamp(1.75rem,2.1vw,2.5rem)]">
              <span className="rounded-full bg-blush px-[1.125rem] py-2.5 font-haas text-[clamp(0.8125rem,0.94vw,1.125rem)] leading-none text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-haas text-card leading-tight text-ink">{detail.name}</h3>
              <p className="font-copy text-small leading-[1.6] font-light text-ink">{row.explained}</p>
              <Link
                href={`/services/${row.slug}`}
                className="mt-auto font-haas text-small text-blush uppercase transition-colors hover:text-grape"
              >
                Explore {detail.name} →
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── FAQ ───────────────────────────────────────────────────────────────── */

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: servicesFaq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      aria-labelledby="faq-title"
      className="shell grid gap-10 lg:grid-cols-[minmax(0,640fr)_minmax(0,900fr)] lg:gap-[clamp(2rem,3.85vw,4.625rem)]"
    >
      <div data-reveal className="flex flex-col items-start">
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">{servicesFaq.eyebrow}</p>
        <h2 id="faq-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          {servicesFaq.heading[0]}
          <br />
          {servicesFaq.heading[1]}
        </h2>
        <p className="mt-[clamp(1.25rem,2.1vw,2.5rem)] max-w-[30rem] font-copy text-body leading-[1.64] font-light text-ink">
          {servicesFaq.body}
        </p>
        <PopButton href={servicesFaq.cta.href} label={servicesFaq.cta.label} className="mt-[clamp(1.25rem,1.9vw,2.25rem)] [&>span:last-child]:text-ink" />
      </div>

      <div data-reveal-stagger className="flex flex-col gap-4">
        {servicesFaq.items.map((f, i) => (
          <details key={f.q} open={i === 0} className="group rounded-3xl bg-white/50 transition-colors open:bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-[clamp(1.25rem,1.875vw,2.25rem)] py-[clamp(1rem,1.46vw,1.625rem)] font-copy text-[clamp(1.0625rem,1.25vw,1.5rem)] font-medium text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full bg-grape font-haas text-[1.5rem] leading-none text-white transition-colors group-open:bg-blush"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">–</span>
              </span>
            </summary>
            <p className="max-w-[48.75rem] px-[clamp(1.25rem,1.875vw,2.25rem)] pb-[clamp(1.5rem,2.4vw,2.875rem)] font-copy text-small leading-[1.6] font-light text-ink/85">
              {f.a}
            </p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

/* ── Us vs a typical agency ───────────────────────────────────────────── */

export function Comparison() {
  const item = "flex items-center gap-[1.125rem] font-copy text-[clamp(1.0625rem,1.15vw,1.375rem)]";
  const dot = "grid size-[1.875rem] shrink-0 place-items-center rounded-full font-haas text-[0.9375rem] leading-none";
  return (
    <section aria-labelledby="compare-title" className="shell">
      <SectionTitle eyebrow={comparison.eyebrow} title={<span id="compare-title">{comparison.heading}</span>} />

      <div data-reveal-stagger className="mt-[clamp(2rem,3.96vw,4.75rem)] grid items-start gap-[1.75rem] md:grid-cols-2">
        <div className="flex min-h-[clamp(22rem,29.2vw,35rem)] flex-col rounded-[clamp(1.75rem,1.875vw,2.25rem)] border border-white bg-white/50 p-[clamp(1.75rem,2.5vw,3rem)] md:mt-5">
          <h3 className="font-display text-[clamp(1.375rem,1.56vw,1.875rem)] text-ink/50 uppercase">{comparison.typical.title}</h3>
          <ul className="mt-[clamp(1.75rem,2.1vw,2.375rem)] flex flex-col gap-[clamp(1.5rem,2.4vw,2.875rem)]">
            {comparison.typical.items.map((t) => (
              <li key={t} className={`${item} text-ink/55`}>
                <span aria-hidden className={`${dot} bg-ink/12 text-ink/50`}>
                  ✕
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid min-h-[clamp(22rem,29.2vw,35rem)] overflow-hidden rounded-[clamp(1.75rem,1.875vw,2.25rem)] bg-grape shadow-[0_20px_50px_rgb(34_1_40/0.13)]">
          <div
            aria-hidden
            className="col-start-1 row-start-1 mt-[32%] ml-[51%] h-[71%] w-[64%] rounded-full bg-blush/45 blur-[clamp(3rem,8.3vw,10rem)]"
          />
          <div className="col-start-1 row-start-1 p-[clamp(1.75rem,2.5vw,3rem)]">
            <h3 className="font-display text-[clamp(1.375rem,1.56vw,1.875rem)] text-sunbeam uppercase">{comparison.us.title}</h3>
            <ul className="mt-[clamp(1.75rem,2.1vw,2.375rem)] flex flex-col gap-[clamp(1.5rem,2.4vw,2.875rem)]">
              {comparison.us.items.map((t) => (
                <li key={t} className={`${item} font-medium text-white`}>
                  <span aria-hidden className={`${dot} bg-sunbeam text-ink`}>
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Industries ───────────────────────────────────────────────────────── */

export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="shell">
      <SectionTitle align="center" eyebrow={industries.eyebrow} title={<span id="industries-title">{industries.heading}</span>} />
      <ul data-reveal-stagger className="mt-[clamp(2rem,4.5vw,5.375rem)] grid grid-cols-2 gap-[clamp(0.75rem,1.04vw,1.25rem)] lg:grid-cols-4">
        {industries.items.map((ind, i) => (
          <li
            key={ind.name}
            className={`grid h-[clamp(7.5rem,8.85vw,10.625rem)] overflow-hidden rounded-[clamp(1.25rem,1.46vw,1.75rem)] ${toneBg[ind.tone]}`}
          >
            <span
              aria-hidden
              className="col-start-1 row-start-1 -mt-[clamp(0.75rem,1.04vw,1.25rem)] -mr-[0.15em] justify-self-end font-pop text-[clamp(4.5rem,6.77vw,8.125rem)] leading-[1.15] text-white/25"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="col-start-1 row-start-1 self-end p-[clamp(1rem,1.46vw,1.75rem)] font-display text-[clamp(0.875rem,1.25vw,1.5rem)] leading-tight uppercase">
              {ind.name}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Ways to work ─────────────────────────────────────────────────────── */

export function Models() {
  return (
    <section aria-labelledby="models-title" className="shell">
      <SectionTitle eyebrow={models.eyebrow} title={<span id="models-title">{models.heading}</span>} />
      <ul data-reveal-stagger className="mt-[clamp(2rem,4vw,4.75rem)] grid gap-[clamp(1.25rem,1.77vw,2.125rem)] md:grid-cols-3">
        {models.items.map((m) => (
          <li
            key={m.name}
            className="flex min-h-[clamp(17rem,20.8vw,25rem)] flex-col overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white shadow-[0_20px_50px_rgb(34_1_40/0.13)]"
          >
            <span aria-hidden className={`h-3 ${toneBar[m.tone]}`} />
            <div className="flex flex-1 flex-col p-[clamp(1.5rem,2.08vw,2.5rem)] pt-[clamp(1.75rem,2.3vw,2.75rem)]">
              <h3 className={`font-display text-[clamp(1.75rem,2.08vw,2.5rem)] leading-tight uppercase ${toneText[m.tone]}`}>{m.name}</h3>
              <p className="mt-3 font-copy text-[clamp(1rem,1.09vw,1.3125rem)] leading-[1.62] text-ink/85">{m.body}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                <span className={`rounded-full px-[clamp(1.25rem,2vw,2.5rem)] py-[0.9rem] font-display text-micro leading-none text-ink uppercase ${toneSoft[m.tone]}`}>
                  {m.chip}
                </span>
                <Link href="/contact" className="font-display text-micro text-blush uppercase hover:underline">
                  Learn more<span className="sr-only"> about the {m.name.toLowerCase()} model</span> →
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Stats band ───────────────────────────────────────────────────────── */

export function StatsBand() {
  return (
    <section aria-label="Pixel Popers in numbers" className="shell">
      <div className="-mx-[clamp(0rem,2.4vw,2.875rem)] grid overflow-hidden rounded-[clamp(1.75rem,2.5vw,3rem)] bg-lagoon">
        <div
          aria-hidden
          className="col-start-1 row-start-1 -mt-[12%] ml-[65%] h-[160%] w-[42%] rounded-full bg-white/20 blur-[clamp(4rem,10.4vw,12.5rem)]"
        />
        <dl
          data-reveal-stagger
          className="col-start-1 row-start-1 grid grid-cols-2 gap-x-6 gap-y-10 px-[clamp(1.5rem,4.17vw,5rem)] py-[clamp(2rem,2.6vw,3.125rem)] lg:grid-cols-4"
        >
          {servicesStats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-[clamp(0.5rem,1.04vw,1.25rem)] lg:pb-[clamp(1rem,3.5vw,4.25rem)]">
              <dt className="font-copy text-small font-medium text-white">{s.label}</dt>
              <dd className={`font-pop text-[clamp(4rem,7.8vw,9.375rem)] leading-[1.2] ${s.tone}`}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ── Closing CTA ──────────────────────────────────────────────────────── */

export function Closing() {
  return (
    <section aria-labelledby="cta-title" className="shell">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,934fr)_minmax(0,560fr)] lg:px-[3.8%]">
        <div data-reveal>
          <p className="font-haas text-eyebrow leading-none text-blush uppercase">{servicesCta.eyebrow}</p>
          <h2 id="cta-title" className="mt-[0.2em] font-display text-h2 leading-[1.16] text-grape uppercase">
            {servicesCta.heading[0]}
            <br />
            {servicesCta.heading[1]}
          </h2>
        </div>
        <div data-reveal className="flex flex-col items-start gap-[clamp(1.5rem,2.1vw,2.5rem)] lg:pt-10">
          <p className="max-w-[35rem] font-copy text-body leading-[1.64] font-light text-ink">{servicesCta.body}</p>
          <PopButton href={servicesCta.cta.href} label={servicesCta.cta.label} className="[&>span:last-child]:text-ink" />
        </div>
      </div>
    </section>
  );
}
