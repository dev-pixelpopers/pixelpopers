import type { Metadata } from "next";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import HeroFinal from "@/components/hero/HeroFinal";
import AgencySection from "@/components/sections/AgencySection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import ServicesSection from "@/components/sections/ServicesSection";
// import ShowcaseSection from "@/components/sections/ShowcaseSection";
import StudioSection from "@/components/sections/StudioSection";
import ProjectSlider from "@/components/slider/ProjectSlider";
import { getClients, getHiddenPages, getHome, getPosts, getServiceLinks, getServiceTiles, getShowreel, getSite, getTeam, getCategories } from "@/lib/content";
import { homeAgency, homeBlog, homeContact, homeHero, homeLeadership, homeStudio } from "@/lib/home-content";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHome();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/" },
    openGraph: { title: seo.title, description: seo.description, ...(seo.ogImage ? { images: [seo.ogImage] } : {}) },
    twitter: { title: seo.title, description: seo.description },
  };
}

/** Organization + WebSite structured data for the home page. */
function structuredData(site: Awaited<ReturnType<typeof getSite>>, owners: Awaited<ReturnType<typeof getTeam>>["owners"]) {
  const url = site.site_url || SITE_URL;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: site.site_name,
        url,
        logo: `${url}/assets/logo-pixelpopers.png`,
        description: site.site_description,
        email: site.company_email,
        foundingDate: "2019",
        founders: owners.map((o) => ({ "@type": "Person", name: o.name, jobTitle: o.role })),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: site.site_name,
        url,
        publisher: { "@id": `${url}/#organization` },
      },
    ],
  };
}

export default async function Home() {
  const hiddenPages = await getHiddenPages();
  const [home, site, team, tiles, showreel, clients, posts, { categoryTone }] = await Promise.all([
    getHome(),
    getSite(),
    getTeam(),
    getServiceTiles(),
    getShowreel(),
    getClients(),
    getPosts(),
    getCategories(),
  ]);
  const { sections } = home;
  // The home page's sections are one scroll choreography (each tucks under the
  // previous one's exit), so only the closing blog teaser can be switched off;
  // the rest fall back to their built-in copy if the CMS has none.
  const blog = sections.blog;
  const featured = (blog ?? homeBlog).featured_slugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post) => post !== undefined);

  const agency = sections.agency ?? homeAgency;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <SiteHeader hiddenPages={hiddenPages} />
      <main className="flex flex-1 flex-col">
        <HeroFinal lines={(sections.hero ?? homeHero).lines}>
          <ProjectSlider projects={showreel} />
        </HeroFinal>
        <StudioSection content={sections.studio ?? homeStudio} projects={showreel} />
        <ServicesSection services={tiles} />
        {/* <ShowcaseSection /> */}
        <AgencySection eyebrow={agency.eyebrow} heading={agency.heading} copy={agency.copy} cta={hiddenPages.some((slug) => agency.cta?.href.startsWith(`/${slug}`)) ? null : agency.cta} clients={clients} />
        <ContactSection content={sections.contact ?? homeContact} />
        <LeadershipSection content={sections.leadership ?? homeLeadership} owners={team.owners} />
        {blog ? <BlogSection content={blog} posts={featured} tones={categoryTone} /> : null}
      </main>
      <SiteFooter tagline={site.footer_tagline} availability={site.availability_label} services={await getServiceLinks()} hiddenPages={hiddenPages} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(site, team.owners)) }}
      />
    </div>
  );
}
