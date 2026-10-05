import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/inner/Reveal";
import ArticleBody from "@/components/inner/blog/ArticleBody";
import Comments from "@/components/inner/blog/Comments";
import ShareLinks from "@/components/inner/blog/ShareLinks";
import Toc from "@/components/inner/blog/Toc";
import {
  AuthorCard,
  PostHero,
  PostTags,
  RelatedPosts,
  tocItems,
} from "@/components/inner/blog/PostSections";
import { owners } from "@/lib/site-content";
import { getPost, posts, relatedPosts, wordCount } from "@/lib/pages/blog";

const SITE = "https://pixelpopers.vercel.app";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = `${post.title} | Pixel Popers Blog`;
  const url = `/blog/${post.slug}`;
  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.date,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: post.cover.src,
          width: post.cover.width,
          height: post.cover.height,
          alt: post.cover.alt,
        },
      ],
    },
  };
}

/** /blog/<slug> — Figma frame 336:21 "07 — Blog Post" as the template for every post. */
export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE}/blog/${post.slug}`;
  const toc = tocItems(post);
  const author = owners.find((o) => o.name === post.author);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE}${post.cover.src}`,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: wordCount(post),
    timeRequired: `PT${post.readTime}M`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: author?.role,
      url: `${SITE}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Pixel Popers",
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/assets/logo-pixelpopers.png`,
      },
    },
  };

  return (
    <Reveal className="flex flex-col pb-[clamp(5rem,8.33vw,10rem)]">
      <PostHero post={post} />

      {/* TOC | article | share — Figma columns 340 / 880 / 56 with 140 / 120 gutters. */}
      <div className="mx-auto mt-[clamp(2.5rem,6.25vw,7.5rem)] grid w-full max-w-[1920px] gap-y-10 px-[clamp(1.25rem,6.25vw,7.5rem)] lg:grid-cols-[minmax(0,340fr)_minmax(0,140fr)_minmax(0,880fr)_minmax(0,120fr)_minmax(0,200fr)]">
        <aside className="hidden lg:col-start-1 lg:block">
          <div className="sticky top-8">
            <Toc items={toc} />
          </div>
        </aside>

        <article className="mx-auto w-full max-w-[55rem] lg:col-start-3 lg:row-start-1">
          {/* Below lg the sticky TOC column is gone, so offer a collapsible one instead. */}
          <details className="group mb-10 rounded-3xl border border-white bg-white/60 p-6 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-micro text-blush uppercase">
              In this article
              <span
                aria-hidden
                className="text-lg transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ol className="mt-4 flex flex-col gap-3">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="font-copy text-base text-ink/70 hover:text-blush"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          <ArticleBody blocks={post.body} />
          <div className="mt-[clamp(3rem,5.2vw,6.25rem)]">
            <PostTags tags={post.tags} />
          </div>
          <div className="mt-[clamp(2rem,3.4vw,4rem)]">
            <AuthorCard author={post.author} />
          </div>
          <div className="mt-[clamp(3rem,5.6vw,6.75rem)]">
            <Comments comments={post.comments} />
          </div>
        </article>

        <div className="mx-auto w-full max-w-[55rem] lg:col-start-5 lg:row-start-1 lg:mx-0">
          <div className="lg:sticky lg:top-8">
            <ShareLinks url={url} title={post.title} />
          </div>
        </div>
      </div>

      <div className="mt-[clamp(4.5rem,8.3vw,10rem)]">
        <RelatedPosts posts={relatedPosts(post)} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Reveal>
  );
}
