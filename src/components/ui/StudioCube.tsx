"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import { VIDEO_CUBE_FACES } from "@/components/ui/cube-faces";
import { projects } from "@/lib/site-content";
import { afterFirstInteraction } from "@/lib/defer-setup";

gsap.registerPlugin(useGSAP);

/**
 * Resting pose: camera a little above and to the left, so the top and left
 * faces show alongside the front — the same three-quarter view as the Figma
 * render this replaces. The section's scroll timeline spins from and back to it.
 */
export const CUBE_POSE = { rotationX: -18, rotationY: 24, rotationZ: -6 } as const;

/**
 * The Studio section's cube: a real six-sided CSS 3D cube whose faces are the
 * project clips — the cube the video slider folds into and hands over, laid
 * out to match it exactly (see `cube-faces.ts`). Rounded panels with heavy
 * black outlines, pushed slightly apart so the edges read as separate cards.
 * Everything is sized in `cqw` of the parent container, so the cube —
 * including its 3D depth — scales as one unit.
 *
 * Nested transforms, each with its own owner:
 *   [data-studio='cube']       — 2D: scale (section scroll timeline)
 *   [data-studio='cube-spin']  — 3D: tumble and resting pose (section scroll)
 *   [data-cube='turn']         — 3D: a quarter turn each time a clip ends
 */
export default function StudioCube() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Only the face pointing at the camera plays; the rest hold their frame.
  // Decoding six clips while the cube tumbles is what made it stutter, and
  // the face you are looking at is the only one you can see moving anyway.
  // When that clip ends the cube turns a quarter to bring the next face
  // round — the same "clip ends, move on" rhythm as the video slider.
  useEffect(() => {
    const root = rootRef.current;
    const spin = root?.querySelector<HTMLElement>("[data-studio='cube-spin']");
    const turn = root?.querySelector<HTMLElement>("[data-cube='turn']");
    if (!root || !spin || !turn) return;
    const clips = Array.from(root.querySelectorAll<HTMLVideoElement>("[data-cube='video-face'] video"));
    let playing = -1;

    const pick = () => {
      // In view isn't enough: the cube starts out transparent (tucked under
      // the hero, waiting for the slider's hand-off), and a playing clip
      // there would be downloaded for nothing while the page loads.
      if (Number(gsap.getProperty(root, "opacity")) < 0.05) {
        clips[playing]?.pause();
        playing = -1;
        return;
      }
      const front = frontFace(
        { y: Number(gsap.getProperty(spin, "rotationY")), x: Number(gsap.getProperty(spin, "rotationX")) },
        { y: Number(gsap.getProperty(turn, "rotationY")), x: Number(gsap.getProperty(turn, "rotationX")) },
      );
      if (front === playing) return;
      clips[playing]?.pause();
      playing = front;
      void clips[front]?.play().catch(() => { });
    };

    // A quarter turn about the cube's own vertical axis brings the next
    // side face round; the scroll tumble on the spin layer composes on top.
    const advance = (event: Event) => {
      const clip = event.currentTarget as HTMLVideoElement;
      clip.currentTime = 0;
      // Step from the nearest quarter, not a running count: the slider resets
      // this layer when it takes the cube back on the way up.
      const current = Number(gsap.getProperty(turn, "rotationY"));
      const next = Math.round(current / 90) * 90 - 90;
      gsap.to(turn, { rotationY: next, duration: 1.2, ease: "power3.inOut", overwrite: true });
    };

    const stop = () => {
      gsap.ticker.remove(pick);
      clips[playing]?.pause();
      playing = -1;
    };

    clips.forEach((clip) => clip.addEventListener("ended", advance));
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) gsap.ticker.add(pick);
      else stop();
    });
    // Its section sits tucked under the hero, so it "intersects" from load —
    // the per-frame face check only starts once the visitor interacts.
    const cancelStart = afterFirstInteraction(() => observer.observe(root));
    return () => {
      cancelStart();
      observer.disconnect();
      stop();
      clips.forEach((clip) => clip.removeEventListener("ended", advance));
    };
  }, []);

  useGSAP(
    () => {
      // Explicit scale: parsing the server-rendered matrix leaves it at 1.00001.
      gsap.set("[data-studio='cube-spin']", { ...CUBE_POSE, scale: 1 });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-studio="cube"
      aria-hidden
      // `--cube-p` lets the slider hand-off match its own camera distance.
      className="relative aspect-square w-full will-change-transform [perspective:var(--cube-p,300cqw)]"
    >
      <div
        data-studio="cube-spin"
        className="absolute inset-[13%] [transform-style:preserve-3d]"
        // Matches CUBE_POSE so the server render is already in pose.
        style={{ transform: "rotate(-6deg) rotateY(24deg) rotateX(-18deg)" }}
      >
        {/* Turn layer: steps the cube to the next face when a clip ends. */}
        <div data-cube="turn" className="absolute inset-0 [transform-style:preserve-3d]">
          {projects.map((project, i) => (
            <VideoFace key={project.id} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * One clip on the cube: inset so the faces separate, heavy black outline,
 * rounded corners and the slab shading — drawn over the clip so the footage
 * can't cover it. Both sides render, so the inner walls show through the gaps
 * — matching the slider's folded cube, which it replaces seamlessly.
 */
function VideoFace({ index }: { index: number }) {
  const project = projects[index];
  const face = VIDEO_CUBE_FACES[index % VIDEO_CUBE_FACES.length];
  return (
    <div
      data-cube="video-face"
      data-index={index}
      className="absolute inset-[3%] overflow-hidden rounded-[13%] border-[1.6cqw] border-black bg-ink"
      style={{ transform: `rotateY(${face.ry}deg) rotateX(${face.rx}deg) translateZ(39cqw)` }}
    >
      <video
        src={project.video}
        poster={project.poster?.small}
        muted
        playsInline
        // Nothing loads until a face is actually played (see the effect above).
        preload="none"
        // Full cube height (74cqw), centred and trimmed by the face — the
        // same framing the slider's clip has as it folds, so nothing jumps
        // at the hand-off.
        className="absolute top-1/2 left-1/2 h-[74cqw] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset -1.2cqw -1.4cqw 0 0 rgb(0 0 0 / 0.18)" }}
      />
    </div>
  );
}

/**
 * Which video face points most towards the camera, through the spin layer
 * (`rotate(z) rotateY(y) rotateX(x)`) and the turn layer inside it. Z-rotation
 * spins in the screen plane, so it never changes which face is in front and
 * is left out.
 */
function frontFace(spin: { x: number; y: number }, turn: { x: number; y: number }) {
  const rad = Math.PI / 180;
  // CSS rotateX / rotateY applied to a vector.
  const rotX = ([x, y, z]: number[], deg: number) => {
    const [s, c] = [Math.sin(deg * rad), Math.cos(deg * rad)];
    return [x, y * c - z * s, y * s + z * c];
  };
  const rotY = ([x, y, z]: number[], deg: number) => {
    const [s, c] = [Math.sin(deg * rad), Math.cos(deg * rad)];
    return [x * c + z * s, y, -x * s + z * c];
  };
  let best = 0;
  let bestZ = -Infinity;
  VIDEO_CUBE_FACES.forEach(({ ry, rx }, i) => {
    // Outward normal: the face's own rotateY(ry) rotateX(rx), then the turn
    // layer, then the spin layer (innermost transform applies first).
    let n = rotY(rotX([0, 0, 1], rx), ry);
    n = rotY(rotX(n, turn.x), turn.y);
    n = rotY(rotX(n, spin.x), spin.y);
    if (n[2] > bestZ) {
      bestZ = n[2];
      best = i;
    }
  });
  return best;
}
