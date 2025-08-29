"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor } from "../state/EditorContext";

export function VideoControls(): React.ReactElement {
  const {
    currentTimeMs,
    seekToMs,
    playing,
    togglePlay,
    play,
    pause,
    videoRef,
  } = useEditor();

  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Get video duration when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration * 1000); // Convert to milliseconds
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef]);

  // Update drag time when currentTimeMs changes from external sources
  useEffect(() => {
    if (!isDragging) {
      setDragTime(currentTimeMs);
    }
  }, [currentTimeMs, isDragging]);

  // Global mouse move handler for smoother dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!progressBarRef.current || !duration) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = clickX / rect.width;
      const newTime = Math.floor(percentage * duration);

      // Only update if time changed significantly (more than 50ms) to reduce lag
      if (Math.abs(newTime - dragTime) > 50) {
        setDragTime(newTime);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging && duration) {
        seekToMs(dragTime);
      }
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, duration, dragTime, seekToMs]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = Math.floor(percentage * duration);

    seekToMs(newTime);
    setDragTime(newTime);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
  };

  const handleRestart = () => {
    seekToMs(0);
    setDragTime(0);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTimeMs - 5000); // Skip back 5 seconds
    seekToMs(newTime);
    setDragTime(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTimeMs + 5000); // Skip forward 5 seconds
    seekToMs(newTime);
    setDragTime(newTime);
  };

  return (
    <div className="border border-white/10 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/60 ">
          {formatTime(currentTimeMs)} / {formatTime(duration)}
        </div>
        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            title="Restart from beginning"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="p-1 rounded-full bg-purple-500 hover:bg-purple-400 text-white transition-colors"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? (
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
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
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
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div
          ref={progressBarRef}
          className="w-full h-1.5 bg-neutral-700 rounded-full cursor-pointer relative select-none"
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
        >
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-100"
            style={{
              width: duration
                ? `${
                    ((isDragging ? dragTime : currentTimeMs) / duration) * 100
                  }%`
                : "0%",
            }}
          />
          <div
            className="absolute top-1/2 w-2.5 h-2.5 bg-purple-500 rounded-full border border-white transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
            style={{
              left: duration
                ? `${
                    ((isDragging ? dragTime : currentTimeMs) / duration) * 100
                  }%`
                : "0%",
            }}
          />
        </div>
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-between text-[10px] text-white/60">
        <span>Current: {formatTime(currentTimeMs)}</span>
        <span>Total: {formatTime(duration)}</span>
      </div>
    </div>
  );
}
