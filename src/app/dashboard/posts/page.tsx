"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  tags: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  featuredImage?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function PostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const userRole = session.user?.role as string | undefined;
    if (!userRole || !["ADMIN", "WRITER"].includes(userRole)) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  // Fetch posts
  const fetchPosts = useCallback(
    async (page = 1, statusFilter = "all") => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        // If user is not admin, only show their own posts
        const userRole = session?.user?.role as string | undefined;
        if (userRole !== "ADMIN") {
          params.append("authorId", session?.user?.id || "");
        }

        const response = await fetch(`/api/posts?${params}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  useEffect(() => {
    if (session) {
      fetchPosts(currentPage, filter);
    }
  }, [session, currentPage, filter, fetchPosts]);

  const deletePost = async (id: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts(currentPage, filter);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const getStatusBadge = (status: string, published: boolean) => {
    if (status === "PUBLISHED" && published) {
      return (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
          Published
        </span>
      );
    } else if (status === "DRAFT") {
      return (
        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          Draft
        </span>
      );
    } else if (status === "ARCHIVED") {
      return (
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          Archived
        </span>
      );
    }
    return (
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
        Unknown
      </span>
    );
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
              {pagination && (
                <p className="mt-1 text-sm text-gray-600">
                  {pagination.total} total posts
                </p>
              )}
            </div>
            <Link
              href="/dashboard/posts/new"
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Post
            </Link>
          </div>

          {/* Filters */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex space-x-2">
              {["all", "DRAFT", "PUBLISHED", "ARCHIVED"].map((statusFilter) => (
                <button
                  key={statusFilter}
                  onClick={() => {
                    setFilter(statusFilter);
                    setCurrentPage(1);
                  }}
                  className={`rounded-md px-3 py-1 text-sm ${
                    filter === statusFilter
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {statusFilter === "all"
                    ? "All"
                    : statusFilter.charAt(0) +
                      statusFilter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="p-6">
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          {getStatusBadge(post.status, post.published)}
                          {post.category && (
                            <span
                              className="rounded px-2 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: `${post.category.color}20`,
                                color: post.category.color,
                              }}
                            >
                              {post.category.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start space-x-4">
                          {post.featuredImage && (
                            <div className="flex-shrink-0">
                              <div className="relative h-16 w-16 overflow-hidden rounded">
                                <Image
                                  src={post.featuredImage}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h3 className="mb-1 text-lg font-semibold text-gray-900">
                              <Link
                                href={`/dashboard/posts/${post.id}/edit`}
                                className="hover:text-blue-600"
                              >
                                {post.title}
                              </Link>
                            </h3>

                            {post.excerpt && (
                              <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                                {post.excerpt}
                              </p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>By {post.author.name}</span>
                              <span>•</span>
                              <span>
                                Created{" "}
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                              {post.publishedAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Published{" "}
                                    {new Date(
                                      post.publishedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>

                            {post.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="rounded px-2 py-1 text-xs"
                                    style={{
                                      backgroundColor: `${tag.color}20`,
                                      color: tag.color,
                                    }}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="px-2 py-1 text-xs text-gray-500">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex items-center space-x-2">
                        {post.published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deletePost(post.id, post.title)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-gray-500">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No posts found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first post.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/posts/new"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      Create Post
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex space-x-1">
                  {pagination.hasPrev && (
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium ${
                        pageNum === currentPage
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {pagination.hasNext && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
