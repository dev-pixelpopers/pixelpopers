"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/inner/SectionTitle";
import type { ServiceDetail } from "@/lib/service-content";
import { AppGlyph } from "./AppGlyph";
import { mobileCopy } from "./copy";

/*
  "What's included" as a phone's Settings screen: each thing in the box is a
  setting with its own app icon, and every toggle flips on as the phone
  scrolls into view ("Everything's switched on"). Tapping a setting opens
  what it covers — under the row on phones, and on a big card beside the
  phone on desktop.

  The items are the service's "What's included" list (Services → Included);
  the heading, intro, screen title and icons are Page sections → What's
  included. Every item's text is in the HTML whether or not it's open.
*/

const tiles = ["bg-blush text-white", "bg-grape text-white", "bg-lagoon text-white", "bg-sunbeam text-ink", "bg-lav text-ink", "bg-ink text-sunbeam", "bg-blush-ink text-white", "bg-lagoon-ink text-white"];
const cards = [
  "bg-blush text-white",
  "bg-grape text-white",
  "bg-lagoon text-white",
  "bg-sunbeam text-ink",
  "bg-lav text-ink",
  "bg-ink text-white",
  "bg-blush-ink text-white",
  "bg-lagoon-ink text-white",
];
const pad = (n: number) => String(n).padStart(2, "0");

export default function Included({ service }: { service: ServiceDetail }) {
  const copy = mobileCopy(service).included;
  const items = service.included;
  const [active, setActive] = useState(0);
  // Toggles start on (the no-JS / reduced-motion state) and replay on scroll.
  const [onCount, setOnCount] = useState(items.length);
  const phone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = phone.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOnCount(0);
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        items.forEach((_, i) => timers.push(window.setTimeout(() => setOnCount(i + 1), 250 + i * 160)));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [items]);

  if (!items.length) return null;
  const current = items[Math.min(active, items.length - 1)];
  const icon = (i: number) => copy.icons[i % copy.icons.length].icon;

  return (
    <section aria-labelledby="included-title" className="grid items-start gap-x-[clamp(2rem,5vw,6rem)] gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
      <div className="lg:sticky lg:top-[clamp(6rem,8vw,9rem)]">
        <SectionTitle eyebrow={copy.eyebrow} title={<span id="included-title" className="whitespace-pre-line">{copy.heading}</span>} />
        {copy.text ? (
          <p data-reveal className="mt-[clamp(1rem,1.46vw,1.75rem)] max-w-[34rem] font-copy text-body leading-[1.64] font-light whitespace-pre-line text-ink/85">
            {copy.text}
          </p>
        ) : null}

        {/* Desktop: the open setting, big. (Phones open it under the row instead.) */}
        <div aria-hidden className="relative mt-[clamp(2.5rem,3.65vw,4.375rem)] hidden max-w-[36rem] lg:block">
          <div
            key={active}
            className={`relative rotate-[-2deg] rounded-[clamp(1.75rem,2.08vw,2.5rem)] p-[clamp(2rem,2.6vw,3.125rem)] shadow-[0_28px_60px_rgb(34_1_40/0.18)] motion-safe:animate-[inc-pop_0.45s_cubic-bezier(.2,.9,.3,1.3)] ${cards[active % cards.length]}`}
          >
            <div className="flex items-start justify-between gap-6">
              <span className="grid size-[clamp(4.5rem,5.2vw,6.25rem)] place-items-center rounded-[28%] bg-white/90 text-ink shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
                <AppGlyph name={icon(active)} className="w-[50%]" />
              </span>
              <span className="flex items-baseline gap-2 opacity-45">
                <span className="font-pop text-[clamp(3rem,4.17vw,5rem)] leading-[0.8]">{pad(active + 1)}</span>
                <span className="font-display text-[clamp(0.875rem,1.04vw,1.25rem)]">of {pad(items.length)}</span>
              </span>
            </div>
            <p className="mt-[clamp(1.5rem,2.08vw,2.5rem)] font-display text-[clamp(1.5rem,1.98vw,2.375rem)] leading-[1.15] uppercase">{current.title}</p>
            <p className="mt-3 font-copy text-[clamp(1rem,1.04vw,1.25rem)] leading-[1.6] opacity-90">{current.body}</p>
          </div>
          <span className="absolute -top-5 -right-4 rotate-[8deg] rounded-full bg-sunbeam px-5 py-2.5 font-display text-[clamp(0.75rem,0.83vw,1rem)] text-ink uppercase shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
            {onCount} / {items.length} on
          </span>
        </div>
      </div>

      {/* The phone: a Settings screen with one row per included item. */}
      <div ref={phone} data-reveal className="@container mx-auto w-full max-w-[30rem]">
        <div className="rounded-[12cqw] bg-ink p-[3cqw] shadow-[0_30px_70px_rgb(34_1_40/0.25)]">
          <div className="overflow-hidden rounded-[9.5cqw] bg-[#f4eef2] pb-[6cqw]">
            <div aria-hidden className="flex items-center justify-between px-[7cqw] pt-[4cqw] font-copy text-[max(0.6875rem,3.2cqw)] font-bold text-ink">
              <span>9:41</span>
              <span className="h-[6cqw] w-[24cqw] rounded-full bg-ink" />
              <span className="tracking-[0.1em]">●●●</span>
            </div>
            <p className="px-[6cqw] pt-[6cqw] font-copy text-[max(1.5rem,8.5cqw)] leading-none font-extrabold text-ink">{copy.screen}</p>
            <div aria-hidden className="mx-[5cqw] mt-[4cqw] flex h-[9cqw] items-center gap-[2cqw] rounded-[2.6cqw] bg-ink/8 px-[3cqw] font-copy text-[max(0.75rem,3.6cqw)] text-ink/40">
              ⌕ <span>Search</span>
            </div>

            <ul className="mx-[5cqw] mt-[5cqw] overflow-hidden rounded-[4.5cqw] bg-white">
              {items.map((item, i) => {
                const open = i === active;
                const on = i < onCount;
                return (
                  <li key={i} className="border-b border-ink/8 last:border-b-0">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`inc-body-${i}`}
                        onClick={() => setActive(i)}
                        onMouseEnter={() => window.matchMedia("(hover: hover) and (min-width: 1024px)").matches && setActive(i)}
                        className={`flex w-full items-center gap-[3.5cqw] px-[4cqw] py-[3.2cqw] text-left transition-colors ${open ? "bg-paper" : "hover:bg-paper/60"}`}
                      >
                        <span aria-hidden className={`grid size-[max(2rem,8.5cqw)] shrink-0 place-items-center rounded-[2.4cqw] ${tiles[i % tiles.length]}`}>
                          <AppGlyph name={icon(i)} className="w-[58%]" />
                        </span>
                        <span className="min-w-0 grow font-copy text-[max(0.9375rem,4.2cqw)] leading-tight font-bold text-ink">{item.title}</span>
                        <span
                          aria-hidden
                          className={`relative h-[max(1.5rem,7cqw)] w-[max(2.5rem,11.5cqw)] shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-lagoon" : "bg-ink/15"}`}
                        >
                          <span
                            className={`absolute top-1/2 left-[0.5cqw] size-[max(1.25rem,6cqw)] -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.25)] transition-transform duration-300 ease-[cubic-bezier(.3,1.4,.5,1)] ${on ? "translate-x-[calc(max(2.5rem,11.5cqw)_-_max(1.25rem,6cqw)_-_1cqw)]" : ""}`}
                          />
                        </span>
                      </button>
                    </h3>
                    {/* The setting's detail: opens under the row on phones and tablets; on desktop the big card shows it. */}
                    <div
                      id={`inc-body-${i}`}
                      className={`grid transition-[grid-template-rows] duration-300 lg:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <p className="overflow-hidden px-[4cqw] font-copy text-[max(0.875rem,3.8cqw)] leading-[1.55] text-ink/75">
                        <span className="block pt-[0.5cqw] pb-[3.5cqw] pl-[calc(max(2rem,8.5cqw)+3.5cqw)]">{item.body}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p aria-hidden className="mt-[4cqw] text-center font-copy text-[max(0.6875rem,3cqw)] text-ink/45">
              {onCount} of {items.length} switched on
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
