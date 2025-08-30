import type { LayoutPreset } from "../types";

export const DEFAULT_LAYOUT_PRESET_ID = "centered-classic";

export const LAYOUT_PRESETS: Record<string, LayoutPreset> = {
  "centered-classic": {
    id: "centered-classic",
    name: "Classic Centered",
    description: "Traditional centered lyrics with clean lines",
    type: "centered",
    config: {
      centered: {
        maxLines: 4,
        lineSpacing: 8,
        wordSpacing: 30,
        alignment: "center",
      },
    },
  },
  grid: {
    id: "grid",
    name: "Grid",
    description:
      "Words arranged in an intelligent grid that adapts to content and orientation",
    type: "grid",
    config: {
      grid: {
        columns: 3, // Not used by grid layout - it's dynamic
        rows: 2, // Not used by grid layout - it's dynamic
        startPosition: "top-left", // Not used by grid layout
        spacing: 20, // Not used by grid layout
      },
    },
  },

  "centered-compact": {
    id: "centered-compact",
    name: "Compact Centered",
    description: "Tightly spaced centered lyrics for more text",
    type: "centered",
    config: {
      centered: {
        maxLines: 6,
        lineSpacing: 4,
        wordSpacing: 20,
        alignment: "center",
      },
    },
  },

  "karaoke-top": {
    id: "karaoke-top",
    name: "Karaoke Top",
    description: "Words appear at the top with current word highlighted",
    type: "karaoke",
    config: {
      karaoke: {
        position: "top",
        maxWords: 8,
        wordSpacing: 15,
        highlightCurrent: true,
      },
    },
  },

  "karaoke-bottom": {
    id: "karaoke-bottom",
    name: "Karaoke Bottom",
    description: "Words appear at the bottom with current word highlighted",
    type: "karaoke",
    config: {
      karaoke: {
        position: "bottom",
        maxWords: 8,
        wordSpacing: 15,
        highlightCurrent: true,
      },
    },
  },

  "wave-gentle": {
    id: "wave-gentle",
    name: "Gentle Wave",
    description: "Words follow a gentle wave pattern across the screen",
    type: "wave",
    config: {
      wave: {
        amplitude: 15,
        frequency: 2,
        direction: "horizontal",
        centerLine: 50,
      },
    },
  },

  "wave-dramatic": {
    id: "wave-dramatic",
    name: "Dramatic Wave",
    description: "Words follow a dramatic wave pattern with high amplitude",
    type: "wave",
    config: {
      wave: {
        amplitude: 20,
        frequency: 5,
        direction: "horizontal",
        centerLine: 50,
      },
    },
  },
};
