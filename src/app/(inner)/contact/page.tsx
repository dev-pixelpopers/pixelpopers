import type { Metadata } from "next";
import ContactMotion from "@/components/inner/contact/ContactMotion";
import Intro from "@/components/inner/contact/Intro";
import { AfterSend, Channels, ChatFaq, NextSteps, WhereWhen } from "@/components/inner/contact/Sections";
import QuoteCards from "@/components/inner/services-overview/QuoteCards";
import { getContactPage, getQuotes, getSite, getTeam } from "@/lib/content";
import { contactTestimonials } from "@/lib/pages/contact";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPage();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/contact" },
    openGraph: { title: seo.title, description: seo.description, type: "website", url: "/contact", images: [seo.ogImage ?? DEFAULT_OG_IMAGE] },
  };
}

/*
  Contact page. Copy from the CMS (Pages → Contact) and the public email from
  Site settings; sections switched off there are left out. The form posts
  into the CMS inbox (Enquiries).
*/
export default async function ContactPage() {
  const [{ seo, sections: s }, site, team, quotes] = await Promise.all([
    getContactPage(),
    getSite(),
    getTeam(),
    getQuotes(contactTestimonials.items),
  ]);
  const url = site.site_url;
  const email = site.company_email;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: seo.title,
    description: seo.description,
    url: `${url}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: site.site_name,
      url,
      logo: `${url}/assets/logo-pixelpopers.png`,
      email,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email,
        areaServed: "Worldwide",
        availableLanguage: ["English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
    },
  };

  return (
    <ContactMotion className="flex flex-col overflow-x-clip pb-[clamp(4rem,6vw,7rem)]">
      {s.hero ? (
        <Intro
          CONTACT_EMAIL={email}
          contactHero={s.hero}
          contactInfo={s.info ?? undefined}
          showInfo={!!s.info}
          contactForm={s.form ?? undefined}
          owners={team.owners}
        />
      ) : null}
      {s.next_steps ? (
        <div className="mt-[clamp(4rem,8.33vw,10rem)]">
          <NextSteps nextSteps={s.next_steps} />
        </div>
      ) : null}
      {s.channels ? (
        <div className="mt-[clamp(4rem,8.33vw,10rem)]">
          <Channels channels={s.channels} />
        </div>
      ) : null}
      {s.chat_faq ? (
        <div className="mt-[clamp(4rem,8.85vw,10.625rem)]">
          <ChatFaq chatFaq={s.chat_faq} />
        </div>
      ) : null}
      {s.after_send ? (
        <div className="mt-[clamp(4rem,8.85vw,10.625rem)]">
          <AfterSend afterSend={s.after_send} />
        </div>
      ) : null}
      {s.where_when ? (
        <div className="mt-[clamp(4rem,8.33vw,10rem)]">
          <WhereWhen whereWhen={s.where_when} />
        </div>
      ) : null}
      {s.testimonials && quotes.length ? (
        <div className="mt-[clamp(4rem,8.33vw,10rem)]">
          <QuoteCards id="testimonials-title" eyebrow={s.testimonials.eyebrow} heading={s.testimonials.heading} items={quotes} />
        </div>
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </ContactMotion>
  );
}
