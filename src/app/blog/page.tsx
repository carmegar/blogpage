import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import SearchBar from "@/components/ui/SearchBar";
import SearchFilters from "@/components/ui/SearchFilters";
import SearchResults from "@/components/ui/SearchResults";
import { SearchResult } from "@/lib/search";
import Pagination from "@/components/ui/Pagination";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { generateSearchMetadata } from "@/lib/seo";
import { generateBlogStructuredData } from "@/lib/structured-data";
import { PostWhereInput } from "@/types/api";

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    q?: string;
    author?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || "1");
  const categorySlug = searchParams.category;
  const searchQuery = searchParams.q;
  const authorFilter = searchParams.author;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const limit = 6;
  const skip = (page - 1) * limit;

  const isSearchMode = !!(searchQuery || authorFilter || dateFrom || dateTo);

  const where: PostWhereInput = {
    status: "PUBLISHED",
    published: true,
  };

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { excerpt: { contains: searchQuery, mode: "insensitive" } },
      { content: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (authorFilter) {
    where.author = {
      name: { contains: authorFilter, mode: "insensitive" },
    };
  }

  if (dateFrom || dateTo) {
    where.publishedAt = {};
    if (dateFrom) {
      where.publishedAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.publishedAt.lte = new Date(dateTo);
    }
  }

  let posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content?: string;
    featuredImage: string | null;
    publishedAt: Date | null;
    createdAt?: Date;
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
    _count: { tags: number };
  }> = [];
  let total = 0;
  let totalAllPosts = 0; // Total count of all published posts (not filtered)
  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string | null;
    description?: string | null;
    _count: { posts: number };
  }> = [];
  let authors: Array<{ id: string; name: string }> = [];

  try {
    const [
      postsData,
      totalData,
      totalAllPostsData,
      categoriesData,
      authorsData,
    ] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          category: true,
          tags: true,
          _count: {
            select: { tags: true },
          },
        },
      }),
      prisma.post.count({ where }),
      prisma.post.count({
        where: {
          status: "PUBLISHED",
          published: true,
        },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { posts: true },
          },
        },
      }),
      prisma.user.findMany({
        where: {
          posts: {
            some: {
              status: "PUBLISHED",
              published: true,
            },
          },
        },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    posts = postsData;
    total = totalData;
    totalAllPosts = totalAllPostsData;
    categories = categoriesData;
    authors = authorsData;
  } catch (error) {
    console.log(
      "Database connection error in blog page, using fallback data:",
      error
    );

    // Fallback data for blog page - Professional content
    posts = [
      {
        id: "demo-1",
        title: "Getting Started with Next.js 14 and TypeScript",
        slug: "getting-started-nextjs-14-typescript",
        excerpt:
          "Learn how to create a modern, type-safe web application using Next.js 14 App Router and TypeScript. This comprehensive guide covers setup, routing, and best practices.",
        featuredImage: null,
        publishedAt: new Date(),
        createdAt: new Date(),
        content:
          "Learn how to create a modern, type-safe web application using Next.js 14 App Router and TypeScript. This comprehensive guide covers setup, routing, and best practices.",
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
        _count: { tags: 3 },
      },
      {
        id: "demo-2",
        title: "Building Scalable Full-Stack Applications with Prisma ORM",
        slug: "building-scalable-fullstack-applications-prisma-orm",
        excerpt:
          "Master database management in modern web applications using Prisma ORM. Learn schema design, migrations, and advanced querying techniques.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 86400000),
        createdAt: new Date(Date.now() - 86400000),
        content:
          "Master database management in modern web applications using Prisma ORM. Learn schema design, migrations, and advanced querying techniques.",
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
        _count: { tags: 3 },
      },
      {
        id: "demo-3",
        title: "Production Deployment Guide: Next.js to Vercel",
        slug: "production-deployment-nextjs-vercel-guide",
        excerpt:
          "Complete walkthrough for deploying Next.js applications to production. Covers environment variables, performance optimization, and CI/CD best practices.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 172800000),
        createdAt: new Date(Date.now() - 172800000),
        content:
          "Complete walkthrough for deploying Next.js applications to production. Covers environment variables, performance optimization, and CI/CD best practices.",
        author: { id: "2", name: "Maria Chen", email: "maria@example.com" },
        category: { id: "3", name: "DevOps", slug: "devops", color: "#F59E0B" },
        tags: [
          { id: "5", name: "Deployment", slug: "deployment", color: "#EF4444" },
          { id: "6", name: "Production", slug: "production", color: "#8B5CF6" },
          { id: "9", name: "Vercel", slug: "vercel", color: "#000000" },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-4",
        title: "Authentication in Next.js with NextAuth.js",
        slug: "authentication-nextjs-nextauth-complete-guide",
        excerpt:
          "Implement secure authentication in your Next.js applications using NextAuth.js. Support for multiple providers, JWT tokens, and session management.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 259200000), // 3 days ago
        createdAt: new Date(Date.now() - 259200000),
        content:
          "Implement secure authentication in your Next.js applications using NextAuth.js. Support for multiple providers, JWT tokens, and session management.",
        author: { id: "1", name: "Alex Rodriguez", email: "alex@example.com" },
        category: {
          id: "2",
          name: "Tutorials",
          slug: "tutorials",
          color: "#10B981",
        },
        tags: [
          {
            id: "10",
            name: "Authentication",
            slug: "authentication",
            color: "#DC2626",
          },
          { id: "11", name: "NextAuth", slug: "nextauth", color: "#7C3AED" },
          { id: "12", name: "Security", slug: "security", color: "#059669" },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-5",
        title: "State Management in React: Context vs Redux vs Zustand",
        slug: "state-management-react-context-redux-zustand-comparison",
        excerpt:
          "Compare popular state management solutions for React applications. Learn when to use Context API, Redux Toolkit, or Zustand based on your project needs.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 345600000), // 4 days ago
        createdAt: new Date(Date.now() - 345600000),
        content:
          "Compare popular state management solutions for React applications. Learn when to use Context API, Redux Toolkit, or Zustand based on your project needs.",
        author: { id: "3", name: "David Kim", email: "david@example.com" },
        category: {
          id: "1",
          name: "Technology",
          slug: "technology",
          color: "#3B82F6",
        },
        tags: [
          { id: "7", name: "React", slug: "react", color: "#61DAFB" },
          {
            id: "13",
            name: "State Management",
            slug: "state-management",
            color: "#8B5CF6",
          },
          { id: "14", name: "Redux", slug: "redux", color: "#764ABC" },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-6",
        title: "Docker Containerization for Node.js Applications",
        slug: "docker-containerization-nodejs-applications-guide",
        excerpt:
          "Learn how to containerize Node.js applications using Docker. Includes multi-stage builds, optimization techniques, and deployment strategies.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 432000000), // 5 days ago
        createdAt: new Date(Date.now() - 432000000),
        content:
          "Learn how to containerize Node.js applications using Docker. Includes multi-stage builds, optimization techniques, and deployment strategies.",
        author: { id: "2", name: "Maria Chen", email: "maria@example.com" },
        category: { id: "3", name: "DevOps", slug: "devops", color: "#F59E0B" },
        tags: [
          { id: "15", name: "Docker", slug: "docker", color: "#2496ED" },
          { id: "16", name: "Node.js", slug: "nodejs", color: "#339933" },
          {
            id: "17",
            name: "Containerization",
            slug: "containerization",
            color: "#FF6B35",
          },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-7",
        title: "Building RESTful APIs with Express.js and TypeScript",
        slug: "building-restful-apis-express-typescript-guide",
        excerpt:
          "Create robust and type-safe REST APIs using Express.js and TypeScript. Covers middleware, validation, error handling, and testing strategies.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 518400000), // 6 days ago
        createdAt: new Date(Date.now() - 518400000),
        content:
          "Create robust and type-safe REST APIs using Express.js and TypeScript. Covers middleware, validation, error handling, and testing strategies.",
        author: { id: "3", name: "David Kim", email: "david@example.com" },
        category: {
          id: "2",
          name: "Tutorials",
          slug: "tutorials",
          color: "#10B981",
        },
        tags: [
          { id: "18", name: "Express.js", slug: "expressjs", color: "#000000" },
          { id: "2", name: "TypeScript", slug: "typescript", color: "#3178C6" },
          { id: "19", name: "REST API", slug: "rest-api", color: "#FF6B00" },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-8",
        title: "CSS-in-JS vs Tailwind CSS: Modern Styling Approaches",
        slug: "css-in-js-vs-tailwind-css-modern-styling-comparison",
        excerpt:
          "Explore modern CSS approaches for React applications. Compare CSS-in-JS solutions like Styled Components with utility-first frameworks like Tailwind CSS.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 604800000), // 7 days ago
        createdAt: new Date(Date.now() - 604800000),
        content:
          "Explore modern CSS approaches for React applications. Compare CSS-in-JS solutions like Styled Components with utility-first frameworks like Tailwind CSS.",
        author: { id: "1", name: "Alex Rodriguez", email: "alex@example.com" },
        category: {
          id: "1",
          name: "Technology",
          slug: "technology",
          color: "#3B82F6",
        },
        tags: [
          {
            id: "20",
            name: "Tailwind CSS",
            slug: "tailwind-css",
            color: "#06B6D4",
          },
          { id: "21", name: "CSS-in-JS", slug: "css-in-js", color: "#DD0031" },
          { id: "22", name: "Styling", slug: "styling", color: "#FF69B4" },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-9",
        title: "GraphQL vs REST: Choosing the Right API Architecture",
        slug: "graphql-vs-rest-choosing-right-api-architecture",
        excerpt:
          "Deep dive into API architecture patterns. Learn when to choose GraphQL over REST, performance implications, and implementation considerations.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 691200000), // 8 days ago
        createdAt: new Date(Date.now() - 691200000),
        content:
          "Deep dive into API architecture patterns. Learn when to choose GraphQL over REST, performance implications, and implementation considerations.",
        author: { id: "2", name: "Maria Chen", email: "maria@example.com" },
        category: {
          id: "1",
          name: "Technology",
          slug: "technology",
          color: "#3B82F6",
        },
        tags: [
          { id: "23", name: "GraphQL", slug: "graphql", color: "#E10098" },
          { id: "19", name: "REST API", slug: "rest-api", color: "#FF6B00" },
          {
            id: "24",
            name: "API Design",
            slug: "api-design",
            color: "#4A90E2",
          },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-10",
        title:
          "Testing React Applications: Jest, Testing Library, and Playwright",
        slug: "testing-react-applications-jest-testing-library-playwright",
        excerpt:
          "Comprehensive testing strategies for React applications. Unit testing with Jest, integration testing with Testing Library, and E2E testing with Playwright.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 777600000), // 9 days ago
        createdAt: new Date(Date.now() - 777600000),
        content:
          "Comprehensive testing strategies for React applications. Unit testing with Jest, integration testing with Testing Library, and E2E testing with Playwright.",
        author: { id: "3", name: "David Kim", email: "david@example.com" },
        category: {
          id: "2",
          name: "Tutorials",
          slug: "tutorials",
          color: "#10B981",
        },
        tags: [
          { id: "25", name: "Testing", slug: "testing", color: "#C53030" },
          { id: "26", name: "Jest", slug: "jest", color: "#C21325" },
          {
            id: "27",
            name: "Playwright",
            slug: "playwright",
            color: "#2EAD33",
          },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-11",
        title: "Web Performance Optimization: Core Web Vitals Guide",
        slug: "web-performance-optimization-core-web-vitals-guide",
        excerpt:
          "Master web performance optimization techniques. Learn how to improve Core Web Vitals, implement lazy loading, and optimize bundle sizes for better user experience.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 864000000), // 10 days ago
        createdAt: new Date(Date.now() - 864000000),
        content:
          "Master web performance optimization techniques. Learn how to improve Core Web Vitals, implement lazy loading, and optimize bundle sizes for better user experience.",
        author: { id: "1", name: "Alex Rodriguez", email: "alex@example.com" },
        category: { id: "3", name: "DevOps", slug: "devops", color: "#F59E0B" },
        tags: [
          {
            id: "28",
            name: "Performance",
            slug: "performance",
            color: "#F56500",
          },
          {
            id: "29",
            name: "Core Web Vitals",
            slug: "core-web-vitals",
            color: "#4285F4",
          },
          {
            id: "30",
            name: "Optimization",
            slug: "optimization",
            color: "#0F9D58",
          },
        ],
        _count: { tags: 3 },
      },
      {
        id: "demo-12",
        title: "Microservices Architecture with Node.js and Docker",
        slug: "microservices-architecture-nodejs-docker-guide",
        excerpt:
          "Design and implement microservices architecture using Node.js and Docker. Learn about service communication, data management, and deployment strategies.",
        featuredImage: null,
        publishedAt: new Date(Date.now() - 950400000), // 11 days ago
        createdAt: new Date(Date.now() - 950400000),
        content:
          "Design and implement microservices architecture using Node.js and Docker. Learn about service communication, data management, and deployment strategies.",
        author: { id: "2", name: "Maria Chen", email: "maria@example.com" },
        category: { id: "3", name: "DevOps", slug: "devops", color: "#F59E0B" },
        tags: [
          {
            id: "31",
            name: "Microservices",
            slug: "microservices",
            color: "#FF6B6B",
          },
          { id: "16", name: "Node.js", slug: "nodejs", color: "#339933" },
          { id: "15", name: "Docker", slug: "docker", color: "#2496ED" },
        ],
        _count: { tags: 3 },
      },
    ];

    categories = [
      {
        id: "1",
        name: "Technology",
        slug: "technology",
        color: "#3B82F6",
        _count: { posts: 4 },
      },
      {
        id: "2",
        name: "Tutorials",
        slug: "tutorials",
        color: "#10B981",
        _count: { posts: 4 },
      },
      {
        id: "3",
        name: "DevOps",
        slug: "devops",
        color: "#F59E0B",
        _count: { posts: 4 },
      },
    ];

    authors = [
      { id: "1", name: "Alex Rodriguez" },
      { id: "2", name: "Maria Chen" },
      { id: "3", name: "David Kim" },
    ];

    // Set total count for all posts (unfiltered)
    totalAllPosts = 12; // Total fallback posts available

    // Apply category filter to fallback data
    if (categorySlug) {
      posts = posts.filter((post) => post.category?.slug === categorySlug);
    }

    total = posts.length;
  }

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const selectedCategory = categorySlug
    ? categories.find((cat) => cat.slug === categorySlug)
    : null;

  const blogStructuredData = generateBlogStructuredData();

  // Breadcrumb items
  const breadcrumbItems = [{ name: "Blog", href: "/blog" }];

  if (selectedCategory && !isSearchMode) {
    breadcrumbItems.push({
      name: selectedCategory.name,
      href: `/blog?category=${selectedCategory.slug}`,
    });
  }

  if (isSearchMode) {
    breadcrumbItems.push({
      name: "Search Results",
      href: `/blog${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />
      {/* Header */}
      <div className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="heading-lg text-balance text-gray-900 dark:text-white">
              Blog
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Discover insights, tutorials, and stories
            </p>
          </div>

          {/* Search Section */}
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="w-full flex-1">
                <SearchBar placeholder="Search posts..." />
              </div>
              <SearchFilters categories={categories} authors={authors} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter - Only show if not in search mode */}
            {!isSearchMode && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/blog"
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      !categorySlug
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    All Posts ({totalAllPosts})
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog?category=${category.slug}`}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        categorySlug === category.slug
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {category.name} ({category._count.posts})
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Current Category or Search Results Header */}
            {selectedCategory && !isSearchMode && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory.name}
                </h2>
                {selectedCategory.description && (
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {selectedCategory.description}
                  </p>
                )}
              </div>
            )}

            {isSearchMode && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h2>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                  {searchQuery && (
                    <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                  )}
                  {authorFilter && (
                    <span>Author: &ldquo;{authorFilter}&rdquo;</span>
                  )}
                  {categorySlug && (
                    <span>
                      Category: &ldquo;{selectedCategory?.name}&rdquo;
                    </span>
                  )}
                  {dateFrom && (
                    <span>From: {new Date(dateFrom).toLocaleDateString()}</span>
                  )}
                  {dateTo && (
                    <span>To: {new Date(dateTo).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            )}

            {/* Posts Grid or Search Results */}
            {isSearchMode ? (
              <SearchResults
                results={posts as SearchResult[]}
                searchQuery={searchQuery || ""}
                totalCount={total}
              />
            ) : posts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {posts.map((post, index) => (
                  <article
                    key={post.id}
                    className="animate-fadeIn overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {post.featuredImage && (
                      <div className="aspect-w-16 aspect-h-9 relative h-48">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
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
                        </div>
                        <time>
                          {new Date(post.publishedAt!).toLocaleDateString()}
                        </time>
                      </div>

                      {/* Title */}
                      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-colors duration-200 hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded-full px-2 py-1 text-xs"
                              style={{
                                backgroundColor: `${tag.color || "#10B981"}20`,
                                color: tag.color || "#10B981",
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          By {post.author.name}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group inline-flex items-center text-sm font-medium text-blue-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Read more
                          <svg
                            className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No posts found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {categorySlug
                      ? `No posts found in ${selectedCategory?.name} category.`
                      : "No posts have been published yet."}
                  </p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  hasNextPage={hasNext}
                  hasPrevPage={hasPrev}
                  basePath="/blog"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className="flex items-center justify-between rounded p-2 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-600"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category._count.posts}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: BlogPageProps) {
  const searchQuery = searchParams.q;

  // Get total count for search results with fallback
  let totalPosts = 0;
  try {
    totalPosts = await prisma.post.count({
      where: {
        status: "PUBLISHED",
        published: true,
      },
    });
  } catch (error) {
    console.log("Database error in generateMetadata, using fallback:", error);
    totalPosts = 3; // Fallback count
  }

  return generateSearchMetadata({
    query: searchQuery,
    totalResults: totalPosts,
  });
}
