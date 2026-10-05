import Image from "next/image";

/*
  UI mock-ups for the growth-dashboard page (Figma 371:21). Every mock-up is
  its own `@container`; sizes inside are `cqw` of that container measured off
  the 1920 Figma frame (px ÷ mock-up width × 100), with `max()` floors so the
  type stays legible when the mock-up shrinks on phones.
*/

export const cardShadow = "shadow-[0_24px_60px_rgb(34_1_40/0.15)]";
export const layer = "col-start-1 row-start-1 self-start justify-self-start";

const green = "text-[#2ec27e]";

/* ── Campaign dashboard (820 × 520) ───────────────────────────────────── */

const kpis = [
  {
    label: "Reach",
    value: "1.2M",
    delta: "+212%",
    tone: "bg-blush/12 text-blush",
  },
  {
    label: "Clicks",
    value: "48.3K",
    delta: "+87%",
    tone: "bg-lagoon/12 text-lagoon",
  },
  {
    label: "Sales",
    value: "$86K",
    delta: "+64%",
    tone: "bg-grape/12 text-grape",
  },
];

const linePoints =
  "8,256 78,226 148,238 218,196 288,206 358,156 428,171 498,116 568,86 638,66 708,26 758,12";
const prevPoints =
  "8,316 78,286 148,298 218,256 288,266 358,216 428,231 498,176 568,146 638,126 708,86 758,72";

export function Dashboard({ className = "" }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div
        className={`overflow-hidden rounded-[max(1.25rem,3.41cqw)] bg-white ${cardShadow}`}
      >
        <div className="flex items-start justify-between gap-3 px-[3.9cqw] pt-[3.17cqw]">
          <div>
            <p className="font-copy text-[max(0.875rem,2.68cqw)] leading-[1.1] font-extrabold text-ink">
              Campaign overview
            </p>
            <p className="mt-[1cqw] font-copy text-[max(0.6875rem,1.83cqw)] text-ink/55">
              Last 30 days
            </p>
          </div>
          <span className="flex h-[max(1.75rem,4.63cqw)] w-[max(5.5rem,18.3cqw)] items-center gap-[1.22cqw] rounded-full bg-[#2ec27e]/15 pl-[1.95cqw]">
            <span className="size-[max(0.4rem,1.22cqw)] rounded-full bg-[#2ec27e]" />
            <span
              className={`font-display text-[max(0.625rem,1.83cqw)] leading-none ${green}`}
            >
              LIVE
            </span>
          </span>
        </div>

        <dl className="mt-[2.68cqw] grid grid-cols-3 gap-[2.44cqw] px-[3.9cqw]">
          {kpis.map((k) => (
            <div
              key={k.label}
              className={`min-h-[13.4cqw] rounded-[2.2cqw] px-[2.2cqw] pt-[1.7cqw] pb-[1.5cqw] ${k.tone.split(" ")[0]}`}
            >
              <dt
                className={`font-display text-[max(0.5625rem,1.59cqw)] uppercase ${k.tone.split(" ")[1]}`}
              >
                {k.label}
              </dt>
              <dd className="mt-[0.85cqw] font-copy text-[max(1rem,4.15cqw)] leading-[1.1] font-extrabold text-ink">
                {k.value}
              </dd>
              <dd
                className={`mt-[0.6cqw] font-copy text-[max(0.5625rem,1.71cqw)] font-bold ${green}`}
              >
                ▲ {k.delta}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-[0.98cqw] grid">
          <svg
            data-draw
            viewBox="0 0 788 306"
            className="col-start-1 row-start-1 ml-[3.9cqw] block w-[96.1cqw] overflow-hidden"
            aria-hidden
          >
            {[36, 96, 156, 216].map((y) => (
              <rect
                key={y}
                x="0"
                y={y}
                width="756"
                height="1"
                fill="#220128"
                fillOpacity="0.07"
              />
            ))}
            <polyline
              data-fade
              points={prevPoints}
              fill="none"
              stroke="#3FB7C7"
              strokeWidth="3"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              data-line
              points={linePoints}
              fill="none"
              stroke="#F27793"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle data-fade cx="758" cy="12" r="12" fill="#F27793" />
          </svg>
          <div className="col-start-1 row-start-1 mb-[2.2cqw] ml-[7.32cqw] grid grid-cols-[repeat(4,28.05cqw)] self-end font-copy text-[max(0.5625rem,1.59cqw)] font-medium text-ink/45">
            <span>W1</span>
            <span>W2</span>
            <span>W3</span>
            <span>W4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Phone: sponsored social post (320 × 640) ─────────────────────────── */

export function PostPhone({ className = "" }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div
        className={`aspect-[320/640] rounded-[14.4cqw] bg-ink p-[3.75cqw] ${cardShadow}`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[11.25cqw] bg-white text-ink">
          <div className="flex items-center gap-[3.13cqw] px-[5.63cqw] pt-[17.5cqw]">
            <span className="grid size-[12.5cqw] shrink-0 place-items-center rounded-full bg-blush font-pop text-[9.4cqw] leading-none text-white">
              P
            </span>
            <span className="font-copy leading-tight">
              <span className="block text-[max(0.625rem,4.69cqw)] font-bold">
                fifthsip.cafe
              </span>
              <span className="block text-[max(0.5rem,3.75cqw)] text-ink/50">
                Sponsored
              </span>
            </span>
          </div>
          <Image
            src="/assets/inner/fifth-sip.webp"
            alt=""
            width={857}
            height={1200}
            sizes="(min-width: 1024px) 16vw, 60vw"
            priority
            className="mt-[4.38cqw] aspect-square w-full object-cover"
          />
          <p className="mt-[4.38cqw] px-[5.63cqw] text-[max(0.75rem,6.9cqw)] leading-none">
            <span className="text-[#e0245e]">♥</span>&nbsp;&nbsp;💬&nbsp;&nbsp;↗
          </p>
          <p className="mt-[5cqw] px-[5.63cqw] font-copy text-[max(0.625rem,5cqw)] font-bold">
            12,480 likes
          </p>
          <p className="mt-[2.8cqw] px-[5.63cqw] font-copy text-[max(0.5625rem,4.38cqw)] leading-[1.43]">
            <b>fifthsip.cafe</b>&nbsp; the 5th sip hits different ☕️ #newdrop
          </p>
          <span className="mx-[5.63cqw] mt-[4.38cqw] grid h-[13.75cqw] place-items-center rounded-[3.75cqw] bg-grape font-copy text-[max(0.625rem,5cqw)] font-bold text-white">
            Shop now
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Phone: profile grid (440 × 900) ──────────────────────────────────── */

const tiles: (
  | { img: string; w: number; h: number }
  | { text: string; bg: string; tone: string }
)[] = [
  { img: "fifth-sip.webp", w: 857, h: 1200 },
  { text: "NEW\nDROP", bg: "bg-blush", tone: "text-white" },
  { img: "tien-coffee.webp", w: 736, h: 736 },
  { text: "5TH\nSIP", bg: "bg-sunbeam", tone: "text-ink" },
  { img: "radiance.webp", w: 1024, h: 1174 },
  { text: "50%\nOFF", bg: "bg-lagoon", tone: "text-white" },
  { img: "campaign-strip.webp", w: 1600, h: 891 },
  { text: "POP!", bg: "bg-grape", tone: "text-white" },
  { img: "marketing.webp", w: 1600, h: 1067 },
];

export function ProfilePhone({ className = "" }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div
        className={`aspect-[440/900] rounded-[13.6cqw] bg-ink p-[3.18cqw] ${cardShadow}`}
      >
        <div className="h-full overflow-hidden rounded-[10.9cqw] bg-white text-ink">
          <div className="flex items-start gap-[4.55cqw] px-[5.45cqw] pt-[15.9cqw]">
            <span className="grid size-[19.5cqw] shrink-0 place-items-center rounded-full bg-blush font-pop text-[15.9cqw] leading-none text-white">
              P
            </span>
            <dl className="mt-[3.18cqw] grid grow grid-cols-3 font-copy">
              {[
                ["248", "posts"],
                ["32.1K", "followers"],
                ["180", "following"],
              ].map(([n, l]) => (
                <div key={l} className="flex flex-col-reverse">
                  <dt className="mt-[0.9cqw] text-[max(0.5rem,2.95cqw)] text-ink/60">
                    {l}
                  </dt>
                  <dd className="text-[max(0.75rem,4.55cqw)] leading-none font-extrabold">
                    {n}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-[3.18cqw] px-[5.45cqw] font-copy text-[max(0.625rem,3.64cqw)] font-bold">
            fifthsip.cafe
          </p>
          <p className="mt-[1.6cqw] px-[5.45cqw] font-copy text-[max(0.5625rem,3.18cqw)] text-ink/70">
            Coffee that tastes like Saturday ☕️
          </p>
          <span className="mx-[5.45cqw] mt-[4.77cqw] grid h-[9.09cqw] place-items-center rounded-[2.27cqw] bg-grape font-copy text-[max(0.5625rem,3.41cqw)] font-bold text-white">
            Follow
          </span>
          <div className="mt-[4.55cqw] grid grid-cols-3 gap-[0.45cqw]">
            {tiles.map((t, i) =>
              "img" in t ? (
                <Image
                  key={i}
                  src={`/assets/inner/${t.img}`}
                  alt=""
                  width={t.w}
                  height={t.h}
                  sizes="(min-width: 1024px) 7vw, 28vw"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <span
                  key={i}
                  className={`grid aspect-square place-items-center text-center font-pop text-[8.64cqw] leading-[1.05] whitespace-pre-line ${t.bg} ${t.tone}`}
                >
                  {t.text}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Content calendar (900 × 380) ─────────────────────────────────────── */

type Day = { d: number; tag?: string; tone?: string };
const P = "bg-blush text-white";
const L = "bg-lagoon text-white";
const S = "bg-sunbeam text-ink";
const G = "bg-grape text-white";
const weeks: Day[][] = [
  [
    { d: 6 },
    { d: 7, tag: "Reel", tone: P },
    { d: 8 },
    { d: 9, tag: "Carousel", tone: L },
    { d: 10 },
    { d: 11, tag: "Story", tone: S },
    { d: 12 },
  ],
  [
    { d: 13 },
    { d: 14, tag: "Reel", tone: G },
    { d: 15, tag: "Giveaway", tone: P },
    { d: 16 },
    { d: 17, tag: "Post", tone: L },
    { d: 18 },
    { d: 19 },
  ],
  [
    { d: 20 },
    { d: 21, tag: "Live", tone: S },
    { d: 22, tag: "Reel", tone: P },
    { d: 23 },
    { d: 24, tag: "Collab", tone: G },
    { d: 25 },
    { d: 26, tag: "Story", tone: L },
  ],
];

export function ContentCalendar({ className = "" }: { className?: string }) {
  return (
    <figure className={`@container ${className}`}>
      <div
        className={`rounded-[max(1.25rem,3.11cqw)] bg-white px-[3.11cqw] pt-[2.44cqw] pb-[2.67cqw] ${cardShadow}`}
      >
        <figcaption className="font-display text-[max(0.625rem,1.67cqw)] text-grape uppercase">
          Content calendar · October
        </figcaption>
        <div className="mt-[2.33cqw] grid grid-cols-7 gap-x-[1.11cqw] font-copy text-[max(0.5rem,1.44cqw)] font-bold text-ink/50">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="uppercase">
              {d}
            </span>
          ))}
        </div>
        <ol
          data-reveal-stagger
          className="mt-[1.56cqw] grid grid-cols-7 gap-[1.11cqw]"
        >
          {weeks.flat().map((day) => (
            <li
              key={day.d}
              className="flex min-h-11 flex-col sm:aspect-[112/82] sm:min-h-0 rounded-[1.33cqw] bg-paper px-[0.89cqw] pt-[0.89cqw] pb-[1.33cqw]"
            >
              <span className="px-[0.22cqw] font-copy text-[max(0.5rem,1.44cqw)] leading-none font-bold text-ink/50">
                {day.d}
              </span>
              {day.tag ? (
                <span
                  className={`mt-auto grid h-[max(0.875rem,3.33cqw)] place-items-center truncate rounded-full px-[0.3cqw] font-copy text-[max(0.4375rem,1.33cqw)] font-bold ${day.tone}`}
                >
                  {day.tag}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/* ── Results bar chart (1100 × 620) ───────────────────────────────────── */

const months = [
  { m: "May", before: 33.33, after: 41.67 },
  { m: "Jun", before: 36.11, after: 52.78 },
  { m: "Jul", before: 31.94, after: 63.89 },
  { m: "Aug", before: 38.89, after: 80.56 },
  { m: "Sep", before: 37.5, after: 91.67 },
  { m: "Oct", before: 41.67, after: 108.33 },
];

export function ResultsChart({ className = "" }: { className?: string }) {
  return (
    <figure className={`@container ${className}`}>
      <div
        className={`rounded-[max(1.5rem,3.27cqw)] bg-white px-[3.64cqw] pt-[2.91cqw] pb-[8cqw] ${cardShadow}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <figcaption className="font-copy text-[max(0.875rem,2cqw)] font-extrabold text-ink">
            Monthly revenue from digital channels
          </figcaption>
          <ul className="flex gap-[5.18cqw] font-copy text-[max(0.6875rem,1.45cqw)] font-medium text-ink lg:mr-[7.18cqw]">
            <li className="flex items-center gap-[0.73cqw]">
              <span className="size-[max(0.625rem,1.45cqw)] rounded-[0.36cqw] bg-[#d9d2dc]" />
              Before
            </li>
            <li className="flex items-center gap-[0.73cqw]">
              <span className="size-[max(0.625rem,1.45cqw)] rounded-[0.36cqw] bg-blush" />
              With Pixel Popers
            </li>
          </ul>
        </div>

        <div className="mt-[5.82cqw] -ml-[0.91cqw] grid grid-cols-[max(1.75rem,4.55cqw)_1fr]">
          <ol
            aria-hidden
            className="-my-[0.64cqw] flex h-[calc(32.73cqw+1.28cqw)] flex-col justify-between font-copy text-[max(0.5rem,1.18cqw)] leading-none font-medium text-ink/45"
          >
            {["$40k", "$30k", "$20k", "$10k", "$0k"].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
          <div className="grid h-[32.73cqw]">
            <div
              aria-hidden
              className="col-start-1 row-start-1 flex flex-col justify-between"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="h-px bg-ink/7" />
              ))}
            </div>
            <ul
              data-grow
              className="col-start-1 row-start-1 grid grid-cols-6 pr-[1.45cqw] pl-[0.36cqw]"
            >
              {months.map((m, i) => (
                <li
                  key={m.m}
                  className="flex items-end justify-center gap-[0.73cqw]"
                  aria-label={`${m.m}: before vs with Pixel Popers`}
                >
                  <span
                    data-bar
                    className="w-[4.55cqw] rounded-[0.73cqw] bg-[#d9d2dc]"
                    style={{ height: `${m.before}%` }}
                  />
                  <span
                    data-bar
                    className={`w-[4.55cqw] rounded-[0.73cqw] ${i === 5 ? "bg-grape" : "bg-blush"}`}
                    style={{ height: `${m.after}%` }}
                  />
                </li>
              ))}
            </ul>
            <p className="col-start-1 row-start-1 -mt-[3.64cqw] w-[max(7.5rem,18.18cqw)] self-start justify-self-end rounded-[1.27cqw] bg-ink px-[1.64cqw] pt-[1.09cqw] pb-[1.4cqw] font-copy font-bold">
              <span className="block text-[max(0.625rem,1.45cqw)] text-white">
                OCT&nbsp;&nbsp;·&nbsp;&nbsp;$38.6K
              </span>
              <span
                className={`mt-[0.82cqw] block text-[max(0.5625rem,1.27cqw)] ${green}`}
              >
                ▲ 160% vs May
              </span>
            </p>
          </div>
        </div>
        <ol
          aria-hidden
          className="mt-[1.45cqw] grid grid-cols-[max(1.75rem,4.55cqw)_1fr] -ml-[0.91cqw]"
        >
          <li />
          <li className="grid grid-cols-6 pr-[1.45cqw] pl-[0.36cqw] font-copy text-[max(0.5rem,1.27cqw)] font-bold text-ink/50 uppercase">
            {months.map((m) => (
              <span key={m.m} className="mx-auto w-[9.82cqw] pl-[0.91cqw]">
                {m.m}
              </span>
            ))}
          </li>
        </ol>
      </div>
    </figure>
  );
}

/* ── Search results (1200 × 700) ──────────────────────────────────────── */

function FadedResult({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={`pl-[2.33cqw] font-copy ${className}`}>
      <p className="text-[max(0.6875rem,1.33cqw)] text-ink/35">{url}</p>
      <p className="mt-[0.92cqw] text-[max(0.875rem,1.83cqw)] font-bold text-ink/35">
        {title}
      </p>
      <span className="mt-[1.5cqw] block h-[1cqw] w-[66.67cqw] rounded-full bg-[#d9d2dc]/50" />
      <span className="mt-[0.83cqw] block h-[1cqw] w-[50cqw] rounded-full bg-[#d9d2dc]/50" />
    </div>
  );
}

export function SearchResults({ className = "" }: { className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div
        className={`rounded-[max(1.5rem,3cqw)] bg-white px-[3.33cqw] pt-[3cqw] pb-[5.1cqw] ${cardShadow}`}
      >
        <div className="flex h-[max(2.75rem,5.67cqw)] items-center gap-[2.17cqw] rounded-full bg-paper px-[2.17cqw] font-copy">
          <span
            aria-hidden
            className="text-[max(1rem,2.33cqw)] leading-none font-bold text-grape"
          >
            ⌕
          </span>
          <span
            data-type
            className="text-[max(0.8125rem,1.83cqw)] font-medium whitespace-nowrap text-ink"
          >
            best specialty coffee near me
          </span>
        </div>
        <article className="mt-[3cqw] rounded-[1.67cqw] border-[max(2px,0.25cqw)] border-blush px-[2.33cqw] pt-[2cqw] pb-[3.9cqw] font-copy shadow-[0_10px_30px_rgb(242_119_147/0.25)]">
          <p className="text-[max(0.6875rem,1.33cqw)] text-ink/60">
            fifthsip.cafe › menu
          </p>
          <h3 className="mt-[0.92cqw] text-[max(0.9375rem,2cqw)] leading-tight font-bold text-grape">
            Fifth Sip — Specialty Coffee &amp; Brunch | Order Online
          </h3>
          <p className="mt-[1.33cqw] text-[max(0.75rem,1.42cqw)] leading-[1.53] text-ink/80">
            <span className="text-sunbeam">★★★★★</span> 4.9
            (1,204)&nbsp;&nbsp;·&nbsp;&nbsp;Open
            now&nbsp;&nbsp;·&nbsp;&nbsp;Freshly roasted beans, brunch all day
            and the best flat white in town.
          </p>
        </article>
        <FadedResult
          className="mt-[2.5cqw]"
          url="anothercafe.com › about"
          title="Another Café — Coffee Shop"
        />
        <FadedResult
          className="mt-[3.83cqw]"
          url="directory.com › coffee"
          title="Top 10 Coffee Shops (2026)"
        />
      </div>
    </div>
  );
}

/* ── Story ad (340 × 600) ─────────────────────────────────────────────── */

export type Story = {
  img: string;
  w: number;
  h: number;
  alt: string;
  headline: string;
  cta: string;
  progress: string;
  frame: string;
  button: string;
  tilt: string;
};

export function StoryAd({ story }: { story: Story }) {
  return (
    <figure className={`@container ${story.tilt}`}>
      <div
        className={`grid aspect-[340/600] overflow-hidden rounded-[9.41cqw] ${story.frame} ${cardShadow}`}
      >
        <Image
          src={`/assets/inner/${story.img}`}
          alt={story.alt}
          width={story.w}
          height={story.h}
          sizes="(min-width: 1024px) 18vw, 50vw"
          className="col-start-1 row-start-1 h-full w-full object-cover"
        />
        <span
          aria-hidden
          className="col-start-1 row-start-1 h-1/2 self-end bg-ink/45"
        />
        <figcaption className="col-start-1 row-start-1 flex min-h-0 flex-col text-white">
          <span
            aria-hidden
            className="mx-[4.71cqw] mt-[4.12cqw] h-[1.18cqw] rounded-full bg-white/50"
          >
            <span
              className={`block h-full rounded-full bg-white ${story.progress}`}
            />
          </span>
          <span className="mt-[4.12cqw] px-[5.88cqw] font-copy text-[max(0.625rem,4.12cqw)] font-bold">
            Sponsored
          </span>
          <span className="mt-[103.8cqw] px-[5.88cqw] font-display text-[max(0.8125rem,8.82cqw)] leading-[1.2] uppercase">
            {story.headline}
          </span>
          <span
            aria-hidden
            className={`mx-[5.88cqw] mt-auto mb-[8.24cqw] grid h-[15.29cqw] shrink-0 place-items-center rounded-full font-copy text-[max(0.6875rem,5cqw)] font-bold ${story.button}`}
          >
            {story.cta}&nbsp;&nbsp;↑
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
