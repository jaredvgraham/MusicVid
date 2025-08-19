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
import PhonePreview from "@/components/seo/PhonePreview";
import ExplainerTikTok from "@/components/seo/explainers/ExplainerTikTok";

export const metadata: Metadata = siteMeta({
  title: "TikTok Captions — Fast, Stylized, On-Beat",
  description:
    "Auto captions that match your vibe. Perfect for TikTok, Reels, and Shorts.",
  path: "/tiktok-captions",
});

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <SeoHead
        title="TikTok Captions — Fast, Stylized, On-Beat"
        description="Auto captions that match your vibe. Perfect for TikTok, Reels, and Shorts."
        path="/tiktok-captions"
        ogImage={absoluteUrl(
          "/api/og?title=TikTok%20Captions&desc=Fast%2C%20stylized%2C%20on-beat"
        )}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "TikTok Captions", path: "/tiktok-captions" },
          ]),
          faqPageLd([
            {
              question: "Do you support per-word karaoke timing?",
              answer: "Yes—toggle Karaoke mode.",
            },
            {
              question: "Can I use portrait and square?",
              answer: "Yes—export in 9:16, 1:1, or 16:9 with presets.",
            },
            {
              question: "Are styles customizable?",
              answer: "Yes—pick a template and tweak colors and fonts.",
            },
          ]),
          howToLd({
            name: "How to add captions for TikTok",
            steps: [
              "Upload a vertical clip",
              "Auto caption",
              "Style with presets",
              "Export and post",
            ],
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-6">
        <section className="grid items-center gap-8 pt-12 pb-12 md:grid-cols-2">
          <div>
            <h1 className="bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
              TikTok Captions — Fast, Stylized, On‑Beat
            </h1>
            <p className="mt-4 max-w-xl text-balance text-white/70">
              Auto captions that match your vibe. Vertical‑first layouts and
              exports ready for TikTok.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/upload"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
              >
                Create captions for TikTok
              </Link>
              <Link
                href="/templates/captions/minimal"
                className="rounded-md border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                Try the Minimal style
              </Link>
            </div>
          </div>
          <div>
            <PhonePreview />
          </div>
        </section>
        <ExplainerTikTok />

        {/* SEO-rich copy */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">
            TikTok captions that boost watch time
          </h2>
          <p className="mt-3 max-w-3xl text-white/70">
            Generate <strong className="text-white">on‑beat captions</strong>{" "}
            that stay readable on vertical video. Pick a preset, tune fonts and
            colors to your brand, and export in{" "}
            <strong className="text-white">9:16</strong> (and other ratios) with
            safe‑areas in mind.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Vertical‑first</h3>
              <p className="mt-1 text-sm text-white/70">
                Layouts optimized for TikTok UI overlays.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Word timing</h3>
              <p className="mt-1 text-sm text-white/70">
                Precise per‑word timing for natural reading.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-base font-semibold">Trendy presets</h3>
              <p className="mt-1 text-sm text-white/70">
                Minimal, Bold, Neon, Vapor—ready to go.
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-white/70">
            Need{" "}
            <a
              className="underline underline-offset-4 hover:text-white"
              href="/ai-caption-generator"
            >
              captions for all formats
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

        <section className="grid gap-6 pb-24 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Vertical‑first</h2>
            <p className="mt-2 text-sm text-white/70">
              Optimized 9:16 layouts with safe‑areas for UI overlays.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Word timing</h2>
            <p className="mt-2 text-sm text-white/70">
              Precise per‑word timing for natural reading.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Trendy presets</h2>
            <p className="mt-2 text-sm text-white/70">
              Minimal, Bold, Neon, Vapor—pick a look that fits TikTok.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
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
                Can I use portrait and square?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—export in 9:16, 1:1, or 16:9 with presets.
              </p>
            </details>
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Are styles customizable?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—pick a template and tweak colors and fonts.
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
