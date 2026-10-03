import { Fragment } from "react";

type SplitWordsProps = {
  text: string;
  /** Value of the `data-split` attribute on each word, for GSAP to target. */
  name: string;
};

/**
 * Renders each word inside its own clipping mask so it can slide up into
 * view. Real spaces stay between the masks, so the copy still wraps, reads
 * and copy-pastes as ordinary text. Splitting in markup (rather than at
 * runtime) means there is nothing to re-split on resize or font swap.
 */
export default function SplitWords({ text, name }: SplitWordsProps) {
  const words = text.split(" ");

  return words.map((word, i) => (
    <Fragment key={i}>
      <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
        <span data-split={name} className="inline-block origin-bottom-left will-change-transform">
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}
