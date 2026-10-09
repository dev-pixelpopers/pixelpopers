import SplitWords from "@/components/ui/SplitWords";
import { journey } from "@/lib/pages/about";

/**
 * "Our journey" 2019 → 2026. Columns have no gap so each column's track
 * segment meets the next one, drawing one continuous timeline on desktop.
 */
export default function Journey() {
  return (
    <section aria-labelledby="journey-title" className="shell">
      <div data-wm="heading">
        <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush-ink uppercase">{journey.eyebrow}</p>
        <h2 id="journey-title" className="mt-[0.3em] font-display text-h2 leading-[1.16] text-grape uppercase">
          <SplitWords text={journey.heading[0]} name="wm-words" />
          <br className="hidden sm:block" /> <SplitWords text={journey.heading[1]} name="wm-words" />
        </h2>
      </div>

      <ol data-wm="journey" className="mt-[clamp(2rem,2.5vw,3rem)] grid grid-cols-2 gap-y-10 lg:grid-cols-5">
        {journey.milestones.map((m) => (
          <li key={m.year} data-wm="milestone" className="flex flex-col">
            <span className={`font-pop text-[clamp(3.5rem,5vw,6rem)] leading-[1.15] ${m.color}`}>
              <span data-wm="year" className="inline-block origin-bottom">
                {m.year}
              </span>
            </span>
            <div aria-hidden className="-mt-1.5 flex items-center">
              <span data-wm="milestone-dot" className={`size-7 shrink-0 rounded-full border-[5px] border-cream ${m.dot}`} />
              <span data-wm="milestone-line" className="h-1 flex-1 rounded-full bg-ink/15 max-lg:hidden" />
            </div>
            <h3 data-wm="milestone-text" className="mt-[clamp(0.75rem,1vw,1.25rem)] pr-6 font-display text-[clamp(1.125rem,1.15vw,1.375rem)] leading-[1.27] text-grape uppercase">
              {m.title}
            </h3>
            <p data-wm="milestone-text" className="mt-3 max-w-[18rem] pr-6 font-copy text-[clamp(0.9375rem,0.94vw,1.125rem)] leading-[1.56] text-ink/80">{m.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
