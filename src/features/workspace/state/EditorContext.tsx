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
import type { Line, Project } from "@/types";
import type { EditorContextValue } from "../types";
import { useAuthFetch } from "@/hooks/useAuthFetch";

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({
  project,
  initialTranscript,
  children,
}: {
  project: Project;
  initialTranscript: Line[];
  children: React.ReactNode;
}) {
  // State
  const [transcript, setTranscript] = useState<Line[]>(() => initialTranscript);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentTimeMs, _setCurrentTimeMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(100);
  const [lyricPresetId, setLyricPresetId] = useState<string>(
    (project as any)?.lyricPresetId || "classic"
  );
  const [layoutPresetId, setLayoutPresetId] = useState<string>(
    project?.layoutPresetId || "centered-classic"
  );
  const [renderScale, setRenderScale] = useState<number>(1);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const transcriptRef = useRef<Line[]>(initialTranscript);
  const authFetch = useAuthFetch();

  // Update transcript ref when transcript changes
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Sync layoutPresetId when project changes
  useEffect(() => {
    if (project?.layoutPresetId) {
      setLayoutPresetId(project.layoutPresetId);
    }
  }, [project?.layoutPresetId]);

  // Actions
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

  // Controls
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

  // Persistence
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

  const saveLayoutPreset = useCallback(
    async (presetId: string) => {
      try {
        if (!project?.id) return;
        await authFetch(
          "next",
          `/api/workspace/${project.id}/edits/layout-preset`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ presetId }),
          }
        );
      } catch (e) {
        console.error("Failed to save layout preset", e);
      }
    },
    [authFetch, project?.id]
  );

  // Context value
  const value = useMemo<EditorContextValue>(
    () => ({
      // State
      project,
      transcript,
      selectedIndex,
      lyricPresetId,
      layoutPresetId,
      currentTimeMs,
      playing,
      pixelsPerSecond,
      renderScale,
      videoRef,

      // Actions
      setTranscript,
      setSelectedIndex,
      setLyricPresetId,
      setLayoutPresetId,
      setCurrentTimeMs,
      seekToMs,
      setPlaying,
      setPixelsPerSecond,
      setRenderScale,

      // Controls
      play,
      pause,
      togglePlay,

      // Persistence
      saveTranscript,
      saveLyricPreset,
      saveLayoutPreset,
    }),
    [
      project,
      transcript,
      selectedIndex,
      lyricPresetId,
      layoutPresetId,
      currentTimeMs,
      playing,
      pixelsPerSecond,
      renderScale,
      setCurrentTimeMs,
      seekToMs,
      play,
      pause,
      togglePlay,
      saveTranscript,
      saveLyricPreset,
      saveLayoutPreset,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within EditorProvider");
  }
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
