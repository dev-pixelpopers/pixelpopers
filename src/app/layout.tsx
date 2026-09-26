import type { Metadata } from "next";
import { Archivo, Michroma, Modak } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Stand-in for the licensed "Nevera" display face used in Figma.
const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

const modak = Modak({
  variable: "--font-modak",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Pixel Popers — We make your website poppin’",
  description:
    "A funky creative studio. From strategy to execution, we offer a full suite of creative services designed to elevate your brand and captivate your audience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
