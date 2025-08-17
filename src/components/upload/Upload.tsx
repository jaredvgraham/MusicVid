"use client";

import React, { useEffect, useState } from "react";
import { Film, Music2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { VideoOnlyFlow, VideoAndSongFlow, SongOnlyFlow } from "./flows";

function Animations(): React.ReactElement {
  return (
    <style jsx global>{`
      /* Subtle one-time entry animation */
      .enter {
        animation: fadeInUp 600ms ease-out both;
      }
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(8px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Ongoing equalizer animation */
      .eq {
        display: inline-flex;
        align-items: flex-end;
        gap: 4px;
        height: 14px;
      }
      .eq-bar {
        width: 3px;
        height: 10px;
        border-radius: 9999px;
        background: linear-gradient(
          180deg,
          rgba(240, 171, 252, 0.9),
          rgba(129, 140, 248, 0.9)
        );
        transform-origin: bottom;
        animation: equalize 1.4s ease-in-out infinite;
      }
      .eq-bar:nth-child(2) {
        animation-delay: 0.15s;
      }
      .eq-bar:nth-child(3) {
        animation-delay: 0.3s;
      }
      .eq-bar:nth-child(4) {
        animation-delay: 0.45s;
      }
      .eq-bar:nth-child(5) {
        animation-delay: 0.6s;
      }
      @keyframes equalize {
        0% {
          transform: scaleY(0.5);
        }
        25% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(0.6);
        }
        75% {
          transform: scaleY(0.9);
        }
        100% {
          transform: scaleY(0.5);
        }
      }

      /* Futuristic card shimmer + glow (not used now) */
      .option-shine {
        position: absolute;
        inset: -1px;
        background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(255, 255, 255, 0.22) 50%,
          transparent 100%
        );
        transform: translateX(-100%);
        pointer-events: none;
        border-radius: 0.75rem; /* match rounded-xl */
        opacity: 0.4;
      }
      .glow-pulse {
      }

      /* Animated gradient frame for option cards (disabled motion) */
      .animated-gradient {
        background-size: 200% 200% !important;
      }

      /* Soft grid background behind selector */
      .grid-bg {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.06) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.06) 1px,
            transparent 1px
          );
        background-size: 40px 40px;
        mask-image: radial-gradient(
          ellipse at center,
          black 40%,
          transparent 70%
        );
        opacity: 0.4;
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
  const { finished, project, error, status } = useProjectSocket(projectId);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastFileName, setLastFileName] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const { userId } = useAuth();
  const [hasId, setHasId] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [mode, setMode] = useState<"video-only" | "both" | "song-only">(
    "song-only"
  );

  // Preserve spinner on refresh if a pending project id exists in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const persisted = window.localStorage.getItem("mv:projectId");
    if (persisted) setHasId(true);
  }, []);

  const submitSplit = async (formData: FormData) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const response = await fetch(
        "https://extractor-production-721a.up.railway.app/split",
        {
          method: "POST",
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
      console.log("data", data);
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
      <div className="mx-auto mt-12 max-w-3xl px-4 enter">
        <Animations />
        <p className="rounded-lg border border-red-500/20 bg-red-950/40 p-4 text-red-200">
          {error}
        </p>
      </div>
    );
  }

  if (!finished && hasId) {
    return (
      <div className="relative mx-auto mt-12 max-w-3xl px-4 enter">
        <Animations />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/3 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
          <div className="absolute -bottom-1/3 left-1/3 h-[35rem] w-[35rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl ring-1 ring-white/10 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <LoadingSpinner>{`${Math.round(
                status?.progress ?? 0
              )}%`}</LoadingSpinner>
              <div>
                <p className="font-medium text-white">
                  {status?.status ?? "Processing your audio…"}
                </p>
                <p className="text-sm text-white/60">{lastFileName ?? ""}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, Math.round(status?.progress ?? 0))
                  )}%`,
                }}
              />
            </div>
            <div className="mt-3 text-xs text-white/50">
              This can take a minute. You can leave this page open.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished && project?.video) {
    return (
      <div className="mx-auto mt-12 max-w-3xl px-4 enter">
        <Animations />
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur">
          <video src={project.video} controls className="w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-12 max-w-6xl px-4 enter">
      <Animations />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-1/4 left-1/4 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl ring-1 ring-white/10 backdrop-blur">
        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                New Project
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Choose a mode below, then provide your media.
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60">
                Secure
              </span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60">
                Lossless
              </span>
            </div>
          </div>

          {/* Mode selector & flows */}
          <div className="mt-6 grid gap-6">
            <div>
              <label className="block text-sm font-medium text-white">
                What are you uploading?
              </label>
              <div className="mt-1 h-0.5 w-16 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
              <div className="relative mt-4">
                <div className="grid-bg" />
                <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* Card 1 */}
                  <button
                    type="button"
                    onClick={() => setMode("song-only")}
                    className="group relative rounded-xl p-[1px] text-left"
                    aria-pressed={mode === "song-only"}
                  >
                    <div
                      className={`rounded-xl bg-gradient-to-r ${
                        mode === "song-only"
                          ? "from-indigo-500/30 via-violet-500/30 to-fuchsia-500/30"
                          : "from-white/10 via-white/5 to-white/10"
                      }`}
                    >
                      <div
                        className={`relative rounded-[11px] bg-neutral-900/60 p-4 transition ${
                          mode === "song-only"
                            ? "ring-1 ring-indigo-300/30"
                            : "hover:bg-neutral-900/70 hover:ring-1 hover:ring-white/10"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/80">
                            <Music2
                              className="h-[18px] w-[18px] text-purple-300"
                              strokeWidth={1.8}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white text-center">
                              {`Song (choose a video)`}
                            </div>
                            <div className="mt-0.5 text-xs text-white/60 text-center">
                              Upload a song and pick a background video.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Card 2 */}
                  <button
                    type="button"
                    onClick={() => setMode("both")}
                    className="group relative rounded-xl p-[1px] text-left"
                    aria-pressed={mode === "both"}
                  >
                    <div
                      className={`rounded-xl bg-gradient-to-r ${
                        mode === "both"
                          ? "from-cyan-500/30 via-teal-500/30 to-emerald-500/30"
                          : "from-white/10 via-white/5 to-white/10"
                      }`}
                    >
                      <div
                        className={`relative rounded-[11px] bg-neutral-900/60 p-4 transition ${
                          mode === "both"
                            ? "ring-1 ring-cyan-300/30"
                            : "hover:bg-neutral-900/70 hover:ring-1 hover:ring-white/10"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/80">
                              <Film
                                className="h-4 w-4 text-purple-300"
                                strokeWidth={1.8}
                              />
                            </div>
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/80">
                              <Music2
                                className="h-4 w-4 text-purple-300"
                                strokeWidth={1.8}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-white text-center">
                              Video & Audio
                            </div>
                            <div className="mt-0.5 text-xs text-white/60 text-center">
                              {`Upload both files and we’ll sync them.`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Card 3 */}
                  <button
                    type="button"
                    onClick={() => setMode("video-only")}
                    className="group relative rounded-xl p-[1px] text-left"
                    aria-pressed={mode === "video-only"}
                  >
                    <div
                      className={`rounded-xl bg-gradient-to-r ${
                        mode === "video-only"
                          ? "from-fuchsia-500/30 via-purple-500/30 to-indigo-500/30"
                          : "from-white/10 via-white/5 to-white/10"
                      }`}
                    >
                      <div
                        className={`relative rounded-[11px] bg-neutral-900/60 p-4 transition ${
                          mode === "video-only"
                            ? "ring-1 ring-fuchsia-400/30"
                            : "hover:bg-neutral-900/70 hover:ring-1 hover:ring-white/10"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/80">
                            <Film
                              className="h-[18px] w-[18px] text-purple-300"
                              strokeWidth={1.8}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white text-center">
                              Video with Audio
                            </div>
                            <div className="mt-0.5 text-xs text-white/60 text-center">
                              Upload your own video containing the audio.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
