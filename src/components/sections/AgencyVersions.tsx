"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Fragment, useRef } from "react";

import BrandLogo from "@/components/ui/BrandLogo";
import ClientCard from "@/components/ui/ClientCard";
import PopButton from "@/components/ui/PopButton";
import type { AgencyVersion } from "@/components/sections/agency-versions";
import { clients } from "@/lib/site-content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * TEMPORARY: the Agency section's animation versions (V1–V4), compared via
 * `?agency=`. Every version opens on the same frame as the original — the
 * headline over the frosted folder with the client cards stuffed in it — and
 * differs in how the cards get out. All of them end on the same layout: a
 * compact headline, the logo wall, and the folder docked at the bottom with
 * the paragraph on one side and the case-studies button on the other, both
 * coming out of the section's own animation instead of trailing after it.
 */

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
const WORDS = COPY.split(" ");

/* The opening pile — identical to the original section. */
const PILE_COLUMNS = [-0.31, 0, 0.31];
const PILE_TOP = -0.12;
const PILE_ROW_STEP = 0.14;
const PILE_JITTER = [
  { x: 0.02, r: -6 },
  { x: -0.03, r: 4 },
  { x: 0.01, r: 9 },
  { x: -0.02, r: -3 },
  { x: 0.03, r: 7 },
  { x: -0.01, r: -8 },
];
const PILE_CARD_WIDTH = 0.36;
const FOLDER_START_SCALE = 1.25;
const FOLDER_END_VISIBLE = 0.97;

/** Confetti for V3's blast. */
const BLAST_PIECES = 18;
const BLAST_TONES = ["bg-blush", "bg-lagoon", "bg-sunbeam", "bg-grape"];

/** Stable pseudo-random 0–1 per index. */
const rand = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** 0 → 1 → 0 over the first `w` of a 0–1 progress. */
const bump = (a: number, w = 1) => (a > 0 && a < w ? Math.sin((Math.PI * a) / w) : 0);
const sineInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * A card's pose in stage coordinates: its centre, its displayed size as a
 * multiple of its natural size, and its tilt. Converted to the card's own
 * transform (inside the scaled grid) by `setCard`.
 */
type Pose = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  rotationY?: number;
  sx?: number;
  sy?: number;
};
type FolderPose = { x: number; y: number; scale: number; sx: number; sy: number; rotation: number };

const mix = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  scale: lerp(a.scale, b.scale, t),
  rotation: lerp(a.rotation, b.rotation, t),
  rotationY: lerp(a.rotationY ?? 0, b.rotationY ?? 0, t),
});

type Layout = ReturnType<typeof measureLayout>;

/** Offset metrics only, so it can be re-measured mid-animation. */
function measureLayout(stage: HTMLElement) {
  const $ = (key: string) => stage.querySelector<HTMLElement>(`[data-agency='${key}']`)!;
  const header = $("header");
  const grid = $("grid");
  const folder = $("folder");
  const copy = $("copy");
  const cta = $("cta");
  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-agency='card']"));

  const stageW = stage.clientWidth;
  const stageH = stage.clientHeight;
  const topPad = parseFloat(getComputedStyle(stage).paddingTop) || 0;
  const headerBottom = header.offsetTop + header.offsetHeight;
  const W = folder.offsetWidth;
  const H = folder.offsetHeight;

  // Opening frame — as in the original.
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
  const gridTop = header.offsetTop + header.offsetHeight * headerScale + 0.03 * stageH;
  const dockTop = Math.min(folderEndTop + 0.08 * H, copy.offsetTop + shift, cta.offsetTop + shift);
  const gridScale = Math.min(1, (dockTop - 0.03 * stageH - gridTop) / grid.offsetHeight);
  const gridY = gridTop - grid.offsetTop;
  const gridLeft = grid.offsetLeft;
  const ox = grid.offsetWidth / 2;

  const cardW = cards[0]?.offsetWidth ?? 160;
  const cardH = cards[0]?.offsetHeight ?? 100;

  const geo = cards.map((card, i) => {
    const cx = card.offsetLeft + card.offsetWidth / 2;
    const cy = card.offsetTop + card.offsetHeight / 2;
    const jitter = PILE_JITTER[i % PILE_JITTER.length];
    const col = PILE_COLUMNS[i % PILE_COLUMNS.length];
    const row = Math.floor(i / PILE_COLUMNS.length);
    const pile: Pose = {
      x: folderCx + (col + jitter.x) * W * startScale,
      y: folderStartTop + (PILE_TOP + row * PILE_ROW_STEP) * H * startScale,
      scale: (PILE_CARD_WIDTH * W * startScale) / card.offsetWidth,
      rotation: jitter.r,
    };
    const slot: Pose = {
      x: gridLeft + ox + gridScale * (cx - ox),
      y: gridTop + gridScale * cy,
      scale: gridScale,
      rotation: 0,
    };
    return { cx, cy, pile, slot };
  });

  // V2: the hand of cards, fanned over the folder under the headline.
  const fanScale = 0.8;
  const fanR = Math.min(0.4 * stageH, (stageW / 2 - 0.45 * cardW * fanScale) / 0.87);
  const fanTop = topPad + header.offsetHeight * headerScale + 0.04 * stageH + (cardH * fanScale) / 2;
  const fanPivotY = fanTop + fanR;
  const deckY = folderStartTop - cardH * fanScale * 0.25;

  // V3: where the blast throws each card — a loose ring filling the screen.
  const scatter: Pose[] = cards.map((_, i) => {
    const angle = (i / cards.length) * Math.PI * 2 + rand(i, 1) * 0.6 - Math.PI / 2;
    const reach = 0.7 + 0.3 * rand(i, 2);
    return {
      x: stageW / 2 + Math.cos(angle) * 0.42 * stageW * reach,
      y: stageH * 0.45 + Math.sin(angle) * 0.36 * stageH * reach,
      scale: Math.max(gridScale, 0.5) * (0.9 + 0.4 * rand(i, 3)),
      rotation: (rand(i, 4) - 0.5) * 540,
    };
  });

  const centre = (el: HTMLElement) => ({
    x: el.offsetLeft + el.offsetWidth / 2,
    y: el.offsetTop + el.offsetHeight / 2,
  });

  return {
    stageW,
    stageH,
    W,
    H,
    startScale,
    folderCx,
    folderStartY,
    folderEndY,
    folderEndTop,
    shift,
    headerScale,
    gridTop,
    gridY,
    gridScale,
    gridLeft,
    ox,
    cards: geo,
    fanScale,
    fanR,
    fanPivotY,
    deckY,
    scatter,
    /** Inside the docked folder, behind its frosted front. */
    mouth: { x: folderCx, y: folderEndTop + 0.5 * H },
    copy: centre(copy),
    cta: centre(cta),
  };
}

type Proxies = Record<string, number>;
type Kit = {
  tl: gsap.core.Timeline;
  /** Per-card progress values, and section-wide ones (`move` = folder docking). */
  P: Proxies[];
  G: Proxies;
  /** Tweens `target[key]` 0 → 1 on the timeline; the poses are derived from it. */
  drive: (target: Proxies, key: string, at: number, duration: number, ease?: string) => void;
  q: (selector: string) => Element[];
  L: () => Layout;
};
type Choreo = {
  build: (kit: Kit) => void;
  card: (i: number, p: Proxies, g: Proxies, L: Layout) => Pose;
  folder?: (base: FolderPose, g: Proxies, P: Proxies[], L: Layout) => FolderPose;
};

/* ── Shared beats ─────────────────────────────────────────────────────────── */

/** Something springing out of the docked folder's mouth into its place. */
function outOfFolder(
  { tl, L }: Kit,
  el: Element,
  of: "copy" | "cta",
  at: number,
  duration: number,
  ease: string,
  from: gsap.TweenVars = {},
  to: gsap.TweenVars = {},
) {
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, ease: "none" }, at).fromTo(
    el,
    {
      x: () => L().mouth.x - L()[of].x,
      y: () => L().mouth.y - L()[of].y,
      scale: 0.3,
      rotation: -20,
      ...from,
    },
    { x: 0, y: () => L().shift, scale: 1, rotation: 0, duration, ease, immediateRender: false, ...to },
    at,
  );
}

function linesAndDwell({ tl, q }: Kit, at: number) {
  tl.fromTo(q("[data-agency='lines']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "none" }, at).to(
    {},
    { duration: 0.8 },
  );
}

/* ── V1 Popcorn: the cards pop out one at a time, arcing high and landing
       with a squash; the folder kicks with every pop. The paragraph rises in
       word by word and the button pops out of the folder last. ─────────── */

const popcorn: Choreo = {
  build(kit) {
    const { tl, P, G, drive, q } = kit;
    P.forEach((p, i) => {
      const t = 0.5 + i * 0.2;
      drive(p, "fly", t, 0.9);
      drive(p, "land", t + 0.9, 0.3);
    });
    drive(G, "move", 4.3, 1, "power2.inOut");
    tl.fromTo(
      q("[data-agency='word']"),
      { yPercent: 110, rotation: 6 },
      { yPercent: 0, rotation: 0, duration: 0.5, stagger: 0.03, ease: "back.out(2)" },
      5.0,
    );
    drive(G, "spit", 5.4, 0.35);
    outOfFolder(kit, q("[data-agency='cta']")[0], "cta", 5.45, 0.7, "back.out(1.8)");
    linesAndDwell(kit, 5.4);
  },
  card(i, p, _g, L) {
    const c = L.cards[i];
    const a = p.fly;
    if (a <= 0) return c.pile;
    // A real throw: steady sideways, a parabola up and back down.
    const h = Math.max(0.2 * L.stageH, (c.pile.y - c.slot.y) * 0.5);
    const squash = p.land > 0 && p.land < 1 ? Math.sin(Math.PI * p.land) * (1 - p.land) : 0;
    return {
      x: lerp(c.pile.x, c.slot.x, a),
      y: lerp(c.pile.y, c.slot.y, a) - 4 * h * a * (1 - a),
      scale: lerp(c.pile.scale, c.slot.scale, a),
      rotation: lerp(c.pile.rotation, 0, a) + (i % 2 ? 360 : -360) * a,
      sx: 1 + 0.3 * squash,
      sy: 1 - 0.3 * squash,
    };
  },
  folder(base, g, P) {
    const kick = Math.max(bump(g.spit ?? 0), ...P.map((p) => bump(p.fly, 0.2)));
    return { ...base, sx: 1 + 0.07 * kick, sy: 1 - 0.1 * kick };
  },
};

/* ── V2 Fan & deal: the whole stack rises out of the folder, fans open like a
       hand of cards, then each card flips as it's dealt to its slot. The
       paragraph wipes out from the folder's side; the button is dealt last,
       flipping out of the folder. ──────────────────────────────────────── */

const fanAndDeal: Choreo = {
  build(kit) {
    const { tl, P, G, drive, q } = kit;
    gsap.set([...q("[data-agency='card']"), ...q("[data-agency='cta']")], { transformPerspective: 900 });
    P.forEach((p, i) => {
      drive(p, "rise", 0.5 + i * 0.03, 0.8, "power2.inOut");
      drive(p, "deal", 2.7 + i * 0.13, 0.75, "power3.inOut");
    });
    drive(G, "fan", 1.5, 0.9, "back.out(1.3)");
    drive(G, "move", 2.8, 1, "power2.inOut");
    tl.fromTo(
      q("[data-agency='copy'] p"),
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.out" },
      5.0,
    );
    outOfFolder(kit, q("[data-agency='cta']")[0], "cta", 5.2, 0.7, "power3.out", { rotationY: -180, rotation: 0 }, { rotationY: 0 });
    linesAndDwell(kit, 5.2);
  },
  card(i, p, g, L) {
    const c = L.cards[i];
    const n = L.cards.length;
    const deck: Pose = {
      x: L.folderCx + (rand(i, 7) - 0.5) * 8,
      y: L.deckY,
      scale: L.fanScale,
      rotation: (rand(i, 8) - 0.5) * 6,
    };
    const angle = lerp(-60, 60, i / (n - 1));
    const rad = (angle * Math.PI) / 180;
    const fan: Pose = {
      x: L.folderCx + L.fanR * Math.sin(rad),
      y: L.fanPivotY - L.fanR * Math.cos(rad),
      scale: L.fanScale,
      rotation: angle,
    };
    if (p.deal > 0) {
      const pose = mix(fan, c.slot, p.deal);
      pose.y -= 0.1 * L.stageH * Math.sin(Math.PI * p.deal);
      pose.rotationY = 360 * p.deal;
      return pose;
    }
    if ((g.fan ?? 0) > 0) return mix(deck, fan, g.fan);
    return mix(c.pile, deck, p.rise);
  },
};

/* ── V3 Shake & blast: the stuffed folder trembles harder and harder,
       squashes — and bursts: a ring and confetti, every card blasted across
       the screen spinning. They hang there a beat, then snap into the wall
       on springs. The words pop in; the button bounces out of the folder. ── */

const shakeOffset = (k: number) => ({
  x: Math.sin(k * Math.PI * 20) * 12 * k * k,
  rotation: Math.sin(k * Math.PI * 16 + 1) * 4 * k * k,
});

const shakeAndBlast: Choreo = {
  build(kit) {
    const { tl, P, G, drive, q, L } = kit;
    drive(G, "shake", 0.6, 1.3);
    P.forEach((p, i) => {
      drive(p, "blast", 1.9 + i * 0.008, 0.5, "power4.out");
      drive(p, "home", 3.0 + rand(i, 5) * 0.9, 0.9, "elastic.out(1,0.55)");
    });
    drive(G, "recoil", 1.9, 0.6);
    drive(G, "drift", 2.4, 1.2, "sine.out");

    // The burst itself, from the folder's mouth.
    const ring = q("[data-agency='blast-ring']");
    const pieces = q("[data-agency='blast-piece']");
    const reach = () => L().W * L().startScale * 0.9;
    tl.set(ring, { scale: 0.2, autoAlpha: 1 }, 1.9)
      .to(ring, { scale: 3, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 1.9)
      .set(pieces, { x: 0, y: 0, rotation: 0, scale: 1.3, autoAlpha: 1 }, 1.9)
      .to(
        pieces,
        {
          x: (i) => Math.cos((i / pieces.length) * Math.PI * 2 + rand(i) * 0.5) * reach() * (0.6 + rand(i, 2) * 0.6),
          y: (i) =>
            Math.sin((i / pieces.length) * Math.PI * 2 + rand(i) * 0.5) * reach() * (0.6 + rand(i, 2) * 0.6) -
            reach() * 0.3,
          rotation: (i) => (rand(i, 3) - 0.5) * 720,
          scale: 0.3,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        1.9,
      );

    drive(G, "move", 3.5, 1, "power2.inOut");
    tl.fromTo(
      q("[data-agency='word']"),
      { scale: 0, rotation: -15, autoAlpha: 0 },
      { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.4, stagger: { each: 0.025, from: "random" }, ease: "back.out(3)" },
      4.6,
    );
    outOfFolder(kit, q("[data-agency='cta']")[0], "cta", 4.9, 0.9, "elastic.out(1,0.5)");
    linesAndDwell(kit, 4.9);
  },
  card(i, p, g, L) {
    const c = L.cards[i];
    const shake = shakeOffset(g.shake ?? 0);
    const pile = { ...c.pile, x: c.pile.x + shake.x, rotation: c.pile.rotation + shake.rotation };
    if (p.blast <= 0) return pile;
    const sc = L.scatter[i];
    const drift = g.drift ?? 0;
    const floating: Pose = {
      ...sc,
      y: sc.y - 0.05 * L.stageH * drift,
      rotation: sc.rotation + (i % 2 ? 14 : -14) * drift,
    };
    if (p.home > 0) return mix(floating, c.slot, p.home);
    return mix(pile, floating, p.blast);
  },
  folder(base, g) {
    const k = g.shake ?? 0;
    const shake = shakeOffset(k);
    const r = g.recoil ?? 0;
    let sx = 1;
    let sy = 1;
    if (r > 0) {
      // Released: it springs up and wobbles back.
      const w = Math.sin(r * Math.PI * 3) * (1 - r);
      sx = 1 - 0.1 * w;
      sy = 1 + 0.18 * w;
    } else {
      // Bracing: squashing down as the shaking peaks.
      const brace = clamp01((k - 0.75) / 0.25);
      sx = 1 + 0.08 * brace;
      sy = 1 - 0.12 * brace;
    }
    return { ...base, x: shake.x, rotation: shake.rotation, sx, sy };
  },
};

/* ── V4 Tornado: the cards spiral up out of the folder one after another,
       swirling round in a vortex before peeling off to their slots while the
       folder sways. Then the folder hands out the paragraph to one side and
       the button to the other. ─────────────────────────────────────────── */

const tornado: Choreo = {
  build(kit) {
    const { P, G, drive, q } = kit;
    P.forEach((p, i) => drive(p, "swirl", 0.5 + i * 0.13, 1.7));
    drive(G, "sway", 0.5, 3.8);
    drive(G, "move", 3.9, 0.9, "power2.inOut");
    outOfFolder(kit, q("[data-agency='copy']")[0], "copy", 4.7, 0.8, "back.out(1.4)", { rotation: 8 });
    outOfFolder(kit, q("[data-agency='cta']")[0], "cta", 4.95, 0.75, "back.out(1.8)");
    linesAndDwell(kit, 5.0);
  },
  card(i, p, _g, L) {
    const c = L.cards[i];
    const a = p.swirl;
    if (a <= 0) return c.pile;
    const pose = mix(c.pile, c.slot, sineInOut(a));
    const amp = Math.sin(Math.PI * a);
    const theta = i * 0.75 + Math.PI * 2 * 1.4 * a;
    pose.x += 0.3 * L.stageW * amp * Math.cos(theta);
    pose.y += 0.12 * L.stageH * amp * Math.sin(theta) - 0.15 * L.stageH * amp;
    pose.rotation += 28 * amp * Math.sin(theta);
    // Bigger on the near side of the vortex.
    pose.scale *= 1 + 0.25 * amp * Math.sin(theta);
    return pose;
  },
  folder(base, g) {
    const s = g.sway ?? 0;
    const sway = Math.sin(Math.PI * s);
    return {
      ...base,
      rotation: 3 * Math.sin(s * Math.PI * 14) * sway,
      sy: 1 - 0.03 * sway * (0.5 + 0.5 * Math.sin(s * Math.PI * 28)),
    };
  },
};

const CHOREOS: Record<Exclude<AgencyVersion, "original">, Choreo> = {
  v1: popcorn,
  v2: fanAndDeal,
  v3: shakeAndBlast,
  v4: tornado,
};

type AgencyVersionsProps = { version: Exclude<AgencyVersion, "original"> };

export default function AgencyVersions({ version }: AgencyVersionsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const choreo = CHOREOS[version];
      const q = gsap.utils.selector(stage);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        let layout: Layout | null = null;
        const L = () => (layout ??= measureLayout(stage));
        const forget = () => {
          layout = null;
        };

        const cardEls = q("[data-agency='card']") as HTMLElement[];
        const folderLayers = q("[data-agency='folder-layer']");
        const grid = q("[data-agency='grid']")[0];
        const copy = q("[data-agency='copy']")[0];
        gsap.set(folderLayers, { transformOrigin: "50% 50%" });
        gsap.set(q("[data-agency='header']"), { transformOrigin: "50% 0%" });

        // Cards and folder are posed every frame from plain progress values,
        // so their paths (arcs, fans, spirals) are always worked out from the
        // current layout.
        const P: Proxies[] = cardEls.map(() => ({}));
        const G: Proxies = {};

        const setCard = (el: HTMLElement, i: number, pose: Pose, l: Layout) => {
          const c = l.cards[i];
          const s = l.gridScale;
          const k = pose.scale / s;
          gsap.set(el, {
            x: l.ox + (pose.x - l.gridLeft - l.ox) / s - c.cx,
            y: (pose.y - l.gridTop) / s - c.cy,
            rotation: pose.rotation,
            rotationY: pose.rotationY ?? 0,
            scaleX: k * (pose.sx ?? 1),
            scaleY: k * (pose.sy ?? 1),
          });
        };
        const applyAll = () => {
          const l = L();
          cardEls.forEach((el, i) => setCard(el, i, choreo.card(i, P[i], G, l), l));
          const m = G.move ?? 0;
          const base: FolderPose = {
            x: 0,
            y: lerp(l.folderStartY, l.folderEndY, m),
            scale: lerp(l.startScale, 1, m),
            sx: 1,
            sy: 1,
            rotation: 0,
          };
          const f = choreo.folder ? choreo.folder(base, G, P, l) : base;
          gsap.set(folderLayers, {
            x: f.x,
            y: f.y,
            scaleX: f.scale * f.sx,
            scaleY: f.scale * f.sy,
            rotation: f.rotation,
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

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              const anim = self.animation;
              if (!anim) return;
              const progress = anim.progress();
              anim.progress(1, true).progress(progress, true);
              mark();
            },
          },
        });

        const drive: Kit["drive"] = (target, key, at, duration, ease = "none") => {
          target[key] = 0;
          tl.fromTo(target, { [key]: 0 }, { [key]: 1, duration, ease, onUpdate: mark }, at);
        };

        tl.fromTo(
          q("[data-agency='header']"),
          { scale: 1 },
          { scale: () => L().headerScale, duration: 0.8 },
          0,
        );
        choreo.build({ tl, P, G, drive, q, L });

        // The grid and the copy row are held where the closing frame needs
        // them; the cards travel inside the grid.
        const place = () => {
          const l = L();
          gsap.set(grid, { y: l.gridY, scale: l.gridScale, transformOrigin: "50% 0%" });
          if (version !== "v4") gsap.set(copy, { y: l.shift });
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
    },
    { scope: trackRef, dependencies: [version] },
  );

  return (
    <section id="agency" aria-labelledby="agency-heading">
      <div ref={trackRef} className="relative h-[420vh] motion-reduce:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 isolate flex h-svh flex-col items-center overflow-hidden pt-[clamp(1.5rem,4vh,3rem)] text-center motion-reduce:relative motion-reduce:h-auto motion-reduce:gap-[clamp(2rem,4vw,4.5rem)] motion-reduce:pb-[clamp(3rem,7vw,8rem)] [&>*]:shrink-0"
        >
          <div
            data-agency="lines"
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 flex items-end justify-center"
          >
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

          <header data-agency="header" className="shell flex flex-col items-center gap-2">
            <p className="text-eyebrow leading-none font-bold text-blush uppercase">The Agency</p>
            <h2
              id="agency-heading"
              className="max-w-[20ch] font-display text-section leading-[0.99] break-words text-balance text-grape uppercase"
            >
              Behind the Brands You Love
            </h2>
          </header>

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
            The dock: paragraph | folder | button on wide screens, stacked
            above the folder on narrow ones. None of these wrappers is
            positioned, so the folder's back (z-0) and frosted front (z-20)
            still interleave with the cards and copy (z-10) at stage level.
          */}
          <div className="shell mt-auto flex flex-col items-center gap-[clamp(1rem,2.5vw,2rem)] motion-reduce:mt-0 md:flex-row md:justify-center md:gap-[clamp(1.5rem,3vw,3.5rem)]">
            <div data-agency="copy" className="relative z-10 order-1 max-w-[40rem] md:max-w-[26rem] md:flex-1 md:text-right">
              <p className="text-body leading-[1.64] text-ink capitalize">
                {WORDS.map((word, i) => (
                  <Fragment key={i}>
                    <span className={`inline-block align-bottom ${version === "v1" ? "overflow-hidden" : ""}`}>
                      <span data-agency="word" className="inline-block">
                        {word}
                      </span>
                    </span>{" "}
                  </Fragment>
                ))}
              </p>
            </div>

            <div
              data-agency="folder"
              className="relative order-3 aspect-[334/289] w-[min(70vw,21rem)] shrink-0 md:order-2"
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
                    <clipPath id="agency-folder-front-v" clipPathUnits="objectBoundingBox">
                      <path d={FOLDER_FRONT_PATH} transform={`scale(${1 / 309.271} ${1 / 197})`} />
                    </clipPath>
                  </defs>
                </svg>
                <div
                  aria-hidden
                  className="absolute inset-x-[3.5%] bottom-0 h-[68.2%] bg-gradient-to-b from-white/20 to-[#e8e8e8]/20 backdrop-blur-md"
                  style={{ clipPath: "url(#agency-folder-front-v)" }}
                />
                <span className="absolute inset-x-0 bottom-[8%] flex justify-center">
                  <BrandLogo className="w-[clamp(5rem,8vw,8.5rem)]" />
                </span>

                {version === "v3" ? (
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[22%]">
                    <span
                      data-agency="blast-ring"
                      className="absolute left-1/2 -mt-[30%] -ml-[30%] aspect-square w-[60%] rounded-full border-[6px] border-solid border-blush opacity-0"
                    />
                    {Array.from({ length: BLAST_PIECES }, (_, i) => (
                      <span
                        key={i}
                        data-agency="blast-piece"
                        className={`absolute left-1/2 opacity-0 ${BLAST_TONES[i % BLAST_TONES.length]} ${
                          i % 2 ? "-mt-1 -ml-2.5 h-2 w-5 rounded-sm" : "-mt-2 -ml-2 size-4 rounded-full"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="order-2 flex justify-center md:order-3 md:max-w-[26rem] md:flex-1 md:justify-start">
              <div data-agency="cta" className="relative z-10">
                <PopButton href="#contact" label="View Our Case Studies" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
