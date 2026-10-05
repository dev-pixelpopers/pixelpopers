import Breadcrumb from "@/components/inner/Breadcrumb";
import { workHero } from "@/lib/pages/work";

/*
  Hero of Figma frame 333:21. "SELECTED" and "WORK THAT" start 495px into the
  frame, "POPS OFF" at 324px; the yellow count badge sits in the same grid
  cell, pinned to the right edge.
*/
export default function Hero() {
  const [l1, l2, l3] = workHero.lines;

  return (
    <section aria-labelledby="work-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)] bg-[radial-gradient(ellipse_30%_34%_at_50%_8%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_38%_22%_at_49%_66%,rgb(159_201_204/0.5),transparent_75%)]"
      />

      <div className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
      </div>

      <div className="shell mt-[clamp(1.5rem,3.1vw,3.75rem)] grid">
        <h1 id="work-title" data-reveal className="col-start-1 row-start-1 uppercase">
          <span className="block font-display text-hero-sm leading-[1.07] text-blush sm:ml-[min(17.1vw,20.5625rem)]">{l1}</span>
          <span className="block font-haas text-hero-md leading-[1.14] tracking-[-0.03em] text-grape sm:ml-[min(17.1vw,20.5625rem)]">{l2}</span>
          <span className="block font-display text-[clamp(2.25rem,6.67vw,8rem)] leading-[1.17] text-lagoon sm:ml-[min(8.2vw,9.875rem)]">{l3}</span>
        </h1>

        <p
          data-reveal
          className="col-start-1 row-start-1 mt-[clamp(0rem,2.6vw,3.125rem)] mr-[1.25vw] grid size-[clamp(5.5rem,8.85vw,10.625rem)] rotate-[10deg] content-center justify-items-center self-start justify-self-end rounded-full bg-sunbeam text-ink max-sm:-mt-6"
        >
          <span className="font-pop text-[clamp(2.75rem,4.69vw,5.625rem)] leading-[1.05]">{workHero.count}</span>
          <span className="font-display text-[clamp(0.625rem,0.83vw,1rem)] uppercase">Projects</span>
        </p>
      </div>
    </section>
  );
}
