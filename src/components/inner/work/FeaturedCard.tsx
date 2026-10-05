import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/pages/work";
import { cardShadow } from "./tokens";

const cell = "col-start-1 row-start-1";

/** Figma "Featured case — Snack Bar": a 1680×800 cover with a grape shade and the details laid over it. */
export default function FeaturedCard({ project }: { project: Project }) {
  const p = project;
  return (
    <article className="group">
      <Link
        href={`/work/${p.slug}`}
        className={`grid min-h-[30rem] grid-cols-1 grid-rows-1 overflow-hidden rounded-[clamp(1.5rem,2.5vw,3rem)] md:min-h-[34rem] lg:aspect-[1680/800] lg:min-h-0 ${cardShadow}`}
        style={{ backgroundColor: p.coverBg }}
      >
        <Image
          src={p.cover.src}
          alt={p.cover.alt}
          width={p.cover.w}
          height={p.cover.h}
          priority
          sizes="(min-width: 1920px) 1680px, 92vw"
          className={`${cell} size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
        />
        <span aria-hidden className={`relative ${cell} bg-[linear-gradient(180deg,rgb(33_0_41/0)_35%,rgb(33_0_41/0.85)_100%)]`} />

        <div className={`relative ${cell} flex flex-col justify-between gap-8 p-[clamp(1.25rem,3.125vw,3.75rem)] pt-[clamp(1.25rem,2.9vw,3.5rem)]`}>
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-blush px-[clamp(1rem,1.9vw,2.25rem)] py-[clamp(0.5rem,0.7vw,0.75rem)] font-display text-micro leading-tight text-white uppercase">
              Featured ✦
            </span>
            <span
              aria-hidden
              className="-mt-1.5 grid size-[clamp(5rem,6.77vw,8.125rem)] place-content-center rounded-full bg-white text-center font-display text-micro leading-[1.4] text-ink uppercase transition-transform duration-300 group-hover:rotate-12"
            >
              View
              <br />
              case ↗
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div className="max-w-[47.5rem]">
              <h2 className="font-display text-[clamp(2.5rem,5vw,6rem)] leading-[1.27] text-white uppercase">{p.name}</h2>
              <p className="font-copy text-copy leading-[1.5] font-light text-white/90">{p.description}</p>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <p className="font-display text-[clamp(0.8125rem,0.94vw,1.125rem)] text-sunbeam uppercase">{p.tagline}</p>
              <p className="font-pop text-[clamp(2.75rem,3.75vw,4.5rem)] leading-[1.1] text-white">{p.year}</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
