"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

/**
 * "The glow-up" comparison card. The after-photo is clipped to the right of
 * the handle; a native range input (stretched invisibly over the card) drives
 * it, so it works with mouse, touch and keyboard alike.
 */
export default function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <figure className="@container grid aspect-[4/3] grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden rounded-[clamp(1.5rem,2.08vw,2.5rem)] bg-[#dcd6d3] shadow-[0_24px_60px_rgb(34_1_40/0.15)] md:aspect-[1588/640]">
      {/* Before — generic, no system */}
      <div className="col-start-1 row-start-1 grid w-1/2 place-content-center gap-[0.6em] px-4 text-center text-[#8c8784]">
        <p className="font-copy text-[clamp(1.125rem,3.27cqw,3.25rem)] leading-tight">fifth sip coffee co.</p>
        <p className="font-copy text-[clamp(0.75rem,1.26cqw,1.25rem)]">(generic font, no system, no story)</p>
      </div>

      {/* After — the finished identity */}
      <div
        className="col-start-1 row-start-1 grid min-h-0 grid-rows-[minmax(0,1fr)] bg-[#e4effa]"
        style={{ clipPath: `inset(0 0 0 ${pos}%)`, "--from": `${Math.min(pos, 50)}%` } as CSSProperties}
      >
        <Image
          src="/assets/inner/brand-identity/fifth-sip-packaging.webp"
          alt="Fifth Sip coffee identity applied to cups, a tray, a bag, a coffee pouch and menus"
          width={980}
          height={640}
          sizes="(min-width: 1024px) 83vw, 100vw"
          className="col-start-1 row-start-1 h-full w-full object-cover object-[50%_45%] md:ml-[var(--from)] md:w-[calc(100%-var(--from))]"
        />
      </div>

      {/* Divider + handle (decorative; the range input below is the control). `relative` keeps
          these painting above the clip-path layer, which forms its own stacking context. */}
      <div aria-hidden className="pointer-events-none relative col-start-1 row-start-1 grid" style={{ marginLeft: `calc(${pos}% - 3px)` }}>
        <span className="col-start-1 row-start-1 h-full w-1.5 bg-white" />
        <span className="col-start-1 row-start-1 -ml-[clamp(1.25rem,2.52cqw,2.5rem)] grid size-[clamp(2.75rem,5.04cqw,5rem)] self-center place-items-center rounded-full bg-white font-haas text-[clamp(1rem,1.76cqw,1.75rem)] text-grape shadow-[0_10px_24px_rgb(34_1_40/0.15)]">
          ‹ ›
        </span>
      </div>

      <span className="pointer-events-none relative col-start-1 row-start-1 m-[clamp(0.875rem,2.52cqw,2.5rem)] self-start justify-self-start rounded-full bg-white px-[1.4em] py-[0.7em] font-display text-[clamp(0.6875rem,1cqw,1rem)] leading-none text-[#8c8784] uppercase">
        Before
      </span>
      <span className="pointer-events-none relative col-start-1 row-start-1 m-[clamp(0.875rem,2.52cqw,2.5rem)] self-start justify-self-end rounded-full bg-blush px-[1.6em] py-[0.7em] font-display text-[clamp(0.6875rem,1cqw,1rem)] leading-none text-white uppercase">
        After
      </span>

      <label className="relative col-start-1 row-start-1 grid">
        <span className="sr-only">Drag to compare the old and new Fifth Sip branding</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="col-start-1 row-start-1 h-full w-full cursor-ew-resize appearance-none opacity-0"
        />
      </label>
      <figcaption className="sr-only">
        Before and after: a generic text logo for Fifth Sip Coffee Co. next to the finished identity system on packaging.
      </figcaption>
    </figure>
  );
}
