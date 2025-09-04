"use client";

import React, { useState, useMemo } from "react";
import { LYRIC_PRESETS, type LyricPreset } from "../../styles/lyricPresets";

interface PresetSelectorProps {
  selectedPresetId: string;
  onPresetChange: (presetId: string) => void;
}

export function PresetSelector({
  selectedPresetId,
  onPresetChange,
}: PresetSelectorProps): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Group presets by category
  const presetsByCategory = useMemo(() => {
    const groups: Record<string, LyricPreset[]> = {};

    Object.values(LYRIC_PRESETS).forEach((preset) => {
      const category = preset.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(preset);
    });

    return groups;
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Object.keys(presetsByCategory).sort()];
  }, [presetsByCategory]);

  const filteredPresets = useMemo(() => {
    if (selectedCategory === "All") {
      return Object.values(LYRIC_PRESETS);
    }
    return presetsByCategory[selectedCategory] || [];
  }, [selectedCategory, presetsByCategory]);

  return (
    <div className="space-y-3">
      {/* Category Filter */}
      <div>
        <label className="mb-2 block text-white/60">Category</label>
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedCategory === category
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Grid */}
      <div>
        <label className="mb-2 block text-white/60">Preset</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={`p-3 rounded border text-left transition-colors ${
                selectedPresetId === preset.id
                  ? "border-white/40 bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="font-medium text-white text-sm">
                {preset.name}
              </div>
              {preset.category && (
                <div className="text-xs text-white/60 mt-1">
                  {preset.category}
                </div>
              )}

              {/* Effect indicators */}
              <div className="flex flex-wrap gap-1 mt-2">
                {preset.fxBeams && (
                  <span className="px-1 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                    Beams
                  </span>
                )}
                {preset.fxGodRays && (
                  <span className="px-1 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                    Rays
                  </span>
                )}
                {preset.fxGlow && (
                  <span className="px-1 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                    Glow
                  </span>
                )}
                {preset.fxShimmer && (
                  <span className="px-1 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded">
                    Shimmer
                  </span>
                )}
                {preset.fxPulse && (
                  <span className="px-1 py-0.5 bg-red-500/20 text-red-300 text-xs rounded">
                    Pulse
                  </span>
                )}
                {preset.fxRainbow && (
                  <span className="px-1 py-0.5 bg-gradient-to-r from-red-500/20 to-purple-500/20 text-white text-xs rounded">
                    Rainbow
                  </span>
                )}
                {preset.fxFire && (
                  <span className="px-1 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded">
                    Fire
                  </span>
                )}
                {preset.fxIce && (
                  <span className="px-1 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded">
                    Ice
                  </span>
                )}
                {preset.fxElectric && (
                  <span className="px-1 py-0.5 bg-green-500/20 text-green-300 text-xs rounded">
                    Electric
                  </span>
                )}
                {preset.fxHologram && (
                  <span className="px-1 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded">
                    Hologram
                  </span>
                )}
                {preset.fxSmoke && (
                  <span className="px-1 py-0.5 bg-gray-500/20 text-gray-300 text-xs rounded">
                    Smoke
                  </span>
                )}
                {preset.fxLightning && (
                  <span className="px-1 py-0.5 bg-yellow-400/20 text-yellow-200 text-xs rounded">
                    Lightning
                  </span>
                )}
                {preset.fxStars && (
                  <span className="px-1 py-0.5 bg-white/20 text-white text-xs rounded">
                    Stars
                  </span>
                )}
                {preset.fxWaves && (
                  <span className="px-1 py-0.5 bg-blue-400/20 text-blue-200 text-xs rounded">
                    Waves
                  </span>
                )}
                {preset.fxMatrix && (
                  <span className="px-1 py-0.5 bg-green-400/20 text-green-200 text-xs rounded">
                    Matrix
                  </span>
                )}
                {preset.fxParticles && (
                  <span className="px-1 py-0.5 bg-white/20 text-white text-xs rounded">
                    Particles
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
