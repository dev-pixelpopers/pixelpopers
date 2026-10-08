"use client";

import Image from "next/image";
import { useEffect, useId, useRef, type CSSProperties, type RefObject } from "react";

import type { Service, ServiceFill, ServiceMedia, TilePoint } from "@/lib/site-content";

/** Figma letter tile: 509 × 586. */
const TILE_RATIO = 586 / 509;
/** Counter dot: 177px across a 509px tile. */
const DOT_SIZE = 177 / 509;

const fillClasses: Record<ServiceFill, string> = {
  outline: "",
  grape: "text-grape",
  sunbeam: "text-sunbeam",
  photo: "text-cream [-webkit-text-stroke:1px_var(--grape)] [paint-order:stroke_fill]",
};

const labelToneClasses: Record<ServiceFill, string> = {
  outline: "text-black",
  grape: "text-white",
  sunbeam: "text-white",
  photo: "text-white",
};

/**
 * Offsets are expressed in `cqw` (a fraction of the tile's own width) so the
 * whole composition scales as one unit — no absolute positioning, and the
 * vertical figure is converted through the tile's aspect ratio because a
 * percentage margin would resolve against width.
 */
function offsetStyle({ x, y }: TilePoint): CSSProperties {
  return {
    marginLeft: `${x * 100}cqw`,
    marginTop: `${y * TILE_RATIO * 100}cqw`,
  };
}

type ServiceTileProps = {
  service: Service;
};

export default function ServiceTile({ service }: ServiceTileProps) {
  const { letter, title, fill, label, dot, media } = service;

  const glyphRef = useRef<HTMLSpanElement>(null);
  const baselineRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const clipTextRef = useRef<SVGTextElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // useId output can contain characters that break a `url(#…)` reference.
  const clipId = `service-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  /*
    The media is clipped by an SVG <text> drawn in the same font, at the same
    size, on the same baseline as the HTML glyph, so the two outlines coincide
    exactly. `background-clip: text` can't do this: it can't clip a <video>, and
    it only paints inside the span's box, which the wider glyphs overhang.
  */
  useEffect(() => {
    const glyph = glyphRef.current;
    const baseline = baselineRef.current;
    const reveal = revealRef.current;
    const clipText = clipTextRef.current;
    if (!media || !glyph || !baseline || !reveal || !clipText) return;

    const measure = () => {
      // userSpaceOnUse on an HTML element is CSS px from its border-box origin.
      const origin = reveal.getBoundingClientRect();
      const box = glyph.getBoundingClientRect();
      clipText.setAttribute("x", String(box.left - origin.left));
      clipText.setAttribute("y", String(baseline.getBoundingClientRect().bottom - origin.top));
      clipText.style.fontSize = getComputedStyle(glyph).fontSize;
    };

    measure();
    // Modak swaps in after first paint and changes the glyph's metrics.
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(glyph);
    return () => observer.disconnect();
  }, [media]);

  const play = () => {
    videoRef.current?.play().catch(() => { });
  };
  const pause = () => videoRef.current?.pause();

  return (
    <article
      onPointerEnter={play}
      onPointerLeave={pause}
      className="@container group grid aspect-[509/586] w-full grid-cols-1 grid-rows-1 [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:self-start [&>*]:justify-self-start"
    >
      {/*
        Figma sets a 867px glyph on a 734px line inside a 586px box, so the
        line box starts at the top of the tile rather than being centred —
        reproduced here so the label offsets below land on the glyph.

        That line box hangs well below the tile, so the glyph ignores the
        pointer: hover belongs to the tile box, not to the overhang that would
        otherwise sit on top of the next row. `w-max` lets wide letters like
        the "o" size the box to their own advance instead of the tile's width.
      */}
      <span
        ref={glyphRef}
        aria-hidden
        className={`pointer-events-none relative block w-max text-[170cqw] leading-[0.846] font-pop uppercase select-none ${fillClasses[fill]}`}
      >
        {letter}
        {/* Zero-size inline-block: its bottom edge sits on the text baseline. */}
        <span ref={baselineRef} className="inline-block h-0 w-0" />

        {media ? (
          <>
            <svg aria-hidden focusable="false" width="0" height="0" className="absolute">
              <defs>
                <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                  <text ref={clipTextRef} className="font-pop normal-case">
                    {letter.toUpperCase()}
                  </text>
                </clipPath>
              </defs>
            </svg>

            {/* Oversized so it covers ink that rises above or falls below the line box. */}
            <div
              ref={revealRef}
              className="absolute -inset-x-[15%] -inset-y-[35%] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
              style={{ clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
            >
              <ServiceMediaFill media={media} videoRef={videoRef} />
            </div>
          </>
        ) : null}
      </span>

      {dot ? (
        <span
          aria-hidden
          className="relative z-10 rounded-full bg-mist transition-opacity duration-500 ease-out group-hover:opacity-0 motion-reduce:transition-none"
          style={{
            ...offsetStyle(dot),
            width: `${DOT_SIZE * 100}cqw`,
            height: `${DOT_SIZE * 100}cqw`,
          }}
        />
      ) : null}

      <h3
        className={`relative z-10 max-w-[60cqw] text-service leading-none font-bold uppercase text-black group-hover:text-white`}
        style={offsetStyle(label)}
      >
        {title}
      </h3>
    </article>
  );
}

const mediaClasses =
  "h-full w-full scale-125 object-cover transition-transform duration-700 ease-out group-hover:scale-100 motion-reduce:transition-none";

function ServiceMediaFill({
  media,
  videoRef,
}: {
  media: ServiceMedia;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        // Nothing downloads until the first hover calls play().
        preload="none"
        className={mediaClasses}
      />
    );
  }

  return (
    <Image src={media.src} alt="" fill sizes="(max-width: 640px) 100vw, 40vw" className={mediaClasses} />
  );
}
