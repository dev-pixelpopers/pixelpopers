import Image from "next/image";
import PopButton from "@/components/ui/PopButton";
import { slugify, type Block } from "@/lib/pages/blog";
import { toneFill } from "./tones";

const dotTones = ["bg-blush", "bg-lagoon", "bg-sunbeam", "bg-grape"];
const statTilt = [
  "-rotate-1 sm:-rotate-2",
  "rotate-1 sm:rotate-2",
  "-rotate-1 sm:-rotate-2",
];

const pText =
  "font-copy text-[clamp(1.0625rem,1.146vw,1.375rem)] leading-[1.73] font-light text-ink";
const itemText =
  "font-copy text-[clamp(1.0625rem,1.146vw,1.375rem)] leading-[1.64] font-medium text-ink";

/**
 * Renders a post's structured body with the Figma 336:21 article styles:
 * Nevera h2s, Archivo Light paragraphs, a pink-barred pull quote, coloured
 * bullet lists, tilted stat boxes, numbered steps and the inline audit CTA.
 */
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((b, i) => {
        const key = `${b.type}-${i}`;
        const gap =
          i === 0
            ? ""
            : b.type === "h2"
              ? "mt-[clamp(2.5rem,2.9vw,3.5rem)]"
              : "mt-[clamp(1.25rem,1.67vw,2rem)]";
        switch (b.type) {
          case "p":
            return (
              <p key={key} className={`${gap} ${pText}`}>
                {b.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={key}
                id={slugify(b.text)}
                className={`${gap} scroll-mt-8 font-display text-[clamp(1.5rem,2.1875vw,2.625rem)] leading-[1.24] text-grape uppercase`}
              >
                {b.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className={`${gap} flex gap-[clamp(1.25rem,1.875vw,2.25rem)] py-1.5`}
              >
                <span
                  aria-hidden
                  className="w-2 shrink-0 rounded-full bg-blush"
                />
                <p className="font-display text-[clamp(1.25rem,1.667vw,2rem)] leading-[1.44] text-blush-ink">
                  “{b.text}”
                </p>
              </blockquote>
            );
          case "list":
            return (
              <ul
                key={key}
                className={`${gap} flex flex-col gap-[clamp(0.75rem,1.04vw,1.25rem)]`}
              >
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-5">
                    <span
                      aria-hidden
                      className={`mt-[0.6em] size-4 shrink-0 rounded-full ${dotTones[j % 4]}`}
                    />
                    <span className={itemText}>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={key} className={`${gap} flex flex-col gap-5`}>
                {b.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-5">
                    <span
                      aria-hidden
                      className="grid size-[clamp(2.5rem,2.29vw,2.75rem)] shrink-0 place-items-center rounded-full bg-grape font-display text-[clamp(1rem,1.04vw,1.25rem)] text-white"
                    >
                      {j + 1}
                    </span>
                    <span className={itemText}>{item}</span>
                  </li>
                ))}
              </ol>
            );
          case "stats":
            return (
              <dl key={key} className={`${gap} grid gap-5 py-2 sm:grid-cols-3`}>
                {b.items.map((s, j) => (
                  <div
                    key={s.label}
                    className={`flex flex-col-reverse justify-end gap-1 rounded-3xl px-6 pt-2.5 pb-7 sm:min-h-[clamp(10rem,10.4vw,12.5rem)] ${statTilt[j % 3]} ${toneFill[s.tone]}`}
                  >
                    <dt className="font-copy text-[clamp(0.875rem,0.885vw,1.0625rem)] leading-[1.41] font-medium">
                      {s.label}
                    </dt>
                    <dd className="font-pop text-[clamp(3.5rem,4.6875vw,5.625rem)] leading-[1.22]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            );
          case "image":
            return (
              <figure key={key} className={`${gap} flex flex-col gap-4`}>
                <Image
                  src={b.src}
                  alt={b.alt}
                  width={b.width}
                  height={b.height}
                  sizes="(min-width: 1920px) 880px, (min-width: 1024px) 46vw, 100vw"
                  className="aspect-[880/500] w-full rounded-[clamp(1.25rem,1.67vw,2rem)] object-cover"
                />
                {b.caption ? (
                  <figcaption className="font-copy text-micro text-ink/60">
                    {b.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "callout":
            return (
              <aside
                key={key}
                aria-label={b.title}
                className={`${gap} my-4 overflow-hidden rounded-[clamp(1.5rem,1.67vw,2rem)] bg-grape bg-[radial-gradient(ellipse_35%_60%_at_85%_70%,rgb(242_119_147/0.55),transparent_75%)] px-[clamp(1.5rem,2.29vw,2.75rem)] py-[clamp(1.75rem,2.08vw,2.5rem)] shadow-[0_20px_50px_rgb(34_1_40/0.13)]`}
              >
                <p className="font-display text-micro text-sunbeam uppercase">
                  {b.eyebrow}
                </p>
                <p className="mt-3 max-w-[35rem] font-display text-[clamp(1.5rem,1.98vw,2.375rem)] leading-[1.21] text-white uppercase">
                  {b.title}
                </p>
                <PopButton
                  href={b.href}
                  label={b.label}
                  className="mt-5 [&>span:first-child]:bg-blush [&>span:last-child]:text-white"
                />
              </aside>
            );
        }
      })}
    </div>
  );
}
