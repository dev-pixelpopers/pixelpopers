/*
  The mobile app page's icon set: line icons on a 24-unit grid with round
  2px strokes, drawn in currentColor so each sits on its coloured app tile.
  The CMS picks icons by name (Page sections → icon dropdowns); the backend
  lists the same names in App\Filament\Support\MobileAppSections::ICONS.
*/

const PATHS = {
  sparkles: ["M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z", "M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"],
  "face-id": ["M4 8V6a2 2 0 0 1 2-2h2", "M16 4h2a2 2 0 0 1 2 2v2", "M20 16v2a2 2 0 0 1-2 2h-2", "M8 20H6a2 2 0 0 1-2-2v-2", "M9 9.5v1", "M15 9.5v1", "M12 9.5V13h-1", "M9.5 15.5a3.5 3.5 0 0 0 5 0"],
  bell: ["M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z", "M10 20.5a2 2 0 0 0 4 0"],
  "cloud-sync": ["M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5", "M12 11.5v8", "M9 16.5l3 3 3-3"],
  card: ["M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M3 10h18", "M7 15h3"],
  pin: ["M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z", "M12 7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"],
  chat: ["M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4z", "M8.5 10.5h.01", "M12 10.5h.01", "M15.5 10.5h.01"],
  search: ["M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z", "M16 16l4.5 4.5"],
  camera: ["M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z", "M12 9.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"],
  link: ["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
  chart: ["M4 20h16", "M7 16v-4", "M12 16V6", "M17 16V9"],
  globe: ["M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z", "M3 12h18", "M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"],
  moon: ["M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"],
  users: ["M9 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z", "M3 20a6 6 0 0 1 12 0", "M16 4.5a3.5 3.5 0 0 1 0 7", "M17.5 14.5A6 6 0 0 1 21 20"],
  update: ["M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z", "M12 16V8", "M8.5 11.5L12 8l3.5 3.5"],
  lifebuoy: ["M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z", "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z", "M5.6 5.6l3.6 3.6", "M14.8 14.8l3.6 3.6", "M18.4 5.6l-3.6 3.6", "M9.2 14.8l-3.6 3.6"],
  star: ["M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"],
  accessibility: ["M12 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z", "M5 8.5l7 1.5 7-1.5", "M12 10v4.5", "M12 14.5l-3 6", "M12 14.5l3 6"],
  phone: ["M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M10.5 6h3", "M11 18h2"],
  chip: ["M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z", "M10 3v4", "M14 3v4", "M10 17v4", "M14 17v4", "M3 10h4", "M3 14h4", "M17 10h4", "M17 14h4"],
  layers: ["M12 2.5l9 5-9 5-9-5z", "M3 12l9 5 9-5", "M3 16.5l9 5 9-5"],
  pen: ["M15 4.5l4.5 4.5L9 19.5H4.5V15z", "M12.5 7l4.5 4.5"],
  server: ["M5.5 3.5h13A1.5 1.5 0 0 1 20 5v4a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 9V5a1.5 1.5 0 0 1 1.5-1.5z", "M5.5 13.5h13A1.5 1.5 0 0 1 20 15v4a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-4a1.5 1.5 0 0 1 1.5-1.5z", "M8 7h.01", "M8 17h.01"],
  rocket: ["M10 14l-2.5-2.5C9 6.5 12.5 3.5 20.5 3.5c0 8-3 11.5-8 13z", "M15 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z", "M7.5 11.5H4l2.5-3.5h4", "M12.5 16.5V20l3.5-2.5v-4", "M6 15c-1.5 1-2 3.5-2 5 1.5 0 4-.5 5-2"],
  wrench: ["M15 4a5 5 0 0 0-4.6 6.9L4 17.3V20h2.7l6.4-6.4A5 5 0 0 0 20 9l-3 3-3-1-1-3z"],
  store: ["M4 9l1.5-5h13L20 9", "M4 9a2.67 2.67 0 0 0 5.33 0 2.67 2.67 0 0 0 5.34 0A2.67 2.67 0 0 0 20 9", "M5.5 11.5V20h13v-8.5", "M10 20v-4.5h4V20"],
  shield: ["M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z", "M9 12l2 2 4-4"],
  code: ["M8.5 8l-4 4 4 4", "M15.5 8l4 4-4 4", "M13.5 5l-3 14"],
} as const;

export type GlyphName = keyof typeof PATHS;

export function AppGlyph({ name, className = "" }: { name: string; className?: string }) {
  const paths = PATHS[name as GlyphName] ?? PATHS.sparkles;
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
