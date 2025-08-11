"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { LoadingSpinner } from "../ui/LoadingSpinner";

function Animations(): React.ReactElement {
  return (
    <style jsx global>{`
      /* Subtle one-time entry animation */
      .enter { animation: fadeInUp 600ms ease-out both; }
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      /* Ongoing equalizer animation */
      .eq { display: inline-flex; align-items: flex-end; gap: 4px; height: 14px; }
      .eq-bar {
        width: 3px;
        height: 10px;
        border-radius: 9999px;
        background: linear-gradient(180deg, rgba(240,171,252,.9), rgba(129,140,248,.9));
        transform-origin: bottom;
        animation: equalize 1.4s ease-in-out infinite;
      }
      .eq-bar:nth-child(2) { animation-delay: 0.15s; }
      .eq-bar:nth-child(3) { animation-delay: 0.3s; }
      .eq-bar:nth-child(4) { animation-delay: 0.45s; }
      .eq-bar:nth-child(5) { animation-delay: 0.6s; }
      @keyframes equalize {
        0% { transform: scaleY(0.5); }
        25% { transform: scaleY(1); }
        50% { transform: scaleY(0.6); }
        75% { transform: scaleY(0.9); }
        100% { transform: scaleY(0.5); }
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .enter { animation: none; }
        .eq-bar { animation: none; }
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

  // Preserve spinner on refresh if a pending project id exists in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const persisted = window.localStorage.getItem("mv:projectId");
    if (persisted) setHasId(true);
  }, []);

  const processFile = async (file: File) => {
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
      setIsUploading(true);
      setUploadError(null);
      setLastFileName(file.name);

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("model", "htdemucs"); // kept for compatibility per API
      formData.append("user_id", userId || "");
      formData.append("project_name", projectName.trim());
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
    await processFile(file);
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
      await processFile(file);
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
            <div className="mt-3 text-xs text-white/50">This can take a minute. You can leave this page open.</div>
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
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">New Project</h1>
              <p className="mt-1 text-sm text-white/60">Name it, optionally add lyrics, then upload your song.</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60">Secure</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60">Lossless</span>
            </div>
          </div>

          {/* Fields */}
          <div className="mt-6 grid gap-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-white">Project Name</label>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
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
                  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-white/80">Drop audio here or click to browse</p>
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
              <p className="mt-3 max-w-[28rem] truncate text-xs text-white/60">Selected: {lastFileName}</p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Get started
              </button>
              <span className="text-xs text-white/40">No account needed</span>
            </div>

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
          </div>
        </div>
      </div>
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