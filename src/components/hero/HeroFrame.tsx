import Image from "next/image";
import type { ReactNode, Ref } from "react";

import HeroHeadline from "@/components/hero/HeroHeadline";
import HeroBlob from "@/components/ui/HeroBlob";

type HeroFrameProps = {
  ref?: Ref<HTMLDivElement>;
  chars?: boolean;
  /** The project carousel, which shares the blob backdrop with the headline. */
  children?: ReactNode;
};

/**
 * Hero layout — glow, blob, headline, then the carousel — with
 * `data-hero-frame` hooks so the hero's motion can drive the pieces from one
 * scoped `useGSAP`:
 *
 *   data-hero-frame="glow"      background glow wrapper
 *   data-hero-frame="blob"      blob wrapper (HeroBlob owns the SVG inside)
 *   data-hero-frame="headline"  the headline <section>
 */
export default function HeroFrame({ ref, chars, children }: HeroFrameProps) {
  return (
    // z-10: the slider can fold into a cube that travels down over the next
    // section, so the whole hero block paints above what follows it.
    <div ref={ref} className="relative isolate z-10 flex w-full flex-col items-center justify-center">
      <div
        data-hero-frame="glow"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[18%] -z-10 flex justify-center"
      >
        <Image
          src="/icons/hero-ellipse-glow.svg"
          alt=""
          width={2128}
          height={2128}
          className="w-[140%] max-w-none opacity-80 [mask-image:radial-gradient(circle,black_40%,transparent_70%)]"
        />
      </div>
      <div
        data-hero-frame="blob"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
      >
        <HeroBlob />
      </div>

      <section id="top" data-hero-frame="headline" className="relative z-10 w-full pb-8">
        <div className="shell relative flex flex-col items-center pt-[clamp(2rem,6vw,7rem)]">
          <HeroHeadline chars={chars} />
        </div>
      </section>

      {children}
    </div>
  );
}
