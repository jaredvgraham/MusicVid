"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useEditor, formatTime } from "./EditorContext";
import type { Word } from "@/types";
import { computeSegments } from "./visibility";

export function Timeline(): React.ReactElement {
  const {
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    currentTimeMs,
    setCurrentTimeMs,
    pixelsPerSecond,
    playing,
  } = useEditor();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<null | {
    index: number;
    mode: "move" | "trimStart" | "trimEnd" | "lane";
    startX: number;
    startY?: number;
    origStart: number;
    origEnd: number;
    origLane?: number;
  }>(null);
  const MAX_TIMELINE_LANES = 10;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const playheadX = (currentTimeMs / 1000) * pixelsPerSecond;
    const viewLeft = el.scrollLeft;
    const viewRight = viewLeft + el.clientWidth;
    const margin = el.clientWidth * 0.2;
    const targetLeft = Math.max(0, playheadX - el.clientWidth / 2);
    if (playing) {
      if (playheadX < viewLeft + margin || playheadX > viewRight - margin) {
        el.scrollLeft = targetLeft;
      }
    } else {
      el.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [currentTimeMs, pixelsPerSecond, playing]);

  const totalMs = useMemo(() => {
    return transcript.length
      ? Math.max(...transcript.map((w) => w.end))
      : 60_000;
  }, [transcript]);

  const widthMs = Math.max(totalMs, currentTimeMs + 2000);

  const segments = useMemo(
    () =>
      computeSegments(transcript as Word[], {
        gapMs: 1000,
        maxLanes: MAX_TIMELINE_LANES,
        dropAfter: 4,
        alignSectionEnd: true,
      }),
    [transcript]
  );

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

  // Drag handlers: update transcript on mouse move while dragging
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const deltaMs = Math.round((dx / pixelsPerSecond) * 1000);
      const minDur = 50;
      setTranscript((prev) => {
        const next = [...prev];
        const w = { ...next[drag.index] };
        if (!w) return prev;
        if (drag.mode === "move") {
          const dur = drag.origEnd - drag.origStart;
          w.start = Math.max(0, drag.origStart + deltaMs);
          w.end = Math.max(w.start + minDur, w.start + dur);
        } else if (drag.mode === "lane") {
          // vertical drag to change lane
          const dy = e.clientY - (drag.startY || 0);
          const laneDelta = Math.round(dy / 28); // lane height 28px
          const newLane = Math.max(
            0,
            Math.min(3, (drag.origLane || 0) + laneDelta)
          );
          (w as any).lane = newLane;
        } else if (drag.mode === "trimStart") {
          const newStart = Math.max(
            0,
            Math.min(drag.origEnd - minDur, drag.origStart + deltaMs)
          );
          w.start = newStart;
        } else if (drag.mode === "trimEnd") {
          const newEnd = Math.max(
            drag.origStart + minDur,
            drag.origEnd + deltaMs
          );
          w.end = newEnd;
        }
        next[drag.index] = w;
        return next;
      });
    }
    function onUp() {
      setDrag(null);
    }
    if (drag) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, pixelsPerSecond, setTranscript]);

  return (
    <div className="rounded border border-white/10 bg-neutral-950">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-white/60">
        <span>Timeline</span>
        <span>{formatTime(currentTimeMs)}</span>
      </div>
      <div
        ref={containerRef}
        className="relative h-56 overflow-x-auto overflow-y-hidden border-t border-white/10"
      >
        <div
          className="relative h-full"
          style={{ width: `${(widthMs / 1000) * pixelsPerSecond}px` }}
        >
          {/* Grid */}
          {gridMarks.map((m, i) => (
            <div
              key={i}
              className="absolute top-0 h-full"
              style={{ left: m.x }}
            >
              {/* <div className="h-6 border-l border-white/10" /> */}
              <div className="pl-1 text-[10px] text-white/50">{m.label}</div>
            </div>
          ))}

          {/* Playhead */}
          <div
            className="absolute top-0 h-full w-px bg-emerald-400"
            style={{ left: `${(currentTimeMs / 1000) * pixelsPerSecond}px` }}
          />

          {/* Top ruler overlay for improved UX */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-6 bg-gradient-to-b from-black/30 to-transparent" />

          {/* Clips rendered from layered visibility segments */}
          {segments.map((seg) => {
            const left = (seg.start / 1000) * pixelsPerSecond;
            const width = Math.max(
              2,
              ((seg.end - seg.start) / 1000) * pixelsPerSecond
            );
            const laneTop =
              24 + Math.max(0, Math.min(MAX_TIMELINE_LANES - 1, seg.lane)) * 28;
            const isSelected = selectedIndex === seg.index;
            const w = transcript[seg.index];
            return (
              <div
                key={`${seg.index}-${seg.start}`}
                className={`group absolute truncate rounded border text-xs ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                style={{ left, width, top: laneTop, height: 24 }}
                title={seg.text}
                onClick={() => setSelectedIndex(seg.index)}
                onDoubleClick={() => setCurrentTimeMs(seg.start)}
              >
                {/* Trim start (affects base word bounds) */}
                <div
                  className="absolute left-0 top-0 h-full w-2 cursor-ew-resize rounded-l bg-white/10 opacity-0 group-hover:opacity-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDrag({
                      index: seg.index,
                      mode: "trimStart",
                      startX: e.clientX,
                      origStart: w.start,
                      origEnd: w.end,
                    });
                  }}
                />
                {/* Body (move/lane) */}
                <div
                  className="h-full w-full cursor-grab px-2 active:cursor-grabbing"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setDrag({
                      index: seg.index,
                      mode: e.shiftKey ? "lane" : "move",
                      startX: e.clientX,
                      startY: e.clientY,
                      origStart: w.start,
                      origEnd: w.end,
                      origLane: w.lane ?? 0,
                    });
                  }}
                >
                  <div className="line-clamp-1 leading-[24px] text-left">
                    {seg.text}
                  </div>
                </div>
                {/* Trim end */}
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-ew-resize rounded-r bg-white/10 opacity-0 group-hover:opacity-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDrag({
                      index: seg.index,
                      mode: "trimEnd",
                      startX: e.clientX,
                      origStart: w.start,
                      origEnd: w.end,
                    });
                  }}
                />
              </div>
            );
          })}
          {/* Lane separators */}
          {Array.from({ length: MAX_TIMELINE_LANES }).map((_, ln) => (
            <div
              key={ln}
              className="pointer-events-none absolute left-0 right-0"
              style={{ top: 24 + ln * 28 - 1 }}
            >
              <div className="h-px bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dragging logic
export function TimelineDragLayer(): React.ReactElement | null {
  const { setTranscript, pixelsPerSecond } = useEditor();
  const dragRef = useRef<null | {
    index: number;
    mode: "move" | "trimStart" | "trimEnd";
    startX: number;
    origStart: number;
    origEnd: number;
  }>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const deltaMs = Math.round((dx / pixelsPerSecond) * 1000);
      const minDur = 50;
      setTranscript((prev) => {
        const next = [...prev];
        const w = { ...next[drag.index] };
        if (!w) return prev;
        if (drag.mode === "move") {
          const dur = drag.origEnd - drag.origStart;
          w.start = Math.max(0, drag.origStart + deltaMs);
          w.end = Math.max(w.start + minDur, w.start + dur);
        } else if (drag.mode === "trimStart") {
          const newStart = Math.max(
            0,
            Math.min(drag.origEnd - minDur, drag.origStart + deltaMs)
          );
          w.start = newStart;
        } else if (drag.mode === "trimEnd") {
          const newEnd = Math.max(
            drag.origStart + minDur,
            drag.origEnd + deltaMs
          );
          w.end = newEnd;
        }
        next[drag.index] = w;
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

  // expose setter
  (window as any).__timelineSetDrag = (v: any) => (dragRef.current = v);
  return null;
}
