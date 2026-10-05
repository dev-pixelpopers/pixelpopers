import Image from "next/image";
import Breadcrumb from "@/components/inner/Breadcrumb";
import PopButton from "@/components/ui/PopButton";
import { aboutHero } from "@/lib/pages/about";

/*
  Hero of Figma frame 330:21. The three headline lines share one `w-fit`
  block sized by the widest line ("BEHIND THE POP"), so the first two lines
  and the intro row can be indented by the same percentage as in Figma
  (171 / 1256 ≈ 13.6%). The image band is a single-cell grid: the
  three-photo collage and both stickers occupy the same cell.
*/

const layer = "col-start-1 row-start-1";

export default function Hero() {
  const [l1, l2, l3] = aboutHero.lines;
  const [left, middle, right] = aboutHero.images;

  return (
    <section aria-labelledby="about-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)] bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_36%_22%_at_49%_62%,rgb(159_201_204/0.5),transparent_75%)]"
      />

      <div className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </div>

      <div className="mx-auto mt-[clamp(2rem,3.1vw,3.75rem)] w-fit max-w-full px-5">
        <h1 id="about-title" data-reveal className="uppercase">
          <span className="ml-[13.6%] block font-display text-hero-sm leading-[1.12] text-blush">{l1}</span>
          <span className="ml-[13.6%] block font-haas text-hero-md leading-[1.05] tracking-[-0.05em] text-grape">{l2}</span>
          <span className="block font-display text-[clamp(1.75rem,6.67vw,8rem)] leading-[1.17] whitespace-nowrap text-lagoon">{l3}</span>
        </h1>

        <div data-reveal className="mt-[clamp(2rem,5.6vw,6.75rem)] flex flex-wrap items-start gap-x-[clamp(2rem,4.7vw,5.625rem)] gap-y-8 sm:ml-[13.6%]">
          <p className="max-w-[clamp(18rem,32.3vw,38.75rem)] font-copy text-body leading-[1.64] font-light text-ink">{aboutHero.intro}</p>
          <PopButton href={aboutHero.cta.href} label={aboutHero.cta.label} className="mt-2.5 [&>span:last-child]:text-ink" />
        </div>
      </div>

      <div className="mx-auto mt-[clamp(2.5rem,4.8vw,5.75rem)] grid max-w-[1920px] px-[clamp(1.25rem,6.25vw,7.5rem)]">
        <div data-reveal-stagger className={`${layer} grid grid-cols-[600fr_440fr_600fr] items-center gap-[clamp(0.5rem,1.04vw,1.25rem)]`}>
          {[left, middle, right].map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.w}
              height={img.h}
              priority={i === 1}
              sizes="(min-width: 1920px) 600px, 33vw"
              className="h-auto w-full rounded-[clamp(0.875rem,2.08vw,2.5rem)] object-cover"
            />
          ))}
        </div>

        <p className={`${layer} mt-[1.2%] ml-[1.8%] rotate-[7deg] self-start justify-self-start rounded-full bg-sunbeam px-[clamp(0.875rem,2.1vw,2.5rem)] py-[clamp(0.5rem,1.4vw,1.75rem)] font-display text-[clamp(0.625rem,1.04vw,1.25rem)] leading-none text-ink uppercase`}>
          {aboutHero.stickers[0]}
        </p>
        <p className={`${layer} mr-[1.2%] -mb-[0.4%] -rotate-6 self-end justify-self-end rounded-full bg-blush px-[clamp(0.875rem,2.1vw,2.5rem)] py-[clamp(0.5rem,1.4vw,1.75rem)] font-display text-[clamp(0.625rem,1.04vw,1.25rem)] leading-none text-white uppercase`}>
          {aboutHero.stickers[1]}
        </p>
      </div>
    </section>
  );
}
