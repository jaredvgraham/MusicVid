"use client";
import React, { useMemo, useState, useRef } from "react";
import type { TextClip } from "@/types";
import { useEditor } from "../../state/EditorContext";
import {
  DEFAULT_LYRIC_PRESET_ID,
  LYRIC_PRESETS,
  LyricPreset,
} from "../../styles/lyricPresets";
import CenterLines from "./CenterLines";
import { buildPresetTextStyle, mergeWordStyle } from "./utils/style";
import GodRays from "./fx/GodRays";
import FxBeams from "./fx/FxBeams";

export function OverlayCanvas(): React.ReactElement {
  const {
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    project,
    currentTimeMs,
    lyricPresetId,
    renderScale,
    saveTranscript,
  } = useEditor();
  const [clips] = useState<TextClip[]>(project.textClips ?? []);
  const preset: LyricPreset =
    LYRIC_PRESETS[lyricPresetId] ?? LYRIC_PRESETS[DEFAULT_LYRIC_PRESET_ID];
  const baseW = (project as any)?.width || 1080;
  const baseH = (project as any)?.height || 1920;
  const isLandscape =
    (project as any)?.orientation === "landscape" || baseW > baseH;
  const designW = isLandscape ? 1920 : 1080;
  const designH = isLandscape ? 1080 : 1920;
  const finalScale = (renderScale || 1) * (baseW / designW);

  // Style helpers now shared with backend-like utils/style

  // Helper: update a word position by its global word index
  function updateWordByGlobalIndex(
    globalIdx: number,
    xPct: number,
    yPct: number
  ) {
    setTranscript((prev) => {
      let acc = 0;
      let foundLine = -1;
      let foundWord = -1;
      for (let li = 0; li < prev.length; li++) {
        const count = prev[li]?.words?.length ?? 0;
        if (globalIdx < acc + count) {
          foundLine = li;
          foundWord = globalIdx - acc;
          break;
        }
        acc += count;
      }
      if (foundLine < 0 || foundWord < 0) return prev;
      const line = prev[foundLine];
      const words = Array.isArray(line.words) ? [...line.words] : [];
      const current = words[foundWord];
      if (!current) return prev;
      const updated = { ...current, xPct, yPct } as any;
      words[foundWord] = updated;
      const next = [...prev];
      next[foundLine] = { ...line, words };
      return next;
    });
  }

  // Drag-to-position (pointer events)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Build lines of up to 3 words that persist within the current section.
  // Show the latest up to 4 lines (newest at bottom).
  const groupedUnplacedWords = useMemo(() => {
    const MAX_WORDS_PER_LINE = 3;
    type WordRef = { w: any; gi: number };
    const active: WordRef[] = [];
    let acc = 0;
    for (let li = 0; li < transcript.length; li++) {
      const ln = transcript[li];
      const words = ln?.words || [];
      for (let wi = 0; wi < words.length; wi++) {
        const w = words[wi];
        const gi = acc + wi;
        if (currentTimeMs >= w.start && currentTimeMs < w.end) {
          if (
            !(
              typeof (w as any).xPct === "number" &&
              typeof (w as any).yPct === "number"
            )
          ) {
            active.push({ w, gi });
          }
        }
      }
      acc += words.length;
    }
    active.sort((a, b) => a.w.start - b.w.start);
    const groups: WordRef[][] = [];
    let buf: WordRef[] = [];
    const isTerminal = (t: string) => /[.!?]$/.test(t);
    for (let i = 0; i < active.length; i++) {
      buf.push(active[i]);
      const reached = buf.length >= MAX_WORDS_PER_LINE;
      const terminal = isTerminal(active[i].w.text);
      if (reached || terminal) {
        groups.push(buf);
        buf = [];
      }
    }
    if (buf.length > 0) groups.push(buf);
    return groups.slice(-4);
  }, [transcript, currentTimeMs]);

  // Render positioned text clips + active words overlay
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Scale a fixed 1080x1920 overlay to fit the container */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${designW}px`,
          height: `${designH}px`,
          transform: `scale(${finalScale})`,
          transformOrigin: "top left",
          pointerEvents: "auto",
        }}
        ref={containerRef}
        onPointerMove={(e) => {
          if (!isDragging || draggingIdx == null) return;
          const el = containerRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
          const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));
          updateWordByGlobalIndex(draggingIdx, xPct, yPct);
        }}
        onPointerUp={() => {
          if (!isDragging) return;
          setIsDragging(false);
          setDraggingIdx(null);
          saveTranscript();
        }}
        onPointerCancel={() => {
          setIsDragging(false);
          setDraggingIdx(null);
        }}
      >
        {/* Optional cinematic beams behind center lyrics */}
        {preset.fxBeams && <FxBeams designW={designW} designH={designH} />}
        {preset.fxGodRays && (
          <GodRays preset={preset} designW={designW} designH={designH} />
        )}

        {/* Per-word placements from transcript (xPct/yPct) */}
        {(() => {
          // Build placed words with their global indices
          const placed: Array<{ w: any; gi: number }> = [];
          let acc = 0;
          for (let li = 0; li < transcript.length; li++) {
            const words = transcript[li]?.words || [];
            for (let wi = 0; wi < words.length; wi++) {
              const w = words[wi] as any;
              const gi = acc + wi;
              if (
                currentTimeMs >= w.start &&
                currentTimeMs < w.end &&
                typeof w.xPct === "number" &&
                typeof w.yPct === "number"
              ) {
                placed.push({ w, gi });
              }
            }
            acc += words.length;
          }
          return placed.map(({ w, gi }, idx) => {
            const rotate =
              typeof w.rotationDeg === "number" ? w.rotationDeg : 0;
            const scl =
              typeof w.scale === "number" && isFinite(w.scale) && w.scale > 0
                ? w.scale
                : 1;
            const transform = `translate(-50%, -50%) rotate(${rotate}deg) scale(${scl})`;
            // Only apply fontSizeBump if the word doesn't have custom fontSizePx
            const hasCustomFontSize =
              typeof (w as any)?.style?.fontSizePx === "number";
            const textStyle = mergeWordStyle(
              buildPresetTextStyle(preset, hasCustomFontSize ? 0 : 2),
              (w as any).style
            );
            return (
              <div
                key={`${idx}-${w.text}`}
                style={{
                  position: "absolute",
                  left: `${w.xPct}%`,
                  top: `${w.yPct}%`,
                  transform,
                  transformOrigin: "center center",
                  zIndex: w.zIndex,
                  opacity: w.opacity,
                }}
                className="select-none cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedIndex(gi);
                  setDraggingIdx(gi);
                  setIsDragging(true);
                }}
              >
                <span style={textStyle}>{w.text}</span>
              </div>
            );
          });
        })()}
        {/* Default lyrics center overlay: group active unplaced words into lines */}
        {groupedUnplacedWords.length > 0 && (
          <CenterLines
            preset={preset}
            lines={groupedUnplacedWords as any}
            onPointerDown={(gi) => {
              setSelectedIndex(gi);
              setDraggingIdx(gi);
              setIsDragging(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
