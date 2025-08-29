"use client";

import React from "react";
import { useEditor } from "../../state/EditorContext";
import { useEditorHotkeys } from "../../state/useEditorHotkeys";
import { formatTime } from "../../utils/timelineUtils";

export function ControlsBar(): React.ReactElement {
  const {
    playing,
    togglePlay,
    currentTimeMs,
    pixelsPerSecond,
    setPixelsPerSecond,
  } = useEditor();
  useEditorHotkeys();

  return (
    <div className="flex items-center justify-between rounded border border-white/10 bg-neutral-950/70 px-3 py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="rounded bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div className="ml-3 text-sm text-white/70">
          {formatTime(currentTimeMs)}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>Zoom</span>
        <input
          type="range"
          min={40}
          max={300}
          step={5}
          value={pixelsPerSecond}
          onChange={(e) => setPixelsPerSecond(Number(e.target.value))}
        />
        <span className="w-10 text-right">{pixelsPerSecond}</span>
      </div>
    </div>
  );
}
