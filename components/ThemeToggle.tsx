"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Inline SVG icons — no icon library dependency needed
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  // Prevent hydration mismatch: only render the interactive button after mount.
  // On first server render, next-themes hasn't injected the theme class yet,
  // so we render null to avoid a flash of the wrong icon.
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a same-size transparent placeholder so the header layout
    // doesn't shift when the button appears after hydration.
    return (
      <div
        className="w-10 h-10 rounded-lg"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        // Size & shape
        "w-10 h-10 rounded-lg",
        "flex items-center justify-center",
        // Colors — light mode: slate surface with dark icon
        "bg-slate-200 text-slate-600 border border-slate-300",
        // Colors — dark mode: slate surface with light icon
        "dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        // Hover states
        "hover:bg-slate-300 dark:hover:bg-slate-700",
        "hover:text-slate-900 dark:hover:text-slate-50",
        // Interactions
        "active:scale-90",
        // Transition — smooth icon swap + background
        "transition-all duration-200",
        // Focus ring for keyboard accessibility
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
      ].join(" ")}
    >
      {/* Icon swaps on theme change with a crossfade effect */}
      <span
        className={[
          "absolute transition-all duration-300",
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-75 pointer-events-none",
        ].join(" ")}
      >
        <SunIcon className="w-5 h-5" />
      </span>

      <span
        className={[
          "absolute transition-all duration-300",
          !isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75 pointer-events-none",
        ].join(" ")}
      >
        <MoonIcon className="w-5 h-5" />
      </span>
    </button>
  );
}
