import React from "react";

interface TimelinePlayheadProps {
  currentTimeMs: number;
  pixelsPerSecond: number;
  onMouseDown: (e: React.MouseEvent) => void;
}

export function TimelinePlayhead({
  currentTimeMs,
  pixelsPerSecond,
  onMouseDown,
}: TimelinePlayheadProps) {
  return (
    <div
      className="absolute top-0 h-full bg-emerald-400/80"
      style={{
        left: `${(currentTimeMs / 1000) * pixelsPerSecond}px`,
        width: 2,
        cursor: "ew-resize",
      }}
      onMouseDown={onMouseDown}
    />
  );
}
