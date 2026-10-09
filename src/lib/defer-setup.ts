import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  Spreads the set-up of below-the-fold scroll animations over several short
  tasks instead of one long one.

  Every section's useGSAP runs in the same synchronous React commit, so on a
  phone their combined set-up (measuring, building timelines, ScrollTrigger
  refreshes) blocked the main thread for over a second right after load.
  Sections far below the fold queue their set-up here instead: each runs in
  its own task, in the order queued (page order), yielding in between, and a
  single ScrollTrigger refresh follows the last one so every trigger is
  measured against the final layout (without it, triggers created early
  measured a layout that later changed, and fired at the wrong scroll).

  The queue only starts once the visitor first interacts (scrolls, touches,
  clicks or presses a key), or straight away when the page opens already
  scrolled (a reload part-way down, a #hash link). These sections sit
  several screens below the fold and nothing pins, so set-up order doesn't
  shift layout, and they're ready long before they're reached — but none
  of their work lands on load, where it cost a phone half a second of
  blocked main thread.

  Pass a `contextSafe`-wrapped function so whatever it creates still belongs
  to the component's GSAP context and is reverted on unmount, and call the
  returned cancel function from the effect's cleanup: a job still queued
  when its effect is cleaned up (unmounted, or React re-running the effect)
  must not run. Run anyway, it built a second set of timelines over the
  first, whose `from` tweens recorded the first set's hidden start states as
  their end states — content that never appeared. (useGSAP keeps one context
  across re-runs, so the context's own reverted flag can't tell.)
*/

type Job = { run: () => void; cancelled: boolean };

const queue: Job[] = [];
let scheduled = false;
let started = false;

const START_EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;

function start() {
  if (started) return;
  started = true;
  START_EVENTS.forEach((type) => window.removeEventListener(type, start));
  if (queue.length) schedule();
}

const nextTask = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 300 });
  else setTimeout(fn, 0);
};

function flush() {
  const job = queue.shift();
  if (job?.cancelled) {
    flush();
    return;
  }
  if (!job) {
    scheduled = false;
    ScrollTrigger.refresh();
    return;
  }
  job.run();
  nextTask(flush);
}

export function deferSetup(run: () => void) {
  const job: Job = { run, cancelled: false };
  queue.push(job);
  const cancel = () => {
    job.cancelled = true;
  };
  if (!started) {
    if (window.scrollY > 0) start();
    else START_EVENTS.forEach((type) => window.addEventListener(type, start, { passive: true }));
    return cancel;
  }
  schedule();
  return cancel;
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  nextTask(flush);
}

/**
 * Like `deferSetup`, but starts on the next idle moment without waiting for
 * an interaction — for set-up that may be needed near the top of the page
 * (inner pages' sections can sit right under the hero). Jobs still run one
 * per task, so the work never lands as one long block.
 */
export function idleSetup(run: () => void) {
  const job: Job = { run, cancelled: false };
  queue.push(job);
  schedule();
  return () => {
    job.cancelled = true;
  };
}
