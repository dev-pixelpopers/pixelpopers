/**
 * TEMPORARY: the Agency section's animation versions, picked with
 * `?agency=` while they are compared. Plain module (no "use client") so the
 * page can parse the query on the server.
 */
export const AGENCY_VERSIONS = ["original", "v1", "v2", "v3", "v4"] as const;

export type AgencyVersion = (typeof AGENCY_VERSIONS)[number];

export const AGENCY_VERSION_LABELS: Record<AgencyVersion, string> = {
  original: "Original",
  v1: "V1 Popcorn",
  v2: "V2 Fan & deal",
  v3: "V3 Shake & blast",
  v4: "V4 Tornado",
};

export function toAgencyVersion(value: string | string[] | undefined): AgencyVersion {
  const v = Array.isArray(value) ? value[0] : value;
  return (AGENCY_VERSIONS as readonly string[]).includes(v ?? "") ? (v as AgencyVersion) : "v1";
}
