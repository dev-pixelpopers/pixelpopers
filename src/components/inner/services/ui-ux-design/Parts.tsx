import Image from "next/image";
import type { ReactNode } from "react";
import { owners } from "@/lib/site-content";

/*
  Building blocks for the UI/UX design-tool canvas page (Figma 367:78).
  Each mock is an `@container`, so the `cqw` values inside it are simply
  "Figma px ÷ the mock's Figma width × 100" and every mock scales as a unit.
*/

export const layer = "col-start-1 row-start-1 self-start justify-self-start";
export const cardShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.15)]";

/* ── Phone (400 × 820 in the hero, 380 × 780 in the wireframe section) ── */
export function Phone({
  children,
  frame = "bg-ink",
  screen = "",
  className = "",
}: {
  children?: ReactNode;
  frame?: string;
  screen?: string;
  className?: string;
}) {
  return (
    <div className={`@container aspect-[400/820] rounded-[14%/6.83%] shadow-[0_30px_60px_rgb(34_1_40/0.25)] ${frame} ${className}`}>
      <div className="grid h-full p-[3cqw]">
        <div className={`col-start-1 row-start-1 grid overflow-hidden rounded-[11cqw] ${screen}`}>{children}</div>
        <span className="col-start-1 row-start-1 mt-[2.5cqw] h-[6.5cqw] w-[27.5cqw] self-start justify-self-center rounded-full bg-ink" />
      </div>
    </div>
  );
}

export function PhoneShot({ src, w, h, alt, sizes }: { src: string; w: number; h: number; alt: string; sizes: string }) {
  return <Image src={src} alt={alt} width={w} height={h} sizes={sizes} className="h-full w-full object-cover" />;
}

/** Low-fi wireframe screen content. */
export function WireScreen() {
  const bar = "rounded-[1.6cqw] bg-[#c9c2cc]";
  const block = "rounded-[3.16cqw] bg-[#e8e3ea]";
  return (
    <div className="flex h-full flex-col bg-white px-[6.3cqw] pt-[15.3cqw]">
      <span className={`h-[7.37cqw] ${bar}`} />
      <span className={`mt-[5.8cqw] h-[52.6cqw] ${block}`} />
      <span className="mt-[6.3cqw] h-[4.2cqw] w-[68.4cqw] rounded-full bg-[#c9c2cc]" />
      <span className="mt-[4.2cqw] h-[4.2cqw] w-[79cqw] rounded-full bg-[#c9c2cc]" />
      <span className="mt-[4.2cqw] h-[4.2cqw] w-[52.6cqw] rounded-full bg-[#c9c2cc]" />
      <span className="mt-[7.4cqw] grid grid-cols-2 gap-[4.2cqw]">
        <span className={`h-[31.6cqw] ${block}`} />
        <span className={`h-[31.6cqw] ${block}`} />
      </span>
      <span className="mt-[7.4cqw] h-[13.7cqw] rounded-full border-[0.79cqw] border-[#c9c2cc]" />
      <span className={`mt-[12.6cqw] h-[12.6cqw] rounded-[3.16cqw] bg-[#c9c2cc]`} />
    </div>
  );
}

/** Four white handles on the corners of a selection box (sits inside a single-cell grid). */
export function Handles({ border }: { border: string }) {
  const h = `col-start-1 row-start-1 size-3 border-2 bg-white ${border}`;
  return (
    <>
      <span aria-hidden className={`${h} -mt-2 -ml-2 self-start justify-self-start`} />
      <span aria-hidden className={`${h} -mt-2 -mr-2 self-start justify-self-end`} />
      <span aria-hidden className={`${h} -mb-2 -ml-2 self-end justify-self-start`} />
      <span aria-hidden className={`${h} -mr-2 -mb-2 self-end justify-self-end`} />
    </>
  );
}

/** Multiplayer cursor arrow (26 × 38). */
export function Cursor({ fill, className = "" }: { fill: string; className?: string }) {
  return (
    <svg viewBox="0 0 26 38" aria-hidden className={className}>
      <path d="M2 2v30l8-7.5 5.5 11.5 5-2.4-5.4-11.1H24L2 2Z" fill={fill} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Component library (9 cells, each 490 × 220 in Figma) ──────────── */
function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="@container aspect-[490/220] rounded-[clamp(0.875rem,1.04vw,1.25rem)] bg-paper">
      <div className="flex h-full flex-col px-[4.08cqw] pt-[3.27cqw]">
        <h3 className="font-display text-[max(0.5625rem,2.65cqw)] leading-tight text-grape/70 uppercase">{label}</h3>
        {children}
      </div>
    </li>
  );
}

const pill = "grid place-items-center rounded-full font-haas leading-none";

export function ComponentLibrary() {
  return (
    <div data-reveal className={`rounded-[clamp(1.5rem,2.08vw,2.5rem)] bg-white p-[clamp(1rem,2.08vw,2.5rem)] ${cardShadow}`}>
      <ul aria-label="Component library" className="grid gap-[clamp(0.75rem,1.04vw,1.25rem)] md:grid-cols-2 lg:grid-cols-3">
        <Cell label="Button / Primary · Secondary · Ghost">
          <div className="mt-[7.55cqw] flex items-center gap-[2.86cqw] text-[3.67cqw]">
            <span className={`${pill} h-[11.4cqw] w-[36.7cqw] bg-blush text-white`}>Get started</span>
            <span className={`${pill} h-[11.4cqw] w-[30.6cqw] border-[0.41cqw] border-grape text-grape`}>Learn more</span>
            <span className="ml-[0.8cqw] font-haas text-ink/60">Skip →</span>
          </div>
          <span className={`${pill} mt-[4.08cqw] h-[11.4cqw] w-[36.7cqw] bg-blush/50 text-[3.67cqw] text-white`}>Disabled</span>
        </Cell>

        <Cell label="Input / Default · Focused">
          <span className="mt-[3.06cqw] font-haas text-[2.86cqw] text-ink/70">Email</span>
          <span className="mt-[1.43cqw] flex h-[10.6cqw] items-center rounded-[2.86cqw] border border-[#d9d2dc] bg-white px-[4.08cqw] font-copy text-[3.47cqw] text-ink/45">you@brand.com</span>
          <span className="mt-[3.67cqw] flex h-[10.6cqw] items-center rounded-[2.86cqw] border-[0.41cqw] border-lagoon bg-white px-[4.08cqw] font-copy text-[3.47cqw] text-ink">
            barry@pixelpopers.com<span className="ml-px h-[4cqw] w-px animate-pulse bg-ink" />
          </span>
        </Cell>

        <Cell label="Toggle · Checkbox · Radio">
          <div className="mt-[7.55cqw] flex gap-[4.08cqw]">
            <span className="flex h-[9cqw] w-[16.3cqw] items-center justify-end rounded-full bg-blush p-[0.82cqw]">
              <span className="size-[7.35cqw] rounded-full bg-white" />
            </span>
            <span className="flex h-[9cqw] w-[16.3cqw] items-center rounded-full bg-[#d9d2dc] p-[0.82cqw]">
              <span className="size-[7.35cqw] rounded-full bg-white" />
            </span>
          </div>
          <div className="mt-[5.3cqw] flex items-center font-copy text-[3.47cqw] font-medium text-ink">
            <span className="grid size-[7.35cqw] place-items-center rounded-[2cqw] bg-grape font-haas text-[4.08cqw] text-white">✓</span>
            <span className="ml-[2.45cqw] w-[38.4cqw]">Remember me</span>
            <span className="grid size-[7.35cqw] place-items-center rounded-full bg-lagoon">
              <span className="size-[3.27cqw] rounded-full bg-white" />
            </span>
            <span className="ml-[2.45cqw]">Monthly</span>
          </div>
        </Cell>

        <Cell label="Tags / Chips">
          <div className="mt-[9.6cqw] flex gap-[2.45cqw] text-[3.06cqw]">
            <span className={`${pill} h-[8.16cqw] w-[15.5cqw] bg-blush text-white`}>New</span>
            <span className={`${pill} h-[8.16cqw] w-[25.3cqw] bg-lagoon text-white`}>Popular</span>
            <span className={`${pill} h-[8.16cqw] w-[18cqw] bg-sunbeam text-ink`}>Sale</span>
            <span className={`${pill} h-[8.16cqw] w-[18cqw] bg-grape text-white`}>Beta</span>
          </div>
        </Cell>

        <Cell label="Avatar group">
          <div className="mt-[7.55cqw] flex">
            {owners.map((o, i) => (
              <Image
                key={o.name}
                src={o.avatar}
                alt={o.name}
                width={118}
                height={118}
                className={`size-[14.7cqw] rounded-full border-[0.82cqw] border-white ${["bg-sunbeam", "bg-lagoon", "bg-blush"][i]} ${i ? "-ml-[4.9cqw]" : ""}`}
              />
            ))}
            <span className={`${pill} -ml-[4.9cqw] size-[14.7cqw] bg-grape text-[3.67cqw] text-white`}>+12</span>
          </div>
        </Cell>

        <Cell label="Slider · Progress">
          <div className="mt-[9.2cqw] grid w-[89.8cqw]">
            <span className="col-start-1 row-start-1 h-[1.63cqw] self-center rounded-full bg-[#d9d2dc]" />
            <span className="col-start-1 row-start-1 h-[1.63cqw] w-[63.6%] self-center rounded-full bg-blush" />
            <span className="col-start-1 row-start-1 ml-[60%] size-[6.53cqw] self-center rounded-full border-[0.82cqw] border-blush bg-white" />
          </div>
          <span className="mt-[2.5cqw] w-[89.8cqw] text-right font-haas text-[3.06cqw] text-ink">75%</span>
          <span className="mt-[1.6cqw] grid h-[2.86cqw] w-[89.8cqw] rounded-full bg-[#d9d2dc]">
            <span className="w-3/4 rounded-full bg-lagoon" />
          </span>
        </Cell>

        <Cell label="Tooltip">
          <span className="mt-[7.6cqw] flex h-[11.4cqw] w-[51cqw] items-center rounded-[2.45cqw] bg-ink px-[3.67cqw] font-copy text-[3.27cqw] font-medium text-white">
            Saved to favourites ✓
          </span>
          <span className="ml-[12.2cqw] h-[2.45cqw] w-[4.08cqw] bg-ink [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <span className="mt-[2.45cqw] ml-[8.2cqw] grid size-[9.8cqw] place-items-center rounded-full bg-blush font-haas text-[4.5cqw] text-white">♥</span>
        </Cell>

        <Cell label="Card / Product">
          <div className="mt-[3.47cqw] flex gap-[4.08cqw]">
            <Image
              src="/assets/inner/brand-identity/fifth-sip-packaging.webp"
              alt="Fifth Sip coffee beans product shot"
              width={980}
              height={640}
              sizes="10vw"
              className="size-[30.6cqw] rounded-[3.27cqw] object-cover"
            />
            <div className="flex grow flex-col pt-[2.86cqw]">
              <span className="font-haas text-[4.08cqw] text-ink">Fifth Sip Beans</span>
              <span className="mt-[1.4cqw] font-copy text-[3.27cqw] text-ink/60">Medium roast · 250g</span>
              <span className="mt-[3.5cqw] flex items-center justify-between">
                <span className="font-haas text-[5.3cqw] text-blush">$18</span>
                <span className={`${pill} h-[8.16cqw] w-[30.6cqw] bg-grape text-[3.06cqw] text-white`}>Add to bag</span>
              </span>
            </div>
          </div>
        </Cell>

        <Cell label="Tokens">
          <div className="mt-[4.9cqw] flex gap-[3.67cqw]">
            {[
              ["bg-blush", "pink"],
              ["bg-grape", "grape"],
              ["bg-lagoon", "fizz"],
              ["bg-sunbeam", "sunny"],
              ["bg-ink", "ink"],
            ].map(([bg, name]) => (
              <span key={name} className="flex flex-col gap-[2cqw]">
                <span className={`size-[14.7cqw] rounded-[3.27cqw] ${bg}`} />
                <span className="font-copy text-[2.86cqw] font-medium text-ink/70">{name}</span>
              </span>
            ))}
          </div>
          <span className="mt-[2.4cqw] font-haas text-[2.86cqw] text-grape">radius 8 · 16 · 28 · full</span>
        </Cell>
      </ul>
    </div>
  );
}

/* ── User flow board (1588 × 640) ─────────────────────────────────── */
const nodes = [
  { title: "Landing", sub: "Home page", cls: "bg-blush text-white", pos: "ml-[4.41%] mt-[17.51%] w-[13.85%]" },
  { title: "Log in", sub: "1 field + magic link", cls: "bg-lagoon text-white", pos: "ml-[45.97%] mt-[7.43%] w-[13.85%]" },
  { title: "Sign up", sub: "Email or Google", cls: "bg-lagoon text-white", pos: "ml-[45.97%] mt-[27.58%] w-[13.85%]" },
  { title: "Onboarding", sub: "3 quick questions", cls: "bg-lav text-white", pos: "ml-[64.86%] mt-[27.58%] w-[13.85%]" },
  { title: "Dashboard", sub: "Personalised home", cls: "bg-grape text-white", pos: "ml-[64.86%] mt-[7.43%] w-[13.85%]" },
  { title: "Aha! ✦", sub: "First win", cls: "border-[0.19cqw] border-[#2ec27e] bg-white text-ink", pos: "ml-[84.38%] mt-[7.43%] w-[11.34%]" },
];

export function FlowBoard() {
  return (
    <>
      {/* Desktop board: a FigJam-style canvas. */}
      <figure
        data-reveal
        className={`@container hidden aspect-[1588/640] grid-cols-1 overflow-hidden rounded-[clamp(1.75rem,2.08vw,2.5rem)] bg-white lg:grid ${cardShadow}`}
        style={{
          backgroundImage: "radial-gradient(circle, rgb(106 75 151 / 0.16) 1.5px, transparent 2px)",
          backgroundSize: "3.778% 9.375%",
          backgroundPosition: "1.9% 4.7%",
        }}
      >
        <svg viewBox="0 0 1588 640" aria-hidden data-draw className="col-start-1 row-start-1 h-full w-full">
          <g fill="none" stroke="#B5A7C4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M292 320H424" />
            <path d="M500 236V160H716" />
            <path d="M500 404V480H716" />
            <path d="M952 160H1016" />
            <path d="M952 480H1016" />
            <path d="M1140 436V216" />
            <path d="M1252 160H1326" />
          </g>
          <g fill="#B5A7C4">
            <path d="M437 320l-14-8v16z" />
            <path d="M730 160l-14-8v16z" />
            <path d="M730 480l-14-8v16z" />
            <path d="M1030 160l-14-8v16z" />
            <path d="M1030 480l-14-8v16z" />
            <path d="M1140 203l-8 14h16z" />
            <path d="M1340 160l-14-8v16z" />
          </g>
        </svg>

        <figcaption className={`${layer} mt-[1.89%] ml-[2.52%] font-display text-[0.88cqw] text-grape/70 uppercase`}>Flow 01 — first-time user</figcaption>

        <span aria-hidden className={`${layer} mt-[16.5%] ml-[27.83%] aspect-square w-[7.3%] rotate-45 rounded-[0.88cqw] bg-sunbeam shadow-[0_10px_24px_rgb(34_1_40/0.15)]`} />
        <span className={`${layer} relative mt-[18.77%] ml-[27.08%] w-[8.82%] text-center font-display text-[0.945cqw] leading-[1.45] text-ink uppercase`}>
          Has an
          <br />
          account?
        </span>
        <span className={`${layer} mt-[14.23%] ml-[32.37%] grid h-[1.76cqw] w-[3.53%] place-items-center rounded-full bg-[#2ec27e]/15 font-display text-[0.82cqw] text-[#2ec27e]`}>YES</span>
        <span className={`${layer} mt-[24.43%] ml-[32.37%] grid h-[1.76cqw] w-[3.53%] place-items-center rounded-full bg-blush/15 font-display text-[0.82cqw] text-blush`}>NO</span>

        {nodes.map((n) => (
          <div key={n.title} className={`${layer} ${n.pos} flex aspect-[220/84] flex-col items-center justify-center rounded-[1.26cqw] shadow-[0_10px_24px_rgb(34_1_40/0.15)] ${n.cls} ${n.title.startsWith("Aha") ? "aspect-[180/84]" : ""}`}>
            <span className="font-display text-[1.26cqw] leading-[1.25] uppercase">{n.title}</span>
            <span className="mt-[0.3cqw] font-copy text-[0.88cqw] font-medium opacity-80">{n.sub}</span>
          </div>
        ))}
        <span className={`${layer} mt-[13.6%] ml-[84.38%] flex w-[11.34%] justify-center font-display whitespace-nowrap text-[0.82cqw] text-blush`}>avg. 3 taps to first win</span>

        <div className="col-start-1 row-start-1 mb-[2cqw] flex items-center justify-between self-end px-[2.52cqw] pr-[9.2cqw] font-copy text-[0.945cqw] font-medium text-ink/70">
          <span className="flex items-center gap-[2.3cqw]">
            <span className="flex items-center gap-[0.63cqw]">
              <span className="size-[1.13cqw] rounded-[0.31cqw] bg-lagoon" /> Screen
            </span>
            <span className="flex items-center gap-[0.63cqw]">
              <span className="size-[1.13cqw] rotate-45 rounded-[0.13cqw] bg-sunbeam" /> Decision
            </span>
            <span className="flex items-center gap-[0.63cqw]">
              <span className="size-[1.13cqw] rounded-[0.13cqw] border-[0.13cqw] border-[#2ec27e] bg-white" /> Goal
            </span>
          </span>
          <span className="text-ink/50">Mapped in FigJam · tested with 5 users</span>
        </div>
      </figure>

      {/* Small screens: the same journey as a readable vertical flow. */}
      <ol data-reveal className={`rounded-[1.75rem] bg-white p-5 lg:hidden ${cardShadow}`}>
        <li className="font-display text-[0.75rem] text-grape/70 uppercase">Flow 01 — first-time user</li>
        <FlowStep {...nodes[0]} />
        <FlowArrow />
        <li className="mx-auto grid size-28 rotate-45 place-items-center rounded-xl bg-sunbeam">
          <span className="-rotate-45 text-center font-display text-[0.8125rem] leading-snug uppercase">
            Has an
            <br />
            account?
          </span>
        </li>
        <li className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <span className="mx-auto rounded-full bg-[#2ec27e]/15 px-3 py-1 font-display text-[0.6875rem] text-[#2ec27e]">YES</span>
            <FlowNode {...nodes[1]} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="mx-auto rounded-full bg-blush/15 px-3 py-1 font-display text-[0.6875rem] text-blush">NO</span>
            <FlowNode {...nodes[2]} />
            <span aria-hidden className="text-center text-[#B5A7C4]">↓</span>
            <FlowNode {...nodes[3]} />
          </div>
        </li>
        <FlowArrow />
        <FlowStep {...nodes[4]} />
        <FlowArrow />
        <FlowStep {...nodes[5]} />
        <li className="mt-2 text-center font-display text-[0.6875rem] text-blush">avg. 3 taps to first win</li>
      </ol>
    </>
  );
}

function FlowNode({ title, sub, cls }: { title: string; sub: string; cls: string }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl px-3 py-3.5 text-center shadow-[0_10px_24px_rgb(34_1_40/0.15)] ${cls.replace(/border-\[[^\]]+\]/, "border-2")}`}>
      <span className="font-display text-[0.9375rem] uppercase">{title}</span>
      <span className="mt-1 font-copy text-[0.75rem] font-medium opacity-80">{sub}</span>
    </div>
  );
}

function FlowStep(props: { title: string; sub: string; cls: string }) {
  return (
    <li className="mx-auto mt-4 w-full max-w-[14rem]">
      <FlowNode {...props} />
    </li>
  );
}

function FlowArrow() {
  return (
    <li aria-hidden className="mt-3 text-center text-[1.25rem] leading-none text-[#B5A7C4]">
      ↓
    </li>
  );
}

/* ── Process artboards (380 × 440) ─────────────────────────────────── */
export function ArtboardResearch() {
  const notes = [
    { t: "Users hate\nlong forms", c: "bg-sunbeam", p: "ml-[6.01%] mt-[12.36%] rotate-[6deg]" },
    { t: "Price is\nunclear", c: "bg-blush", p: "ml-[51.42%] mt-[14.12%] rotate-[-5deg]" },
    { t: "Love the\ncolours!", c: "bg-lagoon", p: "ml-[16.94%] mt-[51.3%] rotate-[-4deg]" },
    { t: "Where is\nsupport?", c: "bg-lav", p: "ml-[54.03%] mt-[59.14%] rotate-[4deg]" },
  ];
  return (
    <div className="grid h-full">
      {notes.map((n) => (
        <span key={n.t} className={`${layer} ${n.p} aspect-[140/130] w-[36.84%] rounded-[1.05cqw] px-[3.7cqw] pt-[4.2cqw] font-haas text-[4.2cqw] leading-[1.35] whitespace-pre-line text-ink shadow-[0_6px_14px_rgb(34_1_40/0.12)] ${n.c}`}>
          {n.t}
        </span>
      ))}
    </div>
  );
}

export function ArtboardWireframe() {
  const g = "bg-[#d9d2dc]";
  return (
    <div className="flex h-full flex-col p-[7.9cqw]">
      <span className={`h-[7.9cqw] rounded-[1.6cqw] ${g}`} />
      <span className={`mt-[5.26cqw] h-[31.6cqw] rounded-[2.6cqw] bg-[#d9d2dc]/60`} />
      <span className={`mt-[5.26cqw] h-[3.7cqw] w-[79cqw] rounded-full ${g}`} />
      <span className={`mt-[4.2cqw] h-[3.7cqw] w-[68.4cqw] rounded-full ${g}`} />
      <span className={`mt-[4.2cqw] h-[3.7cqw] w-[52.6cqw] rounded-full ${g}`} />
      <span className={`mt-[6.84cqw] h-[11.6cqw] w-[39.5cqw] rounded-full ${g}`} />
    </div>
  );
}

export function ArtboardDesign() {
  return (
    <div className="flex h-full flex-col p-[7.9cqw]">
      <span className="h-[7.9cqw] rounded-[1.6cqw] bg-grape" />
      <Image
        src="/assets/inner/ui-shop.webp"
        alt="Hi-fi e-commerce screens designed in Figma"
        width={1600}
        height={900}
        sizes="(min-width: 1024px) 18vw, 45vw"
        className="mt-[5.26cqw] h-[39.5cqw] w-full rounded-[3.16cqw] object-cover"
      />
      <span className="mt-[5.26cqw] font-haas text-[7.37cqw] leading-none text-ink">Shop the drop</span>
      <span className={`${pill} mt-[10.5cqw] h-[12.6cqw] w-[44.7cqw] bg-blush text-[4.47cqw] text-white`}>Buy now</span>
    </div>
  );
}

export function ArtboardTest() {
  const tasks = [
    ["Find a product", true],
    ["Add to bag", true],
    ["Checkout", true],
    ["Track order", false],
  ] as const;
  return (
    <div className="flex h-full flex-col px-[7.9cqw] pt-[10.5cqw]">
      <ul className="flex flex-col gap-[10.5cqw]">
        {tasks.map(([t, ok]) => (
          <li key={t} className="flex items-center gap-[4.7cqw] font-copy text-[5.26cqw] font-medium text-ink">
            <span className={`grid size-[10.5cqw] shrink-0 place-items-center rounded-[3.16cqw] font-haas text-[5.26cqw] text-white ${ok ? "bg-lagoon" : "bg-[#e8e3ea]"}`}>
              {ok ? "✓" : ""}
            </span>
            {t}
          </li>
        ))}
      </ul>
      <span className="mt-[13.2cqw] font-display text-[3.95cqw] text-blush">3 / 4 tasks passed</span>
    </div>
  );
}
