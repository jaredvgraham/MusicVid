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
import OverlayComposer from "@/components/seo/OverlayComposer";
import CaptionTicker from "@/components/seo/CaptionTicker";
import ExplainerAddLyrics from "@/components/seo/explainers/ExplainerAddLyrics";

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
              question: "Will it work with performance clips?",
              answer:
                "Absolutely. Performance, BTS, or lyric reels — we place words cleanly and let you reposition any time.",
            },
            {
              question: "Can I preserve my brand fonts and colors?",
              answer:
                "Yes—choose a template then customize with your brand typography and palette.",
            },
            {
              question: "Does it keep sync after edits?",
              answer:
                "Yes—timing is retained when you move, resize, or restyle text blocks.",
            },
          ]),
          howToLd({
            name: "How to overlay lyrics on your video",
            steps: [
              "Upload your footage + audio",
              "Auto‑transcribe and sync on beat",
              "Pick a template and position text",
              "Export for your platform",
            ],
          }),
          videoObjectLd({
            name: "Add Lyrics to Video Demo",
            description:
              "Overlay timed lyrics onto your own footage in minutes.",
            thumbnailUrl: absoluteUrl("/logo.png"),
            uploadDate: new Date().toISOString(),
            contentUrl: absoluteUrl("/videos/6896e19b530b28e2ca937ada.mp4"),
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Add Lyrics to Video — Sync Words On‑Beat
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-white/70">
            Bring your footage to life with beat‑synced words you can position
            anywhere. Customize fonts, colors, and motion; export for TikTok,
            Reels, Shorts and YouTube.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
            >
              Add lyrics now
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
          <CaptionTicker />
        </div>
        <ExplainerAddLyrics />

        {/* SEO-rich copy */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">
            Add lyrics to any video with AI
          </h2>
          <p className="mt-3 max-w-3xl text-white/70">
            Upload your footage and song, and our AI{" "}
            <strong className="text-white">auto‑transcribes</strong> and
            <strong className="text-white"> syncs lyrics on beat</strong>. Drag
            to position text in the frame, choose a preset, and tweak fonts and
            colors. Export crisp MP4s for{" "}
            <strong className="text-white">TikTok, Reels, YouTube</strong> and
            beyond.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Position anywhere</h3>
              <p className="mt-1 text-sm text-white/70">
                Safe‑area aware overlays that stay readable.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Per‑word karaoke</h3>
              <p className="mt-1 text-sm text-white/70">
                Highlight each word in time with the music.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Template styles</h3>
              <p className="mt-1 text-sm text-white/70">
                Minimal, Bold, Neon, Vapor, and more.
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-white/70">
            Need{" "}
            <a
              className="underline underline-offset-4 hover:text-white"
              href="/lyric-video-maker"
            >
              a full lyric video
            </a>{" "}
            or
            <a
              className="ml-1 underline underline-offset-4 hover:text-white"
              href="/ai-caption-generator"
            >
              auto‑captions
            </a>{" "}
            instead?
          </div>
        </section>

        <FeatureGrid
          items={[
            {
              title: "Drag‑to‑place lyric overlays",
              description:
                "Safe‑area aware placement that stays readable across platforms.",
              icon: <IconMove className="h-6 w-6 text-emerald-400" />,
            },
            {
              title: "Per‑word timing",
              description:
                "Auto‑sync on beat with manual edits when you need control.",
              icon: <IconText className="h-6 w-6 text-fuchsia-400" />,
            },
            {
              title: "Export 16:9 • 9:16 • 1:1",
              description:
                "Crisp MP4s optimized for TikTok, Reels, and YouTube.",
              icon: <IconBolt className="h-6 w-6 text-cyan-400" />,
            },
          ]}
        />

        <Steps
          items={[
            {
              number: 1,
              title: "Upload footage + audio",
              description: "Works with common camera files and audio formats.",
            },
            {
              number: 2,
              title: "Sync, place and style",
              description: "Auto timing; drag to position; pick a template.",
            },
            {
              number: 3,
              title: "Export and publish",
              description: "One click to render for every platform.",
            },
          ]}
        />

        <section id="footage-ideas" className="pb-20">
          <h2 className="text-2xl font-semibold">Footage ideas</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Performance</h3>
              <p className="mt-2 text-sm text-white/70">
                Live takes or studio sessions with clean overlays.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">B‑roll</h3>
              <p className="mt-2 text-sm text-white/70">
                City, studio, or nature clips to match your mood.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Lyrics‑only</h3>
              <p className="mt-2 text-sm text-white/70">
                Minimal backgrounds that put words center stage.
              </p>
            </div>
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
                and more.
              </p>
            </details>
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Do you support precise per‑word timing?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—words appear exactly on beat with manual adjustments when
                needed.
              </p>
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

function IconMove({
  className = "h-5 w-5",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3l3 3-3 3-3-3 3-3zm0 15l3 3-3 3-3-3 3-3zM3 12l3-3 3 3-3 3-3-3zm15 0l3-3 3 3-3 3-3-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconText({
  className = "h-5 w-5",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 6h16M9 6v12m6-12v12M4 18h16"
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
