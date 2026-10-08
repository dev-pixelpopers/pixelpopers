"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import { VIDEO_CUBE_FACES } from "@/components/ui/cube-faces";
import { projects } from "@/lib/site-content";

gsap.registerPlugin(useGSAP);

/**
 * Resting pose: camera a little above and to the left, so the top and left
 * faces show alongside the front — the same three-quarter view as the Figma
 * render this replaces. The section's scroll timeline spins from and back to it.
 */
export const CUBE_POSE = { rotationX: -18, rotationY: 24, rotationZ: -6 } as const;

type Face = {
  /** Where the face sits on the cube, before it is pushed out from the centre. */
  turn: string;
  /** Panel colour, sampled from the Figma render. */
  color: string;
  /** Full-bleed photo on the panel colour. */
  photo?: string;
  /** Round portrait centred on the panel, used where no full photo exists. */
  avatar?: string;
  logo?: boolean;
};

const FACES: Face[] = [
  { turn: "rotateY(0deg)", color: "#ee9fab", photo: "/assets/studio-cube/face-pink.webp" },
  { turn: "rotateX(90deg)", color: "#ea5f7c", photo: "/assets/studio-cube/face-red.webp" },
  { turn: "rotateY(180deg)", color: "#a9ccd8", avatar: "/assets/images/barry-allen.png" },
  { turn: "rotateY(-90deg)", color: "#d7c8ef", avatar: "/assets/images/adan-j.png" },
  { turn: "rotateY(90deg)", color: "#ffc857", avatar: "/assets/images/james-allen.png" },
  { turn: "rotateX(-90deg)", color: "#ff9f3a", logo: true },
];

/**
 * A real six-sided CSS 3D cube in the style of the old flat render: rounded
 * panels with heavy black outlines, pushed slightly apart so the edges read as
 * separate cards. Everything is sized in `cqw` of the parent container, so the
 * cube — including its 3D depth — scales as one unit.
 *
 * Two nested transforms, both driven by the section's scroll timeline:
 *   [data-studio='cube']       — 2D: slide in from the right, scale
 *   [data-studio='cube-spin']  — 3D: tumble and resting pose
 *
 * With `video`, the faces are the project clips instead — the cube the video
 * slider folds into, laid out to match it exactly (see `cube-faces.ts`).
 */
export default function StudioCube({ video = false }: { video?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Only the face pointing at the camera plays; the rest hold their frame.
  // Decoding six clips while the cube tumbles is what made it stutter, and
  // the face you are looking at is the only one you can see moving anyway.
  useEffect(() => {
    const root = rootRef.current;
    const spin = root?.querySelector<HTMLElement>("[data-studio='cube-spin']");
    if (!video || !root || !spin) return;
    const clips = Array.from(root.querySelectorAll<HTMLVideoElement>("[data-cube='video-face'] video"));
    let playing = -1;

    const pick = () => {
      const front = frontFace(
        Number(gsap.getProperty(spin, "rotationY")),
        Number(gsap.getProperty(spin, "rotationX")),
      );
      if (front === playing) return;
      clips[playing]?.pause();
      playing = front;
      void clips[front]?.play().catch(() => { });
    };
    const stop = () => {
      gsap.ticker.remove(pick);
      clips[playing]?.pause();
      playing = -1;
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) gsap.ticker.add(pick);
      else stop();
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [video]);

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
        {video
          ? projects.map((project, i) => <VideoFace key={project.id} index={i} />)
          : FACES.map((face) => <CubeFace key={face.turn} face={face} />)}
      </div>
    </div>
  );
}

function CubeFace({ face }: { face: Face }) {
  return (
    <div
      data-cube="face"
      className="absolute inset-[3%] overflow-hidden rounded-[13%] border-[1.6cqw] border-black [backface-visibility:hidden]"
      style={
        {
          backgroundColor: face.color,
          // Half the cube (37cqw) plus a little, so the panels separate at the
          // edges like the original render instead of meeting in a seam.
          // `--explode` lets an entrance fly the faces in from further out.
          transform: `${face.turn} translateZ(var(--explode, 39cqw))`,
          // Comic-book slab thickness along the bottom-right edge.
          boxShadow: "inset -1.2cqw -1.4cqw 0 0 rgb(0 0 0 / 0.18)",
        } as CSSProperties
      }
    >
      {face.photo ? (
        <Image src={face.photo} alt="" fill sizes="(max-width: 768px) 40vw, 20vw" className="object-cover" />
      ) : null}

      {face.avatar ? (
        <span className="absolute inset-0 grid place-items-center">
          <Image
            src={face.avatar}
            alt=""
            width={118}
            height={118}
            className="w-[55%] rounded-full border-[1cqw] border-black bg-white/40"
          />
        </span>
      ) : null}

      {face.logo ? (
        <span className="absolute inset-0 grid place-items-center">
          <Image
            src="/assets/logo-pixelpopers.png"
            alt=""
            width={190}
            height={84}
            className="w-[70%]"
          />
        </span>
      ) : null}
    </div>
  );
}

/**
 * One clip on the video cube, styled like the photo faces (`CubeFace`): inset
 * so the faces separate, heavy black outline, rounded corners and the slab
 * shading — drawn over the clip so the footage can't cover it. Unlike the
 * photo faces, both sides render, so the inner walls show through the gaps —
 * matching the slider's folded cube, which it replaces seamlessly.
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
        poster={project.poster?.src}
        muted
        loop
        playsInline
        preload="metadata"
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
 * Which video face points most towards the camera for a spin of
 * `rotate(z) rotateY(y) rotateX(x)`. Z-rotation spins in the screen plane, so
 * it never changes which face is in front and is left out.
 */
function frontFace(rotationY: number, rotationX: number) {
  const rad = Math.PI / 180;
  const [sy, cy] = [Math.sin(rotationY * rad), Math.cos(rotationY * rad)];
  const [sx, cx] = [Math.sin(rotationX * rad), Math.cos(rotationX * rad)];
  let best = 0;
  let bestZ = -Infinity;
  VIDEO_CUBE_FACES.forEach(({ ry, rx }, i) => {
    // The face's outward normal: rotateY(ry) rotateX(rx) applied to (0, 0, 1)…
    const nx = Math.cos(rx * rad) * Math.sin(ry * rad);
    const ny = -Math.sin(rx * rad);
    const nz = Math.cos(rx * rad) * Math.cos(ry * rad);
    // …then the spin's rotateX, then its rotateY; keep the depth component.
    const z1 = ny * sx + nz * cx;
    const z = -nx * sy + z1 * cy;
    if (z > bestZ) {
      bestZ = z;
      best = i;
    }
  });
  return best;
}
