/**
 * Long-form copy for the six service detail pages (/services/[slug]).
 *
 * Every page carries well over 1,000 words of crawlable text: an overview,
 * what's included, a step-by-step process, who it's for, why us, FAQs and
 * packages. The same copy is used in the Figma "Inner Pages" frames.
 */

export type ServiceSlug =
  | "brand-identity"
  | "ui-ux-design"
  | "digital-marketing"
  | "web-development"
  | "motion-graphic"
  | "content-writing";

export type TextItem = { title: string; body: string };
export type Faq = { q: string; a: string };
export type Package = {
  name: "Starter" | "Growth" | "Full Pop";
  summary: string;
  price: string;
  timeline: string;
  features: string[];
  popular?: boolean;
};

export type ServiceDetail = {
  slug: ServiceSlug;
  name: string;
  /** Hero headline split over lines, set in Nevera. */
  heroLines: [string, string, string];
  heroIntro: string;
  heroCta: string;
  metaTitle: string;
  metaDescription: string;
  /** Accent colour token used across the page. */
  accent: "blush" | "grape" | "lagoon" | "sunbeam";
  overview: { eyebrow: string; heading: string; paragraphs: string[] };
  included: TextItem[];
  process: TextItem[];
  audience: TextItem[];
  /** Three short explainers that answer common searches about the service. */
  insights: TextItem[];
  whyUs: { heading: string; paragraphs: string[] };
  tools: string[];
  stats: { value: string; label: string }[];
  packages: Package[];
  faqs: Faq[];
  ctaHeading: string;
  ctaButton: string;
};

export const serviceDetails: ServiceDetail[] = [
  /* ───────────────────────────── BRAND IDENTITY ───────────────────────────── */
  {
    slug: "brand-identity",
    name: "Brand Identity",
    heroLines: ["BRAND", "IDENTITY", "THAT STICKS"],
    heroIntro:
      "Logos, palettes, type and brand books that make you instantly recognisable — on a cup, a screen or a billboard.",
    heroCta: "Start your brand",
    metaTitle: "Brand Identity Design Agency — Logos, Colour & Brand Guidelines",
    metaDescription:
      "Pixel Popers designs brand identities that stick: brand strategy, logo design, colour systems, typography and brand guidelines for start-ups and growing businesses.",
    accent: "blush",
    overview: {
      eyebrow: "THE FULL STORY",
      heading: "A BRAND IS A PROMISE YOU CAN SEE",
      paragraphs: [
        "Your brand identity is the first thing people meet and the last thing they remember. Long before anyone reads your About page, they have already judged you on a logo in a browser tab, the colour of a coffee cup or the feel of a box arriving at their door. Brand identity design is how we make sure that judgement lands in your favour — every single time, on every single surface.",
        "At Pixel Popers we treat identity as a system, not a single logo. We start with strategy: who you are for, what you stand for and the one idea your business should own in people's heads. From there we design a mark that is simple enough to work at sixteen pixels and bold enough to hold a billboard, then build the colour palette, typography, illustration style, photography direction and graphic elements that let that idea travel.",
        "The result is not a pretty file that sits in a folder. It is a toolkit your team can actually use: a brand book that explains the why behind every rule, ready-to-go templates for social posts, presentations and stationery, and assets exported in every format you will ever need. When your marketing team, your developer and your printer all pull from the same system, consistency stops being a struggle and starts being automatic.",
        "Whether you are a start-up launching your first product, a growing company that has outgrown a DIY logo, or an established business that needs a refresh without losing its loyal customers, our brand identity process is designed to give you clarity, confidence and a look that is unmistakably yours.",
      ],
    },
    included: [
      {
        title: "Brand strategy workshop",
        body: "A focused session to define your audience, positioning, personality and brand promise. Everything we design afterwards is measured against this foundation, so creative decisions are never just a matter of taste.",
      },
      {
        title: "Logo design & variations",
        body: "Three distinct logo routes, refined into one primary mark plus secondary lock-ups, a compact icon and a favicon. Each version is built on a construction grid and tested at tiny and huge sizes.",
      },
      {
        title: "Colour system",
        body: "A primary and accent palette with HEX, RGB, CMYK and Pantone values, checked for accessible contrast and tuned to look great on screens, packaging and printed paper alike.",
      },
      {
        title: "Typography pairing",
        body: "A display and body typeface pairing with a clear type scale, weights and usage rules, so headlines feel loud, paragraphs stay readable and every document looks like it came from the same family.",
      },
      {
        title: "Brand guidelines book",
        body: "A practical brand book covering logo usage, clear space, minimum sizes, the don'ts, colour ratios, typography, imagery, tone of voice and real examples — written so anyone on your team can follow it.",
      },
      {
        title: "Applications & templates",
        body: "Business cards, letterhead, email signatures, social media templates, presentation decks and merch mock-ups, delivered as editable files so you can launch the new identity everywhere on day one.",
      },
    ],
    process: [
      {
        title: "Discover",
        body: "We run a brand workshop, audit your current materials, scan your competitors and talk to your audience where we can. This chapter ends with a short strategy document that everyone signs off before design begins.",
      },
      {
        title: "Position",
        body: "We shape the story: your brand idea, personality traits, tone of voice and messaging pillars. This gives the visual work a clear brief and makes sure your identity says something, not just looks nice.",
      },
      {
        title: "Design",
        body: "We present three different creative routes with mock-ups in real context. You choose a direction, and we refine the logo, palette, typography and graphic language over two rounds of feedback.",
      },
      {
        title: "Roll out",
        body: "We build the brand guidelines, export every asset, design your templates and support the launch. Need help briefing a printer or a developer? We stay on hand so the identity lands exactly as designed.",
      },
    ],
    audience: [
      {
        title: "Start-ups & new ventures",
        body: "Launching something new and need to look established from day one without spending months on it.",
      },
      {
        title: "Growing businesses",
        body: "You have outgrown a DIY logo and your marketing looks different on every channel. Time for a real system.",
      },
      {
        title: "Product & packaging brands",
        body: "Food, drink, beauty and lifestyle products that need to win the shelf in under three seconds.",
      },
      {
        title: "Rebrands & refreshes",
        body: "Established companies that want to modernise without losing the recognition they have already earned.",
      },
    ],
    insights: [
      {
        title: "What makes a logo memorable?",
        body: "Memorable logos are simple, distinctive and meaningful. Simplicity lets a mark be recognised at a glance and reproduced anywhere; distinctiveness separates you from competitors; meaning gives people a story to attach to it. We pressure-test every concept against all three before it reaches you.",
      },
      {
        title: "Brand identity vs. brand strategy",
        body: "Strategy is the thinking — who you serve, what you promise and how you are different. Identity is the expression of that thinking through visuals and voice. A strong identity without strategy is decoration; strategy without identity stays invisible. Our projects always connect the two.",
      },
      {
        title: "Why consistency builds trust",
        body: "People trust what they recognise. When your logo, colours and tone look the same on your website, packaging and social feed, customers remember you faster and feel safer buying from you. A clear brand book is what keeps that consistency alive as your team grows.",
      },
    ],
    whyUs: {
      heading: "WHY BRANDS POP WITH US",
      paragraphs: [
        "We are a small, senior team, so the people in your kick-off call are the people designing your brand. There are no hand-offs to juniors and no endless chains of account managers — just direct conversations with the designers doing the work.",
        "We also design for the real world. Every identity we deliver is tested on packaging, websites, social feeds and signage before we call it finished, and our guidelines are written in plain language. That is why our clients keep using their brand books long after launch instead of letting them gather dust.",
      ],
    },
    tools: ["Figma", "Illustrator", "Photoshop", "InDesign", "After Effects", "Blender"],
    stats: [
      { value: "120+", label: "identities shipped" },
      { value: "3", label: "routes per project" },
      { value: "4–8", label: "weeks, start to launch" },
    ],
    packages: [
      {
        name: "Starter",
        summary: "Logo + mini style guide",
        price: "From $1,500",
        timeline: "2–3 weeks",
        features: ["Logo & variations", "Colour & type", "1-page guide"],
      },
      {
        name: "Growth",
        summary: "Full visual identity",
        price: "From $4,500",
        timeline: "4–6 weeks",
        features: ["Everything in Starter", "Brand guidelines", "Social templates", "Stationery"],
        popular: true,
      },
      {
        name: "Full Pop",
        summary: "Strategy to launch",
        price: "From $9,000",
        timeline: "6–8 weeks",
        features: ["Everything in Growth", "Brand strategy", "Packaging", "Launch campaign"],
      },
    ],
    faqs: [
      {
        q: "How many logo concepts do we get?",
        a: "Three distinct routes. You pick a favourite and we refine it over two rounds of feedback until it feels exactly right — no endless revisions, just focused iteration.",
      },
      {
        q: "Do we own the final files?",
        a: "Yes. Once the project is paid, you own full rights to the final logo and brand assets. We hand over editable source files plus PNG, SVG, PDF and EPS exports for print and screen.",
      },
      {
        q: "Can you refresh an existing brand?",
        a: "Absolutely. We audit what is working, keep the equity your customers already recognise and modernise the rest, so the change feels like an upgrade rather than a stranger.",
      },
      {
        q: "How long does a brand identity project take?",
        a: "A Starter identity usually takes two to three weeks. Full identities with strategy and guidelines take four to eight weeks, depending on how quickly feedback comes back.",
      },
      {
        q: "Do you also design packaging and websites?",
        a: "Yes. Brand identity is often the first step; our UI/UX, web development and motion teams can carry the new look straight into your website, app, packaging and launch campaign.",
      },
      {
        q: "What do you need from us to start?",
        a: "A short questionnaire, access to any existing brand materials and one or two key people available for the workshop. We take care of the rest and keep you updated every week.",
      },
    ],
    ctaHeading: "BRAND IDENTITY",
    ctaButton: "Schedule a strategy call",
  },

  /* ───────────────────────────── UI/UX DESIGN ───────────────────────────── */
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    heroLines: ["UI/UX", "DESIGN", "PEOPLE ENJOY"],
    heroIntro:
      "Interfaces that are researched, prototyped and tested — then handed to developers with every state and breakpoint covered.",
    heroCta: "Design my product",
    metaTitle: "UI/UX Design Agency — App, Web & Product Design",
    metaDescription:
      "Pixel Popers is a UI/UX design studio for apps, SaaS dashboards and websites: user research, wireframes, prototypes, design systems and usability testing.",
    accent: "grape",
    overview: {
      eyebrow: "THE FULL STORY",
      heading: "DESIGN THAT FEELS OBVIOUS (THAT'S THE HARD PART)",
      paragraphs: [
        "Good UI/UX design is invisible. People do not notice the button that is exactly where they expected it, the form that only asks for what it needs or the dashboard that answers their question at a glance. They only notice when something is confusing — and then they leave. User experience design is the craft of removing that friction so your product feels obvious, fast and even a little bit delightful.",
        "Our UI/UX design process starts with people, not pixels. We interview users, study analytics, map journeys and look closely at where people struggle today. That research turns into user flows and wireframes that define structure and priority before any colour is added. Only when the skeleton works do we bring in the visual layer: typography, colour, iconography, motion and the small interactions that give an interface its personality.",
        "Everything we design lives in a shared, organised Figma file with a proper component library and design tokens. That means your developers get consistent, well-named components with every state documented — hover, focus, error, empty and loading — instead of a pile of one-off screens. Clickable prototypes let you and your users try the product before a single line of code is written, which saves weeks of rework later.",
        "From mobile apps and SaaS platforms to e-commerce stores and marketing websites, we design interfaces that are accessible, responsive and on-brand. The goal is simple: more people completing the thing they came to do, and enjoying it while they do it.",
      ],
    },
    included: [
      {
        title: "User research & audit",
        body: "Stakeholder interviews, user interviews, analytics review and a heuristic UX audit of your current product, summarised into clear problems and opportunities ranked by impact.",
      },
      {
        title: "User flows & information architecture",
        body: "Journey maps, sitemaps and task flows that define how people move through your product, so navigation and content hierarchy make sense before any visual design starts.",
      },
      {
        title: "Wireframes",
        body: "Low and mid-fidelity wireframes for every key screen, focused on layout, content priority and interaction, so we can test ideas quickly and cheaply.",
      },
      {
        title: "High-fidelity UI design",
        body: "Polished, on-brand screens for desktop, tablet and mobile with typography, colour, iconography, illustration and micro-interactions that make your product feel premium.",
      },
      {
        title: "Interactive prototypes",
        body: "Clickable Figma prototypes that simulate real flows, perfect for investor demos, stakeholder sign-off and usability testing with real users before development.",
      },
      {
        title: "Design system & handoff",
        body: "A reusable component library with variants, tokens and documentation, plus a developer-friendly handoff with specs, assets and annotated states for every component.",
      },
    ],
    process: [
      {
        title: "Research",
        body: "We learn how your users think and where they get stuck through interviews, analytics and an audit. The output is a prioritised list of problems worth solving and the metrics we will improve.",
      },
      {
        title: "Wireframe",
        body: "We map user flows and build wireframes for the core journeys. Quick tests at this stage catch confusing navigation and missing steps while changes still cost minutes, not sprints.",
      },
      {
        title: "Design",
        body: "We craft the high-fidelity interface and build the component library alongside it. You review real screens in a clickable prototype, and we iterate together over structured feedback rounds.",
      },
      {
        title: "Test & hand off",
        body: "We run usability tests, fix what trips people up and prepare a clean handoff. Our team stays available during development to answer questions and review the build against the design.",
      },
    ],
    audience: [
      {
        title: "SaaS & B2B platforms",
        body: "Complex dashboards and workflows that need to feel simple for busy professionals.",
      },
      {
        title: "Mobile app teams",
        body: "iOS and Android apps that need intuitive onboarding, clean navigation and better retention.",
      },
      {
        title: "E-commerce brands",
        body: "Stores that want smoother browsing, faster checkout and fewer abandoned carts.",
      },
      {
        title: "Start-ups building an MVP",
        body: "Founders who need a testable, investor-ready product design without wasting runway.",
      },
    ],
    insights: [
      {
        title: "Why UX is a growth lever",
        body: "Every extra step, unclear label or slow screen costs you users. Improving the experience of key journeys — sign-up, onboarding, checkout — is often the cheapest way to grow revenue, because you convert more of the traffic you already pay for.",
      },
      {
        title: "Accessibility is good design",
        body: "Designing for accessibility means readable contrast, clear focus states, sensible heading structure and touch targets that fit real fingers. It helps people with disabilities, improves usability for everyone and supports your SEO. We follow WCAG guidelines on every project.",
      },
      {
        title: "Design systems save money",
        body: "A shared library of components and tokens means designers stop redrawing buttons and developers stop rebuilding them. New features ship faster, the product stays consistent and onboarding new team members becomes far easier as you scale.",
      },
    ],
    whyUs: {
      heading: "WHY TEAMS DESIGN WITH US",
      paragraphs: [
        "We combine brand designers' eye for detail with product designers' obsession with usability. That means your product does not have to choose between looking beautiful and working beautifully — you get both, backed by research rather than guesswork.",
        "We also speak developer. Our design systems are built the way modern front-end frameworks think, with tokens, variants and documented states, which keeps the build fast and the final product faithful to the design.",
      ],
    },
    tools: ["Figma", "FigJam", "Maze", "Hotjar", "Lottie", "Notion"],
    stats: [
      { value: "+38%", label: "average conversion lift" },
      { value: "40+", label: "products designed" },
      { value: "5", label: "users per test round" },
    ],
    packages: [
      {
        name: "Starter",
        summary: "UX audit + quick wins",
        price: "From $2,000",
        timeline: "2 weeks",
        features: ["Heuristic review", "Top 10 fixes", "Annotated screens"],
      },
      {
        name: "Growth",
        summary: "Website or app redesign",
        price: "From $6,000",
        timeline: "4–8 weeks",
        features: ["Everything in Starter", "User flows", "Hi-fi UI (15 screens)", "Prototype"],
        popular: true,
      },
      {
        name: "Full Pop",
        summary: "Product design partner",
        price: "From $12,000",
        timeline: "8–12 weeks",
        features: ["Everything in Growth", "User testing", "Design system", "Ongoing sprints"],
      },
    ],
    faqs: [
      {
        q: "What is the difference between UI and UX design?",
        a: "UX design is how a product works — the structure, flows and logic that help people complete tasks. UI design is how it looks and feels — the visual layer of type, colour and interaction. We do both together.",
      },
      {
        q: "Do you design for both iOS and Android?",
        a: "Yes. We design responsive web apps and native mobile apps, respecting the platform conventions of iOS and Android while keeping your brand consistent everywhere.",
      },
      {
        q: "Will we get a design system?",
        a: "Growth and Full Pop projects include a component library built in Figma with variants, tokens and documentation, so your team can design new features without starting from scratch.",
      },
      {
        q: "Do you test designs with real users?",
        a: "We do. Depending on the package, we run moderated or unmoderated usability tests with five or more users per round and share recordings, findings and the fixes we made.",
      },
      {
        q: "Can you work with our in-house developers?",
        a: "Definitely. We hand off clean Figma files with specs, assets and annotations, join your stand-ups if useful and review the build so the shipped product matches the design.",
      },
      {
        q: "Can you build the product as well?",
        a: "Yes — our web development team can turn the designs into a fast, accessible front end, which keeps design and code in perfect sync from start to launch.",
      },
    ],
    ctaHeading: "UI/UX DESIGN",
    ctaButton: "Book a product call",
  },

  /* ─────────────────────────── DIGITAL MARKETING ─────────────────────────── */
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    heroLines: ["DIGITAL", "MARKETING", "THAT CONVERTS"],
    heroIntro:
      "Social, search, ads and email — planned with data, made with personality and measured every single month.",
    heroCta: "Grow my brand",
    metaTitle: "Digital Marketing Agency — Social Media, SEO & Paid Ads",
    metaDescription:
      "Pixel Popers runs data-driven digital marketing: social media management, SEO, Google and Meta ads, email marketing and content campaigns that grow traffic and sales.",
    accent: "lagoon",
    overview: {
      eyebrow: "THE FULL STORY",
      heading: "MARKETING THAT EARNS ATTENTION (AND KEEPS IT)",
      paragraphs: [
        "People scroll past thousands of posts and ads every day. Digital marketing that works is not about shouting louder — it is about showing up in the right place, at the right moment, with something worth stopping for. That takes a mix of creativity and discipline: ideas people want to share, and the data to know which ideas actually move the numbers.",
        "Our digital marketing service brings strategy, content and performance under one roof. We start by understanding your customers, your competitors and your current funnel, then build a channel plan that might include social media marketing, search engine optimisation, paid search and social ads, email marketing and influencer partnerships. Every channel has a clear job, a clear budget and a clear metric.",
        "Because we are also a design studio, the creative never feels like an afterthought. Scroll-stopping social posts, short-form video, ad variations and landing pages are designed in-house and tested constantly. We run A/B tests on hooks, visuals and offers, move budget towards what performs and cut what does not — so your marketing budget works harder every month.",
        "You get transparent reporting in plain language: a live dashboard plus a monthly review that explains what happened, why it happened and what we will do next. No vanity metrics, no jargon — just steady growth in reach, traffic, leads and revenue.",
      ],
    },
    included: [
      {
        title: "Marketing strategy & audit",
        body: "A full review of your channels, analytics, competitors and audience, turned into a 90-day growth plan with goals, budgets, KPIs and a content calendar.",
      },
      {
        title: "Social media management",
        body: "Planning, design, copywriting, scheduling and community management for Instagram, TikTok, LinkedIn, Facebook and more, with a consistent look that builds recognition.",
      },
      {
        title: "Search engine optimisation",
        body: "Keyword research, technical SEO fixes, on-page optimisation and content that helps you rank for the searches your customers are already making.",
      },
      {
        title: "Paid ads (PPC & social)",
        body: "Google Ads, Meta, TikTok and LinkedIn campaigns with tight targeting, creative testing and conversion tracking set up properly from day one.",
      },
      {
        title: "Email marketing & automation",
        body: "Welcome flows, abandoned-cart reminders, newsletters and re-engagement sequences that nurture leads and bring customers back again and again.",
      },
      {
        title: "Analytics & reporting",
        body: "GA4, pixels and conversion tracking set up correctly, plus a live dashboard and a monthly report explaining results and next steps in plain language.",
      },
    ],
    process: [
      {
        title: "Audit",
        body: "We dig into your analytics, ad accounts, social channels and competitors to find what is working, what is wasting money and where the quickest growth opportunities are hiding.",
      },
      {
        title: "Plan",
        body: "We set goals and KPIs, pick the channels that matter for your audience, allocate the budget and build a content calendar. You sign off the plan before anything goes live.",
      },
      {
        title: "Launch",
        body: "We produce the creative, write the copy, set up tracking and launch campaigns. Early weeks are about testing hooks, audiences and offers to learn what resonates fastest.",
      },
      {
        title: "Optimise",
        body: "Every week we shift budget towards winners and refresh tired creative. Every month we report results, share learnings and update the plan to keep growth compounding.",
      },
    ],
    audience: [
      {
        title: "E-commerce & D2C brands",
        body: "Product brands that need profitable ads, strong social presence and repeat customers.",
      },
      {
        title: "Local & service businesses",
        body: "Clinics, studios, restaurants and agencies that need more enquiries from their area.",
      },
      {
        title: "B2B & SaaS companies",
        body: "Teams that need qualified leads, LinkedIn visibility and content that builds trust.",
      },
      {
        title: "Brands launching something new",
        body: "Product drops, openings and launches that need buzz fast — and a plan for after.",
      },
    ],
    insights: [
      {
        title: "Organic vs. paid marketing",
        body: "Organic channels like SEO and social build long-term, compounding visibility, while paid ads deliver fast, targeted reach you can scale up or down. The most efficient growth plans use both: paid to learn quickly and drive sales now, organic to lower acquisition costs over time.",
      },
      {
        title: "Creative is the new targeting",
        body: "As ad platforms automate audience targeting, the creative itself decides who stops scrolling. That is why we test several hooks, visuals and formats for every campaign and keep refreshing them, instead of running one ad until it burns out.",
      },
      {
        title: "Measure what matters",
        body: "Likes and impressions are nice, but they do not pay the bills. We focus reporting on leads, sales, cost per acquisition, customer lifetime value and return on ad spend, so every decision is tied to real business results.",
      },
    ],
    whyUs: {
      heading: "WHY BRANDS GROW WITH US",
      paragraphs: [
        "Most agencies are either creative or analytical. We are both. Our designers, writers and media buyers sit in the same team, so the insight from last week's ad results shapes this week's creative straight away.",
        "We also keep things honest. You own your ad accounts and data, there are no long lock-in contracts and our reports focus on the numbers that matter to your business — leads, sales and cost per acquisition — not just likes.",
      ],
    },
    tools: ["Google Ads", "Meta Ads", "GA4", "Semrush", "Klaviyo", "Later"],
    stats: [
      { value: "3.4×", label: "average return on ad spend" },
      { value: "+212%", label: "organic reach in 6 months" },
      { value: "17", label: "brands growing with us" },
    ],
    packages: [
      {
        name: "Starter",
        summary: "Social essentials",
        price: "From $900 / mo",
        timeline: "Monthly",
        features: ["2 channels", "12 posts / month", "Monthly report"],
      },
      {
        name: "Growth",
        summary: "Social + SEO",
        price: "From $2,200 / mo",
        timeline: "Monthly",
        features: ["Everything in Starter", "On-page SEO", "Paid ads setup", "Bi-weekly reports"],
        popular: true,
      },
      {
        name: "Full Pop",
        summary: "Full-funnel growth",
        price: "From $4,500 / mo",
        timeline: "Monthly",
        features: ["Everything in Growth", "Ads management", "Email flows", "Dedicated strategist"],
      },
    ],
    faqs: [
      {
        q: "How soon will we see results?",
        a: "Paid campaigns usually show data within the first two weeks and settle into steady performance after a month or two. SEO is a longer game — most clients see meaningful organic growth within three to six months.",
      },
      {
        q: "Is the ad budget included in your fee?",
        a: "No. Our fee covers strategy, creative and management. Ad spend is paid directly to Google, Meta or TikTok from your own accounts, so you stay in full control of your budget.",
      },
      {
        q: "Which social media platforms do you manage?",
        a: "Instagram, TikTok, Facebook, LinkedIn, Pinterest, YouTube and X. We recommend focusing on the two or three platforms where your audience actually spends time.",
      },
      {
        q: "Do you create the content as well?",
        a: "Yes. Our designers, writers and motion team create posts, reels, ad creatives and landing pages in-house, so everything is on-brand and produced quickly.",
      },
      {
        q: "Are there long-term contracts?",
        a: "We work on a rolling monthly basis after an initial three-month period, which gives campaigns enough time to learn and optimise properly.",
      },
      {
        q: "How do you report on performance?",
        a: "You get a live dashboard you can check any time, plus a monthly report and call covering results, learnings and the plan for the next month.",
      },
    ],
    ctaHeading: "DIGITAL MARKETING",
    ctaButton: "Get a growth plan",
  },

  /* ─────────────────────────── WEB DEVELOPMENT ─────────────────────────── */
  {
    slug: "web-development",
    name: "Web Development",
    heroLines: ["WEB", "DEVELOPMENT", "BUILT TO SCALE"],
    heroIntro:
      "Fast, accessible websites and web apps built on modern stacks — easy for your team to update, impossible for Google to ignore.",
    heroCta: "Build my site",
    metaTitle: "Web Development Agency — Fast, SEO-Friendly Websites & Web Apps",
    metaDescription:
      "Pixel Popers builds fast, responsive websites and web apps with Next.js and headless CMS: custom development, e-commerce, performance optimisation and technical SEO.",
    accent: "grape",
    overview: {
      eyebrow: "THE FULL STORY",
      heading: "WEBSITES THAT LOAD FAST AND LOOK LOUD",
      paragraphs: [
        "Your website is your hardest-working salesperson. It is open every hour of every day, it greets every customer and it makes a first impression in under a second. If it is slow, broken on mobile or impossible to update, it is quietly costing you customers. Professional web development makes sure your site is fast, reliable and easy to grow.",
        "We build custom websites and web applications with modern, proven technology such as Next.js, React and TypeScript, paired with a headless CMS so your team can edit content without calling a developer. Every page is responsive from the smallest phone to the largest monitor, built to accessibility standards and optimised for Core Web Vitals, because speed affects both user experience and search engine rankings.",
        "Technical SEO is built in, not bolted on. Clean semantic HTML, structured data, sensible URLs, meta tags, sitemaps and image optimisation all ship as standard. We set up analytics and conversion tracking, connect your forms, CRM and payment systems, and test everything across browsers and devices before launch.",
        "Launch day is not the end. We deploy through automated pipelines with preview links for every change, monitor performance after go-live and offer ongoing support and maintenance plans, so your website keeps getting better instead of slowly falling apart.",
      ],
    },
    included: [
      {
        title: "Custom website development",
        body: "Pixel-perfect, responsive builds from your designs (or ours) using Next.js, React and TypeScript, with smooth animations that never compromise performance.",
      },
      {
        title: "Headless CMS setup",
        body: "Sanity, Contentful, Strapi or WordPress as a headless CMS, configured with reusable content blocks so your team can create new pages safely and quickly.",
      },
      {
        title: "E-commerce development",
        body: "Shopify, headless Shopify and custom checkout experiences with product filtering, fast search, secure payments and inventory integrations.",
      },
      {
        title: "Performance optimisation",
        body: "Core Web Vitals tuning, image and font optimisation, code splitting and caching to hit 90+ Lighthouse scores and keep pages loading in a blink.",
      },
      {
        title: "Technical SEO & accessibility",
        body: "Semantic markup, structured data, meta tags, sitemaps and WCAG-aligned accessibility so search engines and every visitor can use your site properly.",
      },
      {
        title: "Hosting, launch & maintenance",
        body: "Deployment on Vercel or your preferred host, SSL, redirects, monitoring and backups, plus optional monthly care plans for updates and new features.",
      },
    ],
    process: [
      {
        title: "Scope",
        body: "We define pages, features, integrations and content models, then agree on a technical plan, timeline and budget. You know exactly what will be built before we write a line of code.",
      },
      {
        title: "Build",
        body: "We develop in short sprints with a live preview link that updates with every change. You can click around the real site from week one and give feedback as it takes shape.",
      },
      {
        title: "Test",
        body: "We test across browsers, devices and screen readers, audit performance and SEO, check every form and integration and fix issues before anything reaches your customers.",
      },
      {
        title: "Launch & care",
        body: "We migrate content, set up redirects, deploy and monitor the launch. Afterwards we train your team on the CMS and offer care plans for updates, fixes and new features.",
      },
    ],
    audience: [
      {
        title: "Brands outgrowing a template",
        body: "Businesses whose website builder has become slow, limiting or hard to manage.",
      },
      {
        title: "Marketing teams",
        body: "Teams that need to launch landing pages fast without waiting on developers.",
      },
      {
        title: "Online stores",
        body: "E-commerce brands that need faster pages, better search and smoother checkout.",
      },
      {
        title: "Start-ups & SaaS",
        body: "Products that need a marketing site and web app built on a scalable foundation.",
      },
    ],
    insights: [
      {
        title: "Why site speed matters",
        body: "Visitors expect pages to load almost instantly, and every extra second increases the chance they leave. Google also uses Core Web Vitals as a ranking signal. Fast websites therefore win twice: more people stay, and more people find you in the first place.",
      },
      {
        title: "What is a headless CMS?",
        body: "A headless CMS stores your content separately from the website's front end. Editors get a friendly interface for writing and publishing, while developers get the freedom to build a fast, custom site. It is flexible, secure and ready for new channels like apps.",
      },
      {
        title: "Built to grow with you",
        body: "We structure code and content models so new pages, languages and features can be added without a rebuild. Reusable components, clear documentation and automated deployments mean your website keeps up with your business instead of holding it back.",
      },
    ],
    whyUs: {
      heading: "WHY TEAMS SHIP WITH US",
      paragraphs: [
        "Our developers work side by side with our designers, so the details that make a design special — the type, the spacing, the animation — survive all the way into production instead of getting lost in translation.",
        "We write clean, documented, maintainable code and hand over full ownership of the repository. No proprietary page builders, no lock-in, and no mystery about how your site works.",
      ],
    },
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Vercel"],
    stats: [
      { value: "98", label: "average Lighthouse score" },
      { value: "<1s", label: "typical page load" },
      { value: "60+", label: "sites launched" },
    ],
    packages: [
      {
        name: "Starter",
        summary: "Landing page",
        price: "From $2,500",
        timeline: "2–3 weeks",
        features: ["1–3 pages", "Responsive build", "Basic SEO"],
      },
      {
        name: "Growth",
        summary: "Business website",
        price: "From $7,500",
        timeline: "5–8 weeks",
        features: ["Everything in Starter", "Up to 12 pages", "CMS & blog", "Analytics"],
        popular: true,
      },
      {
        name: "Full Pop",
        summary: "Custom app / store",
        price: "From $15,000",
        timeline: "8–14 weeks",
        features: ["Everything in Growth", "E-commerce / app logic", "Integrations", "3-month care plan"],
      },
    ],
    faqs: [
      {
        q: "Which technologies do you use?",
        a: "Mostly Next.js, React and TypeScript with Tailwind CSS, a headless CMS such as Sanity or Contentful, and hosting on Vercel. For stores we use Shopify or headless Shopify. We choose what fits your goals, not what is trendy.",
      },
      {
        q: "Will we be able to edit the website ourselves?",
        a: "Yes. We set up an easy CMS with reusable blocks and train your team, so you can update text, images, blog posts and even build new pages without touching code.",
      },
      {
        q: "Is SEO included in web development?",
        a: "Technical SEO is included as standard: fast loading, semantic HTML, meta tags, structured data, sitemaps and redirects. Ongoing content SEO is available through our digital marketing team.",
      },
      {
        q: "Can you redesign and rebuild our existing site?",
        a: "Yes. We audit your current site, keep what ranks well, migrate content and set up redirects so you keep your search traffic while upgrading everything else.",
      },
      {
        q: "Do you offer maintenance after launch?",
        a: "We offer monthly care plans covering updates, security, backups, uptime monitoring, small changes and a bank of hours for new features.",
      },
      {
        q: "Who owns the code?",
        a: "You do. When the project is complete we transfer the repository, hosting and CMS accounts to you, along with documentation so any developer can pick it up.",
      },
    ],
    ctaHeading: "WEB DEVELOPMENT",
    ctaButton: "Start a build",
  },

  /* ─────────────────────────── MOTION GRAPHIC ─────────────────────────── */
  {
    slug: "motion-graphic",
    name: "Motion Graphic",
    heroLines: ["MOTION", "GRAPHICS", "WITH BOUNCE"],
    heroIntro:
      "Logo stings, explainers, reels and UI animation that give your brand rhythm — and keep people watching till the very last frame.",
    heroCta: "Make it move",
    metaTitle: "Motion Graphics Studio — Explainer Videos, Logo Animation & Social Video",
    metaDescription:
      "Pixel Popers creates motion graphics: logo animations, 2D and 3D explainer videos, product animations, UI motion and short-form social video for brands.",
    accent: "sunbeam",
    overview: {
      eyebrow: "THE FULL STORY",
      heading: "STORIES THAT MOVE PEOPLE (LITERALLY)",
      paragraphs: [
        "Movement is the fastest way to catch an eye. On a crowded feed, a still image gets a glance; a few seconds of well-crafted motion gets attention, emotion and memory. Motion graphics turn complicated ideas into simple stories, give your brand a recognisable rhythm and make every product launch feel like an event.",
        "Our motion graphics studio produces animated logos, 2D and 3D explainer videos, product animations, UI and app animations, kinetic typography and short-form social video. Every project starts with a script and a storyboard, because great animation is built on a clear story. Then we design style frames that match your brand identity before a single keyframe is set.",
        "Animation is where the craft lives. We obsess over timing, easing and rhythm — the spring in a logo reveal, the bounce on a button, the pacing of an explainer that keeps people watching to the end. Sound design and music are matched to every beat, and captions are added so your videos work with the sound off, which is how most people watch on social.",
        "We deliver every video in every format you need: 16:9 for YouTube and websites, 1:1 and 4:5 for feeds, 9:16 for Reels, TikTok and Stories, plus lightweight Lottie and web animations for your website and app. One project, ready for every screen.",
      ],
    },
    included: [
      {
        title: "Logo animation",
        body: "A signature animated version of your logo for video intros, outros, website loaders and social posts — the sonic and visual sting people remember.",
      },
      {
        title: "Explainer videos",
        body: "60 to 120-second 2D or 3D explainers that make your product or service easy to understand, from script and voice-over to final animation.",
      },
      {
        title: "Social & short-form video",
        body: "Scroll-stopping Reels, TikToks, Stories and animated posts designed for the first three seconds, with captions and multiple aspect ratios.",
      },
      {
        title: "Product & 3D animation",
        body: "Photoreal or stylised 3D renders and animations that show off your product's details, features and personality without an expensive shoot.",
      },
      {
        title: "UI & web animation",
        body: "Micro-interactions, Lottie files and scroll animations for websites and apps that make interfaces feel responsive, playful and polished.",
      },
      {
        title: "Sound design & delivery",
        body: "Music licensing, sound effects, voice-over casting and mixing, plus exports in every format and resolution your channels require.",
      },
    ],
    process: [
      {
        title: "Script",
        body: "We distil your message into a tight script and talk through the key idea, tone and call to action. A clear script is the single biggest factor in how well a video performs.",
      },
      {
        title: "Storyboard",
        body: "We sketch every scene and design style frames that show exactly how the finished video will look, so you can approve the visual direction before animation begins.",
      },
      {
        title: "Animate",
        body: "Our animators bring the frames to life, refining timing, easing and transitions. You review work-in-progress cuts and give feedback at clear checkpoints.",
      },
      {
        title: "Sound & deliver",
        body: "We add voice-over, music and sound effects, mix the audio and export final files for every platform and aspect ratio — ready to post, play and share.",
      },
    ],
    audience: [
      {
        title: "Tech & SaaS products",
        body: "Products that are hard to explain in words but easy to show in sixty seconds.",
      },
      {
        title: "Consumer & product brands",
        body: "Launches, drops and campaigns that need eye-catching video for social and ads.",
      },
      {
        title: "Marketing & social teams",
        body: "Teams that need a steady stream of short-form content in a consistent style.",
      },
      {
        title: "Events & presentations",
        body: "Openers, stings and animated slides that make keynotes and launches memorable.",
      },
    ],
    insights: [
      {
        title: "Why video outperforms static",
        body: "Motion naturally draws the eye, explains ideas faster and holds attention longer than still images. Short animated videos are favoured by social algorithms and help people remember your brand, which is why video consistently earns higher engagement and click-through rates.",
      },
      {
        title: "2D, 3D or mixed media?",
        body: "2D animation is versatile, quick to produce and great for explaining ideas. 3D adds depth, realism and a premium feel, ideal for products. Mixed media blends live footage, illustration and type for a bold, editorial look. We recommend the style that suits your message and budget.",
      },
      {
        title: "Designed for sound-off viewing",
        body: "Most social video is watched without sound, so we design stories that make sense visually, add bold on-screen text and include captions on every cut. When the sound is on, custom music and effects make it even better.",
      },
    ],
    whyUs: {
      heading: "WHY BRANDS MOVE WITH US",
      paragraphs: [
        "Our motion designers are also brand designers, so your animation feels like a natural extension of your identity rather than a generic template with your logo dropped in.",
        "We plan every video for the channels it will live on. That means hooks in the first seconds, captions for sound-off viewing and versions for every aspect ratio, so one project keeps working across your website, ads and social feeds.",
      ],
    },
    tools: ["After Effects", "Cinema 4D", "Blender", "Premiere Pro", "Lottie", "Rive"],
    stats: [
      { value: "2.6×", label: "higher engagement than static" },
      { value: "80+", label: "videos animated" },
      { value: "4", label: "formats per project" },
    ],
    packages: [
      {
        name: "Starter",
        summary: "Logo sting",
        price: "From $1,200",
        timeline: "1–2 weeks",
        features: ["5–10s logo animation", "2 revisions", "Social formats"],
      },
      {
        name: "Growth",
        summary: "Explainer video",
        price: "From $4,000",
        timeline: "3–5 weeks",
        features: ["Everything in Starter", "60–90s explainer", "Script & storyboard", "Voice-over & music"],
        popular: true,
      },
      {
        name: "Full Pop",
        summary: "Motion system",
        price: "From $8,500",
        timeline: "5–8 weeks",
        features: ["Everything in Growth", "Monthly reels pack", "UI / Lottie set", "3D product shots"],
      },
    ],
    faqs: [
      {
        q: "How long should our explainer video be?",
        a: "For most products, 60 to 90 seconds is ideal. It is long enough to explain the problem and solution and short enough to hold attention. Social cut-downs are usually 6 to 30 seconds.",
      },
      {
        q: "Do you do 2D and 3D animation?",
        a: "Both. 2D works brilliantly for explainers and social content; 3D is perfect for product showcases and premium launches. Many projects mix the two.",
      },
      {
        q: "Can you provide voice-over and music?",
        a: "Yes. We cast professional voice-over artists in many languages and accents, license music and create custom sound design so your video sounds as good as it looks.",
      },
      {
        q: "How many revisions are included?",
        a: "Each stage — script, storyboard and animation — includes two rounds of feedback. Because you approve every stage before the next begins, late surprises are rare.",
      },
      {
        q: "Can you animate for our website or app?",
        a: "Yes. We create lightweight Lottie, Rive and CSS animations for websites and apps, optimised so they look smooth without slowing your pages down.",
      },
      {
        q: "Which formats will we receive?",
        a: "Every project includes exports for 16:9, 1:1, 4:5 and 9:16, plus captions files. Source files are available on request so your team can make future edits.",
      },
    ],
    ctaHeading: "MOTION GRAPHIC",
    ctaButton: "Plan my video",
  },

  /* ─────────────────────────── CONTENT WRITING ─────────────────────────── */
  {
    slug: "content-writing",
    name: "Content Writing",
    heroLines: ["CONTENT", "WRITING", "IN YOUR VOICE"],
    heroIntro:
      "Web copy, blogs, scripts and captions that sound like you on your best day — and rank, convert and get shared.",
    heroCta: "Find my voice",
    metaTitle: "Content Writing & Copywriting Services — SEO Blogs, Website Copy",
    metaDescription:
      "Pixel Popers offers content writing and copywriting: website copy, SEO blog articles, brand tone of voice, social captions, email and video scripts that convert.",
    accent: "blush",
    overview: {
      eyebrow: "THE FULL STORY",
      heading: "WORDS THAT WORK AS HARD AS YOUR DESIGN",
      paragraphs: [
        "Beautiful design gets attention, but words do the convincing. A clear headline tells people they are in the right place, a sharp product description answers their questions before they ask, and a well-written blog article brings them to your website in the first place. Content writing is where your brand finds its voice — and where visitors become customers.",
        "Our content writing and copywriting team writes website copy, landing pages, SEO blog articles, product descriptions, email campaigns, social media captions, video scripts and brand messaging. Every piece starts with research into your audience, your competitors and the questions people are searching for, so the content is useful, original and built to perform.",
        "Search engine optimisation is woven into everything we write. We research keywords and search intent, structure articles with clear headings, write meta titles and descriptions, add internal links and answer the questions people ask Google. But we write for humans first: content that ranks and reads well, rather than keyword-stuffed text nobody wants to finish.",
        "We also help you sound like yourself, consistently. Our tone of voice guides define your personality, vocabulary and dos and don'ts, so every writer, team member and agency you work with can create content that sounds unmistakably like your brand — whether it is a two-word button label, a 2,000-word guide or a caption written five minutes before a post goes live.",
      ],
    },
    included: [
      {
        title: "Website copywriting",
        body: "Homepages, service pages, about pages and landing pages written to explain clearly, build trust and guide visitors towards the action you want them to take.",
      },
      {
        title: "SEO blog articles",
        body: "Researched, long-form articles targeting the keywords your customers search for, structured for readability and optimised to rank and earn links.",
      },
      {
        title: "Tone of voice guide",
        body: "A practical guide to your brand's personality, vocabulary, grammar choices and messaging pillars, with before-and-after examples your team can copy.",
      },
      {
        title: "Social media captions",
        body: "Captions, hooks, hashtags and comment replies that sound human, match your visual content and give people a reason to engage.",
      },
      {
        title: "Email & newsletter writing",
        body: "Subject lines that get opened, newsletters people look forward to and automated email sequences that nurture leads and drive sales.",
      },
      {
        title: "Scripts & product copy",
        body: "Video scripts, ad copy, product descriptions and UX microcopy — the small words on buttons and forms that make a big difference to conversion.",
      },
    ],
    process: [
      {
        title: "Research",
        body: "We study your audience, competitors and search data, interview your team and gather the facts, stories and proof points that make content credible and specific.",
      },
      {
        title: "Outline",
        body: "We agree the structure, key messages and target keywords for each piece. Outlines keep everyone aligned and make first drafts far closer to final.",
      },
      {
        title: "Write & edit",
        body: "Our writers draft, our editors sharpen, and every piece is checked for accuracy, tone, readability and SEO before you see it. Two rounds of revisions are included.",
      },
      {
        title: "Publish & measure",
        body: "We format content for your CMS, add meta data and internal links, and track rankings, traffic and conversions so future content gets smarter over time.",
      },
    ],
    audience: [
      {
        title: "Brands launching a website",
        body: "New and redesigned sites that need clear, persuasive copy on every page.",
      },
      {
        title: "Businesses growing organic traffic",
        body: "Teams that want a steady flow of SEO articles bringing in qualified visitors.",
      },
      {
        title: "Busy founders & teams",
        body: "Experts with plenty to say but no time to write it all down properly.",
      },
      {
        title: "Brands finding their voice",
        body: "Companies whose content sounds different on every channel and every writer.",
      },
    ],
    insights: [
      {
        title: "What is search intent?",
        body: "Search intent is the reason behind a search: to learn, compare, buy or find a specific site. Content that matches intent ranks better and converts better, so we analyse what people actually expect to see before we decide on the format and angle of each piece.",
      },
      {
        title: "Copywriting vs. content writing",
        body: "Copywriting persuades people to take an action, like signing up or buying. Content writing educates, entertains and builds trust over time, often through blogs and guides. Strong brands need both, and our writers are comfortable switching between them.",
      },
      {
        title: "Quality over quantity",
        body: "Publishing fewer, genuinely useful articles beats churning out thin content. In-depth pieces earn links, rank for many related searches and keep readers on your site longer. We plan content calendars around topics that matter, not arbitrary word counts.",
      },
    ],
    whyUs: {
      heading: "WHY BRANDS WRITE WITH US",
      paragraphs: [
        "Our writers work inside a design studio, so they think about how words look on the page — headline lengths, scannable structure, button labels — not just what the words say.",
        "Every word is written by real, experienced writers and edited by a second pair of eyes. We research thoroughly, check facts, avoid fluff and make sure each piece has a clear purpose and a clear call to action.",
      ],
    },
    tools: ["Google Docs", "Semrush", "Ahrefs", "Surfer", "Grammarly", "Notion"],
    stats: [
      { value: "1.2M", label: "words written" },
      { value: "+164%", label: "organic traffic, avg. year one" },
      { value: "48h", label: "first-draft turnaround" },
    ],
    packages: [
      {
        name: "Starter",
        summary: "Copy refresh",
        price: "From $800",
        timeline: "1–2 weeks",
        features: ["Up to 3 pages", "SEO keywords", "1 revision round"],
      },
      {
        name: "Growth",
        summary: "Website + blog",
        price: "From $1,800 / mo",
        timeline: "Monthly",
        features: ["Everything in Starter", "Up to 10 pages", "4 blogs / month", "Meta descriptions"],
        popular: true,
      },
      {
        name: "Full Pop",
        summary: "Content partner",
        price: "From $3,500 / mo",
        timeline: "Monthly",
        features: ["Everything in Growth", "Tone of voice guide", "Social captions", "Video scripts"],
      },
    ],
    faqs: [
      {
        q: "Do you write SEO-optimised content?",
        a: "Yes. Every article and page is based on keyword and search-intent research, with optimised headings, meta titles, descriptions and internal links — while still reading naturally.",
      },
      {
        q: "Who writes the content?",
        a: "Experienced human writers who specialise in your type of business, supported by an editor who checks every piece for accuracy, tone and quality.",
      },
      {
        q: "Can you match our existing brand voice?",
        a: "Absolutely. We study your existing content and guidelines, or create a tone of voice guide with you, so every piece sounds consistently like your brand.",
      },
      {
        q: "How long are your blog articles?",
        a: "Typically 1,200 to 2,500 words, depending on the topic and what is already ranking. We write as long as the subject needs, and no longer.",
      },
      {
        q: "Do you upload content to our website?",
        a: "We can. We format and publish directly in WordPress, Webflow, Sanity, Shopify and most other CMS platforms, including images, meta data and links.",
      },
      {
        q: "How many revisions are included?",
        a: "Two rounds of revisions on every piece. With a clear outline agreed up front, most content is approved after the first round.",
      },
    ],
    ctaHeading: "CONTENT WRITING",
    ctaButton: "Start writing",
  },
];

export function getServiceDetail(slug: string) {
  return serviceDetails.find((s) => s.slug === slug);
}

/** Every crawlable sentence on a service page, used for the word-count check. */
export function serviceWordCount(s: ServiceDetail) {
  const text = [
    s.heroLines.join(" "),
    s.heroIntro,
    s.overview.heading,
    ...s.overview.paragraphs,
    ...s.included.flatMap((i) => [i.title, i.body]),
    ...s.process.flatMap((i) => [i.title, i.body]),
    ...s.audience.flatMap((i) => [i.title, i.body]),
    ...s.insights.flatMap((i) => [i.title, i.body]),
    s.whyUs.heading,
    ...s.whyUs.paragraphs,
    ...s.packages.flatMap((p) => [p.name, p.summary, ...p.features]),
    ...s.faqs.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
