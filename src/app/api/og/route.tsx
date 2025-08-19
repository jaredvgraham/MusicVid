import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Sonexa";
  const desc =
    searchParams.get("desc") || "AI Lyric Video Maker & Caption Studio";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg,#0a0a0a,#111122,#0a0a0a)",
          padding: 64,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 48,
            color: "#a78bfa",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          Sonexa.cc
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 30,
            color: "#cbd5e1",
          }}
        >
          {desc}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
