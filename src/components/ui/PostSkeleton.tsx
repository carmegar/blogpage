export default function PostSkeleton() {
  return (
    <article className="animate-pulse overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      {/* Image placeholder */}
      <div className="loading-skeleton h-48 bg-gray-200 dark:bg-gray-700"></div>

      <div className="p-6">
        {/* Category and date */}
        <div className="mb-3 flex items-center justify-between">
          <div className="loading-skeleton h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="loading-skeleton h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <div className="loading-skeleton mb-2 h-6 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="loading-skeleton h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Excerpt */}
        <div className="mb-4">
          <div className="loading-skeleton mb-1 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="loading-skeleton mb-1 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="loading-skeleton h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Tags */}
        <div className="mb-4 flex gap-2">
          <div className="loading-skeleton h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="loading-skeleton h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="loading-skeleton h-6 w-14 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Author and read more */}
        <div className="flex items-center justify-between">
          <div className="loading-skeleton h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="loading-skeleton h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </article>
  );
}

export function PostSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}
