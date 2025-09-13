"use client";

import { useState, useEffect, useCallback } from "react";

interface PresetPreferences {
  favorites: string[];
  recentlyUsed: string[];
  maxRecentCount: number;
}

const STORAGE_KEY = "preset-preferences";
const DEFAULT_PREFERENCES: PresetPreferences = {
  favorites: [],
  recentlyUsed: [],
  maxRecentCount: 10,
};

export function usePresetPreferences() {
  const [preferences, setPreferences] =
    useState<PresetPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...parsed,
        });
      }
    } catch (error) {
      console.warn("Failed to load preset preferences:", error);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn("Failed to save preset preferences:", error);
    }
  }, [preferences]);

  const toggleFavorite = useCallback((presetId: string) => {
    setPreferences((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(presetId)
        ? prev.favorites.filter((id) => id !== presetId)
        : [...prev.favorites, presetId],
    }));
  }, []);

  const addToRecentlyUsed = useCallback((presetId: string) => {
    setPreferences((prev) => ({
      ...prev,
      recentlyUsed: [
        presetId,
        ...prev.recentlyUsed.filter((id) => id !== presetId),
      ].slice(0, prev.maxRecentCount),
    }));
  }, []);

  const clearRecentlyUsed = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      recentlyUsed: [],
    }));
  }, []);

  const clearFavorites = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      favorites: [],
    }));
  }, []);

  const isFavorite = useCallback(
    (presetId: string) => {
      return preferences.favorites.includes(presetId);
    },
    [preferences.favorites]
  );

  const isRecentlyUsed = useCallback(
    (presetId: string) => {
      return preferences.recentlyUsed.includes(presetId);
    },
    [preferences.recentlyUsed]
  );

  return {
    favorites: preferences.favorites,
    recentlyUsed: preferences.recentlyUsed,
    toggleFavorite,
    addToRecentlyUsed,
    clearRecentlyUsed,
    clearFavorites,
    isFavorite,
    isRecentlyUsed,
  };
}
