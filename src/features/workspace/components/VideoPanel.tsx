"use client";

import React, { useEffect } from "react";
import { useEditor } from "./EditorContext";
import { OverlayCanvas } from "./OverlayCanvas";

export function VideoPanel(): React.ReactElement {
  const { project, videoRef, setCurrentTimeMs, setPlaying, setRenderScale } =
    useEditor();

  const baseW = (project as any)?.width || 1080;
  const baseH = (project as any)?.height || 1920;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTimeMs(Math.floor(v.currentTime * 1000));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoRef, setCurrentTimeMs]);

  // OverlayCanvas derives its own view from currentTimeMs; avoid intervals here

  return (
    <div
      className={`relative mx-auto w-full ${
        (project as any)?.width > (project as any)?.height
          ? "max-w-[800px]"
          : "max-h-[400px]"
      } rounded border border-white/10 bg-black ${
        (project as any)?.orientation === "landscape"
          ? "aspect-[16/9]"
          : "aspect-[9/16]"
      }`}
      ref={(el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scale = rect.width / baseW;
        setRenderScale(scale);
      }}
      style={{ aspectRatio: `${baseW} / ${baseH}` } as any}
    >
      <video
        ref={videoRef}
        key={project.video}
        src={project.video}
        controls
        className="absolute inset-0 h-full w-full object-cover"
      />
      <OverlayCanvas />
      <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
        Preview
      </div>
    </div>
  );
}
