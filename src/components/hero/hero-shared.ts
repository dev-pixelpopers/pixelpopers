import gsap from "gsap";

/** Scoped selector returned by `gsap.utils.selector`. */
export type Q = (selector: string) => Element[];

/** Resting yaw of a doodle, from its `data-rotate`. */
export const settleRotation = (_i: number, el: Element) =>
  Number((el as HTMLElement).dataset.rotate ?? 0);

/** Reduced motion still has to reveal the copy — the markup ships hidden. */
export function revealStatic(q: Q) {
  gsap.set(q("[data-hero='line']"), { autoAlpha: 1 });
  gsap.set(q("[data-hero='doodle']"), { autoAlpha: 1, rotation: settleRotation });
}

/**
 * Splits each `data-split` line into one inline-block span per letter
 * (`data-hero="char"`) for the per-letter motion, and returns a function that
 * puts the plain text back.
 *
 * The HTML ships each line as plain text on purpose: a line made of dozens of
 * tiny letter boxes isn't one "contentful" element to the browser, so the
 * small header logo used to be measured as the Largest Contentful Paint and
 * it waited behind all the page's JavaScript. As plain text the headline
 * itself is the LCP, painted with the first frame. The letters are only
 * needed once the animation starts, so they're made then.
 */
export function splitHeroChars(root: ParentNode): () => void {
  const masks = Array.from(root.querySelectorAll<HTMLElement>("[data-hero='mask'][data-split]"));
  const originals = masks.map((mask) => mask.textContent ?? "");
  masks.forEach((mask, m) => {
    const frag = document.createDocumentFragment();
    for (const char of originals[m]) {
      if (char === " ") {
        frag.append(" ");
        continue;
      }
      const span = document.createElement("span");
      span.dataset.hero = "char";
      span.className = "inline-block";
      span.textContent = char;
      frag.append(span);
    }
    mask.replaceChildren(frag);
  });
  return () => masks.forEach((mask, m) => mask.replaceChildren(originals[m]));
}
