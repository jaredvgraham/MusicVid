"use client";
import React, { useState } from "react";
import UploadCta from "../components/landing/UploadCta";
import Hero from "../components/landing/Hero";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { Steps } from "../components/landing/Steps";
import Showcase from "../components/landing/Showcase";
import { useProjectSocket } from "../hooks/useProjectSocket";

export default function Page(): React.ReactElement {
  const [projectId, setProjectId] = useState<string | null>(null);
  const { connected, finished, video } = useProjectSocket(projectId);
  console.log("connected", connected);
  console.log("finished", finished);
  console.log("video", video);
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-1/3 left-1/4 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8))]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <Hero />

        {/* Upload CTA */}
        <UploadCta
          setProjectId={setProjectId}
          finished={finished}
          video={video || ""}
        />

        {/* Social proof */}
        <p className="mx-auto mt-6 max-w-xl text-center text-xs text-white/40">
          Used by indie artists, labels and creators to ship videos faster.
        </p>

        <FeatureGrid
          items={[
            {
              title: "Auto‑timed lyrics",
              description:
                "Precision lyric alignment with per‑word highlighting and smart line breaks.",
              icon: <IconWave className="h-6 w-6 text-emerald-400" />,
            },
            {
              title: "Designer templates",
              description:
                "Modern presets with kinetic typography, gradients, and motion out of the box.",
              icon: <IconSparkle className="h-6 w-6 text-fuchsia-400" />,
            },
            {
              title: "One‑click export",
              description:
                "Render 1080p or 4K in portrait, square or landscape for every platform.",
              icon: <IconBolt className="h-6 w-6 text-cyan-400" />,
            },
          ]}
        />

        <Steps
          items={[
            {
              number: 1,
              title: "Add your song",
              description:
                "Drop an MP3/WAV and paste lyrics or fetch from metadata.",
            },
            {
              number: 2,
              title: "Pick a style",
              description:
                "Choose a vibe: bold, dreamy, minimal. Tweak colors and fonts.",
            },
            {
              number: 3,
              title: "Export and post",
              description:
                "Render in seconds and share to TikTok, Reels, YouTube and more.",
            },
          ]}
        />

        <Showcase />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        <p>
          © {new Date().getFullYear()} MusicVid — Build lyric videos at the
          speed of sound.
        </p>
      </footer>
    </main>
  );
}

// Feature/Step/Showcase inlined here previously are now replaced by animated components

function IconWave({
  className = "h-5 w-5",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 12c2 0 2-6 4-6s2 12 4 12 2-12 4-12 2 6 4 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSparkle({
  className = "h-5 w-5",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBolt({
  className = "h-5 w-5",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
