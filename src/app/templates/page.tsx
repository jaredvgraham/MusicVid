import type { Metadata } from "next";
import Link from "next/link";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "Templates — Lyric Videos & Captions",
  description:
    "Browse lyric video and captions templates: Minimal, Neon, Vapor, Bold, Karaoke and more.",
  path: "/templates",
});

const GENRES = [
  "rap",
  "pop",
  "rock",
  "country",
  "edm",
  "rnb",
  "indie",
  "metal",
  "acoustic",
  "lofi",
  "gospel",
];

const STYLES = [
  "minimal",
  "neon",
  "vapor",
  "bold",
  "tape",
  "karaoke",
  "kinetic",
  "retro",
  "modern",
  "subtle",
];

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Templates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Start fast with designer presets for lyric videos and captions.
          </p>
          <div className="mx-auto mt-4 max-w-xl rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
            Coming soon: curated template galleries with previews and one‑click
            apply. In the meantime, you can start from a preset in the editor.
          </div>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
            >
              Start now — upload
            </Link>
            <Link
              href="/lyric-video-maker"
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </section>

        <section className="pb-10">
          <h2 className="text-2xl font-semibold">Lyric video by genre</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {GENRES.map((g) => (
              <Link
                key={g}
                href={`/templates/lyric-video/${g}`}
                className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10"
              >
                {g.toUpperCase()}
              </Link>
            ))}
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">Captions by style</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {STYLES.map((s) => (
              <Link
                key={s}
                href={`/templates/captions/${s}`}
                className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white/80 hover:bg-white/10"
              >
                {s.toUpperCase()}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
