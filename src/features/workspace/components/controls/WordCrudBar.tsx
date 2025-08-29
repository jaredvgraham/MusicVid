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
import { useEditor } from "../../state/EditorContext";
import {
  addWord as addWordOp,
  duplicateWord as duplicateWordOp,
  deleteWord as deleteWordOp,
  updateWordText as updateWordTextOp,
} from "../../actions/wordCrud";

export function WordCrudBar(): React.ReactElement {
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

  return (
    <div className="w-full bg-white/[0.02] p-1">
      <div className="flex items-center gap-4 w-full">
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

        <div className="flex items-center gap-2">
          <input
            className="w-56 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
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

        <label className="flex items-center gap-1">
          <span className="text-[11px] text-white/50">Font (px)</span>
          <input
            className="w-20 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
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

        <label className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-white/50">Color</span>
            <input
              className="w-24 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
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
            className="h-9 w-9 rounded border border-white/10 bg-transparent p-0"
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
