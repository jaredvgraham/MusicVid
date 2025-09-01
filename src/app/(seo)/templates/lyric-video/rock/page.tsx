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
import VideoExamples from "@/components/seo/VideoExamples";

export const metadata: Metadata = siteMeta({
  title: "Rock Lyric Video Templates",
  description:
    "Start with a rock‑inspired layout tuned for on‑beat lyric timing.",
  path: "/templates/lyric-video/rock",
});

export default async function Page({
  params,
}: {
  params: Promise<{ genre: string }>;
}): Promise<React.ReactElement> {
  const { genre: g } = await params;

  // Fallback for when genre is undefined during prerendering
  const genre = g || "rock";

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <SeoHead
        title="Rock Lyric Video Templates"
        description="Start with a rock‑inspired layout tuned for on‑beat lyric timing."
        path="/templates/lyric-video/rock"
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/templates" },
            { name: "Lyric Video", path: "/templates/lyric-video" },
            { name: "Rock", path: "/templates/lyric-video/rock" },
          ]),
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            {genre.toUpperCase()} Lyric Video Templates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Start with a {genre}‑inspired layout tuned for on‑beat lyric timing.
          </p>
          <div className="mx-auto mt-4 max-w-xl rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
            Coming soon: {genre} template gallery. We&apos;re curating presets
            with animated type, colorways and motion.
          </div>
        </section>
        <section className="grid gap-6 pb-24 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-3 aspect-video w-full rounded-md bg-[linear-gradient(135deg,#0b0b0b,40%,#141414,60%,#0b0b0b)]" />
              <h2 className="text-base font-semibold">Preview</h2>
              <p className="mt-1 text-sm text-white/70">Coming soon</p>
            </div>
          ))}
        </section>

        {/* Rock Lyric Video Examples */}
        <VideoExamples
          title="Rock lyric video examples"
          subtitle="See how rock music looks with our bold, dynamic text styles"
          examples={[
            {
              id: "classic-rock",
              title: "Classic Rock Style",
              description:
                "Bold typography with dramatic shadows and rock aesthetics",
              videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
              duration: "3:45",
              aspectRatio: "16:9",
            },
            {
              id: "hard-rock",
              title: "Hard Rock Style",
              description: "Aggressive text animations with metallic effects",
              videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
              duration: "2:58",
              aspectRatio: "9:16",
            },
            {
              id: "alternative-rock",
              title: "Alternative Rock Style",
              description: "Modern, edgy typography with grunge elements",
              videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
              duration: "4:12",
              aspectRatio: "1:1",
            },
          ]}
        />

        <div className="pb-24 text-center">
          <a
            href="/upload"
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
          >
            Start now — upload a song or clip
          </a>
        </div>
      </div>
    </main>
  );
}
