import {
  LYRIC_PRESETS,
  DEFAULT_LYRIC_PRESET_ID,
  type LyricPreset,
} from "../styles/lyricPresets";

export interface PresetDocument {
  _id: string;
  user_id: string;
  name: string;
  category?: string;
  isCustom: boolean;
  basedOn?: string;
  preset: LyricPreset;
  createdAt: string;
  updatedAt: string;
}

// System presets cache
const systemPresets = new Map<string, LyricPreset>();

// Initialize system presets
Object.entries(LYRIC_PRESETS).forEach(([id, preset]) => {
  systemPresets.set(id, preset);
});

// Get all system presets
export const getSystemPresets = (): LyricPreset[] => {
  return Array.from(systemPresets.values());
};

// Get a system preset by ID
export const getSystemPreset = (id: string): LyricPreset | undefined => {
  return systemPresets.get(id);
};

// Get default system preset
export const getDefaultSystemPreset = (): LyricPreset => {
  return systemPresets.get(DEFAULT_LYRIC_PRESET_ID) || getSystemPresets()[0];
};

// Create a custom preset from a system preset
export const createCustomPreset = (
  systemPresetId: string,
  customizations: Partial<LyricPreset>,
  name: string,
  category?: string
): LyricPreset => {
  const systemPreset = getSystemPreset(systemPresetId);
  if (!systemPreset) {
    throw new Error(`System preset ${systemPresetId} not found`);
  }

  return {
    ...systemPreset,
    ...customizations,
    id: `${systemPresetId}_custom_${Date.now()}`,
    name,
    category,
  };
};

// Apply customizations to any preset
export const applyCustomizations = (
  basePreset: LyricPreset,
  customizations: Partial<LyricPreset>
): LyricPreset => {
  // Ensure all effect properties are properly initialized
  const defaultEffects = {
    fxBeams: false,
    fxGodRays: false,
    fxRayAngleDeg: 0,
    fxParticles: false,
    fxGlow: false,
    fxGlowColor: "#ffffff",
    fxGlowIntensity: 1,
    fxShimmer: false,
    fxShimmerSpeed: 1,
    fxPulse: false,
    fxPulseSpeed: 1,
    fxRainbow: false,
    fxRainbowSpeed: 1,
    fxFire: false,
    fxFireIntensity: 1,
    fxIce: false,
    fxIceIntensity: 1,
    fxElectric: false,
    fxElectricIntensity: 1,
    fxHologram: false,
    fxHologramIntensity: 1,
    fxSmoke: false,
    fxSmokeIntensity: 1,
    fxLightning: false,
    fxLightningIntensity: 1,
    fxStars: false,
    fxStarsIntensity: 1,
    fxNeon: false,
    fxNeonIntensity: 1,
    fxMatrix: false,
    fxMatrixIntensity: 1,
    fxWaves: false,
    fxWavesIntensity: 1,
    fxRipple: false,
    fxRippleIntensity: 1,
    fxBlur: false,
    fxBlurIntensity: 1,
    fxZoom: false,
    fxZoomIntensity: 1,
    fxRotate: false,
    fxRotateIntensity: 1,
    fxBounce: false,
    fxBounceIntensity: 1,
    fxShake: false,
    fxShakeIntensity: 1,
    fxFloat: false,
    fxFloatIntensity: 1,
    fxSlide: false,
    fxSlideIntensity: 1,
    fxFade: false,
    fxFadeIntensity: 1,
    fxScale: false,
    fxScaleIntensity: 1,
    fxSkew: false,
    fxSkewIntensity: 1,
    fxFlip: false,
    fxFlipIntensity: 1,
    fxGlitch: false,
    fxGlitchIntensity: 1,
    fxDistort: false,
    fxDistortIntensity: 1,
    fxMorph: false,
    fxMorphIntensity: 1,
    fxTwist: false,
    fxTwistIntensity: 1,
    fxWobble: false,
    fxWobbleIntensity: 1,
    fxJitter: false,
    fxJitterIntensity: 1,
    fxFlicker: false,
    fxFlickerIntensity: 1,
    fxSparkle: false,
    fxSparkleIntensity: 1,
    fxGlitter: false,
    fxGlitterIntensity: 1,
    fxDiamond: false,
    fxDiamondIntensity: 1,
    fxCrystal: false,
    fxCrystalIntensity: 1,
    fxPrism: false,
    fxPrismIntensity: 1,
    fxAurora: false,
    fxAuroraIntensity: 1,
    fxNebula: false,
    fxNebulaIntensity: 1,
    fxGalaxy: false,
    fxGalaxyIntensity: 1,
    fxCosmic: false,
    fxCosmicIntensity: 1,
    fxStellar: false,
    fxStellarIntensity: 1,
    fxLunar: false,
    fxLunarIntensity: 1,
    fxSolar: false,
    fxSolarIntensity: 1,
    fxEclipse: false,
    fxEclipseIntensity: 1,
    fxMeteor: false,
    fxMeteorIntensity: 1,
    fxComet: false,
    fxCometIntensity: 1,
    fxAsteroid: false,
    fxAsteroidIntensity: 1,
    fxPlanet: false,
    fxPlanetIntensity: 1,
    fxMoon: false,
    fxMoonIntensity: 1,
    fxSun: false,
    fxSunIntensity: 1,
    fxEarth: false,
    fxEarthIntensity: 1,
    fxMars: false,
    fxMarsIntensity: 1,
    fxJupiter: false,
    fxJupiterIntensity: 1,
    fxSaturn: false,
    fxSaturnIntensity: 1,
    fxUranus: false,
    fxUranusIntensity: 1,
    fxNeptune: false,
    fxNeptuneIntensity: 1,
    fxPluto: false,
    fxPlutoIntensity: 1,
  };

  return {
    ...basePreset,
    ...defaultEffects,
    ...customizations,
  };
};

// Get all available effects for any preset
export const getAllAvailableEffects = (): Array<{
  key: keyof LyricPreset;
  name: string;
  type: "boolean" | "number" | "string" | "object";
  category: string;
}> => {
  return [
    // Glow Effects
    { key: "fxGlow", name: "Glow", type: "boolean", category: "Glow" },
    {
      key: "fxGlowColor",
      name: "Glow Color",
      type: "string",
      category: "Glow",
    },
    {
      key: "fxGlowIntensity",
      name: "Glow Intensity",
      type: "number",
      category: "Glow",
    },

    // Animation Effects
    {
      key: "fxShimmer",
      name: "Shimmer",
      type: "boolean",
      category: "Animation",
    },
    {
      key: "fxShimmerSpeed",
      name: "Shimmer Speed",
      type: "number",
      category: "Animation",
    },
    { key: "fxPulse", name: "Pulse", type: "boolean", category: "Animation" },
    {
      key: "fxPulseSpeed",
      name: "Pulse Speed",
      type: "number",
      category: "Animation",
    },
    {
      key: "fxRainbow",
      name: "Rainbow",
      type: "boolean",
      category: "Animation",
    },
    {
      key: "fxRainbowSpeed",
      name: "Rainbow Speed",
      type: "number",
      category: "Animation",
    },

    // Environmental Effects
    {
      key: "fxFire",
      name: "Fire",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxFireIntensity",
      name: "Fire Intensity",
      type: "number",
      category: "Environmental",
    },
    { key: "fxIce", name: "Ice", type: "boolean", category: "Environmental" },
    {
      key: "fxIceIntensity",
      name: "Ice Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxElectric",
      name: "Electric",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxElectricIntensity",
      name: "Electric Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxHologram",
      name: "Hologram",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxHologramIntensity",
      name: "Hologram Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxSmoke",
      name: "Smoke",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxSmokeIntensity",
      name: "Smoke Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxLightning",
      name: "Lightning",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxLightningIntensity",
      name: "Lightning Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxStars",
      name: "Stars",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxStarsIntensity",
      name: "Stars Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxWaves",
      name: "Waves",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxWavesIntensity",
      name: "Waves Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxMatrix",
      name: "Matrix",
      type: "boolean",
      category: "Environmental",
    },
    {
      key: "fxMatrixIntensity",
      name: "Matrix Intensity",
      type: "number",
      category: "Environmental",
    },
    {
      key: "fxParticles",
      name: "Particles",
      type: "boolean",
      category: "Environmental",
    },

    // Existing Effects
    { key: "fxBeams", name: "Beams", type: "boolean", category: "Cinematic" },
    {
      key: "fxGodRays",
      name: "God Rays",
      type: "boolean",
      category: "Cinematic",
    },
    {
      key: "fxRayAngleDeg",
      name: "Ray Angle",
      type: "number",
      category: "Cinematic",
    },
  ];
};
