export type LyricPreset = {
  id: string;
  name: string;
  category?: string; // For organizing presets
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
  // Visual Effects
  fxBeams?: boolean;
  fxBeamsIntensity?: number; // 0-1
  fxGodRays?: boolean;
  fxGodRaysIntensity?: number; // 0-1
  fxRayAngleDeg?: number; // default 0 = horizontal
  fxParticles?: boolean;
  fxParticlesIntensity?: number; // 0-1
  fxGlow?: boolean;
  fxGlowColor?: string;
  fxGlowIntensity?: number; // 0-1
  fxShimmer?: boolean;
  fxShimmerSpeed?: number; // animation speed
  fxPulse?: boolean;
  fxPulseSpeed?: number; // animation speed
  fxRainbow?: boolean;
  fxRainbowSpeed?: number; // animation speed
  fxFire?: boolean;
  fxFireIntensity?: number; // 0-1
  fxIce?: boolean;
  fxIceIntensity?: number; // 0-1
  fxElectric?: boolean;
  fxElectricIntensity?: number; // 0-1
  fxHologram?: boolean;
  fxHologramIntensity?: number; // 0-1
  fxSmoke?: boolean;
  fxSmokeIntensity?: number; // 0-1
  fxLightning?: boolean;
  fxLightningIntensity?: number; // 0-1
  fxStars?: boolean;
  fxStarsIntensity?: number; // 0-1
  fxWaves?: boolean;
  fxWavesIntensity?: number; // 0-1
  fxMatrix?: boolean;
  fxMatrixIntensity?: number; // 0-1
  // Additional Effects
  fxNeon?: boolean;
  fxNeonIntensity?: number; // 0-1
  fxNeonColor?: string;
  fxSparkle?: boolean;
  fxSparkleIntensity?: number; // 0-1
  fxGlitter?: boolean;
  fxGlitterIntensity?: number; // 0-1
  fxDiamond?: boolean;
  fxDiamondIntensity?: number; // 0-1
  fxCrystal?: boolean;
  fxCrystalIntensity?: number; // 0-1
  fxPrism?: boolean;
  fxPrismIntensity?: number; // 0-1
  fxBlur?: boolean;
  fxBlurIntensity?: number; // 0-1
  fxFade?: boolean;
  fxFadeIntensity?: number; // 0-1
};

export const LYRIC_PRESETS: Record<string, LyricPreset> = {
  // CLASSIC STYLES
  classic: {
    id: "classic",
    name: "Classic",
    category: "Classic",
    fontWeight: 700,
    fontSizePx: 80,
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
  minimal: {
    id: "minimal",
    name: "Minimal",
    category: "Classic",
    fontWeight: 600,
    fontSizePx: 80,
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
    category: "Classic",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    borderRadiusPx: 0,
    paddingX: 0,
    paddingY: 0,
    textShadow:
      "-3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000, 0 3px 0 #000, 0 0 14px rgba(0,0,0,0.65)",
    textAlign: "center",
  },
  pill: {
    id: "pill",
    name: "Pill",
    category: "Classic",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#111827",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadiusPx: 999,
    paddingX: 18,
    paddingY: 8,
    letterSpacingPx: 0.2,
    textTransform: "none",
    textAlign: "center",
  },
  glass: {
    id: "glass",
    name: "Glass",
    category: "Classic",
    fontWeight: 700,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadiusPx: 12,
    paddingX: 14,
    paddingY: 6,
    textShadow: "0 2px 10px rgba(0,0,0,0.45)",
    textAlign: "center",
  },
  caption: {
    id: "caption",
    name: "Caption Bar",
    category: "Classic",
    fontWeight: 700,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadiusPx: 4,
    paddingX: 10,
    paddingY: 4,
    textAlign: "center",
  },
  // CINEMATIC STYLES
  lightRays: {
    id: "lightRays",
    name: "Light Rays",
    category: "Cinematic",
    fontFamily: "Audiowide, sans-serif",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#f8fafc",
    backgroundColor: "transparent",
    textShadow:
      "0 0 8px rgba(248,250,252,0.95), 0 0 18px rgba(255,255,255,0.85), 0 0 30px rgba(255,255,255,0.6)",
    textAlign: "center",
    fxBeams: true,
    fxGodRays: true,
    fxRayAngleDeg: 0,
  },
  cathedral: {
    id: "cathedral",
    name: "Cathedral",
    category: "Cinematic",
    fontFamily: "Cinzel, serif",
    fontWeight: 300,
    fontSizePx: 80,
    letterSpacingPx: 3,
    color: "#ffffff",
    backgroundColor: "transparent",
    textShadow:
      "0 0 16px rgba(255,255,255,0.95), 0 0 34px rgba(255,255,255,0.75), 0 0 64px rgba(255,255,255,0.5)",
    textAlign: "center",
    fxBeams: true,
    fxGodRays: true,
    fxRayAngleDeg: 0,
  },
  divine: {
    id: "divine",
    name: "Divine",
    category: "Cinematic",
    fontFamily: "PlayfairDisplay, serif",
    fontWeight: 400,
    fontSizePx: 80,
    letterSpacingPx: 2,
    color: "#ffffff",
    backgroundColor: "transparent",
    textShadow:
      "0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.7), 0 0 80px rgba(255,255,255,0.4)",
    textAlign: "center",
    fxBeams: true,
    fxGodRays: true,
    fxRayAngleDeg: 15,
    fxParticles: true,
    fxStars: true,
    fxStarsIntensity: 0.6,
  },
  epic: {
    id: "epic",
    name: "Epic",
    category: "Cinematic",
    fontFamily: "Oswald, sans-serif",
    fontWeight: 700,
    fontSizePx: 80,
    letterSpacingPx: 4,
    color: "#ffffff",
    backgroundColor: "transparent",
    textShadow:
      "0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.3)",
    textAlign: "center",
    fxBeams: true,
    fxGodRays: true,
    fxRayAngleDeg: -10,
  },
  // NEON & GLOW STYLES
  neon: {
    id: "neon",
    name: "Neon",
    category: "Neon & Glow",
    fontWeight: 800,
    fontSizePx: 80,
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
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    category: "Neon & Glow",
    fontFamily: "Audiowide, sans-serif",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    letterSpacingPx: 2,
    textTransform: "uppercase",
    textAlign: "center",
    textShadow:
      "0 0 15px rgba(255,0,255,0.9), 0 0 30px rgba(0,255,255,0.7), 0 0 45px rgba(255,255,0,0.5)",
    gradientText: {
      from: "#ff00ff",
      to: "#00ffff",
    },
    fxGlow: true,
    fxGlowColor: "#ff00ff",
    fxGlowIntensity: 0.8,
    fxElectric: true,
    fxElectricIntensity: 0.6,
  },
  electric: {
    id: "electric",
    name: "Electric",
    category: "Neon & Glow",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    letterSpacingPx: 1,
    textTransform: "uppercase",
    textAlign: "center",
    textShadow:
      "0 0 12px rgba(0,255,255,0.9), 0 0 24px rgba(0,255,255,0.7), 0 0 36px rgba(0,255,255,0.5)",
    gradientText: {
      from: "#00ffff",
      to: "#0080ff",
    },
    fxElectric: true,
    fxElectricIntensity: 0.8,
  },
  plasma: {
    id: "plasma",
    name: "Plasma",
    category: "Neon & Glow",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    letterSpacingPx: 1,
    textTransform: "uppercase",
    textAlign: "center",
    textShadow:
      "0 0 15px rgba(255,0,128,0.9), 0 0 30px rgba(128,0,255,0.7), 0 0 45px rgba(255,128,0,0.5)",
    gradientText: {
      from: "#ff0080",
      to: "#8000ff",
    },
    fxGlow: true,
    fxGlowColor: "#ff0080",
    fxGlowIntensity: 0.9,
    fxPulse: true,
    fxPulseSpeed: 2,
  },
  // KARAOKE & ENTERTAINMENT
  karaoke: {
    id: "karaoke",
    name: "Karaoke",
    category: "Karaoke & Entertainment",
    fontWeight: 800,
    fontSizePx: 80,
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
  disco: {
    id: "disco",
    name: "Disco",
    category: "Karaoke & Entertainment",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    letterSpacingPx: 1,
    textTransform: "uppercase",
    textAlign: "center",
    textShadow:
      "0 0 15px rgba(255,0,255,0.8), 0 0 30px rgba(0,255,255,0.6), 0 0 45px rgba(255,255,0,0.4)",
    gradientText: {
      from: "#ff00ff",
      to: "#00ffff",
    },
    fxRainbow: true,
    fxRainbowSpeed: 3,
    fxPulse: true,
    fxPulseSpeed: 2,
  },
  party: {
    id: "party",
    name: "Party",
    category: "Karaoke & Entertainment",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    letterSpacingPx: 1,
    textTransform: "uppercase",
    textAlign: "center",
    textShadow:
      "0 0 12px rgba(255,20,147,0.8), 0 0 24px rgba(0,255,127,0.6), 0 0 36px rgba(255,165,0,0.4)",
    gradientText: {
      from: "#ff1493",
      to: "#00ff7f",
    },
    fxShimmer: true,
    fxShimmerSpeed: 2,
    fxParticles: true,
  },
  // GLOW STYLES
  glowBlue: {
    id: "glowBlue",
    name: "Glow Blue",
    category: "Glow",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#dbeafe",
    backgroundColor: "transparent",
    textShadow: "0 0 10px rgba(59,130,246,0.9), 0 0 18px rgba(59,130,246,0.7)",
    textAlign: "center",
    fxGlow: true,
    fxGlowColor: "#3b82f6",
    fxGlowIntensity: 0.8,
  },
  glowRed: {
    id: "glowRed",
    name: "Glow Red",
    category: "Glow",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#ffe4e6",
    backgroundColor: "transparent",
    textShadow: "0 0 12px rgba(239,68,68,0.9), 0 0 22px rgba(239,68,68,0.7)",
    textAlign: "center",
    fxGlow: true,
    fxGlowColor: "#ef4444",
    fxGlowIntensity: 0.8,
  },
  glowGreen: {
    id: "glowGreen",
    name: "Glow Green",
    category: "Glow",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#dcfce7",
    backgroundColor: "transparent",
    textShadow: "0 0 12px rgba(34,197,94,0.9), 0 0 22px rgba(34,197,94,0.7)",
    textAlign: "center",
    fxGlow: true,
    fxGlowColor: "#22c55e",
    fxGlowIntensity: 0.8,
  },
  glowPurple: {
    id: "glowPurple",
    name: "Glow Purple",
    category: "Glow",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#f3e8ff",
    backgroundColor: "transparent",
    textShadow: "0 0 12px rgba(168,85,247,0.9), 0 0 22px rgba(168,85,247,0.7)",
    textAlign: "center",
    fxGlow: true,
    fxGlowColor: "#a855f7",
    fxGlowIntensity: 0.8,
  },
  // GRADIENT STYLES
  sunset: {
    id: "sunset",
    name: "Sunset Gradient",
    category: "Gradients",
    fontWeight: 800,
    fontSizePx: 70,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#f97316", to: "#ef4444" },
    textShadow: "0 0 12px rgba(249,115,22,0.6)",
    textAlign: "center",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    category: "Gradients",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#0ea5e9", to: "#06b6d4" },
    textShadow: "0 0 12px rgba(14,165,233,0.6)",
    textAlign: "center",
    fxWaves: true,
    fxWavesIntensity: 0.7,
  },
  fire: {
    id: "fire",
    name: "Fire",
    category: "Gradients",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#ff6b35", to: "#f7931e" },
    textShadow: "0 0 15px rgba(255,107,53,0.8), 0 0 30px rgba(247,147,30,0.6)",
    textAlign: "center",
    fxFire: true,
    fxFireIntensity: 0.8,
  },
  forest: {
    id: "forest",
    name: "Forest",
    category: "Gradients",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#22c55e", to: "#16a34a" },
    textShadow: "0 0 12px rgba(34,197,94,0.6)",
    textAlign: "center",
    fxSmoke: true,
    fxSmokeIntensity: 0.5,
  },
  // THEMATIC STYLES
  matrix: {
    id: "matrix",
    name: "Matrix",
    category: "Thematic",
    fontFamily: "Monoton, monospace",
    fontWeight: 800,
    fontSizePx: 70,
    color: "#bbf7d0",
    backgroundColor: "transparent",
    textShadow: "0 0 10px rgba(34,197,94,0.9), 0 0 18px rgba(16,185,129,0.7)",
    textAlign: "center",
    fxMatrix: true,
    fxMatrixIntensity: 0.8,
  },
  vaporwave: {
    id: "vaporwave",
    name: "Vaporwave",
    category: "Thematic",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#f472b6", to: "#60a5fa" },
    textShadow: "0 0 12px rgba(244,114,182,0.7), 0 0 18px rgba(96,165,250,0.6)",
    textAlign: "center",
    fxShimmer: true,
    fxShimmerSpeed: 1.5,
  },
  retro: {
    id: "retro",
    name: "Retro",
    category: "Thematic",
    fontFamily: "BebasNeue, sans-serif",
    fontWeight: 400,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    letterSpacingPx: 2,
    textTransform: "uppercase",
    textShadow: "0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,165,0,0.6)",
    gradientText: { from: "#ffd700", to: "#ff8c00" },
    textAlign: "center",
    fxParticles: true,
  },
  cyber: {
    id: "cyber",
    name: "Cyber",
    category: "Thematic",
    fontFamily: "Audiowide, sans-serif",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    letterSpacingPx: 1,
    textTransform: "uppercase",
    textShadow: "0 0 12px rgba(0,255,255,0.9), 0 0 24px rgba(0,255,255,0.7)",
    gradientText: { from: "#00ffff", to: "#0080ff" },
    textAlign: "center",
    fxElectric: true,
    fxElectricIntensity: 0.7,
    fxHologram: true,
    fxHologramIntensity: 0.6,
  },
  // SPECIAL EFFECTS
  marker: {
    id: "marker",
    name: "Marker",
    category: "Special Effects",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#fff7ed",
    backgroundColor: "transparent",
    textShadow:
      "-2px 0 0 #111827, 2px 0 0 #111827, 0 -2px 0 #111827, 0 2px 0 #111827",
    textAlign: "center",
  },
  gold: {
    id: "gold",
    name: "Gold Glow",
    category: "Special Effects",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#fff7cc",
    backgroundColor: "transparent",
    gradientText: { from: "#facc15", to: "#f59e0b" },
    textShadow: "0 0 12px rgba(250,204,21,0.6)",
    textAlign: "center",
    fxShimmer: true,
    fxShimmerSpeed: 2,
  },
  ice: {
    id: "ice",
    name: "Ice Glow",
    category: "Special Effects",
    fontWeight: 800,
    fontSizePx: 80,
    color: "#e0f2fe",
    backgroundColor: "transparent",
    textShadow: "0 0 12px rgba(14,165,233,0.7)",
    textAlign: "center",
    fxIce: true,
    fxIceIntensity: 0.8,
  },
  hologram: {
    id: "hologram",
    name: "Hologram",
    category: "Special Effects",
    fontFamily: "Audiowide, sans-serif",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#a78bfa", to: "#22d3ee" },
    textShadow:
      "0 0 8px rgba(167,139,250,0.85), 0 0 16px rgba(34,211,238,0.75), 0 0 26px rgba(99,102,241,0.6)",
    textAlign: "center",
    fxHologram: true,
    fxHologramIntensity: 0.9,
    fxShimmer: true,
    fxShimmerSpeed: 1,
  },
  cosmic: {
    id: "cosmic",
    name: "Cosmic",
    category: "Special Effects",
    fontFamily: "Audiowide, sans-serif",
    fontWeight: 900,
    fontSizePx: 80,
    color: "#ffffff",
    backgroundColor: "transparent",
    gradientText: { from: "#8b5cf6", to: "#06b6d4" },
    textShadow: "0 0 15px rgba(139,92,246,0.8), 0 0 30px rgba(6,182,212,0.6)",
    textAlign: "center",
    fxStars: true,
    fxStarsIntensity: 0.9,
    fxParticles: true,
    fxWaves: true,
    fxWavesIntensity: 0.6,
  },
};

export const DEFAULT_LYRIC_PRESET_ID = "classic";
