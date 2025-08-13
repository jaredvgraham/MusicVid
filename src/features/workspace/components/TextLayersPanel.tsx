"use client";

import React, { useState } from "react";
import { useEditor } from "./EditorContext";
import type { TextClip } from "@/types";

export function TextLayersPanel(): React.ReactElement {
  const { project } = useEditor();
  const [layers, setLayers] = useState<TextClip[]>(project.textClips ?? []);

  // MVP: local-only text layers list; saving to server can be wired to PATCH
  function addLayer() {
    setLayers((prev) => [
      ...prev,
      { start: 0, end: 2000, text: "Title", xPct: 50, yPct: 30 },
    ]);
  }

  return (
    <div className="rounded border border-white/10 bg-neutral-950/70 p-3 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-medium text-white/80">Text Layers</div>
        <button onClick={addLayer} className="rounded bg-white/10 px-2 py-1">
          Add
        </button>
      </div>
      <div className="space-y-2">
        {layers.map((l, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-2 py-1"
          >
            <div className="truncate">{l.text}</div>
            <div className="text-xs text-white/50">
              {l.start}–{l.end}ms
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
