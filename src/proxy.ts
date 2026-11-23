import { NextResponse, type NextRequest } from "next/server";

/**
 * Redirects managed in the CMS (SEO → Redirects), applied before any page
 * renders: old or never-existing addresses that search engines indexed go
 * to a real page (301 / 302) or are reported as gone for good (410).
 *
 *   /old-page        → exact address (case and trailing slash don't matter)
 *   /old-blog/*      → everything under /old-blog; if the target also ends
 *                      in /*, the rest of the address is carried over
 *
 * The list is fetched from the CMS at most once a minute per server and kept
 * in memory; if the CMS can't be reached the last list keeps working, and
 * pages are never held up waiting for it.
 */

type Rule = { from: string; to: string | null; status: number };

const API = process.env.CMS_API_URL?.trim().replace(/\/+$/, "") || null;
const FRESH_MS = 60_000;
const RETRY_MS = 30_000;
const TIMEOUT_MS = 1500;

let rules: Rule[] = [];
let fetchedAt = 0;
let pending: Promise<void> | null = null;

function refresh(): Promise<void> {
  pending ??= (async () => {
    try {
      const res = await fetch(`${API}/api/v1/redirects`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      if (res.ok) {
        const body = (await res.json()) as { data?: Rule[] };
        rules = Array.isArray(body.data) ? body.data : [];
        fetchedAt = Date.now();
      } else {
        fetchedAt = Date.now() - FRESH_MS + RETRY_MS;
      }
    } catch {
      // CMS down: keep the last list and try again shortly.
      fetchedAt = Date.now() - FRESH_MS + RETRY_MS;
    } finally {
      pending = null;
    }
  })();
  return pending;
}

async function currentRules(): Promise<Rule[]> {
  if (!API) return [];
  const age = Date.now() - fetchedAt;
  if (fetchedAt === 0) await refresh(); // first request on this server: wait (bounded by TIMEOUT_MS)
  else if (age > FRESH_MS) void refresh(); // stale: answer with what we have, refresh in the background
  return rules;
}

/** "/Old-Page/" → "/old-page" — the same normalisation the CMS applies when saving. */
function normalise(pathname: string): string {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    /* keep it as sent */
  }
  path = path.toLowerCase().replace(/\/+$/, "");
  return path === "" ? "/" : path;
}

function match(path: string, list: Rule[]): { rule: Rule; rest: string } | null {
  for (const rule of list) {
    if (rule.from.endsWith("/*")) {
      const base = rule.from.slice(0, -2);
      if (path === base || path.startsWith(`${base}/`)) return { rule, rest: path.slice(base.length) };
    } else if (rule.from === path) {
      return { rule, rest: "" };
    }
  }
  return null;
}

const GONE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed · Pixel Popers</title></head><body style="font-family:system-ui,sans-serif;background:#ffe5d7;color:#220128;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center"><main><p style="color:#ee486e;letter-spacing:.12em;text-transform:uppercase">410 · Page removed</p><h1 style="color:#6a4b97">This page doesn’t exist any more</h1><p><a href="/" style="color:#d0143f">Go to the Pixel Popers home page →</a></p></main></body></html>`;

export async function proxy(request: NextRequest) {
  const list = await currentRules();
  if (!list.length) return NextResponse.next();

  const found = match(normalise(request.nextUrl.pathname), list);
  if (!found) return NextResponse.next();
  const { rule, rest } = found;

  if (rule.status === 410 || !rule.to) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  // "/new/*" carries the rest of a folder address over; query strings are kept
  // unless the target sets its own.
  let to = rule.to.endsWith("/*") ? rule.to.slice(0, -2) + rest : rule.to;
  const target = new URL(to, request.url);
  if (!target.search && request.nextUrl.search) target.search = request.nextUrl.search;
  to = target.toString();

  // Never redirect a page to itself (e.g. a rule whose target matches its own pattern).
  if (target.origin === request.nextUrl.origin && normalise(target.pathname) === normalise(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(to, rule.status === 302 ? 302 : 301);
}

export const config = {
  // Every page address, but not the site's own files: built assets, images,
  // API routes and the files in /public (assets, icons, fonts, favicon…).
  matcher: [
    "/((?!_next/|api/|assets/|icons/|favicon\\.ico|icon-|apple-touch-icon|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml|opengraph-image).*)",
  ],
};
