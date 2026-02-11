/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  exclude: ["/coming-soon", "/coming-soon/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/coming-soon"],
      },
    ],
    additionalSitemaps: [],
  },
  // Generate sitemap for dynamic routes
  additionalPaths: async () => {
    return [];
  },
};
