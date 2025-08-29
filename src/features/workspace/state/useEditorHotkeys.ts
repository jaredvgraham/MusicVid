"use client";
import { Word } from "@/types";
import { useEffect } from "react";
import { useEditor } from "./EditorContext";
import { deleteWord as deleteWordOp } from "../actions/wordCrud";

export function useEditorHotkeys() {
  const {
    playing,
    togglePlay,
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    saveTranscript,
  } = useEditor();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Do not handle hotkeys while typing in inputs/textareas/contenteditable
      const target =
        (e.target as HTMLElement) ||
        (document.activeElement as HTMLElement | null);
      const tag = target?.tagName?.toLowerCase();
      const isTyping = !!(
        target &&
        (tag === "input" ||
          tag === "textarea" ||
          target.isContentEditable ||
          target.getAttribute("role") === "textbox")
      );
      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;

      // Space toggles play/pause
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
        return;
      }

      // Nudge selected word with arrows
      const idx = selectedIndex;
      if (idx == null) return;
      const fine = e.shiftKey ? 200 : 50; // ms
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        e.preventDefault();
        const delta = e.code === "ArrowLeft" ? -fine : fine;
        setTranscript((prev) => {
          // Map global word index to (lineIndex, wordIndex)
          let acc = 0;
          let foundLine = -1;
          let foundWord = -1;
          for (let li = 0; li < prev.length; li++) {
            const count = prev[li]?.words?.length ?? 0;
            if (idx < acc + count) {
              foundLine = li;
              foundWord = idx - acc;
              break;
            }
            acc += count;
          }
          if (foundLine < 0 || foundWord < 0) return prev;

          const line = prev[foundLine];
          const words = line.words ?? [];
          const current = words[foundWord];
          if (!current) return prev;

          const duration = Math.max(50, current.end - current.start);
          const moved: Word = {
            ...current,
            start: Math.max(0, current.start + delta),
          };
          moved.end = Math.max(moved.start + 50, moved.start + duration);

          const newWords = [...words];
          newWords[foundWord] = moved;
          const newStart = newWords.length
            ? Math.min(...newWords.map((w) => w.start))
            : line.start;
          const newEnd = newWords.length
            ? Math.max(...newWords.map((w) => w.end))
            : line.end;

          const next = [...prev];
          next[foundLine] = {
            ...line,
            start: newStart,
            end: newEnd,
            words: newWords,
          };
          return next;
        });
        return;
      }

      // Delete selected word
      if (e.code === "Delete" || e.code === "Backspace") {
        e.preventDefault();
        const { next, newSelectedIndex } = deleteWordOp(transcript, idx);
        setTranscript(next);
        setSelectedIndex(newSelectedIndex);
        saveTranscript(next);
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    playing,
    togglePlay,
    transcript,
    setTranscript,
    selectedIndex,
    setSelectedIndex,
    saveTranscript,
  ]);
}
