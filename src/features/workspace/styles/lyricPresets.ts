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
    fontSizePx: 26,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadiusPx: 12,
    paddingX: 18,
    paddingY: 8,
    letterSpacingPx: 0,
    textTransform: "none",
    textAlign: "center",
    textShadow: "0 2px 12px rgba(0,0,0,0.6)",
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
    fontWeight: 800,
    fontSizePx: 28,
    color: "#ffd34d",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadiusPx: 10,
    paddingX: 16,
    paddingY: 8,
    letterSpacingPx: 0.4,
    textTransform: "none",
    textAlign: "center",
    textShadow:
      "-2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, 0 0 10px rgba(0,0,0,0.7)",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    fontWeight: 600,
    fontSizePx: 24,
    color: "#ffffff",
    backgroundColor: "transparent",
    borderRadiusPx: 0,
    paddingX: 0,
    paddingY: 0,
    textShadow: "0 1px 6px rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  outlineBold: {
    id: "outlineBold",
    name: "Bold Outline",
    fontWeight: 900,
    fontSizePx: 30,
    color: "#ffffff",
    backgroundColor: "transparent",
    borderRadiusPx: 0,
    paddingX: 0,
    paddingY: 0,
    textShadow:
      "-3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000, 0 3px 0 #000, 0 0 14px rgba(0,0,0,0.65)",
    textAlign: "center",
  },
  glowBlue: {
    id: "glowBlue",
    name: "Glow Blue",
    fontWeight: 800,
    fontSizePx: 28,
    color: "#dbeafe",
    backgroundColor: "transparent",
    textShadow: "0 0 10px rgba(59,130,246,0.9), 0 0 18px rgba(59,130,246,0.7)",
    textAlign: "center",
  },
  glowRed: {
    id: "glowRed",
    name: "Glow Red",
    fontWeight: 800,
    fontSizePx: 28,
    color: "#ffe4e6",
    backgroundColor: "transparent",
    textShadow: "0 0 12px rgba(239,68,68,0.9), 0 0 22px rgba(239,68,68,0.7)",
    textAlign: "center",
  },
  sunset: {
    id: "sunset",
    name: "Sunset Gradient",
    fontWeight: 800,
    fontSizePx: 28,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#f97316", to: "#ef4444" },
    textShadow: "0 0 12px rgba(249,115,22,0.6)",
    textAlign: "center",
  },
  glass: {
    id: "glass",
    name: "Glass",
    fontWeight: 700,
    fontSizePx: 24,
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadiusPx: 12,
    paddingX: 14,
    paddingY: 6,
    textShadow: "0 2px 10px rgba(0,0,0,0.45)",
    textAlign: "center",
  },
  pill: {
    id: "pill",
    name: "Pill",
    fontWeight: 800,
    fontSizePx: 26,
    color: "#111827",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadiusPx: 999,
    paddingX: 18,
    paddingY: 8,
    letterSpacingPx: 0.2,
    textTransform: "none",
    textAlign: "center",
  },
  caption: {
    id: "caption",
    name: "Caption Bar",
    fontWeight: 700,
    fontSizePx: 22,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadiusPx: 4,
    paddingX: 10,
    paddingY: 4,
    textAlign: "center",
  },
  matrix: {
    id: "matrix",
    name: "Matrix",
    fontWeight: 800,
    fontSizePx: 26,
    color: "#bbf7d0",
    backgroundColor: "transparent",
    textShadow: "0 0 10px rgba(34,197,94,0.9), 0 0 18px rgba(16,185,129,0.7)",
    textAlign: "center",
  },
  vaporwave: {
    id: "vaporwave",
    name: "Vaporwave",
    fontWeight: 800,
    fontSizePx: 28,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#f472b6", to: "#60a5fa" },
    textShadow: "0 0 12px rgba(244,114,182,0.7), 0 0 18px rgba(96,165,250,0.6)",
    textAlign: "center",
  },
  marker: {
    id: "marker",
    name: "Marker",
    fontWeight: 900,
    fontSizePx: 28,
    color: "#fff7ed",
    backgroundColor: "transparent",
    textShadow:
      "-2px 0 0 #111827, 2px 0 0 #111827, 0 -2px 0 #111827, 0 2px 0 #111827",
    textAlign: "center",
  },
  gold: {
    id: "gold",
    name: "Gold Glow",
    fontWeight: 800,
    fontSizePx: 28,
    color: "#fff7cc",
    backgroundColor: "transparent",
    gradientText: { from: "#facc15", to: "#f59e0b" },
    textShadow: "0 0 12px rgba(250,204,21,0.6)",
    textAlign: "center",
  },
  ice: {
    id: "ice",
    name: "Ice Glow",
    fontWeight: 800,
    fontSizePx: 28,
    color: "#e0f2fe",
    backgroundColor: "transparent",
    textShadow: "0 0 12px rgba(14,165,233,0.7)",
    textAlign: "center",
  },
};

export const DEFAULT_LYRIC_PRESET_ID = "classic";
