"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { LoadingSpinner } from "../ui/LoadingSpinner";

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
  const { finished, project, error } = useProjectSocket(projectId);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastFileName, setLastFileName] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const { userId } = useAuth();
  const [hasId, setHasId] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoQuery, setVideoQuery] = useState<string>("cinematic");
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [noVideoWarnOpen, setNoVideoWarnOpen] = useState<boolean>(false);
  const [confirmUploadFile, setConfirmUploadFile] = useState<File | null>(null);
  const [debouncedVideoQuery, setDebouncedVideoQuery] = useState<string>(
    "cinematic"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchVideos = useCallback(async (q: string) => {
    try {
      setVideosLoading(true);
      const response = await fetch(
        `https://pixabay.com/api/videos/?key=${
          process.env.NEXT_PUBLIC_PIXELBAY_API_KEY
        }&q=${encodeURIComponent(q)}&video_type=film&per_page=21`
      );
      if (!response.ok) {
        console.error("Failed to fetch videos");
        console.error(response);
        setVideos([]);
        return;
      }
      const data = await response.json();
      setVideos(data.hits.map((hit: any) => hit.videos.medium.url));
    } catch (e) {
      console.error(e);
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  }, []);

  // Debounce the video query so we only fetch after the user pauses typing
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedVideoQuery(videoQuery), 500);
    return () => clearTimeout(handle);
  }, [videoQuery]);

  // Preserve spinner on refresh if a pending project id exists in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const persisted = window.localStorage.getItem("mv:projectId");
    if (persisted) setHasId(true);
    fetchVideos(debouncedVideoQuery);
  }, [fetchVideos, debouncedVideoQuery]);

  const processFile = async (file: File, force: boolean = false) => {
    const allowed = [
      "audio/wav",
      "audio/x-wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/flac",
      "audio/aac",
      "audio/m4a",
      "audio/ogg",
    ];
    if (!allowed.includes(file.type)) {
      setUploadError(
        "Unsupported file format. Please upload WAV, MP3, FLAC, M4A, AAC or OGG."
      );
      return;
    }

    if (!projectName.trim()) {
      setUploadError("Please enter a project name.");
      return;
    }

    try {
      if (!selectedVideo && !force) {
        setConfirmUploadFile(file);
        setNoVideoWarnOpen(true);
        return;
      }
      setIsUploading(true);
      setUploadError(null);
      setLastFileName(file.name);

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("model", "htdemucs"); // kept for compatibility per API
      formData.append("user_id", userId || "");
      formData.append("name", projectName.trim());
      if (selectedVideo) formData.append("video_url", selectedVideo);
      if (lyrics.trim()) formData.append("lyrics", lyrics.trim());

      const response = await fetch(
        "https://extractor-production-721a.up.railway.app/split",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        // Attempt to parse JSON error; fall back to text
        let message = "Failed to process audio file.";
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
      setPendingFile(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const onUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setLastFileName(file.name);
    // reset input so same file can be reselected
    event.target.value = "";
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      setLastFileName(file.name);
      setPendingFile(file);
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
              <LoadingSpinner />
              <div>
                <p className="font-medium text-white">Processing your audio…</p>
                <p className="text-sm text-white/60">{lastFileName ?? ""}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
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
                Name it, optionally add lyrics, then upload your song.
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

          {/* Fields */}
          <div className="mt-6 grid gap-4">
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-white"
              >
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Summer Vibes"
                className="mt-1 w-full rounded-md border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowLyrics((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-80"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {showLyrics ? "Hide lyrics" : "Add lyrics (optional)"}
              </button>
              {showLyrics && (
                <textarea
                  id="lyrics"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Paste lyrics here (optional)"
                  rows={6}
                  className="mt-3 w-full rounded-md border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70"
                />
              )}
            </div>
          </div>

          {/* Drop area with subtle equalizer */}
          <div className="mt-8 grid place-items-center">
            <label
              htmlFor="audio-upload"
              onDragEnter={onDragOver}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`group relative grid h-36 w-full max-w-xl place-items-center rounded-xl border border-dashed text-center transition ${
                isDragging
                  ? "border-emerald-400/60 bg-emerald-400/5"
                  : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <div className="grid place-items-center text-white px-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    width="20"
                    height="20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-white/80">
                  Drop audio here or click to browse
                </p>
                <div className="mt-2 eq" aria-hidden>
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={onUploadChange}
                className="sr-only"
              />
            </label>
            {lastFileName && (
              <p className="mt-3 max-w-[28rem] truncate text-xs text-white/60">
                Selected: {lastFileName}
              </p>
            )}
            {pendingFile && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => pendingFile && processFile(pendingFile)}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Upload file
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingFile(null);
                    setLastFileName(null);
                  }}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Clear
                </button>
              </div>
            )}

            {isUploading && (
              <div className="mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
              </div>
            )}

            {uploadError && (
              <p className="mt-4 rounded-md border border-red-500/20 bg-red-950/40 p-3 text-sm text-red-200">
                {uploadError}
              </p>
            )}

            {/* Background video selector */}
            <div className="mt-10 w-full">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-medium text-white/90">
                  Select a background video (optional)
                </h2>
                <form
                  className="flex w-full items-center gap-2 sm:w-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchVideos(videoQuery);
                  }}
                >
                  <input
                    type="search"
                    placeholder="Search videos (e.g., cinematic, nature)"
                    className="w-full rounded-md border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70 sm:w-64"
                    value={videoQuery}
                    onChange={(e) => setVideoQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-50"
                    disabled={videosLoading}
                  >
                    {videosLoading ? "Searching…" : "Search"}
                  </button>
                </form>
              </div>
              {videosLoading ? (
                <div className="rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                  Searching videos…
                </div>
              ) : videos.length === 0 ? (
                <div className="rounded-md border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                  Loading sample videos…
                </div>
              ) : (
                <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                  {videos.map((url, idx) => (
                    <div
                      key={`${idx}-${url}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setPreviewUrl(url)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPreviewUrl(url);
                        }
                      }}
                      aria-selected={selectedVideo === url}
                      className={`relative overflow-hidden rounded-md border transition cursor-pointer ${
                        selectedVideo === url
                          ? "border-purple-400/70 ring-2 ring-purple-400 shadow-[0_0_0_3px_rgba(168,85,247,0.35)]"
                          : "border-white/10 hover:border-white/20"
                      } ${
                        selectedVideo && selectedVideo !== url
                          ? "opacity-60"
                          : ""
                      }`}
                      title={url}
                    >
                      <video
                        src={url}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        className="aspect-video w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute left-1.5 bottom-1.5 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-white/15"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo((prev) => (prev === url ? null : url));
                        }}
                      >
                        {selectedVideo === url ? "Unselect" : "Select"}
                      </button>
                      {selectedVideo === url && (
                        <>
                          <div className="pointer-events-none absolute inset-0 bg-purple-500/10" />
                          <div className="pointer-events-none absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-purple-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="-mt-[1px]"
                            >
                              <path
                                d="M20 6L9 17l-5-5"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Selected
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {noVideoWarnOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="no-video-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setNoVideoWarnOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl ring-1 ring-purple-500/30 enter">
            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
            <div className="p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-purple-600/20 p-2 text-purple-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 9v4m0 4h.01M10.29 3.86l-8.48 14.7A2 2 0 0 0 3.52 22h16.96a2 2 0 0 0 1.71-3.44l-8.48-14.7a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 id="no-video-title" className="text-lg font-semibold">No background video selected</h3>
                  <p className="mt-1.5 text-sm text-white/70">
                    Uploads may take longer because an AI video will be generated. To speed this up, select a background video. You can also continue without one.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 px-3 py-2 text-xs font-medium text-white shadow hover:brightness-110"
                  onClick={() => setNoVideoWarnOpen(false)}
                >
                  Select video
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/15"
                  onClick={() => {
                    const f = confirmUploadFile || pendingFile;
                    if (f) {
                      setNoVideoWarnOpen(false);
                      processFile(f, true);
                    }
                  }}
                >
                  Continue anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setPreviewUrl(null)}
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl ring-1 ring-purple-500/30 enter">
            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
            <div className="p-4 sm:p-5 text-white">
              <h3 id="preview-title" className="text-base font-semibold">Video preview</h3>
              <div className="mt-3 overflow-hidden rounded-md bg-black">
                <video
                  src={previewUrl}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full"
                />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/15"
                  onClick={() => setPreviewUrl(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600 px-3 py-2 text-xs font-medium text-white shadow hover:brightness-110"
                  onClick={() => {
                    setSelectedVideo(previewUrl);
                    setPreviewUrl(null);
                  }}
                >
                  Use this video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconUpload({
  className = "h-5 w-5",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
