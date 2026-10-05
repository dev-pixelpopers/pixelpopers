import Link from "next/link";

type Crumb = { label: string; href?: string };

/** "SERVICES / BRAND IDENTITY" trail with BreadcrumbList structured data. */
export default function Breadcrumb({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://pixelpopers.vercel.app${c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-micro tracking-wide uppercase">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-3">
            {i > 0 ? <span aria-hidden className="text-ink/40">/</span> : null}
            {c.href ? (
              <Link href={c.href} className="text-ink/60 transition-colors hover:text-blush">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-blush">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
