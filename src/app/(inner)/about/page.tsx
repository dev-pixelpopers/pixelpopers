import type { Metadata } from "next";
import Reveal from "@/components/inner/Reveal";
import Hero from "@/components/inner/about/Hero";
import Story from "@/components/inner/about/Story";
import { Audience, LongFormSplit } from "@/components/inner/about/LongForm";
import Values from "@/components/inner/about/Values";
import Process from "@/components/inner/about/Process";
import Journey from "@/components/inner/about/Journey";
import Testimonials from "@/components/inner/about/Testimonials";
import Studio from "@/components/inner/about/Studio";
import Closing from "@/components/inner/about/Closing";
import { aboutMeta, fullStory } from "@/lib/pages/about";
import { owners } from "@/lib/site-content";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
  alternates: { canonical: "/about" },
  openGraph: { title: aboutMeta.title, description: aboutMeta.description, type: "website", url: "/about" },
};

const SITE = "https://pixelpopers.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: aboutMeta.title,
  description: aboutMeta.description,
  url: `${SITE}/about`,
  mainEntity: {
    "@type": "Organization",
    name: "Pixel Popers",
    url: SITE,
    logo: `${SITE}/assets/logo-pixelpopers.png`,
    description:
      "A remote-first digital agency for brand identity, web design and development, UI/UX, motion, content and digital marketing.",
    foundingDate: "2019",
    slogan: "Strategy first. Craft always. Never boring.",
    founders: owners.map((o) => ({ "@type": "Person", name: o.name, jobTitle: o.role })),
  },
};

/** /about — Figma frame 330:21 "02 — About". */
export default function AboutPage() {
  return (
    <Reveal className="flex flex-col pb-[clamp(5rem,11vw,13.25rem)]">
      <Hero />
      <Story />
      <LongFormSplit
        id="full-story-title"
        eyebrow={fullStory.eyebrow}
        heading={fullStory.heading}
        paragraphs={fullStory.paragraphs}
        stats={fullStory.stats}
        className="mt-[clamp(5rem,8.33vw,10rem)]"
      />
      <div className="mt-[clamp(5rem,9.4vw,11.25rem)]">
        <Values />
      </div>
      <div className="mt-[clamp(5rem,10.9vw,13.125rem)]">
        <Process />
      </div>
      <div className="mt-[clamp(5rem,8.33vw,10rem)]">
        <Audience />
      </div>
      <div className="mt-[clamp(5rem,8.33vw,10rem)]">
        <Journey />
      </div>
      <div className="mt-[clamp(4.5rem,6.46vw,7.75rem)]">
        <Testimonials />
      </div>
      <div className="mt-[clamp(4.5rem,4.7vw,5.625rem)]">
        <Studio />
      </div>
      <div className="mt-[clamp(5rem,11.5vw,13.75rem)]">
        <Closing />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Reveal>
  );
}
