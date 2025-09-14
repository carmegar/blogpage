import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Only allow admins and writers to upload images
    const userRole = session.user?.role as string | undefined;
    if (!userRole || !["ADMIN", "WRITER"].includes(userRole)) {
      return NextResponse.json(
        { message: "Forbidden: Only admins and writers can upload images" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "nextjs-blog", // Organize uploads in a folder
            transformation: [
              { width: 1200, height: 630, crop: "limit" }, // Limit max size
              { quality: "auto" }, // Auto optimize quality
              { format: "auto" }, // Auto format (WebP when supported)
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed - no result returned"));
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

// Delete uploaded image
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user?.role as string | undefined;
    if (!userRole || !["ADMIN", "WRITER"].includes(userRole)) {
      return NextResponse.json(
        { message: "Forbidden: Only admins and writers can delete images" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("public_id");

    if (!publicId) {
      return NextResponse.json(
        { message: "Public ID is required" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return NextResponse.json({ message: "Image deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "Failed to delete image" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
