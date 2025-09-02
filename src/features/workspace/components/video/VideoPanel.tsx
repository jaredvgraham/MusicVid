"use client";

import React from "react";
import { useEditor } from "../../state/EditorContext";
import { OverlayCanvas } from "../overlayCanvas";

export const VideoPanel = React.memo(function VideoPanel(): React.ReactElement {
  const { project, videoRef, setRenderScale, mute, forceSync } = useEditor();

  const baseW = (project as any)?.width || 1080;
  const baseH = (project as any)?.height || 1920;

  // Debug video state changes
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const logVideoState = () => {
      // Video state check
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
          // VideoPanel scale calculation
          setRenderScale(scale);
        }}
      >
        <video
          ref={videoRef}
          key={project.id}
          src={project.video}
          className="absolute inset-0 h-full w-full"
          playsInline
          webkit-playsinline="true"
          preload="metadata" // Changed from "auto" to reduce initial buffering
          controls={true}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplaybook"
          crossOrigin="anonymous"
          poster="" // Prevent poster loading
          style={{
            zIndex: 1,
            // Optimize for performance
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)", // Force hardware acceleration
          }}
          onLoadStart={() => {
            // Video load started - optimize buffering
            if (videoRef.current) {
              // Set buffer size for better performance
              const buffered = videoRef.current.buffered;
              // Use buffered data for optimization if needed
              if (buffered.length > 0) {
                // Buffer optimization logic can be added here
              }
            }
          }}
          onLoadedMetadata={() => {
            // Video metadata loaded - prepare for playback
            if (videoRef.current) {
              // Video is ready for smooth playback
              // Don't call load() again as it can cause infinite loading
            }
          }}
          onCanPlay={() => {
            // Video can play - optimize for smooth playback
            if (videoRef.current) {
              // Set playback rate for consistency
              videoRef.current.playbackRate = 1.0;
            }
          }}
          onWaiting={() => {
            // Video is buffering - wait for it to recover naturally
            // Don't call load() as it can cause loading loops
          }}
          onStalled={() => {
            // Video stalled - let it recover naturally
            // Don't call load() as it can cause loading loops
          }}
          onError={(e) => {
            console.error("📱 Video error:", e);
            // Don't automatically reload as it can cause infinite loops
            // Let the user manually refresh if needed
          }}
          onTouchStart={(e) => {
            // Force sync on mobile touch (passive)
            e.preventDefault();
            // Reduced timeout for better responsiveness
            setTimeout(() => forceSync(), 50);
          }}
          onTouchEnd={(e) => {
            // Force sync on mobile touch end (passive)
            e.preventDefault();
            // Reduced timeout for better responsiveness
            setTimeout(() => forceSync(), 50);
          }}
          onPlay={() => {
            // Native play button clicked - optimized for performance
            setTimeout(() => {
              if (videoRef.current && videoRef.current.paused) {
                videoRef.current.play().catch((error) => {
                  console.error("📱 Play failed:", error);
                });
              }
              forceSync();
            }, 25); // Reduced timeout for faster response
          }}
          onPause={() => {
            // Native pause button clicked - optimized for performance
            setTimeout(() => {
              if (videoRef.current && !videoRef.current.paused) {
                videoRef.current.pause();
              }
              forceSync();
            }, 25); // Reduced timeout for faster response
          }}
          onSeeking={() => {
            // Native seeking detected - optimized for performance
            setTimeout(() => {
              forceSync();
            }, 5); // Reduced timeout for faster seeking response
          }}
          onSeeked={() => {
            // Native seek completed - optimized for performance
            setTimeout(() => {
              forceSync();
            }, 5); // Reduced timeout for faster seek completion
          }}
          onClick={() => {
            // Video clicked directly - optimized for performance
            setTimeout(() => {
              forceSync();
            }, 50); // Reduced timeout for faster click response
          }}
        />
        <OverlayCanvas />
        <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
          Preview
        </div>
      </div>
    </>
  );
});
