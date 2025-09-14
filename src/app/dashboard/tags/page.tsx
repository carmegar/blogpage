"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  slug: z.string().min(1, "Slug is required").max(50, "Slug too long"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
});

type TagFormData = z.infer<typeof tagSchema>;

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: string;
  _count: {
    posts: number;
  };
}

export default function TagsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      color: "#10B981",
    },
  });

  const name = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      setValue("slug", slug);
    }
  }, [name, setValue]);

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

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const onSubmit = async (data: TagFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        setShowForm(false);
        fetchTags();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create tag");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Failed to create tag");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTag = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTags();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("Failed to delete tag");
    }
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
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {showForm ? "Cancel" : "Add Tag"}
            </button>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="border-b border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Create New Tag
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Tag name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Slug *
                    </label>
                    <input
                      {...register("slug")}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="tag-slug"
                    />
                    {errors.slug && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Color
                  </label>
                  <input
                    {...register("color")}
                    type="color"
                    className="mt-1 block h-10 w-20 rounded-md border-gray-300"
                  />
                  {errors.color && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.color.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Create Tag"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tags List */}
          <div className="p-6">
            {tags.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        ></div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {tag.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteTag(tag.id, tag.name)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mb-2 text-sm text-gray-500">
                      Slug: {tag.slug}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{tag._count.posts} posts</span>
                      <span>
                        {new Date(tag.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No tags
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new tag.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
