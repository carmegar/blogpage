"use client";

import { useEffect } from "react";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize theme on client
    const initTheme = () => {
      const stored = localStorage.getItem("theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const theme = stored || systemTheme;

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    };

    // Run immediately
    initTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        initTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <>{children}</>;
}
