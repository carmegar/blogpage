import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="mx-auto mb-8 max-w-md text-xl text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Browse Blog
            </Link>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 rounded-lg bg-gray-100 p-4">
            <p className="mb-2 text-gray-600">
              Or try searching for what you need:
            </p>
            <Link
              href="/blog"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Use our search feature →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
