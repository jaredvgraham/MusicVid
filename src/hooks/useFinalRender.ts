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

  // Reset all render state
  const resetRender = useCallback(() => {
    setIsRendering(false);
    setRenderError(null);
    setRenderProgress(0);
    setRenderStatus("");
    setVideoFinal(null);
    setIsComplete(false);
  }, []);

  // Set up WebSocket listeners and join room on mount
  useEffect(() => {
    if (!projectId) return;

    const sock = getSocket();
    if (!sock) {
      setRenderError("WebSocket not available");
      return;
    }

    // Ensure connection is established immediately
    const ensureConnection = async () => {
      if (!sock.connected) {
        sock.connect();

        // Wait for connection with timeout
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Connection timeout")),
            5000
          );

          const onConnect = () => {
            clearTimeout(timeout);
            sock.off("connect", onConnect);
            resolve();
          };

          const onConnectError = (error: any) => {
            clearTimeout(timeout);
            sock.off("connect_error", onConnectError);
            reject(new Error(`Connection failed: ${error?.message || error}`));
          };

          sock.on("connect", onConnect);
          sock.on("connect_error", onConnectError);
        });
      }
    };

    // Connect immediately when component mounts
    ensureConnection().catch((error) => {
      setRenderError(`Failed to connect to server: ${error.message}`);
    });

    // Progress updates
    const onProgress = (data: any) => {
      if (data?.id === projectId) {
        setRenderProgress(data.progress || 0);
        setRenderStatus(data.status || "rendering");
        setIsRendering(true);
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
    sock.on("finalRender:progress", onProgress);
    sock.on("finalRender:finished", onComplete);
    sock.on("finalRender:error", onError);
    sock.on("finalRender:resume", onResume);

    // Handle disconnections and reconnections
    const onDisconnect = () => {
      if (isRendering) {
        setRenderStatus("reconnecting");
      }
    };

    const onReconnect = () => {
      // Note: useProjectSocket will handle re-joining the project room
    };

    sock.on("disconnect", onDisconnect);
    sock.on("connect", onReconnect);

    // Note: useProjectSocket handles joining the project room, so we don't emit project:join here

    // Cleanup
    return () => {
      sock.off("finalRender:progress", onProgress);
      sock.off("finalRender:finished", onComplete);
      sock.off("finalRender:error", onError);
      sock.off("finalRender:resume", onResume);
      sock.off("disconnect", onDisconnect);
      sock.off("connect", onReconnect);
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

      // Ensure connection
      if (!sock.connected) {
        sock.connect();
        // Wait for connection
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Connection timeout")),
            5000
          );

          const onConnect = () => {
            clearTimeout(timeout);
            sock.off("connect", onConnect);
            resolve();
          };

          sock.on("connect", onConnect);
        });
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

    // Actions
    startRender,
    resetRender,
  };
}
