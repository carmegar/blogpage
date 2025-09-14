"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ThemeToggleSimple from "@/components/ui/ThemeToggleSimple";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <span className="text-xl font-bold text-white">B</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                NextJS Blog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Blog
            </Link>

            {/* Theme Toggle */}
            <ThemeToggleSimple />

            {/* Auth Section */}
            <div className="ml-8 flex items-center space-x-4 border-l border-gray-200 pl-8 dark:border-gray-700">
              {session ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {session.user?.name}
                    </span>
                  </div>

                  {(session.user?.role === "ADMIN" ||
                    session.user?.role === "WRITER") && (
                    <Link
                      href="/dashboard"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button and theme toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggleSimple />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-900 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>

              {/* Mobile Auth */}
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                {session ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 px-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {session.user?.name}
                      </span>
                    </div>

                    {(session.user?.role === "ADMIN" ||
                      session.user?.role === "WRITER") && (
                      <Link
                        href="/dashboard"
                        className="px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="px-3 py-2 text-left text-base font-medium text-red-600 hover:text-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/login"
                      className="px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="mx-3 rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
