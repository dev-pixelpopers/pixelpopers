import Link from "next/link";
import { Burst, Chars } from "@/components/inner/motion/bits";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import SplitWords from "@/components/ui/SplitWords";
import { serviceDetails } from "@/lib/service-content";
import {
  comparison,
  explained,
  industries,
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
  blush: "text-blush-ink",
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

/* ── Every service, explained ─────────────────────────────────────────── */

export function Explained() {
  return (
    <section aria-labelledby="explained-title" className="shell">
      <div data-wm="heading">
        <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush-ink uppercase">{explained.eyebrow}</p>
        <h2 id="explained-title" className="mt-3 font-display text-h2 leading-[1.1] text-grape uppercase">
          <SplitWords text={explained.heading} name="wm-words" />
        </h2>
        <p data-wm="lead" className="mt-3 max-w-[68.75rem] font-copy text-lead leading-[1.53] text-ink">{explained.lead}</p>
      </div>

      <ul data-wm="explained" className="mt-[clamp(2rem,2.9vw,3.5rem)] grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {serviceRows.map((row, i) => {
          const detail = serviceDetails.find((s) => s.slug === row.slug)!;
          return (
            <li key={row.slug} data-wm="ex-card" className="flex flex-col items-start gap-[1.125rem] rounded-3xl bg-white p-[clamp(1.75rem,2.1vw,2.5rem)]">
              <span className="relative">
                <span data-wm="pill" className="inline-block rounded-full bg-blush px-[1.125rem] py-2.5 font-haas text-[clamp(0.8125rem,0.94vw,1.125rem)] leading-none text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Burst pieces={8} ring="border-blush" className="inset-0" />
              </span>
              <h3 className="font-haas text-card leading-tight text-ink">{detail.name}</h3>
              <p className="font-copy text-small leading-[1.6] font-light text-ink">{row.explained}</p>
              <Link
                href={`/services/${row.slug}`}
                className="mt-auto font-haas text-small text-blush-ink uppercase transition-colors hover:text-grape"
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
      <div data-wm="heading" className="flex flex-col items-start">
        <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush-ink uppercase">{servicesFaq.eyebrow}</p>
        <h2 id="faq-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          <SplitWords text={servicesFaq.heading[0]} name="wm-words" />
          <br />
          <SplitWords text={servicesFaq.heading[1]} name="wm-words" />
        </h2>
        <p data-wm="lead" className="mt-[clamp(1.25rem,2.1vw,2.5rem)] max-w-[30rem] font-copy text-body leading-[1.64] font-light text-ink">
          {servicesFaq.body}
        </p>
        <div data-wm="faq-btn" className="mt-[clamp(1.25rem,1.9vw,2.25rem)]">
          <PopButton href={servicesFaq.cta.href} label={servicesFaq.cta.label} className="[&>span:last-child]:text-ink" />
        </div>
      </div>

      <div data-wm="faqs" className="flex flex-col gap-4">
        {servicesFaq.items.map((f, i) => (
          <details key={f.q} open={i === 0} data-wm="faq" className="group rounded-3xl bg-white/50 transition-colors open:bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-[clamp(1.25rem,1.875vw,2.25rem)] py-[clamp(1rem,1.46vw,1.625rem)] font-copy text-[clamp(1.0625rem,1.25vw,1.5rem)] font-medium text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                data-wm="faq-dot"
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

      <div data-wm="compare" className="mt-[clamp(2rem,3.96vw,4.75rem)] grid items-start gap-[1.75rem] md:grid-cols-2">
        <div data-wm="cmp-typical" className="flex min-h-[clamp(22rem,29.2vw,35rem)] flex-col rounded-[clamp(1.75rem,1.875vw,2.25rem)] border border-white bg-white/50 p-[clamp(1.75rem,2.5vw,3rem)] md:mt-5">
          <h3 className="font-display text-[clamp(1.375rem,1.56vw,1.875rem)] text-ink/50 uppercase">{comparison.typical.title}</h3>
          <ul className="mt-[clamp(1.75rem,2.1vw,2.375rem)] flex flex-col gap-[clamp(1.5rem,2.4vw,2.875rem)]">
            {comparison.typical.items.map((t) => (
              <li key={t} data-wm="cmp-x" className={`${item} text-ink/55`}>
                <span aria-hidden className={`${dot} bg-ink/12 text-ink/50`}>
                  ✕
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div data-wm="cmp-us" className="grid min-h-[clamp(22rem,29.2vw,35rem)] overflow-hidden rounded-[clamp(1.75rem,1.875vw,2.25rem)] bg-grape shadow-[0_20px_50px_rgb(34_1_40/0.13)]">
          <div
            aria-hidden
            className="col-start-1 row-start-1 mt-[32%] ml-[51%] h-[71%] w-[64%] rounded-full bg-blush/45 blur-[clamp(3rem,8.3vw,10rem)]"
          />
          <div className="col-start-1 row-start-1 p-[clamp(1.75rem,2.5vw,3rem)]">
            <h3 className="font-display text-[clamp(1.375rem,1.56vw,1.875rem)] text-sunbeam uppercase">{comparison.us.title}</h3>
            <ul className="mt-[clamp(1.75rem,2.1vw,2.375rem)] flex flex-col gap-[clamp(1.5rem,2.4vw,2.875rem)]">
              {comparison.us.items.map((t) => (
                <li key={t} data-wm="cmp-check" className={`${item} font-medium text-white`}>
                  <span aria-hidden data-wm="cmp-dot" className={`${dot} bg-sunbeam text-ink`}>
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
      <ul data-wm="industries" className="mt-[clamp(2rem,4.5vw,5.375rem)] grid grid-cols-2 gap-[clamp(0.75rem,1.04vw,1.25rem)] lg:grid-cols-4">
        {industries.items.map((ind, i) => (
          <li
            key={ind.name}
            data-wm="industry"
            className={`grid h-[clamp(7.5rem,8.85vw,10.625rem)] overflow-hidden rounded-[clamp(1.25rem,1.46vw,1.75rem)] ${toneBg[ind.tone]}`}
          >
            <span
              aria-hidden
              data-wm="ind-num"
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
      <ul data-wm="models" className="mt-[clamp(2rem,4vw,4.75rem)] grid gap-[clamp(1.25rem,1.77vw,2.125rem)] md:grid-cols-3">
        {models.items.map((m) => (
          <li
            key={m.name}
            data-wm="model"
            className="flex min-h-[clamp(17rem,20.8vw,25rem)] flex-col overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white shadow-[0_20px_50px_rgb(34_1_40/0.13)]"
          >
            <span aria-hidden data-wm="model-bar" className={`h-3 ${toneBar[m.tone]}`} />
            <div className="flex flex-1 flex-col p-[clamp(1.5rem,2.08vw,2.5rem)] pt-[clamp(1.75rem,2.3vw,2.75rem)]">
              <h3 className={`font-display text-[clamp(1.75rem,2.08vw,2.5rem)] leading-tight uppercase ${toneText[m.tone]}`}>{m.name}</h3>
              <p className="mt-3 font-copy text-[clamp(1rem,1.09vw,1.3125rem)] leading-[1.62] text-ink/85">{m.body}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                <span data-wm="model-chip" className={`rounded-full px-[clamp(1.25rem,2vw,2.5rem)] py-[0.9rem] font-display text-micro leading-none text-ink uppercase ${toneSoft[m.tone]}`}>
                  {m.chip}
                </span>
                <Link href="/contact" className="font-display text-micro text-blush-ink uppercase hover:underline">
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
      <div data-wm="band" className="-mx-[clamp(0rem,2.4vw,2.875rem)] grid overflow-hidden rounded-[clamp(1.75rem,2.5vw,3rem)] bg-lagoon">
        <div
          aria-hidden
          className="col-start-1 row-start-1 -mt-[12%] ml-[65%] h-[160%] w-[42%] rounded-full bg-white/20 blur-[clamp(4rem,10.4vw,12.5rem)]"
        />
        <dl
          className="col-start-1 row-start-1 grid grid-cols-2 gap-x-6 gap-y-10 px-[clamp(1.5rem,4.17vw,5rem)] py-[clamp(2rem,2.6vw,3.125rem)] lg:grid-cols-4"
        >
          {servicesStats.map((s) => (
            <div key={s.label} data-wm="stat" className="relative flex flex-col-reverse gap-[clamp(0.5rem,1.04vw,1.25rem)] lg:pb-[clamp(1rem,3.5vw,4.25rem)]">
              <dt data-wm="stat-label" className="font-copy text-small font-medium text-white">{s.label}</dt>
              <dd className={`relative font-pop text-[clamp(4rem,7.8vw,9.375rem)] leading-[1.2] ${s.tone}`}>
                <span data-wm="stat-value" data-value={s.value} className="inline-block origin-bottom-left">
                  {s.value}
                </span>
                <Burst pieces={12} className="top-1/2 left-[22%] size-0" />
              </dd>
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
    <section data-wm="cta" aria-labelledby="cta-title" className="shell">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,934fr)_minmax(0,560fr)] lg:px-[3.8%]">
        <div>
          <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush-ink uppercase">{servicesCta.eyebrow}</p>
          <h2
            id="cta-title"
            aria-label={servicesCta.heading.join(" ")}
            className="mt-[0.2em] font-display text-h2 leading-[1.16] text-grape uppercase"
          >
            <span aria-hidden>
              <Chars text={servicesCta.heading[0]} />
              <br />
              <Chars text={servicesCta.heading[1]} />
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-[clamp(1.5rem,2.1vw,2.5rem)] lg:pt-10">
          <p data-wm="cta-copy" className="max-w-[35rem] font-copy text-body leading-[1.64] font-light text-ink">{servicesCta.body}</p>
          <div className="relative">
            <div data-wm="cta-btn">
              <PopButton href={servicesCta.cta.href} label={servicesCta.cta.label} className="[&>span:last-child]:text-ink" />
            </div>
            <Burst pieces={14} ring="border-blush" className="top-1/2 left-[2.5rem] size-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
