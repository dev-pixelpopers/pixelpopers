import Link from "next/link";
import type { Package } from "@/lib/service-content";

/** Title + bullet colours per package (Figma: sunbeam/lagoon, pink/grape, sunbeam/pink). */
const tones = [
  { title: "text-sunbeam", arrow: "text-lagoon" },
  { title: "text-blush-ink", arrow: "text-grape" },
  { title: "text-sunbeam", arrow: "text-blush-ink" },
] as const;

/** Figma "Package — STARTER / GROWTH / FULL POP" on 03.4 Web Development (376:101): each package is a code file. */
export default function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const tone = tones[index % tones.length];
  const file = `${pkg.name.toLowerCase().replace(/\s+/g, "-")}.tsx`;

  return (
    <div className="grid h-full">
      <article className="col-start-1 row-start-1 flex h-full min-h-[clamp(30rem,32.3vw,38.75rem)] flex-col overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] bg-code text-white shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
        <div className="flex h-[clamp(2.5rem,2.5vw,3rem)] shrink-0 items-center gap-[clamp(1rem,1.2vw,1.4375rem)] bg-[#2a0a33] px-[clamp(1rem,1.04vw,1.25rem)]">
          <span aria-hidden className="flex gap-[clamp(0.4rem,0.47vw,0.5625rem)]">
            <span className="size-[clamp(0.625rem,0.68vw,0.8125rem)] rounded-full bg-blush" />
            <span className="size-[clamp(0.625rem,0.68vw,0.8125rem)] rounded-full bg-sunbeam" />
            <span className="size-[clamp(0.625rem,0.68vw,0.8125rem)] rounded-full bg-lagoon" />
          </span>
          <span aria-hidden className="font-copy text-[clamp(0.75rem,0.78vw,0.9375rem)] font-medium text-white/50">
            {file}
          </span>
        </div>

        <div className="flex grow flex-col px-[clamp(1.75rem,2.5vw,3rem)] pt-[clamp(1.5rem,2.08vw,2.5rem)] pb-[clamp(1.75rem,2.08vw,2.5rem)]">
          <h3 className={`font-display text-[clamp(1.625rem,1.98vw,2.375rem)] leading-[1.26] uppercase ${tone.title}`}>
            <span aria-hidden>&lt;</span>
            {pkg.name}
            <span aria-hidden> /&gt;</span>
          </h3>
          <p className="mt-1.5 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] text-white/80">{pkg.summary}</p>
          <p className="mt-2 font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] text-white/55 uppercase">
            {pkg.price} · {pkg.timeline}
          </p>

          <ul className="mt-[clamp(1.25rem,1.56vw,1.875rem)] mb-8 flex flex-col gap-[clamp(0.875rem,1.35vw,1.625rem)] font-copy text-[clamp(1rem,1.04vw,1.25rem)] font-medium">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-[clamp(0.75rem,0.9vw,1rem)]">
                <span aria-hidden className={`font-bold ${tone.arrow}`}>
                  →
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            aria-label={`Get a quote for the ${pkg.name} web development package`}
            className={`mt-auto flex h-[clamp(3.25rem,3.125vw,3.75rem)] items-center justify-center rounded-full font-display text-[clamp(0.875rem,0.885vw,1.0625rem)] uppercase transition-transform duration-300 hover:scale-[1.03] ${pkg.popular ? "bg-blush text-white" : "bg-white text-ink"}`}
          >
            Get a quote
          </Link>
        </div>
      </article>

      {pkg.popular ? (
        <span className="col-start-1 row-start-1 -mt-[clamp(1rem,1.77vw,2.125rem)] -mr-[clamp(0.25rem,1.04vw,1.25rem)] self-start justify-self-end rotate-[-8deg] rounded-full bg-sunbeam px-[clamp(1.25rem,1.98vw,2.375rem)] py-[clamp(0.75rem,1.04vw,1.25rem)] font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-ink uppercase shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
          Most popular
        </span>
      ) : null}
    </div>
  );
}
