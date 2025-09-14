import { Metadata } from "next";

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
}

const defaultSEO = {
  siteName: "NextJS Blog - Modern Development Insights",
  siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  description:
    "Professional blog covering modern web development with Next.js, TypeScript, React, and cutting-edge technologies. Expert tutorials, guides, and insights for developers.",
  image: "/og-image.png",
  author: "NextJS Blog Team",
  keywords: [
    "nextjs",
    "blog",
    "typescript",
    "prisma",
    "tailwindcss",
    "react",
    "web development",
    "full-stack",
    "javascript",
    "programming",
    "tutorials",
    "modern web development",
    "app router",
    "server components",
    "authentication",
    "database",
    "deployment",
    "performance",
    "seo",
    "best practices",
  ],
};

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: SEOData): Metadata {
  const fullTitle =
    title === defaultSEO.siteName ? title : `${title} | ${defaultSEO.siteName}`;
  const fullUrl = url ? `${defaultSEO.siteUrl}${url}` : defaultSEO.siteUrl;
  const ogImage = image || defaultSEO.image;
  const fullImage = ogImage.startsWith("http")
    ? ogImage
    : `${defaultSEO.siteUrl}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: [...defaultSEO.keywords, ...keywords].join(", "),
    authors: [{ name: author || defaultSEO.author }],
    creator: author || defaultSEO.author,
    publisher: defaultSEO.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: type as "website" | "article",
      locale: "en_US",
      url: fullUrl,
      siteName: defaultSEO.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [author || defaultSEO.author],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImage],
      creator: "@nextjsblog",
      site: "@nextjsblog",
    },
    alternates: {
      canonical: fullUrl,
    },
    other: {
      "msapplication-TileColor": "#2563eb",
      "theme-color": "#ffffff",
    },
  };
}

export function generateBlogPostMetadata({
  post,
  url,
}: {
  post: {
    title: string;
    excerpt?: string;
    featuredImage?: string;
    publishedAt?: Date;
    updatedAt: Date;
    author: { name: string };
    category?: { name: string };
    tags: { name: string }[];
  };
  url: string;
}): Metadata {
  const keywords = [
    ...(post.category ? [post.category.name] : []),
    ...post.tags.map((tag) => tag.name),
  ];

  return generateMetadata({
    title: post.title,
    description: post.excerpt || `Read ${post.title} by ${post.author.name}`,
    keywords,
    image: post.featuredImage,
    url,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author.name,
  });
}

export function generateCategoryMetadata({
  category,
  url,
}: {
  category: {
    name: string;
    description?: string;
  };
  url: string;
}): Metadata {
  return generateMetadata({
    title: `${category.name} Posts`,
    description:
      category.description ||
      `Browse all posts in the ${category.name} category`,
    keywords: [category.name.toLowerCase(), "category", "posts"],
    url,
    type: "website",
  });
}

export function generateSearchMetadata({
  query,
  totalResults,
}: {
  query?: string;
  totalResults: number;
}): Metadata {
  const title = query ? `Search results for "${query}"` : "Search Posts";
  const description = query
    ? `Found ${totalResults} posts matching "${query}"`
    : "Search through all blog posts";

  return generateMetadata({
    title,
    description,
    keywords: query ? [query, "search", "results"] : ["search", "posts"],
    url: `/blog${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    type: "website",
  });
}
