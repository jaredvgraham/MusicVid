import React, { useEffect, useRef, useState } from "react";

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

  const onAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAudio(file);
    setLastFileName(file.name);
    e.target.value = "";
  };
  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingVideo(file);
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
  const onDropAudio = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAudio(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setLastFileName(file.name);
      setPendingAudio(file);
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
  const onDropVideo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setPendingVideo(file);
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
            placeholder="Paste lyrics here (optional)"
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
          className={`group relative grid h-36 w-full max-w-xl place-items-center rounded-xl border border-dashed text-center transition ${
            isDraggingAudio
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
            ref={audioInputRef}
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={onAudioChange}
            className="sr-only"
          />
        </label>
        {pendingAudio && (
          <div className="mt-3 w-full max-w-xl overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <audio src={audioUrl ?? undefined} controls className="w-full" />
            <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-xs text-white/70">
              <span className="truncate" title={pendingAudio.name}>
                {pendingAudio.name}
              </span>
              <span>{(pendingAudio.size / 1024 / 1024).toFixed(1)} MB</span>
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
          className={`group relative grid h-36 w-full max-w-xl place-items-center rounded-xl border border-dashed text-center transition ${
            isDraggingVideo
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
            ref={videoInputRef}
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={onVideoChange}
            className="sr-only"
          />
        </label>
        {pendingVideo && (
          <div className="mt-3 w-full max-w-xl overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <video
              src={videoUrl ?? undefined}
              controls
              preload="metadata"
              className="w-full"
            />
            <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-xs text-white/70">
              <span className="truncate" title={pendingVideo.name}>
                {pendingVideo.name}
              </span>
              <span>{(pendingVideo.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="mt-2 rounded-md border border-red-500/20 bg-red-950/40 p-3 text-sm text-red-200">
          {uploadError}
        </p>
      )}

      <div className="mt-2">
        <button
          type="button"
          onClick={start}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Upload both and continue
        </button>
      </div>
    </div>
  );
}
