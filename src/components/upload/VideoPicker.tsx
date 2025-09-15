"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

type VideoPickerProps = {
  selectedVideo: string | null;
  onChange: (url: string | null) => void;
  initialQuery?: string;
  className?: string;
  title?: string;
  isWorkspace?: boolean;
};

export function VideoPicker({
  selectedVideo,
  onChange,
  initialQuery = "cinematic",
  className,
  title = "Select a background video (optional)",
  isWorkspace = false,
}: VideoPickerProps): React.ReactElement {
  const [videos, setVideos] = useState<string[]>([]);
  const [query, setQuery] = useState<string>(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_PIXELBAY_API_KEY;

  useEffect(() => {
    fetchVideos(debouncedQuery);
  }, [debouncedQuery]);

  const fetchVideos = async (q: string) => {
    console.log("fetching videos", q, page);

    if (page === 3) {
      setError("maximum refreshes for this search try changing the query");
      return;
    }
    setPage((prev) => prev + 1);

    try {
      setLoading(true);
      const response = await fetch(
        `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(
          q
        )}&video_type=film&per_page=41&page=${page}`
      );
      if (!response.ok) {
        setVideos([]);
        return;
      }

      const data = await response.json();
      console.log("data", data.hits);

      const filtered = data.hits.filter((hit: any) => {
        const { width, height } = hit.videos.medium;
        // block anything larger than 1920x1080
        return width <= 1920 && height <= 1080;
      });

      setVideos(
        filtered.map((hit: any) => {
          console.log("hit", hit);
          return hit.videos.tiny.url;
        })
      );
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-medium text-white/90">{title}</h2>
        {error && <div className="text-xs text-red-500">{error}</div>}
        <form
          className="flex w-full items-center gap-2 sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            setDebouncedQuery(query);
            setPage(1);
            setError(null);
          }}
        >
          <input
            type="search"
            placeholder="Search videos (e.g., cinematic, nature)"
            className="w-full rounded-md border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70 sm:w-64"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
              setError(null);
            }}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
          <button
            type="button"
            onClick={() => {
              fetchVideos(query);
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? "Loading…" : "More"}
          </button>
        </form>
      </div>

      {loading ? (
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
              role="group"
              tabIndex={0}
              onClick={() => setPreviewUrl(url)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPreviewUrl(url);
                }
              }}
              className={`relative overflow-hidden rounded-md border transition cursor-pointer ${
                selectedVideo === url
                  ? "border-purple-400/70 ring-2 ring-purple-400 shadow-[0_0_0_3px_rgba(168,85,247,0.35)]"
                  : "border-white/10 hover:border-white/20"
              } ${selectedVideo && selectedVideo !== url ? "opacity-60" : ""}`}
              title={url}
            >
              <video
                src={url}
                muted
                loop
                playsInline
                autoPlay
                className="aspect-video w-full object-cover"
              />
              <button
                type="button"
                className="absolute left-1.5 bottom-1.5 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-white/15"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(selectedVideo === url ? null : url);
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
              <h3 id="preview-title" className="text-base font-semibold">
                Video preview
              </h3>
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
                    if (previewUrl) onChange(previewUrl);
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
