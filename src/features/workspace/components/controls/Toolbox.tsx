"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "../../state/EditorContext";
import { addWord as addWordOp } from "../../actions/wordCrud";
import {
  DEFAULT_LYRIC_PRESET_ID,
  LYRIC_PRESETS,
} from "../../styles/lyricPresets";
import {
  DEFAULT_LAYOUT_PRESET_ID,
  LAYOUT_PRESETS,
} from "../../styles/layoutPresets";

export function Toolbox(): React.ReactElement {
  const {
    transcript,
    setTranscript,
    setSelectedIndex,
    currentTimeMs,
    saveTranscript,
    project,
    lyricPresetId,
    setLyricPresetId,
    saveLyricPreset,
    layoutPresetId,
    setLayoutPresetId,
    saveLayoutPreset,
  } = useEditor();
  const [text, setText] = useState("");
  const [presetId, setPresetId] = useState<string>(
    lyricPresetId || DEFAULT_LYRIC_PRESET_ID
  );
  const [layoutPresetIdLocal, setLayoutPresetIdLocal] = useState<string>(
    layoutPresetId || DEFAULT_LAYOUT_PRESET_ID
  );
  const [customFontSize, setCustomFontSize] = useState<number | null>(null);
  const [customFontWeight, setCustomFontWeight] = useState<number | null>(null);

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
    return isPortrait ? 60 : 100;
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

  // Sync local state with context state
  useEffect(() => {
    setPresetId(lyricPresetId || DEFAULT_LYRIC_PRESET_ID);
  }, [lyricPresetId]);

  useEffect(() => {
    setLayoutPresetIdLocal(layoutPresetId || DEFAULT_LAYOUT_PRESET_ID);
  }, [layoutPresetId]);

  // Initialize custom font values with current transcript values
  useEffect(() => {
    setCustomFontSize(getCurrentFontSize());
    setCustomFontWeight(getCurrentFontWeight());
  }, [transcript, presetId, project]);

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

  return (
    <div className="rounded border border-white/10 bg-neutral-950/70 p-3 text-sm">
      <div className="font-medium text-white/80">Tools</div>
      <div className="mt-3 space-y-2">
        <div>
          <label className="mb-1 block text-white/60">Lyric style</label>
          <div className="flex gap-2">
            <select
              value={presetId}
              onChange={async (e) => {
                const chosen = e.target.value;
                setPresetId(chosen);
                setLyricPresetId(chosen);
                await saveLyricPreset(chosen);
              }}
              className="rounded bg-neutral-900 px-2 py-1 text-white outline-none"
            >
              {Object.values(LYRIC_PRESETS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-white/60">Lyric layout</label>
          <div className="flex gap-2">
            <select
              value={layoutPresetId}
              onChange={async (e) => {
                const chosen = e.target.value;
                setLayoutPresetIdLocal(chosen);
                setLayoutPresetId(chosen);
                await saveLayoutPreset(chosen);
              }}
              className="rounded bg-neutral-900 px-2 py-1 text-white outline-none"
            >
              {Object.values(LAYOUT_PRESETS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-white/60">Custom font size</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="12"
              max="200"
              className="flex-1 rounded bg-neutral-900 px-2 py-1 text-white outline-none"
              placeholder={`${getCurrentFontSize()}px`}
              value={customFontSize || ""}
              onChange={(e) => {
                const value = e.target.value;
                setCustomFontSize(value ? parseInt(value) : null);
              }}
            />
            <button
              onClick={applyCustomFontSize}
              className="rounded bg-blue-600 px-3 py-1.5 text-white"
            >
              Apply
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-white/60">Custom font weight</label>
          <div className="flex gap-2">
            <select
              value={customFontWeight || ""}
              onChange={(e) => {
                const value = e.target.value;
                setCustomFontWeight(value ? parseInt(value) : null);
              }}
              className="flex-1 rounded bg-neutral-900 px-2 py-1 text-white outline-none"
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
              className="rounded bg-blue-600 px-3 py-1.5 text-white"
            >
              Apply
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-white/60">Add text</label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded bg-neutral-900 px-2 py-1 outline-none"
              placeholder="Enter text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={addTextClip}
              className="rounded bg-emerald-600 px-3 py-1.5 text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
