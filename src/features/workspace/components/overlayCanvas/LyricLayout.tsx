import React from "react";
import type { LayoutPreset } from "../../types";
import type { LyricPreset } from "../../styles/lyricPresets";
import { buildPresetTextStyle, mergeWordStyle } from "./utils/style";
import CenterLines from "./CenterLines";

type WordRef = { w: any; gi: number };

interface LyricLayoutProps {
  preset: LyricPreset;
  layoutPreset: LayoutPreset;
  lines: Array<Array<WordRef>>;
  currentTimeMs: number;
  onPointerDown: (gi: number) => void;
  isPortrait?: boolean;
  width?: number;
  height?: number;
  gap?: string;
}

// Individual layout components
const CenteredLayout: React.FC<{
  preset: LyricPreset;
  lines: Array<Array<WordRef>>;
  onPointerDown: (gi: number) => void;
  config: any;
  isPortrait: boolean;
  width?: number;
  height?: number;
  gap?: string;
}> = ({
  preset,
  lines,
  onPointerDown,
  config,
  isPortrait,
  width,
  height,
  gap,
}) => {
  const maxLines = config.maxLines || 4;

  return (
    <div className="absolute inset-0 select-none">
      <CenterLines
        preset={preset}
        lines={lines.slice(0, maxLines)}
        onPointerDown={onPointerDown}
        isPortrait={isPortrait}
        width={width}
        height={height}
        gap={gap}
      />
    </div>
  );
};
const GridLayout: React.FC<{
  preset: LyricPreset;
  lines: Array<Array<WordRef>>;
  onPointerDown: (gi: number) => void;
  config: any;
  isPortrait: boolean;
  width?: number;
  height?: number;
  gap?: string;
}> = ({
  preset,
  lines,
  onPointerDown,
  config,
  isPortrait,
  width,
  height,
  gap,
}) => {
  const words = lines.flat();
  const gridItems: Array<{ word: WordRef; col: number; row: number }> = [];

  // Smart word distribution that prevents visual overflow
  let col = 0;
  let row = 0;
  let currentRowWidth = 0;

  // Estimate word width based on font properties and text length
  const estimateWordWidth = (word: WordRef) => {
    const fontSize = word.w.style?.fontSizePx || (isPortrait ? 50 : 80);
    const textLength = word.w.text.length;

    // Use a more realistic character width calculation
    // Font size in pixels, convert to percentage of video width
    // Landscape videos have more horizontal space, so we can be more generous with spacing
    const videoWidth = isPortrait ? 400 : 1080; // Use actual landscape width

    // Character width is roughly 60% of font size for most fonts
    const charWidth = fontSize * 0.6; // Increased from 0.4 to 0.6 for better spacing

    // Convert to percentage of video width
    return ((charWidth * textLength) / videoWidth) * 100;
  };

  words.forEach((word, idx) => {
    const wordWidth = estimateWordWidth(word);
    // Landscape videos have more horizontal space, so we can use more width
    const maxRowWidth = isPortrait ? 70 : 85; // More width for landscape

    // Check if adding this word would overflow the row visually
    if (currentRowWidth + wordWidth > maxRowWidth && col > 0) {
      // Move to next row
      col = 0;
      row++;
      currentRowWidth = 0;
    }

    // Add word to current position
    gridItems.push({ word, col, row });
    currentRowWidth += wordWidth;

    // Move to next column
    col++;
    if (col >= (isPortrait ? 3 : 4)) {
      // 4 columns max for landscape, 3 for portrait
      col = 0;
      row++;
      currentRowWidth = 0;
    }
  });

  return (
    <div className="absolute inset-0 select-none">
      <div
        className="flex flex-wrap items-start"
        style={{
          position: "absolute",
          top: "20%",
          left: isPortrait ? "20%" : "30%",
          right: isPortrait ? "15%" : "10%",
          gap: gap,
          maxWidth: isPortrait ? "70%" : "50%",
        }}
      >
        {words.map((word, idx) => (
          <div
            key={`grid-${word.gi}`}
            className="cursor-grab"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPointerDown(word.gi);
            }}
          >
            <span
              style={{
                ...mergeWordStyle(
                  buildPresetTextStyle(preset, isPortrait, width, height),
                  word.w.style
                ),
                // Font size comes from preset styles and can be overridden
              }}
            >
              {word.w.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const KaraokeLayout: React.FC<{
  preset: LyricPreset;
  lines: Array<Array<WordRef>>;
  onPointerDown: (gi: number) => void;
  config: any;
  isPortrait: boolean;
  currentTimeMs: number;
  width?: number;
  height?: number;
  gap?: string;
}> = ({
  preset,
  lines,
  onPointerDown,
  config,
  isPortrait,
  currentTimeMs,
  width,
  height,
  gap,
}) => {
  const maxWords = isPortrait
    ? Math.min(config?.maxWords || 2, 2)
    : config?.maxWords || 5;
  const allWords = lines.flat();

  const wordSpacing = isPortrait ? 2 : 12;

  // Calculate how many words can fit in the available width (matching backend)
  const availableWidth = isPortrait ? 80 : 90; // More width for landscape

  const estimatedWordWidth = isPortrait ? 8 : 15; // Larger word width for landscape

  // Calculate how many words can fit
  let wordsThatFit = 0;
  let totalWidth = 0;

  for (let i = 0; i < Math.min(allWords.length, maxWords); i++) {
    const wordWidth = estimatedWordWidth + (i > 0 ? wordSpacing : 0);
    if (totalWidth + wordWidth <= availableWidth) {
      totalWidth += wordWidth;
      wordsThatFit++;
    } else {
      break;
    }
  }

  // Calculate which batch to show based on current time (matching backend)
  // Each batch shows exactly 'wordsThatFit' number of words
  const batchSize = wordsThatFit;
  const totalBatches = Math.ceil(allWords.length / batchSize);

  // Calculate current batch based on time progression through the transcript
  // Each batch gets a time window to be displayed
  const totalDuration =
    allWords.length > 0
      ? allWords[allWords.length - 1].w.end - allWords[0].w.start
      : 0;
  const batchDuration = totalDuration / totalBatches;

  // Find which batch should be shown at current time
  let currentBatch = 0;
  if (totalDuration > 0) {
    currentBatch = Math.floor(currentTimeMs / batchDuration);
    currentBatch = Math.min(currentBatch, totalBatches - 1); // Don't exceed total batches
  }

  const startIndex = currentBatch * batchSize;
  const words = allWords.slice(startIndex, startIndex + batchSize);

  // Use flexbox for simple horizontal layout (matching backend)
  const baseY =
    config?.position === "top"
      ? isPortrait
        ? "25%"
        : "20%"
      : config?.position === "bottom"
      ? isPortrait
        ? "75%"
        : "80%"
      : "50%";

  return (
    <div className="absolute inset-0 select-none">
      <div
        className="flex items-center justify-center"
        style={{
          position: "absolute",
          left: "50%",
          top: baseY,
          transform: "translate(-50%, -50%)",
          maxWidth: isPortrait ? "90%" : "80%", // More width for portrait
          gap: gap, // Smaller gap for portrait
          overflow: "hidden", // Hide any overflow
        }}
      >
        {words.map(({ w, gi }) => (
          <span
            key={`karaoke-${gi}`}
            className="cursor-grab whitespace-nowrap"
            style={{
              ...mergeWordStyle(
                buildPresetTextStyle(preset, isPortrait, width, height),
                w.style
              ),
              // Font size comes from preset styles and can be overridden
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPointerDown(gi);
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const WaveLayout: React.FC<{
  preset: LyricPreset;
  lines: Array<Array<WordRef>>;
  onPointerDown: (gi: number) => void;
  config: any;
  isPortrait: boolean;
  width?: number;
  height?: number;
  gap?: string;
}> = ({
  preset,
  lines,
  onPointerDown,
  config,
  isPortrait,
  width,
  height,
  gap,
}) => {
  const words = lines.flat();

  return (
    <div className="absolute inset-0 select-none">
      <div
        className="flex items-center justify-center"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "80%", // Match backend exactly
          flexWrap: "wrap", // Allow wrapping to new lines
          gap: gap, // Match backend exactly
        }}
      >
        {words.map(({ w, gi }, idx) => {
          // Create wave effect with CSS transform
          const waveFrequency = config?.frequency || 0.8;
          const waveAmplitude = config?.amplitude || 15;
          const waveOffset = Math.sin(idx * waveFrequency) * waveAmplitude;

          return (
            <span
              key={`wave-${gi}`}
              className="cursor-grab whitespace-nowrap"
              style={{
                ...mergeWordStyle(
                  buildPresetTextStyle(preset, isPortrait, width, height),
                  w.style
                ),
                // Font size comes from preset styles and can be overridden
                transform: `translateY(${waveOffset}px)`,
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPointerDown(gi);
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const ScrollingLayout: React.FC<{
  preset: LyricPreset;
  lines: Array<Array<WordRef>>;
  onPointerDown: (gi: number) => void;
  config: any;
  isPortrait: boolean;
  width?: number;
  height?: number;
  gap?: string;
}> = ({
  preset,
  lines,
  onPointerDown,
  config,
  isPortrait,
  width,
  height,
  gap,
}) => {
  const words = lines.flat();
  const maxLines = config?.maxLines || 3;

  return (
    <div className="absolute inset-0 select-none">
      <div
        className="flex flex-col items-center justify-center gap-4"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: isPortrait ? "90%" : "95%", // Use most of the width
          gap: gap, // Larger gap for landscape
        }}
      >
        {lines.slice(0, maxLines).map((lineRefs, lineIdx) => (
          <div
            key={`scrolling-line-${lineIdx}`}
            className="flex items-center justify-center gap-3"
            style={{
              gap: gap, // Larger word spacing for landscape
            }}
          >
            {lineRefs.map(({ w, gi }) => (
              <span
                key={`scrolling-${gi}`}
                className="cursor-grab whitespace-nowrap"
                style={{
                  ...mergeWordStyle(
                    buildPresetTextStyle(preset, isPortrait, width, height),
                    w.style
                  ),
                  // Scale font size appropriately for each mode
                  // Font size comes from preset styles and can be overridden
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPointerDown(gi);
                }}
              >
                {w.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component that renders the appropriate layout
export function LyricLayout({
  preset,
  layoutPreset,
  lines,
  currentTimeMs,
  onPointerDown,
  isPortrait = false,
  width,
  height,
  gap,
}: LyricLayoutProps): React.ReactElement {
  // Render based on layout type
  switch (layoutPreset.type) {
    case "karaoke":
      return (
        <KaraokeLayout
          preset={preset}
          lines={lines}
          onPointerDown={onPointerDown}
          config={layoutPreset.config.karaoke}
          isPortrait={isPortrait}
          currentTimeMs={currentTimeMs}
          width={width}
          height={height}
          gap={gap}
        />
      );
    case "grid":
      return (
        <GridLayout
          preset={preset}
          lines={lines}
          onPointerDown={onPointerDown}
          config={layoutPreset.config.grid}
          isPortrait={isPortrait}
          width={width}
          height={height}
          gap={gap}
        />
      );
    case "wave":
      return (
        <WaveLayout
          preset={preset}
          lines={lines}
          onPointerDown={onPointerDown}
          config={layoutPreset.config.wave}
          isPortrait={isPortrait}
          width={width}
          height={height}
          gap={gap}
        />
      );

    case "scrolling":
      return (
        <ScrollingLayout
          preset={preset}
          lines={lines}
          onPointerDown={onPointerDown}
          config={layoutPreset.config.scrolling}
          isPortrait={isPortrait}
          width={width}
          height={height}
          gap={gap}
        />
      );

    case "centered":
    default:
      return (
        <CenteredLayout
          preset={preset}
          lines={lines}
          onPointerDown={onPointerDown}
          config={layoutPreset.config.centered}
          isPortrait={isPortrait}
          width={width}
          height={height}
          gap={gap}
        />
      );
  }
}
