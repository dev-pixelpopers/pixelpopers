"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { createSliderMotion, sectionHeight, slotDistance } from "@/components/slider/slider-engine";
import SlideCaption from "@/components/slider/SlideCaption";
import { useSliderPlayback } from "@/components/slider/useSliderPlayback";
import ProjectTile from "@/components/ui/ProjectTile";
import { CUBE_POSE } from "@/components/ui/StudioCube";
import {
  FACE_BORDER,
  FACE_PUSH,
  FACE_RADIUS,
  FACE_SHADE,
  FACE_SIZE,
  VIDEO_CUBE_FACES,
} from "@/components/ui/cube-faces";
import { CUBE_TRAVEL_VH } from "@/components/ui/studio-cube-motion";
import { projects } from "@/lib/site-content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COUNT = projects.length;
const SLOT_ANGLE = 360 / COUNT;
/** >1 opens a gap between tiles around the ring. */
const GAP_RATIO = 1.5;
/** Camera distance as a multiple of the ring radius. */
const PERSPECTIVE_RATIO = 2.6;

/** Extra sticky scroll, in viewport heights, given to folding the ring into a cube. */
const FOLD_VH = 80;
/** Extra full turns the ring whirls through as it closes up into the cube. */
const WHIRL_TURNS = 1;
/** Fold progress at which the cube snaps shut — the flaps land and it swells. */
const CLOSE_AT = 0.86;
/** The Studio cube's faces fill this share of its box (`inset-[13%]` in StudioCube). */
const STUDIO_FACE_SHARE = 0.74;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type ProjectSliderProps = {
  /**
   * Fold the ring into a video cube at the end of the section and carry it
   * down to become the Studio section's cube. On by default — the home page
   * relies on it; off leaves a plain ring slider.
   */
  foldIntoCube?: boolean;
};

/**
 * Selected projects: a 3D ring of project clips, turned by scroll and by each
 * clip finishing.
 *   - the scroll snaps to the nearest tile when you stop, so a clip is never
 *     left half-turned
 *   - the front tile is the hero: tiles dim and shrink slightly with their
 *     distance round the ring
 *   - a caption under the ring — "01 / 06", the project name and a bar that
 *     fills as the clip plays — swaps with each tile
 */
export default function ProjectSlider({ foldIntoCube = true }: ProjectSliderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const foldRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLUListElement>(null);
  const playback = useSliderPlayback();
  const { active, setActive, setInView, setAdvance, registerVideo, pauseAll, barRef } = playback;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const fold = foldRef.current;
      const ring = ringRef.current;
      if (!section || !stage || !fold || !ring) return;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-slide='tile']", ring);
      const crops = gsap.utils.toArray<HTMLElement>("[data-slide='crop']", ring);
      const counters = gsap.utils.toArray<HTMLElement>("[data-slide='counter']", ring);
      const frames = gsap.utils.toArray<HTMLElement>("[data-slide='frame']", ring);
      const inners = gsap.utils.toArray<HTMLElement>("[data-slide='inner']", ring);
      const caption = stage.querySelector<HTMLElement>("[aria-live]");
      // Selector strings here are scoped to this section by useGSAP, so the
      // Studio section's elements are looked up on the document directly.
      const studioCube = foldIntoCube ? document.querySelector<HTMLElement>("[data-studio='cube']") : null;
      const studioStage = studioCube?.closest<HTMLElement>("#studio > div") ?? null;

      const vh = (n: number) => (n / 100) * window.innerHeight;
      let radius = 0;
      let width = 0;
      let height = 0;
      let ringRotation = 0;
      let ringPosition = 0;
      /** 0 = ring, 1 = cube. Only ever non-zero with `foldIntoCube`. */
      const folded = { value: 0 };
      /** 0 = centre of the slider, 1 = sitting on the Studio cube's spot. */
      let travelled = 0;
      /** Offset and scale that put the folded cube exactly over the Studio cube. */
      let target = { x: 0, y: 0, scale: 1 };
      let handedOver = false;

      const measureTarget = () => {
        if (!studioCube || !studioStage) return;
        // Offset metrics ignore transforms, and the Studio stage's sticky
        // offset is zero at the moment the travel ends, so this is where the
        // Studio cube sits on screen then.
        let top = 0;
        for (let el: HTMLElement | null = studioCube; el && el !== studioStage; el = el.offsetParent as HTMLElement | null) {
          top += el.offsetTop;
        }
        const column = studioCube.offsetParent as HTMLElement | null;
        const left = (column?.getBoundingClientRect().left ?? 0) + studioCube.offsetLeft;
        target = {
          x: left + studioCube.offsetWidth / 2 - window.innerWidth / 2,
          y: top + studioCube.offsetHeight / 2 - window.innerHeight / 2,
          scale: (studioCube.offsetWidth * STUDIO_FACE_SHARE) / height,
        };
        // Same camera distance as the slider, so the two cubes look identical.
        studioCube.style.setProperty("--cube-p", `${radius * PERSPECTIVE_RATIO}px`);
      };

      /**
       * At the end of the travel the folded cube is swapped for the Studio
       * section's identical video cube, which then carries on with that
       * section (tumbling with scroll, scrolling away with it). Each clip
       * picks up where the slider's left off.
       */
      const handOver = (over: boolean) => {
        if (!studioCube || over === handedOver) return;
        handedOver = over;
        if (over) {
          studioCube.querySelectorAll<HTMLVideoElement>("[data-cube='video-face'] video").forEach((clip, i) => {
            const source = tiles[i]?.querySelector("video");
            if (source && source.readyState > 0) clip.currentTime = source.currentTime;
          });
        }
        fold.style.visibility = over ? "hidden" : "";
        studioCube.style.opacity = over ? "1" : "0";
        // Taking the cube back: undo any turns it made to show other faces,
        // so it matches this cube again when it is handed over next time.
        if (!over) {
          const turn = studioCube.querySelector<HTMLElement>("[data-cube='turn']");
          if (turn) {
            gsap.killTweensOf(turn);
            gsap.set(turn, { rotationY: 0, rotationX: 0 });
          }
        }
      };

      /**
       * Pixel versions of the Studio cube's face styling, so the folded
       * faces look exactly like it. Static per size — set on measure, never
       * per frame.
       */
      const styleFaces = () => {
        const side = FACE_SIZE * height;
        const corner = FACE_RADIUS * side;
        frames.forEach((frame) => {
          Object.assign(frame.style, {
            width: `${side}px`,
            height: `${side}px`,
            left: `${(width - side) / 2}px`,
            top: `${(height - side) / 2}px`,
            borderWidth: `${FACE_BORDER * height}px`,
            borderRadius: `${corner}px`,
            boxShadow: `inset ${-FACE_SHADE.x * height}px ${-FACE_SHADE.y * height}px 0 0 ${FACE_SHADE.color}`,
          });
        });
      };

      const travelEase = gsap.parseEase("power2.inOut");
      const pullEase = gsap.parseEase("power3.inOut");
      const flapEase = gsap.parseEase("back.out(1.8)");
      const whirlEase = gsap.parseEase("power2.inOut");

      const apply = () => {
        const f = folded.value;
        // The cube comes to rest in the Studio cube's yaw, the nearest way round.
        const restYaw = CUBE_POSE.rotationY + 360 * Math.round((ringRotation - CUBE_POSE.rotationY) / 360);
        // Whirl: one extra turn on the way in, carrying on in the ring's own
        // direction, so the faces swirl together. Whole turns, so it still
        // lands in the Studio cube's pose.
        const whirlTo = restYaw - (foldIntoCube ? 360 * WHIRL_TURNS : 0);
        gsap.set(ring, {
          rotationY: lerp(ringRotation, whirlTo, whirlEase(f)),
          // Tilt on the ring itself, after its yaw — the same order as the
          // Studio cube's pose (rotate, rotateY, rotateX), so they match.
          rotationX: lerp(0, CUBE_POSE.rotationX, f),
          // The ring sits pushed back by its radius; the cube comes forward
          // to the centre so it shows at its true size.
          z: lerp(-radius, 0, f),
        });

        inners.forEach((inner, i) => {
          const around = (((i - ringPosition) % COUNT) + COUNT) % COUNT;
          const d = Math.min(around, COUNT - around);
          gsap.set(inner, {
            opacity: lerp(1 - Math.min(d, 2) * 0.3, 1, f),
            scale: lerp(1 - Math.min(d, 1) * 0.08, 1, f),
          });
        });

        if (!foldIntoCube) return;

        // The 16:9 clip is cropped down to the square face with transforms
        // only (no clip-path), so the fold never makes the browser repaint
        // the playing video: the crop box shrinks, the clip inside is scaled
        // back up by the inverse, so it keeps its size and is just trimmed.
        const side = FACE_SIZE * height;
        const cropX = lerp(1, side / width, f);
        const cropY = lerp(1, side / height, f);
        // Corner radius only while folding: as a ring the tiles keep exactly
        // their own look (the tile's 10px card corners), untouched. The crop
        // box is drawn scaled, so its radius is pre-stretched by the inverse
        // to land round on the finished face.
        const corner = FACE_RADIUS * side * f;
        const cropRadius = f ? `${corner / cropX}px / ${corner / cropY}px` : "";
        const cropTransform = f ? `scale(${cropX}, ${cropY})` : "";
        const counterTransform = f ? `scale(${1 / cropX}, ${1 / cropY})` : "";
        // Folds like a box closing, so the cube stays in one piece:
        //   1. every tile pulls in to the cube's size — the four side tiles
        //      become the walls, while the top and bottom tiles stand up
        //      above the back wall / below the front wall like open flaps;
        //   2. those two flaps swing shut on their hinge edge.
        // The closed flaps land exactly on rotateY(ry) rotateX(±90deg)
        // translateZ(push), the Studio cube's top and bottom faces.
        // Flaps snap shut with a little overshoot, finishing at CLOSE_AT.
        const flap = flapEase(gsap.utils.clamp(0, 1, (f - 0.45) / (CLOSE_AT - 0.45)));
        const push = FACE_PUSH * height;
        tiles.forEach((tile, i) => {
          const face = VIDEO_CUBE_FACES[i % VIDEO_CUBE_FACES.length];
          // Tiles gather one after another — a quick ripple round the ring.
          const pull = pullEase(gsap.utils.clamp(0, 1, (f - i * 0.035) / 0.5));
          // -1 for the top flap (up is -y), +1 for the bottom, 0 for a wall.
          const dir = face.rx > 0 ? -1 : face.rx < 0 ? 1 : 0;
          const ry = lerp(i * SLOT_ANGLE, face.ry, pull);
          const tz = lerp(radius, push, pull);
          const ty = dir * push * pull;
          const hinge = -dir * 90 * flap;
          // Raw string: tiles rotate *then* push out, which GSAP's fixed
          // transform order can't express.
          // Flaps rotate about the cube's edge: out to the edge, turn, back.
          tile.style.transform = `rotateY(${ry}deg) translate3d(0px, ${ty}px, ${tz}px) rotateX(${hinge}deg) translateY(${ty}px)`;
          crops[i].style.transform = cropTransform;
          crops[i].style.borderRadius = cropRadius;
          counters[i].style.transform = counterTransform;
          // The outline comes in as the face forms. Every face stays visible
          // from both sides, before and after the cube closes: hiding faces
          // seen from behind made the cube's inner walls vanish through the
          // gaps, so it looked like faces dropped out the moment it formed.
          frames[i].style.opacity = String(gsap.utils.clamp(0, 1, (f - 0.5) * 2));
        });

        const e = travelEase(travelled);
        const x = e * target.x;
        const y = e * target.y;
        // The snap: a quick swell and settle as the flaps land.
        const snap = gsap.utils.clamp(0, 1, (f - CLOSE_AT) / (1 - CLOSE_AT));
        const pop = 1 + 0.08 * Math.sin(Math.PI * snap);
        const scale = lerp(1, target.scale, e) * pop;
        // Raw string for scale3d: a 2D scale would leave the cube's depth at
        // full size and stretch it into a box as it shrinks.
        fold.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${lerp(0, CUBE_POSE.rotationZ, f)}deg) scale3d(${scale}, ${scale}, ${scale})`;
        // The camera follows the cube, so it arrives seen straight on — the
        // way the Studio cube is seen in its own box.
        stage.style.perspectiveOrigin = `calc(50% + ${x}px) calc(50% + ${y}px)`;
        if (caption) caption.style.opacity = String(1 - Math.min(f * 3, 1));
        handOver(travelled >= 0.999);
      };

      createSliderMotion({
        section,
        count: COUNT,
        mode: "ring",
        snap: true,
        endInset: foldIntoCube ? () => vh(FOLD_VH + CUBE_TRAVEL_VH) : undefined,
        // Once the fold has begun the ring is closing up — a finished clip
        // replays rather than turning it.
        isHeld: () => folded.value > 0,
        measure: () => {
          width = ring.offsetWidth;
          height = ring.offsetHeight;
          radius = (GAP_RATIO * (width / 2)) / Math.tan(Math.PI / COUNT);
          stage.style.setProperty("--ring-r", `${radius}px`);
          stage.style.setProperty("--ring-p", `${radius * PERSPECTIVE_RATIO}px`);
          if (foldIntoCube) styleFaces();
          measureTarget();
        },
        render: (position) => {
          ringPosition = position;
          ringRotation = -position * SLOT_ANGLE;
          apply();
        },
        onActive: setActive,
        onInView: setInView,
        setAdvance,
      });

      if (foldIntoCube && studioCube) {
        // Hidden until the hand-off, whatever the scroll position on load.
        studioCube.style.opacity = "0";

        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          // ── Fold: sticky scroll before the travel closes the ring into a cube.
          gsap.fromTo(
            folded,
            { value: 0 },
            {
              value: 1,
              ease: "power1.inOut",
              immediateRender: false,
              scrollTrigger: {
                trigger: section,
                start: () => `bottom-=${vh(FOLD_VH + CUBE_TRAVEL_VH)} bottom`,
                end: () => `bottom-=${vh(CUBE_TRAVEL_VH)} bottom`,
                scrub: 1,
              },
              onUpdate: apply,
            },
          );

          // ── Travel: the last stretch, still pinned, with the Studio section
          // scrolling in underneath. Read straight from scroll (no scrub) so
          // the hand-off lands exactly as this stage lets go.
          ScrollTrigger.create({
            trigger: section,
            start: () => `bottom-=${vh(CUBE_TRAVEL_VH)} bottom`,
            end: "bottom bottom",
            onUpdate: (self) => {
              travelled = self.progress;
              apply();
            },
            onRefresh: (self) => {
              measureTarget();
              travelled = self.progress;
              apply();
            },
          });
        });

        // Reduced motion: no fold, so the Studio cube just shows as normal.
        media.add("(prefers-reduced-motion: reduce)", () => {
          studioCube.style.opacity = "";
        });

        return () => {
          pauseAll();
          studioCube.style.opacity = "";
          studioCube.style.removeProperty("--cube-p");
        };
      }

      return () => pauseAll();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected projects"
      className="w-full"
      style={{
        height: foldIntoCube
          ? `calc(${sectionHeight(COUNT)} + ${FOLD_VH + CUBE_TRAVEL_VH}vh)`
          : sectionHeight(COUNT),
      }}
    >
      <div
        ref={stageRef}
        // Folding: the cube travels across the stage, so it can't clip, and
        // the stage lies over the Studio section during the travel, so it
        // mustn't catch the pointer. With motion it ships hidden: the hero's
        // scroll hand-off (see `hero-animations.ts`) starts it tucked away
        // and reveals it on scroll, so painting it before that runs only made
        // it a late LCP candidate (the hand-off's inline visibility wins).
        className={`sticky top-0 grid h-screen place-items-center motion-safe:invisible ${foldIntoCube ? "pointer-events-none" : "overflow-hidden"}`}
        style={{ perspective: "var(--ring-p, 1900px)" }}
      >
        <div ref={foldRef} className="relative [transform-style:preserve-3d] will-change-transform">
          <ul
            ref={ringRef}
            className="relative aspect-[16/9] w-[78vw] [transform-style:preserve-3d] will-change-transform md:w-[clamp(17rem,50vw,60rem)]"
          >
            {projects.map((project, index) => (
              <li
                key={project.id}
                data-slide="tile"
                className="absolute inset-0"
                style={{ transform: `rotateY(${index * SLOT_ANGLE}deg) translateZ(var(--ring-r, 0px))` }}
              >
                {/* crop → counter: transform-only crop to the cube face (fold only). */}
                <div data-slide="crop" className="absolute inset-0 overflow-hidden">
                  <div data-slide="counter" className="h-full w-full">
                    <div data-slide="inner" className="h-full w-full">
                      <ProjectTile
                        project={project}
                        mountVideo={slotDistance(index, active, COUNT, "ring") <= 1}
                        registerVideo={(element) => registerVideo(index, element)}
                      />
                    </div>
                  </div>
                </div>
                {foldIntoCube ? (
                  // The face's black outline and shading, sized in measure.
                  <span
                    data-slide="frame"
                    aria-hidden
                    className="pointer-events-none absolute border-solid border-black opacity-0"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <SlideCaption active={active} count={COUNT} title={projects[active].title} barRef={barRef} />
      </div>
    </section>
  );
}
