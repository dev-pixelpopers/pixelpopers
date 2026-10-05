"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import PopButton from "@/components/ui/PopButton";
import MenuOverlay from "@/components/layout/MenuOverlay";

type SiteHeaderProps = {
  /** Target of the "Lets Talk" button — the home page scrolls to its own contact section. */
  ctaHref?: string;
};

export default function SiteHeader({ ctaHref = "#contact" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="shell relative z-20 flex items-center justify-between gap-4 py-6 md:py-10">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        className="cursor-pointer font-display text-nav text-blush uppercase transition-colors hover:text-grape"
      >
        Menu
      </button>

      <Link href="/" aria-label="Pixel Popers — home">
        <BrandLogo priority />
      </Link>

      <PopButton href={ctaHref} label="Lets Talk" size="sm" />

      <MenuOverlay open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
