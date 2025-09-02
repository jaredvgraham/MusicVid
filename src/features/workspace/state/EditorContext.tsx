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
import { useVideoState } from "../hooks/useVideoState";

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
  // Video state
  const videoState = useVideoState();

  // Editor state
  const [transcript, setTranscript] = useState<Line[]>(() => initialTranscript);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(100);
  const [lyricPresetId, setLyricPresetId] = useState<string>(
    (project as any)?.lyricPresetId || "classic"
  );
  const [layoutPresetId, setLayoutPresetId] = useState<string>(
    project?.layoutPresetId || "centered-classic"
  );
  const [renderScale, setRenderScale] = useState<number>(1);
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
  const setCurrentTimeMs = useCallback(
    (ms: number) => {
      videoState.setCurrentTimeMs(ms);
    },
    [videoState]
  );

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
      currentTimeMs: videoState.currentTimeMs,
      playing: videoState.playing,
      pixelsPerSecond,
      renderScale,
      videoRef: videoState.videoRef,
      mute: videoState.mute,

      // Actions
      setTranscript,
      setSelectedIndex,
      setLyricPresetId,
      setLayoutPresetId,
      setCurrentTimeMs,
      seekToMs: videoState.seekToMs,
      setPlaying: videoState.setPlaying,
      setPixelsPerSecond,
      setRenderScale,
      setMute: videoState.setMute,
      forceSync: videoState.forceSync,

      // Controls
      play: videoState.play,
      pause: videoState.pause,
      togglePlay: videoState.togglePlay,
      toggleMute: videoState.toggleMute,

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
      videoState,
      pixelsPerSecond,
      renderScale,
      setCurrentTimeMs,
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
