"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Advance } from "@/components/slider/slider-engine";

/**
 * Video playback shared by every slider version: exactly one clip — the
 * active slide's — plays, only while the section is on screen; when it ends
 * the slider advances (or, on the last slide of a line, the clip replays).
 *
 * Attach the returned `barRef` to an element to have its `scaleX` track the
 * playing clip.
 */
export function useSliderPlayback() {
  const barRef = useRef<HTMLSpanElement>(null);
  const videos = useRef(new Map<number, HTMLVideoElement>());
  const advanceRef = useRef<Advance>(() => false);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  const registerVideo = useCallback((index: number, element: HTMLVideoElement | null) => {
    if (element) videos.current.set(index, element);
    else videos.current.delete(index);
  }, []);

  const setAdvance = useCallback((advance: Advance) => {
    advanceRef.current = advance;
  }, []);

  const pauseAll = useCallback(() => {
    videos.current.forEach((video) => video.pause());
  }, []);

  // Re-runs after the render that mounts a newly near-front video, because
  // refs attach before effects.
  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (index === active) return;
      video.pause();
      video.currentTime = 0;
    });

    const bar = barRef.current;
    if (bar) bar.style.transform = "scaleX(0)";

    const video = videos.current.get(active);
    if (!inView || !video) return;

    // A slide that has just arrived mounts with readyState 0, so the first
    // play() can fail outright; retrying on `canplay` is what starts it.
    // Autoplay policies also reject it in background tabs — expected.
    const start = () => {
      void video.play().catch(() => { });
    };
    // Chrome pauses muted, video-only media while the tab is hidden.
    const restart = () => {
      if (!document.hidden) start();
    };
    const ended = () => {
      if (!advanceRef.current()) {
        video.currentTime = 0;
        start();
      }
    };

    // `timeupdate` only fires a few times a second; a frame loop keeps the
    // bar smooth, and only runs while this effect is live.
    let frame = 0;
    const tick = () => {
      if (bar && video.duration) {
        bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
      frame = requestAnimationFrame(tick);
    };
    if (bar) frame = requestAnimationFrame(tick);

    start();
    video.addEventListener("canplay", start);
    video.addEventListener("ended", ended);
    document.addEventListener("visibilitychange", restart);

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("canplay", start);
      video.removeEventListener("ended", ended);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [active, inView]);

  return { active, inView, setActive, setInView, setAdvance, registerVideo, pauseAll, barRef };
}
