import { Prisma } from "@prisma/client";

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Prisma Query types
export type PostWhereInput = Prisma.PostWhereInput;
export type CategoryWhereInput = Prisma.CategoryWhereInput;
export type TagWhereInput = Prisma.TagWhereInput;
export type UserWhereInput = Prisma.UserWhereInput;

// Form data types
export interface PostFormData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  published: boolean;
  publishedAt?: Date;
  categoryId?: string;
  tagIds: string[];
  featuredImage?: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}

export interface TagFormData {
  name: string;
  slug?: string;
  color?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "WRITER" | "USER";
}

// Request body types
export interface CreatePostRequest {
  title: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  tagIds: string[];
  featuredImage?: string;
  status?: "DRAFT" | "PUBLISHED";
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

// Upload types
export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: ValidationError[];
}
