"use client";

import gsap from "gsap";
import Image from "next/image";
import { Fragment, useRef } from "react";

import Breadcrumb from "@/components/inner/Breadcrumb";
import ContactForm from "@/components/inner/contact/ContactForm";
import { usePopHero } from "@/components/inner/motion/usePopHero";
import { CONTACT_EMAIL, contactHero, contactInfo } from "@/lib/pages/contact";
import { owners } from "@/lib/site-content";

const avatarBg = ["bg-sunbeam", "bg-lagoon", "bg-blush"];
const kicker = "font-display text-[clamp(0.875rem,0.94vw,1.125rem)] leading-none text-blush uppercase";

/** Each letter in its own inline-block (words kept whole so lines wrap cleanly). */
function Chars({ text }: { text: string }) {
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 ? " " : null}
      <span className="inline-block whitespace-nowrap">
        {Array.from(word).map((ch, c) => (
          <span key={c} data-whero="char" className="inline-block will-change-transform">
            {ch}
          </span>
        ))}
      </span>
    </Fragment>
  ));
}

/*
  Hero + "say hello" column + project form of Figma frame 337:21. Headline
  offsets are percentages of the shell width (1588 at 1920): lines one and
  two start at x 495 (20.7%), "POP!" at x 324 (9.95%).

  Motion: the shared pop hero (see `usePopHero`) for the headline, plus — the
  "say hello" column builds item by item (the email rises, the response card
  pops with its green dot pulsing, the founders' avatars spin in one after
  another, the social pills pop, the doodle spins), and the form card rises
  in tilted while its chips pop. Both ship hidden so they don't flash first.
*/
export default function Intro() {
  const [l1, l2, l3] = contactHero.lines;
  const rootRef = useRef<HTMLElement>(null);

  usePopHero(rootRef, {
    entrance: (tl, q) => {
      tl.fromTo(q("[data-whero='hello']"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 1.2)
        .fromTo(q("[data-whero='card']"), { scale: 0.6, rotation: -6, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(2)" }, 1.45)
        .fromTo(
          q("[data-whero='avatar']"),
          { scale: 0, rotation: -180, x: -30 },
          { scale: 1, rotation: 0, x: 0, duration: 0.5, stagger: 0.12, ease: "back.out(2.2)" },
          1.7,
        )
        .fromTo(
          q("[data-whero='social']"),
          { scale: 0, rotation: (i) => (i % 2 ? 14 : -14) },
          { scale: 1, rotation: 0, duration: 0.4, stagger: 0.06, ease: "back.out(2.6)" },
          2.0,
        )
        .fromTo(q("[data-whero='doodle']"), { scale: 0, rotation: -200, autoAlpha: 0 }, { scale: 1, rotation: -15, autoAlpha: 1, duration: 0.8, ease: "back.out(1.6)" }, 2.2)
        .fromTo(
          q("[data-whero='form']"),
          { y: 160, rotation: 4, autoAlpha: 0 },
          { y: 0, rotation: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.3)" },
          1.3,
        )
        .fromTo(
          q("[data-whero='form'] label"),
          { scale: 0.6, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.35, stagger: 0.03, ease: "back.out(2.2)" },
          1.8,
        );
      // The "online" dot never stops pulsing.
      const dot = q("[data-whero='online']");
      gsap.fromTo(dot, { boxShadow: "0 0 0 0 rgb(46 194 126 / 0.6)" }, { boxShadow: "0 0 0 10px rgb(46 194 126 / 0)", duration: 1.4, repeat: -1, ease: "power1.out" });
    },
  });

  return (
    <section ref={rootRef} aria-labelledby="contact-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div aria-hidden data-whero="glow-out" className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)]">
        <div
          data-whero="glow"
          className="absolute inset-0 bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_36%_22%_at_49%_62%,rgb(159_201_204/0.5),transparent_75%)]"
        />
      </div>

      <div className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <div data-whero="crumb-out">
          <div data-whero="crumb">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          </div>
        </div>

        <h1 id="contact-title" aria-label={`${l1} ${l2} ${l3}`} className="mt-[clamp(2rem,3.1vw,3.75rem)] uppercase">
          <span aria-hidden data-whero="reveal" className="invisible block">
            <span data-whero-line="1" className="ml-[4%] block font-display text-hero-sm leading-[1.07] text-blush sm:ml-[20.7%]">
              <Chars text={l1} />
            </span>
            <span data-whero-line="2" className="ml-[4%] block font-haas text-hero-md leading-[1.05] tracking-[-0.033em] text-grape sm:ml-[20.7%]">
              <Chars text={l2} />
            </span>
            <span data-whero-line="3" className="block font-display text-[clamp(3.5rem,10.4vw,12.5rem)] leading-[1.1] text-lagoon sm:ml-[9.95%]">
              <Chars text={l3} />
            </span>
          </span>
        </h1>

        <div className="mt-[clamp(2.5rem,4.9vw,5.875rem)] grid gap-12 lg:-mr-[clamp(0rem,2.4vw,2.875rem)] lg:grid-cols-[minmax(0,560fr)_minmax(0,960fr)] lg:gap-[clamp(2rem,5.9vw,7.125rem)]">
          {/* Ships hidden like the lines (`reveal`), so it doesn't flash before the entrance. */}
          <div data-whero="reveal" className="invisible flex flex-col items-start lg:pt-10">
            <p data-whero="hello" className={kicker}>{contactInfo.sayHello}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              data-whero="hello"
              className="mt-3.5 font-haas text-[clamp(1.5rem,2.3vw,2.75rem)] leading-tight break-all text-grape transition-colors hover:text-blush"
            >
              {CONTACT_EMAIL}
            </a>

            <div data-whero="card" className="mt-[clamp(1.75rem,2.9vw,3.5rem)] w-full max-w-[35rem] rounded-3xl border border-white bg-white/70 px-8 py-8">
              <p className="flex items-center gap-3.5 font-haas text-small leading-tight text-ink">
                <span aria-hidden data-whero="online" className="size-3.5 rounded-full bg-[#2EC27E]" />
                {contactInfo.response.title}
              </p>
              <p className="mt-5 font-copy text-[clamp(0.9375rem,0.89vw,1.0625rem)] leading-[1.53] text-ink/70">{contactInfo.response.body}</p>
            </div>

            <p data-whero="hello" className={`${kicker} mt-[clamp(2rem,2.6vw,3.125rem)]`}>{contactInfo.talkTo}</p>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex">
                {owners.map((o, i) => (
                  <Image
                    key={o.name}
                    src={o.avatar}
                    alt={o.name}
                    width={96}
                    height={96}
                    data-whero="avatar"
                    className={`size-[clamp(4rem,5vw,6rem)] rounded-full border-[5px] border-cream object-cover ${avatarBg[i]} ${i ? "-ml-[clamp(1rem,1.25vw,1.5rem)]" : ""}`}
                  />
                ))}
              </div>
              <p data-whero="hello" className="flex flex-col gap-1.5">
                <span className="font-haas text-small leading-tight text-ink">{contactInfo.founders.names}</span>
                <span className="font-copy text-[clamp(0.875rem,0.89vw,1.0625rem)] text-ink/70">{contactInfo.founders.line}</span>
              </p>
            </div>

            <p data-whero="hello" className={`${kicker} mt-[clamp(2rem,3.1vw,3.75rem)]`}>{contactInfo.follow}</p>
            <ul className="relative z-10 mt-4 flex flex-wrap gap-2.5">
              {contactInfo.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-whero="social"
                    className="inline-block rounded-full bg-white px-5 py-3 font-copy text-[clamp(0.9375rem,0.89vw,1.0625rem)] leading-none font-medium text-grape transition-colors hover:bg-grape hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* Yellow loop doodle tucked under the social pills (Figma 337:41). */}
            <Image
              aria-hidden
              src="/assets/inner/contact/doodle-loop.svg"
              alt=""
              width={283}
              height={256}
              data-whero="doodle"
              className="pointer-events-none -mt-[clamp(1.5rem,2.1vw,2.5rem)] ml-[clamp(2rem,6vw,7.25rem)] hidden h-auto w-[clamp(8rem,12.4vw,15rem)] motion-reduce:-rotate-[15deg] lg:block"
            />
          </div>

          <div data-whero-reveal className="invisible">
            <div data-whero="form">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
