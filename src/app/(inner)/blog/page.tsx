import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/inner/Reveal";
import BlogExplorer from "@/components/inner/blog/BlogExplorer";
import Newsletter from "@/components/inner/blog/Newsletter";
import {
  BlogHero,
  JournalIntro,
  PopularAndTopics,
  Resources,
  StartHere,
  TrendingTags,
} from "@/components/inner/blog/Sections";
import { blogMeta, posts } from "@/lib/pages/blog";

export const metadata: Metadata = {
  title: blogMeta.title,
  description: blogMeta.description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: blogMeta.title,
    description: blogMeta.description,
    type: "website",
    url: "/blog",
  },
};

const SITE = "https://pixelpopers.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Pixel Popers Journal",
  description: blogMeta.description,
  url: `${SITE}/blog`,
  publisher: { "@type": "Organization", name: "Pixel Popers", url: SITE },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: `${SITE}/blog/${p.slug}`,
    datePublished: p.date,
    author: { "@type": "Person", name: p.author },
    image: `${SITE}${p.cover.src}`,
  })),
};

/** /blog — Figma frame 335:21 "06 — Blog". */
export default function BlogPage() {
  return (
    <Reveal className="flex flex-col pb-[clamp(5rem,7.3vw,8.75rem)]">
      <BlogHero />

      {/* The loop doodle shares the explorer's grid cell, tucked behind the cards. */}
      <div className="mt-[clamp(2.5rem,4.17vw,5rem)] grid">
        <Image
          aria-hidden
          src="/assets/inner/about/doodle-loop.svg"
          alt=""
          width={283}
          height={256}
          className="pointer-events-none col-start-1 row-start-1 mt-[37.5vw] mr-[3.6vw] hidden h-auto w-[12.4vw] max-w-[239px] -rotate-[15deg] self-start justify-self-end lg:block"
        />
        <div className="col-start-1 row-start-1">
          <BlogExplorer posts={posts} />
        </div>
      </div>

      <div className="mt-[clamp(4rem,6.25vw,7.5rem)]">
        <JournalIntro />
      </div>
      <div className="mt-[clamp(4rem,5vw,6rem)]">
        <StartHere />
      </div>
      <div className="mt-[clamp(4.5rem,7.5vw,9rem)]">
        <PopularAndTopics />
      </div>
      <div className="mt-[clamp(4.5rem,4.7vw,5.625rem)]">
        <Resources />
      </div>
      <div className="mt-[clamp(3rem,3.65vw,4.375rem)]">
        <TrendingTags />
      </div>
      <div className="mt-[clamp(4.5rem,11.7vw,14rem)]">
        <Newsletter />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Reveal>
  );
}
