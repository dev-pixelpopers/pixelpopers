import Breadcrumb from "@/components/inner/Breadcrumb";
import PopButton from "@/components/ui/PopButton";
import { servicesHero } from "@/lib/pages/services";

/*
  Hero of Figma frame 332:21. Offsets are percentages of the shell's content
  width (1588 at 1920): "WHAT WE" / "DO BEST" and the intro row start at
  x 495 (20.7%), "& DO LOUD" hangs out to x 324 (9.95%).
*/
export default function Hero() {
  const [l1, l2, l3] = servicesHero.lines;

  return (
    <section aria-labelledby="services-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)] bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_36%_22%_at_49%_62%,rgb(159_201_204/0.5),transparent_75%)]"
      />

      <div className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

        <h1 id="services-title" data-reveal className="mt-[clamp(2rem,3.1vw,3.75rem)] uppercase">
          <span className="ml-[6%] block font-display text-hero-sm leading-[1.07] text-blush sm:ml-[20.7%]">{l1}</span>
          <span className="ml-[6%] block font-haas text-hero-md leading-[1.14] tracking-[-0.033em] text-grape sm:ml-[20.7%]">
            {l2}
          </span>
          <span className="block font-display text-[clamp(2.5rem,6.67vw,8rem)] leading-[1.17] whitespace-nowrap text-lagoon sm:ml-[9.95%]">
            {l3}
          </span>
        </h1>

        <div
          data-reveal
          className="mt-[clamp(1.75rem,4.6vw,5.5rem)] flex flex-wrap items-center gap-x-[clamp(2rem,4.7vw,5.625rem)] gap-y-6 sm:ml-[20.7%]"
        >
          <p className="max-w-[clamp(18rem,32.3vw,38.75rem)] font-copy text-body leading-[1.64] font-light text-ink">
            {servicesHero.intro}
          </p>
          <PopButton href={servicesHero.cta.href} label={servicesHero.cta.label} className="[&>span:last-child]:text-ink" />
        </div>
      </div>
    </section>
  );
}
