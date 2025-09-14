/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/dashboard", "/dashboard/*", "/login", "/register", "/api/*"],
  additionalPaths: async () => {
    // Static additional paths for now - dynamic paths require database access
    try {
      const additionalPaths = [
        {
          loc: "/blog",
          changefreq: "daily",
          priority: 0.9,
          lastmod: new Date().toISOString(),
        },
      ];

      return additionalPaths;
    } catch (error) {
      console.error("Error generating sitemap paths:", error);
      return [];
    }
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/dashboard", "/api", "/login", "/register"],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom transform for specific paths
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    if (path === "/blog") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Default transform
    return {
      loc: path,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
