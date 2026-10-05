import Link from "next/link";
import type { Package } from "@/lib/service-content";

/** Each package carries a little growth chart in its own colour: lagoon, grape, pop pink. */
const tones = [
  { bar: "bg-lagoon/80", star: "text-lagoon" },
  { bar: "bg-grape/80", star: "text-grape" },
  { bar: "bg-blush/80", star: "text-blush" },
] as const;

/* Bar heights from the Figma icon (120-unit box). */
const bars = [33.3, 58.3, 45.8, 75, 100];

/** Figma "Package — STARTER / GROWTH / FULL POP" on 03.3 Digital Marketing (373:129). */
export default function PackageCard({
  pkg,
  index,
}: {
  pkg: Package;
  index: number;
}) {
  const tone = tones[index % tones.length];

  return (
    <div className="grid h-full">
      <article className="col-start-1 row-start-1 flex h-full min-h-[clamp(30rem,32.3vw,38.75rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] bg-white px-[clamp(1.75rem,2.5vw,3rem)] pt-[clamp(1.75rem,2.9vw,3.5rem)] pb-[clamp(1.75rem,2.08vw,2.5rem)] shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className={`font-display text-[clamp(1.75rem,1.98vw,2.375rem)] leading-[1.26] uppercase ${pkg.popular ? "text-blush" : "text-grape"}`}
            >
              {pkg.name}
            </h3>
            <p className="mt-1 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] text-ink/80">
              {pkg.summary}
            </p>
          </div>
          <span
            aria-hidden
            className="-mt-[clamp(1rem,1.35vw,1.625rem)] -mr-[0.4vw] flex h-[clamp(4.5rem,6.25vw,7.5rem)] shrink-0 items-end gap-[clamp(0.4rem,0.52vw,0.625rem)]"
          >
            {bars.map((h) => (
              <span
                key={h}
                className={`w-[clamp(0.6rem,0.83vw,1rem)] rounded-[0.25rem] ${tone.bar}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </span>
        </div>
        <p className="mt-3 font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] text-ink/60 uppercase">
          {pkg.price} · {pkg.timeline}
        </p>

        <ul className="mt-[clamp(1.25rem,1.56vw,1.875rem)] mb-8 flex flex-col gap-[clamp(0.875rem,1.35vw,1.625rem)] font-copy text-[clamp(1rem,1.04vw,1.25rem)] font-medium text-ink">
          {pkg.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-[clamp(0.75rem,0.9vw,1rem)]"
            >
              <span
                aria-hidden
                className={`font-haas leading-[1.1] ${tone.star}`}
              >
                ✦
              </span>
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          aria-label={`Get a quote for the ${pkg.name} digital marketing package`}
          className={`mt-auto flex h-[clamp(3.25rem,3.125vw,3.75rem)] items-center justify-center rounded-full font-display text-[clamp(0.875rem,0.885vw,1.0625rem)] text-white uppercase transition-transform duration-300 hover:scale-[1.03] ${pkg.popular ? "bg-blush" : "bg-ink"}`}
        >
          Get a quote
        </Link>
      </article>

      {pkg.popular ? (
        <span className="col-start-1 row-start-1 -mt-[clamp(1rem,1.77vw,2.125rem)] -mr-[clamp(0.25rem,1.04vw,1.25rem)] self-start justify-self-end rotate-[-8deg] rounded-full bg-sunbeam px-[clamp(1.25rem,1.98vw,2.375rem)] py-[clamp(0.75rem,1.04vw,1.25rem)] font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-ink uppercase shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
          Most popular
        </span>
      ) : null}
    </div>
  );
}
