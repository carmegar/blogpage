import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug too long"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  published: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const authorId = searchParams.get("authorId");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          category: true,
          tags: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      categoryId,
      tagIds,
      status,
      published,
    } = createPostSchema.parse(body);

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: "Post with this slug already exists" },
        { status: 400 }
      );
    }

    // Create post
    const postData: {
      title: string;
      slug: string;
      excerpt?: string;
      content: string;
      featuredImage?: string;
      status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      published: boolean;
      authorId: string;
      categoryId?: string;
      publishedAt?: Date;
    } = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      status,
      published,
      authorId: session.user.id,
    };

    if (categoryId) {
      postData.categoryId = categoryId;
    }

    if (published && status === "PUBLISHED") {
      postData.publishedAt = new Date();
    }

    const post = await prisma.post.create({
      data: {
        ...postData,
        tags:
          tagIds && tagIds.length > 0
            ? {
                connect: tagIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 }
    );
  }
}
