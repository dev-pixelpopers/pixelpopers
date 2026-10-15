import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/inner/Reveal";
import {
  BrandSystem,
  Brief,
  CaseHero,
  Delivered,
  FullStory,
  Gallery,
  NextProject,
  PullQuote,
  Results,
  Team,
  Timeline,
} from "@/components/inner/work/CaseStudy";
import { getProject, getProjects, getSite, getTeam } from "@/lib/content";

/** Case studies added in the CMS after a build render on first visit. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProject(slug);
  if (!found) return {};
  const p = found.project;
  const seo = (p as { seo?: { title?: string | null; description?: string | null; ogImage?: string | null } }).seo;
  const title = seo?.title || `${p.name} — ${p.discipline} Case Study | Pixel Popers`;
  const description = seo?.description || p.description;
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title, description, type: "article", url: `/work/${p.slug}`, images: [{ url: seo?.ogImage || p.cover.src, alt: p.cover.alt }] },
  };
}

/** /work/[slug] — template from Figma frame 334:21 "05 — Case Study (Fifth Sip)". */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [found, site, team] = await Promise.all([getProject(slug), getSite(), getTeam()]);
  if (!found) notFound();
  const { project, next } = found;
  const SITE = site.site_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.name} — ${project.discipline}`,
    headline: `${project.name}: ${project.discipline}`,
    description: project.description,
    url: `${SITE}/work/${project.slug}`,
    image: project.cover.src.startsWith("http") ? project.cover.src : `${SITE}${project.cover.src}`,
    dateCreated: String(project.year),
    genre: project.discipline,
    keywords: project.services.join(", "),
    about: { "@type": "Organization", name: project.client },
    creator: {
      "@type": "Organization",
      name: site.site_name,
      url: SITE,
      member: project.team.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role })),
    },
    review: {
      "@type": "Review",
      reviewBody: project.quote.text,
      author: { "@type": "Person", name: project.quote.author },
    },
  };

  return (
    <Reveal as="article" className="flex flex-col pb-[clamp(5rem,8.33vw,10rem)]">
      <CaseHero project={project} />
      <div className="mt-[clamp(3.5rem,7.3vw,8.75rem)]">
        <Brief project={project} />
      </div>
      <div className="mt-[clamp(4rem,10.4vw,12.5rem)]">
        <BrandSystem project={project} />
      </div>
      <div className="mt-[clamp(4rem,7.3vw,8.75rem)]">
        <Results project={project} />
      </div>
      <div className="mt-[clamp(3rem,5.2vw,6.25rem)]">
        <PullQuote project={project} />
      </div>
      <div className="mt-[clamp(4rem,6.25vw,7.5rem)]">
        <FullStory project={project} />
      </div>
      <div className="mt-[clamp(4rem,6.25vw,7.5rem)]">
        <Gallery project={project} />
      </div>
      <div className="mt-[clamp(4rem,5.2vw,6.25rem)]">
        <Delivered project={project} />
      </div>
      <div className="mt-[clamp(4rem,9.4vw,11.25rem)]">
        <Timeline project={project} />
      </div>
      <div className="mt-[clamp(4rem,5.2vw,6.25rem)]">
        <Team project={project} owners={team.owners} />
      </div>
      <div className="mt-[clamp(4rem,16vw,19.375rem)]">
        <NextProject next={next} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Reveal>
  );
}
