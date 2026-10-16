import type { MetadataRoute } from "next";

import { getHiddenPages, getPosts, getProjects, getServiceDetails, getSite } from "@/lib/content";

/** /sitemap.xml — every page, including each service, case study and post (from the CMS when connected). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, services, projects, posts, hidden] = await Promise.all([getSite(), getServiceDetails(), getProjects(), getPosts(), getHiddenPages()]);
  const base = site.site_url.replace(/\/$/, "");
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  // Pages switched off in the CMS are left out.
  const listing = ([
    ["services", page("/services", 0.9)],
    ["work", page("/work", 0.9, "weekly")],
    ["about", page("/about", 0.7)],
    ["blog", page("/blog", 0.8, "weekly")],
    ["contact", page("/contact", 0.7)],
  ] as const).filter(([slug]) => !hidden.includes(slug)).map(([, entry]) => entry);

  return [
    page("/", 1, "weekly"),
    ...listing,
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...projects.map((p) => page(`/work/${p.slug}`, 0.6)),
    ...posts.map((p) => ({ ...page(`/blog/${p.slug}`, 0.6), lastModified: new Date(`${p.date}T12:00:00Z`) })),
  ];
}
