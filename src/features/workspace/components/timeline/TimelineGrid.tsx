import React from "react";
import type { TimelineGridMark } from "../../types";

interface TimelineGridProps {
  gridMarks: TimelineGridMark[];
  lanesToShow: number;
  TOP_PAD: number;
  ROW_HEIGHT: number;
}

export function TimelineGrid({
  gridMarks,
  lanesToShow,
  TOP_PAD,
  ROW_HEIGHT,
}: TimelineGridProps) {
  return (
    <>
      {/* Grid marks */}
      {gridMarks.map((mark, i) => (
        <div key={i} className="absolute top-0 h-full" style={{ left: mark.x }}>
          <div className="pl-1 text-[10px] text-white/50">{mark.label}</div>
        </div>
      ))}

      {/* Lane separators */}
      {Array.from({ length: lanesToShow }).map((_, ln) => (
        <div
          key={ln}
          className="pointer-events-none absolute left-0 right-0"
          style={{ top: TOP_PAD + ln * ROW_HEIGHT - 1 }}
        >
          <div className="h-px bg-white/10" />
        </div>
      ))}

      {/* Top gradient overlay */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-6 bg-gradient-to-b from-black/30 to-transparent" />
    </>
  );
}
