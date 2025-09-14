import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  slug: z.string().min(1, "Slug is required").max(50, "Slug too long"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
});

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Failed to fetch tags" },
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

    // Only admins and writers can create tags
    const userRole = session.user?.role as string | undefined;
    if (!userRole || !["ADMIN", "WRITER"].includes(userRole)) {
      return NextResponse.json(
        { message: "Forbidden: Only admins and writers can create tags" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, color } = createTagSchema.parse(body);

    // Check if tag with name or slug already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { message: "Tag with this name or slug already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color: color || "#10B981",
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create tag" },
      { status: 500 }
    );
  }
}
