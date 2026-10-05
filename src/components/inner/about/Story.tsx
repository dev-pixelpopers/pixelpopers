import Image from "next/image";
import BrandLogo from "@/components/ui/BrandLogo";
import { owners, type Owner } from "@/lib/site-content";
import { aboutStory } from "@/lib/pages/about";

const ring: Record<Owner["accent"], string> = {
  sunbeam: "bg-sunbeam",
  lagoon: "bg-lagoon",
  blush: "bg-blush",
};

/** Figma tilts the three cards -2°, 1°, -1° (counter-clockwise positive). */
const tilts = ["rotate-2", "-rotate-1", "rotate-1"];

/** "Our story": the founders on the left, the short story and stats on the right. */
export default function Story() {
  return (
    <section
      id="team"
      aria-labelledby="story-title"
      className="shell grid scroll-mt-10 gap-[clamp(3rem,6.98vw,8.375rem)] pt-[clamp(5rem,8.33vw,10rem)] lg:grid-cols-[minmax(0,560fr)_minmax(0,894fr)]"
    >
      <div className="flex flex-col gap-[clamp(2rem,2.9vw,3.5rem)] pt-10">
        <BrandLogo className="w-[clamp(8rem,9.9vw,11.875rem)]" />
        <ul data-reveal-stagger aria-label="Our founders" className="flex max-w-[35rem] flex-col gap-[clamp(1.25rem,1.56vw,1.875rem)]">
          {owners.map((o, i) => (
            <li
              key={o.name}
              className={`flex items-center gap-[clamp(1rem,1.35vw,1.625rem)] rounded-[20px] bg-white p-[clamp(1rem,1.46vw,1.75rem)] shadow-[0_16px_40px_rgb(0_0_0/0.12)] ${tilts[i]}`}
            >
              <span className={`grid size-[clamp(4rem,5vw,6rem)] shrink-0 place-items-center rounded-full ${ring[o.accent]}`}>
                <Image
                  src={o.avatar}
                  alt={`Portrait of ${o.name}`}
                  width={192}
                  height={192}
                  className="size-[85%] rounded-full bg-cream object-cover"
                />
              </span>
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="font-display text-[clamp(1.125rem,1.56vw,1.875rem)] leading-tight text-grape uppercase">{o.name}</span>
                <span className="font-copy text-[clamp(0.875rem,0.94vw,1.125rem)] text-ink/75">{o.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-start">
        <p data-reveal className="font-haas text-eyebrow leading-none text-blush uppercase">
          {aboutStory.eyebrow}
        </p>
        <h2 id="story-title" data-reveal className="mt-[clamp(0.75rem,1vw,1.25rem)] font-display text-section leading-[1.12] text-grape uppercase">
          {aboutStory.heading[0]}
          <br />
          {aboutStory.heading[1]}
        </h2>
        <p data-reveal className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[56.25rem] font-copy text-body leading-[1.64] font-light text-ink">
          {aboutStory.body}
        </p>
        <span aria-hidden className="mt-[clamp(2rem,2.7vw,3.25rem)] h-[5px] w-[clamp(5rem,6.25vw,7.5rem)] rounded-full bg-sunbeam" />
        <p data-reveal className="mt-[clamp(1.25rem,1.4vw,1.75rem)] font-display text-[clamp(1rem,1.46vw,1.75rem)] leading-tight text-ink uppercase">
          {aboutStory.philosophy}
        </p>
        <dl data-reveal-stagger className="mt-[clamp(1.75rem,2.2vw,2.625rem)] grid w-full max-w-[57.5rem] grid-cols-3 gap-[clamp(0.625rem,1.04vw,1.25rem)]">
          {aboutStory.stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse justify-between gap-3 rounded-[20px] border border-white bg-white/70 px-[clamp(0.875rem,1.46vw,1.75rem)] pt-1 pb-[clamp(1rem,1.7vw,2rem)] shadow-[0_16px_40px_rgb(0_0_0/0.12)]"
            >
              <dt className="font-haas text-[clamp(0.625rem,0.83vw,1rem)] leading-tight text-ink uppercase">{s.label}</dt>
              <dd className={`font-pop text-[clamp(3rem,6.25vw,7.5rem)] leading-[1.08] ${s.tone}`}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
