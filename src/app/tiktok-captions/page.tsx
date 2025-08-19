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
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            TikTok Captions — Fast, Stylized, On‑Beat
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Auto captions that match your vibe. Perfect for TikTok, Reels, and
            Shorts.
          </p>
          <div className="mt-6 flex justify-center gap-3">
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
        </section>

        <section className="grid gap-6 pb-24 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">
              Perfect for Shorts & Reels
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Export in 9:16 with crisp typography and motion.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Beat‑aware captions</h2>
            <p className="mt-2 text-sm text-white/70">
              Optional karaoke‑style highlights on the beat.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <details className="rounded-md border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white">
                Do you support per‑word karaoke timing?
              </summary>
              <p className="mt-2 text-white/70">Yes—toggle Karaoke mode.</p>
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
