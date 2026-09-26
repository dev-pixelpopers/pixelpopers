import type { CSSProperties } from "react";

import type { Service, ServiceFill, TilePoint } from "@/lib/site-content";

/** Figma letter tile: 509 × 586. */
const TILE_RATIO = 586 / 509;
/** Counter dot: 177px across a 509px tile. */
const DOT_SIZE = 177 / 509;

const fillClasses: Record<ServiceFill, string> = {
  outline:
    "text-cream [-webkit-text-stroke:1px_var(--grape)] [paint-order:stroke_fill]",
  grape: "text-grape",
  sunbeam: "text-sunbeam",
  // The "o" is filled with a UI screenshot in Figma; background-clip keeps the
  // real glyph shape without needing a separate mask asset.
  photo:
    "text-transparent bg-[url('/assets/service-photo.png')] bg-cover bg-center bg-clip-text",
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
  const { letter, title, fill, label, dot } = service;

  return (
    <article className="@container grid aspect-[509/586] w-full grid-cols-1 grid-rows-1 [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:self-start [&>*]:justify-self-start">
      {/*
        Figma sets a 867px glyph on a 734px line inside a 586px box, so the
        line box starts at the top of the tile rather than being centred —
        reproduced here so the label offsets below land on the glyph.
      */}
      <span
        aria-hidden
        className={`block w-full text-[170cqw] leading-[0.846] font-pop select-none ${fillClasses[fill]}`}
      >
        {letter}
      </span>

      {dot ? (
        <span
          aria-hidden
          className="rounded-full bg-mist"
          style={{
            ...offsetStyle(dot),
            width: `${DOT_SIZE * 100}cqw`,
            height: `${DOT_SIZE * 100}cqw`,
          }}
        />
      ) : null}

      <h3
        className={`max-w-[60cqw] text-service leading-none font-bold uppercase ${labelToneClasses[fill]}`}
        style={offsetStyle(label)}
      >
        {title}
      </h3>
    </article>
  );
}
