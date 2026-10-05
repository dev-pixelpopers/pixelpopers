"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

type RevealCardProps = {
  children: ReactNode;
  className?: string;
  /** Accessible name for the toggle, e.g. "Chapter 2: Position — show details". */
  label: string;
  as?: "li" | "div";
};

/**
 * A card with a "revealed" state. On devices that can hover it opens on
 * hover (pure CSS via `group-hover:`); on touch screens and for keyboard
 * users it toggles on tap / Enter / Space and exposes `data-open` so
 * children can style the open state with `group-data-[open=true]:`.
 *
 * The revealed copy is always in the DOM, so it stays crawlable.
 */
export default function RevealCard({ children, className = "", label, as: Tag = "li" }: RevealCardProps) {
  const [open, setOpen] = useState(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <Tag
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={open}
      data-open={open}
      onClick={() => setOpen((o) => !o)}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setOpen(false)}
      className={`group cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-lagoon/60 ${className}`}
    >
      {children}
    </Tag>
  );
}
