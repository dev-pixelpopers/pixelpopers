import Image from "next/image";

/**
 * The device showcase is a single composed illustration in Figma: a yellow
 * sweep behind the mockup and a cream wave cropping the plinth back into the
 * page. The stage itself sits in normal flow with a fixed aspect ratio; only
 * the two decorative waves are positioned, since overlapping artwork of this
 * kind has no flow equivalent. Every figure is a percentage of the original
 * 2100 × 1214 Figma frame.
 */
export default function ShowcaseSection() {
  return (
    <section aria-label="Work showcase" className="w-full overflow-hidden">
      <div className="relative ml-[-4.01%] aspect-[2100/1214] w-[109.375%]">
        <Image
          aria-hidden
          src="/icons/showcase-wave-top.svg"
          alt=""
          width={2090}
          height={702}
          className="pointer-events-none absolute top-[6.5%] left-[2.7%] w-[96.1%] max-w-none -rotate-[4.92deg]"
        />

        <Image
          src="/assets/showcase-devices.png"
          alt="A studio-designed site shown on a laptop and a phone"
          width={3004}
          height={1786}
          sizes="110vw"
          className="absolute top-[4.7%] left-[2.1%] w-[95.6%] max-w-none"
        />

        <Image
          aria-hidden
          src="/icons/showcase-wave-bottom.svg"
          alt=""
          width={2004}
          height={844}
          className="pointer-events-none absolute top-[76.7%] left-0 w-[95.4%] max-w-none"
        />
      </div>
    </section>
  );
}
