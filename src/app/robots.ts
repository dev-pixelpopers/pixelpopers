import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * /robots.txt — search engines and AI search / answer crawlers (ChatGPT,
 * Claude, Perplexity, Gemini, Apple) can crawl the whole site; only the
 * form and cache endpoints under /api/ are kept out. The bots share one
 * group, so they all follow the same rules.
 */
const CRAWLERS = [
  "*",
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: CRAWLERS,
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
