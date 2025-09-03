"use client";

import React from "react";
import { useEditor } from "../../state/EditorContext";
import { OverlayCanvas } from "../overlayCanvas";

export const VideoPanel = React.memo(function VideoPanel(): React.ReactElement {
  const { project, videoRef, setRenderScale, mute } = useEditor();

  const baseW = (project as any)?.width || 1080;
  const baseH = (project as any)?.height || 1920;

  // Removed debug interval for MVP desktop version

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
          muted={mute}
          className="absolute inset-0 h-full w-full"
          preload="metadata"
          controls={true}
          crossOrigin="anonymous"
          style={{
            zIndex: 1,
          }}
          onError={(e) => {
            console.error("Video error:", e);
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
