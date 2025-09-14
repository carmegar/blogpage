interface BlogPostData {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  publishedAt?: Date;
  updatedAt: Date;
  slug: string;
  author: {
    name: string;
    email: string;
  };
  category?: {
    name: string;
  };
  tags: {
    name: string;
  }[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export function generateArticleStructuredData(post: BlogPostData) {
  const imageUrl = post.featuredImage?.startsWith("http")
    ? post.featuredImage
    : `${siteUrl}${post.featuredImage || "/og-image.png"}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: [imageUrl],
    datePublished:
      post.publishedAt?.toISOString() || post.updatedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
      email: post.author.email,
    },
    publisher: {
      "@type": "Organization",
      name: "NextJS Blog - Modern Development Insights",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 60,
        height: 60,
      },
      url: siteUrl,
      description:
        "Professional blog covering modern web development technologies and best practices",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category?.name,
    keywords: post.tags.map((tag) => tag.name).join(", "),
    wordCount: post.content.split(" ").length,
    articleBody: post.content,
  };
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NextJS Blog - Modern Development Insights",
    description:
      "Professional blog covering modern web development with Next.js, TypeScript, React, and cutting-edge technologies. Expert tutorials, guides, and insights for developers.",
    url: siteUrl,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "NextJS Blog Team",
      url: siteUrl,
    },
    keywords: [
      "nextjs",
      "typescript",
      "react",
      "web development",
      "programming",
      "tutorials",
      "modern development",
      "javascript",
      "full-stack",
    ].join(", "),
  };
}

export function generateBlogStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "NextJS Blog - Modern Development Insights",
    description:
      "Professional blog covering modern web development with Next.js, TypeScript, React, and cutting-edge technologies. Expert tutorials, guides, and insights for developers.",
    url: `${siteUrl}/blog`,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "NextJS Blog - Modern Development Insights",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 60,
        height: 60,
      },
      url: siteUrl,
    },
    author: [
      {
        "@type": "Person",
        name: "Alex Rodriguez",
        jobTitle: "Senior Full-Stack Developer",
      },
      {
        "@type": "Person",
        name: "Maria Chen",
        jobTitle: "DevOps Engineer",
      },
      {
        "@type": "Person",
        name: "David Kim",
        jobTitle: "Frontend Specialist",
      },
    ],
    keywords: [
      "nextjs",
      "typescript",
      "react",
      "web development",
      "programming",
      "tutorials",
      "modern development",
      "javascript",
      "full-stack",
      "prisma",
      "tailwindcss",
      "authentication",
      "deployment",
      "performance",
    ].join(", "),
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NextJS Blog - Modern Development Insights",
    description:
      "Professional blog covering modern web development with Next.js, TypeScript, React, and cutting-edge technologies. Expert tutorials, guides, and insights for developers.",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 60,
      height: 60,
    },
    foundingDate: "2024",
    knowsAbout: [
      "Next.js",
      "TypeScript",
      "React",
      "Web Development",
      "Full-Stack Development",
      "JavaScript",
      "Node.js",
      "Prisma",
      "Tailwind CSS",
      "Authentication",
      "Database Design",
      "Deployment",
      "Performance Optimization",
      "SEO",
    ],
    sameAs: [
      "https://twitter.com/nextjsblog",
      "https://github.com/nextjsblog",
      "https://dev.to/nextjsblog",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Editorial",
      email: "contact@nextjsblog.dev",
    },
  };
}
