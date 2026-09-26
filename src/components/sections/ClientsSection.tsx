import Image from "next/image";

import BrandLogo from "@/components/ui/BrandLogo";
import ClientCard from "@/components/ui/ClientCard";
import { clients } from "@/lib/site-content";

const radiatingLines = [
  { src: "/icons/folder-back-left.svg", width: 721, height: 748 },
  { src: "/icons/folder-wave-left.svg", width: 868, height: 542 },
  { src: "/icons/folder-wave-right.svg", width: 868, height: 542 },
  { src: "/icons/folder-back-right.svg", width: 721, height: 748 },
];

export default function ClientsSection() {
  return (
    <section
      id="clients"
      aria-label="Clients we work with"
      className="relative isolate overflow-hidden py-[clamp(2rem,5vw,6rem)]"
    >
      {/* Decorative hairlines fanning out from the folder. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-end justify-center"
      >
        {radiatingLines.map((line) => (
          <Image
            key={line.src}
            src={line.src}
            alt=""
            width={line.width}
            height={line.height}
            className="h-auto w-[45%] max-w-none opacity-70"
          />
        ))}
      </div>

      <div className="shell flex flex-col items-center gap-[clamp(1.5rem,3vw,3rem)]">
        <ul className="flex flex-wrap items-center justify-center gap-x-[clamp(1rem,2.5vw,3rem)] gap-y-[clamp(1.25rem,2.5vw,3rem)]">
          {clients.map((client) => (
            <ClientCard key={client.name} client={client} />
          ))}
        </ul>

        {/* Folder lockup: back panel, front panel and the brand mark. */}
        <div className="grid w-[min(70%,21rem)] grid-cols-1 grid-rows-1 [&>*]:col-start-1 [&>*]:row-start-1">
          <Image
            src="/icons/folder-body-shadow.svg"
            alt=""
            aria-hidden
            width={334}
            height={289}
            className="h-auto w-full"
          />
          <Image
            src="/icons/folder-front.svg"
            alt=""
            aria-hidden
            width={309}
            height={197}
            className="mt-auto h-auto w-[93%] justify-self-center self-end"
          />
          <span className="mb-[8%] justify-self-center self-end">
            <BrandLogo className="w-[clamp(5rem,8vw,8.5rem)]" />
          </span>
        </div>
      </div>
    </section>
  );
}
