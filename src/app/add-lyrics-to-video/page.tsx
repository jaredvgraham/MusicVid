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
  title: "Add Lyrics to Video — Sync Words On-Beat",
  description:
    "Upload your video + song. Sonexa auto-times lyrics; you style and export.",
  path: "/add-lyrics-to-video",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <SeoHead
        title="Add Lyrics to Video — Sync Words On-Beat"
        description="Upload your video + song. Sonexa auto-times lyrics; you style and export."
        path="/add-lyrics-to-video"
        ogImage={absoluteUrl(
          "/api/og?title=Add%20Lyrics%20to%20Video&desc=Sync%20words%20on-beat"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Add Lyrics to Video", path: "/add-lyrics-to-video" },
          ]),
          faqPageLd([
            {
              question: "Can I edit positions and styles?",
              answer:
                "Yes—drag text and apply presets like Minimal, Neon, Vapor, Bold, and Karaoke.",
            },
            {
              question: "Do you support per-word karaoke timing?",
              answer: "Yes—toggle Karaoke mode.",
            },
            {
              question: "Which exports are available?",
              answer: "MP4 in 16:9, 9:16, 1:1; 720p/1080p/1440p.",
            },
          ]),
          howToLd({
            name: "How to add lyrics to a video",
            steps: [
              "Upload your video or song",
              "Auto-transcribe and sync",
              "Style",
              "Export",
            ],
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Add Lyrics to Video — Sync Words On‑Beat
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Upload your video + song. Sonexa auto‑times lyrics; you style and
            export.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg:white/90"
            >
              Add lyrics now
            </Link>
            <Link
              href="/templates"
              className="rounded-md border border:white/15 px-4 py-2 text-sm text-white/90 hover:bg:white/10"
            >
              Browse templates
            </Link>
          </div>
        </section>

        <section className="grid gap-6 pb-24 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Why Sonexa</h2>
            <p className="mt-2 text-sm text-white/70">
              Per‑word timing, design presets, and export sizes for every
              platform.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Works with any footage</h2>
            <p className="mt-2 text-sm text-white/70">
              Great for music videos, performance clips, and behind‑the‑scenes.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
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
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Which exports are available?
              </summary>
              <p className="mt-2 text-white/70">
                MP4 in 16:9, 9:16, 1:1; 720p/1080p/1440p.
              </p>
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
