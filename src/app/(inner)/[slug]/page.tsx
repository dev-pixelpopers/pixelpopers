import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Blocks from "@/components/custom/Blocks";
import { PageCode } from "@/components/layout/CustomCode";
import { getCustomPage, getCustomPages, getSite } from "@/lib/content";
import { DEFAULT_OG_IMAGE, fitTitle } from "@/lib/site";

/*
  Pages built in the CMS (Pages → New page), at /{slug}: a list of sections
  copied from the site's other pages, each with its own copy. The site's own
  pages (/about, /work, …) are separate routes and always take precedence.

  Pages that exist at build time are pre-rendered; a page created later is
  rendered on its first visit and then cached like every other page.
*/

export async function generateStaticParams() {
  return (await getCustomPages()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [page, site] = await Promise.all([getCustomPage(slug), getSite()]);
  if (!page) return {};
  const title = page.seo.title || `${page.title} | ${site.site_name}`;
  const description = page.seo.description || site.site_description;
  const image = page.seo.ogImage || site.default_og_image || DEFAULT_OG_IMAGE;
  return {
    title: { absolute: fitTitle(title, "") },
    description,
    alternates: { canonical: `/${page.slug}` },
    ...(page.seo.robots ? { robots: page.seo.robots } : {}),
    openGraph: { title, description, type: "website", url: `/${page.slug}`, images: [image] },
    twitter: { title, description },
  };
}

export default async function CustomPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) notFound();

  return (
    <>
      {/* SEO → Scripts & tags in the CMS: snippets added to this page only. */}
      <PageCode path={`/${page.slug}`} />
      <div className="flex flex-col overflow-x-clip pb-[clamp(5rem,9vw,10.875rem)]">
        {/* Copied heroes bring their own <h1>; otherwise the page title is the heading. */}
        {page.blocks[0]?.type.endsWith(":hero") ? null : <h1 className="sr-only">{page.title}</h1>}
        <Blocks blocks={page.blocks} page={page.title} />
      </div>
    </>
  );
}
