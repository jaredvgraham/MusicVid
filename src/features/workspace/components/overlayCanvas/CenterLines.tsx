import React from "react";
import type { LyricPreset } from "../../styles/lyricPresets";
import { buildPresetTextStyle, mergeWordStyle } from "./utils/style";

type WordRef = { w: any; gi: number };

export default function CenterLines({
  preset,
  lines,
  onPointerDown,
  isPortrait,
  width,
  height,
  gap,
}: {
  preset: LyricPreset;
  lines: Array<Array<WordRef>>;
  onPointerDown: (gi: number) => void;
  isPortrait?: boolean;
  width?: number;
  height?: number;
  gap?: string;
}) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
      <div className={`flex flex-col items-center gap-[${gap}px] `}>
        {lines.map((lineRefs, idx) => (
          <div
            key={`line-${idx}`}
            className="text-center font-semibold tracking-wide"
          >
            {lineRefs.map(({ w, gi }, wi) => (
              <span
                key={`tok-${gi}`}
                style={{
                  ...mergeWordStyle(
                    buildPresetTextStyle(preset, isPortrait, width, height),
                    w.style
                  ),
                  // Font size comes from preset styles and can be overridden
                  marginRight:
                    wi < lineRefs.length - 1 ? (isPortrait ? 15 : 40) : 0,
                  cursor: "grab",
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
}
