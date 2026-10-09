/**
 * Site-wide constants for SEO. The production URL can be overridden per
 * environment with NEXT_PUBLIC_SITE_URL (e.g. a custom domain later).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixelpopers.vercel.app").replace(/\/$/, "");

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
