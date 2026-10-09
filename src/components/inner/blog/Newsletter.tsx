"use client";

import { useState } from "react";
import { newsletter } from "@/lib/pages/blog";

/**
 * Figma "Newsletter band": sunbeam card with a giant Modak "P" bleeding off
 * the right edge. Static form — submitting just swaps in a thank-you note.
 */
export default function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-title"
      className="mx-auto w-full max-w-[1920px] scroll-mt-10 px-[clamp(1.25rem,6.25vw,7.5rem)]"
    >
      <div className="grid overflow-hidden rounded-[clamp(1.75rem,2.5vw,3rem)] bg-sunbeam">
        {/* The giant letter shares the card's single grid cell and is clipped by it. */}
        <span
          aria-hidden
          className="col-start-1 row-start-1 -mt-[clamp(4rem,9.4vw,11.25rem)] mr-[clamp(-3rem,-1vw,0rem)] hidden self-start sm:block justify-self-end font-pop text-[clamp(16rem,36.5vw,43.75rem)] leading-none text-blush-ink/90 select-none"
        >
          P
        </span>
        <div className="col-start-1 row-start-1 flex flex-col px-[clamp(1.5rem,4.17vw,5rem)] py-[clamp(2.25rem,4.17vw,5rem)]">
          <h2
            id="newsletter-title"
            data-reveal
            className="font-display text-section leading-[1.1] text-ink uppercase"
          >
            {newsletter.title}
          </h2>
          <p className="mt-3 max-w-[40rem] font-copy text-[clamp(1rem,1.146vw,1.375rem)] leading-[1.64] font-light text-ink">
            {newsletter.body}
          </p>
          {done ? (
            <p
              role="status"
              className="mt-8 self-start rounded-full bg-ink px-8 py-5 font-display text-nav text-white uppercase"
            >
              You’re in! First email lands next month.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="mt-[clamp(1.5rem,1.46vw,1.75rem)] flex max-w-[52rem] flex-col gap-3 sm:flex-row"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@brand.com"
                className="h-[clamp(3.25rem,3.54vw,4.25rem)] w-full min-w-0 rounded-full sm:flex-1 bg-white px-[clamp(1.25rem,1.56vw,1.875rem)] font-copy text-[clamp(1rem,1.04vw,1.25rem)] text-ink outline-none placeholder:text-ink/50 focus:ring-2 focus:ring-ink sm:max-w-[32.5rem]"
              />
              <button
                type="submit"
                className="h-[clamp(3.25rem,3.54vw,4.25rem)] rounded-full bg-ink px-10 font-display text-[clamp(0.875rem,0.9375vw,1.125rem)] text-white uppercase transition-colors hover:bg-grape sm:w-[clamp(11rem,11.46vw,13.75rem)]"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
