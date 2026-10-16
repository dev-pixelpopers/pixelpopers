import type gsap from "gsap";

/**
 * `contextSafe` for a matchMedia branch: wraps a callback that runs later (a
 * timeline `.call`, an event handler) so whatever it creates belongs to *that
 * branch's* context.
 *
 * Don't use useGSAP's own `contextSafe` inside a `gsap.matchMedia()` branch:
 * it belongs to the outer context, and calling it while the branch is active
 * files the outer context inside the branch — which already sits inside the
 * outer context. Reverting that loop (on navigating away) overflows the stack.
 */
export function safeIn(context: gsap.Context) {
  return <F extends (...args: never[]) => unknown>(fn: F): F => context.add(null as unknown as string, fn) as unknown as F;
}
