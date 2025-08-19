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
  videoObjectLd,
} from "@/lib/seo";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Steps } from "@/components/landing/Steps";
import LyricWave from "@/components/seo/LyricWave";
import ExplainerLyric from "@/components/seo/explainers/ExplainerLyric";
import VideoExamples from "@/components/seo/VideoExamples";

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
              question: "How precise is the lyric timing?",
              answer:
                "We align on a per‑word basis using tempo and phoneme cues. You can nudge any word or line with frame‑level controls.",
            },
            {
              question: "Can I mix stock clips with my own footage?",
              answer:
                "Yes. Start with a stock background or upload your video; swap at any time without losing timing or styles.",
            },
            {
              question: "Does it support multiple aspect ratios?",
              answer:
                "Yes—render 16:9, 9:16, or 1:1 with safe‑area aware layouts and typography that adapts.",
            },
          ]),
          howToLd({
            name: "How to create a lyric video from a song",
            steps: [
              "Upload your track (MP3/WAV)",
              "Pick a visual style and color palette",
              "Fine‑tune line breaks and pacing",
              "Export in your target aspect ratio",
            ],
          }),
          videoObjectLd({
            name: "Sonexa Lyric Video Maker Demo",
            description:
              "Watch lyrics sync to the beat with kinetic typography and clean layouts.",
            thumbnailUrl: absoluteUrl("/logo.png"),
            uploadDate: new Date().toISOString(),
            contentUrl: absoluteUrl("/videos/6896e19b530b28e2ca937ada.mp4"),
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Lyric Video Maker — Auto‑Timed Lyrics with AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-white/70">
            Turn any song into a polished lyric video with tempo‑aware
            alignment, beat‑synced words, and designer typography. Export for
            TikTok, Reels, Shorts and YouTube.
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
        <div className="pb-10">
          <LyricWave />
        </div>
        <ExplainerLyric />

        {/* Example Videos */}
        <VideoExamples
          title="See lyric videos in action"
          subtitle="Watch how our AI automatically syncs lyrics to the beat with different styles and genres"
          examples={[
            {
              id: "pop-example",
              title: "Pop Lyric Video",
              description:
                "Upbeat pop track with kinetic typography and neon colors",
              videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
              duration: "2:34",
              aspectRatio: "9:16",
            },
            {
              id: "rock-example",
              title: "Rock Lyric Video",
              description:
                "High-energy rock song with bold, dynamic text animations",
              videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
              duration: "3:12",
              aspectRatio: "16:9",
            },
            {
              id: "edm-example",
              title: "EDM Lyric Video",
              description:
                "Electronic dance track with vaporwave aesthetics and pulsing text",
              videoUrl: "/videos/6896e19b530b28e2ca937ada.mp4",
              duration: "2:58",
              aspectRatio: "1:1",
            },
          ]}
        />

        {/* SEO-rich copy */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">
            Make a lyric video from your song in minutes
          </h2>
          <p className="mt-3 max-w-3xl text-white/70">
            Our AI lyric video maker automatically creates on‑beat, words that
            appear exactly on time with kinetic typography. Import your track,
            choose a vibe, and fine‑tune line breaks, pacing, fonts, and colors.
            Export clean MP4s optimized for{" "}
            <strong className="text-white">TikTok, Reels, YouTube</strong> and
            more.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Auto‑timed lyrics</h3>
              <p className="mt-1 text-sm text-white/70">
                Per‑word sync with frame‑level nudging when you want it.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Kinetic typography</h3>
              <p className="mt-1 text-sm text-white/70">
                Modern presets: Minimal, Vapor, Neon, Bold, and Kinetic.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Aspect ratios</h3>
              <p className="mt-1 text-sm text-white/70">
                16:9, 9:16, 1:1—safe‑area aware layouts that stay readable.
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-white/70">
            Looking to{" "}
            <a
              className="underline underline-offset-4 hover:text-white"
              href="/add-lyrics-to-video"
            >
              add lyrics to an existing video
            </a>{" "}
            or
            <a
              className="ml-1 underline underline-offset-4 hover:text-white"
              href="/ai-caption-generator"
            >
              auto‑caption a clip
            </a>
            ?
          </div>
        </section>

        <FeatureGrid
          items={[
            {
              title: "AI lyric timing (per‑word)",
              description:
                "Beat‑aware alignment with frame‑level nudging when you want it.",
              icon: <IconWave className="h-6 w-6 text-emerald-400" />,
            },
            {
              title: "Lyric templates & typography",
              description:
                "Minimal, Vapor, Neon, Bold, and Kinetic looks tuned for music.",
              icon: <IconSparkle className="h-6 w-6 text-fuchsia-400" />,
            },
            {
              title: "Platform‑ready exports",
              description:
                "16:9, 9:16, 1:1 at 720p/1080p/1440p with safe‑area awareness.",
              icon: <IconBolt className="h-6 w-6 text-cyan-400" />,
            },
          ]}
        />

        <Steps
          items={[
            {
              number: 1,
              title: "Upload your song (MP3/WAV)",
              description: "We auto‑transcribe and detect phrasing.",
            },
            {
              number: 2,
              title: "Auto‑sync lyrics & style",
              description:
                "Per‑word karaoke timing with templates you can customize.",
            },
            {
              number: 3,
              title: "Export and share",
              description: "Ready for YouTube, TikTok, Reels and Shorts.",
            },
          ]}
        />

        <section id="use-cases" className="pb-20">
          <h2 className="text-2xl font-semibold">
            Made for artists and editors
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Indie Artists</h3>
              <p className="mt-2 text-sm text-white/70">
                Ship lyric videos on release day with studio‑grade motion.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Labels</h3>
              <p className="mt-2 text-sm text-white/70">
                Batch render formats for every platform from a single project.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Video Editors</h3>
              <p className="mt-2 text-sm text-white/70">
                Export clean MP4s or overlay files that slot into your timeline.
              </p>
            </div>
          </div>
          <div className="mt-6 text-sm text-white/70">
            Try genre‑tuned looks:
            <Link
              className="ml-2 underline underline-offset-4 hover:text-white"
              href="/templates/lyric-video/edm"
            >
              EDM
            </Link>
            <span className="px-1">•</span>
            <Link
              className="underline underline-offset-4 hover:text-white"
              href="/templates/lyric-video/rock"
            >
              Rock
            </Link>
            <span className="px-1">•</span>
            <Link
              className="underline underline-offset-4 hover:text-white"
              href="/templates/lyric-video/acoustic"
            >
              Acoustic
            </Link>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                How precise is the lyric timing?
              </summary>
              <p className="mt-2 text-white/70">
                Per‑word with frame‑level nudging and smart pacing.
              </p>
            </details>
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Can I edit positions and styles?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—drag text, change fonts, colors, and animation.
              </p>
            </details>
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Which exports are supported?
              </summary>
              <p className="mt-2 text-white/70">
                MP4 16:9, 9:16, 1:1 at 720p/1080p/1440p.
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
