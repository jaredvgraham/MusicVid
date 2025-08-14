export type LyricPreset = {
  id: string;
  name: string;
  // Typography
  fontFamily?: string;
  fontWeight?: number | string;
  fontSizePx?: number;
  letterSpacingPx?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textAlign?: "left" | "center" | "right";
  // Colors & effects
  color?: string; // solid color
  backgroundColor?: string; // rgba string for pill background
  borderRadiusPx?: number;
  paddingX?: number;
  paddingY?: number;
  textShadow?: string; // CSS text-shadow for glow/outline
  // Fancy gradient text (optional)
  gradientText?: {
    from: string;
    to: string;
  };
};

export const LYRIC_PRESETS: Record<string, LyricPreset> = {
  classic: {
    id: "classic",
    name: "Classic",
    fontWeight: 700,
    fontSizePx: 24,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadiusPx: 8,
    paddingX: 16,
    paddingY: 6,
    letterSpacingPx: 0,
    textTransform: "none",
    textAlign: "center",
  },
  neon: {
    id: "neon",
    name: "Neon",
    fontWeight: 800,
    fontSizePx: 26,
    color: "#ffffff",
    backgroundColor: "transparent",
    borderRadiusPx: 0,
    paddingX: 0,
    paddingY: 0,
    letterSpacingPx: 1,
    textTransform: "uppercase",
    textAlign: "center",
    textShadow: "0 0 10px rgba(16,185,129,0.8), 0 0 20px rgba(59,130,246,0.7)",
    gradientText: {
      from: "#34d399",
      to: "#60a5fa",
    },
  },
  karaoke: {
    id: "karaoke",
    name: "Karaoke",
    fontWeight: 700,
    fontSizePx: 24,
    color: "#ffe066",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadiusPx: 8,
    paddingX: 14,
    paddingY: 6,
    letterSpacingPx: 0.5,
    textTransform: "none",
    textAlign: "center",
    // faux stroke via multi-shadow
    textShadow:
      "-1px 0 0 #000, 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, 0 0 8px rgba(0,0,0,0.6)",
  },
};

export const DEFAULT_LYRIC_PRESET_ID = "classic";
