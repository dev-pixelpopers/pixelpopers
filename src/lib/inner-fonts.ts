import { JetBrains_Mono, Playfair_Display } from "next/font/google";

/**
 * Extra faces used only by two service concepts (Figma uses them on purpose):
 *  - JetBrains Mono — code editor / terminal UI on Web Development and the
 *    timeline UI on Motion Graphic.
 *  - Playfair Display — the editorial "paper" on Content Writing.
 * Apply with `mono.className` / `serif.className` on the elements that need them.
 */
export const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});
