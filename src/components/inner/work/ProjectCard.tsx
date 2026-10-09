import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/pages/work";
import { accentBg, cardShadow, onAccent } from "./tokens";

/**
 * Figma "Case card — …" (800×770): cover with a year pill, title + tags,
 * accent arrow and a one-paragraph description. The TIÊN COFFEE card in
 * Figma shows the hover state — a -1° tilt, a white 10px frame and the pink
 * "VIEW PROJECT" cursor bubble — so every card does that on hover.
 */
export default function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const p = project;
  return (
    <article className="group">
      <Link
        href={`/work/${p.slug}`}
        className="flex flex-col outline-none transition-transform duration-500 ease-out group-hover:-rotate-1 focus-visible:-rotate-1"
      >
        <div
          className={`grid aspect-[800/560] grid-cols-1 grid-rows-1 overflow-hidden rounded-[clamp(1.25rem,2.08vw,2.5rem)] ${accentBg[p.accent]} ${cardShadow}`}
        >
          <Image
            src={p.cover.src}
            alt={p.cover.alt}
            width={p.cover.w}
            height={p.cover.h}
            priority={priority}
            sizes="(min-width: 1920px) 800px, (min-width: 768px) 42vw, 92vw"
            style={{ objectPosition: p.cover.position ?? "50% 50%" }}
            className="col-start-1 row-start-1 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {/* White hover frame above the photo. Overlays are `relative` so they paint above the image once its hover scale makes it a stacking layer. */}
          <span aria-hidden className="pointer-events-none relative col-start-1 row-start-1 rounded-[inherit] border-0 border-white transition-[border-width] duration-300 group-hover:border-[clamp(5px,0.52vw,10px)] group-focus-within:border-[clamp(5px,0.52vw,10px)]" />
          <span data-wb="year" className="relative col-start-1 row-start-1 m-[3.5%] self-start justify-self-start rounded-full bg-white px-[1.125rem] py-2 font-display text-[clamp(0.75rem,0.78vw,0.9375rem)] leading-none text-ink">
            {p.year}
          </span>
          <span
            aria-hidden
            className="relative col-start-1 row-start-1 mt-[18%] mr-[18%] grid size-[clamp(5.5rem,7.8vw,9.375rem)] scale-0 place-content-center self-center justify-self-end rounded-full bg-blush text-center font-display text-[clamp(0.8125rem,0.94vw,1.125rem)] leading-[1.45] text-white uppercase transition-transform duration-300 ease-out group-hover:scale-100"
          >
            View
            <br />
            project
          </span>
        </div>

        <div className="mt-[clamp(1.25rem,1.77vw,2.125rem)] flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3 className="font-display text-[clamp(1.75rem,2.29vw,2.75rem)] leading-[1.27] text-grape uppercase">{p.name}</h3>
            <p className="mt-1 font-copy text-small font-medium text-ink/70">{p.tagline}</p>
          </div>
          <span aria-hidden data-wb="arrow" className="block shrink-0">
            <span
              aria-hidden
              className={`grid size-[clamp(3rem,3.33vw,4rem)] shrink-0 place-items-center rounded-full font-copy text-[clamp(1.25rem,1.46vw,1.75rem)] font-bold transition-transform duration-300 group-hover:rotate-45 ${accentBg[p.accent]} ${onAccent[p.accent]}`}
            >
              ↗
            </span>
          </span>
        </div>
        <p className="mt-[clamp(0.5rem,0.6vw,0.75rem)] max-w-[85%] font-copy text-small leading-[1.6] font-light text-ink/85 max-sm:max-w-none">
          {p.description}
        </p>
      </Link>
    </article>
  );
}
