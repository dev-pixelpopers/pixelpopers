"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { owners } from "@/lib/site-content";
import {
  categories,
  formatDate,
  slugify,
  type Category,
  type Post,
} from "@/lib/pages/blog";
import PostCard from "./PostCard";
import PostCover from "./PostCover";
import { cardShadow } from "./tones";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Figma 335:21 filter row, featured post, post grid and pager. The category
 * chips and the search box filter the posts on the client. Topic cards and
 * trending tags elsewhere on the page link to `#topic-<slug>` / `#tag-<tag>`,
 * which this component picks up to pre-filter the list.
 */
export default function BlogExplorer({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const apply = (scroll: boolean) => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const topic = hash.startsWith("topic-")
        ? categories.find((c) => slugify(c) === hash.slice(6))
        : undefined;
      const tag = hash.startsWith("tag-") ? hash.slice(4) : undefined;
      if (!topic && !tag) return;
      setActive(topic ?? "All");
      setQuery(tag ?? "");
      if (scroll)
        root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    apply(false);
    const onHash = () => apply(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const filtering = active !== "All" || query.trim() !== "";

  const results = useMemo(() => {
    const q = norm(query);
    return posts.filter((p) => {
      if (!filtering) return p.slug !== featured.slug;
      if (active !== "All" && p.category !== active) return false;
      if (!q) return true;
      return [p.title, p.excerpt, p.category, ...p.tags].some((s) =>
        norm(s).includes(q),
      );
    });
  }, [posts, active, query, filtering, featured.slug]);

  const author = owners.find((o) => o.name === featured.author);

  return (
    <section
      ref={root}
      id="posts"
      aria-label="Articles"
      className="mx-auto w-full max-w-[1920px] scroll-mt-6 px-[clamp(1.25rem,6.25vw,7.5rem)]"
    >
      {/* Filter row */}
      <div className="flex flex-col gap-5 px-[clamp(0rem,2.4vw,2.875rem)] lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by topic"
          className="flex flex-wrap gap-[clamp(0.5rem,0.625vw,0.75rem)]"
        >
          {(["All", ...categories] as const).map((c) => {
            const on = c === active;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(c)}
                className={`rounded-full border px-[clamp(1rem,1.25vw,1.5rem)] py-[clamp(0.625rem,0.83vw,1rem)] font-display text-[clamp(0.75rem,0.9375vw,1.125rem)] leading-none uppercase transition-colors ${
                  on
                    ? "border-ink bg-ink text-white"
                    : "border-ink/15 bg-white/60 text-ink hover:border-blush hover:text-blush"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <label className="flex h-[clamp(3rem,3.125vw,3.75rem)] w-full items-center gap-3 rounded-full border border-ink/15 bg-white pr-6 pl-[clamp(1.25rem,1.56vw,1.875rem)] focus-within:border-blush lg:w-[clamp(16rem,19.8vw,23.75rem)]">
          <span className="sr-only">Search articles</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="min-w-0 flex-1 bg-transparent font-copy text-[clamp(0.9375rem,0.9375vw,1.125rem)] text-ink outline-none placeholder:text-ink/50"
          />
          <span
            aria-hidden
            className="font-copy text-2xl leading-none font-bold text-blush"
          >
            ⌕
          </span>
        </label>
      </div>

      {/* Featured post (hidden while a filter is active, so results read as one list) */}
      {!filtering ? (
        <article
          className={`group mt-[clamp(2rem,5vw,6rem)] grid overflow-hidden rounded-[clamp(1.5rem,2.08vw,2.5rem)] bg-white md:grid-cols-[minmax(0,900fr)_minmax(0,780fr)] ${cardShadow}`}
        >
          <Link
            href={`/blog/${featured.slug}`}
            tabIndex={-1}
            aria-hidden
            className="block"
          >
            <PostCover
              cover={featured.cover}
              priority
              sizes="(min-width: 1920px) 900px, (min-width: 768px) 47vw, 100vw"
              className="aspect-[900/640] size-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </Link>
          <div className="flex flex-col px-[clamp(1.25rem,3.125vw,3.75rem)] pt-[clamp(1.5rem,4.17vw,5rem)] pb-[clamp(1.75rem,4vw,4.75rem)] md:pr-[clamp(1.5rem,5.2vw,6.25rem)]">
            <p className="flex gap-3 font-haas text-[clamp(0.6875rem,0.68vw,0.8125rem)] leading-none uppercase">
              <span className="rounded-2xl bg-sunbeam px-3.5 py-1.5 text-ink">
                {featured.category}
              </span>
              <span className="rounded-2xl bg-blush px-3.5 py-1.5 text-white">
                Featured
              </span>
            </p>
            <h2 className="mt-[clamp(1rem,1.77vw,2.125rem)] font-haas text-[clamp(1.625rem,2.5vw,3rem)] leading-[1.21] text-blush">
              <Link
                href={`/blog/${featured.slug}`}
                className="hover:text-grape"
              >
                {featured.title}
              </Link>
            </h2>
            <p className="mt-4 font-copy text-[clamp(1rem,1.09vw,1.3125rem)] leading-[1.62] font-light text-ink">
              {featured.excerpt}
            </p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
              <div className="flex items-center gap-3.5">
                {author ? (
                  <Image
                    src={author.avatar}
                    alt=""
                    width={56}
                    height={56}
                    className="size-[clamp(2.75rem,2.9vw,3.5rem)] rounded-full bg-lagoon object-cover"
                  />
                ) : null}
                <p className="flex flex-col gap-1">
                  <span className="font-haas text-[clamp(0.9375rem,0.9375vw,1.125rem)] leading-none text-ink">
                    {featured.author}
                  </span>
                  <span className="font-copy text-micro text-ink/60">
                    <time dateTime={featured.date}>
                      {formatDate(featured.date)}
                    </time>{" "}
                    · {featured.readTime} min read
                  </span>
                </p>
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="font-display text-[clamp(0.875rem,0.9375vw,1.125rem)] text-blush uppercase hover:text-grape"
              >
                Read more <span aria-hidden>→</span>
                <span className="sr-only">: {featured.title}</span>
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <p
          aria-live="polite"
          className="mt-[clamp(2rem,3.5vw,4rem)] font-display text-micro text-ink/60 uppercase"
        >
          {results.length} {results.length === 1 ? "article" : "articles"}
          {active !== "All" ? ` in ${active}` : ""}
          {query.trim() ? ` matching “${query.trim()}”` : ""}
          <button
            type="button"
            onClick={() => {
              setActive("All");
              setQuery("");
              if (window.location.hash)
                history.replaceState(null, "", window.location.pathname);
            }}
            className="ml-4 text-blush underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </p>
      )}

      {/* Grid */}
      {results.length ? (
        <ul className="mt-[clamp(2rem,6.25vw,7.5rem)] grid gap-x-[clamp(1rem,2.08vw,2.5rem)] gap-y-[clamp(1.75rem,4.17vw,5rem)] sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 rounded-3xl bg-white/70 p-10 text-center font-copy text-copy font-light text-ink">
          Nothing here yet — try another topic or search term.
        </p>
      )}

      {/* Pager — every article fits on one page for now. */}
      <nav
        aria-label="Pagination"
        className="mt-[clamp(2.5rem,5.2vw,6.25rem)] flex justify-center gap-2"
      >
        {["←", "1", "→"].map((l) => (
          <span
            key={l}
            aria-current={l === "1" ? "page" : undefined}
            aria-hidden={l !== "1"}
            className={`grid size-[clamp(2.75rem,2.9vw,3.5rem)] place-items-center rounded-full font-display text-[clamp(0.9375rem,0.9375vw,1.125rem)] ${
              l === "1" ? "bg-ink text-white" : "bg-white text-ink/35"
            }`}
          >
            {l}
          </span>
        ))}
      </nav>
    </section>
  );
}
