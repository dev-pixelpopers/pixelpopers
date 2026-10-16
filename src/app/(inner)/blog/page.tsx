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
import { getBlogPage, getCategories, getPosts, getSite, getTeam, assertPagePublished } from "@/lib/content";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getBlogPage();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/blog" },
    openGraph: { title: seo.title, description: seo.description, type: "website", url: "/blog", images: [seo.ogImage ?? DEFAULT_OG_IMAGE] },
  };
}

/** /blog — Figma frame 335:21 "06 — Blog". */
export default async function BlogPage() {
  await assertPagePublished("blog");
  const [{ seo, sections: s }, posts, team, { categories }, site] = await Promise.all([
    getBlogPage(),
    getPosts(),
    getTeam(),
    getCategories(),
    getSite(),
  ]);
  const SITE = site.site_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.site_name} Journal`,
    description: seo.description,
    url: `${SITE}/blog`,
    publisher: { "@type": "Organization", name: site.site_name, url: SITE },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
      image: p.cover.src.startsWith("http") ? p.cover.src : `${SITE}${p.cover.src}`,
    })),
  };

  return (
    <Reveal className="flex flex-col pb-[clamp(5rem,7.3vw,8.75rem)]">
      {s.hero ? <BlogHero blogHero={s.hero} /> : null}

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
          <BlogExplorer posts={posts} owners={team.owners} categories={categories} />
        </div>
      </div>

      {s.journal_intro ? (

        <div className="mt-[clamp(4rem,6.25vw,7.5rem)]">

          <JournalIntro journalIntro={s.journal_intro!} />

        </div>

      ) : null}
      {s.start_here ? (
        <div className="mt-[clamp(4rem,5vw,6rem)]">
          <StartHere startHere={s.start_here!} posts={posts} />
        </div>
      ) : null}
      {s.popular || s.topics ? (
        <div className="mt-[clamp(4.5rem,7.5vw,9rem)]">
          <PopularAndTopics popularSlugs={s.popular?.slugs ?? []} topics={s.topics?.items ?? []} posts={posts} />
        </div>
      ) : null}
      {s.resources ? (
        <div className="mt-[clamp(4.5rem,4.7vw,5.625rem)]">
          <Resources resources={s.resources!.items} />
        </div>
      ) : null}
      {s.trending_tags ? (
        <div className="mt-[clamp(3rem,3.65vw,4.375rem)]">
          <TrendingTags trendingTags={s.trending_tags!.items} />
        </div>
      ) : null}
      {s.newsletter ? (
        <div className="mt-[clamp(4.5rem,11.7vw,14rem)]">
          <Newsletter newsletter={s.newsletter!} />
        </div>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Reveal>
  );
}
