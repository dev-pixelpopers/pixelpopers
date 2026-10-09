import type { ComponentPropsWithoutRef } from "react";

type PopButtonProps = {
  label: string;
  /** `md` matches the 80×68 CTA block, `sm` the 68×68 header block. */
  size?: "sm" | "md";
} & ComponentPropsWithoutRef<"a">;

/**
 * The signature Figma button: a solid block with the label starting inside it
 * and overhanging to the right. Built in flow with a negative margin rather
 * than absolute offsets so it reflows and shrinks with the type scale.
 */
export default function PopButton({
  label,
  size = "md",
  className = "",
  ...props
}: PopButtonProps) {
  const block =
    size === "md"
      ? "w-[clamp(2.75rem,4.17vw,5rem)]"
      : "w-[clamp(2.375rem,3.54vw,4.25rem)]";

  return (
    <a
      {...props}
      className={`relative group inline-flex items-center text-nav ${className}`}
    >
      <span
        aria-hidden
        className={`${block} h-[clamp(2.375rem,3.54vw,4.25rem)] shrink-0 bg-white transition-all duration-300 ease-out group-hover:w-full absolute z-0 group-hover:bg-sunbeam`}
      />
      <span className="relative z-10 px-5 font-display whitespace-nowrap text-blush-deep uppercase">
        {label}
      </span>
    </a>
  );
}
