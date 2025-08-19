import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

// Simple placeholder data; you can replace with MDX sourcing later
const POSTS: Record<
  string,
  { title: string; excerpt: string; date: string; content: string }
> = {};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return siteMeta({ noIndex: true, title: "Blog" });
  return siteMeta({
    title: `${post.title} — Sonexa Blog`,
    description: post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return notFound();
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Sonexa" },
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <JsonLd data={articleLd} />
      <article className="mx-auto max-w-3xl px-6 py-12 prose prose-invert">
        <h1 className="text-4xl font-semibold">{post.title}</h1>
        <p className="mt-1 text-sm text-white/60">{post.date}</p>
        <div className="mt-6 whitespace-pre-wrap leading-7 text-white/90">
          {post.content}
        </div>
      </article>
    </main>
  );
}
