export type Project = {
  id: string;
  video: string;
  transcript: Word[];
};

export type Word = {
  start: number;
  end: number;
  text: string;
};
