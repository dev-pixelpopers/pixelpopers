"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandLogo from "@/components/ui/BrandLogo";
import PopButton from "@/components/ui/PopButton";

gsap.registerPlugin(useGSAP);

const links = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work", count: "24" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socials = ["Instagram", "Behance", "LinkedIn", "Dribbble"];

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Full-screen navigation (Figma "01 — Menu (Open)" / "01b — Menu (Mobile)").
 * The overlay itself is `fixed` — the one place positioning is unavoidable —
 * everything inside it is plain flex/grid flow.
 */
export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Lock page scroll, close on Escape, move focus into the dialog.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!open) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline()
          .fromTo(root.current, { clipPath: "circle(0% at 4% 4%)" }, { clipPath: "circle(150% at 4% 4%)", duration: 0.7, ease: "power3.inOut" })
          .from("[data-menu-link]", { yPercent: 110, duration: 0.6, stagger: 0.06, ease: "power3.out" }, "-=0.35")
          .from("[data-menu-aside]", { autoAlpha: 0, y: 30, rotate: -4, duration: 0.6, ease: "back.out(1.6)" }, "-=0.5");
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [open] },
  );

  if (!open) return null;

  // Portalled to <body> so no ancestor stacking context can sit on top of it.
  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-50 overflow-y-auto bg-dusk text-cream"
      style={{
        backgroundImage:
          "radial-gradient(60% 55% at 12% 0%, rgb(106 75 151 / 0.65), transparent 70%), radial-gradient(45% 50% at 85% 100%, rgb(242 119 147 / 0.45), transparent 70%)",
      }}
    >
      <div className="shell flex min-h-full flex-col py-6 md:py-10">
        {/* Top bar — mirrors the site header so nothing jumps on open */}
        <div className="flex items-center justify-between gap-4">
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="flex items-center gap-3 font-display text-nav text-blush-deep uppercase transition-colors hover:text-cream"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 3l14 14M17 3L3 17" />
            </svg>
            Close
          </button>
          <Link href="/" onClick={onClose} aria-label="Pixel Popers — home">
            <BrandLogo onDark />
          </Link>
          <PopButton href="/contact" label="Lets Talk" size="sm" className="max-md:hidden" onClick={onClose} />
        </div>

        <div className="mt-10 grid flex-1 items-center gap-12 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <nav aria-label="Main">
            <ul>
              {links.map((link, i) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <li key={link.href} className="border-b border-cream/10">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-start gap-[clamp(1rem,2.2vw,2.75rem)] py-[clamp(0.35rem,0.9vw,1rem)] ${active ? "text-lagoon" : "text-cream"} transition-colors hover:text-lagoon`}
                    >
                      <span className="mt-[0.6em] font-haas text-micro text-sunbeam">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="overflow-hidden">
                        <span data-menu-link className="flex items-center gap-4">
                          <span
                            className={`font-display text-[clamp(2.5rem,5.3vw,6.375rem)] leading-[1.05] uppercase decoration-[0.06em] underline-offset-[0.18em] ${active ? "underline" : "group-hover:underline"}`}
                          >
                            {link.label}
                          </span>
                          {link.count ? (
                            <span className="self-start rounded-full bg-blush px-3 py-1 font-haas text-micro text-cream">
                              {link.count}
                            </span>
                          ) : null}
                          <span
                            aria-hidden
                            className={`font-display text-[clamp(1.75rem,3vw,3.5rem)] transition-transform ${active ? "" : "-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
                          >
                            →
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-8 font-display text-micro text-cream/50 uppercase max-lg:hidden">
              We make your website poppin’
            </p>
          </nav>

          <aside className="flex flex-col gap-10">
            {/* Tilted showcase card — hidden on small screens like the mobile Figma frame */}
            <div data-menu-aside className="grid max-lg:hidden">
              <div className="col-start-1 row-start-1 rotate-[7deg] overflow-hidden rounded-[2rem] border-[10px] border-white shadow-[0_30px_60px_rgb(0_0_0/0.35)]">
                <Image
                  src="/assets/inner/ui-shop.webp"
                  alt="E-commerce dashboard designed by Pixel Popers"
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                />
              </div>
              <span className="col-start-1 row-start-1 -mt-6 mr-[-1rem] self-start justify-self-end rotate-[-8deg] rounded-full bg-sunbeam px-6 py-3 font-display text-small text-ink uppercase shadow-lg">
                6 Services ✦
              </span>
              <Image
                src="/icons/doodle-flower.svg"
                alt=""
                width={160}
                height={160}
                className="col-start-1 row-start-1 mr-[-2.5rem] mb-[-3rem] w-[clamp(6rem,8vw,10rem)] self-end justify-self-end"
              />
            </div>

            <PopButton href="/contact" label="Lets Talk" className="md:hidden" onClick={onClose} />

            <div>
              <p className="font-display text-micro text-sunbeam uppercase">Say hello</p>
              <a href="mailto:hello@pixelpopers.com" className="mt-2 inline-block font-haas text-[clamp(1.25rem,1.6vw,1.875rem)] text-cream hover:text-lagoon">
                hello@pixelpopers.com
              </a>
              <ul className="mt-6 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s}>
                    <a href="#" className="inline-block rounded-full border border-cream/30 px-5 py-2 font-haas text-micro text-cream/80 transition-colors hover:border-lagoon hover:text-lagoon">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
