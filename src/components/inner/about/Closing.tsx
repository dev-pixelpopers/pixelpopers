import Image from "next/image";
import { Burst, Chars } from "@/components/inner/motion/bits";
import PopButton from "@/components/ui/PopButton";
import { aboutCta } from "@/lib/pages/about";

/** Closing CTA "Let's build something extraordinary together", with the yellow loop doodle. */
export default function Closing() {
  return (
    <section data-wm="cta" aria-labelledby="cta-title" className="shell grid">
      <Image
        aria-hidden
        src="/assets/inner/about/doodle-loop.svg"
        alt=""
        width={283}
        height={256}
        data-wm="doodle"
        className="col-start-1 row-start-1 -mt-[clamp(3rem,6.6vw,8rem)] -mr-[6%] hidden h-auto w-[11.8vw] max-w-[226px] justify-self-end md:block"
      />
      <div className="col-start-1 row-start-1 grid gap-10 lg:grid-cols-[minmax(0,900fr)_minmax(0,560fr)] lg:gap-[clamp(1.5rem,1.77vw,2.125rem)] lg:px-[3.8%]">
        <div>
          <p data-wm="eyebrow" className="font-haas text-eyebrow leading-none text-blush uppercase">{aboutCta.eyebrow}</p>
          <h2
            id="cta-title"
            aria-label={aboutCta.heading.join(" ")}
            className="mt-[0.2em] font-display text-h2 leading-[1.16] text-grape uppercase"
          >
            <span aria-hidden>
              <Chars text={aboutCta.heading[0]} />
              <br />
              <Chars text={aboutCta.heading[1]} />
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-[clamp(1.5rem,2.7vw,3.25rem)] lg:pt-10">
          <p data-wm="cta-copy" className="max-w-[35rem] font-copy text-body leading-[1.64] font-light text-ink">{aboutCta.body}</p>
          <div className="relative">
            <div data-wm="cta-btn">
              <PopButton href={aboutCta.cta.href} label={aboutCta.cta.label} className="[&>span:last-child]:text-ink" />
            </div>
            <Burst pieces={14} ring="border-blush" className="top-1/2 left-[2.5rem] size-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
