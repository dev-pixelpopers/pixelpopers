"use client";

import { useSyncExternalStore } from "react";

/*
  The visitor's first name, as they told the welcome intro (or the contact
  chat). It lives only in this browser (localStorage) and is never sent
  anywhere on its own — the contact form includes it only when the visitor
  sends a brief.

  - `null` record: a first visit — the welcome intro asks for their name.
  - `{ name: "" }`: they skipped; no intro again, no greetings.
  - `{ name: "Sara" }`: greeted by name around the site.
*/

const KEY = "pp-visitor";
const DONE_EVENT = "pp:intro-done";

export type VisitorRecord = { name: string; at: number };

const listeners = new Set<() => void>();
let cache: VisitorRecord | null | undefined;

function read(): VisitorRecord | null {
  if (cache !== undefined) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as VisitorRecord) : null;
    cache = parsed && typeof parsed.name === "string" ? parsed : null;
  } catch {
    cache = null;
  }
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

export function saveVisitorName(name: string) {
  const record: VisitorRecord = { name: name.trim().slice(0, 60), at: Date.now() };
  cache = record;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // Private mode / storage blocked: the name still works for this page view.
  }
  emit();
}

export function forgetVisitor() {
  cache = null;
  try {
    window.localStorage.removeItem(KEY);
    window.sessionStorage.removeItem(GREETED_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * The stored record on the client; `undefined` while rendering on the server
 * (and during hydration), so nothing name-dependent is in the HTML.
 */
export function useVisitor(): VisitorRecord | null | undefined {
  return useSyncExternalStore<VisitorRecord | null | undefined>(subscribe, read, () => undefined);
}

/** The visitor's first name, or "" when unknown / skipped / on the server. */
export function useVisitorName(): string {
  const record = useVisitor();
  return record?.name ? firstName(record.name) : "";
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? "";
}

/* ── The welcome intro ────────────────────────────────────────────────── */

/** Crawlers and page-speed tests never get the intro (it would only be in their way). */
function isAutomated() {
  return /bot|crawl|spider|slurp|lighthouse|headlesschrome|pagespeed|gtmetrix|preview/i.test(navigator.userAgent) || navigator.webdriver === true;
}

let introOpen: boolean | undefined;
const introListeners = new Set<() => void>();

/** Whether this page view opens with the welcome intro (first visit, a real person). */
export function introPending(): boolean {
  if (typeof window === "undefined") return false;
  if (introOpen === undefined) introOpen = read() === null && !isAutomated();
  return introOpen;
}

/** The intro has gone: page entrances that were waiting can play. */
export function finishIntro() {
  introOpen = false;
  liftIntroCover();
  introListeners.forEach((l) => l());
  window.dispatchEvent(new Event(DONE_EVENT));
}

/** Removes the first-paint cover (set by the script in the root layout). */
export function liftIntroCover() {
  document.documentElement.removeAttribute("data-intro");
}

/** "Not Sara?": forget the name and ask again. */
export function reopenIntro() {
  forgetVisitor();
  introOpen = !isAutomated();
  introListeners.forEach((l) => l());
}

/** Whether the intro is showing (false on the server and during hydration). */
export function useIntroOpen(): boolean {
  return useSyncExternalStore(
    (l) => {
      introListeners.add(l);
      return () => introListeners.delete(l);
    },
    introPending,
    () => false,
  );
}

/**
 * Holds a page's entrance timeline at its start while the welcome intro is up,
 * and plays it the moment the intro leaves — so the visitor sees it. The
 * entrance is transform-only (the content is already painted), so holding it
 * never delays what's visible.
 */
export function holdForIntro(timeline: { pause: () => unknown; play: () => unknown }) {
  if (!introPending()) return () => {};
  timeline.pause();
  const play = () => timeline.play();
  window.addEventListener(DONE_EVENT, play, { once: true });
  return () => window.removeEventListener(DONE_EVENT, play);
}

/* ── Page greetings ───────────────────────────────────────────────────── */

const GREETED_KEY = "pp-greeted";

/** Greets once per page per visit (browser session). */
export function shouldGreet(path: string): boolean {
  try {
    const seen = JSON.parse(window.sessionStorage.getItem(GREETED_KEY) ?? "[]") as string[];
    if (seen.includes(path)) return false;
    window.sessionStorage.setItem(GREETED_KEY, JSON.stringify([...seen, path].slice(-40)));
    return true;
  } catch {
    return false;
  }
}

export function markGreeted(path: string) {
  try {
    const seen = JSON.parse(window.sessionStorage.getItem(GREETED_KEY) ?? "[]") as string[];
    if (!seen.includes(path)) window.sessionStorage.setItem(GREETED_KEY, JSON.stringify([...seen, path]));
  } catch {
    /* ignore */
  }
}
