"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Project, Word } from "@/types";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { EditorProvider } from "@/features/workspace/EditorContext";
import { Timeline } from "@/features/workspace/Timeline";
import { VideoPanel } from "@/features/workspace/VideoPanel";

import { ControlsBar } from "@/features/workspace/ControlsBar";
import { Toolbox } from "@/features/workspace/Toolbox";
import { TextLayersPanel } from "@/features/workspace/TextLayersPanel";

type WorkspaceResponse = { project: Project };

export default function WorkspacePage(): React.ReactElement {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const authFetch = useAuthFetch();
  const projectId = params?.id ?? null;
  const { project: socketProject } = useProjectSocket(projectId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [draft, setDraft] = useState<Word[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch workspace data
  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!projectId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch<WorkspaceResponse>(
          `workspace/${projectId}`
        );
        console.log("res", res.project);
        console.log("res.project.transcript", res.project.video);
        if (!mounted) return;
        setProject(res.project);
        setDraft(res.project.transcript || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  // If socket notifies updated project (e.g., base or final render), reflect it
  useEffect(() => {
    if (socketProject && socketProject.id === projectId) {
      setProject((prev) => ({ ...(prev || socketProject), ...socketProject }));
    }
  }, [socketProject, projectId]);

  const onChangeWord = useCallback(
    (index: number, field: keyof Word, value: string) => {
      setDraft((prev) => {
        const next = [...prev];
        const w = { ...next[index] };
        if (field === "text") w.text = value;
        if (field === "start") w.start = Number(value);
        if (field === "end") w.end = Number(value);
        next[index] = w;
        return next;
      });
    },
    []
  );

  const onRenderFinal = useCallback(async () => {
    if (!projectId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await authFetch<WorkspaceResponse>(`workspace/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: draft }),
      });

      setProject(res.project);
    } catch (e: any) {
      setError(e?.message || "Failed to render final video");
    } finally {
      setSaving(false);
    }
  }, [projectId, draft, authFetch]);

  if (!projectId) return <div className="p-6">No project id</div>;
  if (loading) return <div className="p-6">Loading workspace…</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!project) return <div className="p-6">Not found</div>;

  return (
    <EditorProvider project={project} initialTranscript={draft}>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-7xl p-4 space-y-4">
          <ControlsBar />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <VideoPanel />
              <Timeline />
            </div>
            <div className="hidden md:block space-y-4">
              <Toolbox />
              <TextLayersPanel />

              <div className="mt-4 rounded border border-white/10 p-3 text-sm text-white/50">
                Final render is produced server-side from the sanitized
                transcript. Drag to adjust timings, then Save & Render.
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  disabled={saving}
                  onClick={onRenderFinal}
                  className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                >
                  {saving ? "Rendering…" : "Save & Render Final"}
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}

// Inline video overlay implementation replaced by modular VideoPanel
