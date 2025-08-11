import type { Word } from "@/types";

export type Section = { startIdx: number; endIdx: number };
export type Segment = {
  index: number;
  start: number;
  end: number;
  lane: number;
  text: string;
};

export function computeSections(words: Word[], gapMs = 650): Section[] {
  if (!words || words.length === 0) return [];
  const sections: Section[] = [];
  let s = 0;
  for (let i = 1; i < words.length; i++) {
    if (words[i].start - words[i - 1].end > gapMs) {
      sections.push({ startIdx: s, endIdx: i - 1 });
      s = i;
    }
  }
  sections.push({ startIdx: s, endIdx: words.length - 1 });
  return sections;
}

export function computeSegments(
  words: Word[],
  opts?: {
    gapMs?: number;
    maxLanes?: number;
    dropAfter?: number;
    alignSectionEnd?: boolean;
  }
): Segment[] {
  const gapMs = opts?.gapMs ?? 650;
  const maxLanes = Math.max(1, opts?.maxLanes ?? 10);
  const dropAfter = Math.max(1, opts?.dropAfter ?? 4);
  const alignSectionEnd = opts?.alignSectionEnd ?? false;
  const result: Segment[] = [];
  if (!words || words.length === 0) return result;

  const sections = computeSections(words, gapMs);
  for (const sec of sections) {
    const secStart = sec.startIdx;
    const secEnd = sec.endIdx;
    const secEndTime = words[secEnd].end;
    for (let i = secStart; i <= secEnd; i++) {
      const w = words[i];
      const laneComputed = Math.min(maxLanes - 1, i - secStart);
      const dropIdx = i + dropAfter;
      const dropTime = dropIdx <= secEnd ? words[dropIdx].start : secEndTime;
      result.push({
        index: i,
        start: w.start,
        end: alignSectionEnd ? secEndTime : Math.max(w.end, dropTime),
        lane:
          typeof w.lane === "number"
            ? Math.max(0, Math.min(maxLanes - 1, w.lane))
            : laneComputed,
        text: w.text,
      });
    }
  }
  return result;
}
