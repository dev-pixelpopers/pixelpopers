import gsap from "gsap";

import { CUBE_POSE } from "@/components/ui/StudioCube";

/** Scoped selector returned by `gsap.utils.selector`. */
type Q = (selector: string) => Element[];

/**
 * Viewport heights of scroll over which the video slider's folded cube travels
 * down to the Studio cube's spot. The Studio section is pulled up under the
 * slider by this much, so the slider's stage is still pinned (and the cube
 * moves smoothly with it) for the whole journey.
 */
export const CUBE_TRAVEL_VH = 100;

/**
 * Exit into the services letters (services V3): extra pinned scroll at the
 * end of the Studio section. In the first STUDIO_UNWIND_VH everything in the
 * section plays back out and the cube pops; in the rest, the services top
 * row — pinned on the same screen underneath — pops out of its bubbles.
 */
export const STUDIO_EXIT_VH = 150;
export const STUDIO_UNWIND_VH = 70;

/**
 * Studio timeline position (of 7) by which the slider has handed its cube
 * over. The cube holds its pose until here, then starts tumbling — so it
 * matches the slider's cube pose for pose at the hand-off.
 */
const TUMBLE_FROM = 2.2;

/**
 * The cube's tumble on the Studio section's scroll timeline: a steady spin on
 * [data-studio='cube-spin'], tied to scroll, two turns on each axis, coming to
 * rest in its pose as the ribbon finishes (7). Whole turns, so it is in pose
 * at both ends. `none` keeps it 1:1 with scroll.
 *
 * The cube itself arrives from the video slider, which folds into it and
 * carries it down here (`ProjectSlider`), so there is no entrance to add.
 */
export function addCubeTumble(tl: gsap.core.Timeline, q: Q) {
  tl.fromTo(
    q("[data-studio='cube-spin']"),
    { rotationY: CUBE_POSE.rotationY + 720, rotationX: CUBE_POSE.rotationX - 720 },
    {
      rotationY: CUBE_POSE.rotationY,
      rotationX: CUBE_POSE.rotationX,
      duration: 7 - TUMBLE_FROM,
      ease: "none",
    },
    TUMBLE_FROM,
  );
}
