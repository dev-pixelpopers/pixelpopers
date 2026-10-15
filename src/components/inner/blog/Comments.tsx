"use client";

import { useState } from "react";
import type { Comment } from "@/lib/pages/blog";
import { toneFill } from "./tones";
import { submitForm } from "@/lib/forms";

/**
 * Figma "COMMENTS (3)" + comment box. The comments are static; posting
 * shows a thank-you note (comments are moderated before they appear).
 */
/** `slug`: the post new comments are sent to (they appear once approved in the CMS). */
export default function Comments({ comments, slug }: { comments: Comment[]; slug: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section aria-labelledby="comments-title" className="flex flex-col">
      <h2
        id="comments-title"
        className="font-display text-[clamp(1.5rem,1.67vw,2rem)] leading-tight text-grape uppercase"
      >
        Comments ({comments.length})
      </h2>
      <ul className="mt-7 flex flex-col gap-4">
        {comments.map((c) => (
          <li key={c.name} className="flex gap-4 rounded-3xl bg-white/80 p-6">
            <span
              aria-hidden
              className={`grid size-[3.25rem] shrink-0 place-items-center rounded-full font-display text-xl ${toneFill[c.tone]}`}
            >
              {c.name[0]}
            </span>
            <div className="flex min-w-0 flex-col pt-0.5">
              <p className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span className="font-copy text-lg font-bold text-ink">
                  {c.name}
                </span>
                <span className="font-copy text-[0.9375rem] text-ink/50">
                  {c.when}
                </span>
              </p>
              <p className="mt-2.5 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] leading-[1.58] text-ink">
                {c.text}
              </p>
              <span
                aria-hidden
                className="mt-4 font-display text-[0.8125rem] text-blush-deep uppercase"
              >
                Reply
              </span>
            </div>
          </li>
        ))}
      </ul>

      {sent ? (
        <p
          role="status"
          className="mt-6 rounded-3xl bg-white p-8 font-copy text-copy font-light text-ink"
        >
          <strong className="font-display text-grape uppercase">
            Thanks for joining in!
          </strong>
          <br />
          Your comment is with our team for a quick check and will appear here
          soon.
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setSending(true);
            setError(null);
            const result = await submitForm("comment", {
              slug,
              name: data.get("name"),
              email: data.get("email") || null,
              text: data.get("text"),
              _gotcha: data.get("_gotcha"),
            });
            setSending(false);
            if (result.ok) setSent(true);
            else setError(Object.values(result.errors ?? {})[0]?.[0] ?? result.message);
          }}
          className="mt-6 flex flex-col items-start gap-5"
        >
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="comment-name">
              Your name
            </label>
            <input id="comment-name" name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className="w-full rounded-full border border-grape bg-white px-6 py-4 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] text-ink outline-none placeholder:text-ink/50 focus:ring-2 focus:ring-blush" />
            <label className="sr-only" htmlFor="comment-email">
              Email (optional, never shown)
            </label>
            <input id="comment-email" name="email" type="email" autoComplete="email" placeholder="Email (optional, never shown)" className="w-full rounded-full border border-grape bg-white px-6 py-4 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] text-ink outline-none placeholder:text-ink/50 focus:ring-2 focus:ring-blush" />
          </div>
          <label htmlFor="comment-body" className="sr-only">
            Add a comment
          </label>
          <textarea
            id="comment-body"
            name="text"
            required
            maxLength={3000}
            rows={3}
            placeholder="Add a comment…"
            className="min-h-[7.5rem] w-full resize-y rounded-3xl border border-grape bg-white px-6 py-5 font-copy text-[clamp(1rem,0.99vw,1.1875rem)] text-ink outline-none placeholder:text-ink/50 focus:ring-2 focus:ring-blush"
          />
          {/* Pop-button look (block + overhanging label) as a real submit button. */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          {error ? (
            <p role="alert" className="font-copy text-[0.9375rem] text-blush-deep">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={sending} className="group grid text-nav disabled:opacity-60">
            <span
              aria-hidden
              className="col-start-1 row-start-1 h-[clamp(2.375rem,3.54vw,4.25rem)] w-[clamp(2.75rem,4.17vw,5rem)] bg-blush transition-all duration-300 group-hover:w-full group-hover:bg-sunbeam"
            />
            <span className="col-start-1 row-start-1 self-center px-5 font-display whitespace-nowrap text-grape uppercase group-hover:text-ink">
              Post comment
            </span>
          </button>
        </form>
      )}
    </section>
  );
}
