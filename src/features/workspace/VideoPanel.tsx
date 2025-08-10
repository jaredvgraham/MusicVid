"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEditor } from "./EditorContext";
import { OverlayCanvas } from "./OverlayCanvas";

export function VideoPanel(): React.ReactElement {
  const { project, transcript, videoRef, setCurrentTimeMs, setPlaying } =
    useEditor();
  const [overlay, setOverlay] = useState("");

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

  const overlayText = useMemo(() => overlay, [overlay]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onFrame = () => {
      const now = Math.floor(v.currentTime * 1000);
      const active = transcript.filter((w) => now >= w.start && now < w.end);
      setOverlay(active.map((w) => w.text).join(" "));
    };
    const id = setInterval(onFrame, 50);
    return () => clearInterval(id);
  }, [videoRef, transcript]);

  return (
    <div className="relative rounded border border-white/10 bg-black">
      <video ref={videoRef} src={project.video} controls className="w-full" />
      <OverlayCanvas />
      <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
        Preview
      </div>
    </div>
  );
}
