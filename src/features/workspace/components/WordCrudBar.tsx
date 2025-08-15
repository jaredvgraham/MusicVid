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
  }, [selectedWordText]);

  const disabled = selectedIndex == null || selectedIndex < 0;

  const handleSaveText = async () => {
    if (selectedIndex == null) return;
    const next = updateWordTextOp(transcript, selectedIndex, editText);
    setTranscript(next);
    await saveTranscript(next);
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
    </div>
  );
}
