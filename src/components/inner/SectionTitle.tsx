import type { ReactNode } from "react";

type SectionTitleProps = {
  /** Small heavy line above the heading (Haas Grot, pink in Figma). */
  eyebrow?: string;
  title: ReactNode;
  /** Heading level — keep one h1 per page. */
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  /** `light` = on cream/paper, `dark` = on ink/dusk backgrounds. */
  tone?: "light" | "dark";
  size?: "lg" | "md";
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
};

/**
 * The inner-page section heading pair used across every Figma frame:
 * Haas Grot ExtraBold eyebrow (56px) over a Nevera headline (76px).
 */
export default function SectionTitle({
  eyebrow,
  title,
  as: Tag = "h2",
  align = "left",
  tone = "light",
  size = "lg",
  className = "",
  eyebrowClassName = "",
  titleClassName = "",
}: SectionTitleProps) {
  return (
    <div data-reveal data-wm="heading" className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow ? (
        <p data-wm="eyebrow" className={`font-haas text-eyebrow leading-none text-blush uppercase ${eyebrowClassName}`}>
          {eyebrow}
        </p>
      ) : null}
      <Tag
        data-wm="title"
        className={`mt-[0.35em] font-display leading-[1.1] uppercase ${size === "lg" ? "text-h2" : "text-h3"} ${tone === "dark" ? "text-cream" : "text-grape"} ${titleClassName}`}
      >
        {title}
      </Tag>
    </div>
  );
}
