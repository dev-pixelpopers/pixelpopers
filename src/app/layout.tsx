import type { Metadata, Viewport } from "next";
import { Archivo, Michroma, Modak } from "next/font/google";
import { preload } from "react-dom";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

import "./globals.css";

// None of the next/font faces is preloaded: Archivo is body copy, Michroma
// only stands in until Nevera loads (so it's rarely fetched at all) and Modak
// is decorative. Preloaded, they competed with the first paint for bandwidth.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  preload: false,
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
  // The two self-hosted display faces: preloaded so headlines settle into
  // them quickly (they still paint at once in the fallback — font-display: swap).
  preload("/assets/fonts/Nevera-Regular.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/assets/fonts/neuehaasgrot.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${michroma.variable} ${modak.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
