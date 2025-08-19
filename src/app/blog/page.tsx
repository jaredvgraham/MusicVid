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
}> = [
  {
    slug: "how-to-create-lyric-videos",
    title: "How to Create Professional Lyric Videos in 5 Minutes",
    excerpt:
      "Learn the step-by-step process to create stunning lyric videos with AI-powered timing and professional templates.",
    date: "2024-01-15",
  },
  {
    slug: "tiktok-caption-tips",
    title: "10 TikTok Caption Tips That Will Boost Your Engagement",
    excerpt:
      "Discover proven strategies to make your TikTok captions go viral and increase your reach on the platform.",
    date: "2024-01-10",
  },
  {
    slug: "ai-video-editing-guide",
    title: "The Complete Guide to AI-Powered Video Editing",
    excerpt:
      "Everything you need to know about using AI to edit videos, from timing to styling and export options.",
    date: "2024-01-05",
  },
];

export default function Page(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Hero Section */}
        <section className="pt-20 pb-16 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
              <svg
                className="w-4 h-4 text-fuchsia-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Creator Resources
            </div>
          </div>

          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:text-6xl mb-6">
            Creator
            <span className="block bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-xl text-white/70 leading-relaxed">
            Guides, tips, and insights to help you create amazing content with
            AI-powered tools.
          </p>
        </section>

        {/* Blog Posts */}
        <section className="pb-24">
          {POSTS.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
                <svg
                  className="w-8 h-8 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-white/60 text-lg">Posts coming soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {POSTS.map((post) => (
                <article
                  key={post.slug}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-105"
                >
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    {/* Date badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-medium text-fuchsia-200">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`} className="block mb-3">
                      <h2 className="text-xl font-semibold text-white group-hover:text-fuchsia-200 transition-colors duration-300 leading-tight">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Read more link */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300"
                    >
                      Read more
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
