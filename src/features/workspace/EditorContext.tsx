"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import type { Project, Word } from "@/types";

type EditorState = {
  project: Project;
  transcript: Word[];
  setTranscript: React.Dispatch<React.SetStateAction<Word[]>>;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  currentTimeMs: number;
  setCurrentTimeMs: (ms: number) => void; // internal playhead update (no seek)
  seekToMs: (ms: number) => void; // user-initiated seek
  playing: boolean;
  setPlaying: (p: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  pixelsPerSecond: number;
  setPixelsPerSecond: (pps: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

const Ctx = createContext<EditorState | null>(null);

export function EditorProvider({
  project,
  initialTranscript,
  children,
}: {
  project: Project;
  initialTranscript: Word[];
  children: React.ReactNode;
}) {
  const [transcript, setTranscript] = useState<Word[]>(initialTranscript);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentTimeMs, _setCurrentTimeMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(100); // zoom level
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setCurrentTimeMs = useCallback((ms: number) => {
    _setCurrentTimeMs(ms);
  }, []);

  const seekToMs = useCallback((ms: number) => {
    _setCurrentTimeMs(ms);
    const v = videoRef.current;
    if (v) {
      v.currentTime = ms / 1000;
    }
  }, []);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  const value = useMemo<EditorState>(
    () => ({
      project,
      transcript,
      setTranscript,
      selectedIndex,
      setSelectedIndex,
      currentTimeMs,
      setCurrentTimeMs,
      seekToMs,
      playing,
      setPlaying,
      play,
      pause,
      togglePlay,
      pixelsPerSecond,
      setPixelsPerSecond,
      videoRef,
    }),
    [
      project,
      transcript,
      selectedIndex,
      currentTimeMs,
      playing,
      pixelsPerSecond,
      play,
      pause,
      togglePlay,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const centis = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${centis}`;
}

// Global keyboard controls (MVP): play/pause, nudge selection, delete
export function useEditorHotkeys() {
  const { playing, togglePlay, setTranscript, selectedIndex } = useEditor();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
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
          const next = [...prev];
          const w = { ...next[idx] };
          if (!w) return prev;
          const dur = Math.max(50, w.end - w.start);
          w.start = Math.max(0, w.start + delta);
          w.end = Math.max(w.start + 50, w.start + dur);
          next[idx] = w;
          return next;
        });
        return;
      }

      // Delete selected word
      if (e.code === "Delete" || e.code === "Backspace") {
        e.preventDefault();
        setTranscript((prev) => prev.filter((_, i) => i !== idx));
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, togglePlay, setTranscript, selectedIndex]);
}
