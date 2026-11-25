import { overlayCopy } from "@/components/inner/service/page-copy";
import type { ServiceDetail } from "@/lib/service-content";

/*
  Every word on the UI/UX Design page's design sections, editable in the CMS
  (Services → UI/UX Design → Page sections; the admin form is built from
  these keys in backend/app/Filament/Support/UiUxSections.php). Empty fields
  there keep the wording here. The artboards' notes come from the Process
  list; screenshots from the Images tab.
*/

export const UX_COPY = {
  hero: {
    tag: "H1 / Display  ·  870 × 180",
    pin: "A",
    commentName: "Adan",
    comment: "Love it — can the CTA pop even more? 🔥",
    cursors: [{ name: "James" }, { name: "Barry" }],
    phoneAlt: "E-commerce app screen designed by Pixel Popers on a phone",
    selection: "Card / Promo  ·  348 × 190",
    size: "390 × 844",
    layersTitle: "Layers",
    layers: [
      { label: "Home — 390" },
      { label: "Nav" },
      { label: "Hero" },
      { label: "Card / Promo" },
      { label: "Button / Pop" },
      { label: "Headline" },
      { label: "Product grid" },
      { label: "Tab bar" },
    ],
    sticker: "MULTIPLAYER MODE",
  },
  sketch: {
    eyebrow: "From sketch to screen",
    heading: "Wireframe → hi-fi",
    text: "",
    sticker: "UX MAGIC ✦",
    lowFi: "LOW-FI",
    hiFi: "HI-FI",
    hiFiAlt: "Hi-fi mobile landing page for a liquidity product, with a clear headline and call to action",
    notes: [{ label: "Content first" }, { label: "Hierarchy fixed" }, { label: "CTA above the fold" }, { label: "Thumb-friendly nav" }],
  },
  system: {
    eyebrow: "Design systems",
    heading: "Components your devs will love",
    text: "",
    library: "Component library",
    cells: [
      { label: "Button / Primary · Secondary · Ghost" },
      { label: "Input / Default · Focused" },
      { label: "Toggle · Checkbox · Radio" },
      { label: "Tags / Chips" },
      { label: "Avatar group" },
      { label: "Slider · Progress" },
      { label: "Tooltip" },
      { label: "Card / Product" },
      { label: "Tokens" },
    ],
    buttons: { primary: "Get started", secondary: "Learn more", ghost: "Skip →", disabled: "Disabled" },
    input: { label: "Email", placeholder: "you@brand.com", value: "barry@pixelpopers.com" },
    toggles: { checkbox: "Remember me", radio: "Monthly" },
    tags: [{ label: "New" }, { label: "Popular" }, { label: "Sale" }, { label: "Beta" }],
    avatarsMore: "+12",
    progress: "75%",
    tooltip: "Saved to favourites ✓",
    product: { name: "Fifth Sip Beans", meta: "Medium roast · 250g", price: "$18", button: "Add to bag", alt: "Fifth Sip coffee beans product shot" },
    tokens: [{ name: "pink" }, { name: "grape" }, { name: "fizz" }, { name: "sunny" }, { name: "ink" }],
    radius: "radius 8 · 16 · 28 · full",
  },
  flow: {
    eyebrow: "User flows",
    heading: "Journeys that feel obvious",
    text: "",
    caption: "Flow 01 — first-time user",
    question: "Has an\naccount?",
    yes: "YES",
    no: "NO",
    nodes: [
      { title: "Landing", sub: "Home page" },
      { title: "Log in", sub: "1 field + magic link" },
      { title: "Sign up", sub: "Email or Google" },
      { title: "Onboarding", sub: "3 quick questions" },
      { title: "Dashboard", sub: "Personalised home" },
      { title: "Aha! ✦", sub: "First win" },
    ],
    goalNote: "avg. 3 taps to first win",
    legendScreen: "Screen",
    legendDecision: "Decision",
    legendGoal: "Goal",
    footnote: "Mapped in FigJam · tested with 5 users",
  },
  devices: {
    eyebrow: "Responsive by default",
    heading: "One product. Every screen.",
    text: "",
    laptopAlt: "Liquidity dashboard designed by Pixel Popers on a laptop",
    tabletAlt: "E-commerce dashboard designed by Pixel Popers on a tablet",
    phoneAlt: "Liquidity app screen designed by Pixel Popers on a phone",
    labels: [{ label: "Tablet · 768" }, { label: "Desktop · 1440" }, { label: "Mobile · 390" }],
    notes: [{ label: "Fluid type scale ✓" }, { label: "Breakpoints: 390 · 768 · 1440" }, { label: "Thumb-zone nav ✓" }],
    summary: "Every design is delivered for mobile (390px), tablet (768px) and desktop (1440px) breakpoints with a fluid type scale and thumb-friendly navigation.",
  },
  tested: {
    eyebrow: "Tested with",
    heading: "Real humans",
    text: "Before anything ships we watch real people use it — tracking where they click, scroll and get stuck — then fix it.",
    checks: [{ label: "Click & scroll heatmaps" }, { label: "5-second tests" }, { label: "Task completion rates" }, { label: "A/B variants" }],
    browser: "liquidity.app — heatmap",
    heatmapAlt: "Heatmap over a landing page: clicks cluster on the headline and the call-to-action button",
    stat: "73% clicked the CTA",
    statNote: "after redesign (was 31%)",
  },
  artboards: {
    eyebrow: "How we do it",
    heading: "Four artboards to launch",
    text: "",
    hintHover: "Hover",
    hintTap: "Tap",
    hint: "an artboard to read the dev notes",
    artboardWord: "Artboard",
    showNotes: "show dev notes",
    size: "380 × 440",
    noteWord: "Note",
    boards: [
      { name: "Research", tag: "→ insights" },
      { name: "Wireframe", tag: "→ flows" },
      { name: "Design", tag: "→ prototype" },
      { name: "Test", tag: "→ handoff" },
    ],
    stickyNotes: [{ note: "Users hate\nlong forms" }, { note: "Price is\nunclear" }, { note: "Love the\ncolours!" }, { note: "Where is\nsupport?" }],
    designTitle: "Shop the drop",
    designButton: "Buy now",
    designAlt: "Hi-fi e-commerce screens designed in Figma",
    tasks: [{ task: "Find a product" }, { task: "Add to bag" }, { task: "Checkout" }, { task: "Track order" }],
    taskResult: "3 / 4 tasks passed",
  },
};

export type UxCopy = typeof UX_COPY;

export function uxCopy(service: ServiceDetail): UxCopy {
  return overlayCopy(UX_COPY, service.copy ?? {});
}
