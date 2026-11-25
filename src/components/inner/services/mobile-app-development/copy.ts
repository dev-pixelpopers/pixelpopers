import { overlayCopy } from "@/components/inner/service/page-copy";
import type { ServiceDetail } from "@/lib/service-content";

/*
  Every word on the Mobile App Development page's design sections, editable
  in the CMS (Services → Mobile App Development → Page sections). The CMS
  stores the same shape in `service.copy`; any field left empty there keeps
  the wording here. The backend mirrors these defaults as the admin form's
  placeholders (backend/app/Filament/Support/MobileAppSections.php).

  The steps in "Five phases" come from the service's Process list; the long
  copy, packages and FAQs below the design sections are the shared blocks.
*/

export const MOBILE_COPY = {
  hero: {
    badge: "iOS · Android · Cross-platform",
    phone: {
      app: "Fifth Sip",
      greeting: "Morning, Sara ☕",
      item: "Oat flat white",
      price: "$4.20",
      button: "Order again",
      points: "★ 120 pts",
      tabs: [{ label: "Home" }, { label: "Menu" }, { label: "Rewards" }, { label: "Profile" }],
    },
    notifications: [
      { app: "Fifth Sip", title: "Your order is ready", body: "Pick it up at the counter 🎉" },
      { app: "App Store", title: "Fifth Sip 1.0 is live", body: "Approved and ready to download" },
    ],
    rating: { value: "4.9", label: "Store rating" },
    toast: "✓ Build 1.0.4 shipped",
  },
  included: {
    eyebrow: "What's included",
    heading: "Everything’s\nswitched on",
    text: "Every app we build comes with the full crew behind it. Tap a setting to see what it covers.",
    screen: "Settings",
    icons: [{ icon: "phone" }, { icon: "chip" }, { icon: "layers" }, { icon: "pen" }, { icon: "server" }, { icon: "rocket" }, { icon: "wrench" }, { icon: "store" }],
  },
  platforms: {
    eyebrow: "Every platform",
    heading: "One crew.\nEvery app store.",
    text: "",
    cards: [
      { name: "iOS", tag: "Swift · SwiftUI", body: "Native iPhone and iPad apps that feel at home next to Apple’s own, from widgets to Face ID." },
      { name: "Android", tag: "Kotlin · Compose", body: "Fast, battery-friendly Android apps tested on the budget phones your customers really use." },
      { name: "Cross-platform", tag: "Flutter · React Native", body: "One codebase for both stores when time and budget matter, with native code where it counts." },
      { name: "Backend & cloud", tag: "APIs · Firebase · AWS", body: "The servers, sign-in, payments and admin panel that keep your app running behind the scenes." },
    ],
  },
  benefits: {
    eyebrow: "Why go mobile",
    heading: "Right there on\ntheir home screen",
    text: "",
    items: [
      { app: "Home screen", title: "One tap away", body: "Your icon lives next to their messages, and a well-timed push brings them back." },
      { app: "Offline", title: "Works on the train", body: "Apps keep working on patchy signal and sync quietly when the connection returns." },
      { app: "Device", title: "Uses the whole phone", body: "Camera, GPS, biometrics, Bluetooth and wallet payments turn ideas into features." },
      { app: "Insights", title: "Learns from every tap", body: "Event-level analytics show what people actually do, so every update is smarter." },
    ],
  },
  process: {
    eyebrow: "From idea to app store",
    heading: "Five phases.\nOne launch.",
    text: "",
    versions: [
      { version: "Version 0.1", when: "Week 1" },
      { version: "Version 0.3", when: "Weeks 1–3" },
      { version: "Version 0.8", when: "Weeks 3–10" },
      { version: "Version 0.9", when: "Weeks 8–11" },
      { version: "Version 1.0", when: "Launch & beyond" },
    ],
  },
  features: {
    eyebrow: "Built in",
    heading: "Features we build every week",
    text: "",
    items: [
      { icon: "sparkles", name: "Onboarding" },
      { icon: "face-id", name: "Face ID login" },
      { icon: "bell", name: "Push alerts" },
      { icon: "cloud-sync", name: "Offline sync" },
      { icon: "card", name: "Payments" },
      { icon: "pin", name: "Live maps" },
      { icon: "chat", name: "In-app chat" },
      { icon: "search", name: "Search & filters" },
      { icon: "camera", name: "Camera & uploads" },
      { icon: "link", name: "Deep links" },
      { icon: "chart", name: "Analytics" },
      { icon: "globe", name: "Multi-language" },
      { icon: "moon", name: "Dark mode" },
      { icon: "users", name: "User roles" },
      { icon: "update", name: "In-app updates" },
      { icon: "lifebuoy", name: "Help & support" },
      { icon: "star", name: "Review prompts" },
      { icon: "accessibility", name: "Accessibility" },
    ],
  },
  layers: {
    eyebrow: "Under the hood",
    heading: "Built in layers\nthat last",
    text: "Good apps are tidy on the inside. Each layer has one job, so new features slot in without breaking old ones — and your data stays locked down from the screen to the server.",
    items: [
      { name: "Interface", body: "Screens and components from one design system" },
      { name: "App logic", body: "State and business rules, tested away from the UI" },
      { name: "Offline storage", body: "A local database that syncs when signal returns" },
      { name: "API & backend", body: "Versioned APIs, payments and third-party services" },
      { name: "Security", body: "Encrypted data, short-lived tokens, server-side checks" },
      { name: "Monitoring", body: "Crash reports and performance alerts from day one" },
    ],
  },
  plan: {
    eyebrow: "Have an app idea?",
    heading: "Get a clear plan\nbefore you spend",
    text: "Tell us the idea and we’ll come back with a scoped build plan — features, platform, timeline and a fixed budget. Free, with no obligation.",
    button: "Get your build plan",
    card: "Your build plan",
    checklist: [{ label: "Feature list" }, { label: "iOS, Android or both" }, { label: "Week-by-week timeline" }, { label: "Fixed budget" }],
  },
};

export type MobileCopy = typeof MOBILE_COPY;

export function mobileCopy(service: ServiceDetail): MobileCopy {
  return overlayCopy(MOBILE_COPY, service.copy ?? {});
}
