/**
 * Copy and data for the Services overview page (Figma frame 332:21 "03 — Services").
 * Service names and slugs come from `serviceDetails` in service-content; the
 * row blurbs, tags, images and everything else live here.
 */

import type { ServiceSlug } from "@/lib/service-content";

export type Tone = "blush" | "grape" | "lagoon" | "sunbeam";

export const servicesMeta = {
  title: "Services | Branding, UI/UX, Web, Motion, Content & Marketing — Pixel Popers",
  description:
    "Six disciplines, one crew. Explore Pixel Popers' services — brand identity, UI/UX design, digital marketing, web development, motion graphics and content writing — and how they work together.",
};

export const servicesHero = {
  lines: ["What we", "Do best", "& do loud"] as const,
  intro: "Six disciplines, one crew. Mix and match what you need — from a sharp logo to a full launch campaign.",
  cta: { label: "Get a quote", href: "/contact" },
};

export const servicesIntro = {
  eyebrow: "What we do",
  heading: "Six services. One joined-up crew.",
  stats: [
    { value: "6", label: "core services" },
    { value: "94+", label: "brands launched" },
    { value: "1", label: "crew, start to finish" },
  ],
  paragraphs: [
    "Pixel Popers is a full-service digital agency for brands that would rather be remembered than politely ignored. We bring brand identity, UI/UX design, digital marketing, web development, motion graphics and content writing under one roof — so the strategy, the look, the words and the code all come from the same crew, pulling in the same direction.",
    "Most businesses don't need six separate suppliers; they need one team that understands how the pieces connect. A brand identity sets the tone. UI/UX design turns that tone into journeys people enjoy. Web development makes those journeys fast, accessible and easy to find on Google. Content writing gives everything a voice, motion graphics make it move, and digital marketing puts it in front of the right people — then tells us what to improve next.",
    "That is why every project starts with the same short discovery phase, whatever you hire us for. We dig into your goals, your audience and your numbers, agree on what success looks like, and only then pick the services that will get you there. Some clients need a single sharp logo; others want a complete launch with a new website, a campaign and a library of social content. Either way you get a fixed scope, a clear timeline and weekly check-ins with the people actually doing the work.",
    "We work with start-ups launching their first product, growing businesses that have outgrown a DIY look, and established companies ready for a refresh — across food and drink, beauty, real estate, fintech, e-commerce, SaaS, hospitality and education. Clients join us for a one-off project, a focused sprint or a monthly retainer, and plenty stay for years. Explore each service below, or tell us what you are planning and we will suggest the leanest mix to get it done.",
  ],
};

export type ServiceRow = {
  slug: ServiceSlug;
  tone: Tone;
  blurb: string;
  tags: string[];
  image: { src: string; w: number; h: number; alt: string };
  /** Long description for "Every service, explained". */
  explained: string;
};

export const serviceRows: ServiceRow[] = [
  {
    slug: "brand-identity",
    tone: "blush",
    blurb: "Logos, visual systems and brand books that make you instantly recognisable.",
    tags: ["Logo design", "Brand strategy", "Guidelines", "Packaging"],
    image: { src: "/assets/inner/fifth-sip.webp", w: 857, h: 1200, alt: "Fifth Sip coffee brand identity on cups, bags and menus" },
    explained:
      "Brand identity is the system that makes you recognisable everywhere people meet you. We start with a strategy workshop to define your audience, positioning and personality, then design a logo suite, colour palette, typography and graphic language that express it. Everything is documented in a practical brand book with ready-made templates, so your team, printers and developers can keep the look consistent without calling us every time.",
  },
  {
    slug: "ui-ux-design",
    tone: "sunbeam",
    blurb: "Interfaces people actually enjoy — researched, wireframed, prototyped and tested.",
    tags: ["UX research", "Wireframes", "Prototypes", "Design systems"],
    image: { src: "/assets/inner/ui-shop.webp", w: 1600, h: 900, alt: "A collage of e-commerce interface screens designed by Pixel Popers" },
    explained:
      "UI/UX design is how we turn a good idea into a product people genuinely enjoy using. We research your users, map their journeys and test wireframes before a single pixel is polished. Then we design clean, accessible interfaces and clickable prototypes, backed by a reusable design system. The result is fewer support tickets, better conversion and a tidy hand-off your developers will thank you for.",
  },
  {
    slug: "digital-marketing",
    tone: "lagoon",
    blurb: "Campaigns, social and SEO that turn attention into customers.",
    tags: ["Social media", "SEO", "Paid ads", "Analytics"],
    image: { src: "/assets/inner/marketing.webp", w: 1600, h: 1067, alt: "Social media reactions bursting from a laptop screen" },
    explained:
      "Digital marketing puts your brand in front of the people most likely to buy — and proves it worked. We plan campaigns across social media, search and paid ads, build content calendars, optimise for SEO and set up analytics dashboards you can actually read. Every month we review the numbers, cut what isn't working and double down on what is, so your budget grows results rather than impressions.",
  },
  {
    slug: "web-development",
    tone: "sunbeam",
    blurb: "Fast, scalable websites and web apps built on modern stacks.",
    tags: ["Next.js", "Webflow", "E-commerce", "CMS"],
    image: { src: "/assets/inner/webdev.webp", w: 1120, h: 1400, alt: "A developer desk with code on a monitor and a responsive site on tablet and phone" },
    explained:
      "Web development is where design becomes a fast, secure, search-friendly website or web app. We build on modern stacks like Next.js and Webflow, connect a CMS so your team can edit content, and handle e-commerce, integrations and hosting. Every build is responsive, accessible and tuned for Core Web Vitals, with clean code and documentation, so it keeps performing long after launch day.",
  },
  {
    slug: "motion-graphic",
    tone: "blush",
    blurb: "Logo stings, product explainers and scroll animations with bounce.",
    tags: ["2D / 3D motion", "Explainers", "Reels", "Lottie"],
    image: { src: "/assets/inner/motion.webp", w: 1120, h: 980, alt: "A motion design timeline with keyframe curves and floating editing panels" },
    explained:
      "Motion graphics make people stop scrolling and actually understand what you do. We script, storyboard and animate logo stings, product explainers, social reels and 2D or 3D scenes, plus lightweight Lottie and scroll animations for your website. Each piece is designed around your brand identity and delivered in every format and aspect ratio you need, from a six-second ad to a full launch film.",
  },
  {
    slug: "content-writing",
    tone: "grape",
    blurb: "Words that sound like you — web copy, blogs, scripts and social.",
    tags: ["Web copy", "Blogs", "Scripts", "Tone of voice"],
    image: { src: "/assets/inner/writing.webp", w: 698, h: 611, alt: "A copywriter working on a laptop by a sunny window" },
    explained:
      "Content writing gives your brand a voice people recognise and trust. We define your tone of voice, then write website copy, SEO blog articles, video scripts, emails and social posts that sound like you on a good day. Every piece is researched, structured for search engines and written to move readers towards a clear next step — whether that is a sign-up, a booking or a sale.",
  },
];

export const marquee = {
  top: ["Strategy", "Branding", "UI/UX", "Web", "Motion", "Content", "SEO"],
  bottom: ["Poppin’ brands", "Happy clients", "Bold ideas"],
};

export const explained = {
  eyebrow: "Every service, explained",
  heading: "What each one does for you",
  lead: "Not sure which service you need? Here is what each one involves, what you get at the end and how it connects to the rest of your brand.",
};

export const servicesFaq = {
  eyebrow: "Good questions",
  heading: ["Before we", "get poppin’"],
  body: "Can’t find what you’re after? Drop us a line — we reply within a day.",
  cta: { label: "Ask us anything", href: "/contact" },
  items: [
    {
      q: "How long does a typical project take?",
      a: "Brand identities take 4–6 weeks, websites 6–10 weeks. We share a clear timeline with milestones before we kick off, so there are no surprises.",
    },
    {
      q: "Do you work with startups or only big brands?",
      a: "Both. Around half of our clients are start-ups and small businesses, and our Starter packages and two-week sprints are built so younger brands can get pro-level work without a big-agency budget.",
    },
    {
      q: "Can you take over an existing website?",
      a: "Yes. We start with a quick audit of your code, hosting, speed and SEO, then either improve what you have or recommend a rebuild — with honest reasons either way.",
    },
    {
      q: "What does a project cost?",
      a: "Most projects start around $5k. Every proposal has a fixed price or monthly fee agreed up front, so you always know exactly what you are paying for.",
    },
    {
      q: "Do you offer support after launch?",
      a: "Always. Every project includes 30 days of free support after launch, and many clients stay on a monthly retainer for updates, campaigns and new features.",
    },
  ],
};

export const comparison = {
  eyebrow: "Why Pixel Popers",
  heading: "Not your typical agency",
  typical: {
    title: "Typical agency",
    items: [
      "Junior team after the pitch",
      "Templates dressed up as strategy",
      "Weeks of silence between updates",
      "Launch, invoice, goodbye",
      "Safe, forgettable ideas",
    ],
  },
  us: {
    title: "Pixel Popers",
    items: [
      "Founders on every project",
      "Strategy built around your numbers",
      "Weekly demos & a shared Slack",
      "Partners long after launch",
      "Bold ideas with a little chaos",
    ],
  },
};

export const industries = {
  eyebrow: "Who we work with",
  heading: "Industries we pop",
  items: [
    { name: "Food & beverage", tone: "blush" },
    { name: "Beauty & wellness", tone: "lagoon" },
    { name: "Real estate", tone: "sunbeam" },
    { name: "Fintech", tone: "grape" },
    { name: "E-commerce", tone: "lagoon" },
    { name: "SaaS & tech", tone: "sunbeam" },
    { name: "Hospitality", tone: "grape" },
    { name: "Education", tone: "blush" },
  ] satisfies { name: string; tone: Tone }[],
};

export const models = {
  eyebrow: "Ways to work",
  heading: "Pick your pace",
  items: [
    { name: "Project", body: "Fixed scope, fixed timeline. Perfect for a launch, rebrand or new website.", chip: "4–12 weeks", tone: "blush" },
    { name: "Retainer", body: "A monthly crew on call for marketing, content and design.", chip: "Monthly", tone: "grape" },
    { name: "Sprint", body: "Two focused weeks to solve one big problem — fast.", chip: "2 weeks", tone: "lagoon" },
  ] satisfies { name: string; body: string; chip: string; tone: Tone }[],
};

export const servicesStats = [
  { value: "94+", label: "Brands launched", tone: "text-white" },
  { value: "7+", label: "Years popping", tone: "text-sunbeam" },
  { value: "12", label: "Long-term partners", tone: "text-white" },
  { value: "6", label: "Disciplines, one crew", tone: "text-sunbeam" },
];

export type Quote = {
  quote: string;
  role: string;
  company: string;
  initial: string;
  card: string;
  mark: string;
  avatar: string;
  tilt: string;
  offset: string;
};

export const servicesTestimonials = {
  eyebrow: "Kind words",
  heading: "Clients who popped",
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
      quote: "Fast, funny and frighteningly good. Our new site doubled demo requests in the first month.",
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
      quote: "The reels they made for our launch outperformed everything we’d posted before.",
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

export const servicesCta = {
  eyebrow: "Let’s build something",
  heading: ["Extraordinary", "together"],
  body: "Tell us about your goals, and let’s turn your vision into reality.",
  cta: { label: "Schedule a strategy call", href: "/contact" },
};
