import { useState, useEffect, useRef } from "react";
import type { VideoState } from "../types";
import { VIDEO_CONTROLS_CONSTANTS } from "../types";

interface UseVideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentTimeMs: number;
  seekToMs: (ms: number) => void;
}

export function useVideoControls({
  videoRef,
  currentTimeMs,
  seekToMs,
}: UseVideoControlsProps) {
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

      // Only update if time changed significantly (more than threshold) to reduce lag
      if (
        Math.abs(newTime - dragTime) > VIDEO_CONTROLS_CONSTANTS.DRAG_THRESHOLD
      ) {
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
    const newTime = Math.max(
      0,
      currentTimeMs - VIDEO_CONTROLS_CONSTANTS.SKIP_DURATION
    );
    seekToMs(newTime);
    setDragTime(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(
      duration,
      currentTimeMs + VIDEO_CONTROLS_CONSTANTS.SKIP_DURATION
    );
    seekToMs(newTime);
    setDragTime(newTime);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return {
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
  };
}
