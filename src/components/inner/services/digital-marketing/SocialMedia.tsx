"use client";

import Image, { useServiceMedia } from "@/components/inner/services/ServiceImage";

/** Profile picture on the phone mock-ups: the uploaded "avatar" image, or the brand initial on pink. */
export function Avatar({ className, letterClass, sizes }: { className: string; letterClass: string; sizes: string }) {
  const src = useServiceMedia("", "avatar");
  return src ? (
    <Image src={src} alt="" width={200} height={200} sizes={sizes} className={`${className} rounded-full object-cover`} />
  ) : (
    <span className={`${className} grid place-items-center rounded-full bg-blush font-pop leading-none text-white ${letterClass}`}>P</span>
  );
}

/** A coloured text tile in the profile grid, or the photo uploaded in its place. */
export function TextTile({ tile, slot }: { tile: { text: string; bg: string; tone: string }; slot: string }) {
  const src = useServiceMedia("", slot);
  return src ? (
    <Image src={src} alt="" width={600} height={600} sizes="(min-width: 1024px) 7vw, 28vw" className="aspect-square w-full object-cover" />
  ) : (
    <span className={`grid aspect-square place-items-center text-center font-pop text-[8.64cqw] leading-[1.05] whitespace-pre-line ${tile.bg} ${tile.tone}`}>
      {tile.text}
    </span>
  );
}
