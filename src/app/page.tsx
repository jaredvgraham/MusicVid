"use client";
import React, { useState } from "react";
import UploadCta from "../components/landing/UploadCta";
import Hero from "../components/landing/Hero";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { Steps } from "../components/landing/Steps";
import Showcase from "../components/landing/Showcase";
import { useProjectSocket } from "../hooks/useProjectSocket";
import SeoHead from "@/components/SeoHead";
import JsonLd from "@/components/JsonLd";
import {
  faqPageLd,
  howToLd,
  softwareApplicationLd,
  absoluteUrl,
} from "@/lib/seo";
import Link from "next/link";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import Dashboard from "@/components/dash/Dashboard";
import Image from "next/image";

export default function Page(): React.ReactElement {
  const [projectId, setProjectId] = useState<string | null>(null);
  const { connected, finished, project, error } = useProjectSocket(projectId);
  console.log("connected", connected);
  console.log("finished", finished);
  console.log("project", project);
  return (
    <>
      <SignedOut>
        <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
          <SeoHead
            title="Sonexa — AI Lyric Video Maker & Caption Studio"
            description="Upload a song or clip and get on-beat, styled words. Edit timing, position, and styles; export for TikTok, Reels, and YouTube."
            path="/"
            ogImage={absoluteUrl(
              "/api/og?title=Sonexa&desc=AI%20Lyric%20Video%20Maker%20%26%20Caption%20Studio"
            )}
          />
          <JsonLd
            data={[
              softwareApplicationLd(),
              faqPageLd([
                {
                  question: "Can Sonexa auto-make lyric videos?",
                  answer:
                    "Yes—upload a song or video and we time words to the beat.",
                },
                {
                  question: "Can I edit positions and styles?",
                  answer:
                    "Yes—drag text and apply presets like Minimal, Neon, Vapor, Bold, and Karaoke.",
                },
                {
                  question: "Do you support per-word karaoke timing?",
                  answer: "Yes—toggle Karaoke mode for per‑word highlights.",
                },
                {
                  question: "Which exports are available?",
                  answer: "MP4 in 16:9, 9:16, 1:1; 720p/1080p/1440p.",
                },
                {
                  question: "Will it caption voice-only clips?",
                  answer: "Yes—perfect for talking‑head content.",
                },
              ]),
              howToLd({
                name: "How to make a lyric video",
                steps: [
                  "Upload a song",
                  "Choose a stock clip or upload your video",
                  "Auto‑sync lyrics and style",
                  "Export for TikTok, Reels, or YouTube",
                ],
              }),
            ]}
          />
          {/* Ambient background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -top-1/3 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
            <div className="absolute -bottom-1/3 left-1/4 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8))]" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            {/* Hero */}
            <Hero />

            {/* Intent links under hero */}
            <div className="mx-auto mt-6 w-full text-center text-sm text-white/70">
              <Link
                href="/lyric-video-maker"
                className="underline underline-offset-4 hover:text-white"
              >
                Lyric Video Maker
              </Link>
              <span className="px-2">•</span>
              <Link
                href="/add-lyrics-to-video"
                className="underline underline-offset-4 hover:text-white"
              >
                Add Lyrics to Video
              </Link>
              <span className="px-2">•</span>
              <Link
                href="/ai-caption-generator"
                className="underline underline-offset-4 hover:text-white"
              >
                AI Caption Generator
              </Link>
              <span className="px-2">•</span>
              <Link
                href="/tiktok-captions"
                className="underline underline-offset-4 hover:text-white"
              >
                TikTok Captions
              </Link>
              <span className="px-2">•</span>
              <Link
                href="/youtube-captions"
                className="underline underline-offset-4 hover:text-white"
              >
                YouTube Captions
              </Link>
            </div>

            {/* Upload CTA */}
            <UploadCta
              setProjectId={setProjectId}
              finished={finished}
              project={project}
              error={error}
            />

            {/* Social proof */}
            <p className="mx-auto mt-6 max-w-xl text-center text-xs text-white/40">
              Used by indie artists, labels and creators to ship videos faster.
            </p>

            <h2 id="features" className="sr-only">
              AI lyric video maker and caption features
            </h2>
            <FeatureGrid
              items={[
                {
                  title: "Auto‑timed lyrics",
                  description:
                    "Auto‑transcription and precision alignment with per‑word highlighting and smart line breaks.",
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
                    "Render 720p/1080p/1440p in 16:9, 9:16 or 1:1 for every platform.",
                  icon: <IconBolt className="h-6 w-6 text-cyan-400" />,
                },
              ]}
            />

            <h2 className="sr-only">How it works</h2>
            <Steps
              items={[
                {
                  number: 1,
                  title: "Upload a song or video",
                  description:
                    "Drop audio or video; we auto‑transcribe and time words to the beat.",
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
          <footer className="bg-neutral-950 border-t border-white/10">
            <div className="mx-auto max-w-7xl px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src="/logo.png"
                      alt="Sonexa-Logo"
                      width={32}
                      height={32}
                    />
                    <span className="text-lg font-semibold text-white">
                      Sonexa
                    </span>
                  </div>
                  <p className="text-white/70 max-w-md">
                    AI-powered lyric video maker and caption studio. Create
                    stunning content in minutes, not hours.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/upload"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Upload
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/templates"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Templates
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/pricing"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/blog"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/lyric-video-maker"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Lyric Video Maker
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ai-caption-generator"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        AI Caption Generator
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 mt-8 pt-8 text-center">
                <p className="text-white/50 text-sm">
                  © 2024 Sonexa. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
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
