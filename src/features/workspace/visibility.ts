import type { Line } from "@/types";

export type Section = { startIdx: number; endIdx: number };
export type Segment = {
  index: number;
  start: number;
  end: number;
  lane: number;
  text: string;
};

export function buildWordSegmentsFromLines(lines: Line[]): Segment[] {
  const result: Segment[] = [];
  if (!Array.isArray(lines) || lines.length === 0) return result;
  let globalIndex = 0;
  for (let lane = 0; lane < lines.length; lane++) {
    const ln = lines[lane];
    const wordsInLine = ln?.words || [];
    for (let j = 0; j < wordsInLine.length; j++) {
      const w = wordsInLine[j];
      result.push({
        index: globalIndex,
        start: w.start,
        end: ln.end,
        lane: j, // each word gets its own lane within the line
        text: w.text,
      });
      globalIndex++;
    }
  }
  return result;
}
