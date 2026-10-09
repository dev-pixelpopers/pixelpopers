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
    // z-20: the slider folds into a cube that travels down over the Studio
    // section, so the whole hero block paints above what follows it.
    <div ref={ref} className="relative isolate z-20 flex w-full flex-col items-center justify-center">
      <div
        data-hero-frame="glow"
        aria-hidden
        // Was -top-[18%] of this frame: 18% of the carousel's 530vh plus 18%
        // of the headline. The headline term is approximated in vw so the
        // glow doesn't jump when the web fonts swap in and the headline's
        // height changes (a 0.2 CLS on desktop). Below lg, where the glow
        // (140vw tall) would sit wholly above the screen, it's centred on the
        // headline instead.
        className="pointer-events-none absolute inset-x-0 top-[calc(-95.4vh-5.9vw)] -z-10 flex justify-center max-lg:top-[calc(40svh-70vw)]"
      >
        <Image
          src="/icons/hero-ellipse-glow.svg"
          alt=""
          width={2128}
          height={2128}
          loading="eager"
          className="aspect-square h-auto w-[140%] max-w-none opacity-80 [mask-image:radial-gradient(circle,black_40%,transparent_70%)]"
        />
      </div>
      <div
        data-hero-frame="blob"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
      >
        <HeroBlob />
      </div>

      {/* Below lg the headline is a short block on a tall screen: it's centred
          in most of the first screen rather than leaving it blank under it. */}
      <section
        id="top"
        data-hero-frame="headline"
        className="relative z-10 w-full pb-8 max-lg:flex max-lg:min-h-[72svh] max-lg:items-center"
      >
        <div className="shell relative flex flex-col items-center pt-[clamp(2rem,6vw,7rem)]">
          <HeroHeadline chars={chars} />
        </div>
      </section>

      {children}
    </div>
  );
}
