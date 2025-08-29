import type { Line, Word } from "@/types";
import type {
  WordPosition,
  TimelineSegmentData,
  TimelineGridMark,
} from "../types";
import { TIMELINE_CONSTANTS } from "../types";

/**
 * Get word position from global index
 */
export function getPositionFromGlobalIndex(
  lines: Line[],
  globalIndex: number
): WordPosition | null {
  if (globalIndex == null || globalIndex < 0) return null;
  let acc = 0;
  for (let li = 0; li < lines.length; li++) {
    const count = lines[li]?.words?.length ?? 0;
    if (globalIndex < acc + count) {
      return { lineIndex: li, wordIndex: globalIndex - acc };
    }
    acc += count;
  }
  return null;
}

/**
 * Compute global index from line and word indices
 */
export function computeGlobalIndex(
  lines: Line[],
  lineIndex: number,
  wordIndex: number
): number {
  let acc = 0;
  for (let li = 0; li < lineIndex; li++) {
    acc += lines[li]?.words?.length ?? 0;
  }
  return acc + wordIndex;
}

/**
 * Recalculate line bounds based on word start/end times
 */
export function recalcLineBounds(
  words: Word[],
  fallback: { start: number; end: number }
): { start: number; end: number } {
  if (words.length === 0) {
    return { start: fallback.start, end: fallback.end };
  }
  const starts = words.map((w) => w.start);
  const ends = words.map((w) => w.end);
  return { start: Math.min(...starts), end: Math.max(...ends) };
}

/**
 * Convert client X coordinate to milliseconds
 */
export function clientXToMs(
  clientX: number,
  containerElement: HTMLElement | null,
  currentTimeMs: number,
  pixelsPerSecond: number,
  widthMs: number
): number {
  if (!containerElement) return currentTimeMs;
  const rect = containerElement.getBoundingClientRect();
  const x = clientX - rect.left + containerElement.scrollLeft;
  const ms = Math.max(0, Math.round((x / pixelsPerSecond) * 1000));
  return Math.min(Math.max(0, ms), widthMs);
}

/**
 * Calculate total duration from lines
 */
export function calculateTotalMs(lines: Line[]): number {
  return lines.length ? Math.max(...lines.map((ln) => ln.end)) : 60_000;
}

/**
 * Build timeline segments from lines
 */
export function buildTimelineSegments(
  lines: Line[],
  selectedIndex: number | null,
  currentTimeMs: number
): TimelineSegmentData[] {
  const segments: TimelineSegmentData[] = [];
  if (!Array.isArray(lines) || lines.length === 0) return segments;

  let globalIndex = 0;
  for (let lane = 0; lane < lines.length; lane++) {
    const ln = lines[lane];
    const wordsInLine = ln?.words || [];
    for (let j = 0; j < wordsInLine.length; j++) {
      const w = wordsInLine[j];
      const isSelected = selectedIndex === globalIndex;
      const isActive = currentTimeMs >= w.start && currentTimeMs < w.end;

      segments.push({
        index: globalIndex,
        start: w.start,
        end: w.end,
        lane: j,
        text: w.text,
        isSelected,
        isActive,
      });
      globalIndex++;
    }
  }
  return segments;
}

/**
 * Generate grid marks for timeline
 */
export function generateGridMarks(
  totalMs: number,
  pixelsPerSecond: number
): TimelineGridMark[] {
  const seconds = Math.ceil(totalMs / 1000);
  const marks: TimelineGridMark[] = [];

  for (let s = 0; s <= seconds; s++) {
    const x = s * pixelsPerSecond;
    const label = formatTime(s * 1000);
    marks.push({ x, label });
  }

  return marks;
}

/**
 * Format time in MM:SS.CC format
 */
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

/**
 * Get word from global index
 */
export function getWordFromGlobalIndex(
  lines: Line[],
  globalIndex: number
): Word | null {
  const pos = getPositionFromGlobalIndex(lines, globalIndex);
  if (!pos) return null;
  return lines[pos.lineIndex]?.words?.[pos.wordIndex] || null;
}

/**
 * Update word in lines array
 */
export function updateWordInLines(
  lines: Line[],
  globalIndex: number,
  updates: Partial<Word>
): Line[] {
  const pos = getPositionFromGlobalIndex(lines, globalIndex);
  if (!pos) return lines;

  const { lineIndex, wordIndex } = pos;
  return lines.map((ln, li) => {
    if (li !== lineIndex) return ln;
    const words = ln.words ?? [];
    const w = words[wordIndex];
    if (!w) return ln;

    const newWords = [...words];
    newWords[wordIndex] = { ...w, ...updates };

    const bounds = recalcLineBounds(newWords, {
      start: ln.start,
      end: ln.end,
    });

    return { ...ln, ...bounds, words: newWords };
  });
}
