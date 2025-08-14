"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function ResultPage(): React.ReactElement {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const video = search.get("video");

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-2xl font-semibold">Final Render</h1>
        {!video ? (
          <div>Processing final render for {params.id}…</div>
        ) : (
          <div className="space-y-3">
            <video
              key={video}
              src={video}
              controls
              className="w-full rounded-lg"
            />
            <div className="flex gap-2">
              <a
                href={video}
                target="_blank"
                rel="noreferrer"
                className="rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
              >
                Open in new tab
              </a>
              <button
                onClick={() => router.push("/")}
                className="rounded bg-neutral-800 px-3 py-1.5 text-sm"
              >
                Back Home
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
