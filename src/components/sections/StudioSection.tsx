import Image from "next/image";

import ArcHeading from "@/components/ui/ArcHeading";
import PopButton from "@/components/ui/PopButton";

export default function StudioSection() {
  return (
    <section
      id="studio"
      className="shell relative gap-10 pt-[clamp(3rem,8vw,10rem)] pb-[clamp(4rem,10vw,12rem)] flex flex-row justify-center items-center"
    >
      {/* <ArcHeading
        text="We're A Funky Creative Studio"
        className="lg:col-start-1 lg:row-start-1"
      />

      <div className="flex justify-center lg:col-start-2 lg:row-start-1">
        <Image
          src="/assets/studio-cube.png"
          alt="A photo cube of client campaign work"
          width={783}
          height={851}
          sizes="(max-width: 1024px) 70vw, 40vw"
          className="h-auto w-[min(100%,28rem)] -rotate-[0.3deg]"
        />
      </div> */}

      <div className="flex justify-center w-[30%]">
        <Image
          src="/assets/studio-cube.png"
          alt=""
          aria-hidden
          width={783}
          height={851}
          sizes="(max-width: 1024px) 70vw, 40vw"
          className="h-auto w-[min(100%,32rem)] -rotate-[38.8deg]"
        />
      </div>

      <div className="flex w-[70%] flex-col items-start gap-8">
        <h2 className="font-display text-hero-sm text-blush leading-[120px]">
          We’re A Funky Creative Studio
        </h2>
        <p className="text-body leading-[1.64] text-ink capitalize max-w-[34rem]">
          From strategy to execution, we offer a full suite of creative services
          designed to elevate your brand and captivate your audience.
        </p>
        <PopButton href="#contact" label="Start a Project" />
      </div>
    </section>
  );
}
