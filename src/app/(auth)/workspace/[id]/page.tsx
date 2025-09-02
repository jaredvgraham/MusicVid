"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Project } from "@/types";
import { createPortal } from "react-dom";
import { getSocket } from "@/lib/socket";

import { VideoPanel } from "@/features/workspace/components/video";
import { ControlsBar, Toolbox } from "@/features/workspace/components/controls";
import { Timeline } from "@/features/workspace/components/timeline";
import { EditorProvider } from "@/features/workspace/state/EditorContext";

import { VideoPicker } from "@/components/upload/VideoPicker";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { useFinalRender } from "@/hooks/useFinalRender";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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
  const [showVideos, setShowVideos] = useState(false);

  const { connected, error, status } = useProjectSocket(projectId ?? "");

  const {
    isRendering,
    renderError,
    renderProgress,
    renderStatus,
    videoFinal,
    isComplete,
    connected: renderConnected,
    isCancelling,
    startRender,
    cancelRender,
  } = useFinalRender(projectId);
  // const [serverLines, setServerLines] = useState<Line[]>([]);
  // const [draftWords, setDraftWords] = useState<Word[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [updatingVideo, setUpdatingVideo] = useState(false);
  const [allowed, setAllowed] = useState<boolean>(true);
  const [remainingFinalRenders, setRemainingFinalRenders] = useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showMobileToolbox, setShowMobileToolbox] = useState(false);
  useEffect(() => setIsClient(true), []);
  // Fetch workspace data
  useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch("/api/usage-check?action=finalRender");
        const data = await response.json();
        setAllowed(data.allowed);
        setRemainingFinalRenders(data.finalRenders);
      } catch (e: any) {
        setAllowed(true);
        setRemainingFinalRenders(1);
      }
    };
    check();
    let mounted = true;
    async function run() {
      if (!projectId) return;
      setLoading(true);
      setFetchError(null);
      try {
        const res = await authFetch<WorkspaceResponse>(
          "next",
          `api/workspace/${projectId}`
        );
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
    setUpdatingVideo(true);
    setFetchError(null);
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

      // Force reload after a small delay to ensure state is updated
      window.location.reload();
    } catch (e: any) {
      setFetchError(e?.message || "Failed to update video");
      setUpdatingVideo(false);
    }
  };

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
      router.push(
        `/result/${projectId}?video=${encodeURIComponent(videoFinal)}`
      );
    }
  }, [isComplete, videoFinal, projectId, router]);

  if (!projectId) return <div className="p-6">No project id</div>;
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (fetchError) return <div className="p-6 text-red-400">{fetchError}</div>;
  if (!project) return <div className="p-6">Not found</div>;

  return (
    <EditorProvider project={project} initialTranscript={project.transcript}>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-7xl p-2 sm:p-4 space-y-4">
          <ControlsBar />

          {/* Connection Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
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
                  window.location.reload();
                }}
                className="text-xs text-blue-400 hover:text-blue-300 underline self-start sm:self-auto"
              >
                Reconnect
              </button>
            )}
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="md:hidden space-y-3">
            <VideoPanel />
            <Timeline />
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <VideoPanel />
              <Timeline />
            </div>

            {/* Desktop Sidebar */}
            <div className="space-y-4">
              <Toolbox />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVideos(!showVideos)}
                  className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 cursor-pointer"
                >
                  {showVideos ? "Hide videos" : "Change video?"}
                </button>
              </div>
              {updatingVideo && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <div className="text-white text-sm">Updating video...</div>
                </div>
              )}
              {showVideos && (
                <VideoPicker
                  selectedVideo={selectedVideo}
                  onChange={onPickVideo}
                  isWorkspace={true}
                />
              )}

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
                {isRendering && !isCancelling && (
                  <button
                    onClick={() => cancelRender()}
                    className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white"
                  >
                    cancel
                  </button>
                )}
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

          {/* Mobile Toolbox Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileToolbox(!showMobileToolbox)}
              className="w-full rounded bg-neutral-800 px-4 py-3 text-sm text-white hover:bg-neutral-700 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Tools & Settings</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  showMobileToolbox ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Toolbox Panel */}
          {showMobileToolbox && (
            <div className="md:hidden space-y-4 border-t border-white/10 pt-4">
              <Toolbox />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVideos(!showVideos)}
                  className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 cursor-pointer"
                >
                  {showVideos ? "Hide videos" : "Change video?"}
                </button>
              </div>
              {updatingVideo && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <div className="text-white text-sm">Updating video...</div>
                </div>
              )}
              {showVideos && (
                <VideoPicker
                  selectedVideo={selectedVideo}
                  onChange={onPickVideo}
                  isWorkspace={true}
                />
              )}

              <div className="rounded border border-white/10 p-3 text-sm text-white/50">
                Final render is produced server-side from the sanitized
                transcript. Drag to adjust timings, then Save & Render.
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
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
              </div>
              <div className="text-center">
                <span
                  className={`text-xs ${
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
                <div className="space-y-2">
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
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
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
          )}
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
            <div className="relative z-10 w-full max-w-2xl mx-4 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl ring-1 ring-purple-500/40">
              <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
              <div className="p-4 sm:p-6 lg:p-8 text-white">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Final render not available
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  {`You've used all final renders allowed on your current plan for
                  this billing period.`}
                </p>
                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90 hover:bg-white/15 order-2 sm:order-1"
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    Not now
                  </button>
                  <a
                    href="/pricing"
                    className="rounded-md bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:brightness-110 text-center order-1 sm:order-2"
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
