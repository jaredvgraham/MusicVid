"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useEditor, formatTime } from "./EditorContext";
import type { Line } from "@/types";
import { buildWordSegmentsFromLines } from "./visibility";

export function Timeline(): React.ReactElement {
  const {
    transcript,
    selectedIndex,
    setSelectedIndex,
    currentTimeMs,
    pixelsPerSecond,
    seekToMs,
    setTranscript,
  } = useEditor();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Layout constants (one row per line)
  const CLIP_HEIGHT = 24;
  const ROW_HEIGHT = 28;
  const TOP_PAD = 24;

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

  // Use Line[] directly; handle words inside each line when rendering/aggregating
  const lines = transcript as Line[];

  const totalMs = useMemo(() => {
    return lines.length ? Math.max(...lines.map((ln) => ln.end)) : 60_000;
  }, [lines]);

  const widthMs = Math.max(totalMs, currentTimeMs + 2000);

  // Simple segments: words rendered one-by-one within each line; global index across all words
  const segments = useMemo(() => buildWordSegmentsFromLines(lines), [lines]);
  // Show all lines as static rows so clips flow in/out as time moves
  const lanesToShow = Math.max(1, lines.length);

  const gridMarks = useMemo(() => {
    const seconds = Math.ceil(totalMs / 1000);
    const marks: { x: number; label: string }[] = [];
    for (let s = 0; s <= seconds; s++) {
      const x = s * pixelsPerSecond;
      const label = formatTime(s * 1000);
      marks.push({ x, label });
    }
    return marks;
  }, [totalMs, pixelsPerSecond]);

  // Drag state for moving/resizing a single word
  const dragRef = useRef<{
    mode: "move" | "resize-start" | "resize-end";
    startX: number;
    originalStart: number;
    originalEnd: number;
    lineIndex: number;
    wordIndex: number;
    globalIndex: number;
  } | null>(null);

  function getPositionFromGlobalIndex(
    allLines: Line[],
    globalIndex: number
  ): { lineIndex: number; wordIndex: number } | null {
    if (globalIndex == null || globalIndex < 0) return null;
    let acc = 0;
    for (let li = 0; li < allLines.length; li++) {
      const count = allLines[li]?.words?.length ?? 0;
      if (globalIndex < acc + count)
        return { lineIndex: li, wordIndex: globalIndex - acc };
      acc += count;
    }
    return null;
  }

  function recalcLineBounds(
    words: Line["words"],
    fallback: { start: number; end: number }
  ) {
    if (!words || words.length === 0)
      return { start: fallback.start, end: fallback.end };
    const starts = words.map((w) => w.start);
    const ends = words.map((w) => w.end);
    return { start: Math.min(...starts), end: Math.max(...ends) };
  }

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const deltaMs = Math.round((dx / pixelsPerSecond) * 1000);
      const minDur = 50;

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

        if (d.mode === "move") {
          const offset = deltaMs;
          newStart = Math.max(0, d.originalStart + offset);
          newEnd = Math.max(newStart + minDur, d.originalEnd + offset);
        } else if (d.mode === "resize-start") {
          newStart = Math.max(
            0,
            Math.min(d.originalEnd - minDur, d.originalStart + deltaMs)
          );
          newEnd = d.originalEnd;
        } else if (d.mode === "resize-end") {
          newStart = d.originalStart;
          newEnd = Math.max(d.originalStart + minDur, d.originalEnd + deltaMs);
        }

        const nextWords = [...words];
        nextWords[wordIndex] = { ...w, start: newStart, end: newEnd };
        const bounds = recalcLineBounds(nextWords, {
          start: line.start,
          end: line.end,
        });
        const next = [...prev];
        next[lineIndex] = { ...line, ...bounds, words: nextWords };
        return next;
      });
    }

    function onUp() {
      dragRef.current = null;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [pixelsPerSecond, setTranscript]);

  return (
    <div className="rounded border border-white/10 bg-neutral-950">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-white/60">
        <span>Timeline</span>
        <span>{formatTime(currentTimeMs)}</span>
      </div>
      <div
        ref={containerRef}
        className="relative h-72 overflow-x-auto overflow-y-auto border-t border-white/10"
      >
        <div
          className="relative h-full"
          style={{
            width: `${(widthMs / 1000) * pixelsPerSecond}px`,
            height: `${TOP_PAD + lanesToShow * ROW_HEIGHT}px`,
          }}
          onDoubleClick={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ms = Math.max(0, Math.round((x / pixelsPerSecond) * 1000));
            seekToMs(ms);
          }}
        >
          {gridMarks.map((m, i) => (
            <div
              key={i}
              className="absolute top-0 h-full"
              style={{ left: m.x }}
            >
              <div className="pl-1 text-[10px] text-white/50">{m.label}</div>
            </div>
          ))}

          <div
            className="absolute top-0 h-full w-px bg-emerald-400"
            style={{ left: `${(currentTimeMs / 1000) * pixelsPerSecond}px` }}
          />

          <div className="pointer-events-none absolute left-0 right-0 top-0 h-6 bg-gradient-to-b from-black/30 to-transparent" />

          {segments.map((seg) => {
            const left = (seg.start / 1000) * pixelsPerSecond;
            // Compute width from the actual word's end time (without changing how segments are built)
            const pos = getPositionFromGlobalIndex(lines, seg.index);
            const w = pos ? lines[pos.lineIndex]?.words?.[pos.wordIndex] : null;
            const realEnd = w ? w.end : seg.end;
            const realStart = w ? w.start : seg.start;
            const width = Math.max(
              2,
              ((realEnd - realStart) / 1000) * pixelsPerSecond
            );
            const isSelected = selectedIndex === seg.index;

            const isActive =
              currentTimeMs >= realStart && currentTimeMs < realEnd;
            const top = TOP_PAD + seg.lane * ROW_HEIGHT;
            return (
              <div
                key={`${seg.index}-${seg.start}`}
                className={`absolute truncate rounded border text-xs ${
                  isSelected || isActive
                    ? "border-emerald-400 bg-emerald-500/25"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                style={{ left, width, top, height: CLIP_HEIGHT }}
                title={seg.text}
                onClick={() => setSelectedIndex(seg.index)}
                onDoubleClick={() => seekToMs(seg.start)}
                onMouseDown={(e) => {
                  // Begin move drag on body
                  if ((e.target as HTMLElement).dataset.resizeHandle) return;
                  const posInner = getPositionFromGlobalIndex(lines, seg.index);
                  if (!posInner) return;
                  const word =
                    lines[posInner.lineIndex]?.words?.[posInner.wordIndex];
                  if (!word) return;
                  dragRef.current = {
                    mode: "move",
                    startX: e.clientX,
                    originalStart: word.start,
                    originalEnd: word.end,
                    lineIndex: posInner.lineIndex,
                    wordIndex: posInner.wordIndex,
                    globalIndex: seg.index,
                  };
                }}
              >
                <div
                  data-resize-handle="start"
                  className="absolute left-0 top-0 h-full w-1.5 cursor-ew-resize bg-transparent"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    const posInner = getPositionFromGlobalIndex(
                      lines,
                      seg.index
                    );
                    if (!posInner) return;
                    const word =
                      lines[posInner.lineIndex]?.words?.[posInner.wordIndex];
                    if (!word) return;
                    dragRef.current = {
                      mode: "resize-start",
                      startX: e.clientX,
                      originalStart: word.start,
                      originalEnd: word.end,
                      lineIndex: posInner.lineIndex,
                      wordIndex: posInner.wordIndex,
                      globalIndex: seg.index,
                    };
                  }}
                />
                <div
                  data-resize-handle="end"
                  className="absolute right-0 top-0 h-full w-1.5 cursor-ew-resize bg-transparent"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    const posInner = getPositionFromGlobalIndex(
                      lines,
                      seg.index
                    );
                    if (!posInner) return;
                    const word =
                      lines[posInner.lineIndex]?.words?.[posInner.wordIndex];
                    if (!word) return;
                    dragRef.current = {
                      mode: "resize-end",
                      startX: e.clientX,
                      originalStart: word.start,
                      originalEnd: word.end,
                      lineIndex: posInner.lineIndex,
                      wordIndex: posInner.wordIndex,
                      globalIndex: seg.index,
                    };
                  }}
                />
                <div className="h-full w-full px-2">
                  <div className="line-clamp-1 leading-[24px] text-left">
                    {seg.text}
                  </div>
                </div>
              </div>
            );
          })}
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
        </div>
      </div>
    </div>
  );
}
