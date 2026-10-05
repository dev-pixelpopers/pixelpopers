import Image from "next/image";
import Breadcrumb from "@/components/inner/Breadcrumb";
import ContactForm from "@/components/inner/contact/ContactForm";
import { CONTACT_EMAIL, contactHero, contactInfo } from "@/lib/pages/contact";
import { owners } from "@/lib/site-content";

const avatarBg = ["bg-sunbeam", "bg-lagoon", "bg-blush"];
const kicker = "font-display text-[clamp(0.875rem,0.94vw,1.125rem)] leading-none text-blush uppercase";

/*
  Hero + "say hello" column + project form of Figma frame 337:21. Headline
  offsets are percentages of the shell width (1588 at 1920): lines one and
  two start at x 495 (20.7%), "POP!" at x 324 (9.95%).
*/
export default function Intro() {
  const [l1, l2, l3] = contactHero.lines;

  return (
    <section aria-labelledby="contact-title" className="relative isolate">
      {/* Decorative glows bleed up behind the header, so they can't sit in flow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 -z-10 h-[clamp(40rem,62vw,74rem)] bg-[radial-gradient(ellipse_27%_32%_at_50%_10%,rgb(242_119_147/0.38),transparent_75%),radial-gradient(ellipse_36%_22%_at_49%_62%,rgb(159_201_204/0.5),transparent_75%)]"
      />

      <div className="shell pt-[clamp(1rem,2.6vw,3.125rem)]">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

        <h1 id="contact-title" data-reveal className="mt-[clamp(2rem,3.1vw,3.75rem)] uppercase">
          <span className="ml-[4%] block font-display text-hero-sm leading-[1.07] text-blush sm:ml-[20.7%]">{l1}</span>
          <span className="ml-[4%] block font-haas text-hero-md leading-[1.05] tracking-[-0.033em] text-grape sm:ml-[20.7%]">{l2}</span>
          <span className="block font-display text-[clamp(3.5rem,10.4vw,12.5rem)] leading-[1.1] text-lagoon sm:ml-[9.95%]">{l3}</span>
        </h1>

        <div className="mt-[clamp(2.5rem,4.9vw,5.875rem)] grid gap-12 lg:-mr-[clamp(0rem,2.4vw,2.875rem)] lg:grid-cols-[minmax(0,560fr)_minmax(0,960fr)] lg:gap-[clamp(2rem,5.9vw,7.125rem)]">
          <div data-reveal className="flex flex-col items-start lg:pt-10">
            <p className={kicker}>{contactInfo.sayHello}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3.5 font-haas text-[clamp(1.5rem,2.3vw,2.75rem)] leading-tight break-all text-grape transition-colors hover:text-blush"
            >
              {CONTACT_EMAIL}
            </a>

            <div className="mt-[clamp(1.75rem,2.9vw,3.5rem)] w-full max-w-[35rem] rounded-3xl border border-white bg-white/70 px-8 py-8">
              <p className="flex items-center gap-3.5 font-haas text-small leading-tight text-ink">
                <span aria-hidden className="size-3.5 rounded-full bg-[#2EC27E]" />
                {contactInfo.response.title}
              </p>
              <p className="mt-5 font-copy text-[clamp(0.9375rem,0.89vw,1.0625rem)] leading-[1.53] text-ink/70">{contactInfo.response.body}</p>
            </div>

            <p className={`${kicker} mt-[clamp(2rem,2.6vw,3.125rem)]`}>{contactInfo.talkTo}</p>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex">
                {owners.map((o, i) => (
                  <Image
                    key={o.name}
                    src={o.avatar}
                    alt={o.name}
                    width={96}
                    height={96}
                    className={`size-[clamp(4rem,5vw,6rem)] rounded-full border-[5px] border-cream object-cover ${avatarBg[i]} ${i ? "-ml-[clamp(1rem,1.25vw,1.5rem)]" : ""}`}
                  />
                ))}
              </div>
              <p className="flex flex-col gap-1.5">
                <span className="font-haas text-small leading-tight text-ink">{contactInfo.founders.names}</span>
                <span className="font-copy text-[clamp(0.875rem,0.89vw,1.0625rem)] text-ink/70">{contactInfo.founders.line}</span>
              </p>
            </div>

            <p className={`${kicker} mt-[clamp(2rem,3.1vw,3.75rem)]`}>{contactInfo.follow}</p>
            <ul className="relative z-10 mt-4 flex flex-wrap gap-2.5">
              {contactInfo.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
              className="pointer-events-none -mt-[clamp(1.5rem,2.1vw,2.5rem)] ml-[clamp(2rem,6vw,7.25rem)] hidden h-auto w-[clamp(8rem,12.4vw,15rem)] -rotate-[15deg] lg:block"
            />
          </div>

          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
