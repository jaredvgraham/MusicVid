import type { Line } from "@/types";
import type { TimelineSegmentData } from "./types";

export type Section = { startIdx: number; endIdx: number };

/**
 * Build timeline segments from lines
 * @deprecated Use buildTimelineSegments from utils/timelineUtils instead
 */
export function buildWordSegmentsFromLines(
  lines: Line[]
): TimelineSegmentData[] {
  const segments: TimelineSegmentData[] = [];
  if (!Array.isArray(lines) || lines.length === 0) return segments;

  let globalIndex = 0;
  for (let lane = 0; lane < lines.length; lane++) {
    const ln = lines[lane];
    const wordsInLine = ln?.words || [];
    for (let j = 0; j < wordsInLine.length; j++) {
      const w = wordsInLine[j];
      segments.push({
        index: globalIndex,
        start: w.start,
        end: ln.end,
        lane: j, // each word gets its own lane within the line
        text: w.text,
        isSelected: false, // This will be set by the caller
        isActive: false, // This will be set by the caller
      });
      globalIndex++;
    }
  }
  return segments;
}
