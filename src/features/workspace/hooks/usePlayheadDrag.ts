import { useRef, useCallback } from "react";
import type { DragState } from "../types";
import { clientXToMs } from "../utils/timelineUtils";

interface UsePlayheadDragProps {
  seekToMs: (ms: number) => void;
  currentTimeMs: number;
  pixelsPerSecond: number;
  widthMs: number;
}

export function usePlayheadDrag({
  seekToMs,
  currentTimeMs,
  pixelsPerSecond,
  widthMs,
}: UsePlayheadDragProps) {
  const draggingPlayheadRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePlayheadMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      draggingPlayheadRef.current = true;
      try {
        document.body.style.userSelect = "none";
        (document.body.style as any).webkitUserSelect = "none";
      } catch {}
      const newTime = clientXToMs(
        e.clientX,
        containerRef.current,
        currentTimeMs,
        pixelsPerSecond,
        widthMs
      );
      seekToMs(newTime);
    },
    [seekToMs, currentTimeMs, pixelsPerSecond, widthMs]
  );

  const setupGlobalPlayheadHandlers = useCallback(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingPlayheadRef.current) return;
      const newTime = clientXToMs(
        e.clientX,
        containerRef.current,
        currentTimeMs,
        pixelsPerSecond,
        widthMs
      );
      seekToMs(newTime);
    };

    const onUp = () => {
      if (!draggingPlayheadRef.current) return;
      draggingPlayheadRef.current = false;
      try {
        document.body.style.userSelect = "";
        (document.body.style as any).webkitUserSelect = "";
      } catch {}
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [seekToMs, currentTimeMs, pixelsPerSecond, widthMs]);

  return {
    draggingPlayheadRef,
    containerRef,
    handlePlayheadMouseDown,
    setupGlobalPlayheadHandlers,
  };
}
