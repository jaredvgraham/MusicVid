import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  siteMeta,
  absoluteUrl,
  breadcrumbLd,
  faqPageLd,
  howToLd,
} from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

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
] as const;

type Genre = (typeof GENRES)[number];

export function generateStaticParams() {
  return GENRES.map((genre) => ({ genre }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ genre: string }>;
}): Promise<Metadata> {
  const { genre } = await params;
  const g = genre.toLowerCase();
  if (!GENRES.includes(g as Genre))
    return siteMeta({ noIndex: true, title: "Templates" });
  const title = `Lyric Video Templates — ${g.toUpperCase()} Style`;
  const description = `Designer templates for ${g} lyric videos with kinetic typography and on‑beat timing.`;
  return siteMeta({ title, description, path: `/templates/lyric-video/${g}` });
}

export default async function Page({
  params,
}: {
  params: Promise<{ genre: string }>;
}): Promise<React.ReactElement> {
  const { genre } = await params;
  const g = genre.toLowerCase();
  if (!GENRES.includes(g as Genre)) return notFound();
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/templates" },
            { name: `Lyric Video (${g})`, path: `/templates/lyric-video/${g}` },
          ]),
          faqPageLd([
            {
              question: "Can I change colors and fonts?",
              answer: "Yes—tweak any preset to match your brand.",
            },
            {
              question: "Do these work for 9:16 and 16:9?",
              answer: "Yes—export portrait, square or landscape.",
            },
          ]),
          howToLd({
            name: `How to use ${g} templates`,
            steps: [
              "Open a template",
              "Auto-transcribe and sync",
              "Style and export",
            ],
          }),
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            {g.toUpperCase()} Lyric Video Templates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Start with a {g}‑inspired layout tuned for on‑beat lyric timing.
          </p>
          <div className="mx-auto mt-4 max-w-xl rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
            Coming soon: {g} template gallery. We’re curating presets with
            animated type, colorways and motion.
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
