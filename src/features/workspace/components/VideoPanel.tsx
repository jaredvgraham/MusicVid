"use client";

import React, { useEffect } from "react";
import { useEditor } from "./EditorContext";
import { OverlayCanvas } from "./OverlayCanvas";

export function VideoPanel(): React.ReactElement {
  const { project, videoRef, setCurrentTimeMs, setPlaying } = useEditor();

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
    <div className="relative mx-auto max-w-[300px] rounded border border-white/10 bg-black">
      <video ref={videoRef} src={project.video} controls className="w-full" />
      <OverlayCanvas />
      <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
        Preview
      </div>
    </div>
  );
}
