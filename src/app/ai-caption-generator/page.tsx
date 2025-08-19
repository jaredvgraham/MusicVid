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
import CaptionTicker from "@/components/seo/CaptionTicker";
import ExplainerCaptions from "@/components/seo/explainers/ExplainerCaptions";
import OverlayComposer from "@/components/seo/OverlayComposer";

export const metadata: Metadata = siteMeta({
  title: "AI Caption Generator — On-Beat, Styled Captions",
  description:
    "Upload a clip with audio. Get accurate, stylized captions with karaoke mode.",
  path: "/ai-caption-generator",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <SeoHead
        title="AI Caption Generator — On-Beat, Styled Captions"
        description="Upload a clip with audio. Get accurate, stylized captions with karaoke mode."
        path="/ai-caption-generator"
        ogImage={absoluteUrl(
          "/api/og?title=AI%20Caption%20Generator&desc=On-beat%2C%20styled%20captions"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "AI Caption Generator", path: "/ai-caption-generator" },
          ]),
          faqPageLd([
            {
              question: "How accurate are the captions?",
              answer:
                "We combine ASR with timing smoothing for highly readable captions you can tweak manually.",
            },
            {
              question: "Can I brand the captions?",
              answer:
                "Yes—set fonts, colors, outlines, backgrounds, and animation to match your brand.",
            },
            {
              question: "Does it support vertical video?",
              answer:
                "Yes—export 9:16, 1:1, 16:9 with layout and safe areas optimized for each.",
            },
          ]),
          howToLd({
            name: "How to generate captions with karaoke highlights",
            steps: [
              "Upload your clip",
              "Auto‑caption and review",
              "Toggle karaoke and style",
              "Export for TikTok, Reels, Shorts",
            ],
          }),
          videoObjectLd({
            name: "AI Caption Generator Demo",
            description:
              "Generate on‑beat captions with optional karaoke highlights that boost retention.",
            thumbnailUrl: absoluteUrl("/logo.png"),
            uploadDate: new Date().toISOString(),
            contentUrl: absoluteUrl("/videos/6896e19b530b28e2ca937ada.mp4"),
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            AI Caption Generator — On‑Beat, Styled Captions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-white/70">
            Auto‑generate accurate, timed captions and style them to match your
            brand. Export for TikTok, Reels and Shorts.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
            >
              Generate captions
            </Link>
            <Link
              href="/templates"
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Browse caption styles
            </Link>
          </div>
        </section>
        <div className="pb-10">
          <OverlayComposer />
        </div>
        <ExplainerCaptions />

        {/* SEO-rich copy */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">
            Auto caption your video with karaoke highlights
          </h2>
          <p className="mt-3 max-w-3xl text-white/70">
            Paste or upload your video and get{" "}
            <strong className="text-white">accurate, styled captions</strong>{" "}
            that match your brand. Toggle karaoke to highlight each word on
            beat, adjust fonts, colors, and motion, and export ready‑to‑post
            MP4s for{" "}
            <strong className="text-white">TikTok, Reels, and Shorts</strong>.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Readable everywhere</h3>
              <p className="mt-1 text-sm text-white/70">
                Outline, background, and baseline controls for clarity.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Brand fonts & colors</h3>
              <p className="mt-1 text-sm text-white/70">
                Templates you can tune to your own identity.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Batch exports</h3>
              <p className="mt-1 text-sm text-white/70">
                Render multiple aspect ratios from one timeline.
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-white/70">
            Want{" "}
            <a
              className="underline underline-offset-4 hover:text-white"
              href="/add-lyrics-to-video"
            >
              lyric overlays on footage
            </a>{" "}
            or
            <a
              className="ml-1 underline underline-offset-4 hover:text-white"
              href="/lyric-video-maker"
            >
              full lyric videos
            </a>
            ?
          </div>
        </section>

        <FeatureGrid
          items={[
            {
              title: "Readable captions anywhere",
              description:
                "Baseline, outline, and background controls for clarity.",
              icon: <IconClarity className="h-6 w-6 text-emerald-400" />,
            },
            {
              title: "Precise per‑word timing",
              description:
                "Words appear exactly on beat for a natural reading flow.",
              icon: <IconWave className="h-6 w-6 text-fuchsia-400" />,
            },
            {
              title: "Brand fonts & motion",
              description:
                "Templates tuned to your fonts, colors, and animation.",
              icon: <IconSparkle className="h-6 w-6 text-cyan-400" />,
            },
          ]}
        />

        <Steps
          items={[
            {
              number: 1,
              title: "Upload a clip",
              description: "Any orientation; we transcribe and time it.",
            },
            {
              number: 2,
              title: "Style captions",
              description: "Choose a template and tweak fonts, colors, motion.",
            },
            {
              number: 3,
              title: "Export for platforms",
              description: "One render for multiple aspect ratios.",
            },
          ]}
        />

        <section id="platforms" className="pb-24">
          <h2 className="text-2xl font-semibold">Built for short‑form</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">TikTok</h3>
              <p className="mt-2 text-sm text-white/70">
                9:16 with safe‑areas and crisp type.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Reels</h3>
              <p className="mt-2 text-sm text-white/70">
                On‑brand colors and motion presets.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Shorts</h3>
              <p className="mt-2 text-sm text-white/70">
                Export variants from one timeline.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                How accurate are the captions?
              </summary>
              <p className="mt-2 text-white/70">
                High accuracy with manual editing when you want it.
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
                Can I edit styles?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—apply presets and tweak fonts, colors, and motion.
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

function IconClarity({
  className = "h-5 w-5",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 8h16M6 12h12M8 16h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
