"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Project } from "@/types";
import { createPortal } from "react-dom";
import { getSocket } from "@/lib/socket";

import { VideoPanel } from "@/features/workspace/components/VideoPanel";
import { VideoControls } from "@/features/workspace/components/VideoControls";

import { ControlsBar } from "@/features/workspace/components/ControlsBar";
import { Toolbox } from "@/features/workspace/components/Toolbox";
import { Timeline } from "@/features/workspace/components/Timeline";
import { EditorProvider } from "@/features/workspace/state/EditorContext";

import { VideoPicker } from "@/components/upload/VideoPicker";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { useFinalRender } from "@/hooks/useFinalRender";
// import { getEditorSocket } from "@/lib/editorSocket";

type WorkspaceResponse = { project: Project };

export default function WorkspacePage(): React.ReactElement {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const authFetch = useAuthFetch();
  const projectId = params?.id ?? null;
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const { connected, error, status } = useProjectSocket(projectId ?? "");

  const {
    isRendering,
    renderError,
    renderProgress,
    renderStatus,
    videoFinal,
    isComplete,
    connected: renderConnected,
    startRender,
  } = useFinalRender(projectId);
  // const [serverLines, setServerLines] = useState<Line[]>([]);
  // const [draftWords, setDraftWords] = useState<Word[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean>(true);
  const [remainingFinalRenders, setRemainingFinalRenders] = useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  // Fetch workspace data
  useEffect(() => {
    const check = async () => {
      const response = await fetch("/api/usage-check?action=finalRender");
      const data = await response.json();
      setAllowed(data.allowed);
      setRemainingFinalRenders(data.finalRenders);
    };
    check();
    let mounted = true;
    async function run() {
      if (!projectId) return;
      setLoading(true);
      setFetchError(null);
      try {
        const res = await authFetch<WorkspaceResponse>(
          "express",
          `workspace/${projectId}`
        );
        console.log("res", res.project);
        console.log("res.project.transcript", res.project.video);
        if (!mounted) return;
        setProject(res.project);
      } catch (e: any) {
        setFetchError(e?.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  // Final render state is now managed by useFinalRender hook

  const onPickVideo = async (url: string | null) => {
    if (!projectId || !url) return;
    setSelectedVideo(url);
    try {
      const res = await authFetch<{ video: string }>(
        "express",
        `render/${projectId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video_url: url }),
        }
      );
      console.log("res", res);

      const busted = `${res.video}${
        res.video.includes("?") ? "&" : "?"
      }t=${Date.now()}`;
      setProject((prev) => (prev ? { ...prev, video: busted } : prev));
    } catch (e: any) {
      setFetchError(e?.message || "Failed to update video");
    }
  };

  // const onChangeWord = useCallback(
  //   (index: number, field: keyof Word, value: string) => {
  //     setDraftWords((prev) => {
  //       const next = [...prev];
  //       const w = { ...next[index] };
  //       if (field === "text") w.text = value;
  //       if (field === "start") w.start = Number(value);
  //       if (field === "end") w.end = Number(value);
  //       next[index] = w;
  //       return next;
  //     });
  //   },
  //   []
  // );

  // const onRenderFinal = useCallback(async () => {
  //   if (!projectId) return;
  //   setSaving(true);
  //   setError(null);
  //   try {
  //     // Rebuild Line[] from current edited words, preserving original line grouping
  //     const template = serverLines;
  //     const words = draftWords;
  //     let cursor = 0;
  //     const rebuilt: Line[] = template.map((ln) => {
  //       const count = ln.words.length;
  //       const slice = words.slice(cursor, cursor + count);
  //       cursor += count;
  //       const start = slice.length
  //         ? Math.min(...slice.map((w) => w.start))
  //         : ln.start;
  //       const end = slice.length
  //         ? Math.max(...slice.map((w) => w.end))
  //         : ln.end;
  //       return { start, end, words: slice.length ? slice : ln.words };
  //     });
  //     if (cursor < words.length && rebuilt.length > 0) {
  //       const rest = words.slice(cursor);
  //       const last = rebuilt[rebuilt.length - 1];
  //       rebuilt[rebuilt.length - 1] = {
  //         start: Math.min(last.start, ...rest.map((w) => w.start)),
  //         end: Math.max(last.end, ...rest.map((w) => w.end)),
  //         words: [...last.words, ...rest],
  //       };
  //     }

  //     const res = await authFetch<WorkspaceResponse>(
  //       "next",
  //       `workspace/${projectId}`
  //       ,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ transcript: rebuilt }),
  //       }
  //     );

  //     setProject(res.project);
  //   } catch (e: any) {
  //     setError(e?.message || "Failed to render final video");
  //   } finally {
  //     setSaving(false);
  //   }
  // }, [projectId, draftWords, serverLines, authFetch]);

  const onFinalRender = useCallback(() => {
    if (!projectId) return;
    if (!allowed) {
      setShowUpgradeModal(true);
      return;
    }
    setSaving(true);
    setFetchError(null);

    try {
      // Start final render using the dedicated hook
      startRender();
      console.log("Final render started");
    } catch (e: any) {
      console.error("Final render error:", e);
      setFetchError(e?.message || "Failed to start final render");
      setSaving(false);
    }
  }, [projectId, allowed, startRender]);

  // Handle final render completion
  useEffect(() => {
    if (isComplete && videoFinal) {
      setSaving(false);
      // Navigate to result page with video URL as query parameter
      console.log(
        "Final render completed, navigating to result page with video:",
        videoFinal
      );
      router.push(
        `/result/${projectId}?video=${encodeURIComponent(videoFinal)}`
      );
    }
  }, [isComplete, videoFinal, projectId, router]);

  if (!projectId) return <div className="p-6">No project id</div>;
  if (loading) return <div className="p-6">Loading workspace…</div>;
  if (fetchError) return <div className="p-6 text-red-400">{fetchError}</div>;
  if (!project) return <div className="p-6">Not found</div>;

  return (
    <EditorProvider project={project} initialTranscript={project.transcript}>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-7xl p-4 space-y-4">
          <ControlsBar />

          {/* Connection Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className={connected ? "text-green-400" : "text-red-400"}>
                Project: {connected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  renderConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={renderConnected ? "text-green-400" : "text-red-400"}
              >
                Render: {renderConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {(!connected || !renderConnected) && (
              <button
                onClick={() => {
                  const sock = getSocket();
                  if (sock && !sock.connected) {
                    sock.connect();
                  }
                }}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Reconnect
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <VideoPanel />

              <VideoControls />

              <Timeline />
            </div>
            <div className="hidden md:block space-y-4">
              <Toolbox />
              <VideoPicker
                selectedVideo={selectedVideo}
                onChange={onPickVideo}
                isWorkspace={true}
              />

              <div className="mt-4 rounded border border-white/10 p-3 text-sm text-white/50">
                Final render is produced server-side from the sanitized
                transcript. Drag to adjust timings, then Save & Render.
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  disabled={isRendering}
                  onClick={onFinalRender}
                  className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                >
                  {isRendering ? `${renderStatus}...` : "Render Final Video"}
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white"
                >
                  Back
                </button>
                <span
                  className={`ml-2 self-center text-xs ${
                    allowed ? "text-white/60" : "text-amber-300"
                  }`}
                  title="Final renders remaining in this billing period"
                >
                  {remainingFinalRenders} final render
                  {remainingFinalRenders === 1 ? "" : "s"} left
                </span>
              </div>

              {/* Render Progress and Status */}
              {isRendering && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{renderStatus}</span>
                    <span className="text-white/60">{renderProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Render Error */}
              {renderError && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="text-red-400 text-sm">{renderError}</div>
                  <button
                    onClick={() => startRender()}
                    className="mt-2 text-xs text-red-300 hover:text-red-300 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showUpgradeModal &&
        isClient &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setShowUpgradeModal(false)}
            />
            <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl ring-1 ring-purple-500/40">
              <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
              <div className="p-6 sm:p-8 text-white">
                <h3 className="text-xl font-semibold">
                  Final render not available
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  You’ve used all final renders allowed on your current plan for
                  this billing period.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90 hover:bg-white/15"
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    Not now
                  </button>
                  <a
                    href="/pricing"
                    className="rounded-md bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:brightness-110"
                  >
                    See plans & upgrade
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </EditorProvider>
  );
}

// Inline video overlay implementation replaced by modular VideoPanel
