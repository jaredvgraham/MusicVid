export const runtime = "edge";

const POSTS: Array<{
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}> = [];

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
