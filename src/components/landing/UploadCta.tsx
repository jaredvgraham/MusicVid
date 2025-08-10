"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Project } from "@/types";

interface UploadCtaProps {
  setProjectId: (projectId: string) => void;
  finished: boolean;
  project: Project;
  error: string | null;
}

export default function UploadCta({
  setProjectId,
  finished,
  project,
  error,
}: UploadCtaProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { userId } = useAuth();
  const [hasId, setHasId] = useState(false);

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

    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("model", "htdemucs"); // kept for compatibility per API
      formData.append("user_id", userId || "");

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
      console.log("data", data);
      console.log("data.id", data.id);
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
      await processFile(file);
    }
  };

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-2xl">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!finished && hasId) {
    return (
      <div className="mx-auto mt-10 max-w-2xl">
        <LoadingSpinner />
      </div>
    );
  }

  if (finished && project.video) {
    return (
      <div className="mx-auto mt-10 max-w-2xl">
        <video src={project.video} controls className="w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <label
        htmlFor="audio-upload"
        onDragEnter={onDragOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`group block cursor-pointer rounded-2xl border border-dashed p-6 text-left shadow-lg ring-1 transition ${
          isDragging
            ? "border-emerald-400/60 bg-emerald-400/5 ring-emerald-400/20"
            : "border-white/15 bg-white/5 ring-white/10 hover:border-white/25 hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-white">
            <IconUpload className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">
              Drop your song here, or click to browse
            </p>
            <p className="text-sm text-white/60">
              WAV, MP3, FLAC, M4A, AAC or OGG up to 100MB
            </p>
          </div>
        </div>
        <input
          id="audio-upload"
          type="file"
          accept="audio/*"
          onChange={onUploadChange}
          className="sr-only"
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            disabled={isUploading}
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-neutral-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUploading ? "Processing…" : "Get started"}
          </button>
          <span className="text-xs text-white/40">No account needed</span>
        </div>
        {uploadError && (
          <p className="mt-3 text-sm text-red-400">{uploadError}</p>
        )}
      </label>
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
