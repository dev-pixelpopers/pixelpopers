"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { mono } from "@/lib/inner-fonts";

const layer = "col-start-1 row-start-1";

function clock(t: number) {
  const s = Math.max(0, Math.floor(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Figma "Video player" (378:60): an 820 × 480 editor preview. It shows the
 * style-frame still until the visitor presses play, then swaps in the studio
 * reel (muted, inline, looping) and drives the scrubber from the real video.
 * Inner sizes are `cqw` of the player (1cqw = 8.2 Figma px).
 */
export default function VideoPlayer({ className = "" }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ now: 12, total: 30 });

  const progress = playing && time.total ? (time.now / time.total) * 100 : 40.8;

  function toggle() {
    const v = video.current;
    if (!playing) {
      // The <video> mounts with autoPlay (muted + inline), so the click is the start.
      setPlaying(true);
    } else if (v) {
      if (v.paused) void v.play();
      else v.pause();
    }
  }

  return (
    <figure className={`@container grid aspect-[820/480] grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-[clamp(1rem,1.46vw,1.75rem)] bg-ink shadow-[0_24px_60px_rgb(34_1_40/0.2)] ${className}`}>
      <Image
        src="/assets/inner/motion.webp"
        alt="Animation editor style frame with an easing graph, keyframe timeline and colourful layers"
        width={1120}
        height={980}
        priority
        sizes="(min-width: 1024px) 43vw, 92vw"
        className={`${layer} h-full w-full object-cover ${playing ? "invisible" : ""}`}
      />
      {playing ? (
        <video
          ref={video}
          src="/assets/videos/snackbar-video.mp4"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          aria-label="Pixel Popers motion reel"
          onTimeUpdate={(e) => setTime({ now: e.currentTarget.currentTime, total: e.currentTarget.duration || 30 })}
          className={`${layer} h-full w-full object-cover`}
        />
      ) : null}

      <div className={`${layer} flex items-start justify-between self-start px-[3.66cqw] pt-[2.93cqw] pr-[4.76cqw] font-display`}>
        <span className="text-[max(0.5625rem,1.83cqw)] text-blush">REC ●</span>
        <span className="text-[max(0.5625rem,1.71cqw)] text-white/80">4K · 60FPS</span>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the motion reel" : "Play the motion reel"}
        className={`${layer} mt-[18.9cqw] ml-[42.07cqw] grid size-[15.85cqw] place-items-center self-start justify-self-start rounded-full bg-blush shadow-[0_10px_30px_rgb(34_1_40/0.3)] transition-[transform,opacity] duration-300 hover:scale-105 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white ${playing ? "opacity-0 hover:opacity-100 focus-visible:opacity-100" : ""}`}
      >
        <svg viewBox="0 0 52 52" aria-hidden className="ml-[1.2cqw] w-[6.34cqw] fill-white">
          {playing ? <path d="M8 4h12v44H8zM32 4h12v44H32z" /> : <path d="M6 2 L50 26 L6 50 Z" />}
        </svg>
      </button>

      <figcaption className={`${layer} flex h-[14.63cqw] flex-col self-end bg-ink/60 px-[3.66cqw] pt-[4.88cqw]`}>
        <span aria-hidden className="grid h-[0.98cqw] w-[92.68cqw] items-center rounded-full bg-white/30">
          <span className="col-start-1 row-start-1 h-full rounded-full bg-blush" style={{ width: `${progress}%` }} />
          <span
            className="col-start-1 row-start-1 size-[2.44cqw] rounded-full bg-white"
            style={{ marginLeft: `calc(${progress}% - 1.46cqw)` }}
          />
        </span>
        <span className="mt-[2.2cqw] flex w-[92.68cqw] items-center justify-between pr-[9.02cqw] text-white">
          <span className={`${mono.className} text-[max(0.5625rem,1.95cqw)]`}>
            {clock(time.now)} / {clock(time.total)}
          </span>
          <span aria-hidden className="font-copy text-[max(0.625rem,2.2cqw)] font-bold tracking-[0.3em]">
            ⏮ ▶ ⏭
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
