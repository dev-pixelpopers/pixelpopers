import Image from "next/image";
import SplitWords from "@/components/ui/SplitWords";
import { inPractice, values } from "@/lib/pages/about";
import { LongFormSplit } from "./LongForm";

const layer = "col-start-1 row-start-1";

/**
 * "What we believe": four tilted value cards, followed by the long-form
 * "In practice" copy. A dashed squiggle runs behind both blocks.
 */
export default function Values() {
  return (
    <div className="relative isolate">
      {/* Pure background artwork spanning two sections; it has no place in the flow. */}
      <Image
        aria-hidden
        data-wm="squiggle"
        src="/assets/inner/about/squiggle.svg"
        alt=""
        width={931}
        height={1278}
        className="pointer-events-none absolute top-[-1.9vw] left-0 -z-10 h-auto w-[48.5vw] max-w-[931px]"
      />

      <section data-wm="values" aria-labelledby="values-title" className="mx-auto max-w-[1920px] px-[clamp(1.25rem,7.8vw,9.375rem)]">
        <div className="grid items-center">
          <Image
            aria-hidden
            src="/assets/inner/about/doodle-loop.svg"
            alt=""
            width={283}
            height={256}
            data-wm="doodle"
            className={`${layer} -ml-[1%] hidden h-auto w-[14.7vw] max-w-[283px] justify-self-start md:block`}
          />
          <Image
            aria-hidden
            src="/assets/inner/about/doodle-bloom.svg"
            alt=""
            width={275}
            height={276}
            data-wm="doodle"
            className={`${layer} -mr-[4%] hidden h-auto w-[14.3vw] max-w-[275px] justify-self-end md:block`}
          />
          <div data-wm="heading" className={`${layer} text-center`}>
            <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">What we believe</p>
            <h2 id="values-title" className="mt-[0.3em] font-display text-section leading-[1.12] text-grape uppercase">
              <SplitWords text="What makes us pop" name="wm-words" />
            </h2>
          </div>
        </div>

        <ul data-wm="value-cards" className="mt-[clamp(2.5rem,4.6vw,5.5rem)] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li
              key={v.title.join(" ")}
              data-wm="value"
              className={`grid overflow-hidden rounded-[32px] shadow-[0_16px_40px_rgb(0_0_0/0.12)] ${v.bg} ${v.tilt} ${v.tone === "light" ? "text-white" : "text-ink"}`}
            >
              <span aria-hidden data-wm="value-num" className={`${layer} -mt-[15%] ml-[55%] font-pop text-[clamp(10rem,18.75vw,22.5rem)] leading-[1.1] text-white/[0.22] select-none`}>
                {i + 1}
              </span>
              <div className={`${layer} flex flex-col gap-[clamp(0.75rem,1.2vw,1.375rem)] px-[9%] pt-[32%] pb-[12%] sm:pt-[55%] sm:pb-[15%]`}>
                <h3 className="font-display text-[clamp(1.5rem,1.98vw,2.375rem)] leading-[1.16] uppercase">
                  {v.title[0]}
                  <br />
                  {v.title[1]}
                </h3>
                <p className={`font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.58] ${v.tone === "light" ? "text-white/90" : "text-ink/90"}`}>
                  {v.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <LongFormSplit
        id="practice-title"
        eyebrow={inPractice.eyebrow}
        heading={inPractice.heading}
        paragraphs={inPractice.paragraphs}
        className="mt-[clamp(5rem,8.33vw,10rem)]"
      />
    </div>
  );
}
