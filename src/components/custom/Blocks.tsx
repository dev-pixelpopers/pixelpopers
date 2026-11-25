import type { ReactNode } from "react";

import AboutMotion from "@/components/inner/about/AboutMotion";
import AboutClosing from "@/components/inner/about/Closing";
import AboutHero from "@/components/inner/about/Hero";
import Journey from "@/components/inner/about/Journey";
import { Audience, LongFormSplit as AboutLongForm } from "@/components/inner/about/LongForm";
import Process from "@/components/inner/about/Process";
import Story from "@/components/inner/about/Story";
import Studio from "@/components/inner/about/Studio";
import AboutTestimonials from "@/components/inner/about/Testimonials";
import Values from "@/components/inner/about/Values";
import Newsletter from "@/components/inner/blog/Newsletter";
import { BlogHero, JournalIntro, Resources, StartHere, TrendingTags } from "@/components/inner/blog/Sections";
import ContactMotion from "@/components/inner/contact/ContactMotion";
import Intro from "@/components/inner/contact/Intro";
import { AfterSend, Channels, ChatFaq, NextSteps, WhereWhen } from "@/components/inner/contact/Sections";
import Reveal from "@/components/inner/Reveal";
import ServicesHero from "@/components/inner/services-overview/Hero";
import { LongFormSplit as ServicesLongForm, Paragraphs, StatRow } from "@/components/inner/services-overview/LongForm";
import ServicesMarquee from "@/components/inner/services-overview/Marquee";
import QuoteCards from "@/components/inner/services-overview/QuoteCards";
import { Closing as ServicesClosing, Comparison, Explained, Faq, Industries, Models, StatsBand } from "@/components/inner/services-overview/Sections";
import ServiceRows from "@/components/inner/services-overview/ServiceRows";
import ServicesMotion from "@/components/inner/services-overview/ServicesMotion";
import WorkHero from "@/components/inner/work/Hero";
import WorkMarquee from "@/components/inner/work/Marquee";
import { Clients, Cta as WorkCta, Impact, Intro as WorkIntro, Teasers, Testimonials as WorkTestimonials } from "@/components/inner/work/Sections";
import WorkMotion from "@/components/inner/work/WorkMotion";
import {
  emailText,
  getClients,
  getPosts,
  getProjects,
  getQuotes,
  getServiceDetails,
  getServicesPage,
  getSite,
  getTeam,
  whatsappLink,
  withCompanyEmail,
} from "@/lib/content";
import { testimonials as aboutTestimonials } from "@/lib/pages/about";
import { contactTestimonials } from "@/lib/pages/contact";
import { servicesTestimonials } from "@/lib/pages/services";
import { workTestimonials } from "@/lib/pages/work";

/*
  Pages built in the CMS (Pages → New page) are a list of sections copied
  from the site's other pages — "About → Values", "Services → FAQ", … — each
  with its own editable copy. A block's `type` names the section it was
  copied from ("about:values"); it renders with that section's own component
  and that page's own scroll motion, so it looks and moves exactly like the
  original.

  Content arrives in the original section's shape (the CMS copies it and
  builds the form from it), so each renderer hands it straight to the
  component that already renders that shape.
*/

export type Block = { key: string; type: string; content: unknown };

/* eslint-disable @typescript-eslint/no-explicit-any -- block content is CMS JSON in each section's own shape */
type Content = any;

/** `page` is the CMS page's name, e.g. for a copied hero's breadcrumb. */
type Render = (c: Content, page: string) => Promise<ReactNode> | ReactNode;
type Spec = { label: string; motion: "about" | "contact" | "services" | "work" | "reveal"; space: string; render: Render };

const quotes = (layout: Parameters<typeof getQuotes>[0]) => getQuotes(layout);

const SPECS: Record<string, Spec> = {
  /* ── About ─────────────────────────────────────────────────────── */
  "about:hero": { label: "About → Hero", motion: "about", space: "", render: (c, page) => <AboutHero aboutHero={c} crumb={page} /> },
  "about:story": {
    label: "About → Our story",
    motion: "about",
    space: "mt-[clamp(4rem,6vw,7rem)]",
    render: async (c) => <Story aboutStory={c} owners={(await getTeam()).owners} />,
  },
  "about:full_story": {
    label: "About → Full story",
    motion: "about",
    space: "mt-[clamp(5rem,8.33vw,10rem)]",
    render: (c) => <AboutLongForm id={`full-story-${c.heading?.length ?? 0}`} eyebrow={c.eyebrow} heading={c.heading} paragraphs={c.paragraphs} stats={c.stats} />,
  },
  "about:values": {
    label: "About → Values",
    motion: "about",
    space: "mt-[clamp(5rem,9.4vw,11.25rem)]",
    render: (c) => <Values values={c.items ?? c} hidePractice />,
  },
  "about:how_we_work": { label: "About → How we work", motion: "about", space: "mt-[clamp(5rem,10.9vw,13.125rem)]", render: (c) => <Process howWeWork={c} /> },
  "about:audience": { label: "About → Who we work with", motion: "about", space: "mt-[clamp(5rem,8.33vw,10rem)]", render: (c) => <Audience audience={c} /> },
  "about:journey": { label: "About → Journey", motion: "about", space: "mt-[clamp(5rem,8.33vw,10rem)]", render: (c) => <Journey journey={c} /> },
  "about:testimonials": {
    label: "About → Testimonials",
    motion: "about",
    space: "mt-[clamp(4.5rem,6.46vw,7.75rem)]",
    render: async (c) => {
      const items = await quotes(aboutTestimonials.items);
      return items.length ? <AboutTestimonials testimonials={{ ...c, items }} /> : null;
    },
  },
  "about:perks": { label: "About → Perks", motion: "about", space: "mt-[clamp(4.5rem,4.7vw,5.625rem)]", render: (c) => <Studio perks={c} showPerks showHiring={false} /> },
  "about:hiring": { label: "About → We're hiring", motion: "about", space: "mt-[clamp(4.5rem,4.7vw,5.625rem)]", render: (c) => <Studio hiring={c} showPerks={false} showHiring /> },
  "about:cta": { label: "About → Closing call to action", motion: "about", space: "mt-[clamp(5rem,11.5vw,13.75rem)]", render: (c) => <AboutClosing aboutCta={c} /> },

  /* ── Contact ───────────────────────────────────────────────────── */
  "contact:hero": {
    label: "Contact → Hero with the enquiry form",
    motion: "contact",
    space: "",
    render: async (c, page) => {
      const [site, team] = await Promise.all([getSite(), getTeam()]);
      return <Intro CONTACT_EMAIL={site.company_email} contactHero={c} showInfo={false} owners={team.owners} crumb={page} />;
    },
  },
  "contact:next_steps": { label: "Contact → What happens next", motion: "contact", space: "mt-[clamp(4rem,8.33vw,10rem)]", render: (c) => <NextSteps nextSteps={c} /> },
  "contact:channels": {
    label: "Contact → Other ways to say hi",
    motion: "contact",
    space: "mt-[clamp(4rem,8.33vw,10rem)]",
    render: async (c) => {
      const site = await getSite();
      const whatsapp = whatsappLink(site.company_phone);
      const items = (c.items ?? []).flatMap((card: Content) => {
        const item = { ...card, href: withCompanyEmail(card.href ?? "", site.company_email), body: emailText(card.body ?? "", site.company_email) };
        if (!/^https?:\/\/(wa\.me|api\.whatsapp\.com)\/?$/i.test(item.href.trim())) return [item];
        return whatsapp ? [{ ...item, href: whatsapp }] : [];
      });
      return items.length ? <Channels channels={{ ...c, items }} /> : null;
    },
  },
  "contact:chat_faq": { label: "Contact → Chat-style FAQ", motion: "contact", space: "mt-[clamp(4rem,8.85vw,10.625rem)]", render: (c) => <ChatFaq chatFaq={c} /> },
  "contact:after_send": { label: "Contact → After you hit send", motion: "contact", space: "mt-[clamp(4rem,8.85vw,10.625rem)]", render: (c) => <AfterSend afterSend={c} /> },
  "contact:where_when": { label: "Contact → Where & when", motion: "contact", space: "mt-[clamp(4rem,8.33vw,10rem)]", render: (c) => <WhereWhen whereWhen={c} /> },
  "contact:testimonials": {
    label: "Contact → Testimonials",
    motion: "contact",
    space: "mt-[clamp(4rem,8.33vw,10rem)]",
    render: async (c) => {
      const items = await quotes(contactTestimonials.items);
      return items.length ? <QuoteCards id={`quotes-${c.heading?.length ?? 0}`} eyebrow={c.eyebrow} heading={c.heading} items={items} /> : null;
    },
  },

  /* ── Services ──────────────────────────────────────────────────── */
  "services:hero": { label: "Services → Hero", motion: "services", space: "", render: (c, page) => <ServicesHero servicesHero={c} crumb={page} /> },
  "services:intro": {
    label: "Services → Intro with stats",
    motion: "services",
    space: "mt-[clamp(4rem,7.4vw,8.875rem)]",
    render: (c) => (
      <ServicesLongForm id={`intro-${c.heading?.length ?? 0}`} eyebrow={c.eyebrow} heading={c.heading} aside={<StatRow stats={c.stats ?? []} />}>
        <Paragraphs items={c.paragraphs ?? []} />
      </ServicesLongForm>
    ),
  },
  "services:rows": {
    label: "Services → Service list",
    motion: "services",
    space: "mt-[clamp(3.5rem,9.4vw,11.25rem)]",
    render: async (c) => {
      const details = await getServiceDetails();
      return <ServiceRows serviceRows={c.items ?? []} serviceDetails={details.map(({ slug, name }) => ({ slug, name }))} />;
    },
  },
  "services:marquee": { label: "Services → Scrolling marquee", motion: "services", space: "mt-[clamp(3rem,9vw,10.5rem)]", render: (c) => <ServicesMarquee marquee={c} /> },
  "services:explained": {
    label: "Services → Services explained",
    motion: "services",
    space: "mt-[clamp(3rem,8.4vw,10rem)]",
    render: async (c) => {
      const [details, page] = await Promise.all([getServiceDetails(), getServicesPage()]);
      return <Explained explained={c} serviceRows={page.sections.rows?.items ?? []} serviceDetails={details} />;
    },
  },
  "services:faq": { label: "Services → FAQ", motion: "services", space: "mt-[clamp(4.5rem,12.5vw,15rem)]", render: (c) => <Faq servicesFaq={c} /> },
  "services:comparison": { label: "Services → Comparison table", motion: "services", space: "mt-[clamp(4.5rem,10.4vw,12.5rem)]", render: (c) => <Comparison comparison={c} /> },
  "services:industries": { label: "Services → Industries", motion: "services", space: "mt-[clamp(4.5rem,10.4vw,12.5rem)]", render: (c) => <Industries industries={c} /> },
  "services:models": { label: "Services → Ways to work with us", motion: "services", space: "mt-[clamp(4.5rem,13vw,16rem)]", render: (c) => <Models models={c} /> },
  "services:stats": { label: "Services → Stats band", motion: "services", space: "mt-[clamp(3rem,6.25vw,7.5rem)]", render: (c) => <StatsBand servicesStats={c.items ?? []} /> },
  "services:testimonials": {
    label: "Services → Testimonials",
    motion: "services",
    space: "mt-[clamp(3.5rem,5.2vw,6.25rem)]",
    render: async (c) => {
      const items = await quotes(servicesTestimonials.items);
      return items.length ? <QuoteCards id={`quotes-s-${c.heading?.length ?? 0}`} eyebrow={c.eyebrow} heading={c.heading} items={items} /> : null;
    },
  },
  "services:cta": { label: "Services → Closing call to action", motion: "services", space: "mt-[clamp(4.5rem,15vw,18rem)]", render: (c) => <ServicesClosing servicesCta={c} /> },

  /* ── Work ──────────────────────────────────────────────────────── */
  "work:hero": {
    label: "Work → Hero",
    motion: "work",
    space: "",
    render: async (c, page) => <WorkHero workHero={{ ...c, count: c.count || (await getProjects()).length }} crumb={page} />,
  },
  "work:intro": { label: "Work → Intro", motion: "work", space: "mt-[clamp(5rem,8.96vw,10.75rem)]", render: (c) => <WorkIntro workIntro={c} /> },
  "work:clients": {
    label: "Work → Client logos",
    motion: "work",
    space: "mt-[clamp(5rem,8.33vw,10rem)]",
    render: async (c) => {
      const clients = await getClients();
      return clients.length ? <Clients content={c} clients={clients} /> : null;
    },
  },
  "work:impact": { label: "Work → Impact", motion: "work", space: "mt-[clamp(4rem,5.2vw,6.25rem)]", render: (c) => <Impact impact={c} /> },
  "work:testimonials": {
    label: "Work → Testimonials",
    motion: "work",
    space: "mt-[clamp(5rem,8.33vw,10rem)]",
    render: async (c) => {
      const items = await quotes(workTestimonials.items);
      return items.length ? <WorkTestimonials workTestimonials={{ ...c, items }} /> : null;
    },
  },
  "work:teasers": { label: "Work → In the oven", motion: "work", space: "mt-[clamp(4rem,4.7vw,5.625rem)]", render: (c) => <Teasers teasers={c} /> },
  "work:marquees": { label: "Work → Scrolling marquees", motion: "work", space: "mt-[clamp(2.5rem,3.125vw,3.75rem)]", render: (c) => <WorkMarquee marquees={c} /> },
  "work:cta": { label: "Work → Closing call to action", motion: "work", space: "mt-[clamp(4rem,7.3vw,8.75rem)]", render: (c) => <WorkCta workCta={c} /> },

  /* ── Blog ──────────────────────────────────────────────────────── */
  "blog:hero": { label: "Blog → Hero", motion: "reveal", space: "", render: (c, page) => <BlogHero blogHero={c} crumb={page} /> },
  "blog:journal_intro": { label: "Blog → Journal intro", motion: "reveal", space: "mt-[clamp(4rem,6.25vw,7.5rem)]", render: (c) => <JournalIntro journalIntro={c} /> },
  "blog:start_here": {
    label: "Blog → Start here",
    motion: "reveal",
    space: "mt-[clamp(4rem,5vw,6rem)]",
    render: async (c) => <StartHere startHere={c} posts={await getPosts()} />,
  },
  "blog:resources": { label: "Blog → Resources", motion: "reveal", space: "mt-[clamp(4.5rem,4.7vw,5.625rem)]", render: (c) => <Resources resources={c.items ?? []} /> },
  "blog:trending_tags": { label: "Blog → Trending tags", motion: "reveal", space: "mt-[clamp(3rem,3.65vw,4.375rem)]", render: (c) => <TrendingTags trendingTags={c.items ?? []} /> },
  "blog:newsletter": { label: "Blog → Newsletter sign-up", motion: "reveal", space: "mt-[clamp(4.5rem,11.7vw,14rem)]", render: (c) => <Newsletter newsletter={c} /> },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Section types the website can render — the CMS offers the same list. */
export const BLOCK_TYPES = Object.keys(SPECS);

function Motion({ kind, children }: { kind: Spec["motion"]; children: ReactNode }) {
  switch (kind) {
    case "about":
      return <AboutMotion>{children}</AboutMotion>;
    case "contact":
      return <ContactMotion className="overflow-x-clip">{children}</ContactMotion>;
    case "services":
      return <ServicesMotion className="overflow-x-clip">{children}</ServicesMotion>;
    case "work":
      return <WorkMotion>{children}</WorkMotion>;
    default:
      return <Reveal>{children}</Reveal>;
  }
}

/**
 * Renders a CMS-built page's sections in order. The first section sits right
 * under the header; every later one gets the spacing it has on its own page.
 * A section type the website doesn't know (e.g. added by a newer CMS) or one
 * with nothing to show (testimonials with no quotes) is skipped.
 */
export default async function Blocks({ blocks, page }: { blocks: readonly Block[]; /** The page's name (breadcrumbs of copied heroes). */ page: string }) {
  const rendered = await Promise.all(
    blocks.map(async (block, i) => {
      const spec = SPECS[block.type];
      if (!spec || block.content == null) return null;
      const node = await spec.render(block.content, page);
      if (!node) return null;
      // A hero copied below the top still needs breathing room.
      const space = i === 0 ? "" : spec.space || "mt-[clamp(4rem,8.33vw,10rem)]";
      return (
        <div key={block.key} data-block={block.type} className={space}>
          <Motion kind={spec.motion}>{node}</Motion>
        </div>
      );
    }),
  );
  return <>{rendered}</>;
}
