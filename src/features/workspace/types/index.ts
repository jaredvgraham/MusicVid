import type { Line, Word, Project } from "@/types";

// Editor State Types
export interface EditorState {
  project: Project;
  transcript: Line[];
  selectedIndex: number | null;
  lyricPresetId: string;
  layoutPresetId: string;
  currentTimeMs: number;
  playing: boolean;
  pixelsPerSecond: number;
  renderScale: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mute: boolean;
}

export interface EditorActions {
  setTranscript: React.Dispatch<React.SetStateAction<Line[]>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setLyricPresetId: React.Dispatch<React.SetStateAction<string>>;
  setLayoutPresetId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTimeMs: (ms: number) => void;
  seekToMs: (ms: number) => void;
  setPlaying: (p: boolean) => void;
  setPixelsPerSecond: (pps: number) => void;
  setRenderScale: (s: number) => void;
  setMute: (m: boolean) => void;
  forceSync: () => void;
}

export interface EditorControls {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
}

export interface EditorPersistence {
  saveTranscript: (override?: Line[]) => Promise<void>;
  saveLyricPreset: (presetId: string) => Promise<void>;
  saveLayoutPreset: (presetId: string) => Promise<void>;
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

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  type: "centered" | "karaoke" | "scrolling" | "grid" | "wave" | "custom";
  config: {
    // Centered layout (current default)
    centered?: {
      maxLines?: number;
      lineSpacing?: number;
      wordSpacing?: number;
      alignment?: "left" | "center" | "right";
    };
    // Karaoke style (words appear one by one)
    karaoke?: {
      position: "top" | "bottom" | "center";
      maxWords?: number;
      portraitMaxWords?: number;
      wordSpacing?: number;
      portraitWordSpacing?: number;
      highlightCurrent?: boolean;
    };
    // Scrolling lyrics (like music videos)
    scrolling?: {
      direction: "up" | "down" | "left" | "right";
      speed: number;
      position: "left" | "right" | "top" | "bottom" | "center";
      maxLines?: number;
      portraitMaxLines?: number;
      lineSpacing?: number;
      portraitLineSpacing?: number;
      wordSpacing?: number;
      portraitWordSpacing?: number;
    };
    // Grid layout (words in a grid pattern)
    grid?: {
      columns: number;
      rows: number;
      startPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
      spacing: number;
      portraitSpacing?: number;
      portraitColumns?: number;
      portraitRows?: number;
    };
    // Wave layout (words follow a wave pattern)
    wave?: {
      amplitude: number;
      portraitAmplitude?: number;
      frequency: number;
      direction: "horizontal" | "vertical";
      centerLine: number;
      wordSpacing?: number;
      portraitWordSpacing?: number;
    };
    // Custom layout (user-defined positions)
    custom?: {
      positions: Array<{
        line: number;
        xOffset: number;
        yOffset: number;
      }>;
    };
  };
}
