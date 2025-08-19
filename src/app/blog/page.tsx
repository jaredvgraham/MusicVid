import Link from "next/link";
import { siteMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = siteMeta({
  title: "Blog — Sonexa",
  description:
    "Guides and updates on lyric videos, captions, and creator workflows.",
  path: "/blog",
});

const POSTS: Array<{
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}> = [];

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-6">
        <section className="pt-12 pb-12">
          <h1 className="text-4xl font-semibold">Blog</h1>
          <p className="mt-2 text-white/70">Guides and updates for creators.</p>
        </section>
        <section className="pb-24">
          {POSTS.length === 0 ? (
            <p className="text-white/60">Posts coming soon.</p>
          ) : (
            <ul className="space-y-6">
              {POSTS.map((p) => (
                <li
                  key={p.slug}
                  className="rounded-md border border-white/10 bg-white/5 p-4"
                >
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-lg font-semibold text-white hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-1 text-sm text-white/70">{p.excerpt}</p>
                  <p className="mt-1 text-xs text-white/50">{p.date}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
