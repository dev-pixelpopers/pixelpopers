"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

/**
 * Figma "Table of contents" card. Highlights the section currently being
 * read (bold ink + pink bar) by checking which h2 has passed the upper third of the viewport.
 */
export default function Toc({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <nav
      aria-labelledby="toc-title"
      className="rounded-3xl border border-white bg-white/60 p-7 backdrop-blur-sm"
    >
      <p
        id="toc-title"
        className="font-display text-micro text-blush-ink uppercase"
      >
        In this article
      </p>
      <ol className="mt-6 flex flex-col gap-1">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id} className="flex items-center gap-3">
              <span
                aria-hidden
                className={`h-7 w-1 shrink-0 rounded-full ${on ? "bg-blush" : "bg-transparent"}`}
              />
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className={`py-2.5 font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-tight transition-colors hover:text-blush-deep ${
                  on ? "font-bold text-ink" : "text-ink/60"
                }`}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
