import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { generateBlogPostMetadata } from "@/lib/seo";
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/structured-data";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featuredImage: string | null;
    publishedAt: Date | null;
    updatedAt: Date;
    categoryId: string | null;
    author: { id: string; name: string; email: string };
    category: {
      id: string;
      name: string;
      slug: string;
      color?: string | null;
    } | null;
    tags: Array<{
      id: string;
      name: string;
      slug: string;
      color?: string | null;
    }>;
  } | null = null;

  let relatedPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    publishedAt: Date | null;
    author: { name: string };
    category: {
      id: string;
      name: string;
      slug: string;
      color?: string | null;
    } | null;
  }> = [];

  try {
    const [postData, relatedPostsData] = await Promise.all([
      prisma.post.findUnique({
        where: {
          slug: params.slug,
          status: "PUBLISHED",
          published: true,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          category: true,
          tags: true,
        },
      }),
      prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          published: true,
          slug: {
            not: params.slug,
          },
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            select: { name: true },
          },
          category: true,
        },
      }),
    ]);

    post = postData;
    relatedPosts = relatedPostsData;
  } catch (error) {
    console.log(
      "Database connection error in blog post page, using fallback data:",
      error
    );

    // Fallback data for development - find matching post
    const fallbackPosts = [
      {
        id: "demo-1",
        title: "Getting Started with Next.js 14 and TypeScript",
        slug: "getting-started-nextjs-14-typescript",
        excerpt:
          "Learn how to create a modern, type-safe web application using Next.js 14 App Router and TypeScript. This comprehensive guide covers setup, routing, and best practices.",
        content: `# Getting Started with Next.js 14 and TypeScript

Next.js 14 introduces powerful new features that make building modern web applications easier than ever. Let's explore the key concepts you need to know.

## What's New in Next.js 14

Next.js 14 brings several improvements:
- **Turbopack**: Faster local development
- **Server Actions**: Simplified data mutations
- **App Router**: Improved routing system

## Setting Up Your Project

Create a new Next.js project with TypeScript:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind
cd my-app
npm run dev
\`\`\`

## Key Features

**Server Components**: Components that run on the server by default, providing better performance.

**Client Components**: Use "use client" for interactive components that need browser APIs.

**TypeScript Integration**: Built-in TypeScript support with excellent developer experience.

## Best Practices

1. Use TypeScript for type safety
2. Prefer Server Components when possible
3. Use async/await for data fetching
4. Optimize images with Next.js Image component

## Conclusion

Next.js 14 with TypeScript provides an excellent foundation for modern web applications. The combination of performance, developer experience, and type safety makes it a great choice for any project.`,
        featuredImage: null,
        publishedAt: new Date(),
        updatedAt: new Date(),
        categoryId: "1",
        author: { id: "1", name: "Alex Rodriguez", email: "alex@example.com" },
        category: {
          id: "1",
          name: "Technology",
          slug: "technology",
          color: "#3B82F6",
        },
        tags: [
          { id: "1", name: "Next.js", slug: "nextjs", color: "#000000" },
          { id: "2", name: "TypeScript", slug: "typescript", color: "#3178C6" },
          { id: "7", name: "React", slug: "react", color: "#61DAFB" },
        ],
      },
      {
        id: "demo-2",
        title: "Building Scalable Full-Stack Applications with Prisma ORM",
        slug: "building-scalable-fullstack-applications-prisma-orm",
        excerpt:
          "Master database management in modern web applications using Prisma ORM. Learn schema design, migrations, and advanced querying techniques.",
        content: `# Building Scalable Applications with Prisma ORM

Prisma is a next-generation ORM that makes database access easy and type-safe. Let's explore how to use it effectively in your projects.

## Why Choose Prisma?

Prisma offers several advantages:
- **Type Safety**: Auto-generated TypeScript types
- **Developer Experience**: Excellent IDE support with autocomplete
- **Database Agnostic**: Works with PostgreSQL, MySQL, SQLite, and more

## Setting Up Prisma

Install Prisma in your project:

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Schema Design

Define your database schema in \`schema.prisma\`:

\`\`\`prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}
\`\`\`

## Working with Data

Query your database with type safety:

\`\`\`typescript
const users = await prisma.user.findMany({
  include: {
    posts: true
  }
})
\`\`\`

## Migration Management

Keep your database in sync:

\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

## Conclusion

Prisma simplifies database management while providing excellent type safety and developer experience. It's an essential tool for modern full-stack applications.`,
        featuredImage: null,
        publishedAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        categoryId: "2",
        author: { id: "1", name: "Alex Rodriguez", email: "alex@example.com" },
        category: {
          id: "2",
          name: "Tutorials",
          slug: "tutorials",
          color: "#10B981",
        },
        tags: [
          { id: "3", name: "Prisma", slug: "prisma", color: "#2D3748" },
          { id: "4", name: "Database", slug: "database", color: "#4299E1" },
          { id: "8", name: "PostgreSQL", slug: "postgresql", color: "#336791" },
        ],
      },
      {
        id: "demo-3",
        title: "Production Deployment Guide: Next.js to Vercel",
        slug: "production-deployment-nextjs-vercel-guide",
        excerpt:
          "Complete walkthrough for deploying Next.js applications to production. Covers environment variables, performance optimization, and CI/CD best practices.",
        content: `# Deploying Next.js to Production with Vercel

Deploying your Next.js application to production doesn't have to be complicated. Vercel makes it simple and efficient.

## Why Vercel?

Vercel is the platform built by the creators of Next.js:
- **Zero Configuration**: Deploy with minimal setup
- **Global CDN**: Fast content delivery worldwide
- **Automatic Scaling**: Handles traffic spikes automatically

## Getting Started

1. **Connect Your Repository**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Import your project in Vercel dashboard

2. **Configure Environment Variables**
   Set up your production environment variables in the Vercel dashboard.

3. **Deploy**
   Every push to your main branch triggers automatic deployment.

## Environment Variables

Manage sensitive data securely:

\`\`\`bash
# .env.local
DATABASE_URL="your-production-db-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
\`\`\`

## Performance Optimization

**Image Optimization**: Next.js Image component works seamlessly with Vercel.

**Edge Functions**: Deploy serverless functions at the edge for better performance.

**Caching**: Automatic static file caching and CDN distribution.

## Custom Domains

Add your custom domain:
1. Go to your project settings
2. Add your domain
3. Configure DNS records
4. SSL certificates are handled automatically

## Monitoring

Vercel provides built-in analytics:
- Core Web Vitals
- Function invocation metrics
- Error tracking

## Conclusion

Vercel simplifies the deployment process while providing enterprise-grade performance and reliability. It's the ideal platform for Next.js applications.`,
        featuredImage: null,
        publishedAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        categoryId: "3",
        author: { id: "2", name: "Maria Chen", email: "maria@example.com" },
        category: { id: "3", name: "DevOps", slug: "devops", color: "#F59E0B" },
        tags: [
          { id: "5", name: "Deployment", slug: "deployment", color: "#EF4444" },
          { id: "6", name: "Production", slug: "production", color: "#8B5CF6" },
          { id: "9", name: "Vercel", slug: "vercel", color: "#000000" },
        ],
      },
    ];

    post = fallbackPosts.find((p) => p.slug === params.slug) || null;

    // Fallback related posts
    relatedPosts = [
      {
        id: "demo-2",
        title: "Building Scalable Full-Stack Applications with Prisma ORM",
        slug: "building-scalable-fullstack-applications-prisma-orm",
        excerpt:
          "Master database management in modern web applications using Prisma ORM.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 86400000),
        author: { name: "Alex Rodriguez" },
        category: {
          id: "2",
          name: "Tutorials",
          slug: "tutorials",
          color: "#10B981",
        },
      },
    ];
  }

  if (!post) {
    notFound();
  }

  // Generate structured data
  const articleStructuredData = generateArticleStructuredData({
    title: post.title,
    excerpt: post.excerpt || undefined,
    content: post.content,
    featuredImage: post.featuredImage || undefined,
    publishedAt: post.publishedAt || undefined,
    updatedAt: post.updatedAt,
    slug: post.slug,
    author: post.author,
    category: post.category || undefined,
    tags: post.tags,
  });

  // Breadcrumbs
  const breadcrumbItems = [{ name: "Blog", href: "/blog" }];

  if (post.category) {
    breadcrumbItems.push({
      name: post.category.name,
      href: `/blog?category=${post.category.slug}`,
    });
  }

  breadcrumbItems.push({
    name: post.title,
    href: `/blog/${post.slug}`,
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(
    breadcrumbItems.map((item) => ({ name: item.name, url: item.href }))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: `${post.category.color || "#3B82F6"}20`,
                  color: post.category.color || "#3B82F6",
                }}
              >
                {post.category.name}
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="heading-lg mb-4 text-balance text-gray-900 dark:text-white">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>By {post.author.name}</span>
              <span>•</span>
              <time>
                {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <div
            className="prose prose-lg dark:prose-invert prose-improved max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br />"),
            }}
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-medium text-gray-900">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full px-3 py-1 text-sm"
                  style={{
                    backgroundColor: `${tag.color || "#10B981"}20`,
                    color: tag.color || "#10B981",
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="mt-12 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                <span className="text-lg font-medium text-gray-700">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {post.author.name}
              </h4>
              <p className="text-gray-600">
                Author at NextJS Blog. Passionate about sharing knowledge and
                insights.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Related Posts
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {relatedPost.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9 relative h-32">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    {relatedPost.category && (
                      <span
                        className="mb-2 inline-block rounded px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${relatedPost.category.color || "#3B82F6"}20`,
                          color: relatedPost.category.color || "#3B82F6",
                        }}
                      >
                        {relatedPost.category.name}
                      </span>
                    )}

                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="transition-colors hover:text-blue-600"
                      >
                        {relatedPost.title}
                      </Link>
                    </h3>

                    {relatedPost.excerpt && (
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {relatedPost.excerpt}
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      By {relatedPost.author.name} •{" "}
                      {new Date(relatedPost.publishedAt!).toLocaleDateString()}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  let post: {
    title: string;
    excerpt?: string;
    featuredImage?: string;
    publishedAt?: Date;
    updatedAt: Date;
    author: { name: string };
    category?: { name: string };
    tags: { name: string }[];
  } | null = null;

  try {
    const dbPost = await prisma.post.findUnique({
      where: {
        slug: params.slug,
        status: "PUBLISHED",
        published: true,
      },
      include: {
        author: { select: { name: true } },
        category: true,
        tags: true,
      },
    });

    if (dbPost) {
      post = {
        title: dbPost.title,
        excerpt: dbPost.excerpt || undefined,
        featuredImage: dbPost.featuredImage || undefined,
        publishedAt: dbPost.publishedAt || undefined,
        updatedAt: dbPost.updatedAt,
        author: dbPost.author,
        category: dbPost.category ? { name: dbPost.category.name } : undefined,
        tags: dbPost.tags,
      };
    }
  } catch (error) {
    console.log("Database error in generateMetadata, using fallback:", error);

    // Fallback metadata for demo posts
    const fallbackPosts: { [key: string]: typeof post } = {
      "getting-started-nextjs-14-typescript": {
        title: "Getting Started with Next.js 14 and TypeScript",
        excerpt:
          "Learn how to create a modern, type-safe web application using Next.js 14 App Router and TypeScript.",
        updatedAt: new Date(),
        publishedAt: new Date(),
        author: { name: "Alex Rodriguez" },
        category: { name: "Technology" },
        tags: [{ name: "Next.js" }, { name: "TypeScript" }, { name: "React" }],
      },
      "building-scalable-fullstack-applications-prisma-orm": {
        title: "Building Scalable Full-Stack Applications with Prisma ORM",
        excerpt:
          "Master database management in modern web applications using Prisma ORM.",
        updatedAt: new Date(),
        publishedAt: new Date(Date.now() - 86400000),
        author: { name: "Alex Rodriguez" },
        category: { name: "Tutorials" },
        tags: [
          { name: "Prisma" },
          { name: "Database" },
          { name: "PostgreSQL" },
        ],
      },
      "production-deployment-nextjs-vercel-guide": {
        title: "Production Deployment Guide: Next.js to Vercel",
        excerpt:
          "Complete walkthrough for deploying Next.js applications to production.",
        updatedAt: new Date(),
        publishedAt: new Date(Date.now() - 172800000),
        author: { name: "Maria Chen" },
        category: { name: "DevOps" },
        tags: [
          { name: "Deployment" },
          { name: "Production" },
          { name: "Vercel" },
        ],
      },
      "authentication-nextjs-nextauth-complete-guide": {
        title: "Authentication in Next.js with NextAuth.js",
        excerpt:
          "Implement secure authentication in your Next.js applications using NextAuth.js.",
        updatedAt: new Date(),
        publishedAt: new Date(Date.now() - 259200000),
        author: { name: "Alex Rodriguez" },
        category: { name: "Tutorials" },
        tags: [
          { name: "Authentication" },
          { name: "NextAuth" },
          { name: "Security" },
        ],
      },
      "state-management-react-context-redux-zustand-comparison": {
        title: "State Management in React: Context vs Redux vs Zustand",
        excerpt:
          "Compare popular state management solutions for React applications.",
        updatedAt: new Date(),
        publishedAt: new Date(Date.now() - 345600000),
        author: { name: "David Kim" },
        category: { name: "Technology" },
        tags: [
          { name: "React" },
          { name: "State Management" },
          { name: "Redux" },
        ],
      },
      "docker-containerization-nodejs-applications-guide": {
        title: "Docker Containerization for Node.js Applications",
        excerpt: "Learn how to containerize Node.js applications using Docker.",
        updatedAt: new Date(),
        publishedAt: new Date(Date.now() - 432000000),
        author: { name: "Maria Chen" },
        category: { name: "DevOps" },
        tags: [
          { name: "Docker" },
          { name: "Node.js" },
          { name: "Containerization" },
        ],
      },
    };

    post = fallbackPosts[params.slug] || null;
  }

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return generateBlogPostMetadata({
    post,
    url: `/blog/${params.slug}`,
  });
}
