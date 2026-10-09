/**
 * Copy and data for the About page (Figma frame 330:21 "02 — About").
 * Team members come from `owners` in site-content; everything else lives here.
 */

export type Accent = "blush" | "grape" | "lagoon" | "sunbeam" | "lav";

export const aboutMeta = {
  title: "About Pixel Popers | The Funky Crew Behind the Pop",
  description:
    "Meet Pixel Popers — a remote-first digital agency of strategists, designers and developers. Our story, our values, how we work and the brands we partner with.",
};

export const aboutHero = {
  lines: ["We're the", "Funky crew", "Behind the pop"] as const,
  intro:
    "A full-service crew of strategists, designers and developers obsessing over the details that make people stop scrolling — and keep coming back.",
  cta: { label: "Meet the team", href: "#team" },
  images: [
    { src: "/assets/inner/about/studio-laptop.webp", w: 600, h: 640, alt: "A Pixel Popers designer reviewing a client website on a laptop in the studio" },
    { src: "/assets/inner/about/team-cube.webp", w: 440, h: 760, alt: "A playful 3D cube of team portraits on a grape background" },
    { src: "/assets/inner/about/social-buzz.webp", w: 600, h: 640, alt: "Hands typing on a laptop as social media reactions burst from the screen" },
  ],
  stickers: ["Est. kitchen table", "Never boring ✦"],
};

export const aboutStory = {
  eyebrow: "Our story",
  heading: ["Three friends.", "One loud idea."],
  body: "Pixel Popers started at a kitchen table with a simple belief: brands deserve to be felt, not just seen. Today we are a full-service crew of strategists, designers and developers who obsess over the details that make people stop scrolling — and keep coming back.",
  philosophy: "Strategy first. Craft always. Never boring.",
  stats: [
    { value: "7+", label: "Years popping", tone: "text-blush-ink" },
    { value: "94+", label: "Brands launched", tone: "text-lagoon" },
    { value: "12", label: "Long-term partners", tone: "text-sunbeam" },
  ],
};

export const fullStory = {
  eyebrow: "The full story",
  heading: "How a kitchen table became a studio",
  stats: [
    { value: "2019", label: "year we started" },
    { value: "100%", label: "remote-first crew" },
    { value: "6", label: "core services" },
  ],
  paragraphs: [
    "Pixel Popers began in 2019 around a wobbly kitchen table, with three friends, one shared laptop and a first client who was brave enough to take a chance on us. Adan, James and Barry had spent years inside bigger agencies watching great ideas get sanded down until they were safe, polite and forgettable. We wanted to build the opposite: a studio where bold ideas survive the journey from sketch to launch.",
    "That first project — a rebrand for a local coffee roaster — taught us the lesson we still work by today. People do not fall for a logo or a colour palette on its own; they fall for how a brand makes them feel. So we paired strategy with craft from day one, asking who a business is really for before we ever open a design file, and then sweating the details that make people stop scrolling.",
    "Word of mouth did the rest. By 2020 we had launched our first ten brands, by 2022 we had gone fully remote and were hiring talent across time zones, and in 2024 a dedicated motion and 3D team joined the crew. Today we are a full-service digital agency of strategists, designers, developers, writers and animators working across brand identity, web design and development, UI/UX, motion, content and digital marketing.",
    "What has not changed is the way we work. You still talk directly to the people doing the work, we still share progress every week, and we still believe a brand should be felt, not just seen. Every website we build, every identity we craft and every campaign we launch is measured against one simple question: will this make the right people care?",
  ],
};

export const values: { title: [string, string]; body: string; bg: string; tone: "light" | "dark"; tilt: string }[] = [
  { title: ["Strategy", "first"], body: "Every pixel has a purpose. We start with your goals, audience and numbers — then make it beautiful.", bg: "bg-blush", tone: "light", tilt: "-rotate-2" },
  { title: ["Craft", "always"], body: "Type, motion, micro-interactions. The tiny details are where brands get remembered.", bg: "bg-grape", tone: "light", tilt: "rotate-1" },
  { title: ["Never", "boring"], body: "Safe is forgettable. We push for ideas with a little bit of chaos and a lot of personality.", bg: "bg-lagoon", tone: "light", tilt: "-rotate-1" },
  { title: ["Partners,", "not vendors"], body: "We plug into your team, share the wins and stick around long after launch day.", bg: "bg-sunbeam", tone: "dark", tilt: "rotate-2" },
];

export const inPractice = {
  eyebrow: "In practice",
  heading: "What our values look like day to day",
  paragraphs: [
    "Values are easy to write on a wall and much harder to live by on a busy Tuesday. Here is how ours show up in every project, from the first call to the last line of code.",
    "Strategy first means we never jump straight into pixels. Every engagement starts with a discovery workshop, a look at your audience and competitors, and a short brief we agree together, so every design decision has a reason behind it.",
    "Craft always means senior people stay hands-on. The designer who presents your concepts is the one who refines them, and our developers build fast, accessible, search-friendly websites that are a joy to update.",
    "Never boring means we push for the idea people remember, then back it with testing, analytics and honest reporting. Partners, not vendors, means fixed proposals, weekly check-ins, shared project boards and a team that is still on hand long after launch.",
  ],
};

export const howWeWork = {
  eyebrow: "How we work",
  heading: "From spark to pop",
  cta: { label: "Start a project", href: "/contact" },
  steps: [
    { n: "01", title: "Discover", body: "Workshops, audits and research to find what makes you different.", dot: "bg-blush text-white" },
    { n: "02", title: "Define", body: "Strategy, positioning and a clear roadmap everyone signs off on.", dot: "bg-lagoon text-white" },
    { n: "03", title: "Design", body: "Brand, UI and motion crafted, tested and refined with you.", dot: "bg-sunbeam text-ink" },
    { n: "04", title: "Deliver", body: "Build, launch and grow — with data guiding every next move.", dot: "bg-lav text-white" },
  ],
};

export const audience = {
  eyebrow: "Who we work with",
  heading: "Brands that want to be felt",
  lead: "We partner with ambitious teams of every size — from founders sketching their first idea to established companies ready for a bolder chapter. What our clients share is not an industry or a budget, but an appetite to stand out and the willingness to do things properly.",
  cards: [
    { title: "Start-ups & founders", body: "Launching something new? We help you find your positioning, build a brand identity that looks investor-ready from day one and ship a fast, conversion-focused website, so your first impression does the heavy lifting while you focus on the product." },
    { title: "Growing businesses", body: "Outgrown your DIY logo or patchwork website? We turn scattered assets into one consistent brand system, rebuild your site on a scalable stack and set up the content and marketing engine you need to keep growing without the growing pains." },
    { title: "Established brands", body: "Ready for a refresh without losing loyal customers? We modernise identities, redesign complex digital experiences and add motion, 3D and campaign work that brings new energy to a familiar name — always backed by research, testing and clear results." },
  ],
  closing:
    "We work with clients across hospitality, e-commerce, technology, property, health and wellness, finance and the creative industries — in the UK and around the world. Whatever your sector, you get the same senior team, honest advice, transparent pricing and a crew that genuinely cares about your results long after launch day.",
};

export const journey = {
  eyebrow: "Our journey",
  heading: ["From kitchen table", "to full-blown studio"],
  milestones: [
    { year: "2019", title: "The kitchen table", body: "Three friends, one laptop and a first client who took a chance.", color: "text-blush-ink", dot: "bg-blush" },
    { year: "2020", title: "First 10 brands", body: "Word of mouth did the rest — the pop started spreading.", color: "text-lagoon", dot: "bg-lagoon" },
    { year: "2022", title: "Remote-first", body: "We went fully remote and started hiring talent worldwide.", color: "text-sunbeam", dot: "bg-sunbeam" },
    { year: "2024", title: "Motion & 3D", body: "A dedicated motion team joins the crew.", color: "text-grape", dot: "bg-grape" },
    { year: "2026", title: "94+ brands", body: "And we’re just getting warmed up.", color: "text-blush-ink", dot: "bg-blush" },
  ],
};

export const testimonials = {
  eyebrow: "Kind words",
  heading: "What clients say",
  items: [
    { quote: "They didn’t just design a logo — they gave our café a personality people want to photograph.", role: "Founder", company: "Fifth Sip Café", initial: "F", card: "bg-white text-ink", mark: "text-blush-ink", avatar: "bg-blush text-white", tilt: "-rotate-1", offset: "" },
    { quote: "Fast, funny and frighteningly good. Our new site doubled demo requests in the first month.", role: "Head of Marketing", company: "Liquidity", initial: "H", card: "bg-grape text-white", mark: "text-sunbeam", avatar: "bg-sunbeam text-ink", tilt: "rotate-1", offset: "lg:mt-10" },
    { quote: "The reels they made for our launch outperformed everything we’d posted before.", role: "Brand Manager", company: "Radiance Beauty", initial: "B", card: "bg-white text-ink", mark: "text-lagoon", avatar: "bg-lagoon text-white", tilt: "-rotate-1", offset: "" },
  ],
};

export const perks = {
  eyebrow: "Life at the studio",
  heading: "Work hard, pop harder",
  items: [
    { title: "Remote-first", body: "Work from anywhere — we meet up twice a year.", dot: "bg-blush text-white" },
    { title: "Learning budget", body: "Courses, books and conferences on us.", dot: "bg-lagoon text-white" },
    { title: "Show & tell", body: "Every Friday we share what we made and learned.", dot: "bg-sunbeam text-ink" },
    { title: "Wellness days", body: "Extra days off to recharge — no questions asked.", dot: "bg-grape text-white" },
  ],
};

export const hiring = {
  eyebrow: "Join the crew",
  heading: "We’re hiring",
  roles: ["Motion Designer", "Frontend Developer", "Brand Designer", "Content Writer"],
  cta: { label: "View open roles", href: "/contact" },
};

export const aboutCta = {
  eyebrow: "Let’s build something",
  heading: ["Extraordinary", "together"],
  body: "Whether you need a complete brand overhaul, a high-converting web experience, or a full-scale marketing campaign, our team is ready to execute.",
  cta: { label: "Schedule a strategy call", href: "/contact" },
};
