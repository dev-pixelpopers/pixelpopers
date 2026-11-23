import type { Metadata, Viewport } from "next";
import { Archivo, Michroma, Modak } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

import VisitorWelcome from "@/components/layout/VisitorWelcome";
import { getContactPage, getSite } from "@/lib/content";

import "./globals.css";

// Only the faces in the home hero headline are preloaded: Nevera ("We make",
// "Poppin'") and Archivo ("Your website" — the grotesk stack's first choice,
// "Haas Grot Disp Trial", isn't shipped). Every face gets a metric-matched
// fallback from next/font, so the swap doesn't move text. Michroma only
// stands in until Nevera loads (so it's rarely fetched at all), Modak is
// decorative and Haas-Grot appears on inner pages only.
const nevera = localFont({
  src: "../../public/assets/fonts/Nevera-Regular.woff2",
  variable: "--font-nevera",
  display: "swap",
  adjustFontFallback: "Arial",
});

const haasGrot = localFont({
  src: "../../public/assets/fonts/neuehaasgrot.woff2",
  variable: "--font-haas-grot",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: false,
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// Stand-in for the licensed "Nevera" display face used in Figma.
const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const modak = Modak({
  variable: "--font-modak",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "creative agency",
    "brand identity",
    "UI/UX design",
    "web development",
    "motion graphics",
    "content writing",
    "digital marketing",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

/** The MIME type for an icon URL, so browsers pick it without sniffing. */
function iconType(url: string): { type?: string } {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  const types: Record<string, string> = { ico: "image/x-icon", png: "image/png", svg: "image/svg+xml", webp: "image/webp" };
  return ext && types[ext] ? { type: types[ext] } : {};
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    ...baseMetadata,
    // <meta name="google-site-verification"> for Search Console (Site settings → Analytics).
    ...(site.google_site_verification ? { verification: { google: site.google_site_verification } } : {}),
    // Favicon from Site settings (falls back to the built-in Pixel Popers icon).
    // An icon uploaded in Site settings → SEO defaults → Favicon wins;
    // otherwise the built-in Pixel Popers "P" set in /public. Google needs a
    // square icon of at least 48 × 48 — the 192px PNG covers that.
    icons: site.favicon
      ? {
          icon: [{ url: site.favicon, ...iconType(site.favicon) }],
          shortcut: site.favicon,
          apple: site.apple_touch_icon || site.favicon,
        }
      : {
          icon: [
            { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
          ],
          shortcut: "/favicon.ico",
          apple: site.apple_touch_icon || "/apple-touch-icon.png",
        },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffe5d7",
  width: "device-width",
  initialScale: 1,
};


/** Only a well-formed container ID is ever written into the page. */
const validGtmId = (id: string | null | undefined) => (id && /^GTM-[A-Z0-9]+$/.test(id.trim()) ? id.trim() : null);

/** The data layer + gtag() helper, and the "gtm.js" start event the container waits for. */
const gtmBootstrap = () =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, contactPage] = await Promise.all([getSite(), getContactPage()]);
  const gtmId = validGtmId(site.google_tag_manager_id);
  // The pop-up chat uses the contact form's CMS copy.
  const chat = { email: site.company_email, form: contactPage.sections.form ?? undefined };
  const gifs = {
    sound: site.greeting_sound,
    greeting: site.greeting_gif,
    thumbs: site.thumbs_gif,
    pages: {
      home: site.greeting_gif_home,
      work: site.greeting_gif_work,
      caseStudy: site.greeting_gif_case_study,
      services: site.greeting_gif_services,
      service: site.greeting_gif_service,
      about: site.greeting_gif_about,
      blog: site.greeting_gif_blog,
      post: site.greeting_gif_post,
      contact: site.greeting_gif_contact,
    },
  };

  return (
    <html
      lang="en"
      className={`${nevera.variable} ${haasGrot.variable} ${archivo.variable} ${michroma.variable} ${modak.variable} h-full antialiased`}
      // Browser extensions often add attributes to <html> before React loads.
      suppressHydrationWarning
    >
      <head>
        {gtmId ? (
          // Google Tag Manager (Site settings → Analytics). The data layer is set
          // up in the <head> so nothing pushed early is lost; the container itself
          // loads once the page is interactive, so it never competes with the
          // first paint or hydration.
          <script dangerouslySetInnerHTML={{ __html: gtmBootstrap() }} />
        ) : null}
      </head>
      <body className="flex min-h-full flex-col bg-cream text-ink">
        {gtmId ? (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
          </noscript>
        ) : null}
        {children}
        <VisitorWelcome gifs={gifs} chat={chat} />
        {gtmId ? <Script id="gtm" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} /> : null}
      </body>
    </html>
  );
}
