"use client";

import React, { useState } from "react";
import { useEditor } from "./EditorContext";
import { addWord as addWordOp } from "./actions/wordCrud";

export function Toolbox(): React.ReactElement {
  const { setTranscript, setSelectedIndex, currentTimeMs } = useEditor();
  const [text, setText] = useState("");

  function addTextClip() {
    // Insert a word at current playhead time
    const start = Math.max(0, Math.floor(currentTimeMs));
    const end = start + 1500; // 1.5s default duration
    setTranscript((prev) => {
      const { next, newSelectedIndex } = addWordOp(
        prev,
        start,
        null,
        text || "New Text"
      );
      setSelectedIndex(newSelectedIndex);
      return next;
    });
    setText("");
  }

  return (
    <div className="rounded border border-white/10 bg-neutral-950/70 p-3 text-sm">
      <div className="font-medium text-white/80">Tools</div>
      <div className="mt-3 space-y-2">
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
