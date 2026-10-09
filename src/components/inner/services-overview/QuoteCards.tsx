import type { Quote } from "@/lib/pages/services";

type Props = { id: string; eyebrow: string; heading: string; items: Quote[] };

/**
 * "Kind words": three tilted quote cards, the middle one dropped. Shared by
 * /services and /contact. Carries both the generic `data-reveal` fade (used
 * where the page is wrapped in Reveal) and the `data-wm` hooks the Services
 * page's motion uses — each page only acts on its own.
 */
export default function QuoteCards({ id, eyebrow, heading, items }: Props) {
  return (
    <section data-wm="quotes" aria-labelledby={id} className="shell">
      <div data-reveal data-wm="heading" className="text-center">
        <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">{eyebrow}</p>
        <h2 id={id} data-wm="title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          {heading}
        </h2>
      </div>

      <ul data-reveal-stagger className="mt-[clamp(2.5rem,4.5vw,5.375rem)] grid items-start gap-x-[clamp(1.5rem,1.77vw,2.125rem)] gap-y-14 lg:grid-cols-3">
        {items.map((t) => (
          <li key={t.company} data-wm="quote" className={`w-full max-lg:mx-auto max-lg:max-w-xl ${t.offset}`}>
            <figure
              className={`flex min-h-[clamp(17rem,22.9vw,27.5rem)] flex-col rounded-[32px] px-8 pb-[clamp(1.75rem,1.77vw,2.125rem)] shadow-[0_20px_50px_rgb(34_1_40/0.13)] ${t.card} ${t.tilt}`}
            >
              <span aria-hidden className={`-mt-[clamp(1.5rem,1.56vw,1.875rem)] -ml-1 h-[clamp(5rem,6.8vw,8.125rem)] font-pop text-[clamp(7rem,10.4vw,12.5rem)] leading-none ${t.mark}`}>
                <span data-wm="mark" className="inline-block origin-bottom">
                  “
                </span>
              </span>
              <blockquote className="font-copy text-[clamp(1.0625rem,1.15vw,1.375rem)] leading-[1.55] font-medium">
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-4 pt-8">
                <span aria-hidden data-wm="avatar" className={`grid size-14 shrink-0 place-items-center rounded-full font-display text-[1.375rem] ${t.avatar}`}>
                  {t.initial}
                </span>
                <span data-wm="byline" className="flex flex-col gap-1">
                  <span className="font-haas text-[clamp(0.9375rem,0.94vw,1.125rem)] leading-tight">{t.role}</span>
                  <span className="font-copy text-[0.9375rem] leading-tight opacity-70">{t.company}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
