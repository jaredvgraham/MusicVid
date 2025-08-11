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
  const [persistedId, setPersistedId] = useState<string | null>(null);

  // Load persisted project id on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("mv:projectId");
    if (saved) setPersistedId(saved);
  }, []);

  // Persist latest provided id
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (projectId) window.localStorage.setItem("mv:projectId", projectId);
  }, [projectId]);

  const activeId = projectId ?? persistedId;

  useEffect(() => {
    const sock = getSocket();
    if (!sock || !activeId) return;

    const onConnect = () => {
      console.log("onConnect");
      setConnected(true);
      sock.emit("project:join", { projectId: activeId });
    };
    const onConnectError = (err: any) => {
      const msg = typeof err?.message === "string" ? err.message : String(err);
      console.log("socket connect_error", msg);
      setError(msg);
    };
    const onProjectError = (payload: any) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("mv:projectId");
        } catch {}
      }
      const id = (payload && (payload.id || payload.projectId)) as
        | string
        | undefined;
      const msg = (payload && (payload.error || payload.message)) as
        | string
        | undefined;
      if (id && id !== activeId) return;
      if (msg) {
        setError(msg);
      } else {
        setError("error occurred");
      }
    };
    const onDisconnect = () => setConnected(false);
    const onJoined = () => {};
    const onFinished = (payload: Project) => {
      if (payload?.id === activeId) {
        setFinished(true);
        console.log("onFinished", payload);
        setProject(payload);
        // Success: clear persisted id so we don't auto-join next load
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem("mv:projectId");
          } catch {}
        }
      }
    };

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    sock.on("project:joined", onJoined);
    sock.on("project:finished", onFinished);
    sock.on("project:error", onProjectError);
    sock.on("connect_error", onConnectError);
    sock.on("error", onConnectError);
    if (!sock.connected) sock.connect();

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.off("project:joined", onJoined);
      sock.off("project:finished", onFinished);
      sock.off("project:error", onProjectError);
      sock.off("connect_error", onConnectError);
      sock.off("error", onConnectError);
      // do not disconnect here; keep singleton alive for other pages
    };
  }, [activeId]);

  return { connected, finished, project, error };
}
