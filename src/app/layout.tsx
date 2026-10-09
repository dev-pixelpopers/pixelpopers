import type { Metadata, Viewport } from "next";
import { Archivo, Michroma, Modak } from "next/font/google";
import localFont from "next/font/local";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

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

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: "#ffe5d7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nevera.variable} ${haasGrot.variable} ${archivo.variable} ${michroma.variable} ${modak.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
