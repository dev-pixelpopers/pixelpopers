import { CUBE_ENTRIES, DEFAULT_CUBE_ENTRY, type CubeEntry } from "@/components/ui/studio-cube-entries";

/**
 * TEMPORARY floating switcher for comparing the Studio cube's entrances.
 * Plain links (full reloads), so each plays from a clean page. Remove it — and
 * the `?cube=` handling in `app/page.tsx` — once one is chosen.
 */
export default function CubeEntryPicker({ current }: { current: CubeEntry }) {
  return (
    <nav
      aria-label="Cube entrance"
      className="fixed right-4 bottom-4 z-50 flex items-center gap-1 rounded-full border-2 border-ink bg-cream/90 p-1 font-display text-[0.6875rem] uppercase shadow-card backdrop-blur-sm"
    >
      {CUBE_ENTRIES.map(({ id, label, hint }) => (
        <a
          key={id}
          href={id === DEFAULT_CUBE_ENTRY ? "/" : `/?cube=${id}`}
          title={hint}
          aria-current={id === current ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            id === current ? "bg-ink text-cream" : "text-ink hover:bg-sunbeam"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
