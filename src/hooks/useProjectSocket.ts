// hooks/useProjectSocket.ts
"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import { Project, Line, Word } from "../types";
import { useRouter } from "next/navigation";

interface Status {
  id: string;
  status: string;
  progress: number;
}

export function useProjectSocket(projectId: string | null) {
  const [connected, setConnected] = useState(false);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState<Status>({
    id: projectId ?? "",
    status: "isolating vocals",
    progress: 0,
  });
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [persistedId, setPersistedId] = useState<string | null>(null);
  const router = useRouter();
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

  // Reset state when projectId changes
  useEffect(() => {
    if (projectId) {
      setFinished(false);
      setError(null);
      setStatus({
        id: projectId,
        status: "isolating vocals",
        progress: 0,
      });
    }
  }, [projectId]);

  const activeId = projectId ?? persistedId;

  useEffect(() => {
    const sock = getSocket();
    if (!sock || !activeId) return;

    console.log("Setting up socket for project:", activeId);

    // check if the project is already completed and do not join if it is
    const checkCompleted = async () => {
      const response = await fetch("/api/complete/" + activeId);
      const data = await response.json();
      if (data.completed) {
        setFinished(true);
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem("mv:projectId");
          } catch {}
        }
      }
    };

    const onConnect = () => {
      console.log("onConnect");
      setConnected(true);
      setError(null); // Clear any previous errors
      console.log("Emitting project:join for:", activeId);
      sock.emit("project:join", { projectId: activeId });
    };
    const onConnectError = (err: any) => {
      const msg = typeof err?.message === "string" ? err.message : String(err);
      console.log("socket connect_error", msg);
      setError(msg);
      setConnected(false);

      // Retry connection after a delay
      setTimeout(() => {
        if (sock && !sock.connected) {
          console.log("Retrying connection...");
          sock.connect();
        }
      }, 2000);
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
    const onJoined = () => {
      console.log("Joined project room:", activeId);
    };
    const onFinished = (payload: any) => {
      if (payload?.id === activeId) {
        setFinished(true);
        // Normalize transcript to Line[] regardless of server payload shape
        const t = payload?.transcript as unknown;
        let lines: Line[] = [];
        if (
          Array.isArray(t) &&
          t.length > 0 &&
          typeof t[0] === "object" &&
          "words" in (t[0] as any)
        ) {
          lines = t as Line[];
        } else if (Array.isArray(t)) {
          const words = t as Word[];
          const start = words.length
            ? Math.min(...words.map((w) => w.start))
            : 0;
          const end = words.length ? Math.max(...words.map((w) => w.end)) : 0;
          lines = [{ start, end, words }];
        }
        const normalized: Project = {
          ...(payload as Project),
          transcript: lines,
        };
        console.log("onFinished", normalized);
        // setProject(normalized);
        // Success: clear persisted id so we don't auto-join next load
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem("mv:projectId");
          } catch {}
        }
        router.push(`/workspace/${activeId}`);
      }
    };
    const onStatus = (payload: any) => {
      if (payload?.id === activeId) {
        console.log("Status update received:", payload);
        setStatus(payload);
      }
    };

    // Set up event listeners first
    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    sock.on("project:joined", onJoined);
    sock.on("project:finished", onFinished);
    sock.on("project:error", onProjectError);
    sock.on("project:status", onStatus);
    sock.on("connect_error", onConnectError);
    sock.on("error", onConnectError);

    // Connect immediately if not connected, or join project if already connected
    if (!sock.connected) {
      console.log("Socket not connected, connecting...");
      sock.connect();
    } else {
      // If already connected, join the project room immediately
      console.log("Socket already connected, joining project:", activeId);
      setConnected(true);
      sock.emit("project:join", { projectId: activeId });
    }

    checkCompleted();

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.off("project:joined", onJoined);
      sock.off("project:finished", onFinished);
      sock.off("project:error", onProjectError);
      sock.off("project:status", onStatus);
      sock.off("connect_error", onConnectError);
      sock.off("error", onConnectError);
      // do not disconnect here; keep singleton alive for other pages
    };
  }, [activeId, router]);

  return { connected, finished, project, error, status };
}
