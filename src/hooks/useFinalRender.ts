"use client";

import { useState, useCallback, useEffect } from "react";
import { getSocket } from "../lib/socket";

export function useFinalRender(projectId: string | null) {
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderStatus, setRenderStatus] = useState<string>("");
  const [videoFinal, setVideoFinal] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [connected, setConnected] = useState(false);

  // Reset all render state
  const resetRender = useCallback(() => {
    setIsRendering(false);
    setRenderError(null);
    setRenderProgress(0);
    setRenderStatus("");
    setVideoFinal(null);
    setIsComplete(false);
  }, []);

  // Set up WebSocket listeners for final render events
  useEffect(() => {
    if (!projectId) return;

    const sock = getSocket();
    if (!sock) {
      setRenderError("WebSocket not available");
      return;
    }

    const onConnect = () => {
      console.log("Final render socket connected");
      setConnected(true);
      setRenderError(null);
    };

    const onConnectError = (err: any) => {
      const msg = typeof err?.message === "string" ? err.message : String(err);
      console.log("Final render socket connect_error", msg);
      setRenderError(`Connection failed: ${msg}`);
      setConnected(false);
    };

    const onDisconnect = () => {
      console.log("Final render socket disconnected");
      setConnected(false);
      if (isRendering) {
        setRenderStatus("reconnecting");
      }
    };

    // Progress updates
    const onProgress = (data: any) => {
      if (data?.id === projectId) {
        setRenderProgress(data.progress || 0);
        setRenderStatus(data.status || "rendering");
        setIsRendering(true);
        setRenderError(null);
      }
    };

    // Render completion
    const onComplete = (data: any) => {
      if (data?.id === projectId) {
        setVideoFinal(data.video);
        setIsComplete(true);
        setIsRendering(false);
        setRenderProgress(100);
        setRenderStatus("completed");
        setRenderError(null);
      }
    };

    // Render errors
    const onError = (data: any) => {
      if (data?.id === projectId) {
        setRenderError(data.error || "Render failed");
        setIsRendering(false);
        setRenderStatus("error");
      }
    };

    // Render resume (for reconnections)
    const onResume = (data: any) => {
      if (data?.id === projectId) {
        setIsRendering(true);
        setRenderProgress(data.progress || 0);
        setRenderStatus(data.status || "rendering");
        setRenderError(null);
        setIsComplete(false);
      }
    };

    // Set up listeners
    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    sock.on("connect_error", onConnectError);
    sock.on("finalRender:progress", onProgress);
    sock.on("finalRender:finished", onComplete);
    sock.on("finalRender:error", onError);
    sock.on("finalRender:resume", onResume);

    // Connect if not already connected
    if (!sock.connected) {
      sock.connect();
    }

    // Cleanup
    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.off("connect_error", onConnectError);
      sock.off("finalRender:progress", onProgress);
      sock.off("finalRender:finished", onComplete);
      sock.off("finalRender:error", onError);
      sock.off("finalRender:resume", onResume);
      // do not disconnect here; keep singleton alive for other pages
    };
  }, [projectId, isRendering]);

  // Start a new render
  const startRender = useCallback(async () => {
    if (!projectId) {
      setRenderError("No project ID");
      return;
    }

    try {
      resetRender();

      const sock = getSocket();
      if (!sock) {
        setRenderError("WebSocket not available");
        return;
      }

      // Start the render
      setIsRendering(true);
      setRenderStatus("starting");
      setRenderError(null);

      sock.emit("finalRender", { id: projectId });
    } catch (error: any) {
      setRenderError(error?.message || "Failed to start render");
      setIsRendering(false);
    }
  }, [projectId, resetRender]);

  return {
    // State
    isRendering,
    renderError,
    renderProgress,
    renderStatus,
    videoFinal,
    isComplete,
    connected,

    // Actions
    startRender,
    resetRender,
  };
}
