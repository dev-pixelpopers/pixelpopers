# Pixel Popers

Next.js + Tailwind CSS v4 implementation of the Figma frame
[`pixles-popers / ui deisgn`](https://www.figma.com/design/BPye5ITVRRIXmKg8Hjnk6Q/pixles-popers?node-id=25-14)
(file `BPye5ITVRRIXmKg8Hjnk6Q`, node `25:14`).

```bash
npm run dev
```

## Structure

| Path                        | Purpose                                                        |
| --------------------------- | -------------------------------------------------------------- |
| `src/app/globals.css`       | Design tokens: palette, font stacks, fluid type scale, `shell`  |
| `src/lib/site-content.ts`   | Typed copy + asset manifest (services, clients)                 |
| `src/components/layout/`    | `SiteHeader`                                                    |
| `src/components/sections/`  | One component per Figma band, composed by `src/app/page.tsx`    |
| `src/components/sections/ProjectCarouselSection.tsx` | Scroll-driven 3D project ring (the only client component) |
| `src/components/ui/`        | `PopButton`, `BrandLogo`, `ArcHeading`, `ServiceTile`, `ClientCard` |
| `public/assets/`            | Raster exports (photography, mockups, client logos)             |
| `public/icons/`             | Vector exports (waves, doodles, folder, gradients)              |

## Layout approach

Everything is laid out in normal document flow with flexbox and CSS grid.
Overlays use a **single-cell grid** (all children in `col-start-1 row-start-1`)
rather than absolute positioning. `absolute` is reserved for artwork that has no
flow equivalent, and each use is commented:

- the hero glow and dashed ribbon swirl,
- the project carousel's tiles, which stack at the stage centre and are
  transformed out along a 3D ring,
- the two waves in the device showcase,
- the hairlines fanning out behind the client constellation,
- the decorative doodles flanking the hero headline.

Scaling is fluid: the type scale is `clamp()`-based off the 1920px Figma
measurements, and the service letter tiles size their glyph, label and counter
dot in container-query units (`cqw`) so each tile scales as one unit.

## Project carousel

`ProjectCarouselSection` replaces what used to be a flat PNG of a card band. It is a **cylinder**:
six tiles sit evenly around a circle, each facing outward, and the whole ring rotates about its Y
axis as you scroll — a merry-go-round, not a coverflow fan.

A tall parent holds a `sticky top-0 h-screen` stage; GSAP ScrollTrigger reports scroll progress
across that parent (`scrub: 1`, `ease: "none"` — the pin is CSS `sticky`, **not** `pin: true`).
Per-frame work is a single property on a single element:

```ts
gsap.set(ring, { rotationY: -progress * SLOT_ANGLE });
```

Tiles are placed once in CSS — `rotateY(i × 60deg) translateZ(var(--ring-r))` — and never touched
again. `--ring-r` is a custom property on the stage, so a resize writes one value instead of
touching every tile. `transform-style: preserve-3d` on the ring makes the browser depth-sort the
tiles, so nearer ones occlude farther ones with no `z-index` bookkeeping at all.

The radius seats the tiles around the circle, `radius = GAP_RATIO × (w/2) / tan(π/n)`, and the ring
carries `z: -radius` so the front tile lands at `z = 0` and renders at natural size rather than
being magnified by `P/(P−R)`.

**Tuning dials** (all at the top of the file): `GAP_RATIO` opens the spacing, `PERSPECTIVE_RATIO`
sets camera distance (lower = more extreme 3D), and `RING_TILT` adds `rotateX`. Tilt is `0` — a
pure side-on view, which means the tile at 180° is hidden behind the front tile at rest; raising it
to ~8° tips the camera down and reveals the back of the ring. Far-side tiles deliberately show
their mirrored backface, which is the standard CSS-carousel look.

Two things that will silently break this if reintroduced:

- **`invalidateOnRefresh` on the progress tween.** It re-anchors the tween's *from* value to
  wherever `state.progress` currently sits, so each refresh shortens the sweep and the ring stops
  completing a revolution. The tween is a `fromTo` pinned at 0 for the same reason; resize geometry
  is handled in `onRefresh` instead.
- **A one-shot `play()`.** A tile that has just rotated into place mounts at `readyState 0`, so the
  first call fails and the clip stays paused even once buffered. Playback retries on `canplay`.

**Adding a project:** append to `projects` in `src/lib/site-content.ts`. The ring keeps at least six
slots and cycles the list to fill them, so with one project the same tile repeats; past six it
grows rather than dropping projects, and `SLOT_ANGLE` follows the count.

Playback is owned by the section, not the tile: exactly one clip runs, always `muted` /
`playsInline` / `loop` with no `controls`, and only while the section is on screen. A `<video>` is
mounted only for slots within one step of the front (≤3 at a time) — the rest render the poster
alone. `public/assets/videos/snackbar-video.mp4` is currently **80 MB**; poster-first loading limits
the damage, but it should be compressed (H.264, ~1080p, CRF 24-26, no audio track) before this goes
anywhere near production.

Under `prefers-reduced-motion: reduce` neither ScrollTrigger is created — the ring renders
statically at rotation 0 and nothing plays.

## Fonts

The Figma file uses two licensed faces that cannot be redistributed. Each token
in `globals.css` names the licensed face first and falls back to the closest
freely licensed match, so dropping in a real webfont takes over automatically:

| Token             | Figma                  | Fallback in this repo |
| ----------------- | ---------------------- | --------------------- |
| `--font-display`  | Nevera                 | Michroma              |
| `--font-grotesk`  | Haas Grot Disp Trial   | Archivo               |
| `--font-pop`      | Modak                  | Modak (exact)         |

To use the real faces, add the webfonts under `public/fonts/`, declare them with
`next/font/local` in `src/app/layout.tsx`, and the existing stacks pick them up.

## Assets

All images and vectors are unmodified exports from the Figma node. Client marks
that Figma renders by tinting an alpha mask (light-on-transparent logos) are
reproduced the same way via `mask-image` — see the `tint` field in
`src/lib/site-content.ts`.
