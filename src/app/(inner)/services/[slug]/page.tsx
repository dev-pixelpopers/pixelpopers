import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServiceLongForm from "@/components/inner/service/ServiceLongForm";
import ServiceClosing from "@/components/inner/service/ServiceClosing";
import ServicePageMotion from "@/components/inner/service/ServicePageMotion";
import { conceptFor } from "@/components/inner/services/registry";
import { ServiceMediaProvider } from "@/components/inner/services/ServiceImage";
import { getServiceDetail, getServiceDetails, getSite } from "@/lib/content";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

/** Services added in the CMS after a build render on first visit. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getServiceDetails();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceDetail(slug);
  if (!service) return {};
  const og = (service as { ogImage?: string | null }).ogImage;
  return {
    title: `${service.metaTitle || service.name} | Pixel Popers`,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.metaTitle, description: service.metaDescription, type: "website", url: `/services/${service.slug}`, images: [og || DEFAULT_OG_IMAGE] },
  };
}

/*
  A service page: its concept sections (hero and the page's bespoke design —
  a generic hero for services added in the CMS), then the shared long-form
  copy, packages, FAQs and CTA. Sections switched off in the CMS are skipped.
*/
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, allServices, site] = await Promise.all([getServiceDetail(slug), getServiceDetails(), getSite()]);
  if (!service) notFound();

  const { Sections, PackageCard, pageClassName = "", processInConcept = false } = conceptFor(service.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    provider: { "@type": "Organization", name: site.site_name, url: site.site_url },
    offers: (service.hidden?.includes("packages") ? [] : service.packages).map((p) => ({
      "@type": "Offer",
      name: `${service.name} — ${p.name}`,
      description: p.summary,
    })),
  };

  return (
    <ServicePageMotion className={pageClassName}>
      <ServiceMediaProvider images={service.images}>
        <Sections service={service} />
      </ServiceMediaProvider>
      <ServiceLongForm service={service} hideProcess={processInConcept} />
      <ServiceClosing
        service={service}
        serviceDetails={allServices}
        renderPackage={(pkg, i) => <PackageCard pkg={pkg} index={i} />}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </ServicePageMotion>
  );
}
