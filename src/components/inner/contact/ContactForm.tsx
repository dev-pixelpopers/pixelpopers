"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { Burst } from "@/components/inner/motion/bits";
import { burst, squashPop } from "@/components/inner/motion/kit";
import { CONTACT_EMAIL as DEFAULT_CONTACT_EMAIL, contactForm as defaultContactForm } from "@/lib/pages/contact";
import { submitForm } from "@/lib/forms";
import { saveVisitorName, useVisitor } from "@/lib/visitor";

gsap.registerPlugin(useGSAP);

/*
  The project form as a chat with the studio: Pixel Popers asks one thing at a
  time (after a beat of "typing…"), the visitor answers in their own bubble —
  typing, or tapping options for services and budget — and each question picks
  up the earlier answers ("Nice to meet you, Jane!"). Every answer can be
  edited, the brief is read back before sending, and sending posts it to the
  CMS inbox exactly as the old form did (with the mail-app fallback when the
  CMS is unreachable). Copy for the options, button and fine print still comes
  from the CMS (`contactForm`).
*/

type Answers = {
  name: string;
  services: string[];
  company: string;
  website: string;
  budget: string;
  details: string;
  email: string;
};

type StepKey = keyof Answers;

type Step = {
  key: StepKey;
  kind: "text" | "email" | "url" | "textarea" | "multi" | "single";
  /** `returning`: the welcome intro already told us their name. */
  ask: (a: Answers, first: string, returning?: boolean) => ReactNode;
  placeholder?: string;
  optional?: boolean;
  autoComplete?: string;
};

const NOT_SURE = "Not sure yet";

const first = (name: string) => name.trim().split(/\s+/)[0] || "friend";
const list = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const steps: Step[] = [
  {
    key: "name",
    kind: "text",
    autoComplete: "name",
    placeholder: "Type your name…",
    ask: () => (
      <>
        Hey there 👋 We’re Pixel Popers — the crew that makes brands impossible to scroll past. <b>What should we call you?</b>
      </>
    ),
  },
  {
    key: "services",
    kind: "multi",
    ask: (_a, f, returning) =>
      returning ? (
        <>
          Hey {f}, good to see you again! 👋 <b>What can we make pop for you?</b> Pick as many as you like.
        </>
      ) : (
        <>
          Nice to meet you, {f}! <b>What can we make pop for you?</b> Pick as many as you like.
        </>
      ),
  },
  {
    key: "company",
    kind: "text",
    autoComplete: "organization",
    placeholder: "Your brand or company…",
    ask: (a) =>
      a.services.length ? (
        <>
          {list(a.services)}? Ooh, we love that. <b>Which brand are we doing this for?</b>
        </>
      ) : (
        <>
          Not sure yet? No stress — that’s exactly what our first chat is for. <b>Which brand are we talking about?</b>
        </>
      ),
  },
  {
    key: "website",
    kind: "url",
    optional: true,
    autoComplete: "url",
    placeholder: "brand.com",
    ask: (a) => (
      <>
        {a.company} — great name. <b>Got a website we can peek at?</b> Totally fine if not.
      </>
    ),
  },
  {
    key: "budget",
    kind: "single",
    ask: (a) => (
      <>
        <b>What budget are you thinking for {a.company || "this"}?</b> A ballpark is perfect — there’s no wrong answer.
      </>
    ),
  },
  {
    key: "details",
    kind: "textarea",
    placeholder: "Goals, timeline, links, the dream… anything goes.",
    ask: () => (
      <>
        Now the fun part. <b>Tell us about the project</b> — your goals, the timeline, and anything that gets you excited.
      </>
    ),
  },
  {
    key: "email",
    kind: "email",
    autoComplete: "email",
    placeholder: "you@brand.com",
    ask: (_a, f) => (
      <>
        Love it. Last one, {f} — <b>where should we send our reply?</b>
      </>
    ),
  },
];

const REVIEW = steps.length;

/** What the visitor's bubble shows for an answer. */
function shown(step: Step, a: Answers): string {
  switch (step.key) {
    case "services":
      return a.services.length ? a.services.join(" · ") : NOT_SURE;
    case "website":
      return a.website || "No website yet";
    case "budget":
      return a.budget || NOT_SURE;
    default:
      return a[step.key] as string;
  }
}

const empty: Answers = { name: "", services: [], company: "", website: "", budget: "", details: "", email: "" };

const chipTone = ["bg-blush text-white", "bg-grape text-white", "bg-lagoon text-white", "bg-sunbeam text-ink"];
const chip =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-[clamp(0.9rem,1.1vw,1.3rem)] py-[clamp(0.55rem,0.6vw,0.75rem)] font-copy text-[clamp(0.875rem,0.9vw,1.0625rem)] leading-tight font-medium transition-[background-color,color,border-color,translate] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grape active:translate-y-px";
const pop = "motion-safe:animate-[chat-pop_0.38s_cubic-bezier(0.2,0.9,0.3,1.35)_both]";

function Avatar() {
  return (
    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-blush font-pop text-[1.35rem] leading-none text-white shadow-[0_4px_12px_rgb(242_119_147/0.35)]">
      P
    </span>
  );
}

function Bot({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <li className={`flex max-w-[92%] items-end gap-2.5 self-start ${pop}`}>
      <Avatar />
      <p id={id} className="rounded-[22px] rounded-bl-md bg-cream px-[clamp(1rem,1.25vw,1.4rem)] py-[clamp(0.7rem,0.85vw,0.95rem)] font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.5] text-ink [&_b]:font-semibold [&_b]:text-grape">
        <span className="sr-only">Pixel Popers: </span>
        {children}
      </p>
    </li>
  );
}

function Typing() {
  return (
    <li className={`flex items-end gap-2.5 self-start ${pop}`} aria-label="Pixel Popers is typing">
      <Avatar />
      <span className="flex gap-1.5 rounded-[22px] rounded-bl-md bg-cream px-5 py-4">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-grape/60 motion-safe:animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </span>
    </li>
  );
}

function Mine({ children, onEdit }: { children: ReactNode; onEdit?: () => void }) {
  return (
    <li className={`flex max-w-[88%] flex-col items-end gap-1 self-end ${pop}`}>
      <p className="rounded-[22px] rounded-br-md bg-grape px-[clamp(1rem,1.25vw,1.4rem)] py-[clamp(0.7rem,0.85vw,0.95rem)] font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.5] whitespace-pre-line break-words text-white">
        <span className="sr-only">You: </span>
        {children}
      </p>
      {onEdit ? (
        <button type="button" onClick={onEdit} className="px-2 font-copy text-[0.8125rem] text-ink/50 underline-offset-2 hover:text-grape hover:underline">
          Edit
        </button>
      ) : null}
    </li>
  );
}

export default function ContactForm({
  CONTACT_EMAIL = DEFAULT_CONTACT_EMAIL,
  contactForm = defaultContactForm,
  variant = "page",
  titleId = "form-title",
}: {
  CONTACT_EMAIL?: string;
  contactForm?: typeof defaultContactForm;
  /** "widget": inside the pop-up chat (no card of its own, a smaller header). */
  variant?: "page" | "widget";
  /** The title's id (the pop-up chat can be on the same page as the contact form). */
  titleId?: string;
} = {}) {
  const widget = variant === "widget";
  const [rawAnswers, setAnswers] = useState<Answers>(empty);
  const [rawStep, setStep] = useState(0);
  /** They edited the name the welcome intro gave us (so ask it like anyone else). */
  const [nameTouched, setNameTouched] = useState(false);

  // A visitor who told the welcome intro their name skips that question.
  const knownName = useVisitor()?.name ?? "";
  const returning = Boolean(knownName) && !nameTouched && (rawAnswers.name === "" || rawAnswers.name === knownName);
  const answers = returning && !rawAnswers.name ? { ...rawAnswers, name: knownName } : rawAnswers;
  const step = returning && rawStep === 0 ? 1 : rawStep;
  /** The bot is "typing" the current question. The first one is on screen from the start. */
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<"inbox" | "mail" | null>(null);
  /** Whether to jump straight back to the review after an edit. */
  const [returnToReview, setReturnToReview] = useState(false);

  const uid = useId();
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLLIElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const thanksRef = useRef<HTMLLIElement>(null);

  const f = first(answers.name);
  const current = step < REVIEW ? steps[step] : null;

  // The reply box starts from any earlier answer to that question (after an edit).
  const prefill = (index: number, a: Answers) => {
    const value = index < REVIEW ? a[steps[index].key] : "";
    setPicked(Array.isArray(value) ? value : []);
    setDraft(Array.isArray(value) ? "" : value);
  };

  // A beat of "typing…" before each new question (none under reduced motion).
  const go = (next: number, a: Answers = answers) => {
    started.current = true;
    setHint(null);
    setError(null);
    prefill(next, a);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStep(next);
    if (reduce) return;
    setTyping(true);
    window.setTimeout(() => setTyping(false), next === REVIEW ? 900 : 650);
  };

  useEffect(() => {
    if (!started.current || typing) return;
    endRef.current?.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    inputRef.current?.focus({ preventScroll: true });
  }, [step, typing, sent]);

  useGSAP(
    () => {
      const panel = thanksRef.current;
      if (!sent || !panel) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        tl.to(panel.querySelector("[data-thanks='title']"), squashPop(0.7), 0.1);
        burst(tl, panel.querySelector("[data-wm='burst']"), 0.2, 160);
      });
    },
    { dependencies: [sent] },
  );

  function answer(value: string | string[]) {
    if (!current) return;
    const next = { ...answers, [current.key]: value } as Answers;
    setAnswers(next);
    // Remember the name for greetings around the site.
    if (current.key === "name" && typeof value === "string" && value) saveVisitorName(value);
    if (returnToReview) {
      setReturnToReview(false);
      go(REVIEW, next);
    } else go(step + 1, next);
  }

  function sendText() {
    if (!current) return;
    const value = draft.trim();
    if (!value && !current.optional) {
      setHint(current.key === "details" ? "Even a sentence or two helps us prepare." : "Just need a quick answer here 🙂");
      return;
    }
    if (current.kind === "email" && !emailOk(value)) {
      setHint("Hmm, that email doesn’t look quite right — mind checking it?");
      return;
    }
    answer(value);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const textarea = current?.kind === "textarea";
    if (e.key === "Enter" && (!textarea || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendText();
    }
  }

  function edit(index: number) {
    started.current = true;
    setReturnToReview(step === REVIEW);
    setHint(null);
    setError(null);
    if (index === 0) setNameTouched(true);
    prefill(index, answers);
    setStep(index);
  }

  async function send() {
    setSending(true);
    setError(null);
    const result = await submitForm("contact", {
      name: answers.name,
      email: answers.email,
      company: answers.company,
      website: answers.website || null,
      services: answers.services,
      budget: answers.budget || NOT_SURE,
      details: answers.details,
      _gotcha: honeypot.current?.value ?? "",
    });
    setSending(false);

    if (result.ok) {
      setSent("inbox");
      return;
    }
    if (!result.offline) {
      setError(Object.values(result.errors ?? {})[0]?.[0] ?? result.message);
      return;
    }

    // The CMS is unreachable: hand the brief to the visitor's mail app instead.
    const lines = [
      `Name: ${answers.name}`,
      `Email: ${answers.email}`,
      `Company / brand: ${answers.company}`,
      `Website: ${answers.website || "—"}`,
      `Services: ${answers.services.length ? answers.services.join(", ") : NOT_SURE}`,
      `Budget: ${answers.budget || NOT_SURE}`,
      "",
      answers.details,
    ];
    const subject = `New project enquiry from ${answers.name || "the website"}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent("mail");
  }

  function restart() {
    setAnswers(empty);
    setSent(null);
    setReturnToReview(false);
    setNameTouched(false);
    go(0, empty);
  }

  const questionId = `${uid}-q`;
  const field =
    "min-w-0 flex-1 rounded-[18px] border border-ink/12 bg-cream/60 px-5 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] text-ink placeholder:text-ink/45 focus:border-grape focus:outline-2 focus:outline-grape";
  const sendButton =
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[18px] bg-blush px-5 font-display text-nav text-white uppercase transition-colors hover:bg-grape disabled:opacity-60";

  return (
    <div className={widget ? "px-5 pt-1 pb-5" : "rounded-[clamp(1.75rem,2.08vw,2.5rem)] bg-white p-[clamp(1.25rem,2.9vw,3.5rem)] shadow-[0_24px_60px_rgb(34_1_40/0.15)]"}>
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-ink/10 pb-[clamp(1rem,1.25vw,1.5rem)]">
        <span aria-hidden className="relative grid size-12 shrink-0 place-items-center rounded-full bg-blush font-pop text-[1.75rem] leading-none text-white">
          P
          <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-white bg-[#3ccf7a]" />
        </span>
        <div className="min-w-0">
          <h2 id={titleId} className={`font-display leading-tight text-grape uppercase ${widget ? "text-[1.375rem]" : "text-[clamp(1.5rem,1.88vw,2.25rem)]"}`}>
            {contactForm.title}
          </h2>
          <p className="font-copy text-[0.875rem] text-ink/55">Pixel Popers · online — a real human reads every message</p>
        </div>
      </div>

      <ol role="log" aria-live="polite" aria-label="Chat with Pixel Popers" className="mt-[clamp(1.25rem,1.5vw,1.75rem)] flex flex-col gap-3.5">
        {/* Answered questions */}
        {steps.slice(0, Math.min(step, REVIEW)).map((s, i) =>
          returning && i === 0 ? null : (
            <QuestionAndAnswer key={s.key} ask={s.ask(answers, f, returning)} answer={shown(s, answers)} onEdit={sent || sending ? undefined : () => edit(i)} />
          ),
        )}

        {/* The current question */}
        {!sent && typing ? <Typing /> : null}
        {!sent && !typing && current ? <Bot id={questionId}>{current.ask(answers, f, returning)}</Bot> : null}
        {!sent && !typing && step === REVIEW ? (
          <>
            <Bot id={questionId}>
              Here’s your brief, {f} — <b>all good?</b> Hit send and it lands straight in the founders’ inbox.
            </Bot>
            <li className={`self-stretch ${pop}`}>
              <dl className="grid gap-x-6 gap-y-2.5 rounded-[22px] border border-ink/10 bg-cream/40 p-[clamp(1rem,1.4vw,1.5rem)] font-copy text-[0.9375rem] sm:grid-cols-[auto_1fr]">
                {steps.map((s, i) => (
                  <div key={s.key} className="contents">
                    <dt className="font-haas text-ink/55">{{ name: "Name", services: "Services", company: "Brand", website: "Website", budget: "Budget", details: "Project", email: "Email" }[s.key]}</dt>
                    <dd className="flex min-w-0 items-start justify-between gap-3 text-ink max-sm:mb-1.5">
                      <span className="line-clamp-3 break-words whitespace-pre-line">{shown(s, answers)}</span>
                      <button type="button" onClick={() => edit(i)} className="shrink-0 text-[0.8125rem] text-grape underline-offset-2 hover:underline">
                        Edit
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          </>
        ) : null}

        {error ? (
          <Bot>
            Hmm, something didn’t go through: {error} Mind checking that and sending again?
          </Bot>
        ) : null}

        {sent ? (
          <>
            <Mine>Send it! 🚀</Mine>
            <li ref={thanksRef} role="status" className={`relative flex max-w-[92%] items-end gap-2.5 self-start ${pop}`}>
              <Avatar />
              <div className="rounded-[22px] rounded-bl-md bg-cream px-[clamp(1rem,1.25vw,1.4rem)] py-[clamp(0.8rem,1vw,1.1rem)] font-copy text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.55] text-ink">
                <p data-thanks="title" className="inline-block font-display text-[clamp(1.25rem,1.56vw,1.875rem)] leading-tight text-blush-ink uppercase">
                  Got it, {f}! 🎉
                </p>
                <p className="mt-2">
                  {sent === "inbox" ? (
                    <>
                      Your brief is with the founders. Expect a reply within one working day at <b className="font-semibold text-grape">{answers.email}</b> — we’re already a little excited.
                    </>
                  ) : (
                    <>
                      Your mail app should have opened with everything filled in — just hit send there. If nothing popped up, write to us at{" "}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-grape underline">
                        {CONTACT_EMAIL}
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
              <Burst pieces={18} ring="border-blush" className="top-6 left-24 size-0" />
            </li>
          </>
        ) : null}
        <li ref={endRef} aria-hidden className="h-px" />
      </ol>

      {/* Honeypot: hidden from people, filled in by bots (the CMS ignores those). */}
      <input ref={honeypot} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {/* Reply area */}
      <div className="mt-[clamp(1.25rem,1.5vw,1.75rem)] border-t border-ink/10 pt-[clamp(1rem,1.25vw,1.5rem)]">
        {sent ? (
          <button type="button" onClick={restart} className="font-display text-micro text-grape uppercase underline-offset-4 hover:underline">
            ↺ Start a new conversation
          </button>
        ) : typing ? (
          <p className="font-copy text-[0.9375rem] text-ink/45">Pixel Popers is typing…</p>
        ) : step === REVIEW ? (
          <div className="flex flex-col items-start gap-4">
            <button
              type="button"
              onClick={send}
              disabled={sending}
              aria-busy={sending}
              className="group inline-flex h-[clamp(3.25rem,3.54vw,4.25rem)] items-center bg-blush px-[clamp(1.25rem,1.25vw,1.5rem)] font-display text-nav text-white uppercase transition-colors hover:bg-grape disabled:opacity-60"
            >
              {sending ? "Sending…" : contactForm.submit}
              <span aria-hidden className="ml-3 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            <p className="font-copy text-[0.9375rem] text-ink/55">{contactForm.fine}</p>
          </div>
        ) : current?.kind === "multi" ? (
          <fieldset aria-labelledby={questionId}>
            <div className="flex flex-wrap gap-2.5">
              {contactForm.services.map((s, i) => {
                const on = picked.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPicked(on ? picked.filter((p) => p !== s) : [...picked, s])}
                    className={`${chip} ${on ? `border-transparent ${chipTone[i % chipTone.length]}` : "border-ink/15 bg-cream/60 text-ink hover:border-ink/40"}`}
                  >
                    {on ? <span aria-hidden>✓</span> : null}
                    {s}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => answer(picked)} className={`${sendButton} mt-4 h-12`}>
              {picked.length ? "That’s the lot" : NOT_SURE} <span aria-hidden>→</span>
            </button>
          </fieldset>
        ) : current?.kind === "single" ? (
          <fieldset aria-labelledby={questionId}>
            <div className="flex flex-wrap gap-2.5">
              {[...contactForm.budgets, NOT_SURE].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => answer(b === NOT_SURE ? "" : b)}
                  className={`${chip} border-ink/15 bg-cream/60 text-ink hover:border-transparent hover:bg-sunbeam`}
                >
                  {b}
                </button>
              ))}
            </div>
          </fieldset>
        ) : current ? (
          <div>
            <div className="flex items-end gap-2.5">
              {current.kind === "textarea" ? (
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKey}
                  aria-labelledby={questionId}
                  aria-invalid={hint ? true : undefined}
                  rows={4}
                  maxLength={10000}
                  placeholder={current.placeholder}
                  className={`${field} min-h-32 resize-y py-4`}
                />
              ) : (
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKey}
                  aria-labelledby={questionId}
                  aria-invalid={hint ? true : undefined}
                  type={current.kind === "email" ? "email" : "text"}
                  inputMode={current.kind === "url" ? "url" : current.kind === "email" ? "email" : undefined}
                  autoComplete={current.autoComplete}
                  maxLength={255}
                  placeholder={current.placeholder}
                  className={`${field} h-14`}
                />
              )}
              <button type="button" onClick={sendText} aria-label="Send reply" className={`${sendButton} size-14 px-0`}>
                <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-none stroke-current" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 font-copy text-[0.8125rem]">
              {hint ? (
                <p role="alert" className="text-blush-deep">
                  {hint}
                </p>
              ) : (
                <p className="text-ink/45">{current.kind === "textarea" ? "Ctrl + Enter to send" : "Press Enter to send"}</p>
              )}
              {current.optional ? (
                <button type="button" onClick={() => answer("")} className="text-grape underline-offset-2 hover:underline">
                  No website yet →
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function QuestionAndAnswer({ ask, answer, onEdit }: { ask: ReactNode; answer: string; onEdit?: () => void }) {
  return (
    <>
      <Bot>{ask}</Bot>
      <Mine onEdit={onEdit}>{answer}</Mine>
    </>
  );
}
