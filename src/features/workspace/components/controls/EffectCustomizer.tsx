"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/features/workspace/state/EditorContext";
import {
  applyCustomizations,
  getSystemPreset,
} from "@/features/workspace/services/presetService";
import type { LyricPreset } from "@/features/workspace/styles/lyricPresets";

interface EffectCustomizerProps {
  className?: string;
}

export default function EffectCustomizer({ className }: EffectCustomizerProps) {
  const { currentPreset, setCurrentPreset, savePreset } = useEditor();
  const [customizations, setCustomizations] = useState<Partial<LyricPreset>>(
    {}
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Effect categories for better organization
  const effectCategories = [
    {
      name: "Basic Effects",
      effects: [
        { key: "fxGlow", name: "Glow", hasColor: true, hasIntensity: true },
        { key: "fxShimmer", name: "Shimmer", hasSpeed: true },
        { key: "fxPulse", name: "Pulse", hasSpeed: true },
        { key: "fxRainbow", name: "Rainbow", hasSpeed: true },
      ],
    },
    {
      name: "Environmental Effects",
      effects: [
        { key: "fxFire", name: "Fire", hasIntensity: true },
        { key: "fxIce", name: "Ice", hasIntensity: true },
        { key: "fxElectric", name: "Electric", hasIntensity: true },
        { key: "fxHologram", name: "Hologram", hasIntensity: true },
        { key: "fxSmoke", name: "Smoke", hasIntensity: true },
        { key: "fxLightning", name: "Lightning", hasIntensity: true },
      ],
    },
    {
      name: "Particle Effects",
      effects: [
        { key: "fxParticles", name: "Particles", hasIntensity: true },
        { key: "fxStars", name: "Stars", hasIntensity: true },
        { key: "fxSparkle", name: "Sparkle", hasIntensity: true },
        { key: "fxGlitter", name: "Glitter", hasIntensity: true },
        { key: "fxDiamond", name: "Diamond", hasIntensity: true },
        { key: "fxCrystal", name: "Crystal", hasIntensity: true },
        { key: "fxPrism", name: "Prism", hasIntensity: true },
      ],
    },
    {
      name: "Neon & Light Effects",
      effects: [
        { key: "fxNeon", name: "Neon", hasIntensity: true },
        { key: "fxBeams", name: "Beams", hasIntensity: true },
        {
          key: "fxGodRays",
          name: "God Rays",
          hasIntensity: true,
          hasAngle: true,
        },
        { key: "fxAurora", name: "Aurora", hasIntensity: true },
        { key: "fxNebula", name: "Nebula", hasIntensity: true },
        { key: "fxGalaxy", name: "Galaxy", hasIntensity: true },
        { key: "fxCosmic", name: "Cosmic", hasIntensity: true },
        { key: "fxStellar", name: "Stellar", hasIntensity: true },
      ],
    },
    {
      name: "Overlay Effects",
      effects: [
        { key: "fxWaves", name: "Waves", hasIntensity: true },
        { key: "fxRipple", name: "Ripple", hasIntensity: true },
        { key: "fxBlur", name: "Blur", hasIntensity: true },
        { key: "fxFade", name: "Fade", hasIntensity: true },
      ],
    },
  ];

  // Initialize customizations with current preset values when preset changes
  useEffect(() => {
    if (currentPreset) {
      // Initialize with current preset values so they show as selected
      const initialCustomizations: Partial<LyricPreset> = {};

      // Get all effect keys from the effect categories
      const allEffectKeys = effectCategories.flatMap((category) =>
        category.effects.map((effect) => effect.key)
      );

      // Initialize with current preset values for all effects
      allEffectKeys.forEach((key) => {
        const value = currentPreset[key as keyof LyricPreset];
        if (value !== undefined) {
          (initialCustomizations as any)[key] = value;
        }
      });

      setCustomizations(initialCustomizations);
    }
  }, [currentPreset?.id]); // Only reset when preset ID changes

  const updateEffect = async (effectKey: keyof LyricPreset, value: any) => {
    const updated = { ...customizations, [effectKey]: value };
    setCustomizations(updated);

    // Apply changes immediately for real-time preview
    if (currentPreset) {
      const previewPreset = applyCustomizations(currentPreset, updated);
      setCurrentPreset(previewPreset);
      console.log("Effect updated:", effectKey, value);
      console.log("Customizations:", updated);

      // Auto-save the changes
      try {
        await savePreset(previewPreset);
        console.log("Effect auto-saved:", effectKey, value);
      } catch (error) {
        console.error("Failed to auto-save effect:", error);
      }
    }
  };

  const resetEffects = async () => {
    setCustomizations({});
    // Reset to original preset
    if (currentPreset) {
      const originalPreset = getSystemPreset(currentPreset.id) || currentPreset;
      setCurrentPreset(originalPreset);

      // Auto-save the reset
      try {
        await savePreset(originalPreset);
        console.log("Effects reset and auto-saved");
      } catch (error) {
        console.error("Failed to auto-save reset:", error);
      }
    }
  };

  const renderEffectControl = (effect: any) => {
    // Get current values from preset, with customizations as overrides
    const isEnabled =
      customizations[effect.key as keyof LyricPreset] ??
      currentPreset?.[effect.key as keyof LyricPreset] ??
      false;
    const intensity =
      customizations[`${effect.key}Intensity` as keyof LyricPreset] ??
      currentPreset?.[`${effect.key}Intensity` as keyof LyricPreset] ??
      0.5;
    const speed =
      customizations[`${effect.key}Speed` as keyof LyricPreset] ??
      currentPreset?.[`${effect.key}Speed` as keyof LyricPreset] ??
      1;
    const color =
      customizations[`${effect.key}Color` as keyof LyricPreset] ??
      currentPreset?.[`${effect.key}Color` as keyof LyricPreset] ??
      "#ffffff";
    const angle =
      customizations[`${effect.key}AngleDeg` as keyof LyricPreset] ??
      currentPreset?.[`${effect.key}AngleDeg` as keyof LyricPreset] ??
      0;

    return (
      <div key={effect.key} className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!isEnabled}
            onChange={(e) => updateEffect(effect.key, e.target.checked)}
            className="rounded border border-white/20"
          />
          <span className="text-white/80">{effect.name}</span>
        </div>

        {isEnabled && (
          <div className="ml-6 space-y-2">
            {effect.hasColor && (
              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={color as string}
                  onChange={(e) =>
                    updateEffect(
                      `${effect.key}Color` as keyof LyricPreset,
                      e.target.value
                    )
                  }
                  className="h-8 w-16 rounded border border-white/10 bg-black/40 cursor-pointer"
                />
              </div>
            )}

            {effect.hasIntensity && (
              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Intensity: {Math.round((intensity as number) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={intensity as number}
                  onChange={(e) =>
                    updateEffect(
                      `${effect.key}Intensity` as keyof LyricPreset,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>
            )}

            {effect.hasSpeed && (
              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Speed: {speed as number}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={speed as number}
                  onChange={(e) =>
                    updateEffect(
                      `${effect.key}Speed` as keyof LyricPreset,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>
            )}

            {effect.hasAngle && (
              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Angle: {angle as number}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={angle as number}
                  onChange={(e) =>
                    updateEffect(
                      `${effect.key}AngleDeg` as keyof LyricPreset,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`rounded border border-white/10 bg-neutral-950/70 p-3 text-sm ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium text-white/80">Effect Customization</div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white/80 transition-colors"
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {effectCategories.map((category) => (
            <div key={category.name}>
              <label className="block text-white/60 mb-3 font-medium">
                {category.name}
              </label>
              <div className="space-y-3">
                {category.effects.map(renderEffectControl)}
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <button
              onClick={resetEffects}
              className="rounded border border-red-500/20 bg-red-500/10 px-3 py-2 text-white hover:bg-red-500/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
