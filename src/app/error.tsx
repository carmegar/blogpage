"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-600">
              <svg
                className="h-16 w-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Something Went Wrong
          </h1>
          <p className="mx-auto mb-8 max-w-md text-xl text-gray-600">
            We encountered an unexpected error while processing your request.
            Our team has been notified and is working to fix this issue.
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-left">
              <h3 className="mb-2 text-lg font-semibold text-red-800">
                Development Error:
              </h3>
              <p className="break-all font-mono text-sm text-red-700">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-red-600">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={reset}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
            <Link
              href="/"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-8 rounded-lg bg-gray-100 p-4">
            <p className="text-gray-600">
              If this problem persists, please contact our support team with the
              error details above.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
