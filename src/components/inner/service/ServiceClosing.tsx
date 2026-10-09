import Link from "next/link";
import type { ReactNode } from "react";
import { Burst, Chars } from "@/components/inner/motion/bits";
import SectionTitle from "@/components/inner/SectionTitle";
import PopButton from "@/components/ui/PopButton";
import SplitWords from "@/components/ui/SplitWords";
import { serviceDetails, type Package, type ServiceDetail } from "@/lib/service-content";

const chipColors = [
  "bg-grape text-white rotate-3",
  "bg-lagoon text-white -rotate-3",
  "bg-sunbeam text-ink rotate-2",
  "bg-blush text-white -rotate-2",
  "bg-grape text-white rotate-3",
];

/** Fallback package card — the concept pages pass their own `renderPackage`. */
function DefaultPackage({ pkg }: { pkg: Package }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[2rem] bg-white p-10 shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
      <h3 className="font-display text-[clamp(1.75rem,1.98vw,2.375rem)] text-grape uppercase">{pkg.name}</h3>
      <p className="font-copy text-small text-ink/80">{pkg.summary}</p>
      <ul className="flex flex-col gap-3 font-copy text-small font-medium">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-3">
            <span aria-hidden className="text-blush">✦</span>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/contact" className="mt-auto rounded-full bg-ink py-4 text-center font-display text-micro text-white uppercase">
        Get a quote
      </Link>
    </div>
  );
}

type ServiceClosingProps = {
  service: ServiceDetail;
  /**
   * Concept-specific package card (swatch, app window, film strip…). Receives
   * the package and its index; wraps nothing else, so the grid stays shared.
   */
  renderPackage?: (pkg: Package, index: number) => ReactNode;
};

/**
 * Shared closing run of every service page: packages, FAQ, "more ways to
 * pop" and the CTA. The site footer follows from the (inner) layout.
 * Motion hooks (`data-wm`) are picked up by ServicePageMotion.
 */
export default function ServiceClosing({ service, renderPackage }: ServiceClosingProps) {
  const others = serviceDetails.filter((s) => s.slug !== service.slug);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex flex-col gap-[clamp(5rem,6.25vw,7.5rem)] pb-[clamp(4rem,6.25vw,7.5rem)]">
      {/* ── Packages ──────────────────────────────────────────────── */}
      <section aria-labelledby="packages-title" className="shell">
        <SectionTitle align="center" eyebrow="Pick your pop" title={<span id="packages-title">Packages</span>} />
        <ul data-wm="packages" className="mt-14 grid items-start gap-8 md:grid-cols-3 md:gap-[clamp(1rem,1.77vw,2.125rem)]">
          {service.packages.map((pkg, i) => (
            <li
              key={pkg.name}
              data-wm="package"
              data-popular={pkg.popular ? "" : undefined}
              className={`relative h-full ${pkg.popular ? "md:-mt-5" : ""}`}
            >
              {renderPackage ? renderPackage(pkg, i) : <DefaultPackage pkg={pkg} />}
              {pkg.popular ? <Burst pieces={16} ring="border-blush" className="top-0 left-1/2 size-0" /> : null}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center font-copy text-small text-ink/60">
          Prices are starting points — every project gets a fixed quote after a free 30-minute call.
        </p>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-title" className="shell grid gap-10 lg:grid-cols-[minmax(0,600fr)_minmax(0,900fr)] lg:gap-[clamp(3rem,4.9vw,5.875rem)]">
        <div data-wm="heading">
          <p data-wm="eyebrow" className="font-haas text-[clamp(1.5rem,2.5vw,3rem)] leading-none text-blush uppercase">Good questions</p>
          <h2 id="faq-title" className="mt-4 font-display text-[clamp(2rem,3.54vw,4.25rem)] leading-[1.18] text-grape uppercase">
            <SplitWords text="Asked &" name="wm-words" />
            <br />
            <SplitWords text="answered" name="wm-words" />
          </h2>
        </div>
        <div data-wm="faqs" className="flex flex-col gap-3.5">
          {service.faqs.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              data-wm="faq"
              className="group rounded-3xl bg-white/60 transition-colors open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-9 py-6 font-copy text-[clamp(1.0625rem,1.2vw,1.4375rem)] font-medium text-ink [&::-webkit-details-marker]:hidden">
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
              <p className="max-w-[47.5rem] px-9 pb-9 font-copy text-small leading-[1.6] font-light text-ink/85">{f.a}</p>
            </details>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </section>

      {/* ── More ways to pop ──────────────────────────────────────── */}
      <section aria-labelledby="more-title" className="shell text-center">
        <h2 id="more-title" data-reveal className="font-haas text-[clamp(1.5rem,2.5vw,3rem)] text-blush uppercase">
          More ways to pop
        </h2>
        <ul data-wm="more" className="mx-auto mt-10 flex max-w-[75rem] flex-wrap justify-center gap-x-5 gap-y-8">
          {others.map((s, i) => (
            <li key={s.slug} data-wm="chip">
              <Link
                href={`/services/${s.slug}`}
                className={`inline-block rounded-full px-8 py-5 font-display text-[clamp(1.125rem,1.35vw,1.625rem)] uppercase shadow-[0_10px_24px_rgb(34_1_40/0.15)] transition-transform duration-300 hover:scale-105 hover:rotate-0 ${chipColors[i % chipColors.length]}`}
              >
                {s.name}&nbsp;&nbsp;↗
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section data-wm="cta" aria-labelledby="cta-title" className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:px-[3.75rem]">
          <div>
            <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">Ready to pop?</p>
            <h2
              id="cta-title"
              aria-label={`Let's talk ${service.ctaHeading}`}
              className="mt-3 font-display text-[clamp(2rem,3.75vw,4.5rem)] leading-[1.17] text-grape uppercase"
            >
              <span aria-hidden>
                <Chars text="Let's talk" />
                <br />
                <Chars text={service.ctaHeading} />
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-8">
            <p data-wm="cta-copy" className="font-copy text-body leading-[1.64] font-light">
              Tell us where you are and where you want to be — we reply within a day with next steps.
            </p>
            <div className="relative">
              <div data-wm="cta-btn">
                <PopButton href="/contact" label={service.ctaButton} />
              </div>
              <Burst pieces={14} ring="border-blush" className="top-1/2 left-[2.5rem] size-0" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
