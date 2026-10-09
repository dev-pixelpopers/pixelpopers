import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { afterFirstInteraction } from "@/lib/defer-setup";

/**
 * Runs an endless idle animation (a float, a wobble, a marquee) only when
 * someone could be watching: not before the visitor first interacts, and
 * never while `trigger` is off screen. Left running from load, every such
 * loop rewrote inline styles each frame for as long as the page was open —
 * a page-speed test counted all of it as blocked main thread.
 *
 * Call inside a GSAP context (useGSAP / matchMedia) so the trigger is
 * reverted with it; the returned cleanup also kills it.
 */
export function ambient(animation: gsap.core.Animation, trigger: Element) {
  animation.pause();
  let armed = false;
  let visible = false;
  const sync = () => {
    if (armed && visible) animation.resume();
    else animation.pause();
  };

  const watch = ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      visible = self.isActive;
      sync();
    },
  });
  visible = watch.isActive;

  const cancel = afterFirstInteraction(() => {
    armed = true;
    sync();
  });

  return () => {
    cancel();
    watch.kill();
    animation.pause();
  };
}

type ContextData = { data: unknown[] };

const firstElement = (animation: gsap.core.Animation): Element | undefined => {
  if (animation instanceof gsap.core.Tween) {
    return animation.targets().find((t): t is Element => t instanceof Element);
  }
  if (animation instanceof gsap.core.Timeline) {
    for (const child of animation.getChildren(true, true, false)) {
      const el = firstElement(child);
      if (el) return el;
    }
  }
  return undefined;
};

/**
 * `ambient()` for every endless top-level animation (`repeat: -1`) built so
 * far in a GSAP context — call at the end of a matchMedia branch, passing its
 * context, and return the cleanup. Each loop watches its own first target.
 * Loops nested in a timeline aren't seen: give them their own tween.
 */
export function ambientLoops(context: gsap.Context) {
  const loops: gsap.core.Animation[] = [];
  const collect = (ctx: ContextData) =>
    ctx.data.forEach((item) => {
      if (item instanceof gsap.core.Animation) {
        // Loops with a ScrollTrigger of their own already pause off screen.
        const topLevel = !item.parent || item.parent === gsap.globalTimeline;
        if (item.repeat() === -1 && topLevel && !item.scrollTrigger) loops.push(item);
      } else if (item && typeof item === "object" && "data" in item && Array.isArray((item as ContextData).data)) {
        collect(item as ContextData);
      }
    });
  collect(context as unknown as ContextData);
  const stops = loops.flatMap((loop) => {
    const el = firstElement(loop);
    return el ? [ambient(loop, el)] : [];
  });
  return () => stops.forEach((stop) => stop());
}
