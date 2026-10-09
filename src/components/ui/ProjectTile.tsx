"use client";

import Image from "next/image";

import type { Project } from "@/lib/site-content";

type ProjectTileProps = {
  project: Project;
  /**
   * Whether this slot is near enough to the centre to be worth decoding video.
   * Off-centre tiles render the poster alone.
   */
  mountVideo: boolean;
  /**
   * Hands the element to the carousel, which owns playback centrally — a tile
   * that started or stopped its own clip would fight the scrub's settle.
   */
  registerVideo: (element: HTMLVideoElement | null) => void;
};

export default function ProjectTile({
  project,
  mountVideo,
  registerVideo,
}: ProjectTileProps) {
  const { poster } = project;
  // A tile with no poster would be blank off-centre, so it keeps its video
  // mounted and lets the browser paint the first frame from metadata alone.
  const withVideo = mountVideo || !poster;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-card bg-ink/5">
      {/* Base layer, so a tile is never blank while its clip is unmounted. */}
      {poster ? (
        <Image
          src={poster.src}
          alt={project.title}
          width={poster.width}
          height={poster.height}
          sizes="(max-width: 768px) 80vw, 55vw"
          className="h-full w-full object-cover"
        />
      ) : null}

      {withVideo ? (
        // `poster` covers the gap before the first frame decodes, so the swap
        // needs no fade of its own. No `loop`: the carousel advances to the
        // next tile when a clip ends.
        <video
          ref={registerVideo}
          src={project.video}
          poster={poster?.small}
          muted
          playsInline
          preload={poster ? "none" : "metadata"}
          aria-hidden={poster ? true : undefined}
          aria-label={poster ? undefined : project.title}
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}
