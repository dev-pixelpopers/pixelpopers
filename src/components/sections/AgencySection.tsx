"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

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
/** Fraction of the folder left on screen at the end of the hold. */
const FOLDER_END_VISIBLE = 0.97;

type Layout = ReturnType<typeof measureLayout>;

/**
 * All geometry comes from offset* metrics, which ignore transforms, so it can
 * be re-measured at any scroll position without first undoing the animation.
 */
function measureLayout(stage: HTMLElement) {
  const header = stage.querySelector<HTMLElement>("[data-agency='header']")!;
  const grid = stage.querySelector<HTMLElement>("[data-agency='grid']")!;
  const folder = stage.querySelector<HTMLElement>("[data-agency='folder']")!;
  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-agency='card']"));

  const stageH = stage.clientHeight;
  const topPad = parseFloat(getComputedStyle(stage).paddingTop) || 0;
  const headerBottom = header.offsetTop + header.offsetHeight;
  const W = folder.offsetWidth;
  const H = folder.offsetHeight;

  // Opening frame: the folder sits under the headline with room above it for
  // the top of the pile, shrunk if the viewport is too short to fit it.
  const startScale = gsap.utils.clamp(
    0.6,
    FOLDER_START_SCALE,
    (0.96 * stageH - headerBottom) / (1.45 * H),
  );
  const folderStartY =
    headerBottom + 0.45 * H * startScale + (H * startScale) / 2 - (folder.offsetTop + H / 2);

  // Closing frame: folder parked at the bottom, grid lifted into the space
  // the headline vacated and scaled down if it would otherwise collide.
  const folderEndTop = stageH - FOLDER_END_VISIBLE * H;
  const folderEndY = folderEndTop - folder.offsetTop;
  const gridEndY = topPad - grid.offsetTop;
  const gridRoom = folderEndTop + 0.1 * H - topPad - 0.03 * stageH;
  const gridEndScale = Math.min(1, gridRoom / grid.offsetHeight);

  const folderCx = folder.offsetLeft + W / 2;
  const folderStartTop = folder.offsetTop + H / 2 + folderStartY - (H * startScale) / 2;

  const pile = cards.map((card, i) => {
    const jitter = PILE_JITTER[i % PILE_JITTER.length];
    const col = PILE_COLUMNS[i % PILE_COLUMNS.length];
    const row = Math.floor(i / PILE_COLUMNS.length);
    const slotX = folderCx + (col + jitter.x) * W * startScale;
    const slotY = folderStartTop + (PILE_TOP + row * PILE_ROW_STEP) * H * startScale;
    const cardCx = grid.offsetLeft + card.offsetLeft + card.offsetWidth / 2;
    const cardCy = grid.offsetTop + card.offsetTop + card.offsetHeight / 2;
    return {
      x: slotX - cardCx,
      y: slotY - cardCy,
      scale: (PILE_CARD_WIDTH * W * startScale) / card.offsetWidth,
      rotation: jitter.r,
    };
  });

  return {
    headerExitY: -(headerBottom + 40),
    startScale,
    folderStartY,
    folderEndY,
    gridEndY,
    gridEndScale,
    pile,
  };
}

/**
 * Opening frame: headline over a frosted folder stuffed with client cards.
 * The stage then holds (CSS sticky) while the headline rises off screen, the
 * folder sinks to the bottom and every card flies out to its slot in the
 * logo wall. Once the wall has settled the page carries on.
 */
export default function AgencySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Measured lazily and dropped on every refresh, so a resize re-derives
        // the whole choreography from the new layout.
        let layout: Layout | null = null;
        const get = () => (layout ??= measureLayout(stage));
        const forget = () => {
          layout = null;
        };
        ScrollTrigger.addEventListener("refreshInit", forget);

        const folderLayers = "[data-agency='folder-layer']";
        const cards = "[data-agency='card']";

        // Both folder layers share the folder's box, so identical transforms
        // keep them locked together while the cards slot in between them.
        gsap.set(folderLayers, { transformOrigin: "50% 50%" });
        gsap.set("[data-agency='grid']", { transformOrigin: "50% 0%" });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top top",
            // The pin is CSS `sticky`; ScrollTrigger only reports progress.
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          "[data-agency='header']",
          { y: 0, autoAlpha: 1 },
          { y: () => get().headerExitY, autoAlpha: 0, duration: 1.2, ease: "power2.in" },
          0,
        )
          .fromTo(
            folderLayers,
            { y: () => get().folderStartY, scale: () => get().startScale },
            { y: () => get().folderEndY, scale: 1, duration: 2.2 },
            0.2,
          )
          .fromTo(
            "[data-agency='grid']",
            { y: 0, scale: 1 },
            { y: () => get().gridEndY, scale: () => get().gridEndScale, duration: 2.2 },
            0.2,
          )
          .fromTo(
            cards,
            {
              x: (i) => get().pile[i].x,
              y: (i) => get().pile[i].y,
              scale: (i) => get().pile[i].scale,
              rotation: (i) => get().pile[i].rotation,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 1.6,
              ease: "power3.inOut",
              // Top of the pile leaves first, the buried cards follow.
              stagger: { each: 0.05 },
            },
            0.4,
          )
          .fromTo(
            "[data-agency='lines']",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.8, ease: "none" },
            2,
          )
          // Dwell on the finished wall before the page releases.
          .to({}, { duration: 0.8 });

        return () => ScrollTrigger.removeEventListener("refreshInit", forget);
      });
    },
    { scope: trackRef },
  );

  return (
    <section id="agency" aria-labelledby="agency-heading">
      <div ref={trackRef} className="relative h-[320vh] motion-reduce:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 isolate flex h-svh flex-col items-center overflow-hidden pt-[clamp(1.5rem,4vh,3rem)] text-center motion-reduce:relative motion-reduce:h-auto motion-reduce:gap-[clamp(2rem,4vw,4.5rem)] [&>*]:shrink-0"
        >
          {/* Decorative hairlines fanning out from the folder. */}
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
            The folder box itself is never transformed, so it creates no
            stacking context: its back layer (z-0) and frosted front (z-20)
            interleave with the card grid (z-10) at stage level.
          */}
          <div
            data-agency="folder"
            className="relative mt-auto aspect-[334/289] w-[min(70%,21rem)] motion-reduce:mt-0"
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
                  <clipPath id="agency-folder-front" clipPathUnits="objectBoundingBox">
                    <path d={FOLDER_FRONT_PATH} transform={`scale(${1 / 309.271} ${1 / 197})`} />
                  </clipPath>
                </defs>
              </svg>
              {/* Frosted glass: blurs whatever part of the pile sits behind it. */}
              <div
                aria-hidden
                className="absolute inset-x-[3.5%] bottom-0 h-[68.2%] bg-gradient-to-b from-white/20 to-[#e8e8e8]/20 backdrop-blur-md"
                style={{ clipPath: "url(#agency-folder-front)" }}
              />
              <span className="absolute inset-x-0 bottom-[8%] flex justify-center">
                <BrandLogo className="w-[clamp(5rem,8vw,8.5rem)]" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col items-center gap-[clamp(2rem,4vw,4.5rem)] py-[clamp(3rem,7vw,8rem)] text-center">
        <p className="max-w-[40rem] text-body leading-[1.64] text-ink capitalize">
          We don’t just take on clients; we build long-term digital partnerships.
          Here are a few of the visionary companies we are proud to collaborate
          with every single day.
        </p>

        <PopButton href="#contact" label="View Our Case Studies" />
      </div>
    </section>
  );
}
