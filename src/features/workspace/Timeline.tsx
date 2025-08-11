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
            const width = Math.max(
              2,
              ((seg.end - seg.start) / 1000) * pixelsPerSecond
            );
            const isSelected = selectedIndex === seg.index;

            const isActive =
              currentTimeMs >= seg.start && currentTimeMs < seg.end;
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
              >
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
