// hooks/useProjectSocket.ts
"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import { Project } from "../types";

export function useProjectSocket(projectId: string | null) {
  const [connected, setConnected] = useState(false);
  const [finished, setFinished] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sock = getSocket();
    if (!sock || !projectId) return;

    const onConnect = () => {
      console.log("onConnect");
      setConnected(true);
      sock.emit("project:join", { projectId });
    };
    const onError = (error: string) => {
      console.log("onError socket", error);
      setError(error);
    };
    const onDisconnect = () => setConnected(false);
    const onJoined = () => {};
    const onFinished = (payload: Project) => {
      if (payload?.id === projectId) {
        setFinished(true);
        console.log("onFinished", payload);
        setProject(payload);
      }
    };

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    sock.on("project:joined", onJoined);
    sock.on("project:finished", onFinished);
    sock.on("error", onError);
    if (!sock.connected) sock.connect();

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.off("project:joined", onJoined);
      sock.off("project:finished", onFinished);
      // do not disconnect here; keep singleton alive for other pages
    };
  }, [projectId]);

  return { connected, finished, project, error };
}
