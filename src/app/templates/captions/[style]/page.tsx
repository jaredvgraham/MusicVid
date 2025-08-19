import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteMeta, breadcrumbLd, faqPageLd, howToLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

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
] as const;

type Style = (typeof STYLES)[number];

export function generateStaticParams() {
  return STYLES.map((style) => ({ style }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>;
}): Promise<Metadata> {
  const { style } = await params;
  const s = style.toLowerCase();
  if (!STYLES.includes(s as Style))
    return siteMeta({ noIndex: true, title: "Templates" });
  const title = `Caption Templates — ${s.toUpperCase()} Style`;
  const description = `Caption styles like ${s} with kinetic type and on‑beat karaoke timing.`;
  return siteMeta({ title, description, path: `/templates/captions/${s}` });
}

export default async function Page({
  params,
}: {
  params: Promise<{ style: string }>;
}): Promise<React.ReactElement> {
  const { style } = await params;
  const s = style.toLowerCase();
  if (!STYLES.includes(s as Style)) return notFound();
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/templates" },
            { name: `Captions (${s})`, path: `/templates/captions/${s}` },
          ]),
          faqPageLd([
            {
              question: "Can I change colors and fonts?",
              answer: "Yes—tweak any preset to match your brand.",
            },
            {
              question: "Does karaoke mode work here?",
              answer: "Yes—enable per‑word highlights.",
            },
          ]),
          howToLd({
            name: `How to use ${s} captions`,
            steps: ["Pick a style", "Auto caption", "Style and export"],
          }),
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <section className="pt-12 pb-12 text-center">
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            {s.toUpperCase()} Caption Templates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Presets designed for short‑form videos with crisp legibility.
          </p>
          <div className="mx-auto mt-4 max-w-xl rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
            Coming soon: {s} caption styles with motion, outlines and karaoke
            timing.
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
            Start now — upload a clip
          </a>
        </div>
      </div>
    </main>
  );
}
