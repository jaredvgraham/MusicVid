import type { Line, Word, Project } from "@/types";

// Editor State Types
export interface EditorState {
  project: Project;
  transcript: Line[];
  selectedIndex: number | null;
  lyricPresetId: string;
  currentTimeMs: number;
  playing: boolean;
  pixelsPerSecond: number;
  renderScale: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export interface EditorActions {
  setTranscript: React.Dispatch<React.SetStateAction<Line[]>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setLyricPresetId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTimeMs: (ms: number) => void;
  seekToMs: (ms: number) => void;
  setPlaying: (p: boolean) => void;
  setPixelsPerSecond: (pps: number) => void;
  setRenderScale: (s: number) => void;
}

export interface EditorControls {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
}

export interface EditorPersistence {
  saveTranscript: (override?: Line[]) => Promise<void>;
  saveLyricPreset: (presetId: string) => Promise<void>;
}

export interface EditorContextValue
  extends EditorState,
    EditorActions,
    EditorControls,
    EditorPersistence {}

// Timeline Types
export interface TimelineSegmentData {
  index: number;
  start: number;
  end: number;
  lane: number;
  text: string;
  isSelected: boolean;
  isActive: boolean;
}

export interface TimelineGridMark {
  x: number;
  label: string;
}

export interface DragState {
  mode: "move" | "resize-start" | "resize-end";
  startX: number;
  originalStart: number;
  originalEnd: number;
  lineIndex: number;
  wordIndex: number;
  globalIndex: number;
  lastStart?: number;
  lastEnd?: number;
}

// Word CRUD Types
export interface WordPosition {
  lineIndex: number;
  wordIndex: number;
}

export interface WordCrudResult {
  next: Line[];
  newSelectedIndex: number | null;
}

// Video Controls Types
export interface VideoState {
  duration: number;
  isDragging: boolean;
  dragTime: number;
}

// Constants
export const TIMELINE_CONSTANTS = {
  CLIP_HEIGHT: 24,
  ROW_HEIGHT: 28,
  TOP_PAD: 24,
  MIN_WORD_DURATION: 50,
  DEFAULT_WORD_DURATION: 400,
} as const;

export const VIDEO_CONTROLS_CONSTANTS = {
  SKIP_DURATION: 5000,
  DRAG_THRESHOLD: 50,
} as const;
