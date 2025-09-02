"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import type { TextClip } from "@/types";
import { useEditor } from "../../state/EditorContext";
import {
  DEFAULT_LYRIC_PRESET_ID,
  LYRIC_PRESETS,
  LyricPreset,
} from "../../styles/lyricPresets";
import { LyricLayout } from "./LyricLayout";
import { buildPresetTextStyle, mergeWordStyle } from "./utils/style";
import GodRays from "./fx/GodRays";
import FxBeams from "./fx/FxBeams";
import {
  LAYOUT_PRESETS,
  DEFAULT_LAYOUT_PRESET_ID,
} from "../../styles/layoutPresets";

export function OverlayCanvas(): React.ReactElement {
  const {
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    project,
    currentTimeMs,
    lyricPresetId,
    layoutPresetId,
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

  // Use actual bg dimensions instead of hardcoded design dimensions

  // Calculate scale directly from container dimensions - use ref to prevent React resets
  const containerScaleRef = useRef(1);
  const [containerScale, setContainerScale] = useState(1);

  // Debug when containerScale is set
  const setContainerScaleWithDebug = (newScale: number) => {
    console.log("🎨 SETTING CONTAINER SCALE:", {
      oldScale: containerScaleRef.current,
      newScale,
      isDragging,
      renderScale,
    });
    containerScaleRef.current = newScale;
    setContainerScale(newScale);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);

  // Drag-to-position (pointer events) - moved up to avoid hoisting issues
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Prioritize containerScale for mobile scaling, fallback to renderScale for desktop
  // Always use the ref value to prevent React state resets
  const finalScale =
    containerScaleRef.current < 1
      ? containerScaleRef.current
      : renderScale > 0
      ? renderScale
      : containerScaleRef.current;

  // Debug finalScale calculation
  console.log("🎨 FINAL SCALE CALCULATION:", {
    containerScaleRef: containerScaleRef.current,
    renderScale,
    finalScale,
    isDragging,
  });

  // Debug containerScale changes
  useEffect(() => {
    console.log("🎨 CONTAINER SCALE CHANGED:", {
      containerScale,
      containerScaleRef: containerScaleRef.current,
      renderScale,
      finalScale,
      isDragging,
    });
  }, [containerScale, renderScale, finalScale, isDragging]);

  // Calculate scale from container dimensions - only once on mount
  useEffect(() => {
    console.log("🎨 SCALE USEEFFECT TRIGGERED:", {
      baseW,
      baseH,
      isDragging,
      containerScale,
    });

    const updateScale = () => {
      if (containerRef.current && containerScaleRef.current === 1) {
        const rect = containerRef.current.getBoundingClientRect();
        const scale = rect.width / baseW;

        console.log("🎨 SCALE CALCULATION:", {
          rectWidth: rect.width,
          baseW,
          calculatedScale: scale,
          currentContainerScale: containerScaleRef.current,
          isDragging,
        });

        if (scale > 0) {
          setContainerScaleWithDebug(scale);
        }
      }
    };

    // Calculate scale on mount only
    updateScale();

    // No resize handler - scale is calculated once and never changes
  }, [baseW, baseH]);

  // console.log("🎨 OverlayCanvas scale debug:", {
  //   renderScale,
  //   containerScale,
  //   finalScale,
  //   baseW,
  //   baseH,
  //   isPortrait: baseH > baseW,
  // });

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

  // Drag-to-position (pointer events) - moved up to avoid hoisting issues

  // Build lines of up to 3 words that persist within the current section.
  // Show the latest up to 4 lines (newest at bottom).
  const groupedUnplacedWords = useMemo(() => {
    console.log("🎨 GROUPED WORDS RECALC:", {
      transcriptLength: transcript.length,
      currentTimeMs,
      isDragging,
      finalScale,
      containerScale,
      renderScale,
    });

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
          // Check if word has custom positioning
          const hasCustomPositioning =
            typeof (w as any).xPct === "number" &&
            typeof (w as any).yPct === "number";

          if (hasCustomPositioning) {
            // For placed words, keep them in the layout as invisible placeholders
            // This maintains the layout spacing while making them invisible
            const placeholderWord = {
              ...w,
              style: { ...(w.style || {}), opacity: 0 },
            };
            console.log(
              `Adding placeholder for "${w.text}" in layout (invisible but maintains spacing)`
            );
            active.push({ w: placeholderWord, gi });
          } else {
            // Word doesn't have custom positioning, include as normal
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

    console.log(
      "Final groupedUnplacedWords:",
      groups.map((group) =>
        group.map((w) => ({
          text: w.w.text,
          gi: w.gi,
          isTransparent: w.w.opacity === 0,
        }))
      )
    );

    return groups.slice(-4);
  }, [transcript, currentTimeMs]);

  // Render positioned text clips + active words overlay
  return (
    <div className="pointer-events-none absolute inset-0 " ref={containerRef}>
      {/* Scale a fixed 1080x1920 overlay to fit the container */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,

          transform: `scale(${finalScale})`,

          pointerEvents: "auto",
        }}
        className="w-full h-full"
        ref={dragContainerRef}
        onPointerMove={(e) => {
          if (!isDragging || draggingIdx == null) return;
          const el = dragContainerRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
          const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));

          console.log("🎨 DRAG DEBUG:", {
            draggingIdx,
            isDragging,
            finalScale,
            containerScale,
            renderScale,
            rect: { width: rect.width, height: rect.height },
            position: { x, y, xPct, yPct },
          });

          updateWordByGlobalIndex(draggingIdx, xPct, yPct);
        }}
        onPointerUp={() => {
          if (!isDragging) return;

          console.log("🎨 DRAG END DEBUG:", {
            finalScale,
            containerScale,
            renderScale,
            isDragging,
          });

          setIsDragging(false);
          setDraggingIdx(null);
          // Save the transcript after dragging is complete
          setTimeout(() => saveTranscript(), 0);
        }}
        onPointerCancel={() => {
          setIsDragging(false);
          setDraggingIdx(null);
        }}
      >
        {/* Optional cinematic beams behind center lyrics */}
        {/* {preset.fxBeams && <FxBeams designW={designW} designH={designH} />}
        {preset.fxGodRays && (
          <GodRays preset={preset} designW={designW} designH={designH} />
        )} */}

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
              buildPresetTextStyle(preset, baseH > baseW),
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

                  console.log("🎨 DRAG START DEBUG:", {
                    gi,
                    finalScale,
                    containerScale,
                    renderScale,
                    isDragging,
                  });

                  setSelectedIndex(gi);
                  setDraggingIdx(gi);
                  setIsDragging(true);
                }}
              >
                <span
                  style={{
                    ...textStyle,
                    fontSize: (() => {
                      if (textStyle.fontSize && finalScale < 1) {
                        const originalSize = parseFloat(
                          textStyle.fontSize as string
                        );
                        const scaledSize = originalSize * finalScale;
                        console.log("🎨 FONT SCALING DEBUG:", {
                          originalSize,
                          finalScale,
                          scaledSize,
                          textStyle: textStyle.fontSize,
                          isDragging,
                        });
                        return `${scaledSize}px`;
                      }
                      return textStyle.fontSize;
                    })(),
                  }}
                >
                  {w.text}
                </span>
              </div>
            );
          });
        })()}
        {/* Default lyrics overlay: group active unplaced words into lines using layout preset */}
        {groupedUnplacedWords.length > 0 && (
          <LyricLayout
            preset={preset}
            layoutPreset={
              LAYOUT_PRESETS[layoutPresetId] ||
              LAYOUT_PRESETS[DEFAULT_LAYOUT_PRESET_ID]
            }
            lines={groupedUnplacedWords as any}
            currentTimeMs={currentTimeMs}
            onPointerDown={(gi: number) => {
              setSelectedIndex(gi);
              setDraggingIdx(gi);
              setIsDragging(true);
            }}
            isPortrait={baseH > baseW}
            scale={finalScale}
          />
        )}
      </div>
    </div>
  );
}
