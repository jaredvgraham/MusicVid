import React from "react";
import type { TimelineSegmentData, DragState } from "../../types";
import type { Line, Word } from "@/types";
import { TIMELINE_CONSTANTS } from "../../types";
import { getPositionFromGlobalIndex } from "../../utils/timelineUtils";

interface TimelineSegmentProps {
  segment: TimelineSegmentData;
  lines: Line[];
  pixelsPerSecond: number;
  onSelect: (index: number) => void;
  onSeek: (ms: number) => void;
  onDragStart: (
    e: React.MouseEvent,
    mode: DragState["mode"],
    globalIndex: number,
    originalWord: Word
  ) => void;
}

export function TimelineSegment({
  segment,
  lines,
  pixelsPerSecond,
  onSelect,
  onSeek,
  onDragStart,
}: TimelineSegmentProps) {
  const { index, start, end, lane, text, isSelected, isActive } = segment;
  const left = (start / 1000) * pixelsPerSecond;
  const width = Math.max(2, ((end - start) / 1000) * pixelsPerSecond);
  const top = TIMELINE_CONSTANTS.TOP_PAD + lane * TIMELINE_CONSTANTS.ROW_HEIGHT;

  const pos = getPositionFromGlobalIndex(lines, index);
  const word = pos ? lines[pos.lineIndex]?.words?.[pos.wordIndex] : null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.resizeHandle) return;
    e.preventDefault();

    if (!word) return;
    onDragStart(e, "move", index, word);
  };

  // Touch events disabled - using text inputs for mobile timestamp editing
  // const handleTouchStart = (e: React.TouchEvent) => {
  //   if ((e.target as HTMLElement).dataset.resizeHandle) return;
  //   e.preventDefault();

  //   if (!word) return;
  //   onDragStart(e, "move", index, word);
  // };

  const handleResizeStart = (
    e: React.MouseEvent,
    mode: "resize-start" | "resize-end"
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!word) return;
    onDragStart(e, mode, index, word);
  };

  return (
    <div
      className={`absolute truncate rounded border text-xs cursor-grab active:cursor-grabbing ${
        isActive ? "border-emerald-400" : "border-white/10"
      } ${
        isSelected
          ? "bg-yellow-500/25 border-gray-200"
          : isActive
          ? "bg-emerald-500/25"
          : "bg-white/5 hover:bg-white/10"
      }`}
      draggable={false}
      style={{
        left,
        width,
        top,
        height: TIMELINE_CONSTANTS.CLIP_HEIGHT,
      }}
      title={text}
      onClick={() => onSelect(index)}
      onDoubleClick={() => onSeek(start)}
      onMouseDown={handleMouseDown}
    >
      {/* Resize handle - start */}
      <div
        data-resize-handle="start"
        className="absolute left-0 top-0 h-full w-1.5 cursor-ew-resize bg-transparent flex items-center"
        onMouseDown={(e) => handleResizeStart(e, "resize-start")}
      >
        <div className="mx-auto h-2/3 w-0.5 rounded bg-white/60" />
      </div>

      {/* Resize handle - end */}
      <div
        data-resize-handle="end"
        className="absolute right-0 top-0 h-full w-1.5 cursor-ew-resize bg-transparent flex items-center"
        onMouseDown={(e) => handleResizeStart(e, "resize-end")}
      >
        <div className="mx-auto h-2/3 w-0.5 rounded bg-white/60" />
      </div>

      {/* Text content */}
      <div className="h-full w-full px-2">
        <div className="line-clamp-1 leading-[24px] text-left">{text}</div>
      </div>
    </div>
  );
}
