import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  heading: string;
  /** Rendered under the heading in the sticky column (stats, a lead…). */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Figma "Intro · Long-form SEO copy" / "Long-form · After you hit send": a
 * sticky heading column (620) beside a column of real copy (848).
 */
export function LongFormSplit({ id, eyebrow, heading, aside, children, className = "" }: Props) {
  return (
    <section
      aria-labelledby={id}
      className={`shell grid gap-10 lg:grid-cols-[minmax(0,620fr)_minmax(0,848fr)] lg:gap-[clamp(3rem,6.25vw,7.5rem)] ${className}`}
    >
      <div data-reveal className="flex flex-col gap-[clamp(1rem,1.46vw,1.75rem)] lg:sticky lg:top-10 lg:self-start">
        <p className="font-haas text-eyebrow leading-none text-blush uppercase">{eyebrow}</p>
        <h2 id={id} className="font-display text-h3 leading-[1.16] text-grape uppercase">
          {heading}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function StatRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-5 pt-6">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse gap-1.5">
          <dt className="font-copy text-micro font-medium text-ink">{s.label}</dt>
          <dd className="font-display text-[clamp(2rem,2.7vw,3.25rem)] leading-none text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** First paragraph as a lead, the rest as light body copy. */
export function Paragraphs({ items }: { items: string[] }) {
  return (
    <div data-reveal className="flex flex-col gap-7 font-copy">
      {items.map((p, i) =>
        i === 0 ? (
          <p key={i} className="text-lead leading-[1.53] text-ink">
            {p}
          </p>
        ) : (
          <p key={i} className="text-copy leading-[1.67] font-light text-ink/85">
            {p}
          </p>
        ),
      )}
    </div>
  );
}
