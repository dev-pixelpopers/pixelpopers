"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";

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
 */
export default function StudioCube() {
  const rootRef = useRef<HTMLDivElement>(null);

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
      className="relative aspect-square w-full will-change-transform [perspective:300cqw]"
    >
      <div
        data-studio="cube-spin"
        className="absolute inset-[13%] [transform-style:preserve-3d]"
        // Matches CUBE_POSE so the server render is already in pose.
        style={{ transform: "rotate(-6deg) rotateY(24deg) rotateX(-18deg)" }}
      >
        {FACES.map((face) => (
          <CubeFace key={face.turn} face={face} />
        ))}
      </div>
    </div>
  );
}

function CubeFace({ face }: { face: Face }) {
  return (
    <div
      className="absolute inset-[3%] overflow-hidden rounded-[13%] border-[1.6cqw] border-black [backface-visibility:hidden]"
      style={
        {
          backgroundColor: face.color,
          // Half the cube (37cqw) plus a little, so the panels separate at the
          // edges like the original render instead of meeting in a seam.
          transform: `${face.turn} translateZ(39cqw)`,
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
