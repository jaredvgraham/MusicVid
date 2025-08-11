import type { Line, Word } from "@/types";

function getPositionFromGlobalIndex(
  lines: Line[],
  globalIndex: number
): { lineIndex: number; wordIndex: number } | null {
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

function computeGlobalIndex(
  lines: Line[],
  lineIndex: number,
  wordIndex: number
): number {
  let acc = 0;
  for (let li = 0; li < lineIndex; li++) acc += lines[li]?.words?.length ?? 0;
  return acc + wordIndex;
}

function recalcLineBounds(
  words: Word[],
  fallback: { start: number; end: number }
): {
  start: number;
  end: number;
} {
  if (words.length === 0) return { start: fallback.start, end: fallback.end };
  const starts = words.map((w) => w.start);
  const ends = words.map((w) => w.end);
  return { start: Math.min(...starts), end: Math.max(...ends) };
}

export function addWord(
  lines: Line[],
  currentTimeMs: number,
  selectedIndex: number | null,
  text: string = "New"
): { next: Line[]; newSelectedIndex: number } {
  const defaultDur = 400;
  const start = Math.max(0, currentTimeMs);
  const end = start + defaultDur;

  const pos =
    selectedIndex != null
      ? getPositionFromGlobalIndex(lines, selectedIndex)
      : null;

  // If there are no lines yet, create the first line with the new word
  if (!lines || lines.length === 0) {
    const firstLine: Line = { start, end, words: [{ start, end, text }] };
    return { next: [firstLine], newSelectedIndex: 0 };
  }

  const targetLineIndex =
    pos?.lineIndex != null ? pos.lineIndex : Math.max(0, lines.length - 1);
  const insertWordIndex =
    pos?.wordIndex != null
      ? pos.wordIndex + 1
      : lines[targetLineIndex]?.words?.length ?? 0;

  const next: Line[] = lines.map((ln, li) => {
    if (li !== targetLineIndex) return ln;
    const newWord: Word = { start, end, text };
    const words = ln.words ?? [];
    const newWords = [
      ...words.slice(0, insertWordIndex),
      newWord,
      ...words.slice(insertWordIndex),
    ];
    const bounds = recalcLineBounds(newWords, { start: ln.start, end: ln.end });
    return { ...ln, ...bounds, words: newWords };
  });

  const newSelectedIndex = computeGlobalIndex(
    next,
    targetLineIndex,
    insertWordIndex
  );
  return { next, newSelectedIndex };
}

export function duplicateWord(
  lines: Line[],
  selectedIndex: number | null
): { next: Line[]; newSelectedIndex: number | null } {
  if (selectedIndex == null) return { next: lines, newSelectedIndex: null };

  const pos = getPositionFromGlobalIndex(lines, selectedIndex);
  if (!pos) return { next: lines, newSelectedIndex: selectedIndex };
  const { lineIndex, wordIndex } = pos;
  const ln = lines[lineIndex];
  const w = ln?.words?.[wordIndex];
  if (!w) return { next: lines, newSelectedIndex: selectedIndex };

  const offset = 20;
  const copy: Word = {
    ...w,
    start: Math.max(0, w.start + offset),
    end: Math.max(w.start + offset + 50, w.end + offset),
  };
  const insertWordIndex = wordIndex + 1;

  const next: Line[] = lines.map((line, li) => {
    if (li !== lineIndex) return line;
    const words = line.words ?? [];
    const newWords = [
      ...words.slice(0, insertWordIndex),
      copy,
      ...words.slice(insertWordIndex),
    ];
    const bounds = recalcLineBounds(newWords, {
      start: line.start,
      end: line.end,
    });
    return { ...line, ...bounds, words: newWords };
  });

  const newSelectedIndex = computeGlobalIndex(next, lineIndex, insertWordIndex);
  return { next, newSelectedIndex };
}

export function deleteWord(
  lines: Line[],
  selectedIndex: number | null
): { next: Line[]; newSelectedIndex: number | null } {
  if (selectedIndex == null) return { next: lines, newSelectedIndex: null };

  const pos = getPositionFromGlobalIndex(lines, selectedIndex);
  if (!pos) return { next: lines, newSelectedIndex: selectedIndex };
  const { lineIndex, wordIndex } = pos;

  const next: Line[] = lines.map((ln, li) => {
    if (li !== lineIndex) return ln;
    const words = ln.words ?? [];
    const newWords = words.filter((_, i) => i !== wordIndex);
    const bounds = recalcLineBounds(newWords, { start: ln.start, end: ln.end });
    return { ...ln, ...bounds, words: newWords };
  });

  const flatCount = next.reduce((sum, ln) => sum + (ln.words?.length ?? 0), 0);
  const newSelectedIndex =
    flatCount === 0 ? null : Math.min(selectedIndex, flatCount - 1);
  return { next, newSelectedIndex };
}
