import React from "react";
import type { LyricPreset } from "../../styles/lyricPresets";
import { buildPresetTextStyle, mergeWordStyle } from "./utils/style";

type WordRef = { w: any; gi: number };

export default function CenterLines({
  preset,
  lines,
  onPointerDown,
  isPortrait,
}: {
  preset: LyricPreset;
  lines: Array<Array<WordRef>>;
  onPointerDown: (gi: number) => void;
  isPortrait?: boolean;
}) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
      <div className="flex flex-col items-center gap-1">
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
                    buildPresetTextStyle(preset, isPortrait),
                    w.style
                  ),
                  // Force smaller font size and spacing for portrait mode
                  fontSize: isPortrait ? "48px" : undefined,
                  marginRight:
                    wi < lineRefs.length - 1 ? (isPortrait ? 15 : 30) : 0,
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
