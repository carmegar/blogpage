"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "WRITER":
        return "bg-blue-100 text-blue-800";
      case "USER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                NextJS Blog Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session.user?.name}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                  (session.user as ExtendedUser)?.role || "USER"
                )}`}
              >
                {(session.user as ExtendedUser)?.role}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Welcome to your Dashboard!
              </h2>

              <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Authentication System Working!
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        You are successfully authenticated. The NextAuth.js
                        integration with Prisma and Supabase is working
                        correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    User Information
                  </h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {session.user?.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {session.user?.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Role
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {(session.user as ExtendedUser)?.role}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        User ID
                      </dt>
                      <dd className="font-mono text-sm text-gray-900">
                        {(session.user as ExtendedUser)?.id}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {["ADMIN", "WRITER"].includes(
                      (session.user as ExtendedUser)?.role
                    ) && (
                      <>
                        <a
                          href="/dashboard/posts/new"
                          className="block w-full rounded px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
                        >
                          Create New Post
                        </a>
                        <a
                          href="/dashboard/posts"
                          className="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Posts
                        </a>
                        <a
                          href="/dashboard/categories"
                          className="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Categories
                        </a>
                        <a
                          href="/dashboard/tags"
                          className="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Tags
                        </a>
                      </>
                    )}
                    <a
                      href="/blog"
                      className="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Blog
                    </a>
                    {(session.user as ExtendedUser)?.role === "ADMIN" && (
                      <a
                        href="/dashboard/admin"
                        className="block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Admin Panel
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  🎉 Phase 3: Blog Core System - ✅ Complete!
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Authentication ✅ • Blog Management ✅ • Rich Text Editor ✅ •
                  Image Upload ✅
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
