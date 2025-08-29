/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.sonexa.cc",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*"],
  transform: async (config, path) => {
    const now = new Date();
    console.log(`Transforming ${path} with timestamp: ${now.toISOString()}`);
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: now.toISOString(),
    };
  },
};
