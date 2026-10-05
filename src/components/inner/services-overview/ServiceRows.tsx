"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { serviceDetails } from "@/lib/service-content";
import { serviceRows, type Tone } from "@/lib/pages/services";

const toneText: Record<Tone, string> = {
  blush: "text-blush",
  grape: "text-grape",
  lagoon: "text-lagoon",
  sunbeam: "text-sunbeam",
};

/**
 * The six service rows of Figma frame 332:21. One row is "active" (grape
 * panel, white type) — the second by default as in Figma — and the highlight
 * follows the pointer / keyboard focus.
 */
export default function ServiceRows() {
  const [active, setActive] = useState(1);

  return (
    <section aria-label="Our services" className="shell">
      <ol data-reveal-stagger className="flex flex-col">
        {serviceRows.map((row, i) => {
          const detail = serviceDetails.find((s) => s.slug === row.slug)!;
          const on = active === i;
          return (
            <li
              key={row.slug}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="border-b border-ink/15 py-[clamp(0.625rem,1.04vw,1.25rem)]"
            >
              <article
                className={`-mx-[clamp(0.75rem,2.4vw,2.875rem)] grid gap-x-[clamp(1rem,2vw,2.5rem)] gap-y-6 rounded-[clamp(1.5rem,2.08vw,2.5rem)] px-[clamp(0.75rem,2.4vw,2.875rem)] py-[clamp(1.25rem,1.56vw,1.875rem)] transition-colors duration-300 md:grid-cols-[minmax(0,1fr)_minmax(0,560fr)] lg:grid-cols-[minmax(0,174fr)_minmax(0,620fr)_minmax(0,794fr)] lg:gap-x-0 ${on ? "bg-grape shadow-[0_20px_50px_rgb(34_1_40/0.14)]" : "bg-transparent"}`}
              >
                <span
                  aria-hidden
                  className={`font-pop text-[clamp(3.5rem,5.73vw,6.875rem)] leading-[1.09] max-lg:hidden ${toneText[row.tone]}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-col items-start pt-[clamp(0rem,1.04vw,1.25rem)]">
                  <h2 className={`flex items-baseline gap-4 font-display lg:w-max lg:whitespace-nowrap text-[clamp(1.75rem,3.125vw,3.75rem)] leading-[1.2] uppercase transition-colors ${on ? "text-white" : "text-grape"}`}>
                    <span aria-hidden className={`font-pop leading-none lg:hidden ${toneText[row.tone]}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {detail.name}
                  </h2>
                  <p className={`mt-[clamp(0.75rem,1.46vw,1.75rem)] max-w-[38.75rem] font-copy text-body leading-[1.64] font-light transition-colors ${on ? "text-white" : "text-ink"}`}>
                    {row.blurb}
                  </p>
                  <ul aria-label={`${detail.name} includes`} className="mt-[clamp(1rem,1.67vw,2rem)] flex flex-wrap gap-2.5">
                    {row.tags.map((t) => (
                      <li
                        key={t}
                        className={`rounded-full border px-[1.125rem] py-2 font-copy text-[0.9375rem] leading-none font-medium transition-colors ${on ? "border-white bg-white text-grape" : "border-ink/40 text-ink"}`}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${row.slug}`}
                    className={`mt-[clamp(1.25rem,1.82vw,2.25rem)] font-display text-[clamp(0.9375rem,0.94vw,1.125rem)] uppercase transition-colors hover:underline ${on ? "text-sunbeam" : "text-blush"}`}
                  >
                    Explore<span className="sr-only"> {detail.name}</span> →
                  </Link>
                </div>

                <div className="grid md:self-center lg:mr-[1.8%] lg:w-[70.5%] lg:justify-self-end">
                  <Image
                    src={row.image.src}
                    alt={row.image.alt}
                    width={row.image.w}
                    height={row.image.h}
                    sizes="(min-width: 1920px) 560px, (min-width: 768px) 40vw, 92vw"
                    className="aspect-[560/340] w-full -rotate-2 rounded-[clamp(1.25rem,1.67vw,2rem)] border-[clamp(5px,0.42vw,8px)] border-white bg-blush object-cover shadow-[0_20px_50px_rgb(34_1_40/0.14)] col-start-1 row-start-1"
                  />
                  {row.slug === "web-development" ? (
                    // Decorative pink loop hanging under the image (Figma doodle 332:39).
                    <Image
                      aria-hidden
                      src="/assets/inner/services/doodle-loop-pink.svg"
                      alt=""
                      width={283}
                      height={256}
                      className="pointer-events-none col-start-1 row-start-1 z-10 mr-[24%] -mb-[15%] hidden h-auto w-[15%] rotate-[100deg] self-end justify-self-end lg:block"
                    />
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
