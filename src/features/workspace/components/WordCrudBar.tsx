"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useEditor } from "./EditorContext";
import {
  addWord as addWordOp,
  duplicateWord as duplicateWordOp,
  deleteWord as deleteWordOp,
  updateWordText as updateWordTextOp,
} from "../actions/wordCrud";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export function WordCrudBar(): React.ReactElement {
  const {
    project,
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    currentTimeMs,
  } = useEditor();
  const authFetch = useAuthFetch();
  const { saveTranscript } = useEditor();
  const [xPct, setXPct] = useState<string>("");
  const [yPct, setYPct] = useState<string>("");
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
      setXPct("");
      setYPct("");
      setFontSizePx("");
      setColor("");
      return;
    }
    let acc = 0;
    for (let li = 0; li < transcript.length; li++) {
      const words = transcript[li]?.words ?? [];
      if (selectedIndex < acc + words.length) {
        const w = words[selectedIndex - acc] as any;
        setXPct(typeof w?.xPct === "number" ? String(w.xPct) : "");
        setYPct(typeof w?.yPct === "number" ? String(w.yPct) : "");
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

  const handleSaveText = async () => {
    if (selectedIndex == null) return;
    const next = updateWordTextOp(transcript, selectedIndex, editText);
    setTranscript(next);
    await saveTranscript(next);
  };

  const handleSaveStyle = async () => {
    if (selectedIndex == null) return;
    const x =
      xPct.trim() === "" ? undefined : Math.max(0, Math.min(100, Number(xPct)));
    const y =
      yPct.trim() === "" ? undefined : Math.max(0, Math.min(100, Number(yPct)));
    const size =
      fontSizePx.trim() === "" ? undefined : Math.max(1, Number(fontSizePx));
    const col = color.trim() === "" ? undefined : color.trim();
    const next = structuredClone(transcript) as any[];
    let acc = 0;
    for (let li = 0; li < next.length; li++) {
      const words = Array.isArray(next[li]?.words) ? next[li].words : [];
      if (selectedIndex < acc + words.length) {
        const wi = selectedIndex - acc;
        const w = { ...(words[wi] || {}) };
        if (typeof x === "number") w.xPct = x;
        if (typeof y === "number") w.yPct = y;
        w.style = { ...(w.style || {}) };
        if (typeof size === "number") w.style.fontSizePx = size;
        if (typeof col === "string") w.style.color = col;
        words[wi] = w;
        next[li] = { ...next[li], words: [...words] };
        break;
      }
      acc += words.length;
    }
    setTranscript(next as any);
    await saveTranscript(next as any);
  };

  return (
    <div className="flex items-center justify-between w-full">
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
      <div className="ml-2 flex items-center gap-2">
        <input
          className="w-56 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
          type="text"
          placeholder="Edit selected word text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          disabled={disabled}
        />
        <button
          className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-40"
          onClick={handleSaveText}
          disabled={disabled}
        >
          Save Text
        </button>
      </div>
      <div className="ml-4 flex items-center gap-2">
        <input
          className="w-20 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
          type="number"
          placeholder="x%"
          value={xPct}
          onChange={(e) => setXPct(e.target.value)}
          disabled={disabled}
        />
        <input
          className="w-20 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
          type="number"
          placeholder="y%"
          value={yPct}
          onChange={(e) => setYPct(e.target.value)}
          disabled={disabled}
        />
        <input
          className="w-24 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
          type="number"
          placeholder="font px"
          value={fontSizePx}
          onChange={(e) => setFontSizePx(e.target.value)}
          disabled={disabled}
        />
        <input
          className="w-28 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white placeholder:text-white/40 disabled:opacity-50"
          type="text"
          placeholder="#ffffff"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={disabled}
        />
        <button
          className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-40"
          onClick={handleSaveStyle}
          disabled={disabled}
        >
          Save Style/Pos
        </button>
      </div>
    </div>
  );
}
