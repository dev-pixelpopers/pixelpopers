import Image from "next/image";
import type { Post } from "@/lib/pages/blog";
import { toneBg } from "./tones";

type Props = {
  cover: Post["cover"];
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Show the whole artwork (letterboxed on its brand colour) instead of cropping. */
  contain?: boolean;
};

/**
 * Post artwork. Covers shot on white (the cube, the device mock-ups, the
 * campaign strip) are multiplied onto their brand colour, exactly like the
 * coloured card heads in Figma; photos simply fill the box.
 */
export default function PostCover({
  cover,
  sizes,
  priority,
  className = "",
  contain = false,
}: Props) {
  return (
    <div
      className={`overflow-hidden ${cover.bg ? toneBg[cover.bg] : "bg-mist"} ${className}`}
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes={sizes}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className={`size-full ${contain && cover.bg ? "object-contain" : "object-cover"} ${cover.bg ? "mix-blend-multiply" : ""}`}
      />
    </div>
  );
}
