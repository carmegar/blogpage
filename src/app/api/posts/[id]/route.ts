import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug too long")
    .optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required").optional(),
  featuredImage: z.string().url().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  published: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if user can edit this post (author or admin)
    const userRole = session.user?.role as string | undefined;
    if (post.authorId !== session.user.id && userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: You can only edit your own posts" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData = updatePostSchema.parse(body);

    // Check if slug already exists (if updating slug)
    if (updateData.slug && updateData.slug !== post.slug) {
      const existingPost = await prisma.post.findUnique({
        where: { slug: updateData.slug },
      });

      if (existingPost) {
        return NextResponse.json(
          { message: "Post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Handle published date
    const finalUpdateData: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      featuredImage?: string;
      categoryId?: string;
      status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      published?: boolean;
      publishedAt?: Date | null;
      tags?: { set: { id: string }[] };
      tagIds?: string[];
    } = { ...updateData };
    if (
      updateData.published &&
      updateData.status === "PUBLISHED" &&
      !post.publishedAt
    ) {
      finalUpdateData.publishedAt = new Date();
    } else if (!updateData.published || updateData.status !== "PUBLISHED") {
      finalUpdateData.publishedAt = null;
    }

    // Handle tags
    if (updateData.tagIds !== undefined) {
      finalUpdateData.tags = {
        set: updateData.tagIds.map((id) => ({ id })),
      };
      delete finalUpdateData.tagIds;
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: finalUpdateData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if user can delete this post (author or admin)
    const userRole = session.user?.role as string | undefined;
    if (post.authorId !== session.user.id && userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: You can only delete your own posts" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Failed to delete post" },
      { status: 500 }
    );
  }
}
