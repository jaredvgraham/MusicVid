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
import type { Line, Project, Word } from "@/types";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { deleteWord as deleteWordOp } from "../actions/wordCrud";

type EditorState = {
  project: Project;
  transcript: Line[];
  setTranscript: React.Dispatch<React.SetStateAction<Line[]>>;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  lyricPresetId: string;
  setLyricPresetId: React.Dispatch<React.SetStateAction<string>>;
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
  saveTranscript: (override?: Line[]) => Promise<void>;
  saveLyricPreset: (presetId: string) => Promise<void>;
  renderScale: number; // container width relative to 1080 base
  setRenderScale: (s: number) => void;
};

const Ctx = createContext<EditorState | null>(null);

export function EditorProvider({
  project,
  initialTranscript,
  children,
}: {
  project: Project;
  initialTranscript: Line[];
  children: React.ReactNode;
}) {
  const [transcript, setTranscript] = useState<Line[]>(() => initialTranscript);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentTimeMs, _setCurrentTimeMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(100); // zoom level
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const authFetch = useAuthFetch();
  const transcriptRef = useRef<Line[]>(initialTranscript);
  const [lyricPresetId, setLyricPresetId] = useState<string>(
    (project as any)?.lyricPresetId || "classic"
  );
  const [renderScale, setRenderScale] = useState<number>(1);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

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

  const saveTranscript = useCallback(
    async (override?: Line[]) => {
      try {
        const payload = override ?? transcriptRef.current;
        if (!project?.id) return;
        await authFetch(
          "next",
          `/api/workspace/${project.id}/edits/transcript`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript: payload }),
          }
        );
      } catch (e) {
        console.error("Failed to save transcript", e);
      }
    },
    [authFetch, project?.id]
  );

  const saveLyricPreset = useCallback(
    async (presetId: string) => {
      try {
        if (!project?.id) return;
        await authFetch(
          "next",
          `/api/workspace/${project.id}/edits/lyric-preset`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ presetId }),
          }
        );
      } catch (e) {
        console.error("Failed to save lyric preset", e);
      }
    },
    [authFetch, project?.id]
  );

  const value = useMemo<EditorState>(
    () => ({
      project,
      transcript,
      setTranscript,
      selectedIndex,
      setSelectedIndex,
      lyricPresetId,
      setLyricPresetId,
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
      saveTranscript,
      saveLyricPreset,
      renderScale,
      setRenderScale,
    }),
    [
      project,
      transcript,
      selectedIndex,
      lyricPresetId,
      currentTimeMs,
      playing,
      pixelsPerSecond,
      play,
      pause,
      togglePlay,
      saveTranscript,
      saveLyricPreset,
      renderScale,
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
