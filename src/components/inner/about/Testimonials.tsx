import SplitWords from "@/components/ui/SplitWords";
import { testimonials } from "@/lib/pages/about";

/** "Kind words — What clients say": three tilted quote cards, the middle one dropped. */
export default function Testimonials() {
  return (
    <section data-wm="quotes" aria-labelledby="testimonials-title" className="shell">
      <div data-wm="heading" className="text-center">
        <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">{testimonials.eyebrow}</p>
        <h2 id="testimonials-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          <SplitWords text={testimonials.heading} name="wm-words" />
        </h2>
      </div>

      <ul className="mt-[clamp(2.5rem,4.5vw,5.375rem)] grid items-start gap-[clamp(1.5rem,1.77vw,2.125rem)] lg:grid-cols-3">
        {testimonials.items.map((t) => (
          <li key={t.company} data-wm="quote" className={`w-full max-lg:mx-auto max-lg:max-w-xl ${t.offset}`}>
            <figure
              className={`flex min-h-[clamp(18rem,22.9vw,27.5rem)] flex-col overflow-hidden rounded-[32px] px-8 pb-[clamp(1.75rem,1.77vw,2.125rem)] shadow-[0_20px_50px_rgb(0_0_0/0.13)] ${t.card} ${t.tilt}`}
            >
              <span aria-hidden className={`-mt-[clamp(1.5rem,2.3vw,2.75rem)] -ml-1 font-pop text-[clamp(7rem,10.4vw,12.5rem)] leading-none ${t.mark}`}>
                <span data-wm="mark" className="inline-block origin-bottom">
                  “
                </span>
              </span>
              <blockquote className="-mt-[clamp(1.5rem,2.3vw,2.75rem)] font-copy text-[clamp(1.0625rem,1.15vw,1.375rem)] leading-[1.55] font-medium">
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
