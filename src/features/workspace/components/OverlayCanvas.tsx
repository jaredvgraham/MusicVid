"use client";

import React, { useMemo, useState } from "react";
import { useEditor } from "./EditorContext";
import type { TextClip } from "@/types";
import {
  DEFAULT_LYRIC_PRESET_ID,
  LYRIC_PRESETS,
  LyricPreset,
} from "../styles/lyricPresets";

export function OverlayCanvas(): React.ReactElement {
  const { transcript, project, currentTimeMs, lyricPresetId, renderScale } =
    useEditor();
  const [clips] = useState<TextClip[]>(project.textClips ?? []);
  const preset: LyricPreset =
    LYRIC_PRESETS[lyricPresetId] ?? LYRIC_PRESETS[DEFAULT_LYRIC_PRESET_ID];
  const baseW = (project as any)?.width || 1080;
  const baseH = (project as any)?.height || 1920;
  const isLandscape =
    (project as any)?.orientation === "landscape" || baseW > baseH;
  const designW = isLandscape ? 1920 : 1080;
  const designH = isLandscape ? 1080 : 1920;
  const finalScale = (renderScale || 1) * (baseW / designW);

  // Build lines of up to 3 words that persist within the current section.
  // Show the latest up to 4 lines (newest at bottom).
  const layeredLines = useMemo(() => {
    const MAX_WORDS_PER_LINE = 3;
    // Collect words active at the current time using each word's start/end
    const active = [] as { text: string; start: number }[];
    for (let li = 0; li < transcript.length; li++) {
      const ln = transcript[li];
      const words = ln?.words || [];
      for (let wi = 0; wi < words.length; wi++) {
        const w = words[wi];
        if (currentTimeMs >= w.start && currentTimeMs < w.end) {
          active.push({ text: w.text, start: w.start });
        }
      }
    }
    active.sort((a, b) => a.start - b.start);
    const texts = active.map((a) => a.text);
    const lines: string[] = [];
    let buf: string[] = [];
    const isTerminal = (t: string) => /[.!?]$/.test(t);
    for (let i = 0; i < texts.length; i++) {
      buf.push(texts[i]);
      const reached = buf.length >= MAX_WORDS_PER_LINE;
      const terminal = isTerminal(texts[i]);
      if (reached || terminal) {
        lines.push(buf.join(" "));
        buf = [];
      }
    }
    if (buf.length > 0) lines.push(buf.join(" "));
    return lines.slice(-4);
  }, [transcript, currentTimeMs]);

  // Render positioned text clips + active words overlay
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Scale a fixed 1080x1920 overlay to fit the container */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${designW}px`,
          height: `${designH}px`,
          transform: `scale(${finalScale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Optional cinematic beams behind center lyrics */}
        {(preset.fxBeams || preset.fxGodRays) && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: `${designW * 0.9}px`,
              height: `${designH * 0.35}px`,
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, rgba(0,0,0,0) 70%)",
              filter: "blur(18px)",
              opacity: 0.9,
            }}
          />
        )}
        {preset.fxGodRays && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${
                preset.fxRayAngleDeg ?? 0
              }deg)`,
              width: `${designW}px`,
              height: `${designH * 0.5}px`,
              background:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.22) 6%, rgba(255,255,255,0.00) 10%, rgba(255,255,255,0.00) 18%)",
              filter: "blur(24px)",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />
        )}
        {/* Custom placed text clips */}
        {clips
          .filter((c) => currentTimeMs >= c.start && currentTimeMs < c.end)
          .map((c, i) => (
            <div
              key={i}
              style={{
                left: `${c.xPct}%`,
                top: `${c.yPct}%`,
                transform: "translate(-50%, -50%)",
                color: preset.gradientText
                  ? "transparent"
                  : preset.color ?? "#fff",
                fontWeight: preset.fontWeight ?? 700,
                fontSize: `${(preset.fontSizePx ?? 24) + 2}px`,
                letterSpacing: `${preset.letterSpacingPx ?? 0}px`,
                textTransform: preset.textTransform ?? "none",
                textAlign: preset.textAlign ?? "center",
                textShadow: preset.textShadow ?? "0 2px 12px rgba(0,0,0,0.55)",
                WebkitBackgroundClip: preset.gradientText ? "text" : undefined,
                backgroundImage: preset.gradientText
                  ? `linear-gradient(90deg, ${preset.gradientText.from}, ${preset.gradientText.to})`
                  : undefined,
              }}
              className="absolute select-none font-semibold tracking-wide"
            >
              {c.text}
            </div>
          ))}
        {/* Default lyrics center overlay: up to 4 lines, 2–3 words each */}
        {layeredLines.length > 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            <div className="flex flex-col items-center gap-1">
              {layeredLines.map((line, idx) => (
                <div
                  key={`${idx}-${line}`}
                  style={{
                    color: preset.gradientText
                      ? "transparent"
                      : preset.color ?? "#fff",
                    fontWeight: preset.fontWeight ?? 700,
                    fontSize: `${preset.fontSizePx ?? 24}px`,
                    letterSpacing: `${preset.letterSpacingPx ?? 0}px`,
                    textTransform: preset.textTransform ?? "none",
                    textAlign: preset.textAlign ?? "center",
                    textShadow:
                      preset.textShadow ?? "0 2px 12px rgba(0,0,0,0.55)",
                    WebkitBackgroundClip: preset.gradientText
                      ? "text"
                      : undefined,
                    backgroundImage: preset.gradientText
                      ? `linear-gradient(90deg, ${preset.gradientText.from}, ${preset.gradientText.to})`
                      : undefined,
                  }}
                  className="text-center font-semibold tracking-wide"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
