import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixelpopers.vercel.app"),
};

/**
 * Shared chrome for every inner page. The home page keeps its own
 * hand-assembled layout in app/page.tsx and is not wrapped by this group.
 */
export default async function InnerLayout({ children }: LayoutProps<"/">) {
  const site = await getSite();

  return (
    <>
      <SiteHeader ctaHref="/contact" />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter tagline={site.footer_tagline} availability={site.availability_label} />
    </>
  );
}
