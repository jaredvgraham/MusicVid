"use client";

import React, { useEffect, useState } from "react";
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
  const [mode, setMode] = useState<"video-only" | "both" | "song-only" | null>(
    null
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
    <div className="relative mx-auto mt-12 max-w-3xl px-4 enter">
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
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setMode("video-only")}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    mode === "video-only"
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  A video that contains a song or words
                </button>
                <button
                  type="button"
                  onClick={() => setMode("both")}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    mode === "both"
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  A video and a song
                </button>
                <button
                  type="button"
                  onClick={() => setMode("song-only")}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    mode === "song-only"
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Just a song (choose a video)
                </button>
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
