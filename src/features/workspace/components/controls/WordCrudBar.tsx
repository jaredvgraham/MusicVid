"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Utility functions for time conversion
function msToSeconds(ms: number): number {
  return Math.round(ms) / 1000;
}

function secondsToMs(seconds: number): number {
  return Math.round(seconds * 1000);
}
import { useEditor } from "../../state/EditorContext";
import {
  addWord as addWordOp,
  duplicateWord as duplicateWordOp,
  deleteWord as deleteWordOp,
  updateWordText as updateWordTextOp,
} from "../../actions/wordCrud";

// Shared hook for common functionality
function useWordCrudLogic() {
  const {
    project,
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    currentTimeMs,
  } = useEditor();
  const { saveTranscript } = useEditor();
  const [fontSizePx, setFontSizePx] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [startTimeSeconds, setStartTimeSeconds] = useState<string>("");
  const [endTimeSeconds, setEndTimeSeconds] = useState<string>("");

  const handleAdd = async () => {
    const { next, newSelectedIndex } = addWordOp(
      transcript,
      currentTimeMs,
      selectedIndex
    );
    setTranscript(next);
    setSelectedIndex(newSelectedIndex);
    await saveTranscript(next);
  };

  const handleDuplicate = async () => {
    if (selectedIndex == null) return;
    const { next, newSelectedIndex } = duplicateWordOp(
      transcript,
      selectedIndex
    );
    setTranscript(next);
    setSelectedIndex(newSelectedIndex);
    await saveTranscript(next);
  };

  const handleDelete = async () => {
    if (selectedIndex == null) return;
    const { next, newSelectedIndex } = deleteWordOp(transcript, selectedIndex);
    setTranscript(next);
    setSelectedIndex(newSelectedIndex);
    await saveTranscript(next);
  };

  // Current selected word text for editing
  const selectedWordText = useMemo(() => {
    if (selectedIndex == null || selectedIndex < 0) return "";
    let acc = 0;
    for (let li = 0; li < transcript.length; li++) {
      const words = transcript[li]?.words ?? [];
      if (selectedIndex < acc + words.length)
        return words[selectedIndex - acc]?.text ?? "";
      acc += words.length;
    }
    return "";
  }, [selectedIndex, transcript]);

  const [editText, setEditText] = useState<string>("");
  useEffect(() => {
    setEditText(selectedWordText);
    if (selectedIndex == null || selectedIndex < 0) {
      setFontSizePx("");
      setColor("");
      setStartTimeSeconds("");
      setEndTimeSeconds("");
      return;
    }
    let acc = 0;
    for (let li = 0; li < transcript.length; li++) {
      const words = transcript[li]?.words ?? [];
      if (selectedIndex < acc + words.length) {
        const w = words[selectedIndex - acc] as any;
        setFontSizePx(
          typeof w?.style?.fontSizePx === "number"
            ? String(w.style.fontSizePx)
            : ""
        );
        setColor(typeof w?.style?.color === "string" ? w.style.color : "");
        setStartTimeSeconds(msToSeconds(w.start).toFixed(2));
        setEndTimeSeconds(msToSeconds(w.end).toFixed(2));
        break;
      }
      acc += words.length;
    }
  }, [selectedWordText, selectedIndex, transcript]);

  const disabled = selectedIndex == null || selectedIndex < 0;

  // Debounced auto-save text changes
  const debouncedSaveText = useCallback(
    debounce(async (newText: string) => {
      if (selectedIndex == null) return;
      const next = updateWordTextOp(transcript, selectedIndex, newText);
      setTranscript(next);
      await saveTranscript(next);
    }, 500),
    [selectedIndex, transcript, saveTranscript]
  );

  // Auto-save text changes
  const handleTextChange = async (newText: string) => {
    debouncedSaveText(newText);
  };

  // Auto-save style changes
  const handleStyleChange = async (
    field: "fontSizePx" | "color",
    value: string
  ) => {
    if (selectedIndex == null) return;
    const numValue = parseFloat(value);
    if (isNaN(numValue) && field !== "color") return;

    let acc = 0;
    for (let li = 0; li < transcript.length; li++) {
      const words = transcript[li]?.words ?? [];
      if (selectedIndex < acc + words.length) {
        const w = words[selectedIndex - acc];
        const updatedWord = { ...w };
        if (field === "color") {
          updatedWord.style = { ...updatedWord.style, color: value };
        } else if (field === "fontSizePx") {
          updatedWord.style = { ...updatedWord.style, fontSizePx: numValue };
        }

        const nextWords = [...words];
        nextWords[selectedIndex - acc] = updatedWord;
        const nextLines = [...transcript];
        nextLines[li] = { ...nextLines[li], words: nextWords };
        setTranscript(nextLines);
        await saveTranscript(nextLines);
        break;
      }
      acc += words.length;
    }
  };

  // Handle timestamp updates with debouncing
  const debouncedTimestampSave = useCallback(
    debounce(async (field: "start" | "end", value: string) => {
      if (selectedIndex == null) return;

      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) return;

      const newMs = secondsToMs(numValue);
      const minDuration = 100; // Minimum 100ms duration

      let acc = 0;
      for (let li = 0; li < transcript.length; li++) {
        const words = transcript[li]?.words ?? [];
        if (selectedIndex < acc + words.length) {
          const w = words[selectedIndex - acc];
          const updatedWord = { ...w };

          if (field === "start") {
            // Ensure start doesn't go beyond end and maintains minimum duration
            const maxStart = Math.max(0, w.end - minDuration);
            updatedWord.start = Math.min(newMs, maxStart);
          } else if (field === "end") {
            // Ensure end doesn't go before start and maintains minimum duration
            const minEnd = w.start + minDuration;
            updatedWord.end = Math.max(newMs, minEnd);
          }

          const nextWords = [...words];
          nextWords[selectedIndex - acc] = updatedWord;
          const nextLines = [...transcript];
          nextLines[li] = { ...nextLines[li], words: nextWords };
          setTranscript(nextLines);
          await saveTranscript(nextLines);
          break;
        }
        acc += words.length;
      }
    }, 500),
    [selectedIndex, transcript, saveTranscript]
  );

  const handleTimestampChange = (field: "start" | "end", value: string) => {
    // Update local state immediately for responsive UI
    if (field === "start") {
      setStartTimeSeconds(value);
    } else {
      setEndTimeSeconds(value);
    }

    // Debounce the actual save operation
    debouncedTimestampSave(field, value);
  };

  return {
    handleAdd,
    handleDuplicate,
    handleDelete,
    editText,
    setEditText,
    handleTextChange,
    fontSizePx,
    setFontSizePx,
    color,
    setColor,
    startTimeSeconds,
    endTimeSeconds,
    handleStyleChange,
    handleTimestampChange,
    disabled,
    selectedIndex,
  };
}

// Mobile-optimized component
function MobileWordCrudBar(): React.ReactElement {
  const {
    handleAdd,
    handleDuplicate,
    handleDelete,
    editText,
    setEditText,
    handleTextChange,
    fontSizePx,
    setFontSizePx,
    color,
    setColor,
    startTimeSeconds,
    endTimeSeconds,
    handleStyleChange,
    handleTimestampChange,
    disabled,
    selectedIndex,
  } = useWordCrudLogic();

  return (
    <div className="w-full bg-white/[0.02] p-2 md:hidden">
      <div className="flex flex-col gap-3 w-full">
        {/* Action buttons row */}
        <div className="flex items-center gap-2 justify-center">
          <button
            className="rounded border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 text-sm min-h-[40px]"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="rounded border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 disabled:opacity-40 text-sm min-h-[40px]"
            onClick={handleDuplicate}
            disabled={disabled}
          >
            Duplicate
          </button>
          <button
            className="rounded border border-red-500/20 bg-red-500/10 px-3 py-2 hover:bg-red-500/20 disabled:opacity-40 text-sm min-h-[40px]"
            onClick={handleDelete}
            disabled={disabled}
          >
            Delete
          </button>
        </div>

        {/* Text input row */}
        <div className="w-full">
          <input
            className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 disabled:opacity-50 min-h-[40px]"
            type="text"
            placeholder="Edit selected word text"
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
              handleTextChange(e.target.value);
            }}
            disabled={disabled}
          />
        </div>

        {/* Style controls row - Font size and Color on same line */}
        <div className="flex items-center gap-2">
          {/* Font size */}
          <label className="flex items-center gap-1 flex-1">
            <span className="text-[11px] text-white/50 whitespace-nowrap">
              Font (px)
            </span>
            <input
              className="w-full rounded border border-white/10 bg-black/40 px-2 py-2 text-sm text-white placeholder:text-white/40 disabled:opacity-50 min-h-[40px]"
              type="number"
              placeholder="font px"
              value={fontSizePx}
              onChange={(e) => {
                setFontSizePx(e.target.value);
                handleStyleChange("fontSizePx", e.target.value);
              }}
              disabled={disabled}
            />
          </label>

          {/* Color controls */}
          <label className="flex items-center gap-1 flex-1">
            <span className="text-[11px] text-white/50 whitespace-nowrap">
              Color
            </span>
            <input
              className="flex-1 rounded border border-white/10 bg-black/40 px-2 py-2 text-sm text-white placeholder:text-white/40 disabled:opacity-50 min-h-[40px]"
              type="text"
              placeholder="#ffffff"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                handleStyleChange("color", e.target.value);
              }}
              disabled={disabled}
            />
            <input
              className="h-10 w-10 rounded border border-white/10 bg-transparent p-0 flex-shrink-0"
              type="color"
              value={
                color && /^#([0-9a-fA-F]{3}){1,2}$/.test(color)
                  ? color
                  : "#ffffff"
              }
              onChange={(e) => {
                setColor(e.target.value);
                handleStyleChange("color", e.target.value);
              }}
              disabled={disabled}
            />
          </label>
        </div>

        {/* Timestamp controls row - Start and End on same line */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 flex-1">
            <span className="text-[11px] text-white/50 whitespace-nowrap">
              Start (s)
            </span>
            <input
              key={`start-${selectedIndex}`}
              className="w-full rounded border border-white/10 bg-black/40 px-2 py-2 text-sm text-white placeholder:text-white/40 disabled:opacity-50 min-h-[40px]"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={startTimeSeconds}
              onChange={(e) => handleTimestampChange("start", e.target.value)}
              disabled={disabled}
            />
          </label>
          <label className="flex items-center gap-1 flex-1">
            <span className="text-[11px] text-white/50 whitespace-nowrap">
              End (s)
            </span>
            <input
              key={`end-${selectedIndex}`}
              className="w-full rounded border border-white/10 bg-black/40 px-2 py-2 text-sm text-white placeholder:text-white/40 disabled:opacity-50 min-h-[40px]"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={endTimeSeconds}
              onChange={(e) => handleTimestampChange("end", e.target.value)}
              disabled={disabled}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

// Desktop-optimized component (original layout)
function DesktopWordCrudBar(): React.ReactElement {
  const {
    handleAdd,
    handleDuplicate,
    handleDelete,
    editText,
    setEditText,
    handleTextChange,
    fontSizePx,
    setFontSizePx,
    color,
    setColor,
    startTimeSeconds,
    endTimeSeconds,
    handleStyleChange,
    handleTimestampChange,
    disabled,
    selectedIndex,
  } = useWordCrudLogic();

  return (
    <div className="w-full bg-white/[0.02] p-1 hidden md:block">
      <div className="flex flex-row flex-wrap items-center gap-2 lg:gap-4 w-full">
        <div className="flex items-center gap-2">
          <button
            className="rounded border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="rounded border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10 disabled:opacity-40"
            onClick={handleDuplicate}
            disabled={disabled}
          >
            Duplicate
          </button>
          <button
            className="rounded border border-red-500/20 bg-red-500/10 px-2 py-1 hover:bg-red-500/20 disabled:opacity-40"
            onClick={handleDelete}
            disabled={disabled}
          >
            Delete
          </button>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <input
            className="w-full min-w-32 max-w-56 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
            type="text"
            placeholder="Edit selected word text"
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
              handleTextChange(e.target.value);
            }}
            disabled={disabled}
          />
        </div>

        <label className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[11px] text-white/50 whitespace-nowrap">
            Font (px)
          </span>
          <input
            className="w-16 lg:w-20 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
            type="number"
            placeholder="font px"
            value={fontSizePx}
            onChange={(e) => {
              setFontSizePx(e.target.value);
              handleStyleChange("fontSizePx", e.target.value);
            }}
            disabled={disabled}
          />
        </label>

        <label className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-white/50 whitespace-nowrap">
              Color
            </span>
            <input
              className="w-20 lg:w-24 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
              type="text"
              placeholder="#ffffff"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                handleStyleChange("color", e.target.value);
              }}
              disabled={disabled}
            />
          </div>
          <input
            className="h-8 w-8 lg:h-9 lg:w-9 rounded border border-white/10 bg-transparent p-0"
            type="color"
            value={
              color && /^#([0-9a-fA-F]{3}){1,2}$/.test(color)
                ? color
                : "#ffffff"
            }
            onChange={(e) => {
              setColor(e.target.value);
              handleStyleChange("color", e.target.value);
            }}
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  );
}

// Main component that conditionally renders based on screen size
export function WordCrudBar(): React.ReactElement {
  return (
    <>
      <MobileWordCrudBar />
      <DesktopWordCrudBar />
    </>
  );
}
