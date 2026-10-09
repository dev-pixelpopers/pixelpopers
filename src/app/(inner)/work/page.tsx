import type { Metadata } from "next";
import Hero from "@/components/inner/work/Hero";
import ProjectBrowser from "@/components/inner/work/ProjectBrowser";
import Marquee from "@/components/inner/work/Marquee";
import WorkMotion from "@/components/inner/work/WorkMotion";
import { Clients, Cta, Impact, Intro, Teasers, Testimonials } from "@/components/inner/work/Sections";
import { SITE } from "@/components/inner/work/tokens";
import { projects, workMeta } from "@/lib/pages/work";

export const metadata: Metadata = {
  title: workMeta.title,
  description: workMeta.description,
  alternates: { canonical: "/work" },
  openGraph: { title: workMeta.title, description: workMeta.description, type: "website", url: "/work" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: workMeta.title,
  description: workMeta.description,
  url: `${SITE}/work`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/work/${p.slug}`,
      name: p.name,
    })),
  },
};

/** /work — Figma frame 333:21 "04 — Work". */
export default function WorkPage() {
  return (
    <WorkMotion className="flex flex-col pb-[clamp(5rem,9vw,10.875rem)]">
      <Hero />
      <ProjectBrowser projects={projects} />
      <div className="mt-[clamp(5rem,8.96vw,10.75rem)]">
        <Intro />
      </div>
      <div className="mt-[clamp(5rem,8.33vw,10rem)]">
        <Clients />
      </div>
      <div className="mt-[clamp(4rem,5.2vw,6.25rem)]">
        <Impact />
      </div>
      <div className="mt-[clamp(5rem,8.33vw,10rem)]">
        <Testimonials />
      </div>
      <div className="mt-[clamp(4rem,4.7vw,5.625rem)]">
        <Teasers />
      </div>
      <div className="mt-[clamp(2.5rem,3.125vw,3.75rem)]">
        <Marquee />
      </div>
      <div className="mt-[clamp(4rem,7.3vw,8.75rem)]">
        <Cta />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </WorkMotion>
  );
}
