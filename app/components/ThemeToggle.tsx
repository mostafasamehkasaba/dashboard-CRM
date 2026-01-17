"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const handleToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex items-center gap-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] px-4 py-2 text-sm text-[var(--dash-text)] transition hover:shadow-lg hover:shadow-[var(--dash-shadow)]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--dash-panel-glass)] text-[var(--dash-primary)]">
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M10 2a1 1 0 0 1 1 1v2.07a6.5 6.5 0 0 1 3.94 2.03l1.46-1.46a1 1 0 1 1 1.42 1.42l-1.46 1.46A6.5 6.5 0 0 1 19.93 12H22a1 1 0 1 1 0 2h-2.07a6.5 6.5 0 0 1-2.03 3.94l1.46 1.46a1 1 0 0 1-1.42 1.42l-1.46-1.46A6.5 6.5 0 0 1 11 19.93V22a1 1 0 1 1-2 0v-2.07a6.5 6.5 0 0 1-3.94-2.03l-1.46 1.46a1 1 0 1 1-1.42-1.42l1.46-1.46A6.5 6.5 0 0 1 4.07 14H2a1 1 0 1 1 0-2h2.07a6.5 6.5 0 0 1 2.03-3.94L4.64 6.6a1 1 0 1 1 1.42-1.42l1.46 1.46A6.5 6.5 0 0 1 10 5.07V3a1 1 0 0 1 1-1Z"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3a1 1 0 0 1 1 1v1.07a7 7 0 1 1-7 7H4a1 1 0 1 1 0-2h1.07a7 7 0 0 1 6.93-5V4a1 1 0 0 1 1-1Zm0 4a5 5 0 1 0 5 5 5 5 0 0 0-5-5Z"
            />
          </svg>
        )}
      </span>
      <span className="font-medium">
        {theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}
      </span>
    </button>
  );
};

export default ThemeToggle;
