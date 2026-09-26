"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";

import ProjectTile from "@/components/ui/ProjectTile";
import { projects } from "@/lib/site-content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Positions around the cylinder. Six puts one tile dead-centre at the back,
 * which is what gives the described arrangement: front, left, left-behind,
 * back (flat and scaled down), right-behind, right.
 */
const RING_SLOTS = 6;
/** Viewport heights of scrolling per slot — the ring turns once over the section. */
const SCROLL_PER_SLOT = 50;
/** >1 opens a gap between tiles; 1.0 seats them edge-to-edge around the circle. */
const GAP_RATIO = 1.5;
/** Camera distance as a multiple of the ring radius. Lower = more extreme 3D. */
const PERSPECTIVE_RATIO = 2.6;
/**
 * Degrees of rotateX on the ring. 0 is a pure side-on view, which leaves the
 * back tile hidden behind the front one at rest; ~8 tips the camera down so the
 * far side of the ring becomes visible.
 */
const RING_TILT = 0;

/**
 * The ring never has fewer than RING_SLOTS positions — with fewer projects the
 * list repeats — and grows past it rather than dropping projects on the floor.
 */
const slots = Array.from(
  { length: Math.max(RING_SLOTS, projects.length) },
  (_, index) => projects[index % projects.length],
);

const SLOT_ANGLE = 360 / slots.length;

export default function ProjectCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLUListElement>(null);
  const videoRefs = useRef(new Map<number, HTMLVideoElement>());
  const activeRef = useRef(0);

  const [activeSlot, setActiveSlot] = useState(0);
  /** Nothing plays until the section is actually on screen. */
  const [inView, setInView] = useState(false);

  const registerVideo = useCallback(
    (index: number, element: HTMLVideoElement | null) => {
      if (element) videoRefs.current.set(index, element);
      else videoRefs.current.delete(index);
    },
    [],
  );

  useGSAP(
    () => {
      const count = slots.length;
      const ring = ringRef.current;
      const stage = stageRef.current;
      if (!ring || !stage) return;

      // Resize-time work only. Tiles read the radius from a custom property, so
      // a resize writes one value instead of touching every tile.
      const measure = () => {
        const radius = (GAP_RATIO * (ring.offsetWidth / 2)) / Math.tan(Math.PI / count);
        stage.style.setProperty("--ring-r", `${radius}px`);
        stage.style.setProperty(
          "--ring-p",
          `${radius * PERSPECTIVE_RATIO}px`,
        );
        // Pushing the ring back by its own radius lands the front tile at z = 0,
        // so it renders at natural size instead of being magnified by P/(P-R).
        gsap.set(ring, { z: -radius, rotationX: RING_TILT });
      };

      // The only per-frame work: one property on one element. The browser
      // depth-sorts the tiles from `transform-style: preserve-3d`.
      const spin = (progress: number) => {
        gsap.set(ring, { rotationY: -progress * SLOT_ANGLE });

        // Tile i sits at (i - progress) × SLOT_ANGLE, so the tile nearest the
        // camera is simply the one nearest `progress` — no DOM reads needed.
        const nearest = ((Math.round(progress) % count) + count) % count;
        if (nearest !== activeRef.current) {
          activeRef.current = nearest;
          setActiveSlot(nearest);
        }
      };

      const pauseAll = () => {
        videoRefs.current.forEach((video) => video.pause());
      };

      measure();
      spin(0);

      const media = gsap.matchMedia();

      // Under reduced motion neither trigger is created: the ring stays at
      // rotation 0 and, with `inView` never set, nothing autoplays either.
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Visibility is a separate, wider trigger than the scrub one below:
        // the scrub range only becomes active once the section is pinned,
        // which would leave a dead spot right at the pin boundary.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            setInView(self.isActive);
            if (!self.isActive) pauseAll();
          },
          onRefresh: (self) => setInView(self.isActive),
        });

        const state = { progress: 0 };

        // fromTo, not to: the start value must stay pinned at 0. A plain `to`
        // re-reads whatever `state.progress` happens to be on each refresh,
        // which shortens the sweep so the ring never completes a revolution.
        // (This is also why `invalidateOnRefresh` must stay off here — the
        // endpoints are constants, and resize geometry is handled in onRefresh.)
        gsap.fromTo(
          state,
          { progress: 0 },
          {
            progress: count, // exactly one revolution across the section
            ease: "none", // required for a 1:1 scroll-to-rotation mapping
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              // The pin is CSS `sticky`, so ScrollTrigger only reports progress.
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              onRefresh: () => {
                measure();
                spin(state.progress);
              },
            },
            onUpdate: () => spin(state.progress),
          },
        );
      });

      return () => pauseAll();
    },
    { scope: sectionRef },
  );

  // Single source of truth for playback: exactly one clip runs, and only while
  // the section is on screen. Re-runs after the render that mounts a newly
  // near-front video, because refs attach before effects.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index === activeSlot) return;
      video.pause();
      video.currentTime = 0;
    });

    const active = videoRefs.current.get(activeSlot);
    if (!inView || !active) return;

    // A tile that has just rotated into place mounts with readyState 0, so the
    // first play() can fail outright. Retrying on `canplay` is what makes the
    // clip actually start — without it the slot stays paused even once it is
    // fully buffered.
    const start = () => {
      // Autoplay policies also reject this when the tab is backgrounded — a
      // rejection here is expected, not an error.
      void active.play().catch(() => { });
    };

    // Chrome pauses muted, video-only media whenever the document is hidden
    // ("paused to save power"). Nothing else here changes on the way back, so
    // without this the active tile stays frozen when you return to the tab.
    const restart = () => {
      if (!document.hidden) start();
    };

    start();
    active.addEventListener("canplay", start);
    document.addEventListener("visibilitychange", restart);

    return () => {
      active.removeEventListener("canplay", start);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [activeSlot, inView]);

  const count = slots.length;

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected projects"
      className="w-full"
      style={{ height: `${count * SCROLL_PER_SLOT}vh` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 grid h-screen place-items-center overflow-hidden"
        style={{ perspective: "var(--ring-p, 1900px)" }}
      >
        {/*
          A cylinder has no flow equivalent: the ring is sized to a single tile
          and every tile is stacked on it, then swung out to its own place
          around the circle. Only the ring is animated.
        */}
        <ul
          ref={ringRef}
          className="relative aspect-[16/9] w-[78vw] [transform-style:preserve-3d] will-change-transform md:w-[clamp(17rem,50vw,60rem)]"
        >
          {slots.map((project, index) => {
            // Distance from the front slot around the ring, so the tiles facing
            // the camera keep a decoded video ready and the rest stay
            // poster-only.
            const distance = Math.min(
              Math.abs(index - activeSlot),
              count - Math.abs(index - activeSlot),
            );

            return (
              <li
                key={`${project.id}-${index}`}
                className="absolute inset-0"
                // Placed once in CSS and never touched again; the radius comes
                // from the custom property the stage writes on resize.
                style={{
                  transform: `rotateY(${index * SLOT_ANGLE}deg) translateZ(var(--ring-r, 0px))`,
                }}
              >
                <ProjectTile
                  project={project}
                  mountVideo={distance <= 1}
                  registerVideo={(element) => registerVideo(index, element)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
