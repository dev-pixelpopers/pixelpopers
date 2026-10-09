"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Fragment, useRef, type CSSProperties } from "react";

import { deferSetup } from "@/lib/defer-setup";
import { AGENCY_EXIT_VH, AGENCY_UNWIND_VH } from "@/components/sections/agency-motion";
import BrandLogo from "@/components/ui/BrandLogo";
import ClientCard from "@/components/ui/ClientCard";
import PopButton from "@/components/ui/PopButton";
import { clients } from "@/lib/site-content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const radiatingLines = [
  { src: "/icons/folder-back-left.svg", width: 721, height: 748 },
  { src: "/icons/folder-wave-left.svg", width: 868, height: 542 },
  { src: "/icons/folder-wave-right.svg", width: 868, height: 542 },
  { src: "/icons/folder-back-right.svg", width: 721, height: 748 },
];

/** `folder-front.svg`, inlined so it can clip the frosted-glass panel. */
const FOLDER_FRONT_PATH =
  "M0.0302903 31.334C-0.729698 14.2588 12.9085 0 30.0006 0H279.271C296.363 0 310.001 14.2588 309.241 31.3339L303.143 168.334C302.43 184.368 289.223 197 273.173 197H36.0983C20.0484 197 6.84158 184.368 6.12794 168.334L0.0302903 31.334Z";

const COPY =
  "We don’t just take on clients; we build long-term digital partnerships. Here are a few of the visionary companies we are proud to collaborate with every single day.";

/**
 * Where each card sits while stuffed in the folder, as fractions of the
 * folder's own box: three loose columns, each row a little deeper so the
 * later cards disappear behind the frosted front panel.
 */
const PILE_COLUMNS = [-0.31, 0, 0.31];
const PILE_TOP = -0.12;
const PILE_ROW_STEP = 0.14;
/** Small, fixed jitter so the pile looks hand-stuffed rather than gridded. */
const PILE_JITTER = [
  { x: 0.02, r: -6 },
  { x: -0.03, r: 4 },
  { x: 0.01, r: 9 },
  { x: -0.02, r: -3 },
  { x: 0.03, r: 7 },
  { x: -0.01, r: -8 },
];
/** Card width while in the folder, as a fraction of the folder width. */
const PILE_CARD_WIDTH = 0.36;
/** Starting size of the folder — larger, as in the opening frame. */
const FOLDER_START_SCALE = 1.25;
/** Fraction of the folder left on screen once it has docked. */
const FOLDER_END_VISIBLE = 0.97;

/** Confetti thrown when the folder pops on the way out. */
const POP_PIECES = 16;
const POP_TONES = ["bg-blush", "bg-lagoon", "bg-sunbeam", "bg-grape"];

/** Stable pseudo-random 0–1 per index. */
const rand = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0 → 1 → 0 over the first `w` of a 0–1 progress. */
const bump = (a: number, w = 1) => (a > 0 && a < w ? Math.sin((Math.PI * a) / w) : 0);
const vh = (n: number) => (n / 100) * window.innerHeight;

/**
 * A card's pose in stage coordinates: its centre, its displayed size as a
 * multiple of its natural size, and its tilt. Converted to the card's own
 * transform (inside the grid) by `setCard`.
 */
type Pose = { x: number; y: number; scale: number; rotation: number; sx?: number; sy?: number };
type Rect = { x: number; y: number; w: number; h: number };

/** The Halton low-discrepancy sequence: evenly spread, never gridded. */
function halton(index: number, base: number) {
  let f = 1;
  let r = 0;
  for (let i = index; i > 0; i = Math.floor(i / base)) {
    f /= base;
    r += f * (i % base);
  }
  return r;
}

/**
 * Free-form landing spots for `n` cards inside `area`, clear of `keepClear`:
 * each starts somewhere random (but the same every time) at its own size
 * and tilt, then overlapping cards push each other apart until none touch.
 * No grid to it, so the result reads as a hand-tossed scatter.
 */
function strewCards(n: number, cardW: number, cardH: number, area: Rect, keepClear: Rect[]): Pose[] {
  // A little breathing room round everything the cards must stay off.
  const m = 0.02 * area.h + 8;
  const avoid = keepClear.map((r) => ({ x: r.x - m, y: r.y - m, w: r.w + 2 * m, h: r.h + 2 * m }));
  const free = area.w * area.h - avoid.reduce((sum, r) => sum + r.w * r.h, 0);
  const base = Math.min(1, Math.sqrt((0.36 * Math.max(free, area.w * area.h * 0.3)) / (n * cardW * cardH)));
  const gap = 10; // a little air between cards
  const cards = Array.from({ length: n }, (_, i) => {
    const scale = base * (0.82 + 0.32 * rand(i, 12));
    const rotation = (rand(i, 13) - 0.5) * 30;
    // The tilted card's footprint, so corners never poke out or overlap.
    const rad = (Math.abs(rotation) * Math.PI) / 180;
    const w = cardW * scale;
    const h = cardH * scale;
    return {
      // Low-discrepancy start (Halton 2/3, shuffled): spread evenly over the
      // area without any rows or columns showing.
      x: area.x + halton(i + 1 + Math.floor(rand(7, 3) * 20), 2) * area.w,
      y: area.y + halton(i + 1 + Math.floor(rand(7, 3) * 20), 3) * area.h,
      hw: (w * Math.cos(rad) + h * Math.sin(rad) + gap) / 2,
      hh: (w * Math.sin(rad) + h * Math.cos(rad) + gap) / 2,
      scale,
      rotation,
    };
  });

  /**
   * Moves a card off a rectangle by the shortest way out that still leaves
   * it inside the area (so nothing is shoved off the bottom of the screen).
   */
  const pushOut = (c: (typeof cards)[number], r: Rect) => {
    if (c.x + c.hw <= r.x || c.x - c.hw >= r.x + r.w || c.y + c.hh <= r.y || c.y - c.hh >= r.y + r.h) return;
    const exits = [
      { x: r.x - c.hw, y: c.y },
      { x: r.x + r.w + c.hw, y: c.y },
      { x: c.x, y: r.y - c.hh },
      { x: c.x, y: r.y + r.h + c.hh },
    ].filter(
      (e) =>
        e.x - c.hw >= area.x - 0.5 &&
        e.x + c.hw <= area.x + area.w + 0.5 &&
        e.y - c.hh >= area.y - 0.5 &&
        e.y + c.hh <= area.y + area.h + 0.5,
    );
    if (!exits.length) return;
    const best = exits.reduce((a, e) =>
      Math.hypot(e.x - c.x, e.y - c.y) < Math.hypot(a.x - c.x, a.y - c.y) ? e : a,
    );
    c.x = best.x;
    c.y = best.y;
  };

  const keepInside = (c: (typeof cards)[number]) => {
    c.x = gsap.utils.clamp(area.x + c.hw, area.x + area.w - c.hw, c.x);
    c.y = gsap.utils.clamp(area.y + c.hh, area.y + area.h - c.hh, c.y);
  };

  for (let step = 0; step < 300; step++) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = cards[i];
        const b = cards[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const ox = a.hw + b.hw - Math.abs(dx);
        const oy = a.hh + b.hh - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        // Split the overlap between the two, along the shallower side.
        if (ox < oy) {
          const push = (Math.sign(dx || (i % 2 ? 1 : -1)) * ox) / 2;
          a.x -= push;
          b.x += push;
        } else {
          const push = (Math.sign(dy || (j % 2 ? 1 : -1)) * oy) / 2;
          a.y -= push;
          b.y += push;
        }
      }
    }
    for (const c of cards) {
      keepInside(c);
      avoid.forEach((r) => pushOut(c, r));
    }
  }

  return cards.map(({ x, y, scale, rotation }) => ({ x, y, scale, rotation }));
}

type Layout = ReturnType<typeof measureLayout>;

/**
 * All geometry comes from offset* metrics, which ignore transforms, so it can
 * be re-measured at any scroll position without first undoing the animation.
 */
function measureLayout(stage: HTMLElement) {
  const find = (key: string) => stage.querySelector<HTMLElement>(`[data-agency='${key}']`);
  const $ = (key: string) => find(key)!;
  const header = $("header");
  const grid = $("grid");
  const folder = $("folder");
  // The paragraph and button beside the docked folder are optional.
  const copy = find("copy");
  const cta = find("cta-out");
  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-agency='card']"));

  const stageW = stage.clientWidth;
  const stageH = stage.clientHeight;
  const headerBottom = header.offsetTop + header.offsetHeight;
  const W = folder.offsetWidth;
  const H = folder.offsetHeight;

  // Opening frame: the folder sits under the headline with room above it for
  // the top of the pile, shrunk if the viewport is too short to fit it.
  const startScale = gsap.utils.clamp(0.6, FOLDER_START_SCALE, (0.96 * stageH - headerBottom) / (1.45 * H));
  const folderCx = folder.offsetLeft + W / 2;
  const folderStartCy = headerBottom + 0.45 * H * startScale + (H * startScale) / 2;
  const folderStartY = folderStartCy - (folder.offsetTop + H / 2);
  const folderStartTop = folderStartCy - (H * startScale) / 2;

  // Closing frame: the folder docked at the bottom; the paragraph and button
  // sit beside it in the same row, so they move with it (`shift`).
  const folderEndTop = stageH - FOLDER_END_VISIBLE * H;
  const folderEndY = folderEndTop - folder.offsetTop;
  const shift = folderEndY;
  const headerScale = gsap.utils.clamp(0.45, 0.75, (0.17 * stageH) / header.offsetHeight);
  const strewnTop = header.offsetTop + header.offsetHeight * headerScale + 0.03 * stageH;

  const cardW = cards[0]?.offsetWidth ?? 160;
  const cardH = cards[0]?.offsetHeight ?? 100;

  const geo = cards.map((card, i) => {
    const jitter = PILE_JITTER[i % PILE_JITTER.length];
    const col = PILE_COLUMNS[i % PILE_COLUMNS.length];
    const row = Math.floor(i / PILE_COLUMNS.length);
    return {
      // The card's own centre in the (untransformed) grid.
      cx: grid.offsetLeft + card.offsetLeft + card.offsetWidth / 2,
      cy: grid.offsetTop + card.offsetTop + card.offsetHeight / 2,
      pile: {
        x: folderCx + (col + jitter.x) * W * startScale,
        y: folderStartTop + (PILE_TOP + row * PILE_ROW_STEP) * H * startScale,
        scale: (PILE_CARD_WIDTH * W * startScale) / card.offsetWidth,
        rotation: jitter.r,
      } satisfies Pose,
    };
  });

  // Where each card lands when it pops out — strewn freely over the screen
  // between the headline and the dock row (below that the folder and copy
  // leave only slivers, where a card would end up wedged or hidden).
  const box = (el: HTMLElement, dy = 0): Rect => ({
    x: el.offsetLeft,
    y: el.offsetTop + dy,
    w: el.offsetWidth,
    h: el.offsetHeight,
  });
  const beside = [copy, cta].filter((el): el is HTMLElement => Boolean(el));
  const strewnBottom = Math.min(folderEndTop, ...beside.map((el) => el.offsetTop + shift)) - 0.01 * stageH;
  const strewn = strewCards(
    cards.length,
    cardW,
    cardH,
    { x: 0.03 * stageW, y: strewnTop, w: 0.94 * stageW, h: Math.max(strewnBottom - strewnTop, cardH * 2) },
    [{ x: folderCx - W / 2, y: folderEndTop - 0.04 * H, w: W, h: H }, ...beside.map((el) => box(el, shift))],
  );

  return {
    stageH,
    W,
    H,
    startScale,
    folderStartY,
    folderEndY,
    shift,
    headerScale,
    headerExitY: -(headerBottom + 40),
    cards: geo,
    strewn,
    /** Inside the docked folder, behind its frosted front. */
    mouth: { x: folderCx, y: folderEndTop + 0.5 * H },
    cta: cta
      ? {
          x: cta.offsetLeft + cta.offsetWidth / 2,
          y: cta.offsetTop + cta.offsetHeight / 2,
          w: cta.offsetWidth,
          h: cta.offsetHeight,
        }
      : { x: 0, y: 0, w: 0, h: 0 },
  };
}

type Proxies = Record<string, number>;

/**
 * Opening frame: headline over a frosted folder stuffed with client cards.
 * The stage then holds (CSS sticky) while the headline tucks up small and
 * the cards pop out of the folder one at a time, arcing high and landing,
 * tilted, in a loose scatter over the screen — the folder kicking with every
 * pop. The folder docks at the bottom, the paragraph rises in beside it and
 * the case-studies button pops out of it.
 *
 * Exit (still pinned): it all plays back out — the button dives back into
 * the folder, the words drop, the folder rises and every card arcs back
 * into it — then the folder swells and pops, leaving the screen to the
 * Contact section tucked up underneath (see `agency-motion.ts`).
 */
type AgencySectionProps = {
  /** Section id; the heading and the folder's clip path derive theirs from it. */
  id?: string;
  eyebrow?: string;
  heading?: string;
  /** Paragraph beside the docked folder — `null` for none. */
  copy?: string | null;
  /** Button that pops out of the docked folder — `null` for none. */
  cta?: { href: string; label: string } | null;
  /**
   * Stay pinned at the end, play everything back into the folder and pop it,
   * handing the screen to the next section (the home page's Contact, tucked
   * up underneath — see `agency-motion.ts`). Without it the section simply
   * scrolls on once the scatter has settled.
   */
  exit?: boolean;
};

export default function AgencySection({
  id = "agency",
  eyebrow = "The Agency",
  heading = "Behind the Brands You Love",
  copy = COPY,
  cta = { href: "/work", label: "View Our Case Studies" },
  exit = true,
}: AgencySectionProps) {
  const words = copy ? copy.split(" ") : [];
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      // Far below the fold: set up in its own short task after load rather
      // than in the initial commit (see deferSetup).
      return deferSetup(
        contextSafe!(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const q = gsap.utils.selector(stage);
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          // Measured lazily and dropped on every refresh, so a resize re-derives
          // the whole choreography from the new layout.
          let layout: Layout | null = null;
          const L = () => (layout ??= measureLayout(stage));
          const forget = () => {
            layout = null;
          };

          const cardEls = q("[data-agency='card']") as HTMLElement[];
          const folderLayers = q("[data-agency='folder-layer']");
          const header = q("[data-agency='header']");
          // The entrance and the exit each move their own element: the exit
          // drives an `*-out` wrapper around what the entrance drives. Both are
          // scrubbed with a little lag, so on a quick scroll the entrance can
          // still be catching up after the exit has started; sharing one
          // element, its last frames would land on top of the exit's.
          const ctaEl = q("[data-agency='cta']");
          const ctaOut = q("[data-agency='cta-out']");
          const wordEls = q("[data-agency='word']");
          const wordsOut = q("[data-agency='word-out']");
          gsap.set(folderLayers, { transformOrigin: "50% 50%" });
          gsap.set(header, { transformOrigin: "50% 0%" });

          // Cards and folder are posed every frame from plain progress values,
          // so their arcs are always worked out from the current layout.
          //   per card: fly / land (popping out), back (returning on the exit)
          //   section:  move / unmove (folder docking and back), spit, swell, pop
          const P: Proxies[] = cardEls.map(() => ({ fly: 0, land: 0, back: 0 }));
          // Every section-wide value starts at 0, including the exit's, which are
          // only driven when the section has an exit.
          const G: Proxies = { move: 0, unmove: 0, spit: 0, swell: 0, pop: 0 };

          const cardPose = (i: number, l: Layout): Pose => {
            const c = l.cards[i];
            const p = P[i];
            // On the way out the same throw plays backwards.
            const a = p.back > 0 ? 1 - p.back : p.fly;
            if (a <= 0) return c.pile;
            const to = l.strewn[i];
            // A real throw: steady sideways, a parabola up and back down.
            const h = Math.max(0.2 * l.stageH, (c.pile.y - to.y) * 0.5);
            const squash = p.back > 0 ? 0 : bump(p.land) * (1 - p.land);
            return {
              x: lerp(c.pile.x, to.x, a),
              y: lerp(c.pile.y, to.y, a) - 4 * h * a * (1 - a),
              scale: lerp(c.pile.scale, to.scale, a),
              rotation: lerp(c.pile.rotation, to.rotation, a) + (i % 2 ? 360 : -360) * a,
              sx: 1 + 0.3 * squash,
              sy: 1 - 0.3 * squash,
            };
          };

          const applyAll = () => {
            const l = L();
            cardEls.forEach((el, i) => {
              const pose = cardPose(i, l);
              const c = l.cards[i];
              gsap.set(el, {
                x: pose.x - c.cx,
                y: pose.y - c.cy,
                rotation: pose.rotation,
                scaleX: pose.scale * (pose.sx ?? 1),
                scaleY: pose.scale * (pose.sy ?? 1),
              });
            });

            // The folder kicks as each card leaves it, and again as each comes
            // back in; on the exit it swells, trembles and bursts.
            const kick = Math.max(
              bump(G.spit),
              ...P.map((p) => (p.back > 0 ? bump(1 - p.back, 0.2) : bump(p.fly, 0.2))),
            );
            const m = G.move - G.unmove;
            const scale = lerp(l.startScale, 1, m) * (1 + 0.18 * G.swell + 0.35 * G.pop);
            gsap.set(folderLayers, {
              y: lerp(l.folderStartY, l.folderEndY, m),
              scaleX: scale * (1 + 0.07 * kick),
              scaleY: scale * (1 - 0.1 * kick),
              rotation: Math.sin(G.swell * Math.PI * 14) * 4 * G.swell,
            });
          };

          let dirty = true;
          const mark = () => {
            dirty = true;
          };
          const tick = () => {
            if (!dirty) return;
            dirty = false;
            applyAll();
          };

          // Invalidating clears every tween's recorded start, but only the ones
          // at the playhead re-render; sweeping to the end and back re-renders
          // them all at the current progress. `self.animation`, not the
          // timeline: the first refresh can fire while it's being built.
          const sweep = (self: ScrollTrigger) => {
            const anim = self.animation;
            if (!anim) return;
            const progress = anim.progress();
            anim.progress(1, true).progress(progress, true);
            mark();
          };

          const timeline = (scrollTrigger: ScrollTrigger.Vars) =>
            gsap.timeline({
              defaults: { ease: "power2.inOut" },
              scrollTrigger: {
                trigger: trackRef.current,
                scrub: 1,
                invalidateOnRefresh: true,
                onRefresh: sweep,
                ...scrollTrigger,
              },
            });

          const drive = (tl: gsap.core.Timeline, target: Proxies, key: string, at: number, duration: number, ease = "none") => {
            target[key] = 0;
            tl.fromTo(target, { [key]: 0 }, { [key]: 1, duration, ease, onUpdate: mark }, at);
          };

          // ── Entrance ───────────────────────────────────────────────────────
          // The pin is CSS `sticky`; ScrollTrigger only reports progress. The
          // last stretch of the track belongs to the exit.
          const tl = timeline({
            start: "top top",
            end: () => (exit ? `bottom-=${vh(AGENCY_EXIT_VH)} bottom` : "bottom bottom"),
          });

          tl.fromTo(header, { scale: 1 }, { scale: () => L().headerScale, duration: 0.8 }, 0);
          P.forEach((p, i) => {
            const t = 0.5 + i * 0.2;
            drive(tl, p, "fly", t, 0.9);
            drive(tl, p, "land", t + 0.9, 0.3);
          });
          drive(tl, G, "move", 4.3, 1, "power2.inOut");
          if (wordEls.length) {
            tl.fromTo(
              wordEls,
              { yPercent: 110, rotation: 6 },
              { yPercent: 0, rotation: 0, duration: 0.5, stagger: 0.03, ease: "back.out(2)" },
              5.0,
            );
          }
          // The button springs out of the docked folder's mouth into its place.
          drive(tl, G, "spit", 5.4, 0.35);
          if (ctaEl.length) {
            tl.fromTo(ctaEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, ease: "none" }, 5.45).fromTo(
              ctaEl,
              {
                x: () => L().mouth.x - L().cta.x,
                y: () => L().mouth.y - L().cta.y,
                scale: 0.3,
                rotation: -20,
              },
              { x: 0, y: () => L().shift, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.8)", immediateRender: false },
              5.45,
            );
          }
          tl.fromTo(q("[data-agency='lines']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "none" }, 5.4)
            // Dwell on the finished frame before the exit takes over.
            .to({}, { duration: 0.8 });

          if (exit) {
            // ── Exit ───────────────────────────────────────────────────────────
            // Scrubbed over the first AGENCY_UNWIND_VH of the exit; every tween
            // starts from the entrance's end state with `immediateRender: false`,
            // so before the exit starts it renders exactly what the entrance left.
            const off = { immediateRender: false } as const;
            const exit = timeline({
              start: () => `bottom-=${vh(AGENCY_EXIT_VH)} bottom`,
              end: () => `bottom-=${vh(AGENCY_EXIT_VH - AGENCY_UNWIND_VH)} bottom`,
            });

            // Last in, first out: the hairlines, the button back into the folder…
            // (The button's wrapper sits where the button's layout box is, while
            // the button itself has been moved down by `shift`, so the wrapper
            // turns and shrinks about the button's actual centre.)
            exit
              .fromTo(q("[data-agency='lines-out']"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4, ease: "none", ...off }, 0)
              .fromTo(
                ctaOut,
                {
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  transformOrigin: () => `${L().cta.w / 2}px ${L().cta.h / 2 + L().shift}px`,
                },
                {
                  x: () => L().mouth.x - L().cta.x,
                  y: () => L().mouth.y - L().cta.y - L().shift,
                  scale: 0.3,
                  rotation: -20,
                  duration: 0.6,
                  ease: "back.in(1.6)",
                  ...off,
                },
                0,
              )
              .fromTo(ctaOut, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01, ease: "none", ...off }, 0.6)
              // …the paragraph drops away, last word first…
              .fromTo(
                wordsOut,
                { yPercent: 0, rotation: 0 },
                { yPercent: 110, rotation: 6, duration: 0.4, stagger: { each: 0.015, from: "end" }, ease: "power2.in", ...off },
                0.1,
              );
            drive(exit, G, "unmove", 0.6, 0.8, "power2.inOut");
            // …every card arcs back into the folder, the last one out first…
            P.forEach((p, i) => drive(exit, p, "back", 1.2 + (P.length - 1 - i) * 0.08, 0.7));
            // …the headline leaves…
            exit.fromTo(
              header,
              { y: 0, autoAlpha: 1 },
              { y: () => L().headerExitY, autoAlpha: 0, duration: 0.6, ease: "power2.in", ...off },
              2.9,
            );
            // …and the stuffed folder swells, trembles and pops.
            drive(exit, G, "swell", 3.3, 0.6, "power1.in");
            drive(exit, G, "pop", 3.9, 0.15, "power2.out");
            exit
              .fromTo(
                [...folderLayers, ...q("[data-agency='grid']")],
                { autoAlpha: 1 },
                { autoAlpha: 0, duration: 0.12, ease: "none", ...off },
                3.9,
              )
              .set(q("[data-agency='pop-ring']"), { scale: 0.3, autoAlpha: 1 }, 3.9)
              .to(q("[data-agency='pop-ring']"), { scale: 2.4, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 3.9);
            const pieces = q("[data-agency='pop-piece']");
            const reach = () => L().W * L().startScale * 1.1;
            exit.set(pieces, { x: 0, y: 0, rotation: 0, scale: 1.3, autoAlpha: 1 }, 3.9).to(
              pieces,
              {
                x: (i) => Math.cos((i / pieces.length) * Math.PI * 2 + rand(i) * 0.5) * reach() * (0.6 + rand(i, 2) * 0.6),
                y: (i) => Math.sin((i / pieces.length) * Math.PI * 2 + rand(i) * 0.5) * reach() * (0.6 + rand(i, 2) * 0.6),
                rotation: (i) => (rand(i, 3) - 0.5) * 720,
                scale: 0.3,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power3.out",
              },
              3.9,
            );
            exit.to({}, { duration: 0.1 });
          }

          // The pop sits where the folder will be when it bursts (its opening
          // spot), and the copy row rides with the docked folder.
          const place = () => {
            const l = L();
            gsap.set(q("[data-agency='pop']"), { y: l.folderStartY, scale: l.startScale });
            if (copy) gsap.set(q("[data-agency='copy']"), { y: l.shift });
            applyAll();
          };
          place();

          ScrollTrigger.addEventListener("refreshInit", forget);
          ScrollTrigger.addEventListener("refresh", place);
          gsap.ticker.add(tick);
          return () => {
            ScrollTrigger.removeEventListener("refreshInit", forget);
            ScrollTrigger.removeEventListener("refresh", place);
            gsap.ticker.remove(tick);
          };
        });
        }),
      );
    },
    { scope: trackRef },
  );

  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <div
        ref={trackRef}
        className="relative h-[calc(420vh+var(--exit))] motion-reduce:h-auto"
        style={{ "--exit": exit ? `${AGENCY_EXIT_VH}vh` : "0vh" } as CSSProperties}
      >
        <div
          ref={stageRef}
          className="sticky top-0 isolate flex h-svh flex-col items-center overflow-hidden pt-[clamp(1.5rem,4vh,3rem)] text-center motion-reduce:relative motion-reduce:h-auto motion-reduce:gap-[clamp(2rem,4vw,4.5rem)] motion-reduce:pb-[clamp(3rem,7vw,8rem)] [&>*]:shrink-0"
        >
          {/* Decorative hairlines fanning out from the folder. */}
          <div data-agency="lines-out" aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div data-agency="lines" className="absolute inset-0 flex items-end justify-center">
              {radiatingLines.map((line) => (
                <Image
                  key={line.src}
                  src={line.src}
                  alt=""
                  width={line.width}
                  height={line.height}
                  className="h-auto w-[45%] max-w-none opacity-70"
                />
              ))}
            </div>
          </div>

          <header data-agency="header" className="shell flex flex-col items-center gap-2">
            <p className="text-eyebrow leading-none font-bold text-blush uppercase">{eyebrow}</p>
            <h2
              id={`${id}-heading`}
              className="max-w-[20ch] font-display text-section leading-[0.99] break-words text-balance text-grape uppercase"
            >
              {heading}
            </h2>
          </header>

          {/* The cards' home in the layout; with motion they are posed from
              here into the folder and out into the scatter. */}
          <div className="shell mt-[clamp(1.5rem,4vh,3rem)]">
            <ul
              data-agency="grid"
              aria-label="Clients we work with"
              className="relative z-10 flex flex-wrap items-center justify-center gap-x-[clamp(1rem,2.5vw,3rem)] gap-y-[clamp(1.25rem,2.5vw,3rem)]"
            >
              {clients.map((client) => (
                <ClientCard key={client.name} client={client} data-agency="card" />
              ))}
            </ul>
          </div>

          {/*
            The dock: paragraph | folder | button from lg (at md the folder left the paragraph a
            one-word column), stacked
            above the folder on narrow ones. None of these wrappers is
            positioned, so the folder's back (z-0) and frosted front (z-20)
            still interleave with the cards and copy (z-10) at stage level.
          */}
          <div className="shell mt-auto flex flex-col items-center gap-[clamp(1rem,2.5vw,2rem)] motion-reduce:mt-0 lg:flex-row lg:justify-center lg:gap-[clamp(1.5rem,3vw,3.5rem)]">
            {copy ? (
              <div
                data-agency="copy"
                className="relative z-10 order-1 max-w-[40rem] text-center lg:max-w-[26rem] lg:flex-1 lg:text-right"
              >
                <p className="text-body leading-[1.64] text-ink capitalize">
                  {words.map((word, i) => (
                    <Fragment key={i}>
                      <span className="inline-block overflow-hidden align-bottom">
                        <span data-agency="word-out" className="inline-block">
                          <span data-agency="word" className="inline-block">
                            {word}
                          </span>
                        </span>
                      </span>{" "}
                    </Fragment>
                  ))}
                </p>
              </div>
            ) : null}

            <div
              data-agency="folder"
              className="relative order-3 aspect-[334/289] w-[min(70vw,21rem)] shrink-0 lg:order-2"
            >
              <div data-agency="folder-layer" aria-hidden className="absolute inset-0 z-0">
                <Image
                  src="/icons/folder-body-shadow.svg"
                  alt=""
                  width={334}
                  height={289}
                  className="h-full w-full"
                />
              </div>

              <div data-agency="folder-layer" className="absolute inset-0 z-20">
                <svg aria-hidden focusable="false" width="0" height="0" className="absolute">
                  <defs>
                    <clipPath id={`${id}-folder-front`} clipPathUnits="objectBoundingBox">
                      <path d={FOLDER_FRONT_PATH} transform={`scale(${1 / 309.271} ${1 / 197})`} />
                    </clipPath>
                  </defs>
                </svg>
                {/* Frosted glass: blurs whatever part of the pile sits behind it. */}
                <div
                  aria-hidden
                  className="absolute inset-x-[3.5%] bottom-0 h-[68.2%] bg-gradient-to-b from-white/20 to-[#e8e8e8]/20 backdrop-blur-md"
                  style={{ clipPath: `url(#${id}-folder-front)` }}
                />
                <span className="absolute inset-x-0 bottom-[8%] flex justify-center">
                  <BrandLogo className="w-[clamp(5rem,8vw,8.5rem)]" />
                </span>
              </div>

              {/* The folder's pop on the way out: a ring and confetti, hidden
                  until then (driven by the exit timeline). */}
              {exit ? (
                <div data-agency="pop" aria-hidden className="pointer-events-none absolute inset-0 z-30">
                  <span
                    data-agency="pop-ring"
                    className="absolute top-1/2 left-1/2 -mt-[45%] -ml-[45%] aspect-square w-[90%] rounded-full border-[6px] border-solid border-blush opacity-0"
                  />
                  {Array.from({ length: POP_PIECES }, (_, i) => (
                    <span
                      key={i}
                      data-agency="pop-piece"
                      className={`absolute top-1/2 left-1/2 opacity-0 ${POP_TONES[i % POP_TONES.length]} ${
                        i % 2 ? "-mt-1 -ml-2.5 h-2 w-5 rounded-sm" : "-mt-2 -ml-2 size-4 rounded-full"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {cta ? (
              <div className="order-2 flex justify-center lg:order-3 lg:max-w-[26rem] lg:flex-1 lg:justify-start">
                <div data-agency="cta-out" className="relative z-10">
                  <div data-agency="cta">
                    <PopButton href={cta.href} label={cta.label} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
