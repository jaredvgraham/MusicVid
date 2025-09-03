import { useState, useCallback, useRef, useEffect } from "react";

export function useVideoState() {
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [mute, setMute] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Detect if we're on a mobile device
  const isMobile =
    typeof window !== "undefined" &&
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0);

  const seekToMs = useCallback((ms: number) => {
    console.log("seekToMs", ms);
    setCurrentTimeMs(ms);
    const targetTime = ms / 1000;

    // Seek the main video ref
    const v = videoRef.current;
    if (v) {
      v.currentTime = targetTime;
    }

    // Also seek the native video controls (the one with controls={true})
    const nativeVideo = document.querySelector(
      "video[controls]"
    ) as HTMLVideoElement;
    if (nativeVideo && nativeVideo !== v) {
      nativeVideo.currentTime = targetTime;
    }

    console.log("currentTime", videoRef.current?.currentTime);
    console.log("native video currentTime", nativeVideo?.currentTime);
  }, []);

  // Force sync function for mobile

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    // For mobile, ensure video is loaded and ready
    if (v.readyState < 2) {
      v.load();
    }

    v.play().catch((error) => {
      // Video play failed
      // If play fails, try to load and play again
      v.load();
      v.play().catch(() => {});
    });
    setPlaying(true);
  }, []);

  const toggleMute = useCallback(() => {
    setMute((prev) => !prev);
  }, []);

  const pause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else pause();
  }, [play, pause]);

  // Video event listeners - enhanced for mobile compatibility
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    const onPlay = () => {
      // Video play event fired
      setPlaying(true);
    };
    const onPause = () => {
      // Video pause event fired
      setPlaying(false);
    };
    const onLoadedData = () => {
      // Video loadeddata event fired
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    };
    const onSeeked = () => {
      // Video seeked event fired
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
      // Force full sync after seeking to ensure all controls are updated
    };
    const onSeeking = () => {
      // Video seeking event fired
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
      // Force sync during seeking to keep controls responsive
    };
    const onCanPlay = () => {
      // Video canplay event fired
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    };
    const onLoadedMetadata = () => {
      // Video loadedmetadata event fired
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };

    // Add all relevant events for better mobile compatibility
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("loadeddata", onLoadedData);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("loadedmetadata", onLoadedMetadata);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("loadeddata", onLoadedData);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoRef]);

  // Sync with native video controls - handle when user interacts with native controls
  useEffect(() => {
    // Find the video element that has native controls (the one with controls={true})
    const nativeVideo = document.querySelector(
      "video[controls]"
    ) as HTMLVideoElement;
    if (!nativeVideo) return;

    console.log("Setting up native video sync for:", nativeVideo);

    const onNativeTimeUpdate = () => {
      const currentTime = Math.floor(nativeVideo.currentTime * 1000);
      console.log("Native video timeupdate:", currentTime);
      setCurrentTimeMs(currentTime);
    };

    const onNativePlay = () => {
      console.log("Native video play");
      setPlaying(true);
    };

    const onNativePause = () => {
      console.log("Native video pause");
      setPlaying(false);
    };

    const onNativeSeeking = () => {
      const currentTime = Math.floor(nativeVideo.currentTime * 1000);
      console.log("Native video seeking to:", currentTime);
      setCurrentTimeMs(currentTime);
    };

    // Add event listeners to native video controls
    nativeVideo.addEventListener("timeupdate", onNativeTimeUpdate);
    nativeVideo.addEventListener("play", onNativePlay);
    nativeVideo.addEventListener("pause", onNativePause);

    nativeVideo.addEventListener("seeking", onNativeSeeking);

    return () => {
      nativeVideo.removeEventListener("timeupdate", onNativeTimeUpdate);
      nativeVideo.removeEventListener("play", onNativePlay);
      nativeVideo.removeEventListener("pause", onNativePause);
      nativeVideo.removeEventListener("seeking", onNativeSeeking);
    };
  }, []);

  // Force update progress bar - enhanced for mobile compatibility
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let lastKnownTime = 0;
    let lastKnownPlaying = false;

    const updateProgress = () => {
      const currentTime = Math.floor(v.currentTime * 1000);
      const isPlaying = !v.paused;

      // Always update time, even when paused (for seeking)
      if (currentTime !== lastKnownTime) {
        setCurrentTimeMs(currentTime);
        lastKnownTime = currentTime;
      }

      // Update playing state if it changed
      if (isPlaying !== lastKnownPlaying) {
        setPlaying(isPlaying);
        lastKnownPlaying = isPlaying;
        // State sync
      }
    };

    // Update immediately and set up interval
    updateProgress();
    // Optimized interval for video performance
  }, [videoRef, isMobile]);

  return {
    // State
    currentTimeMs,
    playing,
    mute,
    videoRef,

    // Actions
    setCurrentTimeMs,
    setPlaying,
    setMute,
    seekToMs,

    // Controls
    play,
    pause,
    togglePlay,
    toggleMute,
  };
}
