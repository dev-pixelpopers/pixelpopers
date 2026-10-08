import gsap from "gsap";

import { CUBE_POSE } from "@/components/ui/StudioCube";

/** Scoped selector returned by `gsap.utils.selector`. */
type Q = (selector: string) => Element[];

export const CUBE_ENTRIES = [
  { id: "original", label: "Original", hint: "Rolls in from the right edge (crosses the heading)" },
  { id: "v1", label: "V1", hint: "Rolls in from the left edge — never crosses the heading" },
  { id: "v2", label: "V2", hint: "Drops from above into its spot and bounces" },
  { id: "v3", label: "V3", hint: "Pops out of the glow, growing from a point" },
  { id: "v4", label: "V4", hint: "Assembles: the six faces fly in and snap together" },
  { id: "v5", label: "V5", hint: "Morph: the video slider folds into a video cube that becomes this section's cube" },
] as const;

export type CubeEntry = (typeof CUBE_ENTRIES)[number]["id"];

export const DEFAULT_CUBE_ENTRY: CubeEntry = "original";

/**
 * V5: viewport heights of scroll over which the slider's video cube travels
 * down to the Studio cube's spot. The Studio section is pulled up under the
 * slider by this much, so the slider's stage is still pinned (and the cube
 * moves smoothly with it) for the whole journey.
 */
export const V5_TRAVEL_VH = 100;

/** The `?cube=` value, as Next hands it to the page. */
export function toCubeEntry(value: string | string[] | undefined): CubeEntry {
  return CUBE_ENTRIES.find((entry) => entry.id === value)?.id ?? DEFAULT_CUBE_ENTRY;
}

/** Where the cube's box sits in the viewport, from layout (ignores transforms). */
function cubeBox(cube: HTMLElement) {
  const parent = cube.offsetParent as HTMLElement | null;
  const rect = parent?.getBoundingClientRect();
  return {
    left: (rect?.left ?? 0) + cube.offsetLeft,
    width: cube.offsetWidth,
    height: cube.offsetHeight,
  };
}

/**
 * Adds the cube's entrance to the Studio section's scroll timeline at `at`,
 * plus its tumble: a steady spin on [data-studio='cube-spin'], tied to
 * scroll, that comes to rest in the cube's pose as the ribbon finishes (7).
 *
 * Off-screen distances are functions, re-measured when the timeline is
 * invalidated on refresh.
 */
export function addCubeEntry(tl: gsap.core.Timeline, entry: CubeEntry, q: Q, at: number) {
  const cube = q("[data-studio='cube']")[0] as HTMLElement;
  // Mid-spin, perspective throws the near faces wider than the cube's box.
  const margin = () => cubeBox(cube).width * 0.4;

  // Two turns on each axis from wherever the tumble starts, so it is in its
  // pose (mod 360) both at the start and at the end. `none` keeps it 1:1
  // with scroll.
  const spinFrom = entry === "v5" ? V5_SWAP_AT : at;
  tl.fromTo(
    q("[data-studio='cube-spin']"),
    { rotationY: CUBE_POSE.rotationY + 720, rotationX: CUBE_POSE.rotationX - 720 },
    {
      rotationY: CUBE_POSE.rotationY,
      rotationX: CUBE_POSE.rotationX,
      duration: 7 - spinFrom,
      ease: "none",
    },
    spinFrom,
  );

  switch (entry) {
    case "original":
      // Across from the right edge — over the heading on the way.
      tl.fromTo(
        cube,
        { x: () => window.innerWidth - cubeBox(cube).left + margin(), scale: 0.85 },
        { x: 0, scale: 1, duration: 3.5, ease: "power1.inOut" },
        at,
      );
      break;

    case "v1":
      // From the left edge: the cube's column is left of the copy, so the
      // path never crosses the heading.
      tl.fromTo(
        cube,
        { x: () => -(cubeBox(cube).left + cubeBox(cube).width + margin()), scale: 0.85 },
        { x: 0, scale: 1, duration: 3.5, ease: "power2.out" },
        at,
      );
      break;

    case "v2":
      // Straight down its own column from above the viewport, landing with a
      // couple of bounces. The squash on landing sells the weight.
      tl.fromTo(
        cube,
        { y: () => -window.innerHeight },
        { y: 0, duration: 3, ease: "bounce.out" },
        at,
      ).fromTo(
        cube,
        { scaleX: 1, scaleY: 1 },
        {
          keyframes: [
            { scaleX: 1.12, scaleY: 0.88, duration: 0.25, ease: "power2.out" },
            { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
          ],
        },
        at + 1.2,
      );
      break;

    case "v3":
      // Grows out of the glow behind it, from a point, overshooting a touch.
      tl.fromTo(
        cube,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 2.8, ease: "back.out(1.8)" },
        at,
      );
      break;

    case "v4": {
      // The six faces start far out from the centre, invisible, and fly in
      // one after another, snapping into a cube while it spins.
      const faces = q("[data-cube='face']");
      tl.fromTo(
        cube,
        { scale: 0.9 },
        { scale: 1, duration: 3.4, ease: "power2.out" },
        at,
      ).fromTo(
        faces,
        { "--explode": "180cqw", autoAlpha: 0 },
        {
          "--explode": "39cqw",
          autoAlpha: 1,
          duration: 2.2,
          stagger: 0.22,
          ease: "power3.out",
        },
        at,
      );
      break;
    }

    case "v5":
      // Nothing to animate here: the video slider folds into a video cube and
      // carries it down to this spot (`ProjectSlider` with `foldIntoCube`),
      // handing over to this — identical — video cube as it lands. Until then
      // this cube is hidden by that hand-off; its tumble starts after the
      // hand-off so the two match pose for pose.
      break;
  }
}

/**
 * Timeline position (of 7) by which the V5 hand-off has finished — the
 * Studio cube holds its pose until here, then starts tumbling.
 */
const V5_SWAP_AT = 2.2;
