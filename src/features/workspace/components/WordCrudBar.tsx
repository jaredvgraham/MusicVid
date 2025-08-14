"use client";

import React from "react";
import { useEditor } from "./EditorContext";
import {
  addWord as addWordOp,
  duplicateWord as duplicateWordOp,
  deleteWord as deleteWordOp,
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

  const disabled =
    selectedIndex == null ||
    selectedIndex < 0 ||
    selectedIndex >= transcript.length;

  return (
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
  );
}
