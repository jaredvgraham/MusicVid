/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.sonexa.cc",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    "/dashboard",
    "/settings",
    "/upload",
    "/result/*",
    "/workspace/*",
    "/sign-in*",
    "/sign-up*",
    "/api/*",
  ],
  additionalPaths: async (config) => {
    // Manually add homepage + marketing routes
    return [
      {
        loc: "/",
        changefreq: "weekly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/lyric-video-maker",
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/add-lyrics-to-video",
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/ai-caption-generator",
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/pricing",
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/templates",
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/blog",
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/tiktok-captions",
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/youtube-captions",
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
    ];
  },
  // Turn off transform for dynamic fallback
  transform: async (config, path) => {
    return null; // ignore discovered dynamic routes
  },
};
