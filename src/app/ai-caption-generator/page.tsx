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
              question: "Will it caption voice-only clips?",
              answer: "Yes—perfect for talking-head content.",
            },
            {
              question: "Do you support per-word karaoke timing?",
              answer: "Yes—toggle Karaoke mode for per-word highlights.",
            },
            {
              question: "Can I edit styles?",
              answer: "Yes—apply presets and tweak fonts, colors, and motion.",
            },
          ]),
          howToLd({
            name: "How to auto caption a video",
            steps: [
              "Upload a clip",
              "Auto caption",
              "Optional: Karaoke mode",
              "Export",
            ],
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            AI Caption Generator — On‑Beat, Styled Captions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Upload a clip with audio. Get accurate, stylized captions with
            karaoke mode.
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

        <section className="grid gap-6 pb-24 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">On‑beat karaoke timing</h2>
            <p className="mt-2 text-sm text-white/70">
              Optional per‑word highlights keep viewers engaged.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Stylized presets</h2>
            <p className="mt-2 text-sm text-white/70">
              Minimal, Neon, Vapor, Bold and more with kinetic typography.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Will it caption voice‑only clips?
              </summary>
              <p className="mt-2 text-white/70">
                Yes—perfect for talking‑head content.
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
