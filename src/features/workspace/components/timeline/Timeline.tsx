"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useEditor } from "../../state/EditorContext";
import type { Line, Word } from "@/types";
import { TIMELINE_CONSTANTS } from "../../types";
import {
  buildTimelineSegments,
  generateGridMarks,
  calculateTotalMs,
  clientXToMs,
} from "../../utils/timelineUtils";
import { useTimelineDrag } from "../../hooks/useTimelineDrag";
import { usePlayheadDrag } from "../../hooks/usePlayheadDrag";
import { TimelineSegment } from "./TimelineSegment";
import { TimelineGrid } from "./TimelineGrid";
import { TimelinePlayhead } from "./TimelinePlayhead";
import { WordCrudBar } from "../controls/WordCrudBar";

export function Timeline(): React.ReactElement {
  const {
    project,
    transcript,
    selectedIndex,
    setSelectedIndex,
    currentTimeMs,
    pixelsPerSecond,
    seekToMs,
    setTranscript,
    saveTranscript,
  } = useEditor();

  // Use custom hooks for drag operations
  const { dragRef, transcriptRef, handleDragStart, setupGlobalDragHandlers } =
    useTimelineDrag({
      lines: transcript,
      setTranscript,
      pixelsPerSecond,
      saveTranscript,
      projectId: project?.id,
    });

  const { containerRef, handlePlayheadMouseDown, setupGlobalPlayheadHandlers } =
    usePlayheadDrag({
      seekToMs,
      currentTimeMs,
      pixelsPerSecond,
      widthMs: Math.max(calculateTotalMs(transcript), currentTimeMs + 2000),
    });

  // Calculate timeline dimensions
  const totalMs = useMemo(() => calculateTotalMs(transcript), [transcript]);
  const widthMs = Math.max(totalMs, currentTimeMs + 2000);
  const lanesToShow = 10;

  // Generate timeline data
  const segments = useMemo(
    () => buildTimelineSegments(transcript, selectedIndex, currentTimeMs),
    [transcript, selectedIndex, currentTimeMs]
  );

  const gridMarks = useMemo(
    () => generateGridMarks(totalMs, pixelsPerSecond),
    [totalMs, pixelsPerSecond]
  );

  // Update transcript ref when transcript changes
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript, transcriptRef]);

  // Setup global drag handlers
  useEffect(() => {
    const cleanupDrag = setupGlobalDragHandlers();
    const cleanupPlayhead = setupGlobalPlayheadHandlers();

    return () => {
      cleanupDrag();
      cleanupPlayhead();
    };
  }, [setupGlobalDragHandlers, setupGlobalPlayheadHandlers]);

  // Keep playhead roughly centered while scrubbing/playing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const playheadX = (currentTimeMs / 1000) * pixelsPerSecond;
    const viewLeft = el.scrollLeft;
    const viewRight = viewLeft + el.clientWidth;
    const margin = el.clientWidth * 0.2;

    if (playheadX < viewLeft + margin || playheadX > viewRight - margin) {
      const targetLeft = Math.max(0, playheadX - el.clientWidth / 2);
      el.scrollLeft = targetLeft;
    }
  }, [currentTimeMs, pixelsPerSecond]);

  const handleTimelineClick = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ms = Math.max(0, Math.round((x / pixelsPerSecond) * 1000));
    seekToMs(ms);
  };

  const handleSegmentDragStart = (
    e: React.MouseEvent,
    mode: "move" | "resize-start" | "resize-end",
    globalIndex: number,
    originalWord: Word
  ) => {
    handleDragStart(e, mode, globalIndex, originalWord);
  };

  return (
    <div className="rounded border border-white/10 bg-neutral-950 w-full overflow-hidden">
      <div className="flex items-center justify-between text-xs text-white/60 px-2 sm:px-3">
        <WordCrudBar />
      </div>

      <div
        ref={containerRef}
        className="relative h-32 sm:h-40 md:h-60 lg:h-72 overflow-x-auto overflow-y-auto border-t border-white/10 select-none"
        style={{
          touchAction: dragRef.current ? "none" : "auto",
        }}
      >
        <div
          className="relative h-full select-none"
          style={{
            width: `${(widthMs / 1000) * pixelsPerSecond}px`,
            height: `${
              TIMELINE_CONSTANTS.TOP_PAD +
              lanesToShow * TIMELINE_CONSTANTS.ROW_HEIGHT
            }px`,
          }}
          onClick={handleTimelineClick}
        >
          {/* Grid and lane separators */}
          <TimelineGrid
            gridMarks={gridMarks}
            lanesToShow={lanesToShow}
            TOP_PAD={TIMELINE_CONSTANTS.TOP_PAD}
            ROW_HEIGHT={TIMELINE_CONSTANTS.ROW_HEIGHT}
          />

          {/* Playhead */}
          <TimelinePlayhead
            currentTimeMs={currentTimeMs}
            pixelsPerSecond={pixelsPerSecond}
            onMouseDown={handlePlayheadMouseDown}
          />

          {/* Timeline segments */}
          {segments.map((segment) => (
            <TimelineSegment
              key={`${segment.index}-${segment.start}`}
              segment={segment}
              lines={transcript}
              pixelsPerSecond={pixelsPerSecond}
              onSelect={setSelectedIndex}
              onSeek={seekToMs}
              onDragStart={handleSegmentDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
