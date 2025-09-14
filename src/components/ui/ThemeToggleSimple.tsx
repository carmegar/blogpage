"use client";

import { useEffect, useState } from "react";

export default function ThemeToggleSimple() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check current theme from document
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-all duration-200 hover:scale-110 hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sun Icon */}
      <svg
        className={`h-5 w-5 text-gray-800 transition-all duration-300 dark:text-gray-200 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`absolute h-5 w-5 text-gray-800 transition-all duration-300 dark:text-gray-200 ${
          !isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-lg bg-current opacity-0 transition-opacity duration-150 group-active:opacity-10" />
    </button>
  );
}
