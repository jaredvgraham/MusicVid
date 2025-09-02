"use client";

import React from "react";
import { useEditor } from "../../state/EditorContext";
import { useVideoControls } from "../../hooks/useVideoControls";

export function VideoControls(): React.ReactElement {
  const { currentTimeMs, seekToMs, playing, togglePlay, videoRef } =
    useEditor();

  const {
    duration,
    isDragging,
    dragTime,
    progressBarRef,
    handleProgressClick,
    handleProgressMouseDown,
    handleRestart,
    handleSkipBackward,
    handleSkipForward,
    formatTime,
  } = useVideoControls({
    videoRef,
    currentTimeMs,
    seekToMs,
  });

  return (
    <div className="border border-white/10 rounded-lg p-3 md:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm md:text-xs text-white/60 truncate">
          {formatTime(currentTimeMs)} / {formatTime(duration)}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={handleRestart}
            className="p-3 md:p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors touch-manipulation"
            title="Restart from beginning"
          >
            <svg
              className="w-4 h-4 md:w-3 md:h-3"
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
            className="p-4 md:p-2 rounded-full bg-purple-500 hover:bg-purple-400 text-white transition-colors touch-manipulation"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg
                className="w-6 h-6 md:w-4 md:h-4"
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
                className="w-6 h-6 md:w-4 md:h-4"
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
          className="w-full h-3 md:h-2 bg-neutral-700 rounded-full cursor-pointer relative select-none touch-manipulation"
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
            className="absolute top-1/2 w-4 h-4 md:w-3 md:h-3 bg-purple-500 rounded-full border border-white transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
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
      <div className="flex items-center justify-between text-xs md:text-[10px] text-white/60">
        <span>Current: {formatTime(currentTimeMs)}</span>
        <span>Total: {formatTime(duration)}</span>
      </div>
    </div>
  );
}
