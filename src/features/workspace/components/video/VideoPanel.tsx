"use client";

import React from "react";
import { useEditor } from "../../state/EditorContext";
import { OverlayCanvas } from "../overlayCanvas";

export function VideoPanel(): React.ReactElement {
  const { project, videoRef, setRenderScale, mute, forceSync } = useEditor();

  const baseW = (project as any)?.width || 1080;
  const baseH = (project as any)?.height || 1920;

  // Debug video state changes
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const logVideoState = () => {
      console.log("📱 Video state check:", {
        paused: v.paused,
        readyState: v.readyState,
        networkState: v.networkState,
        currentTime: v.currentTime,
        duration: v.duration,
        src: v.src,
        muted: v.muted,
      });
    };

    // Log state every 2 seconds for debugging
    const interval = setInterval(logVideoState, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [videoRef]);

  // OverlayCanvas derives its own view from currentTimeMs; avoid intervals here

  return (
    <>
      <style jsx>{`
        video::-webkit-media-controls {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-panel {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-play-button {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-timeline {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-current-time-display {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-time-remaining-display {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-mute-button {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-volume-slider {
          z-index: 1000 !important;
        }
        video::-webkit-media-controls-fullscreen-button {
          z-index: 1000 !important;
        }
      `}</style>
      <div
        className={`relative mx-auto w-full  ${
          (project as any)?.width > (project as any)?.height
            ? "max-w-[400px] sm:max-w-[600px] lg:max-w-[800px]"
            : "max-w-[250px] sm:max-w-[300px] lg:max-w-[400px]"
        } rounded border border-white/10 bg-black`}
        style={{
          aspectRatio: `${baseW} / ${baseH}`,
          minHeight: 0,
          minWidth: 0,
        }}
        ref={(el) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const scale = rect.width / baseW;
          console.log("🎨 VideoPanel scale calculation:", {
            rectWidth: rect.width,
            baseW: baseW,
            baseH: baseH,
            scale: scale,
            isPortrait: baseH > baseW,
          });
          setRenderScale(scale);
        }}
      >
        <video
          ref={videoRef}
          key={project.video}
          src={project.video}
          className="absolute inset-0 h-full w-full"
          playsInline
          webkit-playsinline="true"
          muted={mute}
          preload="auto" // iOS is flaky with "metadata"
          controls={true}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplaybook"
          style={{
            zIndex: 1,
          }}
          onLoadStart={() => {
            console.log("📱 Video load started");
          }}
          onLoadedMetadata={() => {
            console.log("📱 Video metadata loaded");
          }}
          onCanPlay={() => {
            console.log("📱 Video can play");
          }}
          onError={(e) => {
            console.error("📱 Video error:", e);
          }}
          onTouchStart={() => {
            // Force sync on mobile touch
            console.log("📱 Video touch start detected");
            setTimeout(() => forceSync(), 100);
          }}
          onTouchEnd={() => {
            // Force sync on mobile touch end
            console.log("📱 Video touch end detected");
            setTimeout(() => forceSync(), 100);
          }}
          onPlay={() => {
            console.log("📱 Native play button clicked");
            // Force the video to actually play on mobile
            setTimeout(() => {
              if (videoRef.current) {
                console.log("📱 Video state before play:", {
                  paused: videoRef.current.paused,
                  readyState: videoRef.current.readyState,
                  networkState: videoRef.current.networkState,
                  currentTime: videoRef.current.currentTime,
                  duration: videoRef.current.duration,
                  src: videoRef.current.src,
                });

                if (videoRef.current.paused) {
                  console.log("📱 Video was paused, forcing play()");
                  videoRef.current.play().catch((error) => {
                    console.error("📱 Play failed:", error);
                  });
                }
              }
              forceSync();
            }, 50);
          }}
          onPause={() => {
            console.log("📱 Native pause button clicked");
            // Force the video to actually pause on mobile
            setTimeout(() => {
              if (videoRef.current) {
                console.log("📱 Video state before pause:", {
                  paused: videoRef.current.paused,
                  readyState: videoRef.current.readyState,
                  networkState: videoRef.current.networkState,
                  currentTime: videoRef.current.currentTime,
                  duration: videoRef.current.duration,
                });

                if (!videoRef.current.paused) {
                  console.log("📱 Video was playing, forcing pause()");
                  videoRef.current.pause();
                }
              }
              forceSync();
            }, 50);
          }}
          onSeeking={() => {
            console.log("📱 Native seeking detected");
            // Force sync during seeking to keep controls responsive
            setTimeout(() => {
              forceSync();
            }, 10);
          }}
          onSeeked={() => {
            console.log("📱 Native seek completed");
            // Force immediate sync after seeking
            setTimeout(() => {
              if (videoRef.current) {
                console.log("📱 Video state after seek:", {
                  paused: videoRef.current.paused,
                  readyState: videoRef.current.readyState,
                  networkState: videoRef.current.networkState,
                  currentTime: videoRef.current.currentTime,
                  duration: videoRef.current.duration,
                });
              }
              forceSync();
            }, 10);
          }}
          onClick={() => {
            console.log("📱 Video clicked directly");
            // Ensure user interaction is registered
            setTimeout(() => {
              forceSync();
            }, 100);
          }}
        />
        <OverlayCanvas />
        <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
          Preview
        </div>
      </div>
    </>
  );
}
