"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { filters, PAGE_SIZE, type Category, type Project } from "@/lib/pages/work";
import FeaturedCard from "./FeaturedCard";
import ProjectCard from "./ProjectCard";
import { wide } from "./tokens";

type Filter = "all" | Category;

/**
 * Filter chips, the featured case and the staggered two-column grid from
 * Figma 333:21. Everything is server-rendered with "All work" selected, so
 * every project link is crawlable; the chips, sort toggle and "Load more"
 * only narrow or extend what is already in the data.
 */
export default function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [newestFirst, setNewestFirst] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const matches = (p: Project) => filter === "all" || p.categories.includes(filter);
  const featured = projects.find((p) => p.featured && matches(p));

  const list = useMemo(() => {
    const score = (p: Project) => p.year * 12 + p.month;
    return projects
      .filter((p) => !p.featured && (filter === "all" || p.categories.includes(filter)))
      .sort((a, b) => (newestFirst ? score(b) - score(a) : score(a) - score(b)));
  }, [projects, filter, newestFirst]);

  const shown = list.slice(0, visible);
  const left = shown.filter((_, i) => i % 2 === 0);
  const right = shown.filter((_, i) => i % 2 === 1);

  const choose = (f: Filter) => {
    setFilter(f);
    setVisible(PAGE_SIZE);
  };

  const item = (p: Project, i: number) => (
    <li key={p.slug} style={{ order: i }}>
      <ProjectCard project={p} priority={i < 2} />
    </li>
  );

  return (
    <section aria-labelledby="projects-title">
      <h2 id="projects-title" className="sr-only">
        Selected projects
      </h2>

      <div className="shell mt-[clamp(2.5rem,5.6vw,6.75rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <div role="group" aria-label="Filter projects by discipline" className="flex flex-wrap gap-[clamp(0.5rem,0.625vw,0.75rem)]">
          {filters.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(f.id)}
                className={`rounded-full border px-[clamp(1rem,1.35vw,1.625rem)] py-[clamp(0.55rem,0.73vw,0.875rem)] font-display text-[clamp(0.8125rem,0.94vw,1.125rem)] leading-tight uppercase transition-colors ${
                  active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white/60 text-ink hover:border-blush hover:text-blush"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setNewestFirst((v) => !v)}
          className="font-copy text-[clamp(0.9375rem,0.94vw,1.125rem)] font-medium text-ink/70 transition-colors hover:text-blush"
        >
          Sort: {newestFirst ? "Newest ↓" : "Oldest ↑"}
        </button>
      </div>

      <div className={`${wide} mt-[clamp(2rem,4.6vw,5.5rem)]`}>
        {featured ? <FeaturedCard project={featured} /> : null}

        {shown.length ? (
          <div
            className={`grid gap-y-[clamp(3rem,4.17vw,5rem)] md:grid-cols-2 md:gap-x-[4.76%] ${featured ? "mt-[clamp(3rem,8.33vw,10rem)]" : ""}`}
          >
            {/* Two columns so the right one can drop 140px like Figma; on phones the lists dissolve and `order` restores reading order. */}
            <ul className="contents md:flex md:flex-col md:gap-y-[clamp(3rem,4.17vw,5rem)]">{left.map((p) => item(p, shown.indexOf(p)))}</ul>
            <div className="contents md:grid md:grid-cols-1 md:grid-rows-1 md:items-start">
              <Image
                src="/assets/inner/about/doodle-loop.svg"
                alt=""
                aria-hidden
                width={283}
                height={256}
                className="hidden h-auto w-[30%] -rotate-[15deg] md:col-start-1 md:row-start-1 md:ml-[39%] md:block"
              />
              <ul className="contents md:col-start-1 md:row-start-1 md:flex md:flex-col md:gap-y-[clamp(3rem,4.17vw,5rem)] md:pt-[clamp(3rem,7.3vw,8.75rem)]">
                {right.map((p) => item(p, shown.indexOf(p)))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-16 text-center font-copy text-copy font-light text-ink/80">No projects in this category yet — check back soon.</p>
        )}

        <p aria-live="polite" className="sr-only">
          Showing {shown.length + (featured ? 1 : 0)} projects
        </p>

        {list.length > visible ? (
          <div className="mt-[clamp(3rem,6.25vw,7.5rem)] flex justify-center">
            {/* Same block-and-overhang look as the home PopButton (which renders a link, not a button); the block is a hover fill behind the label. */}
            <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="group relative inline-flex items-center text-nav">
              <span
                aria-hidden
                className="absolute z-0 h-[clamp(2.375rem,3.54vw,4.25rem)] w-[clamp(2.75rem,4.17vw,5rem)] shrink-0 bg-white transition-all duration-300 ease-out group-hover:w-full group-hover:bg-sunbeam"
              />
              <span className="relative z-10 px-5 font-display whitespace-nowrap text-ink uppercase">Load more work</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
