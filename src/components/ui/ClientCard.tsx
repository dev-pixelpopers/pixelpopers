import type { CSSProperties } from "react";
import Image from "next/image";

import type { Client } from "@/lib/site-content";

type ClientCardProps = {
  client: Client;
};

/**
 * A single white logo card from the client constellation. The scatter is
 * recreated with per-card rotation inside a wrapping flex row, so the cards
 * reflow on small screens instead of being nailed to canvas coordinates.
 */
export default function ClientCard({ client }: ClientCardProps) {
  const { name, src, width, height, tint, rotate } = client;

  return (
    <li
      className="flex h-[clamp(4.5rem,7vw,7.25rem)] w-[clamp(7.5rem,12vw,12.5rem)] rotate-(--tilt) items-center justify-center rounded-card bg-white px-4 shadow-card transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-0"
      style={{ "--tilt": `${rotate}deg` } as CSSProperties}
    >
      {tint ? (
        // Figma renders these light marks as an alpha mask over a solid fill.
        <span
          role="img"
          aria-label={name}
          className="h-full w-full"
          style={{
            backgroundColor: tint,
            maskImage: `url(${src})`,
            maskSize: "contain",
            maskPosition: "center",
            maskRepeat: "no-repeat",
          }}
        />
      ) : (
        <Image
          src={src}
          alt={name}
          width={width}
          height={height}
          sizes="200px"
          className="h-full w-full object-contain"
        />
      )}
    </li>
  );
}
