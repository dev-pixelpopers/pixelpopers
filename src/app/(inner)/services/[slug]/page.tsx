import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLongForm from "@/components/inner/service/ServiceLongForm";
import ServiceClosing from "@/components/inner/service/ServiceClosing";
import ServicePageMotion from "@/components/inner/service/ServicePageMotion";
import { serviceConcepts } from "@/components/inner/services/registry";
import { getServiceDetail, serviceDetails } from "@/lib/service-content";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) return {};
  return {
    title: `${service.metaTitle} | Pixel Popers`,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.metaTitle, description: service.metaDescription, type: "website", url: `/services/${service.slug}`, images: [DEFAULT_OG_IMAGE] },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) notFound();

  const { Sections, PackageCard, pageClassName = "", processInConcept = false } = serviceConcepts[service.slug];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    provider: { "@type": "Organization", name: "Pixel Popers", url: "https://pixelpopers.vercel.app" },
    offers: service.packages.map((p) => ({ "@type": "Offer", name: `${service.name} — ${p.name}`, description: p.summary })),
  };

  return (
    <ServicePageMotion className={pageClassName}>
      <Sections service={service} />
      <ServiceLongForm service={service} hideProcess={processInConcept} />
      <ServiceClosing service={service} renderPackage={(pkg, i) => <PackageCard pkg={pkg} index={i} />} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </ServicePageMotion>
  );
}
