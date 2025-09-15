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
import FxParticles from "./fx/FxParticles";
import FxGlow from "./fx/FxGlow";
import FxShimmer from "./fx/FxShimmer";
import FxPulse from "./fx/FxPulse";
import FxRainbow from "./fx/FxRainbow";
import FxFire from "./fx/FxFire";
import FxIce from "./fx/FxIce";
import FxElectric from "./fx/FxElectric";
import FxHologram from "./fx/FxHologram";
import FxSmoke from "./fx/FxSmoke";
import FxLightning from "./fx/FxLightning";
import FxStars from "./fx/FxStars";
import FxWaves from "./fx/FxWaves";
import FxMatrix from "./fx/FxMatrix";
import FxNeon from "./fx/FxNeon";
import FxSparkle from "./fx/FxSparkle";
import FxGlitter from "./fx/FxGlitter";
import FxDiamond from "./fx/FxDiamond";
import FxCrystal from "./fx/FxCrystal";
import FxPrism from "./fx/FxPrism";
import FxBlur from "./fx/FxBlur";
import FxFade from "./fx/FxFade";
// Static versions of previously animated effects
import FxStarsStatic from "./fx/FxStarsStatic";
import FxParticlesStatic from "./fx/FxParticlesStatic";
import FxWavesStatic from "./fx/FxWavesStatic";
import FxShimmerStatic from "./fx/FxShimmerStatic";
import FxPulseStatic from "./fx/FxPulseStatic";
import FxRainbowStatic from "./fx/FxRainbowStatic";
import FxElectricStatic from "./fx/FxElectricStatic";
import FxHologramStatic from "./fx/FxHologramStatic";
import FxFireStatic from "./fx/FxFireStatic";
import FxIceStatic from "./fx/FxIceStatic";
import FxSmokeStatic from "./fx/FxSmokeStatic";
import FxMatrixStatic from "./fx/FxMatrixStatic";
import "./fx/effects.css";
import {
  LAYOUT_PRESETS,
  DEFAULT_LAYOUT_PRESET_ID,
} from "../../styles/layoutPresets";

export const OverlayCanvas = React.memo(
  function OverlayCanvas(): React.ReactElement {
    const {
      transcript,
      setTranscript,
      selectedIndex,
      setSelectedIndex,
      project,
      currentTimeMs,
      currentPreset,
      layoutPresetId,
      renderScale,
      saveTranscript,
    } = useEditor();
    const [clips] = useState<TextClip[]>(project.textClips ?? []);
    const preset: LyricPreset =
      currentPreset ?? LYRIC_PRESETS[DEFAULT_LYRIC_PRESET_ID];
    const baseW = (project as any)?.width || 1080;
    const baseH = (project as any)?.height || 1920;
    let gap = baseH > baseW ? "16px" : "32px";
    if (baseW < 720 && baseW > 480) {
      gap = "12px";
    } else if (baseW < 480) {
      gap = "8px";
    }
    const isLandscape =
      (project as any)?.orientation === "landscape" || baseW > baseH;

    // Use actual video dimensions instead of hardcoded design dimensions
    const designW = baseW;
    const designH = baseH;

    // Calculate scale directly from container dimensions - use ref to prevent React resets
    const containerScaleRef = useRef(1);
    const [containerScale, setContainerScale] = useState(1);

    // Debug when containerScale is set
    const setContainerScaleWithDebug = (newScale: number) => {
      // Setting container scale
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
    // Final scale calculation

    // Debug containerScale changes
    useEffect(() => {
      // Container scale changed
    }, [containerScale, renderScale, finalScale, isDragging]);

    // Calculate scale from container dimensions - only once on mount
    useEffect(() => {
      // Scale useEffect triggered

      const updateScale = () => {
        if (containerRef.current && containerScaleRef.current === 1) {
          const rect = containerRef.current.getBoundingClientRect();
          const scale = rect.width / baseW;

          // Scale calculation

          if (scale > 0) {
            setContainerScaleWithDebug(scale);
          }
        }
      };

      // Calculate scale on mount only
      updateScale();

      // No resize handler - scale is calculated once and never changes
    }, [baseW, baseH]);

    // OverlayCanvas scale debug
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
      // Early return if no transcript
      if (!transcript || transcript.length === 0) return [];

      const MAX_WORDS_PER_LINE = 3;
      type WordRef = { w: any; gi: number };
      const active: WordRef[] = [];
      let acc = 0;

      // Optimize: only process lines that could contain current time
      for (let li = 0; li < transcript.length; li++) {
        const ln = transcript[li];
        const words = ln?.words || [];

        // Skip if no words in this line
        if (words.length === 0) {
          acc += words.length;
          continue;
        }

        for (let wi = 0; wi < words.length; wi++) {
          const w = words[wi];
          const gi = acc + wi;

          // Optimize: use more efficient time comparison
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
              active.push({ w: placeholderWord, gi });
            } else {
              // Word doesn't have custom positioning, include as normal
              active.push({ w, gi });
            }
          }
        }
        acc += words.length;
      }

      // Early return if no active words
      if (active.length === 0) return [];

      // Sort by start time (more efficient than full sort)
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
    }, [transcript, Math.floor(currentTimeMs / 100)]); // Only recalculate every 100ms

    // Render positioned text clips + active words overlay
    return (
      <div
        className="pointer-events-none absolute inset-0"
        ref={containerRef}
        style={{ zIndex: 2 }}
      >
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
            pointerEvents: isDragging ? "auto" : "none",
          }}
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

            // Drag debug

            updateWordByGlobalIndex(draggingIdx, xPct, yPct);
          }}
          onPointerUp={() => {
            if (!isDragging) return;

            // Drag end debug

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
          {/* Visual Effects - Background Layer - STATIC EFFECTS ONLY */}
          <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
            {preset.fxBeams && (
              <FxBeams
                designW={baseW}
                designH={baseH}
                intensity={preset.fxBeamsIntensity || 0.5}
              />
            )}
            {preset.fxGodRays && (
              <GodRays
                preset={preset}
                designW={baseW}
                designH={baseH}
                intensity={preset.fxGodRaysIntensity || 0.5}
              />
            )}
            {preset.fxGlow && (
              <FxGlow
                designW={baseW}
                designH={baseH}
                color={preset.fxGlowColor || "#ffffff"}
                intensity={preset.fxGlowIntensity || 0.5}
              />
            )}
            {preset.fxNeon && (
              <FxNeon
                designW={baseW}
                designH={baseH}
                intensity={preset.fxNeonIntensity || 0.5}
                color={preset.fxNeonColor || "#00ffff"}
              />
            )}
            {preset.fxBlur && (
              <FxBlur
                designW={baseW}
                designH={baseH}
                intensity={preset.fxBlurIntensity || 0.5}
              />
            )}
            {preset.fxFade && (
              <FxFade
                designW={baseW}
                designH={baseH}
                intensity={preset.fxFadeIntensity || 0.5}
              />
            )}

            {/* Static versions of previously animated effects */}
            {preset.fxStars && (
              <FxStarsStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxStarsIntensity || 0.5}
              />
            )}
            {preset.fxParticles && (
              <FxParticlesStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxParticlesIntensity || 0.5}
              />
            )}
            {preset.fxWaves && (
              <FxWavesStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxWavesIntensity || 0.5}
              />
            )}
            {preset.fxShimmer && (
              <FxShimmerStatic
                designW={baseW}
                designH={baseH}
                intensity={0.5}
              />
            )}
            {preset.fxPulse && (
              <FxPulseStatic designW={baseW} designH={baseH} intensity={0.5} />
            )}
            {preset.fxRainbow && (
              <FxRainbowStatic
                designW={baseW}
                designH={baseH}
                intensity={0.5}
              />
            )}
            {preset.fxElectric && (
              <FxElectricStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxElectricIntensity || 0.5}
              />
            )}
            {preset.fxHologram && (
              <FxHologramStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxHologramIntensity || 0.5}
              />
            )}
            {preset.fxFire && (
              <FxFireStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxFireIntensity || 0.5}
              />
            )}
            {preset.fxIce && (
              <FxIceStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxIceIntensity || 0.5}
              />
            )}
            {preset.fxSmoke && (
              <FxSmokeStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxSmokeIntensity || 0.5}
              />
            )}
            {preset.fxMatrix && (
              <FxMatrixStatic
                designW={baseW}
                designH={baseH}
                intensity={preset.fxMatrixIntensity || 0.5}
              />
            )}
          </div>

          {/* Text Layer */}
          <div style={{ position: "absolute", inset: 0, zIndex: 4 }}>
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
                  typeof w.scale === "number" &&
                  isFinite(w.scale) &&
                  w.scale > 0
                    ? w.scale
                    : 1;
                const transform = `translate(-50%, -50%) rotate(${rotate}deg) scale(${scl})`;
                // Only apply fontSizeBump if the word doesn't have custom fontSizePx
                const hasCustomFontSize =
                  typeof (w as any)?.style?.fontSizePx === "number";
                const textStyle = mergeWordStyle(
                  buildPresetTextStyle(preset, baseH > baseW, baseW, baseH),
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

                      // Drag start debug

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
            {/* Default lyrics overlay: group active unplaced words into lines using layout preset */}
            {groupedUnplacedWords.length > 0 && (
              <LyricLayout
                preset={preset}
                layoutPreset={
                  LAYOUT_PRESETS[layoutPresetId] ||
                  LAYOUT_PRESETS[DEFAULT_LAYOUT_PRESET_ID]
                }
                width={baseW}
                height={baseH}
                gap={gap}
                lines={groupedUnplacedWords as any}
                currentTimeMs={currentTimeMs}
                onPointerDown={(gi: number) => {
                  setSelectedIndex(gi);
                  setDraggingIdx(gi);
                  setIsDragging(true);
                }}
                isPortrait={baseH > baseW}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
