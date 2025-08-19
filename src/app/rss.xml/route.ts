export const runtime = "edge";

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
    date: "2025-08-19",
  },
  {
    slug: "tiktok-caption-tips",
    title: "10 TikTok Caption Tips That Will Boost Your Engagement",
    excerpt:
      "Discover proven strategies to make your TikTok captions go viral and increase your reach on the platform.",
    date: "2025-08-19",
  },
  {
    slug: "ai-video-editing-guide",
    title: "The Complete Guide to AI-Powered Video Editing",
    excerpt:
      "Everything you need to know about using AI to edit videos, from timing to styling and export options.",
    date: "2025-08-19",
  },
];

export async function GET() {
  const items = POSTS.map(
    (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://www.sonexa.cc/blog/${p.slug}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      <guid>https://www.sonexa.cc/blog/${p.slug}</guid>
    </item>
  `
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Sonexa Blog</title>
      <link>https://www.sonexa.cc/blog</link>
      <description>Guides and updates on lyric videos and captions.</description>
      ${items}
    </channel>
  </rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
