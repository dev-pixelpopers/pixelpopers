import Image from "next/image";

import PopButton from "@/components/ui/PopButton";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="isolate flex flex-col pt-[clamp(3rem,7vw,8rem)]"
    >
      <div className="shell flex lg:items-start lg:gap-x-16">
        <header className="flex min-w-0 flex-col gap-2">
          <p className="text-eyebrow leading-none font-bold text-blush uppercase">
            Let’s Build Something
          </p>
          <h2 className="font-display text-section leading-[0.99] break-words text-grape uppercase">
            Extraordinary
            <br />
            Together
          </h2>
        </header>

        <div className="flex min-w-0 max-w-[38rem] flex-col items-start gap-8">
          <p className="text-body leading-[1.64] text-ink capitalize">
            Whether you need a complete brand overhaul, a high-converting web
            experience, or a full-scale marketing campaign, our team of experts
            is ready to execute. Tell us about your goals, and let’s turn your
            vision into reality.
          </p>
          <PopButton
            href="mailto:hello@pixelpopers.com"
            label="Schedule a Strategy Call"
          />
        </div>
      </div>

      {/*
        Closing gradient sphere. It stays in flow — a negative top margin tucks
        it under the copy and a negative stacking order keeps it behind, so it
        is never clipped and the section grows with it.
      */}
      {/* <Image
        aria-hidden
        src="/icons/cta-ellipse.svg"
        alt=""
        width={1673}
        height={1673}
        className="pointer-events-none relative -z-10 -mt-[24%] h-auto w-[87.1%] max-w-[1673px] self-center"
      /> */}
    </section>
  );
}
