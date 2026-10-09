"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

import { deferSetup } from "@/lib/defer-setup";
import PostCover from "@/components/inner/blog/PostCover";
import { toneFill } from "@/components/inner/blog/tones";
import PopButton from "@/components/ui/PopButton";
import SplitWords from "@/components/ui/SplitWords";
import { categoryTone, formatDate, getPost, type Post } from "@/lib/pages/blog";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The posts featured on the home page. They are the blog's own posts (the
 * same data as /blog and each /blog/<slug> article), so the cards always
 * match the article they open.
 */
const HOME_POSTS = [
  "bold-brands-win-the-scroll",
  "interfaces-people-enjoy",
  "snack-bar-campaign-playbook",
  "motion-that-means-something",
]
  .map(getPost)
  .filter((post): post is Post => Boolean(post));

/**
 * Featured posts. Same staging as the leadership section: a sticky 100vh
 * frame on large screens, an entrance that plays on enter and reverses only
 * when scrolled back above, and no exit animation.
 */
export default function BlogSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      // Far below the fold: set up in its own short task after load rather
      // than in the initial commit (see deferSetup).
      return deferSetup(
        contextSafe!(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 40%",
              end: "bottom bottom",
              scrub: 1
            },
          });

          tl.from("[data-split='blog-kicker']", { yPercent: 110, duration: 0.6, stagger: 0.05 })
            .from(
              "[data-split='blog-heading']",
              { yPercent: 115, rotation: 6, duration: 0.9, stagger: 0.08, ease: "power4.out" },
              0.1,
            )
            .from("[data-blog='subtitle']", { autoAlpha: 0, x: -40, duration: 0.8 }, 0.45)
            .from(
              "[data-blog='cta']",
              { autoAlpha: 0, scale: 0.5, rotation: -10, duration: 0.7, ease: "back.out(2)" },
              0.6,
            )

            // Cards tip up out of the floor in 3D, then settle with a lift.
            .from(
              "[data-blog='card']",
              {
                autoAlpha: 0,
                y: 140,
                z: -220,
                rotationX: -55,
                transformOrigin: "50% 100%",
                // Same shape as the computed shadow, so GSAP can interpolate it.
                boxShadow: "rgba(34, 1, 40, 0) 0px 0px 0px -20px",
                duration: 1.1,
                stagger: 0.14,
              },
              0.5,
            )
            .from(
              "[data-blog='thumb']",
              {
                clipPath: "inset(100% 0% 0% 0%)",
                duration: 0.9,
                stagger: 0.14,
                ease: "power3.inOut",
              },
              0.8,
            )
            .from(
              "[data-blog='thumb-img']",
              { scale: 1.35, duration: 1.2, stagger: 0.14 },
              0.8,
            )
            .from(
              "[data-blog='tag']",
              { scale: 0, rotation: -20, duration: 0.6, stagger: 0.14, ease: "back.out(2.6)" },
              1.25,
            )
            .from(
              "[data-blog='meta']",
              { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.07 },
              1.15,
            );
        });
        }),
      );
    },
    { scope: rootRef },
  );

  return (
    <section id="blog" ref={rootRef} aria-labelledby="blog-heading" className="stage:h-[200vh]">
      <div className="stage:sticky stage:top-0 stage:h-svh stage:overflow-hidden flex items-center py-[clamp(3rem,7vw,6rem)] stage:py-0">
        <div className="shell flex w-full flex-col gap-[clamp(2rem,5vh,4rem)]">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-eyebrow leading-none font-bold text-blush-ink uppercase">
                <SplitWords text="Fresh From The Studio" name="blog-kicker" />
              </p>
              <h2 id="blog-heading" className="font-display text-section leading-[0.99] text-grape uppercase">
                <SplitWords text="Ideas Worth Popping" name="blog-heading" />
              </h2>
              <p data-blog="subtitle" className="mt-2 max-w-[36rem] text-body leading-[1.64] text-ink capitalize">
                Notes on branding, design and growth from the people who build them every day.
              </p>
            </div>
            <div data-blog="cta" className="origin-left">
              <PopButton href="/blog" label="View All Posts" />
            </div>
          </header>

          {/*
            Four across on large screens, two on tablets, and a snapping
            horizontal rail on phones. The perspective lives on the list so
            every card tips in around the same vanishing point.
          */}
          <ul className="-mx-[clamp(1.25rem,8.65vw,10.375rem)] flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,8.65vw,10.375rem)] gap-[clamp(1rem,1.8vw,2rem)] overflow-x-auto px-[clamp(1.25rem,8.65vw,10.375rem)] pb-6 [perspective:1400px] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {HOME_POSTS.map((post) => (
              <li
                key={post.slug}
                data-blog="card"
                className="group relative w-[78vw] max-w-[22rem] shrink-0 snap-start rounded-card bg-white shadow-[0_22px_40px_-20px_rgb(34_1_40/0.35)] sm:w-auto sm:max-w-none"
              >
                <article className="flex h-full flex-col">
                  <div className="relative">
                    <div data-blog="thumb" className="aspect-[4/3] overflow-hidden rounded-t-card">
                      {/* GSAP scales this wrapper; the hover zoom transitions the image inside it. */}
                      <div data-blog="thumb-img" className="h-full w-full">
                        <PostCover
                          cover={post.cover}
                          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 22vw"
                          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <span
                      data-blog="tag"
                      className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[clamp(0.6875rem,0.75vw,0.875rem)] font-bold tracking-wide uppercase shadow-card ${toneFill[categoryTone[post.category]]}`}
                    >
                      {post.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-[clamp(1rem,1.4vw,1.5rem)]">
                    <time
                      data-blog="meta"
                      dateTime={post.date}
                      className="text-[clamp(0.75rem,0.8vw,0.9375rem)] font-bold tracking-wide text-ink/60 uppercase"
                    >
                      {formatDate(post.date)}
                    </time>
                    <h3
                      data-blog="meta"
                      className="text-[clamp(1.125rem,1.35vw,1.625rem)] leading-tight font-bold text-ink transition-colors duration-300 group-hover:text-grape"
                    >
                      {post.title}
                    </h3>
                    <p
                      data-blog="meta"
                      className="line-clamp-2 text-[clamp(0.8125rem,0.85vw,1rem)] text-ink/60">
                      {post.excerpt}
                    </p>
                    <Link
                      data-blog="meta"
                      href={`/blog/${post.slug}`}
                      className="mt-auto inline-flex items-center gap-2 pt-2 font-display text-[clamp(0.8125rem,0.85vw,1rem)] text-blush-deep uppercase after:absolute after:inset-0 after:content-['']"
                      aria-label={`Read more: ${post.title}`}
                    >
                      Read More
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
