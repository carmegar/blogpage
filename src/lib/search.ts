// Fuse.js imported for client-side search functionality

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
  }[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  posts: SearchResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: SearchFilters;
}

export const fuseOptions = {
  keys: [
    {
      name: "title",
      weight: 0.5,
    },
    {
      name: "excerpt",
      weight: 0.3,
    },
    {
      name: "content",
      weight: 0.2,
    },
  ],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
};

export async function searchPosts(
  filters: SearchFilters
): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();

  if (filters.query) searchParams.set("q", filters.query);
  if (filters.category) searchParams.set("category", filters.category);
  if (filters.author) searchParams.set("author", filters.author);
  if (filters.dateFrom) searchParams.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) searchParams.set("dateTo", filters.dateTo);
  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());

  const response = await fetch(`/api/search?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search posts");
  }

  return response.json();
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
  );
}

export function truncateContent(
  content: string,
  maxLength: number = 200
): string {
  if (content.length <= maxLength) return content;

  const truncated = content.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  return lastSpaceIndex > 0
    ? truncated.substring(0, lastSpaceIndex) + "..."
    : truncated + "...";
}
