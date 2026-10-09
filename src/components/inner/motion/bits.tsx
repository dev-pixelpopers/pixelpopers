import { Fragment } from "react";

/*
  Markup helpers for the inner pages' scroll motion (see ./kit.ts). Server
  components — they only add the `data-wm` hooks the motion looks for.
*/

const BURST_TONES = ["bg-blush", "bg-lagoon", "bg-sunbeam", "bg-grape"];

/** A ring and a spray of confetti, hidden until an animation bursts them. */
export function Burst({
  pieces = 10,
  ring = "border-sunbeam",
  className = "",
}: {
  pieces?: number;
  ring?: string;
  className?: string;
}) {
  return (
    <span aria-hidden data-wm="burst" className={`pointer-events-none absolute ${className}`}>
      <span data-wm="burst-ring" className={`absolute -inset-7 rounded-full border-4 border-solid opacity-0 ${ring}`} />
      {Array.from({ length: pieces }, (_, i) => (
        <span
          key={i}
          data-wm="burst-piece"
          className={`absolute top-1/2 left-1/2 opacity-0 ${BURST_TONES[i % BURST_TONES.length]} ${
            i % 2 ? "-mt-1 -ml-2 h-2 w-4 rounded-sm" : "-mt-1.5 -ml-1.5 size-3 rounded-full"
          }`}
        />
      ))}
    </span>
  );
}

/** Each letter in its own inline-block (words kept whole so lines wrap cleanly). */
export function Chars({ text, hook = "char" }: { text: string; hook?: string }) {
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 ? " " : null}
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((ch, c) => (
          <span key={c} data-wm={hook} className="inline-block">
            {ch}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}
