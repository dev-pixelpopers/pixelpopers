import Script from "next/script";
import type { ReactNode } from "react";

import { getScripts, type CustomScript } from "@/lib/content";

/*
  Code snippets from the CMS (SEO → Scripts & tags): tracking tags, chat
  widgets, verification <meta> tags, structured data. Each entry runs on
  every page or on one page, in the <head> or at the end of the <body>.

  Head snippets are split into their tags and each is rendered as the real
  element: <script> (inline or src), <noscript>, <meta>, <link> and <style>
  (anything else can't live in a <head> and is dropped). End-of-body
  snippets keep any HTML they carry, such as a widget's container <div>.

  - Every-page snippets are rendered by the root layout straight into the
    <head> / end of <body> of the first page a visitor opens, like a pasted
    tag would be. They stay loaded while the visitor moves around the site.
  - One-page snippets go through next/script, which also runs them when the
    visitor arrives at that page from another one without a full reload;
    their <meta>/<link> tags are lifted into the <head> by React.
*/

type Tag = {
  name: "script" | "noscript" | "style" | "meta" | "link";
  attrs: Record<string, string | true>;
  body: string;
};

const TAG_RE = /<(script|noscript|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<(meta|link)\b([^>]*?)\/?>/gi;
const ATTR_RE = /([^\s=/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

/** HTML attribute names → React prop names. */
const PROP: Record<string, string> = {
  class: "className",
  charset: "charSet",
  "http-equiv": "httpEquiv",
  crossorigin: "crossOrigin",
  referrerpolicy: "referrerPolicy",
  nomodule: "noModule",
  fetchpriority: "fetchPriority",
  imagesizes: "imageSizes",
  imagesrcset: "imageSrcSet",
  hreflang: "hrefLang",
};

export function parseSnippet(code: string): Tag[] {
  const tags: Tag[] = [];
  for (const m of code.matchAll(TAG_RE)) {
    const name = (m[1] ?? m[4]).toLowerCase() as Tag["name"];
    const attrs: Tag["attrs"] = {};
    for (const a of (m[2] ?? m[5] ?? "").matchAll(ATTR_RE)) {
      const key = a[1].toLowerCase();
      // Event handlers and inline styles don't belong in a pasted tag.
      if (key.startsWith("on") || key === "style") continue;
      attrs[key] = a[2] ?? a[3] ?? a[4] ?? true;
    }
    tags.push({ name, attrs, body: m[3] ?? "" });
  }
  return tags;
}

function props(attrs: Tag["attrs"]): Record<string, string | boolean> {
  return Object.fromEntries(
    Object.entries(attrs).map(([k, v]) => [k.startsWith("data-") || k.startsWith("aria-") ? k : (PROP[k] ?? k), v]),
  );
}

/** One tag as plain HTML elements — for every-page snippets rendered in the first page's HTML. */
function renderStatic(tag: Tag, key: string): ReactNode {
  const p = props(tag.attrs);
  switch (tag.name) {
    case "meta":
      return <meta key={key} {...p} />;
    case "link":
      return <link key={key} {...p} />;
    case "style":
      return <style key={key} {...p} dangerouslySetInnerHTML={{ __html: tag.body }} />;
    case "noscript":
      return <noscript key={key} dangerouslySetInnerHTML={{ __html: tag.body }} />;
    case "script":
      return tag.attrs.src ? (
        <script key={key} {...p} />
      ) : (
        <script key={key} {...p} dangerouslySetInnerHTML={{ __html: tag.body }} />
      );
  }
}

/** One tag for a single page: scripts via next/script so they also run on in-site navigation. */
function renderForPage(tag: Tag, key: string): ReactNode {
  if (tag.name !== "script") return renderStatic(tag, key);
  // next/script decides when to load, so async/defer from the snippet are dropped.
  const rest = props(tag.attrs);
  const src = rest.src;
  delete rest.src;
  delete rest.async;
  delete rest.defer;
  const type = typeof rest.type === "string" ? rest.type.toLowerCase() : "";
  // Data blocks (JSON-LD, templates) aren't run, so they can stay plain tags.
  if (type && !/^(text|application)\/(javascript|ecmascript)$|^module$/.test(type)) return renderStatic(tag, key);
  return typeof src === "string" ? (
    <Script key={key} id={key} src={src} strategy="afterInteractive" {...rest} />
  ) : (
    <Script key={key} id={key} strategy="afterInteractive" {...rest} dangerouslySetInnerHTML={{ __html: tag.body }} />
  );
}

const forPath = (path: string) => (s: CustomScript) => s.target === path;
const everyPage = (s: CustomScript) => s.target === "*";

/** Every-page snippets for the <head> (root layout). */
export async function SiteHeadCode() {
  const scripts = (await getScripts()).filter((s) => everyPage(s) && s.location === "head");
  return scripts.flatMap((s) => parseSnippet(s.code).map((tag, i) => renderStatic(tag, `cs-${s.id}-${i}`)));
}

/**
 * Every-page snippets for the end of <body> (root layout). These go in
 * exactly as pasted — scripts and any HTML with them (a widget's container
 * <div>, an <iframe>) — like a snippet pasted before </body>. Widgets fill
 * their own containers as soon as they run, so React is told not to expect
 * the markup it sent (suppressHydrationWarning).
 */
export async function SiteBodyCode() {
  const scripts = (await getScripts()).filter((s) => everyPage(s) && s.location === "body");
  return scripts.map((s) => (
    <div key={s.id} data-cms-code={s.id} style={{ display: "contents" }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: s.code }} />
  ));
}

const SCRIPT_BLOCK_RE = /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi;

/** A body snippet's HTML once its scripts are taken out (empty if it was only scripts). */
function markupOnly(code: string): string {
  const rest = code.replace(SCRIPT_BLOCK_RE, "");
  return rest.replace(/<!--[\s\S]*?-->/g, "").trim() ? rest : "";
}

/**
 * Snippets added to one page in the CMS. Render it once on that page with the
 * page's address, e.g. <PageCode path="/about" /> or `/work/${slug}`.
 */
export async function PageCode({ path }: { path: string }) {
  const target = path.toLowerCase().replace(/\/+$/, "") || "/";
  const scripts = (await getScripts()).filter(forPath(target));
  if (!scripts.length) return null;
  // Head snippets first, in the CMS's order; body snippets after them.
  const ordered = [...scripts.filter((s) => s.location === "head"), ...scripts.filter((s) => s.location !== "head")];
  return (
    <>
      {ordered.flatMap((s) => {
        if (s.location !== "body") return parseSnippet(s.code).map((tag, i) => renderForPage(tag, `ps-${s.id}-${i}`));
        // Body snippets: their HTML as pasted, their scripts through next/script.
        const html = markupOnly(s.code);
        const scriptTags = parseSnippet(s.code).filter((t) => t.name === "script");
        return [
          html ? <div key={`ph-${s.id}`} data-cms-code={s.id} style={{ display: "contents" }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} /> : null,
          ...scriptTags.map((tag, i) => renderForPage(tag, `ps-${s.id}-${i}`)),
        ];
      })}
    </>
  );
}
