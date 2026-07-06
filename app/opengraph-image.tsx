import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#faf7f2",
          color: "#1a1815",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#1f6b3b",
          }}
        >
          {`${site.name} — ${site.role}`}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.1,
            marginTop: 40,
            maxWidth: 1000,
          }}
        >
          I build AI and data systems — and publish the evaluations that prove
          they work.
        </div>
        <div
          style={{
            marginTop: 60,
            width: 160,
            height: 10,
            background: "#1f6b3b",
            borderRadius: 5,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
