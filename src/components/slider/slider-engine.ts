import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Viewport heights of scrolling per step from one slide to the next. */
export const SCROLL_PER_SLOT = 50;

/** One sticky 100vh stage plus SCROLL_PER_SLOT of travel per step. */
export const sectionHeight = (count: number) => `${(count - 1) * SCROLL_PER_SLOT + 100}vh`;

/**
 * `ring` — positions wrap around (a carousel with no ends).
 * `clamp` — a line of slides with a first and a last.
 */
export type SliderMode = "ring" | "clamp";

/** Steps between slide `index` and the active one, the short way round for a ring. */
export function slotDistance(index: number, active: number, count: number, mode: SliderMode) {
  const d = Math.abs(index - active);
  return mode === "ring" ? Math.min(d, count - d) : d;
}

/**
 * Asks the slider to move on one slide. Returns false when there is nowhere
 * to go (the last slide of a `clamp` slider), so the caller can replay.
 */
export type Advance = () => boolean;

type SliderMotionOptions = {
  section: HTMLElement;
  count: number;
  mode: SliderMode;
  /** Lays the slides out for a fractional position (0 = first slide). Runs every frame. */
  render: (position: number) => void;
  /** Re-measure geometry; called before the first render and on every refresh. */
  measure?: () => void;
  /** Snap the scroll to the nearest slide once it settles. */
  snap?: boolean;
  /**
   * Pixels at the end of the section kept clear of the slide scrub, so
   * something else (like folding the slider away) can use that scroll.
   */
  endInset?: () => number;
  /** While true, a finished clip replays instead of advancing the slider. */
  isHeld?: () => boolean;
  onActive: (index: number) => void;
  onInView: (inView: boolean) => void;
  setAdvance: (advance: Advance) => void;
};

/**
 * The scroll/auto-advance engine every slider version shares. Call inside a
 * `useGSAP` so everything it creates is reverted on unmount.
 *
 * The slider's position is the sum of two sources: the scroll scrub (first
 * slide to last across the section) and an auto-advance offset that steps one
 * slide when a clip ends. Keeping them separate means auto-advance never has
 * to scroll the page, and either can move without fighting the other.
 */
export function createSliderMotion(options: SliderMotionOptions) {
  const { section, count, mode, render, measure, snap, endInset, isHeld, onActive, onInView, setAdvance } =
    options;
  const scroll = { progress: 0 };
  const auto = { offset: 0 };
  let active = -1;

  const position = () => {
    const raw = scroll.progress + auto.offset;
    return mode === "ring" ? raw : gsap.utils.clamp(0, count - 1, raw);
  };

  const update = () => {
    const p = position();
    render(p);
    const nearest = mode === "ring" ? ((Math.round(p) % count) + count) % count : Math.round(p);
    if (nearest !== active) {
      active = nearest;
      onActive(nearest);
    }
  };

  measure?.();
  update();

  const media = gsap.matchMedia();

  // Under reduced motion nothing is wired up: the first slide stays put and,
  // with `inView` never set, nothing autoplays.
  media.add("(prefers-reduced-motion: no-preference)", () => {
    // Wider than the scrub range below, so playback starts as the section
    // scrolls in rather than only once it sticks.
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => onInView(self.isActive),
      onRefresh: (self) => onInView(self.isActive),
    });

    // Steps from the last target, not the live value, so a clip that ends
    // mid-swing still lands squarely on the following slide.
    let target = 0;
    setAdvance(() => {
      if (isHeld?.()) return false;
      if (mode === "clamp" && Math.round(position()) >= count - 1) return false;
      target = Math.round(target) + 1;
      gsap.to(auto, {
        offset: target,
        duration: 1.2,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: update,
      });
      return true;
    });

    // fromTo, not to: the start must stay pinned at 0 across refreshes.
    gsap.fromTo(
      scroll,
      { progress: 0 },
      {
        progress: count - 1,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          // The pin is CSS `sticky`, so ScrollTrigger only reports progress.
          start: "top top",
          end: endInset ? () => `bottom-=${endInset()} bottom` : "bottom bottom",
          scrub: 1,
          snap: snap
            ? { snapTo: 1 / (count - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: "power2.inOut" }
            : undefined,
          onRefresh: () => {
            measure?.();
            update();
          },
        },
        onUpdate: update,
      },
    );

    return () => setAdvance(() => false);
  });
}
