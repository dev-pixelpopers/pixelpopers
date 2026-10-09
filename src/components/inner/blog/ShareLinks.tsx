"use client";

import { useState } from "react";

/** Figma "SHARE" column: LinkedIn, X, Facebook and copy-link circles. */
export default function ShareLinks({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    {
      label: "in",
      name: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      label: "X",
      name: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    },
    {
      label: "f",
      name: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
  ];
  const circle =
    "grid size-14 place-items-center rounded-full bg-white font-copy text-lg font-bold text-grape transition-colors hover:bg-blush hover:text-white";

  return (
    <div className="flex items-center gap-4 lg:flex-col lg:items-start">
      <p className="font-display text-micro text-blush-deep uppercase">Share</p>
      <ul className="flex gap-3 lg:flex-col">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.name}
              className={circle}
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label={copied ? "Link copied" : "Copy link"}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                /* clipboard unavailable — nothing to do */
              }
            }}
            className={circle}
          >
            {copied ? "✓" : "↗"}
          </button>
        </li>
      </ul>
    </div>
  );
}
