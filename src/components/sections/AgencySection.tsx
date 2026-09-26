import Image from "next/image";

import PopButton from "@/components/ui/PopButton";

export default function AgencySection() {
  return (
    <section
      id="agency"
      className="shell flex flex-col items-center gap-[clamp(2rem,4vw,4.5rem)] py-[clamp(3rem,7vw,8rem)] text-center"
    >
      <header className="flex flex-col items-center gap-2">
        <p className="text-eyebrow leading-none font-bold text-blush uppercase">
          The Agency
        </p>
        <h2 className="max-w-[20ch] font-display text-section leading-[0.99] break-words text-balance text-grape uppercase">
          Behind the Brands You Love
        </h2>
      </header>

      <Image
        src="/assets/brand-folder.png"
        alt="A folder of client brand logos"
        width={899}
        height={1093}
        sizes="(max-width: 768px) 80vw, 30vw"
        className="h-auto w-[min(100%,26rem)]"
      />

      <p className="max-w-[40rem] text-body leading-[1.64] text-ink capitalize">
        We don’t just take on clients; we build long-term digital partnerships.
        Here are a few of the visionary companies we are proud to collaborate
        with every single day.
      </p>

      <PopButton href="#contact" label="View Our Case Studies" />
    </section>
  );
}
