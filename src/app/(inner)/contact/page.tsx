import type { Metadata } from "next";
import ContactMotion from "@/components/inner/contact/ContactMotion";
import Intro from "@/components/inner/contact/Intro";
import { AfterSend, Channels, ChatFaq, NextSteps, WhereWhen } from "@/components/inner/contact/Sections";
import QuoteCards from "@/components/inner/services-overview/QuoteCards";
import { getContactPage, getQuotes, getSite, getTeam, assertPagePublished, socialLinks, whatsappLink } from "@/lib/content";
import { contactTestimonials } from "@/lib/pages/contact";
import { DEFAULT_OG_IMAGE, fitTitle } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPage();
  return {
    title: { absolute: fitTitle(seo.title, "") },
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
  await assertPagePublished("contact");
  const [{ seo, sections: s }, site, team, quotes] = await Promise.all([
    getContactPage(),
    getSite(),
    getTeam(),
    getQuotes(contactTestimonials.items),
  ]);
  const url = site.site_url;
  const email = site.company_email;
  const socials = socialLinks(site);
  const whatsapp = whatsappLink(site.company_phone);
  // Social pills link to the real profiles in Site settings; none set → no pills.
  const info = s.info ? { ...s.info, socials: socials.map(({ label, href }) => ({ label, href })) } : null;
  // The WhatsApp card opens a chat with the studio's number (Site settings →
  // Company → Phone). A bare https://wa.me/ is a broken link, so without a
  // number the card is left out.
  const channels = s.channels
    ? {
        ...s.channels,
        items: s.channels.items.flatMap((c) => {
          if (!/^https?:\/\/(wa\.me|api\.whatsapp\.com)\/?$/i.test(c.href.trim())) return [c];
          return whatsapp ? [{ ...c, href: whatsapp }] : [];
        }),
      }
    : null;

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
      ...(site.company_phone ? { telephone: site.company_phone } : {}),
      ...(socials.length ? { sameAs: socials.map((x) => x.href) } : {}),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email,
        ...(site.company_phone ? { telephone: site.company_phone } : {}),
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
          contactInfo={info ?? undefined}
          showInfo={!!info}
          contactForm={s.form ?? undefined}
          owners={team.owners}
        />
      ) : null}
      {s.next_steps ? (
        <div className="mt-[clamp(4rem,8.33vw,10rem)]">
          <NextSteps nextSteps={s.next_steps} />
        </div>
      ) : null}
      {channels && channels.items.length ? (
        <div className="mt-[clamp(4rem,8.33vw,10rem)]">
          <Channels channels={channels} />
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
