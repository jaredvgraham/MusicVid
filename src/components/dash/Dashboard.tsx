"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type ClientProject = {
  _id: string;
  name?: string;

  song?: string;
  timeCreated: string | number | Date;
  failed?: boolean;
  video?: string;
};

type FinalRender = {
  _id: string;
  name?: string;
  video?: string; // preferred key
  url?: string; // fallback key if API uses 'url'
  createdAt?: string | number | Date;
  timeCreated?: string | number | Date; // fallback if API mirrors projects
};

const Dashboard = (): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<ClientProject | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string>("");
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Final renders state (supports either objects or plain URL strings)
  const [finalRenders, setFinalRenders] = useState<Array<FinalRender | string>>([]);
  const [finalError, setFinalError] = useState<string | null>(null);
  const [isRefreshingFinal, setIsRefreshingFinal] = useState<boolean>(false);

  const router = useRouter();
  const loadProjects = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message =
          data?.error?.message ?? `Request failed: ${response.status}`;
        throw new Error(message);
      }
      console.log(response);
      const data = await response.json();
      if (data.error) {
        setError(data.error.message);
        setProjects([]);
      } else {
        setProjects(data.projects);
      }
    } catch (error: unknown) {
      setProjects([]);
      setError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  const loadFinalRenders = useCallback(async () => {
    try {
      setFinalError(null);
      const response = await fetch("/api/dashboard/final-renders");
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message =
          (data as any)?.error?.message ?? `Request failed: ${response.status}`;
        throw new Error(message);
      }
      const data = await response.json();
      if ((data as any).error) {
        setFinalError((data as any).error.message);
        setFinalRenders([]);
      } else {
        // Accept either { urls: string[] } | { renders: [...] } | direct array
        const renders = (data as any).urls ?? (data as any).urls ?? data;
        setFinalRenders(Array.isArray(renders) ? renders : []);
      }
    } catch (error: unknown) {
      setFinalRenders([]);
      setFinalError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadProjects(), loadFinalRenders()]);
      setLoading(false);
    };
    init();
  }, [loadProjects, loadFinalRenders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProjects();
    setIsRefreshing(false);
  };

  const handleRefreshFinal = async () => {
    setIsRefreshingFinal(true);
    await loadFinalRenders();
    setIsRefreshingFinal(false);
  };

  const requestDelete = (p: ClientProject) => {
    setDeleteTarget(p);
    setDeleteConfirm("");
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      const res = await fetch(`/api/dashboard/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message || `Failed: ${res.status}`);
      }
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
      setDeleteConfirm("");
    } catch (e: any) {
      setDeleteError(e?.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      (p.name ?? p.song ?? "untitled").toLowerCase().includes(q)
    );
  }, [projects, query]);

  const formatDate = (value: string | number | Date): string => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Unknown date";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <HeaderSection
          query={query}
          setQuery={setQuery}
          onRefresh={handleRefresh}
          isRefreshing={true}
          projectCount={0}
          router={router}
        />
        <SkeletonGrid />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <HeaderSection
          query={query}
          setQuery={setQuery}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          projectCount={projects.length}
          router={router}
        />
        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-950/30 p-4 text-red-200">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <HeaderSection
        query={query}
        setQuery={setQuery}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        projectCount={projects.length}
        router={router}
      />

      {filteredProjects.length === 0 ? (
        <EmptyState hasProjects={projects.length > 0} router={router} />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const hasVideo = Boolean(
              project.video && String(project.video).trim().length > 0
            );
            return (
              <article
                key={project._id}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-4 transition hover:border-white/20 hover:bg-neutral-900/60"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
                {hasVideo && (
                  <div className="mt-3 aspect-video w-full overflow-hidden rounded-md bg-black">
                    <video
                      key={`${project._id}-${project.video}`}
                      src={project.video}
                      className="h-full w-full"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                )}
                <div className="mt-3 flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white group-hover:text-white/90">
                    {project.name ?? "Untitled"}
                  </h3>
                  {project.failed ? (
                    <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-300 ring-1 ring-inset ring-red-500/20">
                      Failed
                    </span>
                  ) : hasVideo ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-500/20">
                      Processing
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  {formatDate(project.timeCreated)}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    onClick={() => router.push(`/workspace/${project._id}`)}
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
                      <path d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                    Open Workspace
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white/90"
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
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Export
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                      onClick={() => requestDelete(project)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Final Renders Section */}
      <div className="mt-10 border-t border-white/10 pt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Final renders</h2>
            <p className="text-sm text-neutral-400">
              {finalRenders.length} {finalRenders.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={handleRefreshFinal}
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
            disabled={isRefreshingFinal}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isRefreshingFinal ? "animate-spin opacity-80" : "opacity-80"}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
            </svg>
            Refresh
          </button>
        </div>

        {finalError && (
          <div className="rounded-lg border border-red-500/20 bg-red-950/30 p-4 text-red-200">
            Error: {finalError}
          </div>
        )}

        {finalRenders.length === 0 && !finalError ? (
          <div className="rounded-lg border border-white/10 bg-neutral-900/40 p-6 text-sm text-neutral-300">
            No final renders yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {finalRenders.map((item, idx) => {
              const r: any = item as any;
              const videoSrc =
                typeof item === "string"
                  ? String(item)
                  : (r.video && String(r.video)) || (r.url && String(r.url)) || "";
              const when = (r?.createdAt ?? r?.timeCreated) as any;
              const key = (r?._id as string) || (r?.id as string) || (videoSrc ? `video:${videoSrc}` : `idx:${idx}`);
              const name = (r?.name as string) || "Final render";
              return (
                <article
                  key={key}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-4"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
                  <div className="mt-3 aspect-video w-full overflow-hidden rounded-md bg-black">
                    {videoSrc ? (
                      <video
                        key={`video-${key}`}
                        src={videoSrc}
                        className="h-full w-full"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-neutral-400">No video</div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-white">
                      {name}
                      <div className="text-xs text-neutral-400">{when ? formatDate(when) : ""}</div>
                    </div>
                    {videoSrc && (
                      <a
                        className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white/90"
                        href={videoSrc}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl ring-1 ring-red-500/30">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-500" />
            <div className="p-5 text-white">
              <h3 className="text-lg font-semibold">Delete project</h3>
              <p className="mt-2 text-sm text-white/80">
                Type the project name to confirm deletion. This action cannot be
                undone.
              </p>
              <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-3 text-sm">
                <div className="text-white/70">Project</div>
                <div className="font-medium">
                  {deleteTarget.name ?? "Untitled"}
                </div>
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Type project name"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="mt-3 w-full rounded-md border border-white/10 bg-neutral-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70"
              />
              {deleteError && (
                <div className="mt-2 rounded border border-red-500/20 bg-red-950/40 p-2 text-xs text-red-200">
                  {deleteError}
                </div>
              )}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                  onClick={confirmDelete}
                  disabled={
                    deleting ||
                    deleteConfirm.trim() !== (deleteTarget.name ?? "Untitled")
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleting ? "Deleting…" : "Confirm delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function HeaderSection({
  query,
  setQuery,
  onRefresh,
  isRefreshing,
  projectCount,
  router,
}: {
  query: string;
  setQuery: (v: string) => void;
  onRefresh: () => void | Promise<void>;
  isRefreshing: boolean;
  projectCount: number;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage your music video projects in one place.
        </p>
        <div className="mt-2 inline-flex items-center gap-2 text-xs text-neutral-400">
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">
            {projectCount} projects
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="search"
            placeholder="Search projects..."
            className="w-full rounded-md border border-white/10 bg-neutral-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-900/70"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
            disabled={isRefreshing}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                isRefreshing ? "animate-spin opacity-80" : "opacity-80"
              }
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
            </svg>
            Refresh
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90 cursor-pointer"
            onClick={() => router.push("/upload")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New project
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-4"
        >
          <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-600" />
          <div className="mt-4 h-4 w-3/5 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/10" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
            <div className="h-8 w-24 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasProjects,
  router,
}: {
  hasProjects: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="mt-12 grid place-items-center rounded-2xl border border-white/10 bg-neutral-900/40 p-10 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600" />
        <h2 className="mt-4 text-lg font-semibold text-white">
          {hasProjects ? "No matches" : "No projects yet"}
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          {hasProjects
            ? "Try adjusting your search query."
            : "Create your first project to get started."}
        </p>
        <div
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90 cursor-pointer"
          onClick={() => router.push("/upload")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New project
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
