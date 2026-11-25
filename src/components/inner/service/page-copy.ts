/**
 * The words of a bespoke service page's design sections, with the CMS's
 * edits (Services → <service> → Page sections) laid over the design's own:
 * text left empty in the CMS keeps the design's wording, and lists keep the
 * design's length — each item has its place (and colour) in the layout, so
 * the CMS edits what they say, never how many there are.
 */
export function overlayCopy<T>(base: T, edit: unknown): T {
  if (Array.isArray(base)) {
    const list = Array.isArray(edit) ? edit : [];
    return base.map((item, i) => overlayCopy(item, list[i])) as T;
  }
  if (base && typeof base === "object") {
    const obj = edit && typeof edit === "object" && !Array.isArray(edit) ? (edit as Record<string, unknown>) : {};
    return Object.fromEntries(Object.entries(base).map(([k, v]) => [k, overlayCopy(v, obj[k])])) as T;
  }
  if (typeof base === "string") return (typeof edit === "string" && edit.trim() ? edit.trim() : base) as T;
  return base;
}
