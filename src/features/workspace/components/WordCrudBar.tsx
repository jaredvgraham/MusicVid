"use client";

import React from "react";
import { useEditor } from "../EditorContext";
import {
  addWord as addWordOp,
  duplicateWord as duplicateWordOp,
  deleteWord as deleteWordOp,
} from "../actions/wordCrud";

export function WordCrudBar(): React.ReactElement {
  const {
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    currentTimeMs,
  } = useEditor();

  const handleAdd = () => {
    setTranscript((prev) => {
      const { next, newSelectedIndex } = addWordOp(
        prev,
        currentTimeMs,
        selectedIndex
      );
      setSelectedIndex(newSelectedIndex);
      return next;
    });
  };

  const handleDuplicate = () => {
    if (selectedIndex == null) return;
    setTranscript((prev) => {
      const { next, newSelectedIndex } = duplicateWordOp(prev, selectedIndex);
      setSelectedIndex(newSelectedIndex);
      return next;
    });
  };

  const handleDelete = () => {
    if (selectedIndex == null) return;
    setTranscript((prev) => {
      const { next, newSelectedIndex } = deleteWordOp(prev, selectedIndex);
      setSelectedIndex(newSelectedIndex);
      return next;
    });
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
