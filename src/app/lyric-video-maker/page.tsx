import type { Metadata } from "next";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import JsonLd from "@/components/JsonLd";
import {
  siteMeta,
  faqPageLd,
  howToLd,
  breadcrumbLd,
  absoluteUrl,
} from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "Lyric Video Maker — Auto-Timed Lyrics with AI",
  description:
    "Upload a song, choose a stock clip, and get on-beat, styled lyrics in minutes.",
  path: "/lyric-video-maker",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <SeoHead
        title="Lyric Video Maker — Auto-Timed Lyrics with AI"
        description="Upload a song, choose a stock clip, and get on-beat, styled lyrics in minutes."
        path="/lyric-video-maker"
        ogImage={absoluteUrl(
          "/api/og?title=Lyric%20Video%20Maker&desc=Auto-timed%20lyrics%20with%20AI"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Lyric Video Maker", path: "/lyric-video-maker" },
          ]),
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
              answer: "Yes—toggle Karaoke mode.",
            },
          ]),
          howToLd({
            name: "How to make a lyric video",
            steps: [
              "Upload a song",
              "Choose a stock clip",
              "Auto-sync lyrics and style",
              "Export for TikTok, Reels, or YouTube",
            ],
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Lyric Video Maker — Auto‑Timed Lyrics with AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Upload a song, choose a stock clip, and get on‑beat, styled lyrics
            in minutes.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
            >
              Make a lyric video
            </Link>
            <Link
              href="/templates"
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Browse templates
            </Link>
          </div>
        </section>

        <section className="grid gap-6 pb-20 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Lyric Video Maker</h2>
            <p className="mt-2 text-sm text-white/70">
              Upload a song → choose a stock clip → auto‑sync lyrics → style →
              export.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Add Lyrics to Your Video</h2>
            <p className="mt-2 text-sm text-white/70">
              Upload your video + song → auto words on screen → adjust timing →
              export.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">AI Caption Generator</h2>
            <p className="mt-2 text-sm text-white/70">
              Upload a clip with audio → auto captions → per‑word karaoke
              (optional) → export.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Can Sonexa auto‑make lyric videos?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—upload a song or video and we time words to the beat.
              </p>
            </details>
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Can I edit positions and styles?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—drag text and apply presets like Minimal, Neon, Vapor, Bold,
                and Karaoke.
              </p>
            </details>
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Do you support per‑word karaoke timing?
              </summary>
              <p className="mt-2 text-white/70">Yes—toggle Karaoke mode.</p>
            </details>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        <p>
          © {new Date().getFullYear()} Sonexa — Build lyric videos at the speed
          of sound.
        </p>
      </footer>
    </main>
  );
}
