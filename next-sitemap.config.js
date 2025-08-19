/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.sonexa.cc",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*"],
};
