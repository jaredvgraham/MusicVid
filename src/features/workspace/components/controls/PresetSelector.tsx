"use client";

import React, { useState, useMemo, useRef } from "react";
import { LYRIC_PRESETS, type LyricPreset } from "../../styles/lyricPresets";
import { usePresetPreferences } from "../../hooks/usePresetPreferences";

interface PresetSelectorProps {
  selectedPresetId: string;
  onPresetChange: (presetId: string) => void;
}

interface PresetPreviewProps {
  preset: LyricPreset;
  isSelected: boolean;
  onSelect: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function PresetPreview({
  preset,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: PresetPreviewProps) {
  const previewRef = useRef<HTMLButtonElement>(null);

  const getEffectCount = () => {
    let count = 0;
    if (preset.fxBeams) count++;
    if (preset.fxGodRays) count++;
    if (preset.fxGlow) count++;
    if (preset.fxShimmer) count++;
    if (preset.fxPulse) count++;
    if (preset.fxRainbow) count++;
    if (preset.fxFire) count++;
    if (preset.fxIce) count++;
    if (preset.fxElectric) count++;
    if (preset.fxHologram) count++;
    if (preset.fxSmoke) count++;
    if (preset.fxLightning) count++;
    if (preset.fxStars) count++;
    if (preset.fxWaves) count++;
    if (preset.fxMatrix) count++;
    if (preset.fxParticles) count++;
    return count;
  };

  const getPreviewStyle = () => {
    const style: React.CSSProperties = {
      fontFamily: preset.fontFamily || "Inter, sans-serif",
      fontWeight:
        typeof preset.fontWeight === "number" ? preset.fontWeight : 700,
      fontSize: "16px",
      color: preset.color || "#ffffff",
      textAlign: preset.textAlign || "center",
      letterSpacing: `${(preset.letterSpacingPx || 0) * 0.1}px`,
      textTransform: preset.textTransform || "none",
      textShadow: preset.textShadow,
      background: preset.backgroundColor || "transparent",
      borderRadius: `${(preset.borderRadiusPx || 0) * 0.2}px`,
      padding: `${(preset.paddingY || 0) * 0.2}px ${
        (preset.paddingX || 0) * 0.2
      }px`,
    };

    if (preset.gradientText) {
      style.background = `linear-gradient(135deg, ${preset.gradientText.from}, ${preset.gradientText.to})`;
      style.WebkitBackgroundClip = "text";
      style.WebkitTextFillColor = "transparent";
      style.backgroundClip = "text";
    }

    return style;
  };

  return (
    <button
      ref={previewRef}
      onClick={onSelect}
      className={`group relative p-3 rounded-lg border text-left transition-all duration-200 hover:scale-[1.005] ${
        isSelected
          ? "border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-500/20"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      {/* Preview Text */}
      <div className="mb-2">
        <div className="text-sm font-medium truncate" style={getPreviewStyle()}>
          Sample Text
        </div>
      </div>

      {/* Preset Info */}
      <div className="space-y-1">
        <div className="font-medium text-white text-sm">{preset.name}</div>
        {preset.category && (
          <div className="text-xs text-white/60">{preset.category}</div>
        )}

        {/* Effect indicators */}
        <div className="flex flex-wrap gap-1 mt-2">
          {getEffectCount() > 0 ? (
            <>
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
            </>
          ) : (
            <span className="px-1 py-0.5 bg-gray-500/10 text-gray-400 text-xs rounded">
              Classic
            </span>
          )}
        </div>
      </div>

      {/* Selection and favorite indicators */}
      <div className="absolute top-2 right-2 flex gap-1">
        {isFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Remove from favorites"
          >
            <svg
              className="w-3 h-3 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        )}
        {!isFavorite && onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-1 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Add to favorites"
          >
            <svg
              className="w-3 h-3 text-white/40 hover:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        )}
        {isSelected && (
          <div className="p-1">
            <svg
              className="w-3 h-3 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

export function PresetSelector({
  selectedPresetId,
  onPresetChange,
}: PresetSelectorProps): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    favorites,
    recentlyUsed,
    toggleFavorite,
    addToRecentlyUsed,
    isFavorite,
  } = usePresetPreferences();

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
    const baseCategories = ["All", ...Object.keys(presetsByCategory).sort()];
    if (favorites.length > 0) {
      baseCategories.unshift("Favorites");
    }
    if (recentlyUsed.length > 0) {
      baseCategories.unshift("Recent");
    }
    return baseCategories;
  }, [presetsByCategory, favorites.length, recentlyUsed.length]);

  const filteredPresets = useMemo(() => {
    let presets: LyricPreset[] = [];

    if (selectedCategory === "All") {
      presets = Object.values(LYRIC_PRESETS);
    } else if (selectedCategory === "Favorites") {
      presets = favorites.map((id) => LYRIC_PRESETS[id]).filter(Boolean);
    } else if (selectedCategory === "Recent") {
      presets = recentlyUsed.map((id) => LYRIC_PRESETS[id]).filter(Boolean);
    } else {
      presets = presetsByCategory[selectedCategory] || [];
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      presets = presets.filter(
        (preset) =>
          preset.name.toLowerCase().includes(query) ||
          preset.category?.toLowerCase().includes(query) ||
          Object.keys(preset).some((key) => {
            if (key.startsWith("fx") && preset[key as keyof LyricPreset]) {
              return key.toLowerCase().includes(query);
            }
            return false;
          })
      );
    }

    return presets;
  }, [
    selectedCategory,
    presetsByCategory,
    searchQuery,
    favorites,
    recentlyUsed,
  ]);

  const handlePresetChange = (presetId: string) => {
    addToRecentlyUsed(presetId);
    onPresetChange(presetId);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar and Actions */}
      <div className="space-y-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder:text-white/40 outline-none focus:border-white/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="mb-2 block text-white/60 text-sm font-medium">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                selectedCategory === category
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10"
              }`}
            >
              {category === "Favorites" && (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              {category === "Recent" && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">
          {filteredPresets.length} preset
          {filteredPresets.length !== 1 ? "s" : ""} found
        </span>
        {searchQuery && (
          <span className="text-xs text-blue-400">
            {`Showing results for "${searchQuery}"`}
          </span>
        )}
      </div>

      {/* Preset Grid */}
      <div>
        {filteredPresets.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {filteredPresets.map((preset) => (
              <PresetPreview
                key={preset.id}
                preset={preset}
                isSelected={selectedPresetId === preset.id}
                onSelect={() => handlePresetChange(preset.id)}
                isFavorite={isFavorite(preset.id)}
                onToggleFavorite={() => toggleFavorite(preset.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-white/20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.572M15 6.334A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.572"
              />
            </svg>
            <p className="text-white/40 text-sm">No presets found</p>
            <p className="text-white/30 text-xs mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
