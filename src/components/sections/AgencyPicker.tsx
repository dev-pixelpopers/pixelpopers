import {
  AGENCY_VERSION_LABELS,
  AGENCY_VERSIONS,
  type AgencyVersion,
} from "@/components/sections/agency-versions";

/**
 * TEMPORARY: switches between the Agency animation versions. Plain links
 * (full reloads) so every version starts from a clean set of ScrollTriggers.
 */
export default function AgencyPicker({ current }: { current: AgencyVersion }) {
  return (
    <nav
      aria-label="Agency animation version"
      className="fixed bottom-4 left-4 z-[100] flex flex-wrap gap-1 rounded-2xl bg-ink/90 p-1.5 text-xs text-white shadow-lg"
    >
      {AGENCY_VERSIONS.map((v) => (
        <a
          key={v}
          href={`/?agency=${v}#agency`}
          aria-current={v === current ? "page" : undefined}
          className={`rounded-xl px-3 py-1.5 ${v === current ? "bg-blush text-white" : "hover:bg-white/15"}`}
        >
          {AGENCY_VERSION_LABELS[v]}
        </a>
      ))}
    </nav>
  );
}
