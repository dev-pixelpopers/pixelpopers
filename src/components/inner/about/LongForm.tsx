import { Burst } from "@/components/inner/motion/bits";
import SplitWords from "@/components/ui/SplitWords";
import { audience } from "@/lib/pages/about";

type SplitProps = {
  id: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  stats?: { value: string; label: string }[];
  className?: string;
};

/**
 * Figma "Long-form · Our full story" / "Long-form · How we work": a sticky
 * heading column (620) beside a column of real paragraphs (848), the first
 * set as a lead. Motion hooks (`data-wm`) are picked up by AboutMotion.
 */
export function LongFormSplit({ id, eyebrow, heading, paragraphs, stats, className = "" }: SplitProps) {
  return (
    <section
      aria-labelledby={id}
      data-wm="longform"
      className={`shell grid gap-10 lg:grid-cols-[minmax(0,620fr)_minmax(0,848fr)] lg:gap-[clamp(3rem,6.25vw,7.5rem)] ${className}`}
    >
      <div className="flex flex-col gap-[clamp(1rem,1.46vw,1.75rem)] lg:sticky lg:top-10 lg:self-start">
        <div data-wm="heading" className="flex flex-col gap-[clamp(1rem,1.46vw,1.75rem)]">
          <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">{eyebrow}</p>
          <h2 id={id} className="font-display text-h3 leading-[1.16] text-grape uppercase">
            <SplitWords text={heading} name="wm-words" />
          </h2>
        </div>
        {stats ? (
          <dl data-wm="stat-row" className="flex flex-wrap gap-x-10 gap-y-5 pt-6">
            {stats.map((s) => (
              <div key={s.label} data-wm="stat" className="relative flex flex-col-reverse gap-1.5">
                <dt data-wm="stat-label" className="font-copy text-micro font-medium text-ink">{s.label}</dt>
                <dd className="relative font-display text-[clamp(2rem,2.7vw,3.25rem)] leading-none text-ink">
                  <span data-wm="stat-value" data-value={s.value} className="inline-block origin-bottom-left">
                    {s.value}
                  </span>
                  <Burst pieces={8} className="top-1/2 left-[0.6em] size-0" />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="flex flex-col gap-7 font-copy">
        {paragraphs.map((p, i) =>
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
  );
}

/** Figma "Long-form · Who we work with": heading + lead, three audience cards, closing paragraph. */
export function Audience() {
  return (
    <section data-wm="audience" aria-labelledby="audience-title" className="shell flex flex-col gap-[clamp(2rem,2.9vw,3.5rem)]">
      <div data-wm="heading" className="grid gap-8 lg:grid-cols-[minmax(0,760fr)_minmax(0,708fr)] lg:items-end lg:gap-[clamp(3rem,6.25vw,7.5rem)]">
        <div>
          <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">{audience.eyebrow}</p>
          <h2 id="audience-title" className="mt-3 font-display text-h2 leading-[1.1] text-grape uppercase">
            <SplitWords text={audience.heading} name="wm-words" />
          </h2>
        </div>
        <p data-wm="lead" className="font-copy text-lead leading-[1.53] text-ink">
          {audience.lead}
        </p>
      </div>

      <ul data-wm="audience-cards" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {audience.cards.map((c, i) => (
          <li key={c.title} data-wm="audience-card" className="flex flex-col gap-[1.125rem] rounded-3xl bg-white p-[clamp(1.75rem,2.1vw,2.5rem)]">
            <span className="relative self-start">
              <span data-wm="pill" className="inline-block rounded-full bg-blush px-[1.125rem] py-2.5 font-haas text-[clamp(0.8125rem,0.94vw,1.125rem)] leading-none text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Burst pieces={8} ring="border-blush" className="inset-0" />
            </span>
            <h3 className="font-haas text-card leading-tight text-ink">{c.title}</h3>
            <p className="font-copy text-small leading-[1.6] font-light text-ink">{c.body}</p>
          </li>
        ))}
      </ul>

      <p data-wm="para" className="max-w-[68.75rem] font-copy text-copy leading-[1.67] font-light text-ink/85">
        {audience.closing}
      </p>
    </section>
  );
}
