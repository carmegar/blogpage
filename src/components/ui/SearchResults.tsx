"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SearchResult,
  highlightSearchTerm,
  truncateContent,
} from "@/lib/search";

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  loading?: boolean;
  totalCount?: number;
}

export default function SearchResults({
  results,
  searchQuery,
  loading = false,
  totalCount,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          No results found
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? `No posts found for "${searchQuery}". Try different keywords or adjust your filters.`
            : "No posts match your current filters. Try adjusting them."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {totalCount && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {totalCount} result{totalCount !== 1 ? "s" : ""} found
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}

      {results.map((post) => (
        <article
          key={post.id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="p-6">
            <div className="mb-4 flex items-center gap-4">
              {post.category && (
                <span
                  className="rounded-full px-2 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: post.category.color || "#3B82F6" }}
                >
                  {post.category.name}
                </span>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                By {post.author.name} •{" "}
                {new Date(
                  post.publishedAt || post.createdAt
                ).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-6">
              {post.featuredImage && (
                <div className="flex-shrink-0">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg">
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
                <h3 className="mb-2 text-xl font-bold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(post.title, searchQuery),
                    }}
                  />
                </h3>

                {post.excerpt && (
                  <p
                    className="mb-3 text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(
                        truncateContent(post.excerpt, 150),
                        searchQuery
                      ),
                    }}
                  />
                )}

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        style={{
                          borderLeft: `3px solid ${tag.color || "#10B981"}`,
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
