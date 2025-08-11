"use client";

import React from "react";
import Link from "next/link";

interface UploadCtaProps {
  setProjectId: (projectId: string) => void;
  finished: boolean;
  project: any;
  error: string | null;
}

function EqStyles(): React.ReactElement {
  return (
    <style jsx global>{`
      .eq-hero { display: inline-flex; align-items: flex-end; gap: 6px; height: 16px; width: 100%; justify-content: space-between; }
      .eq-hero-bar {
        width: 4px;
        height: 12px;
        border-radius: 9999px;
        background: linear-gradient(180deg, rgba(240,171,252,.95), rgba(129,140,248,.95));
        transform-origin: bottom;
        animation: eqPulse 1.2s ease-in-out infinite;
      }
      @keyframes eqPulse {
        0% { transform: scaleY(.4); }
        25% { transform: scaleY(1); }
        50% { transform: scaleY(.6); }
        75% { transform: scaleY(.9); }
        100% { transform: scaleY(.4); }
      }
      @media (prefers-reduced-motion: reduce) {
        .eq-hero-bar { animation: none; }
      }
    `}</style>
  );
}

export default function UploadCta(_: UploadCtaProps): React.ReactElement {
  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <EqStyles />
      <div className="mb-2 flex justify-center" aria-hidden>
        <div className="eq-hero">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="eq-hero-bar"
              style={{ animationDelay: `${(i % 5) * 0.12}s` }}
            />
          ))}
        </div>
      </div>
      <Link
        href="/upload"
        className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-lg ring-1 ring-white/10 transition hover:bg-white/10"
      >
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 text-white">
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-white">Create your music video</p>
        <p className="mt-1 text-sm text-white/60">Start a new project and upload your track on the next page.</p>
        <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition group-hover:bg-white/90">
          Get started
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
