import Link from "next/link";
import type { Package } from "@/lib/service-content";
import { SERVICE_HEADINGS, type PackageLabels } from "@/lib/service-headings";

const tones = [
  { icon: "bg-lagoon text-white", tick: "text-lagoon" },
  { icon: "bg-blush text-white", tick: "text-blush-ink" },
  { icon: "bg-grape text-sunbeam", tick: "text-grape" },
] as const;

/** Mobile app packages, each styled as an app-store listing with a "Get" button. */
export default function PackageCard({ pkg, index, labels = SERVICE_HEADINGS.packages }: { pkg: Package; index: number; labels?: PackageLabels }) {
  const tone = tones[index % tones.length];

  return (
    <div className="grid h-full">
      <article className="col-start-1 row-start-1 flex h-full min-h-[clamp(30rem,32.3vw,38.75rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white px-[clamp(1.5rem,2.08vw,2.5rem)] pt-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(1.75rem,2.08vw,2.5rem)] text-ink shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
        <div className="flex items-center gap-[clamp(0.875rem,1.04vw,1.25rem)]">
          <span aria-hidden className={`grid size-[clamp(3.5rem,4.17vw,5rem)] shrink-0 place-items-center rounded-[28%] font-pop text-[clamp(2rem,2.6vw,3.125rem)] leading-none ${tone.icon}`}>
            {pkg.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-[clamp(1.375rem,1.67vw,2rem)] leading-[1.15] text-grape uppercase">{pkg.name}</h3>
            <p className="mt-0.5 font-copy text-[clamp(0.875rem,0.94vw,1.125rem)] text-ink/65">{pkg.summary}</p>
          </div>
        </div>

        <dl className="mt-[clamp(1.25rem,1.46vw,1.75rem)] grid grid-cols-2 divide-x divide-ink/10 rounded-[clamp(0.875rem,1.04vw,1.25rem)] bg-paper py-3 text-center font-copy">
          <div>
            <dt className="text-[clamp(0.6875rem,0.68vw,0.8125rem)] font-bold text-ink/50 uppercase">{labels.price}</dt>
            <dd className="mt-0.5 text-[clamp(0.9375rem,0.99vw,1.1875rem)] font-extrabold">{pkg.price}</dd>
          </div>
          <div>
            <dt className="text-[clamp(0.6875rem,0.68vw,0.8125rem)] font-bold text-ink/50 uppercase">{labels.timeline}</dt>
            <dd className="mt-0.5 text-[clamp(0.9375rem,0.99vw,1.1875rem)] font-extrabold">{pkg.timeline}</dd>
          </div>
        </dl>

        <ul className="mt-[clamp(1.25rem,1.56vw,1.875rem)] mb-8 flex flex-col gap-[clamp(0.75rem,1.04vw,1.25rem)] font-copy text-[clamp(1rem,1.04vw,1.25rem)] font-medium">
          {pkg.features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span aria-hidden className={`font-bold ${tone.tick}`}>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          aria-label={`${labels.button}: ${pkg.name} mobile app package`}
          className={`mt-auto flex h-[clamp(3.25rem,3.125vw,3.75rem)] items-center justify-center rounded-full font-display text-[clamp(0.875rem,0.885vw,1.0625rem)] uppercase transition-transform duration-300 hover:scale-[1.03] ${pkg.popular ? "bg-blush text-white" : "bg-grape/10 text-grape"}`}
        >
          {labels.button}
        </Link>
      </article>

      {pkg.popular ? (
        <span className="col-start-1 row-start-1 -mt-[clamp(1rem,1.77vw,2.125rem)] -mr-[clamp(0.25rem,1.04vw,1.25rem)] self-start justify-self-end rotate-[-8deg] rounded-full bg-sunbeam px-[clamp(1.25rem,1.98vw,2.375rem)] py-[clamp(0.75rem,1.04vw,1.25rem)] font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-ink uppercase shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
          {labels.popular}
        </span>
      ) : null}
    </div>
  );
}
