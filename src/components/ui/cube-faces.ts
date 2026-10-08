/**
 * Where each project clip sits on the video cube: four round the sides, one on
 * top and one underneath, as `rotateY(ry) rotateX(rx)` before being pushed out.
 *
 * Shared by the slider (whose ring folds into this cube — neighbouring tiles
 * go to neighbouring faces, so the fold reads as the ring closing up) and the
 * Studio section's video cube, which must match it face for face for the
 * hand-off between them to be invisible.
 */
export const VIDEO_CUBE_FACES = [
  { ry: 0, rx: 0 },
  { ry: 90, rx: 0 },
  { ry: 180, rx: 90 },
  { ry: 180, rx: 0 },
  { ry: 270, rx: 0 },
  { ry: 360, rx: -90 },
] as const;

/*
 * The face styling of the Studio cube (StudioCube's `CubeFace`), as fractions
 * of the cube's side (its spin box, 74cqw), so the slider can draw the same
 * faces in pixels while it folds:
 */

/** Each face is inset 3% from the box, which opens the gaps between faces. */
export const FACE_SIZE = 0.94;
/** Faces are pushed 39cqw out of a 74cqw box — a touch past half, so they separate. */
export const FACE_PUSH = 39 / 74;
/** Heavy black outline: 1.6cqw. */
export const FACE_BORDER = 1.6 / 74;
/** Corner radius, as a fraction of the face's own side (`rounded-[13%]`). */
export const FACE_RADIUS = 0.13;
/** Comic-book slab shading along the bottom-right edge: inset 1.2cqw × 1.4cqw. */
export const FACE_SHADE = { x: 1.2 / 74, y: 1.4 / 74, color: "rgb(0 0 0 / 0.18)" };
