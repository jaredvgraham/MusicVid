export type Word = { start: number; end: number; text: string };

function formatTimestamp(ms: number): string {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  const millis = ms % 1_000;
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(millis, 3)}`;
}

export function chunkWords(
  words: Word[],
  options?: { maxGapMs?: number; maxChars?: number }
): { start: number; end: number; text: string }[] {
  const maxGapMs = options?.maxGapMs ?? 600;
  const maxChars = options?.maxChars ?? 42;

  const chunks: { start: number; end: number; text: string }[] = [];
  let current: Word[] = [];

  const flush = () => {
    if (current.length === 0) return;
    chunks.push({
      start: current[0].start,
      end: current[current.length - 1].end,
      text: current.map((w) => w.text).join(" "),
    });
    current = [];
  };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (current.length === 0) {
      current.push(word);
      continue;
    }
    const last = current[current.length - 1];
    const gap = word.start - last.end;
    const nextText = `${current.map((w) => w.text).join(" ")} ${word.text}`;
    const tooLong = nextText.length > maxChars;
    const punctuationBreak = /[.?!]$/.test(last.text);
    if (gap > maxGapMs || tooLong || punctuationBreak) {
      flush();
    }
    current.push(word);
  }
  flush();

  return chunks;
}

export function chunksToSrt(
  chunks: { start: number; end: number; text: string }[]
): string {
  return chunks
    .map((chunk, index) => {
      return `${index + 1}\n${formatTimestamp(
        chunk.start
      )} --> ${formatTimestamp(chunk.end)}\n${chunk.text}\n\n`;
    })
    .join("");
}
