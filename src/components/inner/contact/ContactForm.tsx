"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, type FormEvent } from "react";

import { Burst } from "@/components/inner/motion/bits";
import { burst, squashPop } from "@/components/inner/motion/kit";
import { CONTACT_EMAIL as DEFAULT_CONTACT_EMAIL, contactForm as defaultContactForm } from "@/lib/pages/contact";
import { submitForm } from "@/lib/forms";

gsap.registerPlugin(useGSAP);

const serviceTone: Record<string, string> = {
  Branding: "peer-checked:bg-blush peer-checked:text-white",
  "UI/UX": "peer-checked:bg-grape peer-checked:text-white",
  "Web Development": "peer-checked:bg-lagoon peer-checked:text-white",
  Marketing: "peer-checked:bg-sunbeam peer-checked:text-ink",
  Motion: "peer-checked:bg-blush peer-checked:text-white",
  Content: "peer-checked:bg-lagoon peer-checked:text-white",
};

const chip =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 bg-cream/60 px-[clamp(1rem,1.2vw,1.4375rem)] py-[clamp(0.6rem,0.68vw,0.8125rem)] font-copy text-[clamp(0.9375rem,0.94vw,1.125rem)] leading-tight font-medium text-ink transition-colors peer-checked:border-transparent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grape hover:border-ink/40";
const field =
  "w-full rounded-[18px] border border-ink/12 bg-cream/60 px-6 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] text-ink placeholder:text-ink/45 focus:border-grape focus:outline-2 focus:outline-grape";
const label = "font-haas text-[0.9375rem] leading-none text-ink/70";
const step = "font-display text-micro tracking-wide text-blush-deep uppercase";

/**
 * Figma "Project form": service + budget chips and the "about you" fields.
 * Submitting sends the brief to the CMS inbox (via /api/forms/contact) and
 * swaps the form for an inline thank-you — which squash-pops in with a burst
 * of confetti (unless reduced motion is on). If the CMS can't be reached, it
 * falls back to opening the visitor's mail app with everything pre-filled.
 */
export default function ContactForm({ CONTACT_EMAIL = DEFAULT_CONTACT_EMAIL, contactForm = defaultContactForm }: { CONTACT_EMAIL?: string; contactForm?: typeof defaultContactForm } = {}) {
  const [sent, setSent] = useState<string | null>(null);
  /** How the brief went out: straight to the inbox, or through the visitor's mail app. */
  const [via, setVia] = useState<"inbox" | "mail">("inbox");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const thanksRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panel = thanksRef.current;
      if (!sent || !panel) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const title = panel.querySelector("[data-thanks='title']");
        gsap.set(title, { scale: 0, autoAlpha: 0, transformOrigin: "0% 80%" });
        const tl = gsap.timeline();
        tl.fromTo(panel, { y: 30, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.8)" }, 0).to(title, squashPop(0.7), 0.2);
        burst(tl, panel.querySelector("[data-wm='burst']"), 0.35, 160);
      });
    },
    { dependencies: [sent], scope: thanksRef },
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const services = data.getAll("services").map(String);
    const firstName = name.split(" ")[0] || "friend";

    setSending(true);
    setError(null);
    const result = await submitForm("contact", {
      name,
      email: data.get("email"),
      company: data.get("company"),
      website: data.get("website") || null,
      services,
      budget: data.get("budget"),
      details: data.get("details"),
      _gotcha: data.get("_gotcha"),
    });
    setSending(false);

    if (result.ok) {
      setVia("inbox");
      setSent(firstName);
      return;
    }
    if (!result.offline) {
      // Validation: show the first problem the CMS reported.
      setError(Object.values(result.errors ?? {})[0]?.[0] ?? result.message);
      return;
    }

    // The CMS is unreachable: hand the brief to the visitor's mail app instead.
    const lines = [
      `Name: ${name}`,
      `Email: ${data.get("email")}`,
      `Company / brand: ${data.get("company")}`,
      `Website: ${data.get("website") || "—"}`,
      `Services: ${services.length ? services.join(", ") : "Not sure yet"}`,
      `Budget: ${data.get("budget") ?? "Not sure yet"}`,
      "",
      String(data.get("details") ?? ""),
    ];
    const subject = `New project enquiry from ${name || "the website"}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setVia("mail");
    setSent(firstName);
  }

  return (
    <div className="rounded-[clamp(1.75rem,2.08vw,2.5rem)] bg-white p-[clamp(1.25rem,2.9vw,3.5rem)] shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
      <h2 id="form-title" className="font-display text-[clamp(1.75rem,2.08vw,2.5rem)] leading-tight text-grape uppercase">
        {contactForm.title}
      </h2>

      {sent ? (
        <div ref={thanksRef} role="status" className="relative mt-8 flex flex-col items-start gap-5 rounded-3xl bg-cream/60 p-[clamp(1.5rem,2.5vw,3rem)]">
          <p data-thanks="title" className="font-display text-[clamp(1.5rem,2.08vw,2.5rem)] leading-tight text-blush-ink uppercase">Thanks, {sent}!</p>
          <Burst pieces={18} ring="border-blush" className="top-[clamp(2.5rem,3.5vw,4rem)] left-[clamp(4rem,8vw,9rem)] size-0" />
          <p className="max-w-[40rem] font-copy text-body leading-[1.64] font-light text-ink">
            {via === "inbox"
              ? "Your brief is in our inbox. One of the founders will reply within one working day — keep an eye on your email. Anything to add? Write to us at "
              : "Your mail app should have opened with your brief ready to go — just hit send there. If nothing popped up, email us directly at "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-grape underline">
              {CONTACT_EMAIL}
            </a>{" "}
            and one of the founders will reply within one working day.
          </p>
          <button
            type="button"
            onClick={() => setSent(null)}
            className="font-display text-micro text-grape uppercase underline-offset-4 hover:underline"
          >
            ← Edit my message
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-[clamp(1.5rem,1.5vw,1.8rem)] flex flex-col gap-[clamp(2rem,2.6vw,3.125rem)]">
          <fieldset>
            <legend className={step}>01&nbsp;&nbsp;What do you need?</legend>
            <div className="mt-4 flex flex-wrap gap-x-2.5 gap-y-[clamp(0.625rem,1.04vw,1.25rem)]">
              {contactForm.services.map((s) => (
                <label key={s} className="relative">
                  <input
                    type="checkbox"
                    name="services"
                    value={s}
                    defaultChecked={contactForm.defaults.services.includes(s)}
                    className="peer sr-only"
                  />
                  <span className={`${chip} ${serviceTone[s]}`}>
                    <span aria-hidden className="hidden [input:checked+span>&]:inline">
                      ✓
                    </span>
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={step}>02&nbsp;&nbsp;Budget</legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {contactForm.budgets.map((b) => (
                <label key={b} className="relative">
                  <input
                    type="radio"
                    name="budget"
                    value={b}
                    defaultChecked={contactForm.defaults.budget === b}
                    className="peer sr-only"
                  />
                  <span className={`${chip} peer-checked:bg-sunbeam peer-checked:text-ink`}>
                    <span aria-hidden className="hidden [input:checked+span>&]:inline">
                      ✓
                    </span>
                    {b}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={step}>03&nbsp;&nbsp;About you</legend>
            <div className="mt-5 grid gap-x-5 gap-y-[1.875rem] sm:grid-cols-2">
              <label className="flex flex-col gap-3">
                <span className={label}>
                  Your name <span aria-hidden className="text-blush-ink">*</span>
                </span>
                <input name="name" required autoComplete="name" placeholder="Jane Doe" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3">
                <span className={label}>
                  Email <span aria-hidden className="text-blush-ink">*</span>
                </span>
                <input name="email" type="email" required autoComplete="email" placeholder="jane@brand.com" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3">
                <span className={label}>
                  Company / brand <span aria-hidden className="text-blush-ink">*</span>
                </span>
                <input name="company" required autoComplete="organization" placeholder="Brand name" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3">
                <span className={label}>Website (optional)</span>
                <input name="website" type="text" inputMode="url" autoComplete="url" placeholder="brand.com" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3 sm:col-span-2">
                <span className={label}>
                  Project details <span aria-hidden className="text-blush-ink">*</span>
                </span>
                <textarea
                  name="details"
                  required
                  rows={6}
                  placeholder="A few lines about your goals, timeline and anything that makes you excited…"
                  className={`${field} h-[clamp(10rem,10.4vw,12.5rem)] resize-y py-5`}
                />
              </label>
            </div>
          </fieldset>

          {/* Honeypot: hidden from people, filled in by bots (the CMS ignores those). */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div className="flex flex-col items-start gap-5">
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className="group inline-flex disabled:opacity-60 h-[clamp(3.25rem,3.54vw,4.25rem)] items-center bg-blush px-[clamp(1.25rem,1.25vw,1.5rem)] font-display text-nav text-white uppercase transition-colors hover:bg-grape"
            >
              {contactForm.submit}
              <span aria-hidden className="ml-3 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            {error ? (
              <p role="alert" className="font-copy text-[0.9375rem] text-blush-deep">
                {error}
              </p>
            ) : null}
            <p className="font-copy text-[0.9375rem] text-ink/55">{contactForm.fine}</p>
          </div>
        </form>
      )}
    </div>
  );
}
