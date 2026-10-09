/*
  Blog data — Figma frames 335:21 "06 — Blog" and 336:21 "07 — Blog Post".
  The home page's blog section features four of these posts. The
  featured post ("How Digital Marketing…") carries the Figma article copy;
  every other post has its own original long-form article.
*/

export type Category =
  "Branding" | "UI/UX" | "Marketing" | "Motion" | "Development" | "Content";
export type Tone = "blush" | "lagoon" | "sunbeam" | "grape";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "stats"; items: { value: string; label: string; tone: Tone }[] }
  | { type: "steps"; items: string[] }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    }
  | {
      type: "callout";
      eyebrow: string;
      title: string;
      label: string;
      href: string;
    };

export type Comment = { name: string; when: string; text: string; tone: Tone };

export type Post = {
  slug: string;
  title: string;
  category: Category;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  readTime: number;
  author: "Adan J." | "James Allen" | "Barry Allen";
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Brand colour behind cut-out style artwork (image is multiplied onto it). */
    bg?: Tone;
  };
  excerpt: string;
  /** Longer summary used for meta descriptions and the featured card. */
  description: string;
  tags: string[];
  featured?: boolean;
  body: Block[];
  comments: Comment[];
};

export const categories: Category[] = [
  "Branding",
  "UI/UX",
  "Marketing",
  "Motion",
  "Development",
  "Content",
];

export const categoryTone: Record<Category, Tone> = {
  Branding: "blush",
  "UI/UX": "grape",
  Marketing: "lagoon",
  Motion: "sunbeam",
  Development: "grape",
  Content: "blush",
};

export const authorBios: Record<
  Post["author"],
  { short: string; long: string }
> = {
  "Barry Allen": {
    short:
      "Founder & Creative Director at Pixel Popers. Believes every brand deserves a little chaos.",
    long: "Barry co-founded Pixel Popers in 2019 after years inside bigger agencies, watching brave ideas get sanded down until they were safe and forgettable. Today he leads the studio’s creative direction across brand identity, campaigns and motion, and has helped everyone from neighbourhood coffee shops to funded start-ups find a voice people actually remember. He writes about branding, marketing and the messy, joyful business of making things people notice. When he isn’t sketching logos on napkins, he’s probably arguing about typefaces or testing a new espresso blend in the studio kitchen.",
  },
  "James Allen": {
    short:
      "Co-Founder & Head of Strategy at Pixel Popers. Turns fuzzy goals into plans that ship.",
    long: "James co-founded Pixel Popers in 2019 and leads strategy across every project, from the first workshop to the launch-day dashboard. He has planned campaigns, content programmes and go-to-market launches for start-ups, retailers and service businesses, and is happiest when a sticky-note wall turns into a plan the whole team believes in. He writes about marketing, content and the numbers that actually matter — and keeps a running list of the worst jargon he hears in meetings.",
  },
  "Adan J.": {
    short:
      "Partner & Technical Lead at Pixel Popers. Makes fast, accessible things that feel lovely to use.",
    long: "Adan is a partner at Pixel Popers and leads the studio’s design-engineering team. He has shipped websites, web apps and design systems for brands across hospitality, property, finance and e-commerce, with a soft spot for performance budgets and well-named components. He writes about UI/UX, development and the small details that make digital products feel effortless — and will happily talk your ear off about accessibility over a long lunch.",
  },
};

const MARKETING_IMG = {
  src: "/assets/inner/marketing.webp",
  width: 1600,
  height: 1067,
};

export const posts: Post[] = [
  {
    slug: "digital-marketing-grow-your-business",
    title: "How Digital Marketing Can Help Your Business Grow Online",
    category: "Marketing",
    date: "2026-09-28",
    readTime: 6,
    author: "Barry Allen",
    featured: true,
    cover: {
      src: "/assets/inner/laptop-blog.webp",
      alt: "Hands typing on a laptop showing a grid of colourful brand campaigns",
      width: 736,
      height: 841,
    },
    excerpt:
      "Having a great product is only one part of building a successful business. Customers also need to discover you, understand what you offer — and have a reason to choose you.",
    description:
      "A no-jargon guide to digital marketing for small businesses: get visible, know your audience, build a content engine, measure what matters and follow a simple 30-day plan.",
    tags: ["Marketing", "SEO", "Growth", "Branding"],
    body: [
      {
        type: "p",
        text: "Having a great product or service is only one part of building a successful business. Your potential customers also need to discover your business, understand what you offer, and have a reason to choose you over everyone else.",
      },
      {
        type: "p",
        text: "That’s where digital marketing comes in. Done right, it turns strangers into fans and fans into loyal customers — without shouting louder than everyone else.",
      },
      { type: "h2", text: "Why visibility matters" },
      {
        type: "p",
        text: "Today, nearly every buying journey starts with a search, a scroll or a recommendation. If your brand isn’t showing up in those moments, someone else’s is.",
      },
      {
        type: "p",
        text: "Visibility isn’t about being everywhere at once. It’s about being findable in the three or four places your customers already trust — a Google search, a friend’s Instagram story, a newsletter they actually open. When your brand turns up consistently in those moments, people start to recognise you before they ever need you, and that recognition makes the eventual click feel like an easy decision rather than a gamble.",
      },
      {
        type: "p",
        text: "The good news? Small businesses can win here. Search engines reward helpful, specific answers rather than big budgets, and social platforms reward personality over polish.",
      },
      {
        type: "quote",
        text: "Safe is forgettable. The brands that win online are the ones people can’t help but notice.",
      },
      { type: "h2", text: "Know your audience" },
      {
        type: "p",
        text: "Before a single ad goes live, get specific about who you’re talking to. What do they care about? Where do they hang out? What would make them stop scrolling?",
      },
      {
        type: "p",
        text: "The easiest way to get specific is to write a one-page audience snapshot — no jargon, no 40-slide persona deck. We ask every client to answer four questions before we plan a single campaign:",
      },
      {
        type: "list",
        items: [
          "Who is the one customer you’d clone if you could?",
          "What problem are they trying to solve the day they find you?",
          "Which apps and sites do they check before breakfast?",
          "What would make them trust a brand they’ve never heard of?",
        ],
      },
      {
        type: "p",
        text: "Your answers become the filter for everything else: the words on your homepage, the platforms you prioritise and the offers you lead with.",
      },
      {
        type: "image",
        ...MARKETING_IMG,
        alt: "Person typing on a laptop as social media icons, hearts and emojis float out of the screen",
        caption: "Social, search and email working together as one system.",
      },
      { type: "h2", text: "Key takeaways" },
      {
        type: "list",
        items: [
          "Show up where your customers already are.",
          "Lead with a clear, memorable brand.",
          "Create content worth sharing.",
          "Measure everything — then double down.",
        ],
      },
      { type: "h2", text: "Content that converts" },
      {
        type: "p",
        text: "Great content answers the questions your customers are already asking — then gives them one clear next step. Every post, reel or email should earn attention and point somewhere useful.",
      },
      {
        type: "stats",
        items: [
          {
            value: "3×",
            label: "more leads from blogs with a clear CTA",
            tone: "blush",
          },
          {
            value: "70%",
            label: "of buyers research online first",
            tone: "lagoon",
          },
          { value: "5s", label: "to win attention on social", tone: "sunbeam" },
        ],
      },
      { type: "h2", text: "Build a content engine" },
      {
        type: "p",
        text: "Consistency beats virality. One brilliant post that disappears for three months does less for your business than a steady rhythm of useful, recognisable content. We call this a content engine: a small set of repeatable formats your team can produce every week without burning out.",
      },
      {
        type: "p",
        text: "Start with one “hero” piece a month — a guide, a case study or a short video — and slice it into smaller pieces for social, email and search. A 1,200-word guide can become five carousel posts, two short reels, a newsletter and a handful of answers for your FAQ page. Same idea, many doors in.",
      },
      {
        type: "p",
        text: "Keep your tone of voice consistent across all of them. If your website sounds like a bank and your Instagram sounds like a stand-up comedian, people won’t connect the two — and they definitely won’t remember either.",
      },
      { type: "h2", text: "Measure, then pop" },
      {
        type: "p",
        text: "Pick three numbers that matter — not thirty. Track them monthly, kill what doesn’t work and double down on what does.",
      },
      {
        type: "steps",
        items: [
          "Set one clear goal per channel",
          "Review numbers every month",
          "Test one new idea every week",
        ],
      },
      {
        type: "p",
        text: "Most importantly, give every channel a single job. Social builds awareness, search captures intent and email nurtures the people who already like you. When each channel knows its role, reporting gets simpler — and your budget stops leaking into activity that looks busy but doesn’t move the needle.",
      },
      {
        type: "callout",
        eyebrow: "Need a hand?",
        title: "Get a free marketing audit",
        label: "Book my audit",
        href: "/contact",
      },
      { type: "h2", text: "Your first 30 days" },
      {
        type: "p",
        text: "If all of this feels like a lot, don’t try to do it all at once. Here’s the simple plan we give founders who want momentum without a massive budget:",
      },
      {
        type: "list",
        items: [
          "Week 1: write your audience snapshot and tidy up your Google Business Profile.",
          "Week 2: rewrite your homepage headline so it says what you do in under ten words.",
          "Week 3: publish one genuinely helpful article and share it in three places.",
          "Week 4: pick your three numbers, set a baseline and book a monthly review.",
        ],
      },
      {
        type: "p",
        text: "Thirty days won’t transform your business overnight, but it will give you a foundation that compounds. Every month after that, you’re building on something real instead of starting again from scratch.",
      },
      {
        type: "p",
        text: "Digital marketing works best when it feels less like advertising and more like being genuinely useful in public. Be clear, be consistent, be a little bit brave — and your customers will happily do the rest of the talking for you.",
      },
    ],
    comments: [
      {
        name: "Sana K.",
        when: "2 days ago",
        text: "The “three numbers” rule changed how we report. Thanks for this!",
        tone: "blush",
      },
      {
        name: "Omar R.",
        when: "5 days ago",
        text: "Bookmarking the stat boxes for my next pitch deck 😅",
        tone: "lagoon",
      },
      {
        name: "Lena M.",
        when: "1 week ago",
        text: "Would love a follow-up on email flows!",
        tone: "sunbeam",
      },
    ],
  },
  {
    slug: "bold-brands-win-the-scroll",
    title: "Why Bold Brands Win The Scroll",
    category: "Branding",
    date: "2026-09-22",
    readTime: 5,
    author: "Barry Allen",
    cover: {
      src: "/assets/inner/cube.webp",
      alt: "A tilted cube of brand photos with a smiling woman in glasses on the front face",
      width: 783,
      height: 851,
      bg: "blush",
    },
    excerpt:
      "Half a second is all you get. Here’s how a confident identity earns the pause.",
    description:
      "Why distinctive, confident brands stop the scroll — what “bold” really means, the numbers behind recognition and a five-step plan to make your brand bolder this quarter.",
    tags: ["Branding", "Identity", "Social"],
    body: [
      {
        type: "p",
        text: "Open any social app and you’ll scroll past hundreds of posts before your coffee has cooled. Most of them blur into one beige smear: the same stock photos, the same safe sans-serif, the same “we’re passionate about quality” captions. Then, every so often, something stops your thumb. A colour you didn’t expect. A headline that sounds like a person. A logo you recognise before you’ve even read the name.",
      },
      {
        type: "p",
        text: "That pause is the most valuable half-second in modern marketing, and it rarely happens by accident. Bold brands win the scroll because they’ve made a series of deliberate, slightly brave decisions long before anything gets posted.",
      },
      { type: "h2", text: "Recognition beats attention" },
      {
        type: "p",
        text: "Attention is cheap — a loud sound or a flashing graphic can grab it for a moment. Recognition is different. It’s the moment someone sees a sliver of your feed or packaging and knows it’s you without reading a word. That’s what turns a passing glance into trust, and trust into a purchase.",
      },
      {
        type: "p",
        text: "Recognition comes from the consistent use of a few distinctive assets: a signature colour, a typeface with personality, a shape or mascot, a tone of voice. The fewer assets you have, and the more relentlessly you use them, the faster people learn them.",
      },
      {
        type: "quote",
        text: "If you covered your logo, would anyone still know it was you? That’s the test every bold brand passes.",
      },
      { type: "h2", text: "What “bold” actually means" },
      {
        type: "p",
        text: "Bold doesn’t mean loud for the sake of it. Neon gradients slapped on a confused message are still confusing. In our experience, the brands that cut through share four traits:",
      },
      {
        type: "list",
        items: [
          "A clear point of view — they stand for something specific and say it plainly.",
          "A restricted palette — two or three colours used with conviction, not twelve used timidly.",
          "Type with character — at least one typeface that couldn’t belong to anyone else.",
          "A voice that sounds human — copy you could imagine a real person saying out loud.",
        ],
      },
      { type: "h2", text: "The numbers behind distinctiveness" },
      {
        type: "p",
        text: "There’s a commercial case for all this, not just an aesthetic one. Across our own brand projects we track recognition and engagement before and after a rebrand, and the patterns are remarkably consistent:",
      },
      {
        type: "stats",
        items: [
          {
            value: "2.4×",
            label: "average lift in social engagement after a rebrand",
            tone: "blush",
          },
          {
            value: "80%",
            label: "of clients see higher click-through on paid ads",
            tone: "lagoon",
          },
          {
            value: "6wk",
            label: "for audiences to recognise new brand assets",
            tone: "sunbeam",
          },
        ],
      },
      {
        type: "p",
        text: "None of these numbers come from being louder. They come from being clearer and more consistent — the identity does more of the work, so every individual post doesn’t have to.",
      },
      { type: "h2", text: "Make your brand bolder this quarter" },
      {
        type: "p",
        text: "You don’t need a full rebrand to start. Here’s the sequence we use with clients who want more presence without starting from scratch:",
      },
      {
        type: "steps",
        items: [
          "Screenshot every touchpoint and pin them on one wall",
          "Pick one hero colour and use it everywhere for a month",
          "Rewrite your bio and homepage headline in plain, confident language",
          "Create three reusable post templates built on your assets",
          "Notice what people comment on — then lean into it",
        ],
      },
      {
        type: "p",
        text: "Run that loop for a quarter and you’ll be amazed how quickly people start tagging you, recognising your packaging on the shelf and replying to your stories as if they know you. Because, in a way, they do.",
      },
      {
        type: "p",
        text: "Just as important: resist the urge to change things the moment you get bored. You will tire of your brand long before your customers even notice it. Consistency feels repetitive from the inside and reassuring from the outside.",
      },
      {
        type: "callout",
        eyebrow: "Ready to be unmissable?",
        title: "Get a free brand audit",
        label: "Book my audit",
        href: "/contact",
      },
      { type: "h2", text: "Brave, not reckless" },
      {
        type: "p",
        text: "One last thing: bold brands still do their homework. Every brave choice we make for a client is rooted in research — who the audience is, what competitors look like and where the gaps are. Boldness without strategy is just noise; strategy without boldness is invisible. Put the two together and the scroll starts working for you, not against you.",
      },
    ],
    comments: [
      {
        name: "Priya D.",
        when: "3 days ago",
        text: "The “cover your logo” test is brutal. We failed it. Working on it!",
        tone: "lagoon",
      },
      {
        name: "Tom W.",
        when: "1 week ago",
        text: "Restricted palette advice is so underrated. Fewer colours, more recognition.",
        tone: "sunbeam",
      },
    ],
  },
  {
    slug: "interfaces-people-enjoy",
    title: "Designing Interfaces People Actually Enjoy",
    category: "UI/UX",
    date: "2026-09-10",
    readTime: 5,
    author: "Adan J.",
    cover: {
      src: "/assets/inner/elevate.webp",
      alt: "Laptop and phone mock-ups reading “Drop your design” on a ribbed red and black plinth",
      width: 1600,
      height: 951,
      bg: "lagoon",
    },
    excerpt:
      "Good UX feels invisible. Five habits we use to make products effortless and fun.",
    description:
      "Five UI/UX habits for products people enjoy: design for the job, make the next step obvious, sweat the micro-feedback, use real content and test early and cheaply.",
    tags: ["UI/UX", "Product", "Usability"],
    body: [
      {
        type: "p",
        text: "Most people can’t tell you why they love an app. They’ll say it’s “easy” or “nice to use”, then move on. That vagueness is a compliment: the best interfaces fade into the background, leaving people free to focus on what they came to do.",
      },
      {
        type: "p",
        text: "Designing that kind of invisibility takes a surprising amount of deliberate work. Here are the five habits our product team leans on for every UI/UX project, from booking flows to analytics dashboards.",
      },
      { type: "h2", text: "1. Start with the job, not the screen" },
      {
        type: "p",
        text: "Before we open a design tool, we write down the job a person is hiring the product to do. Not “use the dashboard”, but “find out whether this month’s campaign is working before my 10am meeting.” Framing work this way keeps every screen honest: if an element doesn’t help with that job, it has to justify its place.",
      },
      { type: "h2", text: "2. Make the next step obvious" },
      {
        type: "p",
        text: "Every screen should answer one question at a glance: what do I do now? We use a single primary action per view, a clear visual hierarchy and labels that describe outcomes (“Send invoice”) rather than mechanics (“Submit”). When we test prototypes, the first thing we watch for is hesitation — the half-second where someone’s cursor hovers, unsure.",
      },
      {
        type: "quote",
        text: "Good design is invisible until it’s missing. Then it’s the only thing anyone can talk about.",
      },
      { type: "h2", text: "3. Sweat the small feedback" },
      {
        type: "p",
        text: "Micro-interactions do a lot of quiet heavy lifting. A button that subtly presses in, a form field that confirms a valid email as you type, a message that says exactly what just happened — these tiny moments build confidence. They tell people the product is listening.",
      },
      {
        type: "list",
        items: [
          "Respond to every tap or click within 100 milliseconds.",
          "Show progress for anything that takes longer than a second.",
          "Write error messages that explain how to fix the problem.",
          "Celebrate completions — a little delight goes a long way.",
        ],
      },
      { type: "h2", text: "4. Design with real content" },
      {
        type: "p",
        text: "Lorem ipsum lies. Real names are long, real photos are badly cropped and real users paste three paragraphs where you expected three words. We design with real or realistic content from the very first wireframe, so layouts are tested against the messy reality they’ll actually face.",
      },
      {
        type: "stats",
        items: [
          {
            value: "38%",
            label: "fewer support tickets after our last dashboard redesign",
            tone: "blush",
          },
          {
            value: "4.8★",
            label: "average app-store rating across recent launches",
            tone: "lagoon",
          },
          {
            value: "2min",
            label: "median time to finish a redesigned onboarding",
            tone: "sunbeam",
          },
        ],
      },
      { type: "h2", text: "5. Test early, often and cheaply" },
      {
        type: "p",
        text: "You don’t need a lab to learn whether a design works. Five people, a clickable prototype and a quiet video call will surface most usability problems in an afternoon. We run small tests at every stage:",
      },
      {
        type: "steps",
        items: [
          "Low-fidelity sketches to check the flow",
          "Clickable prototypes to test navigation and labels",
          "Polished UI to test clarity, trust and delight",
          "Live analytics to see what people really do",
        ],
      },
      {
        type: "p",
        text: "Each round is cheaper than the fix would have been. A confusing label caught in a sketch costs five minutes; the same mistake caught after launch can cost months of confused customers.",
      },
      {
        type: "p",
        text: "Don’t forget accessibility while you test. Check colour contrast, try every flow with only a keyboard and run a screen reader over the key pages. Accessible products are easier for everyone to use, not just the people who rely on assistive technology — and they tend to rank better in search, too.",
      },
      {
        type: "callout",
        eyebrow: "Want a second opinion?",
        title: "Get a free UX review",
        label: "Book my review",
        href: "/contact",
      },
      { type: "h2", text: "Enjoyment is a feature" },
      {
        type: "p",
        text: "Usability gets people through the door; enjoyment brings them back. Once the fundamentals are solid, we look for small, appropriate moments of personality — a playful empty state, a satisfying animation when a task is done, a line of copy that makes someone smile. It’s the difference between a tool people tolerate and a product they recommend to their friends.",
      },
    ],
    comments: [
      {
        name: "Marco B.",
        when: "4 days ago",
        text: "“Lorem ipsum lies” is going on a sticker for our design team.",
        tone: "grape",
      },
      {
        name: "Hannah L.",
        when: "1 week ago",
        text: "Five-person tests saved our last release. Can confirm this works.",
        tone: "blush",
      },
    ],
  },
  {
    slug: "snack-bar-campaign-playbook",
    title: "The Campaign Playbook Behind Snack Bar",
    category: "Marketing",
    date: "2026-08-28",
    readTime: 5,
    author: "James Allen",
    cover: {
      src: "/assets/inner/campaign-strip.webp",
      alt: "Colourful 3D campaign artwork for “Clim” shown as a carousel of panels",
      width: 1600,
      height: 891,
      bg: "sunbeam",
    },
    excerpt:
      "From one scrappy idea to a full launch — the plan, the visuals and the results.",
    description:
      "How we launched Snack Bar on a tiny budget: one sharp campaign idea, thumb-stopping visuals, a three-wave launch plan and the results — plus what you can borrow.",
    tags: ["Marketing", "Campaigns", "Social"],
    body: [
      {
        type: "p",
        text: "Snack Bar came to us with a great product, a tiny launch budget and a very crowded shelf. Their brief was refreshingly honest: “We need people to notice us, try us and tell their friends — in that order.”",
      },
      {
        type: "p",
        text: "Here’s the playbook we built, step by step, and what we learned along the way. Steal whatever’s useful.",
      },
      { type: "h2", text: "Start with one sharp idea" },
      {
        type: "p",
        text: "Every strong campaign hangs off a single idea you can explain in a sentence. After two workshops and a wall of sticky notes, we landed on “Bold flavour for boring afternoons” — a line that gave us a villain (the 3pm slump), a hero (the snack) and a tone of voice (cheeky, upbeat, a little rebellious).",
      },
      {
        type: "p",
        text: "That idea became the filter for every decision. If a post, visual or partnership didn’t fight the boring afternoon, it didn’t make the cut.",
      },
      {
        type: "quote",
        text: "A campaign without one clear idea is just a collection of posts hoping to be noticed.",
      },
      { type: "h2", text: "Build visuals that stop the thumb" },
      {
        type: "p",
        text: "We pushed Snack Bar’s green and yellow palette as far as it would go and paired it with a chunky circular badge that worked as a logo, a sticker and a social avatar. Every asset was designed to be recognisable at a glance, even when cropped into a tiny square or shown for less than a second in a story.",
      },
      {
        type: "list",
        items: [
          "One hero key visual, adapted into more than 40 formats.",
          "A sticker system people could use in their own posts.",
          "Short, loopable videos designed to work with the sound off.",
          "Packaging that doubled as a shareable photo prop.",
        ],
      },
      { type: "h2", text: "Launch in waves, not all at once" },
      {
        type: "p",
        text: "Rather than spend the whole budget on day one, we planned the launch as three waves, each with its own job:",
      },
      {
        type: "steps",
        items: [
          "Tease: mystery stickers and countdown posts to build curiosity",
          "Reveal: the full campaign, creator partnerships and sampling events",
          "Sustain: customer content, reviews and a monthly flavour drop",
        ],
      },
      {
        type: "p",
        text: "Pacing the spend this way meant we could learn from the first wave and put more money behind what was working before the big reveal.",
      },
      {
        type: "p",
        text: "Creators were briefed with a single page rather than a script. We shared the idea, the assets and three things we’d love them to show, then let them make it their own. The posts that performed best were the least polished — real afternoons, real desks, real slumps being rescued by a very green snack.",
      },
      { type: "h2", text: "The results" },
      {
        type: "stats",
        items: [
          {
            value: "3.1M",
            label: "organic impressions in the first six weeks",
            tone: "blush",
          },
          {
            value: "27%",
            label: "of samplers bought again within a month",
            tone: "lagoon",
          },
          {
            value: "4×",
            label: "return on paid social spend",
            tone: "sunbeam",
          },
        ],
      },
      {
        type: "p",
        text: "The numbers were great, but the moment we knew it had worked was smaller: customers started posting photos of the badge stuck to their laptops without being asked. When people adopt your brand assets as their own, the campaign has truly landed.",
      },
      {
        type: "p",
        text: "Not everything worked, of course. A countdown series on one platform barely moved, and an early influencer partnership felt too scripted. Because we were reviewing results weekly, we cut both within days and moved the budget into sampling, which consistently delivered our best cost per new customer.",
      },
      {
        type: "callout",
        eyebrow: "Planning a launch?",
        title: "Get a free campaign audit",
        label: "Book my audit",
        href: "/contact",
      },
      { type: "h2", text: "What you can borrow" },
      {
        type: "p",
        text: "You don’t need Snack Bar’s product to use its playbook. Find one sharp idea, design assets that are recognisable in a split second, launch in waves so you can learn as you go, and give your audience something they’ll want to share. Do that consistently and even a small budget can make a very big noise.",
      },
      {
        type: "p",
        text: "And keep listening after launch. The best ideas for Snack Bar’s second campaign came straight from the comments on the first one — including a flavour name we’d never have dared to suggest ourselves.",
      },
    ],
    comments: [
      {
        name: "Jade P.",
        when: "6 days ago",
        text: "Launching in waves is such a smart way to protect a small budget.",
        tone: "sunbeam",
      },
      {
        name: "Ravi S.",
        when: "2 weeks ago",
        text: "Would love to see the full sticker system one day!",
        tone: "grape",
      },
    ],
  },
  {
    slug: "motion-that-means-something",
    title: "Motion That Means Something",
    category: "Motion",
    date: "2026-08-14",
    readTime: 5,
    author: "Barry Allen",
    cover: {
      src: "/assets/inner/motion.webp",
      alt: "Motion design tools: easing curves, a timeline and floating panels on a purple gradient",
      width: 1120,
      height: 980,
    },
    excerpt:
      "Animation should explain, guide and delight — never just decorate. Here’s how.",
    description:
      "Meaningful motion design: the three jobs of animation, how to give your brand a motion language, performance-first web animation and where to start.",
    tags: ["Motion", "Animation", "Web"],
    body: [
      {
        type: "p",
        text: "Motion is having a moment. Every brand wants animated logos, scroll-triggered effects and looping social videos. But a lot of motion on the web today is decoration for its own sake — things spin, bounce and fade simply because they can.",
      },
      {
        type: "p",
        text: "At Pixel Popers we have a simple rule: every movement needs a reason. When motion has a job, it makes brands feel alive and interfaces feel effortless. When it doesn’t, it just gets in the way.",
      },
      { type: "h2", text: "The three jobs of motion" },
      {
        type: "p",
        text: "Almost every piece of meaningful motion falls into one of three categories:",
      },
      {
        type: "list",
        items: [
          "Explain — show how something works, how parts connect or how a process unfolds.",
          "Guide — direct attention to what matters next, or show where something came from.",
          "Delight — add personality at the right moment, so a brand feels human and memorable.",
        ],
      },
      {
        type: "p",
        text: "If an animation doesn’t do at least one of these jobs, we cut it. If it does two, we keep it and polish it until it shines.",
      },
      {
        type: "quote",
        text: "Motion should feel like the brand breathing, not the brand showing off.",
      },
      { type: "h2", text: "Give your brand a motion language" },
      {
        type: "p",
        text: "Just as a brand has colours and typefaces, it should have a consistent way of moving. Is it springy and playful, or smooth and precise? Do elements slide, pop or unfold? We define this in a short motion guide alongside the visual identity, covering easing curves, durations and a handful of signature moves.",
      },
      {
        type: "stats",
        items: [
          {
            value: "300ms",
            label: "sweet spot for most interface transitions",
            tone: "blush",
          },
          {
            value: "3",
            label: "signature moves in a typical motion guide",
            tone: "lagoon",
          },
          {
            value: "60fps",
            label: "target for every web animation we ship",
            tone: "sunbeam",
          },
        ],
      },
      {
        type: "p",
        text: "The result is motion that feels coherent whether it’s on a website, in a social ad or on a trade-show screen. People may not consciously notice it, but they feel the consistency — and it makes the brand feel more crafted and trustworthy.",
      },
      { type: "h2", text: "Performance first, always" },
      {
        type: "p",
        text: "Beautiful animation that stutters on a mid-range phone isn’t beautiful. We build web motion with performance baked in from the start:",
      },
      {
        type: "steps",
        items: [
          "Animate transform and opacity wherever possible",
          "Respect reduced-motion settings with calmer alternatives",
          "Load heavy animations only when they scroll into view",
          "Test on real, slightly old devices — not just new laptops",
        ],
      },
      {
        type: "p",
        text: "These habits keep sites fast, accessible and pleasant for everyone, including people who find a lot of movement uncomfortable.",
      },
      { type: "h2", text: "Motion beyond the website" },
      {
        type: "p",
        text: "The same principles apply on social. Short, looping videos that make one point clearly will outperform long, busy edits almost every time. Design for the sound off, put the hook in the first second and make sure your brand assets — colour, type, logo — appear early enough that people know who they’re watching before they scroll on.",
      },
      {
        type: "p",
        text: "For product launches and pitch decks, a few seconds of explainer animation can replace paragraphs of text. Showing how something works is nearly always faster and more convincing than describing it.",
      },
      {
        type: "p",
        text: "Whatever the format, storyboard first. A rough sequence of sketches agreed before any animation begins saves days of revisions and keeps everyone focused on the message rather than the effects.",
      },
      {
        type: "callout",
        eyebrow: "Want your brand to move?",
        title: "Get a free motion consult",
        label: "Book a call",
        href: "/contact",
      },
      { type: "h2", text: "Start small" },
      {
        type: "p",
        text: "You don’t need a two-minute brand film to benefit from motion. Start with an animated logo sting, a few purposeful micro-interactions on your website and a set of templates for social video. Give each one a clear job, keep the movement consistent and your brand will start to feel a lot more alive.",
      },
      {
        type: "p",
        text: "Then watch how people respond. The animations that get screenshotted, shared or mentioned in reviews are the ones to build on; the ones nobody notices can usually go.",
      },
      {
        type: "p",
        text: "Motion done well is a quiet multiplier. It makes good design feel better, clear messages land faster and brands feel like they have a pulse.",
      },
    ],
    comments: [
      {
        name: "Elif T.",
        when: "1 week ago",
        text: "Explain, guide, delight — such a clean way to critique motion work.",
        tone: "lagoon",
      },
      {
        name: "Sam O.",
        when: "2 weeks ago",
        text: "Thank you for mentioning reduced motion. Too many studios forget it.",
        tone: "blush",
      },
    ],
  },
  {
    slug: "professional-website-for-every-business",
    title: "Every Business Needs A Professional Website",
    category: "Development",
    date: "2026-07-30",
    readTime: 5,
    author: "Adan J.",
    cover: {
      src: "/assets/inner/webdev.webp",
      alt: "Desk with a monitor of code, a tablet and a phone showing a landing page design",
      width: 1120,
      height: 1400,
    },
    excerpt:
      "Your website is your hardest-working salesperson. Is yours pulling its weight?",
    description:
      "Why every business needs a professional website: first impressions, what a good site must do, why speed, SEO and accessibility matter and how we build sites that last.",
    tags: ["Development", "Web design", "SEO"],
    body: [
      {
        type: "p",
        text: "Social profiles come and go, algorithms change overnight and marketplaces take a cut of every sale. Your website is the one corner of the internet you truly own. It works around the clock, answers questions while you sleep and is often the very first impression a customer gets of your business.",
      },
      {
        type: "p",
        text: "Yet many small businesses still treat their site as an afterthought — a template set up years ago and left alone. Here’s why that’s costing you, and what a professional website should actually do.",
      },
      { type: "h2", text: "First impressions happen fast" },
      {
        type: "p",
        text: "Visitors form an opinion of your site in a fraction of a second, and that opinion colours everything that follows. A dated layout, slow loading or a confusing menu quietly signals that the business behind it might be the same. A clear, modern and fast site signals the opposite: you’re credible, current and easy to work with.",
      },
      {
        type: "stats",
        items: [
          {
            value: "0.05s",
            label: "for visitors to form a first impression",
            tone: "blush",
          },
          {
            value: "53%",
            label: "of mobile visitors leave if a page takes over 3s",
            tone: "lagoon",
          },
          {
            value: "75%",
            label: "judge credibility by website design",
            tone: "sunbeam",
          },
        ],
      },
      { type: "h2", text: "What a professional website must do" },
      {
        type: "p",
        text: "Beautiful is good, but a business website has a job to do. Every site we build is designed to:",
      },
      {
        type: "list",
        items: [
          "Explain what you do, and who it’s for, within five seconds.",
          "Load quickly on any device, including patchy mobile connections.",
          "Make the next step — call, book, buy or enquire — impossible to miss.",
          "Be found on Google for the searches your customers actually make.",
          "Be easy for your team to update without calling a developer.",
        ],
      },
      {
        type: "quote",
        text: "Your website is the only salesperson who never takes a day off. Make sure it’s a good one.",
      },
      { type: "h2", text: "Speed, SEO and accessibility aren’t extras" },
      {
        type: "p",
        text: "Search engines reward sites that are fast, well structured and accessible — and so do people. We build on modern frameworks like Next.js, optimise every image, write semantic HTML and follow accessibility guidelines from day one. That technical foundation means your content gets found, loads instantly and works for everyone, including people using screen readers or keyboards.",
      },
      {
        type: "p",
        text: "Then there’s security and ownership. A professional site runs on reliable hosting with automatic backups, uses HTTPS everywhere and lives on a domain you control. Too many businesses discover, at the worst possible moment, that their website is registered to a former freelancer or locked inside a platform they can’t leave.",
      },
      { type: "h2", text: "How we build a site that lasts" },
      {
        type: "steps",
        items: [
          "Discovery: goals, audience, competitors and a content audit",
          "Structure: sitemap, user journeys and wireframes",
          "Design: a visual system built on your brand",
          "Build: fast, accessible, SEO-ready development",
          "Launch and grow: analytics, testing and improvements",
        ],
      },
      {
        type: "p",
        text: "Each stage has clear deliverables and sign-offs, so there are no surprises — and you end up with a site that’s easy to grow rather than one you’ll need to replace in two years.",
      },
      {
        type: "p",
        text: "Launch day is a beginning, not an ending. The best-performing sites we look after are reviewed every month: which pages people land on, where they drop off, what they search for and which calls to action they ignore. Small, regular improvements beat a big redesign every few years.",
      },
      {
        type: "callout",
        eyebrow: "Is your site pulling its weight?",
        title: "Get a free website audit",
        label: "Book my audit",
        href: "/contact",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "A professional website isn’t a cost to minimise — it’s an asset that compounds. Every visitor it converts, every enquiry it captures and every search it ranks for keeps paying back long after launch day. If your current site is more of an apology than an advert, it might be time for a rethink.",
      },
      {
        type: "p",
        text: "Start by asking three honest questions: would you be proud to send a dream client to it today, does it work beautifully on your phone, and can you update it yourself? If any answer is no, you already know where your next investment should go.",
      },
    ],
    comments: [
      {
        name: "Grace N.",
        when: "2 weeks ago",
        text: "We rebuilt our site last spring and enquiries doubled. Wish we’d done it sooner.",
        tone: "sunbeam",
      },
      {
        name: "Dev A.",
        when: "3 weeks ago",
        text: "The five-second test is a great gut check. Ours needed work!",
        tone: "grape",
      },
    ],
  },
  {
    slug: "web-copy-that-sounds-like-you",
    title: "Writing Web Copy That Sounds Like You",
    category: "Content",
    date: "2026-07-18",
    readTime: 5,
    author: "James Allen",
    cover: {
      src: "/assets/inner/writing.webp",
      alt: "Woman in glasses writing notes beside her laptop in a sunny café window",
      width: 698,
      height: 611,
    },
    excerpt:
      "Swap corporate filler for words customers actually read, trust and act on.",
    description:
      "How to write website copy that sounds human: write like you talk, lead with the reader, define your tone of voice, make pages scannable — and why good copy is good SEO.",
    tags: ["Content", "Copywriting", "SEO"],
    body: [
      {
        type: "p",
        text: "Read the homepage of almost any business and you’ll find the same phrases: “innovative solutions”, “customer-centric approach”, “passionate about excellence”. None of it is wrong, exactly. It’s just invisible. Readers have seen those words so many times that their eyes slide straight past them.",
      },
      {
        type: "p",
        text: "Great web copy does the opposite. It sounds like a real person who knows their stuff, talks to you directly and makes it obvious what to do next. Here’s how to write copy that sounds like you — on a good day.",
      },
      { type: "h2", text: "Write like you talk (then tidy up)" },
      {
        type: "p",
        text: "Imagine explaining your business to a friend over coffee. You wouldn’t say “we leverage synergies to deliver bespoke outcomes”. You’d say “we help small cafés sell more coffee online.” Start there. Record yourself explaining what you do, transcribe it, then edit for clarity. The rhythm of real speech is almost always more engaging than a blank page.",
      },
      {
        type: "quote",
        text: "If you wouldn’t say it out loud to a customer, don’t put it on your website.",
      },
      { type: "h2", text: "Lead with the reader, not the company" },
      {
        type: "p",
        text: "Count how many sentences on your homepage start with “we”. Then try flipping them. “We offer flexible plans” becomes “Pick a plan that fits your month.” Copy that focuses on the reader’s problem and outcome feels more relevant and more persuasive — and it naturally pushes you towards benefits rather than features.",
      },
      { type: "h2", text: "A quick checklist for every page" },
      {
        type: "list",
        items: [
          "Can a stranger tell what you do within five seconds?",
          "Is every headline specific enough that a competitor couldn’t use it?",
          "Have you cut every word that doesn’t earn its place?",
          "Is there one clear call to action, written as an outcome?",
          "Would you be happy to read it aloud to a customer?",
        ],
      },
      { type: "h2", text: "Find your voice — and write it down" },
      {
        type: "p",
        text: "Your tone of voice is how your personality shows up in words. We help clients define theirs with three simple “this, not that” pairs, such as “confident, not arrogant”, “playful, not silly” and “clear, not clinical”. Add a short list of words you love and words you never use, and you have a voice guide anyone on your team can follow.",
      },
      {
        type: "stats",
        items: [
          {
            value: "79%",
            label: "of people scan a page rather than read every word",
            tone: "blush",
          },
          {
            value: "5s",
            label: "to tell visitors what you do and why it matters",
            tone: "lagoon",
          },
          {
            value: "3",
            label: "“this, not that” pairs to define your voice",
            tone: "sunbeam",
          },
        ],
      },
      { type: "h2", text: "Make it easy to scan" },
      {
        type: "p",
        text: "Most visitors skim before they decide to read. Help them with descriptive headings, short paragraphs, bullet points for lists and bold for the one phrase that matters most. Front-load the important words in every sentence, so even a quick glance tells the story.",
      },
      {
        type: "p",
        text: "Buttons and links deserve the same care. “Click here” and “Learn more” tell people nothing; “See our prices” or “Book a free call” tell them exactly what happens next, which makes them far more likely to click.",
      },
      {
        type: "steps",
        items: [
          "Write the headline last, once you know the point",
          "Break long paragraphs into two or three sentences",
          "Turn any list hiding in a paragraph into bullets",
          "Read it on your phone before you hit publish",
        ],
      },
      {
        type: "callout",
        eyebrow: "Stuck on the words?",
        title: "Get a free copy review",
        label: "Book my review",
        href: "/contact",
      },
      { type: "h2", text: "Good copy is good SEO" },
      {
        type: "p",
        text: "Search engines have become remarkably good at understanding natural language. Clear, specific, helpful copy that answers your customers’ real questions is exactly what they want to rank. Write for people first, use the words your customers actually search for, and the rankings tend to follow.",
      },
      {
        type: "p",
        text: "Most of all, be patient with yourself. Your first draft will sound stiff — everybody’s does. Read it aloud, cut the bits that make you cringe and keep the bits that sound like you on your best day.",
      },
    ],
    comments: [
      {
        name: "Alice F.",
        when: "2 weeks ago",
        text: "Recording myself explaining the business was awkward but SO useful.",
        tone: "blush",
      },
      {
        name: "Ben C.",
        when: "3 weeks ago",
        text: "Flipping the “we” sentences is my new favourite editing trick.",
        tone: "lagoon",
      },
    ],
  },
];

export const blogMeta = {
  title: "Blog — Ideas Worth Popping | Pixel Popers",
  description:
    "The Pixel Popers journal: practical guides on branding, UI/UX, web development, motion, content and digital marketing — written by the people doing the work.",
};

export const blogHero = {
  lines: ["Fresh from", "the studio", "Ideas worth popping"] as const,
};

export const journalIntro = {
  eyebrow: "The journal",
  heading: "A playbook, not a press release",
  paragraphs: [
    "The Pixel Popers journal is where our studio thinks out loud. Every article is written by the people doing the work — Adan, James and Barry — and draws on real projects, real launches and the occasional glorious mistake.",
    "We write for founders, marketing leads and small teams who want practical advice they can use on Monday morning. You’ll find guides on brand identity and packaging, UI/UX and web design, digital marketing and SEO, motion graphics and the craft of writing copy that sounds human. No fluff, no recycled listicles and no jargon without an explanation.",
    "New articles land every couple of weeks, alongside free templates, checklists and behind-the-scenes breakdowns of how we approach a brief. Planning a rebrand, a new website or your next campaign? Start with the four guides below, or use the topic filters above to jump straight to what you need.",
  ],
};

export const startHere = {
  eyebrow: "Start here",
  heading: "Four reads for new founders",
  guides: [
    {
      slug: "bold-brands-win-the-scroll",
      tone: "blush" as Tone,
      desc: "The case for a brand people recognise in half a second.",
    },
    {
      slug: "digital-marketing-grow-your-business",
      tone: "lagoon" as Tone,
      desc: "A no-jargon plan for getting found, chosen and remembered.",
    },
    {
      slug: "professional-website-for-every-business",
      tone: "sunbeam" as Tone,
      desc: "What a modern site must do before you spend a penny on ads.",
    },
    {
      slug: "web-copy-that-sounds-like-you",
      tone: "grape" as Tone,
      desc: "Turn a bland homepage into words customers actually read.",
    },
  ],
};

/** "Popular this month" — Figma order. */
export const popularSlugs = [
  "bold-brands-win-the-scroll",
  "digital-marketing-grow-your-business",
  "interfaces-people-enjoy",
  "professional-website-for-every-business",
  "motion-that-means-something",
];

export const topics: {
  category: Category;
  label: string;
  letter: string;
  tone: Tone;
}[] = [
  { category: "Branding", label: "Branding", letter: "B", tone: "blush" },
  { category: "UI/UX", label: "UI/UX", letter: "U", tone: "grape" },
  { category: "Marketing", label: "Marketing", letter: "M", tone: "lagoon" },
  { category: "Motion", label: "Motion", letter: "M", tone: "sunbeam" },
  { category: "Development", label: "Dev", letter: "D", tone: "grape" },
  { category: "Content", label: "Content", letter: "C", tone: "blush" },
];

export const resources = [
  {
    kind: "PDF",
    title: "Brand launch checklist",
    desc: "42 things to tick off before launch day.",
    tone: "blush" as Tone,
  },
  {
    kind: "DOC",
    title: "Website brief template",
    desc: "The brief we wish every client sent us.",
    tone: "lagoon" as Tone,
  },
  {
    kind: "SHEET",
    title: "Social content calendar",
    desc: "A 90-day plan you can fill in tonight.",
    tone: "sunbeam" as Tone,
  },
];

export const trendingTags: { tag: string; tone: Tone | "white" }[] = [
  { tag: "branding", tone: "white" },
  { tag: "webdesign", tone: "blush" },
  { tag: "seo", tone: "lagoon" },
  { tag: "socialmedia", tone: "sunbeam" },
  { tag: "ux", tone: "grape" },
  { tag: "packaging", tone: "white" },
  { tag: "motion", tone: "blush" },
  { tag: "growth", tone: "lagoon" },
  { tag: "startups", tone: "sunbeam" },
  { tag: "ecommerce", tone: "grape" },
  { tag: "copywriting", tone: "white" },
  { tag: "nextjs", tone: "blush" },
];

export const newsletter = {
  title: "Stay poppin’",
  body: "One email a month with fresh ideas on branding, design and growth. No spam — pinky promise.",
};

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** Up to `n` other posts: same category first, then newest. */
export function relatedPosts(post: Post, n = 3) {
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, n);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[’'“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(iso: string, style: "long" | "short" = "short") {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function wordCount(post: Post) {
  const text = post.body
    .map((b) => {
      switch (b.type) {
        case "p":
        case "h2":
        case "quote":
          return b.text;
        case "list":
        case "steps":
          return b.items.join(" ");
        case "stats":
          return b.items.map((s) => `${s.value} ${s.label}`).join(" ");
        case "image":
          return b.caption ?? "";
        case "callout":
          return `${b.eyebrow} ${b.title}`;
      }
    })
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
