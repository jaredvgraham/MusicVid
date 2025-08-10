"use client";

import React, { useMemo, useState } from "react";
import { useEditor } from "./EditorContext";
import type { TextClip } from "@/types";

export function OverlayCanvas(): React.ReactElement {
  const { transcript, project, currentTimeMs } = useEditor();
  const [clips] = useState<TextClip[]>(project.textClips ?? []);

  // Determine active words (for default lyric overlay)
  const activeWords = useMemo(() => {
    return transcript.filter(
      (w) => currentTimeMs >= w.start && currentTimeMs < w.end
    );
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
      {/* Default lyrics center overlay (multiple words) */}
      {activeWords.length > 0 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none rounded bg-black/30 px-4 py-2 text-3xl font-semibold">
          {activeWords.map((w) => w.text).join(" ")}
        </div>
      )}
    </div>
  );
}
