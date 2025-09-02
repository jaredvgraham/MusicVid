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
    setCurrentTimeMs(ms);
    const v = videoRef.current;
    if (v) {
      v.currentTime = ms / 1000;
    }
  }, []);

  // Force sync function for mobile
  const forceSync = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    const currentTime = Math.floor(v.currentTime * 1000);
    const isPlaying = !v.paused;
    const readyState = v.readyState;
    const networkState = v.networkState;

    console.log(
      `📱 Force sync called: time=${currentTime}ms, playing=${isPlaying}, readyState=${readyState}, networkState=${networkState}`
    );
    setCurrentTimeMs(currentTime);
    setPlaying(isPlaying);
  }, []);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    // For mobile, ensure video is loaded and ready
    if (v.readyState < 2) {
      v.load();
    }

    v.play().catch((error) => {
      console.log("Video play failed:", error);
      // If play fails, try to load and play again
      v.load();
      v.play().catch(() => {});
    });
    setPlaying(true);
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

  const toggleMute = useCallback(() => {
    setMute((prev) => !prev);
  }, []);

  // Video event listeners - enhanced for mobile compatibility
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    const onPlay = () => {
      console.log("🎬 Video play event fired");
      setPlaying(true);
    };
    const onPause = () => {
      console.log("🎬 Video pause event fired");
      setPlaying(false);
    };
    const onLoadedData = () => {
      console.log("🎬 Video loadeddata event fired");
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    };
    const onSeeked = () => {
      console.log("🎬 Video seeked event fired");
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
      // Force full sync after seeking to ensure all controls are updated
      setTimeout(() => {
        forceSync();
      }, 10);
    };
    const onSeeking = () => {
      console.log("🎬 Video seeking event fired");
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
      // Force sync during seeking to keep controls responsive
      setTimeout(() => {
        forceSync();
      }, 10);
    };
    const onCanPlay = () => {
      console.log("🎬 Video canplay event fired");
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    };
    const onLoadedMetadata = () => {
      console.log("🎬 Video loadedmetadata event fired");
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
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

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("loadeddata", onLoadedData);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [videoRef]);

  // Sync mute state with video element
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = mute;
  }, [mute, videoRef]);

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
        console.log(
          `🎬 State sync: playing=${isPlaying}, time=${currentTime}ms`
        );
      }
    };

    // Update immediately and set up interval
    updateProgress();
    // Use shorter interval for better mobile responsiveness
    const intervalMs = isMobile ? 25 : 50; // More frequent updates on mobile
    const interval = setInterval(updateProgress, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [videoRef, isMobile]);

  // Mobile-specific: Add additional event listeners and MutationObserver for better sync
  useEffect(() => {
    if (!isMobile) return;

    const v = videoRef.current;
    if (!v) return;

    const handleMobileInteraction = () => {
      // Force sync when user interacts with video on mobile
      setCurrentTimeMs(Math.floor(v.currentTime * 1000));
      setPlaying(!v.paused);
      console.log("📱 Mobile interaction detected, syncing state");
    };

    // Add listeners for mobile-specific events
    v.addEventListener("touchstart", handleMobileInteraction);
    v.addEventListener("touchend", handleMobileInteraction);
    v.addEventListener("focus", handleMobileInteraction);
    v.addEventListener("blur", handleMobileInteraction);

    // Use MutationObserver to watch for changes in video properties
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as HTMLVideoElement;
          if (target === v) {
            console.log("📱 Video attribute changed, syncing state");
            setCurrentTimeMs(Math.floor(v.currentTime * 1000));
            setPlaying(!v.paused);
          }
        }
      });
    });

    // Observe the video element for attribute changes
    observer.observe(v, {
      attributes: true,
      attributeFilter: ["currentTime", "paused", "muted"],
    });

    return () => {
      v.removeEventListener("touchstart", handleMobileInteraction);
      v.removeEventListener("touchend", handleMobileInteraction);
      v.removeEventListener("focus", handleMobileInteraction);
      v.removeEventListener("blur", handleMobileInteraction);
      observer.disconnect();
    };
  }, [videoRef, isMobile]);

  // Mobile-specific: Aggressive state monitoring for native controls
  useEffect(() => {
    if (!isMobile) return;

    const v = videoRef.current;
    if (!v) return;

    let lastSyncTime = 0;
    let lastSyncPlaying = false;
    let syncAttempts = 0;

    const aggressiveSync = () => {
      const currentTime = Math.floor(v.currentTime * 1000);
      const isPlaying = !v.paused;
      const readyState = v.readyState;
      const networkState = v.networkState;

      // Check if state has changed since last sync
      if (currentTime !== lastSyncTime || isPlaying !== lastSyncPlaying) {
        console.log(
          `📱 Aggressive sync: time=${currentTime}ms, playing=${isPlaying}, readyState=${readyState}, networkState=${networkState}, attempts=${syncAttempts}`
        );

        setCurrentTimeMs(currentTime);
        setPlaying(isPlaying);

        lastSyncTime = currentTime;
        lastSyncPlaying = isPlaying;
        syncAttempts = 0;
      } else {
        syncAttempts++;
        // If no changes detected for a while, force a sync anyway
        if (syncAttempts > 20) {
          // 20 * 100ms = 2 seconds
          console.log("📱 Force syncing after no changes detected");
          setCurrentTimeMs(currentTime);
          setPlaying(isPlaying);
          syncAttempts = 0;
        }
      }

      // Additional seeking detection: check for significant time differences
      const timeDiff = Math.abs(currentTime - currentTimeMs);
      if (timeDiff > 100) {
        // More than 100ms difference indicates seeking
        console.log(
          `📱 Seeking detected: video=${currentTime}ms, state=${currentTimeMs}ms, diff=${timeDiff}ms`
        );
        setCurrentTimeMs(currentTime);
        setPlaying(isPlaying);
        lastSyncTime = currentTime;
        lastSyncPlaying = isPlaying;
        syncAttempts = 0;
      }
    };

    // Run aggressive sync every 100ms on mobile
    const aggressiveInterval = setInterval(aggressiveSync, 100);

    return () => {
      clearInterval(aggressiveInterval);
    };
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
    forceSync,

    // Controls
    play,
    pause,
    togglePlay,
    toggleMute,
  };
}
