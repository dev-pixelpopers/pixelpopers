import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import GlowOrb from "@/components/ui/GlowOrb";
import PopButton from "@/components/ui/PopButton";
import { getHiddenPages, getServiceLinks, getSite, socialLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page has popped. Head back home or pick another way into the Pixel Popers site.",
  robots: { index: false, follow: true },
};

/** Where a lost visitor most likely meant to go. Pages switched off in the CMS are left out. */
const DETOURS = [
  { label: "Our work", letter: "W", href: "/work", page: "work", card: "bg-grape text-white", tilt: "-rotate-2" },
  { label: "Services", letter: "S", href: "/services", page: "services", card: "bg-blush text-white", tilt: "rotate-[1.5deg]" },
  { label: "The blog", letter: "B", href: "/blog", page: "blog", card: "bg-lagoon text-white", tilt: "-rotate-[1.5deg]" },
  { label: "Say hi", letter: "H", href: "/contact", page: "contact", card: "bg-sunbeam text-ink", tilt: "rotate-2" },
] as const;

/**
 * The 404 page, for any address that doesn't exist and for every
 * `notFound()` (a removed project, post or service). It sits outside the
 * (inner) group, so it brings the site header and footer itself.
 *
 * Design: the brand glow and doodles from the home hero, a giant Modak
 * "4 ✿ 4" whose zero is the spinning flower, and four tilted detour cards in
 * the same style as the contact page's "Other ways to say hi". Motion is CSS
 * only (and off under reduced motion), so the page needs no JavaScript of its own.
 */
export default async function NotFound() {
  const [site, services, hiddenPages] = await Promise.all([getSite(), getServiceLinks(), getHiddenPages()]);
  const detours = DETOURS.filter((d) => !hiddenPages.includes(d.page));

  return (
    <>
      <SiteHeader
        ctaHref="/contact"
        hiddenPages={hiddenPages}
        email={site.company_email}
        socials={socialLinks(site).map(({ label, href }) => ({ label, href }))}
      />

      <main id="main" className="relative isolate flex-1 overflow-x-clip">
        {/* Brand glow behind the numbers, as in the home hero. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-20vw] -z-10 flex justify-center max-md:top-[-10vh]">
          <GlowOrb className="w-[min(110vw,90rem)] max-w-none shrink-0 opacity-70" />
        </div>

        <section aria-labelledby="nf-title" className="shell flex flex-col items-center pt-[clamp(2rem,5vw,6rem)] pb-[clamp(4rem,7vw,8rem)] text-center">
          <p className="font-haas text-[clamp(0.9375rem,1.05vw,1.25rem)] tracking-[0.12em] text-blush-ink uppercase">
            Error 404 · Page not found
          </p>

          {/* "4 ✿ 4": the zero is the hero's flower doodle. */}
          <div aria-hidden className="relative mt-[clamp(0.5rem,1.5vw,1.5rem)] flex items-center justify-center font-pop leading-[0.8] select-none">
            <span className="text-[clamp(8rem,24vw,26rem)] text-grape [text-shadow:0_0.04em_0_rgb(34_1_40/0.12)] motion-safe:transition-transform motion-safe:duration-500 hover:-rotate-6">
              4
            </span>
            <span className="relative mx-[clamp(-1rem,-1vw,0rem)] grid w-[clamp(7rem,19vw,21rem)] place-items-center">
              <Image
                src="/icons/doodle-flower.svg"
                alt=""
                width={256}
                height={251}
                priority
                className="w-full motion-safe:animate-[spin_16s_linear_infinite]"
              />
              <Image
                src="/icons/doodle-sparkle.svg"
                alt=""
                width={244}
                height={206}
                className="absolute top-[2%] -right-[26%] w-[38%] rotate-12 motion-safe:animate-pulse"
              />
            </span>
            <span className="text-[clamp(8rem,24vw,26rem)] text-lagoon [text-shadow:0_0.04em_0_rgb(34_1_40/0.12)] motion-safe:transition-transform motion-safe:duration-500 hover:rotate-6">
              4
            </span>
          </div>

          <h1 id="nf-title" className="mt-[clamp(1.25rem,2.5vw,2.5rem)] max-w-[16ch] font-display text-h2 leading-[1.1] text-grape uppercase">
            Oops — this page <span className="text-blush-ink">popped</span>
          </h1>
          <p className="mt-5 max-w-[38rem] font-copy text-body leading-[1.6] font-light text-ink/85">
            The link may be old, the address may have a typo, or we moved things around while making the site poppin’.
            Let’s get you somewhere that exists.
          </p>

          <div className="mt-[clamp(2rem,3vw,3rem)] flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            <PopButton href="/" label="Back to home" />
            {hiddenPages.includes("contact") ? null : (
              <Link href="/contact" className="font-display text-nav text-grape uppercase underline decoration-[0.08em] underline-offset-[0.25em] hover:text-blush-deep">
                Tell us what you were after
              </Link>
            )}
          </div>
        </section>

        {detours.length ? (
          <nav aria-labelledby="nf-detours" className="shell pb-[clamp(5rem,8vw,10rem)]">
            <h2 id="nf-detours" className="text-center font-haas text-[clamp(0.9375rem,1.05vw,1.25rem)] tracking-[0.12em] text-blush-ink uppercase">
              Or take a detour
            </h2>
            {/* Same card language as the contact page's channel cards; they centre as a group. */}
            <ul className="mt-[clamp(1.5rem,2.5vw,3rem)] flex flex-wrap justify-center gap-(--nf-gap) [--nf-gap:clamp(1rem,1.04vw,1.25rem)]">
              {detours.map((d) => (
                <li key={d.href} className={`w-[calc((100%-var(--nf-gap))/2)] lg:w-[calc((100%-3*var(--nf-gap))/4)] ${d.tilt}`}>
                  <Link
                    href={d.href}
                    className={`group flex min-h-[clamp(8rem,11vw,13rem)] flex-col justify-between rounded-[clamp(1.25rem,1.67vw,2rem)] p-[clamp(1.25rem,1.67vw,2rem)] shadow-[0_20px_50px_rgb(34_1_40/0.15)] transition-transform duration-300 hover:-translate-y-1.5 ${d.card}`}
                  >
                    <span aria-hidden className="font-pop text-[clamp(2.5rem,3.6vw,4.5rem)] leading-none opacity-30">
                      {d.letter}
                    </span>
                    <span className="font-display text-[clamp(1.125rem,1.46vw,1.75rem)] leading-tight uppercase group-hover:underline">
                      {d.label} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </main>

      <SiteFooter tagline={site.footer_tagline} availability={site.availability_label} services={services} hiddenPages={hiddenPages} />
    </>
  );
}
