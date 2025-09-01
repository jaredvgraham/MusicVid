import React, { useEffect, useRef, useState } from "react";
import { FileVideo } from "lucide-react";

type Props = {
  projectName: string;
  setProjectName: (v: string) => void;
  lyrics: string;
  setLyrics: (v: string) => void;
  showLyrics: boolean;
  setShowLyrics: (v: boolean) => void;
  onSubmitSplit: (fd: FormData) => Promise<void>;
  isUploading: boolean;
  uploadError: string | null;
  setUploadError: (v: string | null) => void;
  userId: string;
  setLastFileName: (v: string | null) => void;
  allowed: boolean;
  onShowUpgrade: () => void;
};

export default function VideoOnlyFlow(props: Props): React.ReactElement {
  const {
    projectName,
    setProjectName,
    lyrics,
    setLyrics,
    showLyrics,
    setShowLyrics,
    onSubmitSplit,
    isUploading,
    uploadError,
    setUploadError,
    userId,
    setLastFileName,
    allowed,
    onShowUpgrade,
  } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const allowedVideo = [
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-matroska",
  ];

  const MAX_DURATION_SECONDS = 60 * 10; // 10 minutes

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        const cleanup = () => {
          URL.revokeObjectURL(url);
          video.removeAttribute("src");
          try {
            video.load();
          } catch {}
        };
        const onLoaded = () => {
          const d = Number(video.duration);
          cleanup();
          resolve(d);
        };
        const onError = () => {
          cleanup();
          reject(new Error("Failed to read video duration"));
        };
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
        video.addEventListener("error", onError, { once: true });
        video.src = url;
      } catch (e) {
        reject(e as Error);
      }
    });
  };

  const validate = (file: File): string | null => {
    if (!allowedVideo.includes(file.type)) {
      return "Unsupported video format. Please upload MP4, MOV, WEBM or MKV.";
    }
    if (!projectName.trim()) return "Please enter a project name.";
    return null;
  };

  const start = async (file: File) => {
    const err = validate(file);
    if (err) {
      setUploadError(err);
      return;
    }
    setUploadError(null);
    setLastFileName(file.name);

    const fd = new FormData();
    fd.append("upload_flow", "video-only");
    fd.append("video_file", file, file.name);
    fd.append("model", "htdemucs");
    fd.append("user_id", userId);
    fd.append("name", projectName.trim());
    if (lyrics.trim()) fd.append("lyrics", lyrics.trim());
    await onSubmitSplit(fd);
  };

  const onUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const duration = await getVideoDuration(file);
      if (!Number.isFinite(duration) || duration > MAX_DURATION_SECONDS) {
        setUploadError("Video must be 10 minutes or less.");
        e.target.value = "";
        return;
      }
      setPendingVideo(file);
      setLastFileName(file.name);
    } catch {
      setUploadError("Could not read video duration. Please try another file.");
      e.target.value = "";
      return;
    }
    e.target.value = "";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      try {
        const duration = await getVideoDuration(file);
        if (!Number.isFinite(duration) || duration > MAX_DURATION_SECONDS) {
          setUploadError("Video must be 10 minutes or less.");
          return;
        }
        setLastFileName(file.name);
        setPendingVideo(file);
      } catch {
        setUploadError("Could not read video duration. Please try another file.");
        return;
      }
    }
  };

  // Create/revoke preview URL for selected video
  useEffect(() => {
    if (!pendingVideo) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }
    const url = URL.createObjectURL(pendingVideo);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pendingVideo]);

  return (
    <div className="grid gap-4">
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
          onClick={() => setShowLyrics(!showLyrics)}
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
            placeholder="Optional notes or corrections (we auto‑transcribe)"
            rows={6}
            className="mt-3 w-full rounded-md border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70"
          />
        )}
      </div>

      {/* Video uploader */}
      <div className="mt-8 grid place-items-center">
        <label
          htmlFor="video-upload"
          onDragEnter={onDragOver}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`group relative grid w-full place-items-center rounded-3xl border-2 border-dashed text-center transition-all duration-300 ${
            isDragging
              ? "border-fuchsia-400/60 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 scale-105 shadow-2xl shadow-fuchsia-500/25"
              : "border-white/20 bg-gradient-to-br from-white/5 via-white/3 to-transparent hover:border-white/40 hover:bg-gradient-to-br hover:from-white/10 hover:via-white/5 hover:to-transparent hover:scale-102"
          }`}
        >
          {/* Background gradient overlay */}
          <div
            className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
              isDragging
                ? "bg-gradient-to-br from-fuchsia-500/5 via-purple-500/5 to-indigo-500/5 opacity-100"
                : "bg-gradient-to-br from-white/5 via-white/3 to-transparent opacity-0 group-hover:opacity-100"
            }`}
          />

          {/* Animated border glow */}
          <div
            className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
              isDragging
                ? "ring-4 ring-fuchsia-400/20"
                : "ring-0 group-hover:ring-2 group-hover:ring-white/10"
            }`}
          />

          <div className="relative z-10 grid place-items-center text-white px-8 py-6">
            {/* Enhanced icon container */}
            <div
              className={`grid h-20 w-20 place-items-center rounded-2xl transition-all duration-300 ${
                isDragging
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg shadow-fuchsia-500/25 scale-110"
                  : "bg-gradient-to-r from-white/10 to-white/5 group-hover:bg-gradient-to-r group-hover:from-white/15 group-hover:to-white/10 group-hover:scale-105"
              }`}
            >
              <FileVideo
                className={`h-8 w-8 transition-all duration-300 ${
                  isDragging
                    ? "text-white scale-110"
                    : "text-purple-300 group-hover:text-purple-200"
                }`}
                strokeWidth={2}
              />
            </div>

            {/* Enhanced text with better spacing */}
            <div className="mt-6 text-center space-y-2">
              <p
                className={`text-xl font-semibold transition-all duration-300 ${
                  isDragging
                    ? "text-fuchsia-200"
                    : "text-white group-hover:text-white/90"
                }`}
              >
                {isDragging
                  ? "Drop your video here!"
                  : "Drop your video here or click to browse"}
              </p>
              <p className="text-sm text-white/70">
                Supports MP4, MOV, WEBM, MKV
              </p>
            </div>

            {/* Enhanced equalizer animation with better spacing */}
            <div
              className={`mt-6 eq transition-all duration-300 ${
                isDragging ? "scale-110" : "group-hover:scale-105"
              }`}
              aria-hidden
            >
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </div>

            {/* Upload hint with better positioning */}
            <div className="mt-6 text-xs text-white/50">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Click or drag & drop to upload
              </span>
            </div>
          </div>

          {/* Floating particles when dragging - positioned better */}
          {isDragging && (
            <>
              <div className="absolute top-6 left-6 h-2 w-2 rounded-full bg-fuchsia-400 animate-ping" />
              <div
                className="absolute top-12 right-8 h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute bottom-8 left-10 h-1 w-1 rounded-full bg-indigo-400 animate-ping"
                style={{ animationDelay: "1s" }}
              />
            </>
          )}

          <input
            ref={fileInputRef}
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={onUploadChange}
            className="sr-only"
          />
        </label>

        {/* Enhanced file preview with better spacing */}
        {pendingVideo && (
          <div className="mt-8 w-full max-w-2xl">
            {previewUrl && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-transparent shadow-xl">
                <div className="p-6">
                  <video
                    src={previewUrl}
                    controls
                    preload="metadata"
                    className="w-full rounded-xl"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-sm text-white/70 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center">
                      <FileVideo className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span
                        className="font-medium text-white truncate block"
                        title={pendingVideo.name}
                      >
                        {pendingVideo.name}
                      </span>
                      <span className="text-xs text-white/60">
                        {(pendingVideo.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">
                      <svg
                        className="h-3 w-3"
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
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (!allowed) {
                    onShowUpgrade();
                    return;
                  }
                  if (pendingVideo) start(pendingVideo);
                }}
                disabled={isUploading}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:from-fuchsia-600 hover:to-purple-600 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    Start Processing
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPendingVideo(null);
                  setPreviewUrl(null);
                  setUploadError(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-medium text-white transition-all hover:bg-white/20 hover:scale-105"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="mt-2 rounded-md border border-red-500/20 bg-red-950/40 p-3 text-sm text-red-200">
          {uploadError}
        </p>
      )}
    </div>
  );
}
