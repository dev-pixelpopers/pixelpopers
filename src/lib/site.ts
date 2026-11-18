/**
 * Site-wide constants for SEO. The production URL can be overridden per
 * environment with NEXT_PUBLIC_SITE_URL (e.g. a custom domain later).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pixelpopers.com").replace(/\/$/, "");

export const SITE_NAME = "Pixel Popers";

export const SITE_TITLE = "Pixel Popers — We make your website poppin’";

export const SITE_DESCRIPTION =
  "A funky creative studio for brand identity, UI/UX, web development, motion, content and digital marketing. From strategy to execution, we make brands people notice.";

/**
 * The site-wide share card (`app/opengraph-image.tsx`). A page that sets its
 * own `openGraph` replaces the root one wholesale, image included, so pages
 * without an image of their own pass this explicitly.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
};

/** Search engines cut titles off at roughly 60–65 characters; SEO audits flag anything over 70. */
export const TITLE_MAX = 65;

/**
 * A page's <title>, kept within TITLE_MAX characters. The " | Pixel Popers"
 * suffix is added only when it still fits (titles from the CMS that already
 * name the brand are left as they are), and an over-long title is cut at a
 * word boundary — before a trailing "— …" or "| …" part when there is one.
 */
export function fitTitle(title: string, suffix = ` | ${SITE_NAME}`): string {
  const clean = title.replace(/\s+/g, " ").trim();
  const branded = /pixel\s*popers/i.test(clean);
  if (!branded && suffix && clean.length + suffix.length <= TITLE_MAX) return clean + suffix;
  if (clean.length <= TITLE_MAX) return clean;
  // Drop trailing segments ("A — B — C | Brand") until it fits.
  const parts = clean.split(/\s+[—|–-]\s+/);
  while (parts.length > 1) {
    parts.pop();
    const joined = clean.slice(0, clean.indexOf(parts[parts.length - 1]) + parts[parts.length - 1].length);
    if (joined.length <= TITLE_MAX) return joined;
  }
  const cut = clean.slice(0, TITLE_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,&—|–-]+$/, "")}…`;
}
