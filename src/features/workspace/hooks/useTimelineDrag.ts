import { useRef, useCallback } from "react";
import type { Line, Word } from "@/types";
import type { DragState } from "../types";
import { TIMELINE_CONSTANTS } from "../types";
import {
  getPositionFromGlobalIndex,
  recalcLineBounds,
  updateWordInLines,
} from "../utils/timelineUtils";

interface UseTimelineDragProps {
  lines: Line[];
  setTranscript: React.Dispatch<React.SetStateAction<Line[]>>;
  pixelsPerSecond: number;
  saveTranscript: (override?: Line[]) => Promise<void>;
  projectId?: string;
}

export function useTimelineDrag({
  lines,
  setTranscript,
  pixelsPerSecond,
  saveTranscript,
  projectId,
}: UseTimelineDragProps) {
  const dragRef = useRef<DragState | null>(null);
  const transcriptRef = useRef<Line[]>(lines);

  const handleDragStart = useCallback(
    (
      e: React.MouseEvent,
      mode: DragState["mode"],
      globalIndex: number,
      originalWord: Word
    ) => {
      e.preventDefault();
      try {
        document.body.style.userSelect = "none";
        (document.body.style as any).webkitUserSelect = "none";
      } catch {}

      const pos = getPositionFromGlobalIndex(lines, globalIndex);
      if (!pos) return;

      dragRef.current = {
        mode,
        startX: e.clientX,
        originalStart: originalWord.start,
        originalEnd: originalWord.end,
        lineIndex: pos.lineIndex,
        wordIndex: pos.wordIndex,
        globalIndex,
      };
    },
    [lines]
  );

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;

      const dx = e.clientX - d.startX;
      const deltaMs = Math.round((dx / pixelsPerSecond) * 1000);
      const minDur = TIMELINE_CONSTANTS.MIN_WORD_DURATION;

      setTranscript((prev) => {
        const pos = getPositionFromGlobalIndex(prev, d.globalIndex);
        if (!pos) return prev;

        const { lineIndex, wordIndex } = pos;
        const line = prev[lineIndex];
        const words = line.words ?? [];
        const w = words[wordIndex];
        if (!w) return prev;

        let newStart = w.start;
        let newEnd = w.end;

        switch (d.mode) {
          case "move":
            const offset = deltaMs;
            newStart = Math.max(0, d.originalStart + offset);
            newEnd = Math.max(newStart + minDur, d.originalEnd + offset);
            break;
          case "resize-start":
            newStart = Math.max(
              0,
              Math.min(d.originalEnd - minDur, d.originalStart + deltaMs)
            );
            newEnd = d.originalEnd;
            break;
          case "resize-end":
            newStart = d.originalStart;
            newEnd = Math.max(
              d.originalStart + minDur,
              d.originalEnd + deltaMs
            );
            break;
        }

        const nextWords = [...words];
        nextWords[wordIndex] = { ...w, start: newStart, end: newEnd };
        const bounds = recalcLineBounds(nextWords, {
          start: line.start,
          end: line.end,
        });

        const next = [...prev];
        next[lineIndex] = { ...line, ...bounds, words: nextWords };

        if (dragRef.current) {
          dragRef.current.lastStart = newStart;
          dragRef.current.lastEnd = newEnd;
        }

        return next;
      });
    },
    [pixelsPerSecond, setTranscript]
  );

  const handleDragEnd = useCallback(async () => {
    const d = dragRef.current;
    dragRef.current = null;

    if (!d || !projectId) return;

    try {
      document.body.style.userSelect = "";
      (document.body.style as any).webkitUserSelect = "";
    } catch {}

    try {
      await saveTranscript(transcriptRef.current);
    } catch (error) {
      console.error("error updating transcript", error);
    }
  }, [projectId, saveTranscript]);

  const setupGlobalDragHandlers = useCallback(() => {
    const onMove = (e: MouseEvent) => {
      handleDragMove(e);
    };

    const onUp = () => {
      handleDragEnd();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [handleDragMove, handleDragEnd]);

  return {
    dragRef,
    transcriptRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    setupGlobalDragHandlers,
  };
}
