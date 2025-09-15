"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "../../state/EditorContext";
import { addWord as addWordOp } from "../../actions/wordCrud";
import {
  DEFAULT_LYRIC_PRESET_ID,
  LYRIC_PRESETS,
} from "../../styles/lyricPresets";
import EffectCustomizer from "./EffectCustomizer";
import { PresetSelector } from "./PresetSelector";
import {
  DEFAULT_LAYOUT_PRESET_ID,
  LAYOUT_PRESETS,
} from "../../styles/layoutPresets";

export function Toolbox(): React.ReactElement {
  const {
    transcript,
    setTranscript,
    setSelectedIndex,
    selectedIndex,
    currentTimeMs,
    saveTranscript,
    project,
    currentPreset,
    setCurrentPreset,
    savePreset,
    layoutPresetId,
    setLayoutPresetId,
    saveLayoutPreset,
  } = useEditor();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshLimitReached, setRefreshLimitReached] =
    useState<boolean>(false);
  const MAX_REFRESHES = 3;
  const initialUsed = Math.max(
    0,
    Math.min(
      MAX_REFRESHES,
      Number(((project as any)?.transcriptRefreshes as number | undefined) ?? 0)
    )
  );
  const [refreshesUsed, setRefreshesUsed] = useState<number>(initialUsed);
  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);

  useEffect(() => {
    const used = Math.max(
      0,
      Math.min(
        MAX_REFRESHES,
        Number(
          ((project as any)?.transcriptRefreshes as number | undefined) ?? 0
        )
      )
    );
    setRefreshesUsed(used);
  }, [project]);
  const [text, setText] = useState("");
  const [presetId, setPresetId] = useState<string>(
    currentPreset?.id || DEFAULT_LYRIC_PRESET_ID
  );
  const [layoutPresetIdLocal, setLayoutPresetIdLocal] = useState<string>(
    layoutPresetId || DEFAULT_LAYOUT_PRESET_ID
  );
  const [customFontSize, setCustomFontSize] = useState<number | null>(null);
  const [customFontWeight, setCustomFontWeight] = useState<number | null>(null);
  const [customFontColor, setCustomFontColor] = useState<string | null>(null);

  // Determine if video is portrait mode
  const isPortrait = (project as any)?.height > (project as any)?.width;

  // Get current font size and weight from transcript (find most common values)
  const getCurrentFontSize = (): number => {
    const sizeCounts = new Map<number, number>();

    // Count occurrences of each font size
    for (const line of transcript) {
      for (const word of line.words) {
        if ((word as any)?.style?.fontSizePx) {
          const size = (word as any).style.fontSizePx;
          sizeCounts.set(size, (sizeCounts.get(size) || 0) + 1);
        }
      }
    }

    // Find the most common font size
    if (sizeCounts.size > 0) {
      let mostCommonSize = 0;
      let maxCount = 0;

      for (const [size, count] of sizeCounts) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonSize = size;
        }
      }

      return mostCommonSize;
    }

    // Return default based on orientation
    return isPortrait ? 50 : 80;
  };

  const getCurrentFontWeight = (): number => {
    const weightCounts = new Map<number, number>();

    // Count occurrences of each font weight
    for (const line of transcript) {
      for (const word of line.words) {
        if ((word as any)?.style?.fontWeight) {
          const weight = (word as any).style.fontWeight;
          if (typeof weight === "number") {
            weightCounts.set(weight, (weightCounts.get(weight) || 0) + 1);
          }
        }
      }
    }

    // Find the most common font weight
    if (weightCounts.size > 0) {
      let mostCommonWeight = 0;
      let maxCount = 0;

      for (const [weight, count] of weightCounts) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonWeight = weight;
        }
      }

      return mostCommonWeight;
    }

    // Return preset default
    const presetWeight = LYRIC_PRESETS[presetId]?.fontWeight;
    return typeof presetWeight === "number" ? presetWeight : 700;
  };

  const getCurrentFontColor = (): string => {
    const colorCounts = new Map<string, number>();

    // Count occurrences of each font color
    for (const line of transcript) {
      for (const word of line.words) {
        if ((word as any)?.style?.color) {
          const color = (word as any).style.color;
          if (typeof color === "string") {
            colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
          }
        }
      }
    }

    // Find the most common font color
    if (colorCounts.size > 0) {
      let mostCommonColor = "";
      let maxCount = 0;

      for (const [color, count] of colorCounts) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonColor = color;
        }
      }

      return mostCommonColor;
    }

    // Return preset default
    const presetColor = LYRIC_PRESETS[presetId]?.color;
    return typeof presetColor === "string" ? presetColor : "#ffffff";
  };

  const getCustomColorCount = (): number => {
    let count = 0;
    for (const line of transcript) {
      for (const word of line.words) {
        if ((word as any)?.style?.color) {
          count++;
        }
      }
    }
    return count;
  };

  // Sync local state with context state
  useEffect(() => {
    setPresetId(currentPreset?.id || DEFAULT_LYRIC_PRESET_ID);
  }, [currentPreset]);

  useEffect(() => {
    setLayoutPresetIdLocal(layoutPresetId || DEFAULT_LAYOUT_PRESET_ID);
  }, [layoutPresetId]);

  // Initialize custom font values with current transcript values
  useEffect(() => {
    setCustomFontSize(getCurrentFontSize());
    setCustomFontWeight(getCurrentFontWeight());
    setCustomFontColor(getCurrentFontColor());
  }, [transcript, presetId, project]);

  async function refreshTranscriptFromServer() {
    const base = process.env.NEXT_PUBLIC_EXPRESS_URL || "";
    const id = (project as any)?.id as string | undefined;
    if (!base) {
      setRefreshError("Missing NEXT_PUBLIC_EXPRESS_URL env.");
      return;
    }
    if (!id) {
      setRefreshError("Missing project id.");
      return;
    }
    const url = `${base.replace(/\/+$/, "")}/render/transcript`;
    try {
      setRefreshing(true);
      setRefreshError(null);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = await res
        .json()
        .catch(async () => ({ error: await res.text().catch(() => "") }));
      if (!res.ok) {
        const msg = payload?.error || `Failed: ${res.status}`;
        throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
      const next = (payload?.transcript ?? null) as any;
      if (!Array.isArray(next)) {
        throw new Error("Server did not return a transcript array.");
      }
      // Transcript refreshed
      setTranscript(next);
      // Optimistically count this refresh locally
      setRefreshesUsed((u) => Math.min(MAX_REFRESHES, u + 1));
      // Success toast
      setRefreshSuccess("Transcript refreshed successfully");
      setTimeout(() => setRefreshSuccess(null), 2000);
    } catch (e: any) {
      const msg = e?.message || "Failed to refresh transcript";
      setRefreshError(msg);
      if (String(msg).toLowerCase().includes("too many")) {
        setRefreshLimitReached(true);
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function addTextClip() {
    // Insert a word at current playhead time
    const start = Math.max(0, Math.floor(currentTimeMs));
    const end = start + 1500; // 1.5s default duration
    const { next, newSelectedIndex } = addWordOp(
      transcript,
      start,
      null,
      text || "New Text"
    );
    setTranscript(next);
    setSelectedIndex(newSelectedIndex);
    await saveTranscript(next);
    setText("");
  }

  async function applyCustomFontSize() {
    if (customFontSize === null) return;

    // Apply custom font size to all words in the transcript
    const updatedTranscript = transcript.map((line) => ({
      ...line,
      words: line.words.map((word) => ({
        ...word,
        style: {
          ...word.style,
          fontSizePx: customFontSize,
        },
      })),
    }));

    setTranscript(updatedTranscript);
    await saveTranscript(updatedTranscript);
  }

  async function applyCustomFontWeight() {
    if (customFontWeight === null) return;

    // Apply custom font weight to all words in the transcript
    const updatedTranscript = transcript.map((line) => ({
      ...line,
      words: line.words.map((word) => ({
        ...word,
        style: {
          ...word.style,
          fontWeight: customFontWeight,
        },
      })),
    }));

    setTranscript(updatedTranscript);
    await saveTranscript(updatedTranscript);
  }

  async function applyCustomFontColor() {
    if (customFontColor === null) return;

    // Apply custom font color to all words in the transcript
    const updatedTranscript = transcript.map((line) => ({
      ...line,
      words: line.words.map((word) => ({
        ...word,
        style: {
          ...word.style,
          color: customFontColor,
        },
      })),
    }));

    setTranscript(updatedTranscript);
    await saveTranscript(updatedTranscript);
  }

  async function clearAllCustomColors() {
    // Remove all custom colors from all words to use preset defaults
    const updatedTranscript = transcript.map((line) => ({
      ...line,
      words: line.words.map((word) => ({
        ...word,
        style: {
          ...word.style,
          color: undefined, // Remove custom color to use preset
        },
      })),
    }));

    setTranscript(updatedTranscript);
    await saveTranscript(updatedTranscript);
    setCustomFontColor(null);
  }

  async function applyColorToSelectedWords() {
    if (customFontColor === null || selectedIndex === null) return;

    // Convert global selectedIndex to line and word indices
    let acc = 0;
    for (let li = 0; li < transcript.length; li++) {
      const words = transcript[li]?.words ?? [];
      if (selectedIndex < acc + words.length) {
        // Found the selected word
        const updatedTranscript = transcript.map((line, lineIndex) => ({
          ...line,
          words: line.words.map((word, wordIndex) => {
            if (lineIndex === li && wordIndex === selectedIndex - acc) {
              return {
                ...word,
                style: {
                  ...word.style,
                  color: customFontColor,
                },
              };
            }
            return word;
          }),
        }));

        setTranscript(updatedTranscript);
        await saveTranscript(updatedTranscript);
        break;
      }
      acc += words.length;
    }
  }

  async function applyColorToTimeRange() {
    if (customFontColor === null) return;

    // Apply color to words that are currently visible (within a time window)
    const timeWindow = 5000; // 5 seconds
    const updatedTranscript = transcript.map((line) => ({
      ...line,
      words: line.words.map((word) => {
        // Check if word is currently visible or will be visible soon
        const wordStart = word.start;
        const wordEnd = word.end;
        const isVisible =
          wordStart <= currentTimeMs + timeWindow &&
          wordEnd >= currentTimeMs - timeWindow;

        if (isVisible) {
          return {
            ...word,
            style: {
              ...word.style,
              color: customFontColor,
            },
          };
        }
        return word;
      }),
    }));

    setTranscript(updatedTranscript);
    await saveTranscript(updatedTranscript);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-neutral-950/80 backdrop-blur-sm p-4 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Editor Tools</h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-white/60">Auto-save enabled</span>
        </div>
      </div>

      {/* Status Messages */}
      {refreshSuccess && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-200 text-sm">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {refreshSuccess}
          </div>
        </div>
      )}

      {refreshError && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          <div className="flex items-start gap-2">
            <svg
              className="h-4 w-4 text-red-300 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.66 1.73-2.5L13.73 5.5c-.77-.83-1.96-.83-2.73 0L3.2 16.5c-.77.84.19 2.5 1.73 2.5z"
              />
            </svg>
            <div className="flex-1">
              <div className="font-medium text-red-200">{refreshError}</div>
              {refreshLimitReached && (
                <div className="mt-1 text-red-300/90 text-xs">
                  {`  You can refresh a project's transcript up to 3 times.`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Transcript Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white/90">Transcript</h4>
            <span className="text-xs text-white/50">
              {Math.max(0, MAX_REFRESHES - refreshesUsed)} refreshes left
            </span>
          </div>
          <button
            onClick={refreshTranscriptFromServer}
            disabled={
              refreshing ||
              refreshLimitReached ||
              MAX_REFRESHES - refreshesUsed <= 0
            }
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {refreshing ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : refreshLimitReached || MAX_REFRESHES - refreshesUsed <= 0 ? (
              "Refresh limit reached"
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh transcript
              </>
            )}
          </button>
        </div>

        {/* Style Presets */}
        <div className="space-y-3">
          {/* Effect Customization */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/90">
              Visual Effects
            </h4>
            <EffectCustomizer />
          </div>
          <h4 className="text-sm font-medium text-white/90">Style & Layout</h4>
          <div>
            <label className="block text-xs text-white/60 mb-2">
              Lyric Layout
            </label>
            <select
              value={layoutPresetId}
              onChange={async (e) => {
                const chosen = e.target.value;
                setLayoutPresetIdLocal(chosen);
                setLayoutPresetId(chosen);
                await saveLayoutPreset(chosen);
              }}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30 transition-colors"
            >
              {Object.values(LAYOUT_PRESETS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs text-white/60 mb-2">
                Lyric Style
              </label>
              <PresetSelector
                selectedPresetId={presetId}
                onPresetChange={async (chosen) => {
                  setPresetId(chosen);
                  const preset = LYRIC_PRESETS[chosen];
                  if (preset) {
                    setCurrentPreset(preset);
                    await savePreset(preset);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Typography Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/90">Typography</h4>
          <div className="grid grid-cols-1 gap-3">
            {/* Font Size */}
            <div>
              <label className="block text-xs text-white/60 mb-2">
                Font Size
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="12"
                  max="200"
                  className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none placeholder:text-white/40 focus:border-white/30 transition-colors"
                  placeholder={`${getCurrentFontSize()}px`}
                  value={customFontSize || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomFontSize(value ? parseInt(value) : null);
                  }}
                />
                <button
                  onClick={applyCustomFontSize}
                  className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-xs text-white/60 mb-2">
                Font Weight
              </label>
              <div className="flex gap-2">
                <select
                  value={customFontWeight || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomFontWeight(value ? parseInt(value) : null);
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/30 transition-colors"
                >
                  <option value="">Default ({getCurrentFontWeight()})</option>
                  <option value="100">Thin (100)</option>
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi-bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra-bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
                <button
                  onClick={applyCustomFontWeight}
                  className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white/90">Colors</h4>
            <div className="flex items-center gap-2">
              {getCustomColorCount() > 0 && (
                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 font-medium">
                  {getCustomColorCount()} custom
                </span>
              )}
              {selectedIndex !== null && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                  Word selected
                </span>
              )}
            </div>
          </div>

          {/* Quick Color Palette */}
          <div>
            <label className="block text-xs text-white/60 mb-2">
              Quick Colors
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                "#ffffff",
                "#ff6b6b",
                "#4ecdc4",
                "#45b7d1",
                "#96ceb4",
                "#feca57",
                "#ff9ff3",
                "#54a0ff",
                "#5f27cd",
                "#00d2d3",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setCustomFontColor(color);
                    const updatedTranscript = transcript.map((line) => ({
                      ...line,
                      words: line.words.map((word) => ({
                        ...word,
                        style: { ...word.style, color: color },
                      })),
                    }));
                    setTranscript(updatedTranscript);
                    saveTranscript(updatedTranscript);
                  }}
                  className={`group relative h-10 w-full rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    customFontColor === color
                      ? "border-white/50 shadow-lg shadow-white/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
                  {customFontColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div>
            <label className="block text-xs text-white/60 mb-2">
              Custom Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-10 w-16 rounded-lg border border-white/10 bg-black/40 cursor-pointer hover:border-white/20 transition-colors"
                value={customFontColor || getCurrentFontColor()}
                onChange={(e) => setCustomFontColor(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 h-10 rounded-lg border border-white/10 bg-black/40 px-3 text-white outline-none font-mono text-sm placeholder:text-white/40 focus:border-white/30 transition-colors"
                placeholder="#ffffff"
                value={customFontColor || ""}
                onChange={(e) => setCustomFontColor(e.target.value)}
              />
            </div>
          </div>

          {/* Color Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={applyCustomFontColor}
              className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Apply to All
            </button>
            {selectedIndex !== null ? (
              <button
                onClick={applyColorToSelectedWords}
                className="px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors text-sm font-medium"
              >
                Apply to Selected
              </button>
            ) : (
              <button
                onClick={applyColorToTimeRange}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Apply to Current
              </button>
            )}
          </div>

          {/* Reset Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCustomFontColor(null);
                const updatedTranscript = transcript.map((line) => ({
                  ...line,
                  words: line.words.map((word) => ({
                    ...word,
                    style: { ...word.style, color: undefined },
                  })),
                }));
                setTranscript(updatedTranscript);
                saveTranscript(updatedTranscript);
              }}
              className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Reset to Preset
            </button>
            <button
              onClick={clearAllCustomColors}
              className="px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
