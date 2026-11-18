import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getHiddenPages, getServiceLinks, getSite, socialLinks } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

/**
 * Shared chrome for every inner page. The home page keeps its own
 * hand-assembled layout in app/page.tsx and is not wrapped by this group.
 */
export default async function InnerLayout({ children }: LayoutProps<"/">) {
  const [site, services, hiddenPages] = await Promise.all([getSite(), getServiceLinks(), getHiddenPages()]);

  return (
    <>
      <SiteHeader ctaHref="/contact" hiddenPages={hiddenPages} email={site.company_email} socials={socialLinks(site).map(({ label, href }) => ({ label, href }))} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter tagline={site.footer_tagline} availability={site.availability_label} services={services} hiddenPages={hiddenPages} />
    </>
  );
}
