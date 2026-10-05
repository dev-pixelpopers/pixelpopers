/**
 * Copy and data for the Work listing (Figma frame 333:21 "04 — Work") and the
 * case-study template (Figma frame 334:21 "05 — Case Study (Fifth Sip)").
 * Fifth Sip carries the exact Figma copy; the other projects follow the same
 * shape with equivalent, plausible content.
 */

export type Accent = "blush" | "grape" | "lagoon" | "sunbeam" | "lav";
export type Category = "branding" | "ui-ux" | "web" | "motion" | "marketing";

export type Img = { src: string; w: number; h: number; alt: string; position?: string };

export type Project = {
  slug: string;
  name: string;
  client: string;
  year: number;
  /** Month for sorting within a year (1–12). */
  month: number;
  /** Small "Brand Identity · Packaging" line under the card title. */
  tagline: string;
  /** Service tags shown in the case-study meta row. */
  services: string[];
  categories: Category[];
  /** Big pink kicker above the case-study title. */
  discipline: string;
  accent: Accent;
  cover: Img;
  /** Solid colour behind the cover while it loads / behind transparent art. */
  coverBg: string;
  description: string;
  featured?: boolean;
  timeline: string;
  sticker: string;
  intro: { challenge: string; approach: string };
  brand: {
    detail: Img;
    swatches: { name: string; hex: string; dark?: boolean }[];
    type: { display: string; body: string };
  };
  results: { value: string; label: string }[];
  quote: { text: string; author: string; since: string };
  story: {
    lead: string;
    challenge: string;
    approach: string;
    results: string;
    clientQuote: string;
  };
  gallery: [Img, Img, Img];
  galleryHeading: string;
  delivered: { intro: string; items: string[] };
  phases: { label: string; start: number; end: number; color: Accent }[];
  team: { name: string; role: string }[];
};

export const workMeta = {
  title: "Our Work | Brand, Web & Motion Case Studies — Pixel Popers",
  description:
    "Selected Pixel Popers projects: brand identities, websites, UI/UX, motion and marketing campaigns for cafés, fintech, beauty, real estate and more — with the results behind them.",
};

export const workHero = {
  lines: ["Selected", "Work that", "Pops off"] as const,
  count: 24,
};

export const filters: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "branding", label: "Branding" },
  { id: "ui-ux", label: "UI/UX" },
  { id: "web", label: "Web" },
  { id: "motion", label: "Motion" },
  { id: "marketing", label: "Marketing" },
];

const fifthSipImg = "/assets/inner/fifth-sip.webp";

export const projects: Project[] = [
  {
    slug: "snack-bar",
    name: "Snack Bar",
    client: "Snack Bar Co.",
    year: 2026,
    month: 6,
    tagline: "Branding · Web · Motion",
    services: ["Brand refresh", "Website", "Launch campaign"],
    categories: ["branding", "web", "motion"],
    discipline: "Brand refresh, web & launch",
    accent: "lagoon",
    cover: { src: "/assets/inner/work/snack-bar-cover.webp", w: 1680, h: 800, alt: "Snack Bar launch campaign: a 3D still life of colourful snacks, vases and flowers on floating screens" },
    coverBg: "#2e9a3e",
    description: "Bold flavour meets cutting-edge tech — brand refresh, website & launch campaign.",
    featured: true,
    timeline: "10 weeks",
    sticker: "Sold out launch week",
    intro: {
      challenge:
        "A much-loved snack brand had outgrown its homemade look. Fans adored the flavours, but the packaging, website and socials told three different stories — and none of them felt as bold as the product.",
      approach:
        "We turned “bold flavour meets cutting-edge tech” into a loud, candy-bright system: chunky type, 3D still lifes and a website that feels like a vending machine you can scroll.",
    },
    brand: {
      detail: { src: "/assets/inner/work/snack-bar-cover.webp", w: 1680, h: 800, alt: "Detail of the Snack Bar 3D campaign still life", position: "50% 50%" },
      swatches: [
        { name: "Crunch", hex: "#2E9A3E" },
        { name: "Chilli", hex: "#E5483B" },
        { name: "Cream", hex: "#F7EEDD", dark: true },
      ],
      type: { display: "Display — Chunky rounded grotesk", body: "Body — Neo grotesk, 3 weights" },
    },
    results: [
      { value: "+240%", label: "Online orders" },
      { value: "2.1M", label: "Campaign views" },
      { value: "4", label: "Days to sell out launch stock" },
    ],
    quote: {
      text: "They made our snacks look as good as they taste — the launch sold out before the weekend.",
      author: "Co-founder, Snack Bar",
      since: "Client since 2024",
    },
    story: {
      lead: "Ten weeks, one loud brand refresh and a launch that sold out in four days.",
      challenge:
        "Snack Bar started as a market stall and grew into a nationwide online shop almost by accident. Along the way it collected a patchwork of logos, three different greens and a website built on a free template that buckled every time a TikTok went viral. Customers loved the flavours, but first-time visitors struggled to understand what the brand stood for, and wholesale buyers kept asking for assets the team simply did not have. With a new range of plant-based snacks ready to launch, the founders needed a brand that could shout across a crowded shelf, a shop that could survive a traffic spike, and a campaign big enough to make the launch feel like an event rather than another product drop.",
      approach:
        "We ran a one-day sprint with the founders to agree the brand’s personality — cheeky, generous and a little bit futuristic — and distilled it into a single line: bold flavour meets cutting-edge tech. That line drove everything. We redrew the logo in a chunky rounded grotesk, built a candy-bright palette anchored by a confident green, and art-directed a series of 3D still lifes where snacks sit among vases, flowers and floating screens. The new website runs on a fast headless stack with a playful product picker, while motion designers turned the still lifes into short loops for paid social, out-of-home screens and the launch countdown.",
      results:
        "The refreshed brand launched with a two-week teaser campaign that reached more than two million views across social and digital out-of-home. Online orders rose by 240% in the first month, the new range sold out in four days, and the site handled launch-day traffic without a wobble. Retail buyers now receive a tidy asset pack and guidelines, which has already helped Snack Bar land two new stockists. The motion library keeps paying off too: the team reuses the loops for seasonal flavours, so every drop still feels like a launch.",
      clientQuote:
        "“We knew our snacks were good, but we didn’t know how to make people feel that before the first bite. Pixel Popers gave us a brand that’s as loud as our flavours and a website that finally keeps up with us. Launch week was the best week we’ve ever had.”",
    },
    gallery: [
      { src: "/assets/inner/work/snack-bar-cover.webp", w: 1680, h: 800, alt: "Snack Bar campaign screens floating in a curved row on green", position: "50% 50%" },
      { src: "/assets/inner/campaign-strip.webp", w: 1600, h: 891, alt: "Close-up of a Snack Bar still life with orange vases and flowers", position: "38% 60%" },
      { src: "/assets/inner/campaign-strip.webp", w: 1600, h: 891, alt: "Close-up of the Snack Bar campaign clock and snacks", position: "70% 55%" },
    ],
    galleryHeading: "Flavour you can see",
    delivered: {
      intro: "A full refresh from logo to launch loop — everything the team needs to keep the noise going.",
      items: ["Brand workshop", "Logo refresh", "Colour palette", "3D art direction", "Website design", "Headless build", "Motion loops", "Paid social", "Launch campaign", "Brand guidelines"],
    },
    phases: [
      { label: "Discovery", start: 0, end: 1.6, color: "blush" },
      { label: "Brand refresh", start: 1.4, end: 4.2, color: "grape" },
      { label: "Website", start: 3.6, end: 8.4, color: "lagoon" },
      { label: "Motion & 3D", start: 5, end: 9, color: "sunbeam" },
      { label: "Launch campaign", start: 8.6, end: 10, color: "lav" },
    ],
    team: [
      { name: "Barry Allen", role: "Creative Director" },
      { name: "James Allen", role: "Strategy Lead" },
      { name: "Adan J.", role: "Technical Lead" },
    ],
  },
  {
    slug: "fifth-sip",
    name: "Fifth Sip",
    client: "Fifth Sip Café",
    year: 2026,
    month: 4,
    tagline: "Brand Identity · Packaging",
    services: ["Strategy", "Identity", "Packaging"],
    categories: ["branding"],
    discipline: "Brand identity & packaging",
    accent: "blush",
    cover: { src: fifthSipImg, w: 857, h: 1200, alt: "Fifth Sip brand kit: forest-green cups, takeaway bag, orange coffee bag and menus on an ember tray" },
    coverBg: "#e8f1f5",
    description:
      "A specialty café brand built around the moment coffee becomes a ritual — wordmark, packaging and a social kit now on shelves in 40+ stores.",
    timeline: "6 weeks",
    sticker: "Live in 40+ stores",
    intro: {
      challenge:
        "A new specialty café needed to stand out on a crowded high street — and on even more crowded Instagram feeds. They had great coffee, but no story, no system and packaging that looked like everyone else’s.",
      approach:
        "We built the brand around the idea of “the fifth sip” — the moment coffee stops being a habit and becomes a ritual. A deep forest green, a burnt orange accent and a hand-drawn wordmark carry that story across cups, bags, menus and social.",
    },
    brand: {
      detail: { src: "/assets/inner/work/fifth-sip-detail.webp", w: 1000, h: 720, alt: "Fifth Sip orange decaf coffee bag beside the green takeaway bag and menu" },
      swatches: [
        { name: "Forest", hex: "#1F4A3A" },
        { name: "Ember", hex: "#E2672F" },
        { name: "Oat", hex: "#F3E9DA", dark: true },
      ],
      type: { display: "Display — Hand-drawn wordmark", body: "Body — Grotesk, 4 weights" },
    },
    results: [
      { value: "+180%", label: "Instagram engagement" },
      { value: "3.2×", label: "Retail bag sales" },
      { value: "40+", label: "Stores carrying the brand" },
    ],
    quote: {
      text: "They didn’t just design a logo — they gave our café a personality people want to take photos of.",
      author: "Founder, Fifth Sip Café",
      since: "Client since 2025",
    },
    story: {
      lead: "Six weeks, one café, one big idea — and a brand now carried by more than forty stores. Here is how it came together, step by step.",
      challenge:
        "Fifth Sip arrived on a high street that already had four coffee shops within two hundred metres, two of them national chains with deep pockets and instantly recognisable cups. The founders had sourced exceptional single-origin beans, trained their baristas properly and designed a calm, beautiful space — but none of that was visible from the pavement or the phone screen. Their temporary branding was a stock serif logo on a brown kraft cup, and it looked exactly like everyone else’s. Footfall was steady but forgettable, social posts rarely reached beyond friends and family, and a planned range of retail coffee bags had no packaging at all. With a wholesale conversation already under way with a regional grocer, they needed a brand that could work at café scale and on a supermarket shelf — and they needed it in six weeks, not six months.",
      approach:
        "We started with two days of discovery: interviews with the founders, a morning behind the counter and a walk along the street photographing every competitor’s cup, sign and bag. One line from a regular stuck with us — the first sip wakes you up, but by the fifth you’re actually enjoying it. That became the brand idea: the fifth sip is the moment coffee stops being a habit and becomes a ritual. From there we built a deep forest green to signal calm and quality, a burnt ember orange for warmth and appetite, and a soft oat neutral that lets product photography breathe. The hand-drawn wordmark gives the brand a human signature, while a sturdy grotesk keeps menus and labels easy to read. We designed the cup first, because it travels further than any advert, then rolled the system out across retail bags, menu boards, takeaway packaging and a library of social templates the team can update without a designer.",
      results:
        "Fifth Sip launched its new identity on a Saturday morning with a queue around the corner. In the first three months Instagram engagement rose by 180%, driven largely by customers photographing their cups and tagging the café. Retail bag sales grew 3.2 times compared with the old plain packaging, and the regional grocer signed a listing that has since grown to more than forty stores. Just as importantly, the team now has guidelines, templates and print-ready files that let them launch seasonal blends in days instead of weeks. The brand has room to grow, too: a second site is planned for next year, and the same system already covers signage, merchandise and a loyalty card without needing a redesign.",
      clientQuote:
        "“We came to Pixel Popers with good coffee and no idea how to tell people about it. Six weeks later we had a brand our customers actually talk about. The cups do half of our marketing for us, the bags look at home next to brands ten times our size, and every new blend is now a fun launch rather than a stressful scramble. Working with the team felt like having three extra founders in the room.”",
    },
    gallery: [
      { src: "/assets/inner/work/fifth-sip-bag.webp", w: 1000, h: 660, alt: "Fifth Sip forest-green takeaway bag with the hand-drawn wordmark" },
      { src: "/assets/inner/work/fifth-sip-pack.webp", w: 650, h: 315, alt: "Top of the orange Fifth Sip decaf coffee bag" },
      { src: "/assets/inner/work/fifth-sip-menu.webp", w: 650, h: 315, alt: "Fifth Sip green menu cards on a white plinth" },
    ],
    galleryHeading: "Every touchpoint, on brand",
    delivered: {
      intro: "From the first workshop to the last sticker on the cup sleeve — the full brand kit, ready for launch day.",
      items: ["Brand strategy", "Wordmark & monogram", "Colour palette", "Typography", "Cup & sleeve design", "Coffee bag packaging", "Menu boards", "Takeaway bags", "Social templates", "Brand guidelines"],
    },
    phases: [
      { label: "Discovery", start: 0.05, end: 0.95, color: "blush" },
      { label: "Strategy", start: 1.05, end: 1.95, color: "lagoon" },
      { label: "Identity design", start: 1.55, end: 3.95, color: "grape" },
      { label: "Packaging & collateral", start: 3.05, end: 4.95, color: "sunbeam" },
      { label: "Guidelines & handoff", start: 5.05, end: 5.95, color: "lav" },
    ],
    team: [
      { name: "Barry Allen", role: "Creative Director" },
      { name: "James Allen", role: "Strategy Lead" },
      { name: "Adan J.", role: "Technical Lead" },
    ],
  },
  {
    slug: "tien-coffee",
    name: "Tiên Coffee",
    client: "Tiệm Tiên Coffee",
    year: 2026,
    month: 3,
    tagline: "Branding · Social",
    services: ["Identity", "Packaging", "Social"],
    categories: ["branding", "marketing"],
    discipline: "Branding & social",
    accent: "lagoon",
    cover: { src: "/assets/inner/tien-coffee.webp", w: 736, h: 736, alt: "Tiên Coffee brand grid: green matcha cans, a printed apron, a QR menu and the stacked wordmark" },
    coverBg: "#3fb7c7",
    description:
      "A Vietnamese coffee brand with street-food swagger — a playful identity, cans and a social feed that sells out every new drop.",
    timeline: "5 weeks",
    sticker: "Every drop sold out",
    intro: {
      challenge:
        "A Saigon-style coffee bar wanted to bring street-food energy to a city-centre crowd. The drinks were incredible, but the brand was a hand-me-down logo and a feed full of blurry phone photos.",
      approach:
        "We leaned into the noise of a street stall: a stacked, chunky wordmark, a bottle-green palette and a grid-based social system built for bold product shots, cans and staff merch.",
    },
    brand: {
      detail: { src: "/assets/inner/tien-coffee.webp", w: 736, h: 736, alt: "Tiên Coffee matcha cans held up against a green tiled wall", position: "60% 30%" },
      swatches: [
        { name: "Bottle", hex: "#1D5A3C" },
        { name: "Matcha", hex: "#9BC86B", dark: true },
        { name: "Rice", hex: "#F4F1E8", dark: true },
      ],
      type: { display: "Display — Stacked block wordmark", body: "Body — Geometric sans, 3 weights" },
    },
    results: [
      { value: "+310%", label: "Instagram followers" },
      { value: "12", label: "Sold-out drink drops" },
      { value: "2×", label: "Weekend footfall" },
    ],
    quote: {
      text: "Every new drink drop sells out now. Our feed finally looks as good as our coffee tastes.",
      author: "Owner, Tiên Coffee",
      since: "Client since 2025",
    },
    story: {
      lead: "A street-stall attitude, a can you want to keep and a feed that sells out every drop.",
      challenge:
        "Tiên Coffee serves proper Vietnamese coffee — slow-dripped phin brews, salted egg cream and an iced matcha that regulars queue for. But the brand had been pieced together from a borrowed logo, mismatched cups and a social feed of phone snaps taken at closing time. New customers walking past saw just another café, and the owners were about to launch canned drinks for delivery apps without any packaging design at all. They wanted to keep the warmth and chaos of a street stall while looking sharp enough for a busy city centre and a shelf full of competitors.",
      approach:
        "We spent an afternoon on the stools out front, watching how people ordered, photographed and shared their drinks. The brand grew from that energy: a stacked, chunky wordmark that reads like a hand-painted shop sign, a bottle-green and matcha palette, and a modular grid that turns every post into a little poster. We designed the cans so they look great in a hand and on a delivery-app thumbnail, created staff aprons and tees that customers kept asking to buy, and built a set of social templates for drink drops, menu changes and events that the team can fill in minutes.",
      results:
        "Within three months Tiên’s Instagram following had more than tripled, and twelve limited drink drops in a row have sold out — usually before lunchtime. Weekend footfall doubled, delivery orders now carry the brand into homes and offices across the city, and the merchandise line has become a small revenue stream of its own. Most importantly, the team runs the feed themselves: the templates make it quick to post, and every post looks unmistakably Tiên.",
      clientQuote:
        "“We used to dread posting anything. Now the team fights over who gets to announce the next drop. People recognise our cans across the street, and customers actually ask to buy the aprons.”",
    },
    gallery: [
      { src: "/assets/inner/tien-coffee.webp", w: 736, h: 736, alt: "Tiên Coffee brand grid with cans, apron and wordmark", position: "50% 50%" },
      { src: "/assets/inner/tien-coffee.webp", w: 736, h: 736, alt: "Two hands toasting with green Tiên matcha cans", position: "70% 20%" },
      { src: "/assets/inner/tien-coffee.webp", w: 736, h: 736, alt: "Tiên Coffee stacked wordmark and QR code menu", position: "80% 85%" },
    ],
    galleryHeading: "Street-stall swagger",
    delivered: {
      intro: "A brand that works on a shop sign, a can and a phone screen — plus the templates to keep it fresh.",
      items: ["Brand strategy", "Stacked wordmark", "Colour palette", "Can packaging", "Cup design", "Staff merch", "Social templates", "Photo art direction", "Menu design"],
    },
    phases: [
      { label: "Discovery", start: 0, end: 0.9, color: "blush" },
      { label: "Identity design", start: 0.8, end: 2.6, color: "grape" },
      { label: "Packaging & merch", start: 2.2, end: 4, color: "sunbeam" },
      { label: "Social system", start: 3, end: 4.6, color: "lagoon" },
      { label: "Launch & handoff", start: 4.4, end: 5, color: "lav" },
    ],
    team: [
      { name: "Barry Allen", role: "Creative Director" },
      { name: "James Allen", role: "Social Strategy" },
    ],
  },
  {
    slug: "radiance",
    name: "Radiance",
    client: "Radiance Beauty",
    year: 2026,
    month: 2,
    tagline: "Beauty Campaign · Motion",
    services: ["Campaign", "Motion", "Art direction"],
    categories: ["motion", "marketing"],
    discipline: "Beauty campaign & motion",
    accent: "sunbeam",
    cover: { src: "/assets/inner/radiance.webp", w: 1024, h: 1174, alt: "Radiance campaign: a softly lit portrait beside the line “Radiance that feels alive”", position: "50% 40%" },
    coverBg: "#f5c255",
    description:
      "A skincare launch that turned slow, tactile beauty into scroll-stopping motion — reels, product films and out-of-home that glow.",
    timeline: "7 weeks",
    sticker: "4.1M reel views",
    intro: {
      challenge:
        "A premium skincare brand was launching a new serum into a market drowning in identical before-and-after ads. They needed something calmer, richer and impossible to scroll past.",
      approach:
        "We slowed everything down: warm, low-key lighting, serif typography that breathes and motion that lingers on texture — the glow of skin, the drip of a serum, the curl of steam.",
    },
    brand: {
      detail: { src: "/assets/inner/radiance.webp", w: 1024, h: 1174, alt: "Close-up of the Radiance campaign portrait", position: "70% 40%" },
      swatches: [
        { name: "Night", hex: "#1A120D" },
        { name: "Amber", hex: "#C98A4B" },
        { name: "Glow", hex: "#F6E7D6", dark: true },
      ],
      type: { display: "Display — High-contrast serif", body: "Body — Humanist sans, light" },
    },
    results: [
      { value: "4.1M", label: "Reel views" },
      { value: "+64%", label: "Launch-month sales" },
      { value: "2.7×", label: "Return on ad spend" },
    ],
    quote: {
      text: "The reels they made for our launch outperformed everything we’d posted before.",
      author: "Brand Manager, Radiance Beauty",
      since: "Client since 2025",
    },
    story: {
      lead: "Slow beauty, fast results: a launch campaign built on texture, light and patience.",
      challenge:
        "Radiance had spent two years perfecting a vitamin-rich serum, but its launch was landing in the noisiest corner of social media. Competitors shouted with split-screen before-and-afters, discount codes and influencer unboxings. Radiance’s founders wanted the opposite feeling — calm, tactile and premium — without sacrificing reach. The brand also had almost no motion assets: a handful of product stills and a website hero that had never been animated. With a fixed launch date, a modest media budget and retail partners waiting for out-of-home creative, every asset had to work hard across reels, stories, product pages and digital billboards.",
      approach:
        "We built the campaign around one line, “Radiance that feels alive”, and a single visual rule: let things breathe. Our art director cast and lit a portrait series with warm, low-key light, while our motion team shot macro product films of serum drops, skin texture and steam. A high-contrast serif and generous spacing gave every frame an editorial feel. We cut each film into a family of formats — six-second bumpers, fifteen-second reels, longer product stories and slow-moving billboards — and wrote captions that explain ingredients plainly instead of promising miracles.",
      results:
        "The launch reels passed four million views in six weeks and outperformed every piece of content Radiance had published before. Launch-month sales were 64% higher than forecast, paid social returned 2.7 times its spend, and two retail partners extended the out-of-home run. The motion library has become the brand’s visual backbone: product pages now feature short loops, and new launches reuse the lighting and type system so the whole range feels like one family.",
      clientQuote:
        "“They understood that our product is about feeling, not shouting. The films are beautiful, but they also sell — which is exactly what we needed from a launch.”",
    },
    gallery: [
      { src: "/assets/inner/radiance.webp", w: 1024, h: 1174, alt: "Radiance portrait with warm side lighting", position: "60% 35%" },
      { src: "/assets/inner/radiance.webp", w: 1024, h: 1174, alt: "Radiance campaign headline in a high-contrast serif", position: "10% 45%" },
      { src: "/assets/inner/radiance.webp", w: 1024, h: 1174, alt: "Radiance supporting copy about smoother texture and firmer appearance", position: "10% 80%" },
    ],
    galleryHeading: "A glow you can feel",
    delivered: {
      intro: "A launch kit of films, stills and copy, cut for every screen the serum needed to shine on.",
      items: ["Campaign idea", "Art direction", "Portrait shoot", "Macro product films", "Reels & stories", "Digital out-of-home", "Product page loops", "Ad copywriting"],
    },
    phases: [
      { label: "Campaign idea", start: 0, end: 1.2, color: "blush" },
      { label: "Pre-production", start: 1, end: 2.4, color: "lagoon" },
      { label: "Shoot & edit", start: 2.2, end: 5, color: "grape" },
      { label: "Formats & copy", start: 4.4, end: 6.2, color: "sunbeam" },
      { label: "Launch", start: 6.2, end: 7, color: "lav" },
    ],
    team: [
      { name: "Barry Allen", role: "Creative Director" },
      { name: "James Allen", role: "Campaign Strategy" },
    ],
  },
  {
    slug: "liquidity",
    name: "Liquidity",
    client: "Voltage Labs",
    year: 2025,
    month: 10,
    tagline: "Fintech · UI/UX · Web",
    services: ["UX research", "Product UI", "Website"],
    categories: ["ui-ux", "web"],
    discipline: "Fintech UI/UX & web",
    accent: "grape",
    cover: { src: "/assets/inner/liquidity.webp", w: 736, h: 552, alt: "Liquidity website hero: “Instant liquidity with on-demand channels for any node” above a glowing network diagram" },
    coverBg: "#6a4b97",
    description:
      "A fintech dashboard and marketing site that makes on-demand liquidity feel simple — demo requests doubled in the first month.",
    timeline: "8 weeks",
    sticker: "Demo requests ×2",
    intro: {
      challenge:
        "A Lightning Network infrastructure start-up had a powerful product and a website only engineers could understand. Prospects bounced before they ever reached the demo form.",
      approach:
        "We rewrote the story in plain English, mapped the buyer’s questions into a calm, step-by-step site and redesigned the dashboard so node operators can open a channel in three clicks.",
    },
    brand: {
      detail: { src: "/assets/inner/liquidity.webp", w: 736, h: 552, alt: "The Liquidity network diagram with glowing nodes", position: "50% 85%" },
      swatches: [
        { name: "Volt", hex: "#F26B1D" },
        { name: "Signal", hex: "#2EC4D6" },
        { name: "Paper", hex: "#F7F8FA", dark: true },
      ],
      type: { display: "Display — Neo grotesk, semi-bold", body: "Body — Inter-style UI sans" },
    },
    results: [
      { value: "2×", label: "Demo requests" },
      { value: "−38%", label: "Bounce rate" },
      { value: "3", label: "Clicks to open a channel" },
    ],
    quote: {
      text: "Fast, funny and frighteningly good. Our new site doubled demo requests in the first month.",
      author: "Head of Marketing, Liquidity",
      since: "Client since 2025",
    },
    story: {
      lead: "Making complex infrastructure feel simple — on the website and inside the product.",
      challenge:
        "Liquidity provides on-demand payment channels for businesses running Lightning Network nodes. The technology is genuinely clever, but the old website opened with protocol diagrams and acronyms, and the dashboard assumed users already knew how channel balancing works. Sales calls kept starting with the same basic questions, the bounce rate on paid traffic sat above seventy per cent, and the product team had a backlog of support tickets from operators who got lost opening their first channel. The company was preparing for a funding round and needed a site that investors, finance teams and engineers could all understand.",
      approach:
        "We interviewed customers, sales staff and two prospects who had walked away, then mapped the questions each audience asked in the order they asked them. The new website answers those questions one by one: a plain-English promise, a visual explainer of how liquidity flows, proof from existing customers and clear pricing. In the product we simplified navigation, introduced a guided channel-opening flow and designed a health view that turns raw numbers into clear colours and suggestions. A light design system with documented components keeps the marketing site and the dashboard visually aligned.",
      results:
        "Demo requests doubled in the first month after launch, and the bounce rate on paid landing pages fell by 38%. Inside the product, new operators can open a channel in three clicks, and onboarding-related support tickets dropped sharply. The sales team now sends the explainer page ahead of calls, so conversations start with use cases rather than definitions — and the funding deck borrowed its diagrams straight from the new site.",
      clientQuote:
        "“Fast, funny and frighteningly good. Pixel Popers turned our jargon into a story people actually want to read, and the dashboard redesign cut our onboarding questions overnight.”",
    },
    gallery: [
      { src: "/assets/inner/liquidity.webp", w: 736, h: 552, alt: "Full Liquidity homepage hero", position: "50% 50%" },
      { src: "/assets/inner/webdev.webp", w: 1120, h: 1400, alt: "Code editor and responsive layouts on a desktop, tablet and phone", position: "50% 40%" },
      { src: "/assets/inner/collab.webp", w: 735, h: 589, alt: "Two people reviewing a product page on a laptop", position: "50% 50%" },
    ],
    galleryHeading: "Clarity at every click",
    delivered: {
      intro: "A website and product refresh designed and built as one system, with a library the team keeps using.",
      items: ["Customer interviews", "Messaging & copy", "Information architecture", "Website design", "Website build", "Dashboard UX", "Onboarding flow", "Design system", "Explainer illustrations"],
    },
    phases: [
      { label: "Research", start: 0, end: 1.4, color: "blush" },
      { label: "Messaging & IA", start: 1, end: 2.8, color: "lagoon" },
      { label: "UI design", start: 2.4, end: 5.6, color: "grape" },
      { label: "Build", start: 4.4, end: 7.4, color: "sunbeam" },
      { label: "Launch & QA", start: 7.2, end: 8, color: "lav" },
    ],
    team: [
      { name: "Adan J.", role: "Technical Lead" },
      { name: "James Allen", role: "Strategy Lead" },
      { name: "Barry Allen", role: "Creative Director" },
    ],
  },
  {
    slug: "fortis-homes",
    name: "Fortis Homes",
    client: "Fortis Homes",
    year: 2025,
    month: 7,
    tagline: "Real Estate · Marketing",
    services: ["Campaign", "Print", "Paid social", "Landing page"],
    categories: ["marketing"],
    discipline: "Real estate launch campaign",
    accent: "blush",
    cover: { src: "/assets/inner/fortis-homes.webp", w: 736, h: 920, alt: "Fortis Homes poster: a bronze door handle and a residential tower with “One key to limitless living — 2 & 3 BHK”", position: "50% 30%" },
    coverBg: "#f27793",
    description:
      "A launch campaign for new 2 & 3 BHK residences — print, paid social and a landing page that filled the sales calendar in weeks.",
    timeline: "6 weeks",
    sticker: "70% pre-sold",
    intro: {
      challenge:
        "A developer was launching a new residential tower in a busy suburb where every hoarding promised “luxury living”. They needed qualified buyers, fast.",
      approach:
        "We built the campaign around one idea — a single key to everything you need — with a crisp editorial look, honest floor-plan details and a landing page that books site visits in two taps.",
    },
    brand: {
      detail: { src: "/assets/inner/fortis-homes.webp", w: 736, h: 920, alt: "Detail of the Fortis Homes bronze door handle", position: "30% 35%" },
      swatches: [
        { name: "Bronze", hex: "#B9844E" },
        { name: "Sky", hex: "#2F6FB3" },
        { name: "Linen", hex: "#FBF6EC", dark: true },
      ],
      type: { display: "Display — Light geometric sans", body: "Body — Grotesk, regular & bold" },
    },
    results: [
      { value: "1.9k", label: "Qualified leads" },
      { value: "70%", label: "Units pre-sold" },
      { value: "−45%", label: "Cost per lead" },
    ],
    quote: {
      text: "Our sales team has never been this busy. The site-visit calendar was full within three weeks.",
      author: "Sales Director, Fortis Homes",
      since: "Client since 2024",
    },
    story: {
      lead: "One key, one clear message and a sales calendar that filled up in weeks.",
      challenge:
        "Fortis Homes was launching a tower of 2 and 3 BHK apartments in a fast-growing suburb, competing with half a dozen projects that all used the same glossy renders and the same vague promises. Previous launches had relied on newspaper inserts and broker networks, producing plenty of calls but few serious buyers. The sales team wanted fewer, better leads; the marketing budget needed to stretch across print, outdoor and digital; and everything had to be ready for a pre-launch event just six weeks away.",
      approach:
        "We focused on what buyers actually ask: where is it, what does it cost, how big are the rooms and when can I visit? The creative idea — “one key to limitless living” — framed the address as the key to schools, transport and green space nearby. A calm editorial layout with a bronze accent set Fortis apart from busy competitor ads. We produced posters, hoardings and brochures, then built a fast landing page with honest floor plans, an EMI calculator and a two-tap site-visit booking form connected to the sales CRM. Paid social targeted young families within commuting distance, with creative tested weekly.",
      results:
        "The campaign generated more than 1,900 qualified leads in its first two months, at a cost per lead 45% lower than the developer’s previous launch. The site-visit calendar was full within three weeks, and seventy per cent of units were pre-sold before construction reached the halfway mark. The sales team now uses the landing page as its main presentation tool, and the campaign system has been adapted for Fortis’s next two projects.",
      clientQuote:
        "“For the first time, the people calling us had already read the floor plans and wanted to visit. That made all the difference for our sales team.”",
    },
    gallery: [
      { src: "/assets/inner/fortis-homes.webp", w: 736, h: 920, alt: "Full Fortis Homes launch poster", position: "50% 40%" },
      { src: "/assets/inner/fortis-homes.webp", w: 736, h: 920, alt: "Fortis Homes residential tower illustration", position: "20% 70%" },
      { src: "/assets/inner/marketing.webp", w: 1600, h: 1067, alt: "Social media reactions bursting from a laptop screen", position: "50% 50%" },
    ],
    galleryHeading: "From hoarding to handover",
    delivered: {
      intro: "A launch campaign that works on a hoarding, a phone and a sales desk.",
      items: ["Campaign idea", "Posters & hoardings", "Sales brochure", "Landing page", "EMI calculator", "CRM integration", "Paid social", "Creative testing"],
    },
    phases: [
      { label: "Discovery", start: 0, end: 0.9, color: "blush" },
      { label: "Campaign idea", start: 0.8, end: 2, color: "lagoon" },
      { label: "Print & outdoor", start: 1.8, end: 4, color: "grape" },
      { label: "Landing page", start: 2.6, end: 5, color: "sunbeam" },
      { label: "Paid social", start: 4.6, end: 6, color: "lav" },
    ],
    team: [
      { name: "James Allen", role: "Strategy Lead" },
      { name: "Adan J.", role: "Technical Lead" },
    ],
  },
  {
    slug: "elevate",
    name: "Elevate",
    client: "Elevate Studio",
    year: 2025,
    month: 4,
    tagline: "Agency Website · Dev",
    services: ["Web design", "Development", "CMS"],
    categories: ["web"],
    discipline: "Agency website & development",
    accent: "lagoon",
    cover: { src: "/assets/inner/elevate.webp", w: 1600, h: 951, alt: "Elevate website on a laptop and phone: “Drop your design” hero over a red-and-black plinth" },
    coverBg: "#3fb7c7",
    description:
      "An agency website with a drag-to-design hero, built on a fast headless stack and a CMS the team genuinely enjoys using.",
    timeline: "7 weeks",
    sticker: "98 Lighthouse",
    intro: {
      challenge:
        "A design studio’s own website was slow, hard to update and nothing like the playful work they made for clients. New case studies took a developer and a week to publish.",
      approach:
        "We designed a site that behaves like the studio thinks — a drag-to-design hero, bold editorial type — and built it on a headless stack with a CMS that lets anyone publish in minutes.",
    },
    brand: {
      detail: { src: "/assets/inner/elevate.webp", w: 1600, h: 951, alt: "Elevate “Drop your design” hero on a laptop", position: "45% 40%" },
      swatches: [
        { name: "Ink", hex: "#111111" },
        { name: "Signal red", hex: "#E0322B" },
        { name: "White", hex: "#FFFFFF", dark: true },
      ],
      type: { display: "Display — Condensed grotesk", body: "Body — Neutral sans, 2 weights" },
    },
    results: [
      { value: "98", label: "Lighthouse performance" },
      { value: "+72%", label: "Enquiries" },
      { value: "10", label: "Minutes to publish a case study" },
    ],
    quote: {
      text: "Our site finally feels like us — and anyone on the team can publish a new project before lunch.",
      author: "Managing Partner, Elevate",
      since: "Client since 2024",
    },
    story: {
      lead: "A studio website that is as fun to use as it is to update.",
      challenge:
        "Elevate makes bold, playful work for its clients, but its own website was a heavy template with slow pages, a rigid layout and a CMS nobody wanted to touch. Publishing a case study meant briefing a freelance developer and waiting a week, so the portfolio was months out of date. Prospective clients judged the studio by that site, and the team knew it was costing them pitches. They wanted something that felt alive, loaded instantly and could be updated by designers rather than developers.",
      approach:
        "We started with the content model, sitting with the team to understand how they describe projects, people and services. The design centres on a drag-to-design hero where visitors can move layout blocks around, paired with oversized editorial type and generous white space so the work does the talking. We built the site on a headless stack with static generation, optimised images and minimal JavaScript, then configured a block-based CMS with live previews. Every component was documented, so the team can assemble new pages without breaking the design.",
      results:
        "The new site scores 98 for Lighthouse performance on mobile and loads in under a second on a typical connection. Enquiries rose by 72% in the first quarter, and the studio now publishes a case study in about ten minutes — so the portfolio stays current. The drag-to-design hero has become a talking point in pitches, and two clients have asked for something similar on their own sites.",
      clientQuote:
        "“We finally have a website we are proud to send people to. It’s fast, it’s fun, and our designers update it themselves without asking a developer for help.”",
    },
    gallery: [
      { src: "/assets/inner/elevate.webp", w: 1600, h: 951, alt: "Elevate website on a laptop and phone", position: "50% 50%" },
      { src: "/assets/inner/laptop-blog.webp", w: 736, h: 841, alt: "A laptop showing a colourful portfolio grid", position: "50% 40%" },
      { src: "/assets/inner/webdev.webp", w: 1120, h: 1400, alt: "Responsive layouts on desktop, tablet and phone", position: "50% 55%" },
    ],
    galleryHeading: "Built to be played with",
    delivered: {
      intro: "A fast, playful website and a CMS the team genuinely enjoys using.",
      items: ["Content modelling", "UX & wireframes", "Visual design", "Interactive hero", "Headless build", "CMS set-up", "Performance tuning", "SEO foundations", "Team training"],
    },
    phases: [
      { label: "Discovery", start: 0, end: 1, color: "blush" },
      { label: "UX & content", start: 0.8, end: 2.4, color: "lagoon" },
      { label: "Visual design", start: 2, end: 4.2, color: "grape" },
      { label: "Development", start: 3.4, end: 6.4, color: "sunbeam" },
      { label: "CMS & launch", start: 6, end: 7, color: "lav" },
    ],
    team: [
      { name: "Adan J.", role: "Technical Lead" },
      { name: "Barry Allen", role: "Creative Director" },
    ],
  },
  {
    slug: "closet-club",
    name: "Closet Club",
    client: "Closet Club",
    year: 2025,
    month: 2,
    tagline: "E-commerce · UI/UX",
    services: ["UX audit", "Store design", "Shopify build"],
    categories: ["ui-ux", "web"],
    discipline: "E-commerce UI/UX",
    accent: "grape",
    cover: { src: "/assets/inner/ui-shop.webp", w: 1600, h: 900, alt: "Closet Club store screens: product grids, checkout and a “Declutter your closet” hero" },
    coverBg: "#6a4b97",
    description: "A pre-loved fashion marketplace redesigned around trust and speed — checkout completion up by almost half.",
    timeline: "9 weeks",
    sticker: "Checkout +46%",
    intro: {
      challenge: "A fast-growing resale marketplace was losing shoppers between basket and payment. Sellers found listing items fiddly, and buyers weren’t sure what condition “good” really meant.",
      approach: "We audited every step, then redesigned listing, browsing and checkout around clear condition grades, honest photos and a one-page checkout with saved sizes.",
    },
    brand: {
      detail: { src: "/assets/inner/ui-shop.webp", w: 1600, h: 900, alt: "Closet Club product listing cards", position: "40% 50%" },
      swatches: [
        { name: "Plum", hex: "#2B1438" },
        { name: "Coral", hex: "#FF6F61" },
        { name: "Chalk", hex: "#F6F3F7", dark: true },
      ],
      type: { display: "Display — Rounded geometric sans", body: "Body — UI sans, 3 weights" },
    },
    results: [
      { value: "+46%", label: "Checkout completion" },
      { value: "−60%", label: "Time to list an item" },
      { value: "4.8★", label: "App store rating" },
    ],
    quote: { text: "Sellers list faster, buyers trust what they see, and our checkout finally converts.", author: "Head of Product, Closet Club", since: "Client since 2024" },
    story: {
      lead: "A resale marketplace rebuilt around trust, speed and a checkout that gets out of the way.",
      challenge: "Closet Club lets people buy and sell pre-loved fashion, and its community had grown quickly through word of mouth. But growth exposed the cracks. Sellers needed eleven steps to list a single item, condition descriptions were free text and wildly inconsistent, and the four-page checkout lost almost half of the shoppers who reached it. Customer support spent most of its time on returns caused by mismatched expectations. The team wanted to grow without hiring a support army, and they needed the redesign to ship before the busy autumn season.",
      approach: "We ran a UX audit, analysed funnel data and watched twelve buyers and sellers use the store on their own phones. The redesign introduced five clear condition grades with photo guidance, a listing flow that pre-fills brand and size from a single photo, and a one-page checkout with saved sizes, wallets and delivery preferences. Product cards now show measurements and condition at a glance, and filters remember each shopper’s fit. We built the new front end on the client’s Shopify setup, tested every change with real users before release and documented the patterns in a small design system.",
      results: "Checkout completion rose by 46% in the first eight weeks, listing an item now takes 60% less time, and returns caused by condition disputes fell sharply. The mobile app’s rating climbed to 4.8 stars, and the support team has shifted from firefighting to community building. With a reusable design system in place, the product team now ships new features in days rather than sprints.",
      clientQuote: "“They found problems we had stopped noticing and fixed them without losing the friendly feel our community loves. The checkout numbers speak for themselves.”",
    },
    gallery: [
      { src: "/assets/inner/ui-shop.webp", w: 1600, h: 900, alt: "Closet Club desktop and mobile store screens", position: "50% 50%" },
      { src: "/assets/inner/ui-shop.webp", w: 1600, h: 900, alt: "Closet Club checkout and payment screens", position: "85% 70%" },
      { src: "/assets/inner/ui-shop.webp", w: 1600, h: 900, alt: "Closet Club product grid with condition badges", position: "15% 40%" },
    ],
    galleryHeading: "Shopping that feels effortless",
    delivered: {
      intro: "A faster, friendlier store for buyers and sellers, backed by a design system the team can grow.",
      items: ["UX audit", "User testing", "Listing flow", "Condition grades", "Product cards", "One-page checkout", "Design system", "Shopify build"],
    },
    phases: [
      { label: "Audit & research", start: 0, end: 1.6, color: "blush" },
      { label: "UX flows", start: 1.2, end: 3.4, color: "lagoon" },
      { label: "UI design", start: 2.8, end: 5.6, color: "grape" },
      { label: "Build & test", start: 4.6, end: 8.2, color: "sunbeam" },
      { label: "Release", start: 8.2, end: 9, color: "lav" },
    ],
    team: [
      { name: "Adan J.", role: "Technical Lead" },
      { name: "Barry Allen", role: "Design Lead" },
    ],
  },
  {
    slug: "pulse-motion-kit",
    name: "Pulse",
    client: "Pulse Editor",
    year: 2024,
    month: 11,
    tagline: "Product Motion · Launch",
    services: ["Motion system", "Product film", "UI animation"],
    categories: ["motion", "marketing"],
    discipline: "Product motion & launch film",
    accent: "lav",
    cover: { src: "/assets/inner/motion.webp", w: 1120, h: 980, alt: "Pulse video editor interface with keyframe curves and a timeline on a violet gradient" },
    coverBg: "#b79be0",
    description: "A motion language and launch film for a browser-based video editor — the trailer became its best-performing ad.",
    timeline: "6 weeks",
    sticker: "Trailer 1.2M views",
    intro: {
      challenge: "A browser-based video editor was launching version 2.0, but its marketing used static screenshots that made a fast, fluid tool look flat.",
      approach: "We defined a motion language — springy easing, keyframe curves as a visual motif — and used it across a launch film, product tour and in-app micro-interactions.",
    },
    brand: {
      detail: { src: "/assets/inner/motion.webp", w: 1120, h: 980, alt: "Pulse keyframe curve editor", position: "40% 40%" },
      swatches: [
        { name: "Violet", hex: "#7B6CF6" },
        { name: "Graphite", hex: "#1E1E24" },
        { name: "Pulse", hex: "#2EE6A6", dark: true },
      ],
      type: { display: "Display — Wide grotesk", body: "Body — Mono for UI labels" },
    },
    results: [
      { value: "1.2M", label: "Trailer views" },
      { value: "+58%", label: "Free-trial sign-ups" },
      { value: "40+", label: "Reusable animations" },
    ],
    quote: { text: "The trailer made people feel how fast Pulse is before they ever opened it.", author: "Founder, Pulse", since: "Client since 2024" },
    story: {
      lead: "Giving a fast, fluid product the motion language it deserved.",
      challenge: "Pulse lets creators edit video in the browser with surprisingly little lag, but its website and ads relied on static screenshots and a feature list. Prospects compared it to desktop editors on paper and assumed it would feel slow. The 2.0 release added real-time collaboration and a new keyframe editor — features that only make sense when you see them move. The team had six weeks until launch and no in-house motion designer.",
      approach: "We started by defining how Pulse should move: quick in, gentle out, with a little spring that echoes the keyframe curves at the heart of the product. That language shaped a ninety-second launch film, a set of short feature loops for social and the website, and a library of UI micro-interactions the product team implemented in the app. We storyboarded with the founders, captured real interface footage at high frame rates and composited it with bold typography so every claim was shown, not just said.",
      results: "The launch film passed 1.2 million views and became Pulse’s best-performing ad, while free-trial sign-ups rose by 58% in launch month. The product team now uses more than forty documented animations, so new features ship with motion that feels consistent from the first release. Sales demos open with the trailer, which saves several minutes of explanation on every call.",
      clientQuote: "“We’d been trying to describe how fast Pulse feels for a year. They showed it in ninety seconds.”",
    },
    gallery: [
      { src: "/assets/inner/motion.webp", w: 1120, h: 980, alt: "Pulse editor with floating tool panels", position: "50% 50%" },
      { src: "/assets/inner/motion.webp", w: 1120, h: 980, alt: "Pulse timeline with coloured clips", position: "70% 75%" },
      { src: "/assets/inner/motion.webp", w: 1120, h: 980, alt: "Pulse toolbar icons", position: "30% 15%" },
    ],
    galleryHeading: "Motion with a pulse",
    delivered: {
      intro: "A motion system, a launch film and the micro-interactions that make the product feel alive.",
      items: ["Motion principles", "Storyboards", "Launch film", "Feature loops", "Social cut-downs", "UI micro-interactions", "Lottie exports"],
    },
    phases: [
      { label: "Motion principles", start: 0, end: 1.2, color: "blush" },
      { label: "Storyboards", start: 1, end: 2.2, color: "lagoon" },
      { label: "Launch film", start: 2, end: 5, color: "grape" },
      { label: "Loops & UI motion", start: 3.6, end: 5.6, color: "sunbeam" },
      { label: "Handoff", start: 5.6, end: 6, color: "lav" },
    ],
    team: [
      { name: "Barry Allen", role: "Creative Director" },
      { name: "Adan J.", role: "Motion Engineering" },
    ],
  },
];

/** How many grid cards show before "Load more work" (the Figma grid holds six). */
export const PAGE_SIZE = 6;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Next project in listing order (wraps around). */
export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export const workIntro = {
  eyebrow: "What we make",
  heading: "Work that earns its place on the screen",
  paragraphs: [
    "Every project on this page started with a business problem, not a mood board. We are a remote-first digital agency that designs and builds brand identities, websites, product interfaces, motion and marketing campaigns for ambitious companies — from neighbourhood cafés finding their voice to fintech platforms explaining complex products in plain English.",
    "Our portfolio spans food and drink, beauty and wellness, fintech and SaaS, real estate, hospitality and creative services. The sectors change, but the approach stays the same: we dig into who the audience really is, what they need to believe and where the brand has to show up. Then we design a system that works everywhere it lands — on a coffee cup, a dashboard, a billboard or a fifteen-second reel.",
    "Most of our engagements combine several disciplines. A rebrand usually needs a new website; a product launch usually needs motion and paid social; a fresh interface usually needs copy that makes it click. Keeping strategy, design, development and content under one roof means fewer hand-offs, faster decisions and work that feels like it came from one confident voice.",
    "Use the filters above to browse by discipline, or open any case study to see the brief, the thinking behind it, the deliverables we shipped and the numbers that followed.",
  ],
  success: {
    eyebrow: "How we measure success",
    heading: "Pretty is not the finish line",
    cards: [
      { title: "Business results", body: "We agree the metrics before we design a pixel — enquiries, sales, sign-ups, demo requests or footfall — and report against them after launch, not just on launch day." },
      { title: "Audience response", body: "Engagement, saves, shares and time on page tell us whether people actually care. We test early versions with real users and keep refining whatever lands best." },
      { title: "Brands that last", body: "Great work should still be working a year later. We hand over guidelines, components and CMS set-ups your team can run with long after the files are delivered." },
    ],
  },
};

export const impact = {
  eyebrow: "Impact",
  heading: "The numbers behind the pop",
  stats: [
    { value: "94+", label: "Brands launched", tone: "text-white" },
    { value: "3.2×", label: "Avg. engagement lift", tone: "text-sunbeam" },
    { value: "50+", label: "Websites shipped", tone: "text-white" },
    { value: "200+", label: "Animations made", tone: "text-sunbeam" },
  ],
};

export const workTestimonials = {
  eyebrow: "Kind words",
  heading: "Clients who popped",
  items: [
    { quote: "They didn’t just design a logo — they gave our café a personality people want to photograph.", role: "Founder", company: "Fifth Sip Café", initial: "F", card: "bg-white text-ink", mark: "text-blush", avatar: "bg-blush text-white", tilt: "rotate-1", offset: "" },
    { quote: "Fast, funny and frighteningly good. Our new site doubled demo requests in the first month.", role: "Head of Marketing", company: "Liquidity", initial: "H", card: "bg-grape text-white", mark: "text-sunbeam", avatar: "bg-sunbeam text-ink", tilt: "-rotate-1", offset: "lg:mt-10" },
    { quote: "The reels they made for our launch outperformed everything we’d posted before.", role: "Brand Manager", company: "Radiance Beauty", initial: "B", card: "bg-white text-ink", mark: "text-lagoon", avatar: "bg-lagoon text-white", tilt: "rotate-1", offset: "" },
  ],
};

export const teasers = {
  eyebrow: "In the oven",
  heading: "Coming soon",
  items: [
    { tag: "E-commerce · Web", bg: "bg-blush", img: { src: "/assets/inner/laptop-blog.webp", w: 736, h: 841 } },
    { tag: "Branding · Motion", bg: "bg-lagoon", img: { src: "/assets/inner/cube.webp", w: 783, h: 851 } },
    { tag: "SaaS · UI/UX", bg: "bg-sunbeam", img: { src: "/assets/inner/website.webp", w: 1067, h: 1600 } },
  ],
};

export const marquees = {
  services: ["Branding", "UI/UX", "Web", "Motion", "Marketing", "Content"],
  next: "Your brand could be next",
};

export const workCta = {
  eyebrow: "Let’s build something",
  heading: ["Extraordinary", "together"],
  body: "Got a project that deserves to pop? Tell us about it — we reply within a day.",
  cta: { label: "Start a project", href: "/contact" },
};
