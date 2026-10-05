import PopButton from "@/components/ui/PopButton";
import { howWeWork } from "@/lib/pages/about";

/**
 * "How we work — From spark to pop": the dark rounded band with four numbered
 * steps joined by a hairline. Columns follow Figma's 440px rhythm.
 */
export default function Process() {
  return (
    <section
      aria-labelledby="process-title"
      className="mx-auto w-full max-w-[1920px] overflow-hidden rounded-[clamp(2rem,3.33vw,4rem)] bg-[#22062b] bg-[radial-gradient(ellipse_30%_40%_at_13%_9%,rgb(106_75_151/0.6),transparent_75%),radial-gradient(ellipse_26%_36%_at_94%_85%,rgb(242_119_147/0.3),transparent_75%)] py-[clamp(4rem,5.73vw,6.875rem)] pb-[clamp(4rem,8.33vw,10rem)] pl-[clamp(1.25rem,8.65vw,10.375rem)] pr-[clamp(1.25rem,3.85vw,4.625rem)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 lg:pr-[10.4%]">
        <div data-reveal>
          <p className="font-haas text-eyebrow leading-none text-blush uppercase">{howWeWork.eyebrow}</p>
          <h2 id="process-title" className="mt-[0.3em] font-display text-section leading-[1.12] text-white uppercase">
            {howWeWork.heading}
          </h2>
        </div>
        <PopButton
          href={howWeWork.cta.href}
          label={howWeWork.cta.label}
          className="mb-[clamp(0.5rem,0.73vw,0.875rem)] [&>span:first-child]:bg-blush [&>span:last-child]:text-white"
        />
      </div>

      <ol data-reveal-stagger className="mt-[clamp(3rem,4.06vw,4.875rem)] grid gap-x-0 gap-y-12 sm:grid-cols-2 lg:grid-cols-[440fr_440fr_440fr_360fr]">
        {howWeWork.steps.map((s, i) => (
          <li key={s.n} className="flex flex-col">
            <div className="flex items-center">
              <span
                aria-hidden
                className={`grid size-[clamp(5rem,7.29vw,8.75rem)] shrink-0 place-items-center rounded-full font-pop text-[clamp(2.75rem,4.17vw,5rem)] leading-none ${s.dot}`}
              >
                {s.n}
              </span>
              {i < howWeWork.steps.length - 1 ? <span aria-hidden className="hidden h-0.5 flex-1 bg-white/25 lg:block" /> : null}
            </div>
            <h3 className="mt-[clamp(1.5rem,2.08vw,2.5rem)] font-display text-[clamp(1.375rem,1.77vw,2.125rem)] leading-tight text-white uppercase">
              <span className="sr-only">Step {s.n}: </span>
              {s.title}
            </h3>
            <p className="mt-3 max-w-[22.5rem] pr-6 font-copy text-small leading-[1.6] font-light text-white/75">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
