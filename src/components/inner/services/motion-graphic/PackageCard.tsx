import Link from "next/link";
import type { Package } from "@/lib/service-content";

const nameTone = ["text-sunbeam", "text-blush-ink", "text-sunbeam"];

function Sprockets() {
  return (
    <span aria-hidden className="flex justify-between px-[4.6%]">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="aspect-[28/18] w-[5.38%] rounded-[4px] bg-white/[0.22]" />
      ))}
    </span>
  );
}

/** Figma "Package — STARTER / GROWTH / FULL POP" on 03.5 Motion Graphic: a strip of film. */
export default function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  return (
    <div className="grid h-full">
      <article className="col-start-1 row-start-1 flex h-full min-h-[clamp(30rem,32.3vw,38.75rem)] flex-col rounded-[clamp(1.5rem,1.67vw,2rem)] bg-ink pt-[2.7%] pb-[2.7%] text-white shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
        <Sprockets />

        <div className="flex grow flex-col px-[9.23%] pt-[clamp(1.25rem,1.67vw,2rem)] pb-[clamp(1.25rem,1.3vw,1.5rem)]">
          <h3 className={`font-display text-[clamp(1.75rem,1.98vw,2.375rem)] leading-[1.26] uppercase ${pkg.popular ? "text-blush-ink" : nameTone[index % nameTone.length]}`}>
            {pkg.name}
          </h3>
          <p className="mt-1 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] text-white/80">{pkg.summary}</p>
          <p className="mt-2 font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] text-lav uppercase">
            {pkg.price} · {pkg.timeline}
          </p>

          <ul className="mt-[clamp(1.25rem,1.56vw,1.875rem)] mb-8 flex flex-col gap-[clamp(0.875rem,1.35vw,1.625rem)] font-copy text-[clamp(1rem,1.04vw,1.25rem)] font-medium">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-center gap-[clamp(0.75rem,0.9vw,1rem)]">
                <span aria-hidden className="grid size-[1.1em] shrink-0 place-items-center rounded-[0.2em] bg-[#8aa4c8]">
                  <svg viewBox="0 0 10 10" className="w-[0.55em] fill-white">
                    <path d="M1 0.5 9.5 5 1 9.5z" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            aria-label={`Get a quote for the ${pkg.name} motion graphics package`}
            className={`mt-auto flex h-[clamp(3.25rem,3.125vw,3.75rem)] items-center justify-center rounded-full font-display text-[clamp(0.875rem,0.885vw,1.0625rem)] uppercase transition-transform duration-300 hover:scale-[1.03] ${pkg.popular ? "bg-blush text-white" : "bg-white text-ink"}`}
          >
            Get a quote
          </Link>
        </div>

        <Sprockets />
      </article>

      {pkg.popular ? (
        <span className="col-start-1 row-start-1 -mt-[clamp(1rem,1.77vw,2.125rem)] -mr-[clamp(0.25rem,1.04vw,1.25rem)] w-[42.3%] rotate-[-8deg] self-start justify-self-end rounded-full bg-sunbeam py-[clamp(0.75rem,1.04vw,1.25rem)] text-center font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-ink uppercase shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
          Most popular
        </span>
      ) : null}
    </div>
  );
}
