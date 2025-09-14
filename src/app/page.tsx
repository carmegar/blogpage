import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  // Get featured posts and stats with fallback data
  let featuredPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    publishedAt: Date | null;
    author: { name: string };
    category: { name: string; color: string | null } | null;
    _count: { tags: number };
  }> = [];
  let totalPosts = 0;
  let totalCategories = 0;

  try {
    const [posts, postsCount, categoriesCount] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          published: true,
        },
        take: 6,
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            select: { name: true },
          },
          category: true,
          _count: {
            select: { tags: true },
          },
        },
      }),
      prisma.post.count({
        where: {
          status: "PUBLISHED",
          published: true,
        },
      }),
      prisma.category.count(),
    ]);

    featuredPosts = posts;
    totalPosts = postsCount;
    totalCategories = categoriesCount;
  } catch (error) {
    console.log("Database connection error, using fallback data:", error);
    // Fallback data for development
    featuredPosts = [
      {
        id: "sample-1",
        title: "Getting Started with Next.js 14 and TypeScript",
        slug: "getting-started-nextjs-14-typescript",
        excerpt:
          "Learn how to create a modern, type-safe web application using Next.js 14 App Router and TypeScript. This comprehensive guide covers setup, routing, and best practices.",
        featuredImage: null,
        publishedAt: new Date(),
        author: { name: "Alex Rodriguez" },
        category: { name: "Technology", color: "#3B82F6" },
        _count: { tags: 3 },
      },
      {
        id: "sample-2",
        title: "Building Scalable Full-Stack Applications with Prisma ORM",
        slug: "building-scalable-fullstack-applications-prisma-orm",
        excerpt:
          "Master database management in modern web applications using Prisma ORM. Learn schema design, migrations, and advanced querying techniques.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 86400000),
        author: { name: "Alex Rodriguez" },
        category: { name: "Tutorials", color: "#10B981" },
        _count: { tags: 3 },
      },
      {
        id: "sample-3",
        title: "Production Deployment Guide: Next.js to Vercel",
        slug: "production-deployment-nextjs-vercel-guide",
        excerpt:
          "Complete walkthrough for deploying Next.js applications to production. Covers environment variables, performance optimization, and CI/CD best practices.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 172800000),
        author: { name: "Maria Chen" },
        category: { name: "DevOps", color: "#F59E0B" },
        _count: { tags: 3 },
      },
      {
        id: "sample-4",
        title: "Authentication in Next.js with NextAuth.js",
        slug: "authentication-nextjs-nextauth-complete-guide",
        excerpt:
          "Implement secure authentication in your Next.js applications using NextAuth.js. Support for multiple providers, JWT tokens, and session management.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 259200000),
        author: { name: "Alex Rodriguez" },
        category: { name: "Tutorials", color: "#10B981" },
        _count: { tags: 3 },
      },
      {
        id: "sample-5",
        title: "State Management in React: Context vs Redux vs Zustand",
        slug: "state-management-react-context-redux-zustand-comparison",
        excerpt:
          "Compare popular state management solutions for React applications. Learn when to use Context API, Redux Toolkit, or Zustand based on your project needs.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 345600000),
        author: { name: "David Kim" },
        category: { name: "Technology", color: "#3B82F6" },
        _count: { tags: 3 },
      },
      {
        id: "sample-6",
        title: "Web Performance Optimization: Core Web Vitals Guide",
        slug: "web-performance-optimization-core-web-vitals-guide",
        excerpt:
          "Master web performance optimization techniques. Learn how to improve Core Web Vitals, implement lazy loading, and optimize bundle sizes for better user experience.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 864000000),
        author: { name: "Alex Rodriguez" },
        category: { name: "DevOps", color: "#F59E0B" },
        _count: { tags: 3 },
      },
    ];
    totalPosts = 12;
    totalCategories = 3;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 bg-white pb-8 dark:bg-gray-800 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <svg
              className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="heading-xl animate-slideDown text-balance text-gray-900 dark:text-white">
                  <span className="block xl:inline">Modern</span>{" "}
                  <span className="block text-blue-600 xl:inline">
                    Blog Platform
                  </span>
                </h1>
                <p
                  className="animate-slideUp mt-3 text-base text-gray-500 dark:text-gray-300 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0"
                  style={{ animationDelay: "0.2s" }}
                >
                  A full-stack blog application built with Next.js, TypeScript,
                  and Prisma. Featuring authentication, rich text editing,
                  advanced search, and SEO optimization.
                </p>
                <div
                  className="animate-slideUp mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="rounded-md shadow">
                    <Link
                      href="/blog"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600 md:px-10 md:py-4 md:text-lg"
                    >
                      Explore Blog
                    </Link>
                  </div>
                  <div className="mt-3 sm:ml-3 sm:mt-0">
                    <Link
                      href="/register"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-100 px-8 py-3 text-base font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40 md:px-10 md:py-4 md:text-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="flex h-56 w-full items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 sm:h-72 md:h-96 lg:h-full lg:w-full">
            <div className="text-center text-white">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white dark:bg-gray-800/10">
                <svg
                  className="h-16 w-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold">Professional Blog</h3>
              <p className="text-blue-100">Built for Modern Web Development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-blue-600">
              Platform Statistics
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Growing Content Library
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="mt-5 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {totalPosts} Posts
                </p>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Published articles and tutorials
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <p className="mt-5 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {totalCategories} Categories
                </p>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Different topics covered
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="mt-5 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Smart Search
                </p>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Advanced filtering and search
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-blue-600">
              Latest Posts
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Articles
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Discover the latest insights, tutorials, and stories from our
              growing content library.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <article
                key={post.id}
                className="animate-fadeIn overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-800"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {post.featuredImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
                    {post.category && (
                      <span
                        className="rounded px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${post.category.color || "#3B82F6"}20`,
                          color: post.category.color || "#3B82F6",
                        }}
                      >
                        {post.category.name}
                      </span>
                    )}
                    <time>
                      {new Date(post.publishedAt!).toLocaleDateString()}
                    </time>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors duration-200 hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      By {post.author.name}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
            >
              View All Posts
              <svg
                className="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-blue-600">
              Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built with Modern Tech Stack
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Authentication
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Secure user authentication with NextAuth.js and role-based
                access control.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Rich Text Editor
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Powerful Tiptap editor with formatting, images, and real-time
                preview.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                SEO Optimized
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Complete SEO optimization with meta tags, structured data, and
                sitemaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
