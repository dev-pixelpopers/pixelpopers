"use client";

import { createContext, useContext, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";

/**
 * Images uploaded for a service in the CMS (Services → Images). Most are keyed
 * by the built-in file they replace (e.g. "/assets/inner/ui-shop.webp"), so a
 * replacement shows wherever that picture is used; a few spots have a slot of
 * their own (e.g. "wild-merch"), passed as `slot`. The service page provides
 * the map; an empty slot keeps the design's own image.
 */
const ServiceMedia = createContext<Record<string, string>>({});

export function ServiceMediaProvider({ images, children }: { images?: Record<string, string>; children: ReactNode }) {
  return <ServiceMedia.Provider value={images ?? {}}>{children}</ServiceMedia.Provider>;
}

/** The CMS replacement for a slot or built-in file, or the file itself. */
export function useServiceMedia(src: string, slot?: string): string {
  return useContext(ServiceMedia)[slot ?? src] || src;
}

/**
 * `natural`: when an upload replaces the picture, show it at its own
 * proportions (full width, height to match — overriding any fixed height or
 * aspect class on the image) and mark it `data-natural`, so a frame around it
 * can drop its fixed shape too (`has-[img[data-natural]]:…`).
 */
export default function ServiceImage({ src, slot, alt, natural = false, className, ...props }: ImageProps & { slot?: string; natural?: boolean }) {
  const override = useContext(ServiceMedia)[slot ?? (typeof src === "string" ? src : "")];
  const resolved = override || src;
  // SVGs aren't run through the optimiser.
  const svg = typeof resolved === "string" && /\.svg(\?|$)/i.test(resolved);
  const fitted = Boolean(override && natural);
  return (
    <Image
      src={resolved}
      alt={alt}
      unoptimized={svg || props.unoptimized}
      data-natural={fitted ? "" : undefined}
      className={fitted ? `${className ?? ""} !h-auto !aspect-auto` : className}
      {...props}
    />
  );
}
