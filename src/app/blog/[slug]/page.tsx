import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

// Simple placeholder data; you can replace with MDX sourcing later
const POSTS: Record<
  string,
  { title: string; excerpt: string; date: string; content: string }
> = {
  "how-to-create-lyric-videos": {
    title: "How to Create Professional Lyric Videos in 5 Minutes",
    excerpt:
      "Learn the step-by-step process to create stunning lyric videos with AI-powered timing and professional templates.",
    date: "2024-01-15",
    content: `Creating professional lyric videos doesn't have to be complicated. With Sonexa's AI-powered platform, you can create stunning videos in just a few minutes.

## Step 1: Upload Your Song
Start by uploading your audio file. We support WAV, MP3, FLAC, M4A, AAC, and OGG formats. Our AI will automatically transcribe and time your lyrics to the beat.

## Step 2: Choose a Template
Select from our library of 100+ professional templates. Whether you want minimal, neon, kinetic, or bold styles, we have something for every genre and mood.

## Step 3: Customize Your Design
Adjust colors, fonts, and layouts to match your brand. Our intuitive editor makes it easy to create a unique look that represents your style.

## Step 4: Fine-tune Timing
Use our drag-and-drop timeline to perfect the timing of each word. Our AI gets it right most of the time, but you can always make adjustments for that perfect sync.

## Step 5: Export and Share
Render your video in multiple formats (16:9, 9:16, 1:1) and resolutions (720p, 1080p, 1440p) for any platform. Perfect for TikTok, Instagram, YouTube, and more.

## Pro Tips
- Use high-quality audio for better transcription accuracy
- Experiment with different templates to find your style
- Consider your target platform when choosing aspect ratios
- Save your favorite customizations as presets for future projects

Start creating your first lyric video today and see how easy it can be!`,
  },
  "tiktok-caption-tips": {
    title: "10 TikTok Caption Tips That Will Boost Your Engagement",
    excerpt:
      "Discover proven strategies to make your TikTok captions go viral and increase your reach on the platform.",
    date: "2024-01-10",
    content: `TikTok captions are crucial for engagement and discoverability. Here are 10 proven tips to make your captions work harder for you.

## 1. Hook Your Audience in the First Line
The first few words of your caption are crucial. Use questions, bold statements, or intriguing facts to grab attention immediately.

## 2. Use Trending Hashtags Strategically
Research trending hashtags in your niche and include 3-5 relevant ones. Don't overdo it - quality over quantity.

## 3. Create Curiosity Gaps
Leave your audience wanting more by creating mystery or asking questions that make them want to watch the full video.

## 4. Use Emojis to Break Up Text
Emojis make captions more visually appealing and help convey emotion quickly. They also improve readability on mobile devices.

## 5. Include Call-to-Actions
Tell your audience exactly what you want them to do: like, comment, share, or follow for more content.

## 6. Keep It Concise
TikTok users scroll quickly. Keep your captions short and punchy - aim for 2-3 lines maximum.

## 7. Use Trending Audio
Pair your captions with trending sounds and music to increase discoverability and engagement.

## 8. Create Relatable Content
Share personal experiences, struggles, or wins that your audience can relate to. Authenticity builds connection.

## 9. Test Different Caption Styles
Experiment with humor, storytelling, tips, and behind-the-scenes content to see what resonates with your audience.

## 10. Engage With Comments
Respond to comments on your videos to build community and encourage more engagement.

## Bonus Tip: Use AI-Powered Timing
Our AI caption generator automatically times your captions perfectly, ensuring maximum readability and engagement.

Start implementing these tips today and watch your TikTok engagement soar!`,
  },
  "ai-video-editing-guide": {
    title: "The Complete Guide to AI-Powered Video Editing",
    excerpt:
      "Everything you need to know about using AI to edit videos, from timing to styling and export options.",
    date: "2024-01-05",
    content: `AI-powered video editing is revolutionizing how creators produce content. Here's your complete guide to leveraging AI for professional video creation.

## What is AI Video Editing?
AI video editing uses machine learning algorithms to automate complex editing tasks like timing, transcription, and styling. This technology saves hours of manual work while maintaining professional quality.

## Key AI Features in Video Editing

### Automatic Transcription
Our AI automatically transcribes audio content, creating accurate text that can be used for captions, subtitles, or lyric videos.

### Intelligent Timing
AI analyzes audio patterns to perfectly sync text with speech or music. This is especially valuable for lyric videos and captions.

### Smart Styling
AI can suggest and apply consistent styling across your video, ensuring professional appearance without manual design work.

### Automated Export
AI handles the technical aspects of video rendering, optimizing for different platforms and devices.

## Benefits of AI Video Editing

- **Time Savings**: Reduce editing time from hours to minutes
- **Consistency**: Maintain uniform quality across all projects
- **Accessibility**: Create professional content without technical expertise
- **Scalability**: Handle multiple projects simultaneously
- **Cost Efficiency**: Reduce the need for expensive editing software

## Best Practices for AI Video Editing

1. **Start with Quality Source Material**: Good audio and video input leads to better AI processing
2. **Review AI Suggestions**: Always review and adjust AI-generated content
3. **Customize Templates**: Use AI as a starting point, then add your personal touch
4. **Test Different Styles**: Experiment with various AI-generated styles to find your voice
5. **Maintain Brand Consistency**: Use AI tools that respect your brand guidelines

## The Future of AI Video Editing
As AI technology advances, we can expect even more sophisticated features like automatic scene detection, intelligent music selection, and predictive editing suggestions.

## Getting Started
Begin with simple projects to familiarize yourself with AI tools. Upload a song or video, let AI handle the heavy lifting, then refine the results to match your vision.

AI video editing isn't about replacing human creativity - it's about amplifying it. Use these tools to focus on what matters most: your creative vision and message.`,
  },
};

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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
      </div>

      <JsonLd data={articleLd} />

      <div className="relative mx-auto max-w-4xl px-6 py-20">
        {/* Back to blog link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to blog
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-12 text-center">
          {/* Category badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
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
              Creator Guide
            </span>
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl mb-6">
            {post.title}
          </h1>

          {/* Meta information */}
          <div className="flex items-center justify-center gap-4 text-sm text-white/60">
            <span className="inline-flex items-center gap-1">
              <svg
                className="w-4 h-4"
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
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Sonexa Team
            </span>
          </div>
        </header>

        {/* Article content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
            <div
              className="whitespace-pre-wrap leading-relaxed text-white/90 prose-headings:text-white prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-p:text-white/90 prose-p:mb-4 prose-ul:text-white/90 prose-li:text-white/90 prose-strong:text-white prose-strong:font-semibold"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/\n\n## (.*?)\n/g, "\n\n<h2>$1</h2>\n")
                  .replace(/\n\n### (.*?)\n/g, "\n\n<h3>$1</h3>\n")
                  .replace(/\n\n- (.*?)\n/g, "\n\n<ul><li>$1</li></ul>\n")
                  .replace(/\n\n(.*?)\n\n/g, "\n\n<p>$1</p>\n\n"),
              }}
            />
          </div>
        </article>

        {/* Article footer */}
        <footer className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center">
            <p className="text-white/60 mb-4">Found this helpful?</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-3 text-sm font-medium text-white transition hover:from-fuchsia-600 hover:to-purple-600 hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Start Creating
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <svg
                  className="w-4 h-4"
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
                More Articles
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
