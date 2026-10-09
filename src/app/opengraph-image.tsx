import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = "Pixel Popers — We make your website poppin’";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The default social share card (Open Graph / Twitter) for every page that
 * doesn't set its own image: the brand colours and the headline.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #ffe5d7 0%, #ffd3e0 55%, #c9e8ea 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: "#f27793", letterSpacing: 2 }}>{SITE_NAME.toUpperCase()}</div>
        <div style={{ marginTop: 24, fontSize: 96, fontWeight: 900, lineHeight: 1.02, color: "#6a4b97" }}>WE MAKE YOUR</div>
        <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.02, color: "#6a4b97" }}>WEBSITE POPPIN’</div>
        <div style={{ marginTop: 36, fontSize: 32, color: "#220128" }}>
          Brand · UI/UX · Web · Motion · Content · Marketing
        </div>
      </div>
    ),
    size,
  );
}
