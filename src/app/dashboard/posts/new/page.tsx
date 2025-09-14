"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
import RichTextEditor from "@/components/editor/RichTextEditor";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug too long"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

type PostFormData = z.infer<typeof postSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: "DRAFT",
    },
  });

  const title = watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      setValue("slug", slug);
    }
  }, [title, setValue]);

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

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: PostFormData) => {
    setIsLoading(true);

    try {
      const postData = {
        ...data,
        content,
        tagIds: selectedTags,
        published: data.status === "PUBLISHED",
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        router.push(`/dashboard/posts`);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (status === "loading") {
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
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Post
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                {...register("title")}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug (URL)
              </label>
              <input
                {...register("slug")}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="post-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-gray-700"
              >
                Excerpt (Optional)
              </label>
              <textarea
                {...register("excerpt")}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Brief description of your post"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Content
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your post..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Featured Image */}
            <div>
              <label
                htmlFor="featuredImage"
                className="block text-sm font-medium text-gray-700"
              >
                Featured Image URL (Optional)
              </label>
              <input
                {...register("featuredImage")}
                type="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {errors.featuredImage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.featuredImage.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700"
              >
                Category (Optional)
              </label>
              <select
                {...register("categoryId")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      selectedTags.includes(tag.id)
                        ? "border-blue-300 bg-blue-100 text-blue-800"
                        : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                {...register("status")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/posts")}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
