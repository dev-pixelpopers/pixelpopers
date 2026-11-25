"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import PopButton from "@/components/ui/PopButton";
import MenuOverlay from "@/components/layout/MenuOverlay";

type SiteHeaderProps = {
  /** Target of the "Lets Talk" button — the home page scrolls to its own contact section. */
  ctaHref?: string;
  /** Pages switched off in the CMS; the menu leaves their links out. */
  hiddenPages?: readonly string[];
  /** Social profiles for the menu (Site settings → Social). */
  socials?: readonly { label: string; href: string }[];
  /** Site settings → Company → Email, shown in the menu. */
  email?: string;
  /** The main menu's links (Settings → Navigation). */
  links?: readonly { label: string; href: string; pill?: string; newTab?: boolean }[];
};

export default function SiteHeader({ ctaHref = "#contact", hiddenPages, socials, email, links }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="shell relative z-30 flex items-center justify-between gap-4 py-6 md:py-10">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        className="cursor-pointer font-display text-nav text-blush-deep uppercase transition-colors hover:text-grape"
      >
        Menu
      </button>

      <Link href="/" aria-label="Pixel Popers — home">
        <BrandLogo priority />
      </Link>

      <PopButton href={ctaHref} label="Lets Talk" size="sm" />

      <MenuOverlay open={menuOpen} onClose={closeMenu} hiddenPages={hiddenPages} socials={socials} email={email} links={links} />
    </header>
  );
}
