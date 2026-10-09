/**
 * Copy and data for the Contact page (Figma frame 337:21 "08 — Contact").
 * Founder photos come from `owners` in site-content.
 */

import type { Quote } from "@/lib/pages/services";

export const CONTACT_EMAIL = "hello@pixelpopers.com";

export const contactMeta = {
  title: "Contact Pixel Popers | Start a Project or Say Hello",
  description:
    "Got a project? Tell Pixel Popers about it. Email hello@pixelpopers.com, book a free 30-minute call or send a brief — the founders reply within one working day.",
};

export const contactHero = {
  lines: ["Got a project?", "Let’s make it", "Pop!"] as const,
};

export const contactInfo = {
  sayHello: "Say hello",
  response: { title: "Usually replies within 24 hours", body: "Mon – Fri · Remote-first studio working with brands worldwide" },
  talkTo: "You’ll talk to one of us",
  founders: { names: "Adan, James & Barry", line: "The founders, not a sales team." },
  follow: "Follow the pop",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
  ],
};

export const contactForm = {
  title: "Tell us about it",
  services: ["Branding", "UI/UX", "Web Development", "Marketing", "Motion", "Content"],
  budgets: ["< $5k", "$5k – 15k", "$15k – 40k", "$40k +"],
  defaults: { services: ["Branding", "Web Development"], budget: "$5k – 15k" },
  fine: "By sending you agree to our Privacy Policy. We never share your details.",
  submit: "Send it, let’s pop",
};

export const nextSteps = {
  eyebrow: "What happens next",
  heading: "Three steps to poppin’",
  items: [
    { n: "1", title: "We read it", body: "A real human reads your brief and replies within a day.", card: "bg-blush text-white", tilt: "rotate-[1.5deg]" },
    { n: "2", title: "We chat", body: "A 30-minute call to understand your goals and vibe.", card: "bg-lagoon text-white", tilt: "-rotate-1" },
    { n: "3", title: "We propose", body: "A clear plan, timeline and quote — no surprises.", card: "bg-sunbeam text-ink", tilt: "rotate-[1.5deg]" },
  ],
};

export const channels = {
  eyebrow: "Pick your channel",
  heading: "Other ways to say hi",
  items: [
    { letter: "B", title: "Book a call", body: "30 minutes, no pressure, real advice.", cta: "Pick a slot", href: `mailto:${CONTACT_EMAIL}?subject=Book%20a%20discovery%20call`, card: "bg-grape text-white", tilt: "-rotate-2" },
    { letter: "E", title: "Email us", body: CONTACT_EMAIL, cta: "Send an email", href: `mailto:${CONTACT_EMAIL}`, card: "bg-blush text-white", tilt: "rotate-[1.5deg]" },
    { letter: "W", title: "WhatsApp", body: "Quick questions? Ping us.", cta: "Start a chat", href: "https://wa.me/", card: "bg-lagoon text-white", tilt: "-rotate-[1.5deg]" },
    { letter: "J", title: "Join the crew", body: "We’re hiring designers & devs.", cta: "See roles", href: `mailto:${CONTACT_EMAIL}?subject=Joining%20the%20crew`, card: "bg-sunbeam text-ink", tilt: "rotate-2" },
  ],
};

export const chatFaq = {
  heading: ["Before you", "hit send"],
  sub: "The questions we hear most — answered.",
  items: [
    { q: "What’s your minimum project size?", a: "Most projects start around $5k, but tell us your budget — we’ll find a way to make it pop.", bubble: "bg-blush" },
    { q: "Do you work with clients abroad?", a: "Yes! We’re remote-first and work with brands all over the world.", bubble: "bg-grape" },
    { q: "How fast can you start?", a: "Usually within 2 weeks of signing — sooner for small sprints.", bubble: "bg-lagoon" },
  ],
};

export const afterSend = {
  eyebrow: "The fine print",
  heading: "What happens after you hit send",
  lead: "No black holes, no pushy sales calls. Here is exactly what happens to your message, step by step, from the moment it lands in our inbox.",
  steps: [
    {
      title: "We read every word",
      body: "Your message lands in a shared inbox that the three founders check every morning and afternoon, UK time. No bots and no ticket numbers: one of us reads your brief properly, looks at your current website and socials, and notes anything we need to clarify. If your project isn't the right fit for us, we will tell you honestly and point you towards someone who is a better match.",
    },
    {
      title: "A real reply within one working day",
      body: "Within one working day you will get a personal reply with a few follow-up questions and a link to book a free 30-minute discovery call at a time that suits you. If you have already shared a detailed brief, we may skip straight to suggested dates. Prefer to keep things on email? That is completely fine too — we will happily work at whatever pace suits you.",
    },
    {
      title: "A friendly discovery call",
      body: "On the call we talk through your goals, audience, timeline and budget, and you can ask us anything — how we work, who would be on your team and what similar projects have looked like. It is a conversation, not a sales pitch. Afterwards we send a short written recap, so everyone is on the same page before a single pixel moves.",
    },
    {
      title: "A clear, fixed proposal",
      body: "Within three to five working days you receive a written proposal with a recommended scope, a fixed project price or monthly retainer, a realistic timeline and the names of the people who will do the work. Once you are happy, we sign, book a kick-off workshop and get poppin'. Nothing starts — and nothing is invoiced — until you have said yes.",
    },
  ],
};

export const whereWhen = {
  eyebrow: "Where & when",
  heading: "Where we work & when we reply",
  lead: "Wherever you are in the world, working with Pixel Popers feels like having a creative team just down the hall. Here is where we are, when we are around and how quickly you can expect to hear back.",
  cards: [
    {
      tag: "Remote-first",
      title: "Where we work",
      body: "Pixel Popers is a remote-first studio. Our crew works across the UK and Europe, and we partner with clients in North America, the Middle East and Australia. Workshops happen on video calls with shared whiteboards, and for bigger projects we are always happy to travel for an in-person kick-off.",
      chip: "bg-blush text-white",
    },
    {
      tag: "Mon–Fri · 9–6 UK",
      title: "Studio hours",
      body: "Our core hours are Monday to Friday, 9am to 6pm UK time, with overlap built in for clients in other time zones. We avoid weekend work so the crew stays fresh and creative — but launches don't always respect calendars, so we always plan cover for go-live days.",
      chip: "bg-lagoon text-white",
    },
    {
      tag: "< 1 working day",
      title: "Response times",
      body: "We answer new enquiries within one working day and existing clients within four working hours. Retainer clients get a shared Slack channel, and urgent fixes on live websites we build and host are picked up the same day — usually within the hour.",
      chip: "bg-sunbeam text-ink",
    },
  ],
};

export const contactTestimonials = {
  eyebrow: "Kind words",
  heading: "People who said hi first",
  items: [
    {
      quote: "They didn’t just design a logo — they gave our café a personality people want to photograph.",
      role: "Founder",
      company: "Fifth Sip Café",
      initial: "F",
      card: "bg-white text-ink",
      mark: "text-blush-ink",
      avatar: "bg-blush text-white",
      tilt: "rotate-1",
      offset: "",
    },
    {
      quote: "Fast, funny and frighteningly good. Our new site doubled demo requests.",
      role: "Head of Marketing",
      company: "Liquidity",
      initial: "H",
      card: "bg-grape text-white",
      mark: "text-sunbeam",
      avatar: "bg-sunbeam text-ink",
      tilt: "-rotate-1",
      offset: "lg:mt-10",
    },
    {
      quote: "The reels they made outperformed everything we’d posted before.",
      role: "Brand Manager",
      company: "Radiance Beauty",
      initial: "B",
      card: "bg-white text-ink",
      mark: "text-lagoon",
      avatar: "bg-lagoon text-white",
      tilt: "rotate-[1.5deg]",
      offset: "",
    },
  ] satisfies Quote[],
};
