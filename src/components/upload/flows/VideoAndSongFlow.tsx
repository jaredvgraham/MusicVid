import React, { useEffect, useRef, useState } from "react";
import { FileAudio, FileVideo } from "lucide-react";

type Props = {
  projectName: string;
  setProjectName: (v: string) => void;
  lyrics: string;
  setLyrics: (v: string) => void;
  showLyrics: boolean;
  setShowLyrics: (v: boolean) => void;
  selectedVideo: null;
  setSelectedVideo: (v: string | null) => void;
  onSubmitSplit: (fd: FormData) => Promise<void>;
  isUploading: boolean;
  uploadError: string | null;
  setUploadError: (v: string | null) => void;
  userId: string;
  setLastFileName: (v: string | null) => void;
  allowed: boolean;
  onShowUpgrade: () => void;
};

export default function VideoAndSongFlow(props: Props): React.ReactElement {
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

  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingAudio, setPendingAudio] = useState<File | null>(null);
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const allowedAudio = [
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/flac",
    "audio/aac",
    "audio/m4a",
    "audio/ogg",
  ];
  const allowedVideo = [
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-matroska",
  ];

  const MAX_DURATION_SECONDS = 60 * 10; // 10 minutes

  const getMediaDuration = (file: File, type: "audio" | "video"): Promise<number> => {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        const el = document.createElement(type);
        el.preload = "metadata";
        const cleanup = () => {
          URL.revokeObjectURL(url);
          el.removeAttribute("src");
          try { el.load(); } catch {}
        };
        const onLoaded = () => { const d = Number((el as any).duration); cleanup(); resolve(d); };
        const onError = () => { cleanup(); reject(new Error("Failed to read duration")); };
        el.addEventListener("loadedmetadata", onLoaded, { once: true });
        el.addEventListener("error", onError, { once: true });
        (el as HTMLMediaElement).src = url;
      } catch (e) { reject(e as Error); }
    });
  };

  const validate = (): string | null => {
    if (!projectName.trim()) return "Please enter a project name.";
    if (!pendingAudio) return "Please add a song file.";
    if (!pendingVideo) return "Please add a video file.";
    if (pendingAudio && !allowedAudio.includes(pendingAudio.type)) {
      return "Unsupported audio format. Please upload WAV, MP3, FLAC, M4A, AAC or OGG.";
    }
    if (pendingVideo && !allowedVideo.includes(pendingVideo.type)) {
      return "Unsupported video format. Please upload MP4, MOV, WEBM or MKV.";
    }
    return null;
  };

  const start = async () => {
    const err = validate();
    if (err) {
      setUploadError(err);
      return;
    }
    setUploadError(null);
    if (pendingAudio) setLastFileName(pendingAudio.name);

    const fd = new FormData();
    fd.append("upload_flow", "both");
    fd.append("file", pendingAudio!, pendingAudio!.name);
    fd.append("video_file", pendingVideo!, pendingVideo!.name);
    fd.append("model", "htdemucs");
    fd.append("user_id", userId);
    fd.append("name", projectName.trim());
    if (lyrics.trim()) fd.append("lyrics", lyrics.trim());
    await onSubmitSplit(fd);
  };

  const onAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const duration = await getMediaDuration(file, "audio");
      if (!Number.isFinite(duration) || duration > MAX_DURATION_SECONDS) {
        setUploadError("Audio must be 10 minutes or less.");
        e.target.value = "";
        return;
      }
      setPendingAudio(file);
      setLastFileName(file.name);
    } catch {
      setUploadError("Could not read audio duration. Please try another file.");
      e.target.value = "";
      return;
    }
    e.target.value = "";
  };
  const onVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const duration = await getMediaDuration(file, "video");
      if (!Number.isFinite(duration) || duration > MAX_DURATION_SECONDS) {
        setUploadError("Video must be 10 minutes or less.");
        e.target.value = "";
        return;
      }
      setPendingVideo(file);
    } catch {
      setUploadError("Could not read video duration. Please try another file.");
      e.target.value = "";
      return;
    }
    e.target.value = "";
  };

  const onDragOverAudio = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAudio(true);
  };
  const onDragLeaveAudio = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAudio(false);
  };
  const onDropAudio = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAudio(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      try {
        const duration = await getMediaDuration(file, "audio");
        if (!Number.isFinite(duration) || duration > MAX_DURATION_SECONDS) {
          setUploadError("Audio must be 10 minutes or less.");
          return;
        }
        setLastFileName(file.name);
        setPendingAudio(file);
      } catch {
        setUploadError("Could not read audio duration. Please try another file.");
        return;
      }
    }
  };

  const onDragOverVideo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(true);
  };
  const onDragLeaveVideo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
  };
  const onDropVideo = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      try {
        const duration = await getMediaDuration(file, "video");
        if (!Number.isFinite(duration) || duration > MAX_DURATION_SECONDS) {
          setUploadError("Video must be 10 minutes or less.");
          return;
        }
        setPendingVideo(file);
      } catch {
        setUploadError("Could not read video duration. Please try another file.");
        return;
      }
    }
  };

  // Create object URLs for previews and clean up
  useEffect(() => {
    if (pendingAudio) {
      const url = URL.createObjectURL(pendingAudio);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioUrl(null);
    }
  }, [pendingAudio]);
  useEffect(() => {
    if (pendingVideo) {
      const url = URL.createObjectURL(pendingVideo);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoUrl(null);
    }
  }, [pendingVideo]);

  return (
    <div className="grid gap-6">
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

      {/* Audio uploader */}
      <div className="grid place-items-center">
        <label
          htmlFor="audio-upload"
          onDragEnter={onDragOverAudio}
          onDragOver={onDragOverAudio}
          onDragLeave={onDragLeaveAudio}
          onDrop={onDropAudio}
          className={`group relative grid w-full  place-items-center rounded-3xl border-2 border-dashed text-center transition-all duration-300 p-4 ${
            isDraggingAudio
              ? "border-fuchsia-400/60 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 scale-105 shadow-2xl shadow-fuchsia-500/25"
              : "border-white/20 bg-gradient-to-br from-white/5 via-white/3 to-transparent hover:border-white/40 hover:bg-gradient-to-br hover:from-white/10 hover:via-white/5 hover:to-transparent hover:scale-102"
          }`}
        >
          {/* Background gradient overlay */}
          <div
            className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
              isDraggingAudio
                ? "bg-gradient-to-br from-fuchsia-500/5 via-purple-500/5 to-indigo-500/5 opacity-100"
                : "bg-gradient-to-br from-white/5 via-white/3 to-transparent opacity-0 group-hover:opacity-100"
            }`}
          />

          {/* Animated border glow */}
          <div
            className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
              isDraggingAudio
                ? "ring-4 ring-fuchsia-400/20"
                : "ring-0 group-hover:ring-2 group-hover:ring-white/10"
            }`}
          />

          <div className="relative z-10 grid place-items-center text-white px-8">
            {/* Enhanced icon container */}
            <div
              className={`grid h-16 w-16 place-items-center rounded-2xl transition-all duration-300 ${
                isDraggingAudio
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg shadow-fuchsia-500/25 scale-110"
                  : "bg-gradient-to-r from-white/10 to-white/5 group-hover:bg-gradient-to-r group-hover:from-white/15 group-hover:to-white/10 group-hover:scale-105"
              }`}
            >
              <FileAudio
                className={`h-7 w-7 transition-all duration-300 ${
                  isDraggingAudio
                    ? "text-white scale-110"
                    : "text-purple-300 group-hover:text-purple-200"
                }`}
                strokeWidth={2}
              />
            </div>

            {/* Enhanced text */}
            <div className="mt-4 text-center">
              <p
                className={`text-lg font-semibold transition-all duration-300 ${
                  isDraggingAudio
                    ? "text-fuchsia-200"
                    : "text-white group-hover:text-white/90"
                }`}
              >
                {isDraggingAudio
                  ? "Drop your audio here!"
                  : "Drop your audio here or click to browse"}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Supports WAV, MP3, FLAC, M4A, AAC, OGG
              </p>
            </div>

            {/* Enhanced equalizer animation */}
            <div
              className={`mt-4 eq transition-all duration-300 ${
                isDraggingAudio ? "scale-110" : "group-hover:scale-105"
              }`}
              aria-hidden
            >
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </div>

            {/* Upload hint */}
            <div className="mt-4 text-xs text-white/50">
              <span className="inline-flex items-center gap-1">
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

          {/* Floating particles when dragging */}
          {isDraggingAudio && (
            <>
              <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-fuchsia-400 animate-ping" />
              <div
                className="absolute top-8 right-6 h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute bottom-6 left-8 h-1 w-1 rounded-full bg-indigo-400 animate-ping"
                style={{ animationDelay: "1s" }}
              />
            </>
          )}

          <input
            ref={audioInputRef}
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={onAudioChange}
            className="sr-only"
          />
        </label>

        {/* Enhanced file preview */}
        {pendingAudio && (
          <div className="mt-6 w-full max-w-2xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-transparent shadow-xl">
              <div className="p-4">
                <audio
                  src={audioUrl ?? undefined}
                  controls
                  className="w-full rounded-xl"
                />
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-white/70 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center">
                    <FileAudio className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span
                      className="font-medium text-white truncate block"
                      title={pendingAudio.name}
                    >
                      {pendingAudio.name}
                    </span>
                    <span className="text-xs text-white/60">
                      {(pendingAudio.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">
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
          </div>
        )}
      </div>

      {/* Video uploader */}
      <div className="grid place-items-center">
        <label
          htmlFor="video-upload"
          onDragEnter={onDragOverVideo}
          onDragOver={onDragOverVideo}
          onDragLeave={onDragLeaveVideo}
          onDrop={onDropVideo}
          className={`group relative grid w-full place-items-center rounded-3xl border-2 border-dashed text-center transition-all duration-300 p-4 ${
            isDraggingVideo
              ? "border-fuchsia-400/60 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 scale-105 shadow-2xl shadow-fuchsia-500/25"
              : "border-white/20 bg-gradient-to-br from-white/5 via-white/3 to-transparent hover:border-white/40 hover:bg-gradient-to-br hover:from-white/10 hover:via-white/5 hover:to-transparent hover:scale-102"
          }`}
        >
          {/* Background gradient overlay */}
          <div
            className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
              isDraggingVideo
                ? "bg-gradient-to-br from-fuchsia-500/5 via-purple-500/5 to-indigo-500/5 opacity-100"
                : "bg-gradient-to-br from-white/5 via-white/3 to-transparent opacity-0 group-hover:opacity-100"
            }`}
          />

          {/* Animated border glow */}
          <div
            className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
              isDraggingVideo
                ? "ring-4 ring-fuchsia-400/20"
                : "ring-0 group-hover:ring-2 group-hover:ring-white/10"
            }`}
          />

          <div className="relative z-10 grid place-items-center text-white px-8">
            {/* Enhanced icon container */}
            <div
              className={`grid h-16 w-16 place-items-center rounded-2xl transition-all duration-300 ${
                isDraggingVideo
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg shadow-fuchsia-500/25 scale-110"
                  : "bg-gradient-to-r from-white/10 to-white/5 group-hover:bg-gradient-to-r group-hover:from-white/15 group-hover:to-white/10 group-hover:scale-105"
              }`}
            >
              <FileVideo
                className={`h-7 w-7 transition-all duration-300 ${
                  isDraggingVideo
                    ? "text-white scale-110"
                    : "text-purple-300 group-hover:text-purple-200"
                }`}
                strokeWidth={2}
              />
            </div>

            {/* Enhanced text */}
            <div className="mt-4 text-center">
              <p
                className={`text-lg font-semibold transition-all duration-300 ${
                  isDraggingVideo
                    ? "text-fuchsia-200"
                    : "text-white group-hover:text-white/90"
                }`}
              >
                {isDraggingVideo
                  ? "Drop your video here!"
                  : "Drop your video here or click to browse"}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Supports MP4, MOV, WEBM, MKV
              </p>
            </div>

            {/* Enhanced equalizer animation */}
            <div
              className={`mt-4 eq transition-all duration-300 ${
                isDraggingVideo ? "scale-110" : "group-hover:scale-105"
              }`}
              aria-hidden
            >
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </div>

            {/* Upload hint */}
            <div className="mt-4 text-xs text-white/50">
              <span className="inline-flex items-center gap-1">
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

          {/* Floating particles when dragging */}
          {isDraggingVideo && (
            <>
              <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-fuchsia-400 animate-ping" />
              <div
                className="absolute top-8 right-6 h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute bottom-6 left-8 h-1 w-1 rounded-full bg-indigo-400 animate-ping"
                style={{ animationDelay: "1s" }}
              />
            </>
          )}

          <input
            ref={videoInputRef}
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={onVideoChange}
            className="sr-only"
          />
        </label>

        {/* Enhanced file preview */}
        {pendingVideo && (
          <div className="mt-6 w-full max-w-2xl">
            {videoUrl && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-transparent shadow-xl">
                <div className="p-4">
                  <video
                    src={videoUrl}
                    controls
                    preload="metadata"
                    className="w-full rounded-xl"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-white/70 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center">
                      <FileVideo className="h-4 w-4 text-white" />
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
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">
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
          </div>
        )}
      </div>

      {/* Error display */}
      {uploadError && (
        <div className="mt-6 w-full max-w-2xl">
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/10 p-4 text-center">
            <div className="flex items-center gap-3 text-red-200">
              <svg
                className="h-5 w-5 text-red-400"
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
              <span className="text-sm">{uploadError}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => {
            if (!allowed) {
              onShowUpgrade();
              return;
            }
            start();
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
              Upload Both & Continue
            </>
          )}
        </button>
      </div>
    </div>
  );
}
