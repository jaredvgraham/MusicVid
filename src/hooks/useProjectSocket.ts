// hooks/useProjectSocket.ts
"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

type FinishedPayload = { id: string; video?: string };

export function useProjectSocket(projectId: string | null) {
  const [connected, setConnected] = useState(false);
  const [finished, setFinished] = useState(false);
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    const sock = getSocket();
    if (!sock || !projectId) return;

    const onConnect = () => {
      console.log("onConnect");
      setConnected(true);
      sock.emit("project:join", { projectId });
    };
    const onDisconnect = () => setConnected(false);
    const onJoined = () => {};
    const onFinished = (payload: FinishedPayload) => {
      if (payload?.id === projectId) {
        setFinished(true);
        setVideo(payload.video ?? null);
      }
    };

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    sock.on("project:joined", onJoined);
    sock.on("project:finished", onFinished);

    if (!sock.connected) sock.connect();

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.off("project:joined", onJoined);
      sock.off("project:finished", onFinished);
      // do not disconnect here; keep singleton alive for other pages
    };
  }, [projectId]);

  return { connected, finished, video };
}
