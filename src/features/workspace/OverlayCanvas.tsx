"use client";

import React, { useMemo, useState } from "react";
import { useEditor } from "./EditorContext";
import type { TextClip, Word } from "@/types";
import { computeSegments } from "./visibility";

export function OverlayCanvas(): React.ReactElement {
  const { transcript, project, currentTimeMs } = useEditor();
  const [clips] = useState<TextClip[]>(project.textClips ?? []);

  // Build lines of up to 3 words that persist within the current section.
  // Show the latest up to 4 lines (newest at bottom).
  const layeredLines = useMemo(() => {
    const MAX_WORDS_PER_LINE = 3;
    const segs = computeSegments(transcript as Word[], {
      gapMs: 1000,
      maxLanes: 10,
      dropAfter: 4,
      alignSectionEnd: true,
    })
      .filter((s) => currentTimeMs >= s.start && currentTimeMs < s.end)
      .sort((a, b) => a.start - b.start);
    const texts = segs.map((s) => s.text);
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
            }}
            className="absolute select-none rounded bg-black/35 px-3 py-1 text-2xl font-semibold tracking-wide"
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
                className="rounded bg-black/35 px-4 py-1 text-center text-2xl font-semibold tracking-wide"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
