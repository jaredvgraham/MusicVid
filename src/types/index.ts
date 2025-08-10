export type Word = {
  start: number;
  end: number;
  text: string;
  confidence?: number;
  lane?: number; // UI-only: which timeline row this word occupies
};

export type Project = {
  id: string;
  video: string; // final or base depending on server state
  videoBase?: string;
  videoFinal?: string;
  transcript: Word[];
  textClips?: TextClip[];
};

export type TextClip = {
  start: number;
  end: number;
  text: string;
  xPct: number; // 0-100
  yPct: number; // 0-100
};
