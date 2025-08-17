import React, { useRef, useState } from "react";

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
  } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const allowedVideo = [
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-matroska",
  ];

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

  const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingVideo(file);
    setLastFileName(file.name);
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
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setLastFileName(file.name);
      setPendingVideo(file);
    }
  };

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
            placeholder="Paste lyrics here (optional)"
            rows={6}
            className="mt-3 w-full rounded-md border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70"
          />
        )}
      </div>

      {/* Video uploader */}
      <div className="mt-2 grid place-items-center">
        <label
          htmlFor="video-upload"
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
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 0 0 002 2h12a2 2 0 0 0 002-2v-2" />
              </svg>
            </div>
            <p className="mt-2 text-sm text-white/80">
              Drop video here or click to browse
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
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={onUploadChange}
            className="sr-only"
          />
        </label>
        {pendingVideo && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => pendingVideo && start(pendingVideo)}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Use this video
            </button>
            <button
              type="button"
              onClick={() => setPendingVideo(null)}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Clear
            </button>
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
