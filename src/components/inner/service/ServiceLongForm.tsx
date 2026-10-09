import { Burst } from "@/components/inner/motion/bits";
import SectionTitle from "@/components/inner/SectionTitle";
import SplitWords from "@/components/ui/SplitWords";
import type { ServiceDetail } from "@/lib/service-content";

/** Accent → utility classes. Spelled out in full so Tailwind can see them. */
export const accentClasses = {
  blush: { bg: "bg-blush", text: "text-blush", border: "border-blush", on: "text-white" },
  grape: { bg: "bg-grape", text: "text-grape", border: "border-grape", on: "text-white" },
  lagoon: { bg: "bg-lagoon", text: "text-lagoon", border: "border-lagoon", on: "text-white" },
  sunbeam: { bg: "bg-sunbeam", text: "text-sunbeam", border: "border-sunbeam", on: "text-ink" },
} as const;

const audienceCards = [
  "bg-blush text-white",
  "bg-grape text-white",
  "bg-lagoon text-white",
  "bg-sunbeam text-ink",
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The long-form, crawlable half of every service page (Figma block
 * "Long-form · SEO copy"): overview, what's included, step by step,
 * who it's for, the short guide and why us. Motion hooks (`data-wm`) are
 * picked up by ServicePageMotion.
 */
export default function ServiceLongForm({
  service,
  hideProcess = false,
}: {
  service: ServiceDetail;
  /** Pages whose concept section already tells the process (hover cards) skip the text version. */
  hideProcess?: boolean;
}) {
  const a = accentClasses[service.accent];

  return (
    <div className="shell flex flex-col gap-[clamp(5rem,8.3vw,10rem)] pb-[clamp(5rem,8.3vw,10rem)]">
      {/* ── The full story ─────────────────────────────────────────── */}
      <section aria-labelledby="overview-title" data-wm="longform" className="grid gap-12 lg:grid-cols-[minmax(0,620fr)_minmax(0,968fr)] lg:gap-[clamp(3rem,6.25vw,7.5rem)]">
        <div className="flex flex-col gap-7 lg:sticky lg:top-10 lg:self-start">
          <div data-wm="heading" className="flex flex-col gap-7">
            <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">{service.overview.eyebrow}</p>
            <h2 id="overview-title" className="font-display text-h3 leading-[1.15] text-grape uppercase">
              <SplitWords text={service.overview.heading} name="wm-words" />
            </h2>
          </div>
          <dl data-wm="stat-row" className="flex flex-wrap gap-x-10 gap-y-6 pt-6">
            {service.stats.map((s) => (
              <div key={s.label} data-wm="stat" className="relative flex flex-col-reverse gap-1">
                <dt data-wm="stat-label" className="max-w-[10rem] font-copy text-micro font-medium text-ink/70">{s.label}</dt>
                <dd className="relative font-display text-[clamp(2rem,2.7vw,3.25rem)] leading-none text-ink">
                  <span data-wm="stat-value" data-value={s.value} className="inline-block origin-bottom-left">
                    {s.value}
                  </span>
                  <Burst pieces={8} className="top-1/2 left-[0.6em] size-0" />
                </dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="font-haas text-[clamp(0.9375rem,0.94vw,1.125rem)] text-blush uppercase">Tools we love</p>
            <ul data-wm="tools" className="mt-3 flex flex-wrap gap-2.5">
              {service.tools.map((t) => (
                <li key={t} data-wm="tool" className="rounded-full bg-white px-5 py-2.5 font-copy text-[clamp(0.9375rem,0.94vw,1.125rem)] font-medium">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-7 font-copy">
          {service.overview.paragraphs.map((p, i) =>
            i === 0 ? (
              <p key={i} data-wm="para" className="text-lead leading-[1.53] text-ink">
                {p}
              </p>
            ) : (
              <p key={i} data-wm="para" className="text-copy leading-[1.67] font-light text-ink/85">
                {p}
              </p>
            ),
          )}
        </div>
      </section>

      {/* ── What's included ────────────────────────────────────────── */}
      <section aria-labelledby="included-title">
        <SectionTitle eyebrow="What's included" title={<span id="included-title">Everything in the box</span>} />
        <ul data-wm="included" className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {service.included.map((item, i) => (
            <li key={item.title} data-wm="inc-card" className="flex flex-col gap-[1.125rem] rounded-3xl bg-white p-[clamp(1.75rem,2.1vw,2.5rem)]">
              <span className="relative self-start">
                <span data-wm="pill" className={`inline-block rounded-full px-[1.125rem] py-2.5 font-haas text-micro ${a.bg} ${a.on}`}>{pad(i + 1)}</span>
                <Burst pieces={8} className="inset-0" />
              </span>
              <h3 className="font-haas text-card leading-tight text-ink">{item.title}</h3>
              <p className="font-copy text-small leading-[1.6] font-light text-ink/85">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Step by step ───────────────────────────────────────────── */}
      {hideProcess ? null : (
      <section aria-labelledby="steps-title">
        <SectionTitle eyebrow="Step by step" title={<span id="steps-title">How the work gets done</span>} />
        <ol data-wm="steps" className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, i) => (
            <li key={step.title} data-wm="step" className={`flex flex-col gap-4 border-t-4 pt-7 ${a.border}`}>
              <span aria-hidden className={`font-display text-[clamp(3rem,3.75vw,4.5rem)] leading-none ${a.text}`}>
                <span data-wm="step-num" className="inline-block">
                  {pad(i + 1)}
                </span>
              </span>
              <h3 className="font-haas text-card text-ink">{step.title}</h3>
              <p className="font-copy text-small leading-[1.6] font-light text-ink/85">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
      )}

      {/* ── Who it's for ───────────────────────────────────────────── */}
      <section aria-labelledby="audience-title">
        <SectionTitle eyebrow="Who it's for" title={<span id="audience-title">Made for brands like yours</span>} />
        <ul data-wm="aud" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.audience.map((item, i) => (
            <li key={item.title} data-wm="aud-card" className={`flex flex-col gap-3.5 rounded-3xl p-9 ${audienceCards[i % 4]}`}>
              <span aria-hidden data-wm="spark" className="self-start font-haas text-card">✦</span>
              <h3 className="font-haas text-[clamp(1.25rem,1.35vw,1.625rem)] leading-tight">{item.title}</h3>
              <p className="font-copy text-small leading-normal opacity-90">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Good to know ───────────────────────────────────────────── */}
      <section aria-labelledby="guide-title">
        <SectionTitle eyebrow="Good to know" title={<span id="guide-title">The short guide</span>} />
        <div data-wm="guides" className="mt-14 grid gap-12 md:grid-cols-3">
          {service.insights.map((item, i) => (
            <article key={item.title} data-wm="guide" className="flex flex-col gap-4 border-t-2 border-ink pt-7">
              <p className="font-haas text-micro text-blush uppercase">Guide {pad(i + 1)}</p>
              <h3 className="font-display text-h4 leading-tight text-ink">{item.title}</h3>
              <p className="font-copy text-small leading-[1.6] font-light text-ink/85">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Why us ─────────────────────────────────────────────────── */}
      <section
        aria-labelledby="why-title"
        data-wm="why"
        className="grid gap-10 rounded-[clamp(1.5rem,2.1vw,2.5rem)] bg-ink p-[clamp(2rem,5vw,6rem)] text-cream lg:grid-cols-[minmax(0,560fr)_minmax(0,740fr)] lg:gap-24"
      >
        <h2 id="why-title" data-wm="why-text" className="font-display text-h3 leading-[1.15] uppercase">
          {service.whyUs.heading}
        </h2>
        <div className="flex flex-col gap-6 font-copy text-copy leading-[1.67] font-light text-cream/85">
          {service.whyUs.paragraphs.map((p, i) => (
            <p key={i} data-wm="why-text">
              {p}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
