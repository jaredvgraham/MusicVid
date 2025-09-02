"use client";

import React, { useEffect, useState } from "react";
import {
  Film,
  Music2,
  Upload as UploadIcon,
  Sparkles,
  Zap,
  Crown,
  Shield,
} from "lucide-react";
import { useAuth, useSession } from "@clerk/nextjs";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { VideoOnlyFlow, VideoAndSongFlow, SongOnlyFlow } from "./flows";
import { createPortal } from "react-dom";
import { getSocket } from "@/lib/socket";

function Animations(): React.ReactElement {
  return (
    <style jsx global>{`
      /* Subtle one-time entry animation */
      .enter {
        animation: fadeInUp 800ms ease-out both;
      }
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Enhanced equalizer animation */
      .eq {
        display: inline-flex;
        align-items: flex-end;
        gap: 3px;
        height: 16px;
      }
      .eq-bar {
        width: 4px;
        height: 12px;
        border-radius: 9999px;
        background: linear-gradient(
          180deg,
          rgba(240, 171, 252, 0.9),
          rgba(129, 140, 248, 0.9)
        );
        transform-origin: bottom;
        animation: equalize 1.6s ease-in-out infinite;
      }
      .eq-bar:nth-child(2) {
        animation-delay: 0.2s;
      }
      .eq-bar:nth-child(3) {
        animation-delay: 0.4s;
      }
      .eq-bar:nth-child(4) {
        animation-delay: 0.6s;
      }
      .eq-bar:nth-child(5) {
        animation-delay: 0.8s;
      }
      @keyframes equalize {
        0% {
          transform: scaleY(0.3);
        }
        25% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(0.7);
        }
        75% {
          transform: scaleY(0.9);
        }
        100% {
          transform: scaleY(0.3);
        }
      }

      /* Enhanced grid background */
      .grid-bg {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.08) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.08) 1px,
            transparent 1px
          );
        background-size: 50px 50px;
        mask-image: radial-gradient(
          ellipse at center,
          black 50%,
          transparent 80%
        );
        opacity: 0.3;
        pointer-events: none;
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .enter {
          animation: none;
        }
        .eq-bar {
          animation: none;
        }
      }
    `}</style>
  );
}

export default function Upload(): React.ReactElement {
  const [projectId, setProjectId] = useState<string | null>(null);
  const { connected, finished, project, error, status } =
    useProjectSocket(projectId);
  // Project socket state

  // Debug: log when projectId changes
  useEffect(() => {
    // ProjectId changed
  }, [projectId]);

  // Debug: log status updates from project socket
  useEffect(() => {
    // Status update
  }, [status]);

  // Debug: log connection state
  useEffect(() => {
    // Socket connected
  }, [connected]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastFileName, setLastFileName] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const { userId, getToken } = useAuth();
  const [hasId, setHasId] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [remainingProjects, setRemainingProjects] = useState<number>(0);
  const { session } = useSession();
  const [allowed, setAllowed] = useState<boolean>(true);
  const [mode, setMode] = useState<"video-only" | "both" | "song-only">(
    "song-only"
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // // Preserve spinner on refresh if a pending project id exists in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const persisted = window.localStorage.getItem("mv:projectId");
    if (persisted) setHasId(true);
    const check = async () => {
      const response = await fetch("/api/usage-check?action=project");
      const data = await response.json();
      setRemainingProjects(data.projects);
      setAllowed(data.allowed);
    };
    check();
  }, []);

  const submitSplit = async (formData: FormData) => {
    // Form data submitted
    try {
      setIsUploading(true);
      setUploadError(null);
      const token = await session?.getToken();

      const headers: Record<string, string> = {};
      if (token) {
        // Don't set Content-Type for FormData - let the browser set it with boundary
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RAILWAY_API_URL}split`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );
      if (!response.ok) {
        let message = "Failed to start processing.";
        try {
          const errJson = await response.json();
          if (errJson?.detail) message = errJson.detail;
        } catch {
          const errText = await response.text();
          if (errText) message = errText;
        }
        throw new Error(message);
      }
      const data = await response.json();
      // Upload response data
      setHasId(true);
      setProjectId(data.id || data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-4xl px-6 enter">
        <Animations />
        <div className="rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/10 p-8 text-center backdrop-blur">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-200 mb-2">
            Processing Error
          </h2>
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  if (!finished && hasId) {
    return (
      <div className="relative mx-auto mt-16 max-w-4xl px-6 enter">
        <Animations />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/3 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
          <div className="absolute -bottom-1/3 left-1/3 h-[35rem] w-[35rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div className="p-8">
            {/* Connection Status */}
            <div className="mb-4 flex items-center gap-2 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className={connected ? "text-green-400" : "text-red-400"}>
                {connected ? "Connected" : "Connecting..."}
              </span>
              {!connected && (
                <button
                  onClick={() => {
                    const sock = getSocket();
                    if (sock && !sock.connected) {
                      sock.connect();
                    }
                  }}
                  className="ml-2 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Reconnect
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <LoadingSpinner>{`${Math.round(
                  status?.progress ?? 0
                )}%`}</LoadingSpinner>
                <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-1">
                  {status?.status ?? "Processing your audio…"}
                </h2>
                <p className="text-white/70">{lastFileName ?? ""}</p>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="mb-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 transition-all duration-500 shadow-lg"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Math.round(status?.progress ?? 0))
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-white/60">Processing...</span>
                <span className="text-white/80 font-medium">
                  {Math.round(status?.progress ?? 0)}%
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-3 text-white/70">
                <div className="eq">
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                </div>
                <span className="text-sm">
                  This can take a few minutes. You can leave this page open.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished && project?.video) {
    return (
      <div className="mx-auto mt-16 max-w-4xl px-6 enter">
        <Animations />
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Processing Complete!
              </h2>
              <p className="text-white/70 text-sm">
                Your video is ready to view and download.
              </p>
            </div>
          </div>
          <video src={project.video} controls className="w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-16 max-w-7xl px-6 enter">
      <Animations />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-1/4 left-1/4 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-white mb-3">
          Create New Project
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Upload your content and get started with AI-powered video creation
        </p>
      </div>

      {/* Main Upload Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <div className="p-8 sm:p-10">
          {/* Header with Stats */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Choose Your Creation Mode
              </h2>
              <p className="mt-2 text-white/70">
                Select how you want to create your lyric video or enhanced
                content
              </p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 backdrop-blur">
                <Shield className="w-3 h-3 inline mr-1" />
                Secure
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 backdrop-blur">
                <Zap className="w-3 h-3 inline mr-1" />
                Fast
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 backdrop-blur">
                <Crown className="w-3 h-3 inline mr-1" />
                Premium
              </span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="mb-10">
            <label className="block text-lg font-semibold text-white mb-4">
              What are you creating today?
            </label>

            <div className="relative">
              <div className="grid-bg" />
              <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Song Only Mode */}
                <button
                  type="button"
                  onClick={() => setMode("song-only")}
                  className={`group relative rounded-2xl p-[2px] text-left transition-all duration-300 ${
                    mode === "song-only" ? "scale-105" : "hover:scale-102"
                  }`}
                  aria-pressed={mode === "song-only"}
                >
                  <div
                    className={`rounded-2xl bg-gradient-to-r ${
                      mode === "song-only"
                        ? "from-indigo-500/40 via-violet-500/40 to-fuchsia-500/40 shadow-lg shadow-indigo-500/25"
                        : "from-white/10 via-white/5 to-white/10"
                    }`}
                  >
                    <div
                      className={`relative rounded-[14px] bg-neutral-900/80 p-6 transition-all duration-300 ${
                        mode === "song-only"
                          ? "ring-2 ring-indigo-400/40"
                          : "hover:bg-neutral-900/90 hover:ring-1 hover:ring-white/20"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 ${
                            mode === "song-only"
                              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-lg"
                              : "bg-white/10"
                          }`}
                        >
                          <Music2
                            className="h-6 w-6 text-white"
                            strokeWidth={2}
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg mb-2">
                            Song + Video Template
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            Upload a full song and get auto-timed lyrics with
                            stunning video templates and backgrounds.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Both Mode */}
                <button
                  type="button"
                  onClick={() => setMode("both")}
                  className={`group relative rounded-2xl p-[2px] text-left transition-all duration-300 ${
                    mode === "both" ? "scale-105" : "hover:scale-102"
                  }`}
                  aria-pressed={mode === "both"}
                >
                  <div
                    className={`rounded-2xl bg-gradient-to-r ${
                      mode === "both"
                        ? "from-cyan-500/40 via-teal-500/40 to-emerald-500/40 shadow-lg shadow-cyan-500/25"
                        : "from-white/10 via-white/5 to-white/10"
                    }`}
                  >
                    <div
                      className={`relative rounded-[14px] bg-neutral-900/80 p-6 transition-all duration-300 ${
                        mode === "both"
                          ? "ring-2 ring-cyan-400/40"
                          : "hover:bg-neutral-900/90 hover:ring-1 hover:ring-white/20"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 ${
                              mode === "both"
                                ? "bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg"
                                : "bg-white/10"
                            }`}
                          >
                            <Film
                              className="h-5 w-5 text-white"
                              strokeWidth={2}
                            />
                          </div>
                          <div
                            className={`grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 ${
                              mode === "both"
                                ? "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg"
                                : "bg-white/10"
                            }`}
                          >
                            <Music2
                              className="h-5 w-5 text-white"
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg mb-2">
                            Video + Audio Sync
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            Upload both files and we&apos;ll perfectly sync them
                            together with AI-powered timing and lyrics.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Video Only Mode */}
                <button
                  type="button"
                  onClick={() => setMode("video-only")}
                  className={`group relative rounded-2xl p-[2px] text-left transition-all duration-300 ${
                    mode === "video-only" ? "scale-105" : "hover:scale-102"
                  }`}
                  aria-pressed={mode === "video-only"}
                >
                  <div
                    className={`rounded-2xl bg-gradient-to-r ${
                      mode === "video-only"
                        ? "from-fuchsia-500/40 via-purple-500/40 to-indigo-500/40 shadow-lg shadow-fuchsia-500/25"
                        : "from-white/10 via-white/5 to-white/10"
                    }`}
                  >
                    <div
                      className={`relative rounded-[14px] bg-neutral-900/80 p-6 transition-all duration-300 ${
                        mode === "video-only"
                          ? "ring-2 ring-fuchsia-400/40"
                          : "hover:bg-neutral-900/90 hover:ring-1 hover:ring-white/20"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 ${
                            mode === "video-only"
                              ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg"
                              : "bg-white/10"
                          }`}
                        >
                          <Film
                            className="h-6 w-6 text-white"
                            strokeWidth={2}
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-white text-lg mb-2">
                            Video containing audio
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            Upload your own video containing a song or audio. We
                            will auto-generate lyrics/captions and sync them to
                            the video.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Flow Components */}
          <div className="space-y-8">
            {mode === "video-only" && (
              <VideoOnlyFlow
                projectName={projectName}
                setProjectName={setProjectName}
                lyrics={lyrics}
                setLyrics={setLyrics}
                showLyrics={showLyrics}
                setShowLyrics={setShowLyrics}
                onSubmitSplit={submitSplit}
                isUploading={isUploading}
                uploadError={uploadError}
                setUploadError={setUploadError}
                userId={userId || ""}
                setLastFileName={setLastFileName}
                allowed={allowed}
                onShowUpgrade={() => setShowUpgradeModal(true)}
              />
            )}
            {mode === "both" && (
              <VideoAndSongFlow
                projectName={projectName}
                setProjectName={setProjectName}
                lyrics={lyrics}
                setLyrics={setLyrics}
                showLyrics={showLyrics}
                setShowLyrics={setShowLyrics}
                selectedVideo={null}
                setSelectedVideo={() => {}}
                onSubmitSplit={submitSplit}
                isUploading={isUploading}
                uploadError={uploadError}
                setUploadError={setUploadError}
                userId={userId || ""}
                setLastFileName={setLastFileName}
                allowed={allowed}
                onShowUpgrade={() => setShowUpgradeModal(true)}
              />
            )}
            {mode === "song-only" && (
              <SongOnlyFlow
                projectName={projectName}
                setProjectName={setProjectName}
                lyrics={lyrics}
                setLyrics={setLyrics}
                showLyrics={showLyrics}
                setShowLyrics={setShowLyrics}
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
                onSubmitSplit={submitSplit}
                isUploading={isUploading}
                uploadError={uploadError}
                setUploadError={setUploadError}
                userId={userId || ""}
                setLastFileName={setLastFileName}
                allowed={allowed}
                onShowUpgrade={() => setShowUpgradeModal(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Upgrade Modal */}
      {showUpgradeModal &&
        isClient &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowUpgradeModal(false)}
            />
            <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-2xl ring-1 ring-purple-500/40">
              <div className="h-2 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
              <div className="p-8 text-white">
                <div className="flex items-start gap-6">
                  <div className="mt-1 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 p-4 text-white">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">
                      You&apos;ve reached your monthly limit
                    </h3>
                    <p className="text-white/80 leading-relaxed mb-6">
                      You&apos;ve used all projects allowed on your current plan
                      for this billing period. Upgrade to unlock unlimited
                      projects, faster processing, and premium features.
                    </p>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white/90 hover:bg-white/20 transition-all"
                        onClick={() => setShowUpgradeModal(false)}
                      >
                        Maybe Later
                      </button>
                      <a
                        href="/pricing"
                        className="rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-fuchsia-600 hover:to-purple-600 transition-all hover:scale-105"
                      >
                        View Plans & Upgrade
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
