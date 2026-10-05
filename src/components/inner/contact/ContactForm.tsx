"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL, contactForm } from "@/lib/pages/contact";

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
const step = "font-display text-micro tracking-wide text-blush uppercase";

/**
 * Figma "Project form": service + budget chips and the "about you" fields.
 * There is no backend yet, so submitting opens the visitor's mail app with
 * everything pre-filled and swaps the form for an inline thank-you.
 */
export default function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const services = data.getAll("services").map(String);
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
    setSent(name.split(" ")[0] || "friend");
  }

  return (
    <div className="rounded-[clamp(1.75rem,2.08vw,2.5rem)] bg-white p-[clamp(1.25rem,2.9vw,3.5rem)] shadow-[0_24px_60px_rgb(34_1_40/0.15)]">
      <h2 id="form-title" className="font-display text-[clamp(1.75rem,2.08vw,2.5rem)] leading-tight text-grape uppercase">
        {contactForm.title}
      </h2>

      {sent ? (
        <div role="status" className="mt-8 flex flex-col items-start gap-5 rounded-3xl bg-cream/60 p-[clamp(1.5rem,2.5vw,3rem)]">
          <p className="font-display text-[clamp(1.5rem,2.08vw,2.5rem)] leading-tight text-blush uppercase">Thanks, {sent}!</p>
          <p className="max-w-[40rem] font-copy text-body leading-[1.64] font-light text-ink">
            Your mail app should have opened with your brief ready to go — just hit send there. If nothing popped up, email us
            directly at{" "}
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
                  Your name <span aria-hidden className="text-blush">*</span>
                </span>
                <input name="name" required autoComplete="name" placeholder="Jane Doe" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3">
                <span className={label}>
                  Email <span aria-hidden className="text-blush">*</span>
                </span>
                <input name="email" type="email" required autoComplete="email" placeholder="jane@brand.com" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3">
                <span className={label}>
                  Company / brand <span aria-hidden className="text-blush">*</span>
                </span>
                <input name="company" required autoComplete="organization" placeholder="Brand name" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3">
                <span className={label}>Website (optional)</span>
                <input name="website" type="text" inputMode="url" autoComplete="url" placeholder="brand.com" className={`${field} h-[clamp(3.5rem,3.75vw,4.5rem)]`} />
              </label>
              <label className="flex flex-col gap-3 sm:col-span-2">
                <span className={label}>
                  Project details <span aria-hidden className="text-blush">*</span>
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

          <div className="flex flex-col items-start gap-5">
            <button
              type="submit"
              className="group inline-flex h-[clamp(3.25rem,3.54vw,4.25rem)] items-center bg-blush px-[clamp(1.25rem,1.25vw,1.5rem)] font-display text-nav text-white uppercase transition-colors hover:bg-grape"
            >
              {contactForm.submit}
              <span aria-hidden className="ml-3 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            <p className="font-copy text-[0.9375rem] text-ink/55">{contactForm.fine}</p>
          </div>
        </form>
      )}
    </div>
  );
}
