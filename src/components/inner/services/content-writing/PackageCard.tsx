import Link from "next/link";
import type { Package } from "@/lib/service-content";
import { serif } from "@/lib/inner-fonts";

/** Per-card look from Figma: tilt (Figma −2° / 1° / 2°, flipped for CSS), title and pencil colours. */
const looks = [
  { tilt: "rotate-[2deg]", name: "text-grape", pencil: "text-lagoon" },
  { tilt: "rotate-[-1deg]", name: "text-blush", pencil: "text-grape" },
  { tilt: "rotate-[-2deg]", name: "text-grape", pencil: "text-blush" },
];

/** Figma "Package — STARTER / GROWTH / FULL POP" on 03.6 Content Writing: a taped sheet of lined paper. */
export default function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const look = looks[index % looks.length];

  return (
    <div className={`grid h-full ${look.tilt}`}>
      <article className="col-start-1 row-start-1 grid h-full min-h-[clamp(30rem,32.3vw,38.75rem)] rounded-[8px] bg-[#FFFBF4] shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
        {/* Ruled lines (every 36 Figma px from y 130) and the pink margin rule. */}
        <span
          aria-hidden
          className="col-start-1 row-start-1 mt-[clamp(6rem,6.77vw,8.125rem)] mb-[clamp(2.5rem,3vw,3.625rem)]"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgb(63 183 199 / 0.25) 0 1px, transparent 1px clamp(1.75rem, 1.875vw, 2.25rem))" }}
        />
        <span aria-hidden className="col-start-1 row-start-1 ml-[6.9%] w-0.5 justify-self-start bg-blush/60" />

        <div className="col-start-1 row-start-1 flex flex-col pt-[clamp(2rem,2.6vw,3.125rem)] pr-[11.5%] pb-[clamp(2rem,2.6vw,3.125rem)] pl-[11.5%]">
          <h3 className={`${serif.className} text-[clamp(1.75rem,2.08vw,2.5rem)] leading-[1.3] font-bold uppercase ${pkg.popular ? "text-blush" : look.name}`}>{pkg.name}</h3>
          <p className="font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] text-ink/80">{pkg.summary}</p>
          <p className={`${serif.className} mt-1.5 text-[clamp(0.9375rem,0.94vw,1.125rem)] text-ink/60 italic`}>
            {pkg.price} · {pkg.timeline}
          </p>

          <ul className="mt-[clamp(1.25rem,1.56vw,1.875rem)] mb-8 flex flex-col gap-[clamp(0.875rem,1.35vw,1.625rem)] font-copy text-[clamp(1rem,1.04vw,1.25rem)] font-medium text-ink">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-[clamp(0.75rem,0.9vw,1rem)]">
                <span aria-hidden className={`font-bold ${look.pencil}`}>
                  ✎
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            aria-label={`Get a quote for the ${pkg.name} content writing package`}
            className={`mt-auto flex h-[clamp(3.25rem,3.125vw,3.75rem)] items-center justify-center rounded-full font-display text-[clamp(0.875rem,0.885vw,1.0625rem)] text-white uppercase transition-transform duration-300 hover:scale-[1.03] ${pkg.popular ? "bg-blush" : "bg-ink"}`}
          >
            Get a quote
          </Link>
        </div>
      </article>

      {/* Tape strip, poking above the sheet. */}
      <span aria-hidden className="col-start-1 row-start-1 -mt-1.5 h-[clamp(1.75rem,1.875vw,2.25rem)] w-[23%] self-start justify-self-center bg-sunbeam/80" />

      {pkg.popular ? (
        <span className="col-start-1 row-start-1 -mt-[clamp(1rem,1.77vw,2.125rem)] -mr-[clamp(0.25rem,1.04vw,1.25rem)] w-[42.3%] rotate-[-7deg] self-start justify-self-end rounded-full bg-sunbeam py-[clamp(0.75rem,1.04vw,1.25rem)] text-center font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-ink uppercase shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
          Most popular
        </span>
      ) : null}
    </div>
  );
}
