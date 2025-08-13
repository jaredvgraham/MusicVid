export type Word = {
  start: number;
  end: number;
  text: string;
  confidence?: number;
  lane?: number; // UI-only: which timeline row this word occupies
};

export interface ApiError {
  _error: string;
  message: string;
  statusCode: number;
}

export type Line = {
  start: number;
  end: number;
  words: Word[];
};

export type Project = {
  id: string;
  video: string; // final or base depending on server state
  videoBase?: string;
  videoFinal?: string;
  transcript: Line[];
  textClips?: TextClip[];
};

export type TextClip = {
  start: number;
  end: number;
  text: string;
  xPct: number; // 0-100
  yPct: number; // 0-100
};

export type UpdateTranscriptResult =
  | { ok: true; data: Line[] }
  | { ok: false; error: ApiError };
