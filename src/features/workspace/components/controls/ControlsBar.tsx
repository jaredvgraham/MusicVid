"use client";

import React from "react";
import { useEditor } from "../../state/EditorContext";
import { useEditorHotkeys } from "../../state/useEditorHotkeys";
import { formatTime } from "../../utils/timelineUtils";

export function ControlsBar(): React.ReactElement {
  const { currentTimeMs, pixelsPerSecond, setPixelsPerSecond } = useEditor();
  useEditorHotkeys();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between rounded border border-white/10 bg-neutral-950/70 px-3 py-3 md:py-2 gap-3 md:gap-0">
      <div className="flex items-center gap-3">
        <div className="text-sm md:text-sm text-white/70">
          {formatTime(currentTimeMs)}
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-white/70">
        <span className="hidden md:inline">Zoom</span>
        <span className="md:hidden">Timeline Zoom:</span>
        <input
          type="range"
          min={40}
          max={300}
          step={5}
          value={pixelsPerSecond}
          onChange={(e) => setPixelsPerSecond(Number(e.target.value))}
          className="w-24 md:w-20 touch-manipulation"
        />
        <span className="w-10 md:w-8 text-right text-sm md:text-xs">
          {pixelsPerSecond}
        </span>
      </div>
    </div>
  );
}
