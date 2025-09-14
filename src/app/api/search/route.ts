import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PostWhereInput } from "@/types/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const author = searchParams.get("author");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Base search conditions
    const where: PostWhereInput = {
      status: "PUBLISHED",
      published: true,
    };

    // Add text search if query provided
    if (query && query.trim()) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    // Add category filter
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Add author filter
    if (author) {
      where.author = {
        name: { contains: author, mode: "insensitive" },
      };
    }

    // Add date range filters
    if (dateFrom || dateTo) {
      where.publishedAt = {};
      if (dateFrom) {
        where.publishedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.publishedAt.lte = new Date(dateTo);
      }
    }

    // Execute search with pagination
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        query: query || "",
        category: category || "",
        author: author || "",
        dateFrom: dateFrom || "",
        dateTo: dateTo || "",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
