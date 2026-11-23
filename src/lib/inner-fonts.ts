import localFont from "next/font/local";

/**
 * Extra faces used only by two service concepts (Figma uses them on purpose):
 *  - JetBrains Mono — code editor / terminal UI on Web Development and the
 *    timeline UI on Motion Graphic.
 *  - Playfair Display — the editorial "paper" on Content Writing.
 * Apply with `mono.className` / `serif.className` on the elements that need them.
 *
 * Both are open-source (SIL OFL) and stored in /public/assets/fonts rather
 * than fetched from Google Fonts during the build, which made deploys fail
 * whenever that download did. (next/font needs every path written out.)
 */
export const mono = localFont({
  src: [
    { path: "../../public/assets/fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../public/assets/fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../public/assets/fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: false,
});

export const serif = localFont({
  src: [
    { path: "../../public/assets/fonts/playfair-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../public/assets/fonts/playfair-display-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/assets/fonts/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../public/assets/fonts/playfair-display-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "../../public/assets/fonts/playfair-display-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../../public/assets/fonts/playfair-display-latin-700-italic.woff2", weight: "700", style: "italic" },
    { path: "../../public/assets/fonts/playfair-display-latin-900-normal.woff2", weight: "900", style: "normal" },
    { path: "../../public/assets/fonts/playfair-display-latin-900-italic.woff2", weight: "900", style: "italic" },
  ],
  display: "swap",
  preload: false,
});
