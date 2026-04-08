"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

// ─── Color scheme types ───────────────────────────────────────────────────────
type ColorScheme = "blue" | "violet" | "amber";

interface ResultCardProps {
  /** Card title shown in the header */
  title: string;
  /** Lucide icon component to render */
  icon: React.ReactNode;
  /** Array of skill/tool/cert string items */
  items: string[];
  /** Controls chip and accent colors */
  colorScheme: ColorScheme;
  /** Staggered animation delay (ms) */
  animationDelay?: number;
}

// ─── Color scheme maps ────────────────────────────────────────────────────────
const schemeStyles: Record<
  ColorScheme,
  {
    card: string;
    headerIcon: string;
    titleText: string;
    chip: string;
    iconDot: string;
    copyHover: string;
    glow: string;
  }
> = {
  blue: {
    card: "border-blue-500/20 dark:border-blue-500/20",
    headerIcon:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    titleText: "text-blue-700 dark:text-blue-300",
    chip: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30",
    iconDot: "bg-blue-500",
    copyHover: "hover:text-blue-500 dark:hover:text-blue-400",
    glow: "hover:shadow-blue-500/10",
  },
  violet: {
    card: "border-violet-500/20 dark:border-violet-500/20",
    headerIcon:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    titleText: "text-violet-700 dark:text-violet-300",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-500/30",
    iconDot: "bg-violet-500",
    copyHover: "hover:text-violet-500 dark:hover:text-violet-400",
    glow: "hover:shadow-violet-500/10",
  },
  amber: {
    card: "border-amber-500/20 dark:border-amber-500/20",
    headerIcon:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    titleText: "text-amber-700 dark:text-amber-300",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-500/30",
    iconDot: "bg-amber-500",
    copyHover: "hover:text-amber-500 dark:hover:text-amber-400",
    glow: "hover:shadow-amber-500/10",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ResultCard({
  title,
  icon,
  items,
  colorScheme,
  animationDelay = 0,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const styles = schemeStyles[colorScheme];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(items.join(", "));
      setCopied(true);
      // Reset back to copy icon after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently fail
    }
  };

  return (
    <div
      className={[
        // Base card styles
        "relative rounded-2xl border p-6 flex flex-col gap-5",
        // Light / Dark surfaces
        "bg-slate-100 dark:bg-slate-900",
        "border-slate-200 dark:border-slate-800",
        // Colour-scheme accent border override
        styles.card,
        // Hover glow
        "hover:shadow-xl",
        styles.glow,
        // Fade-in-up animation (defined in tailwind.config)
        "animate-fade-in-up",
        // Smooth transitions
        "transition-shadow duration-300",
      ].join(" ")}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div
            className={[
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              styles.headerIcon,
            ].join(" ")}
          >
            {icon}
          </div>

          {/* Title */}
          <h2
            className={[
              "text-base font-semibold tracking-wide",
              styles.titleText,
            ].join(" ")}
          >
            {title}
          </h2>
        </div>

        {/* Copy to Clipboard button */}
        <button
          id={`copy-${title.toLowerCase().replace(/\s+/g, "-")}`}
          type="button"
          onClick={handleCopy}
          aria-label={
            copied ? `${title} copied to clipboard` : `Copy ${title} to clipboard`
          }
          title={copied ? "Copied!" : "Copy to clipboard"}
          className={[
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            "text-slate-400 dark:text-slate-500",
            styles.copyHover,
            "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800",
            "active:scale-90",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400",
          ].join(" ")}
        >
          {copied ? (
            // Checkmark confirmation
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          ) : (
            <Copy className="w-4 h-4" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* ── Item count pill ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span
          className={[
            "inline-block w-2 h-2 rounded-full flex-shrink-0",
            styles.iconDot,
          ].join(" ")}
        />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* ── Chips ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={[
              "inline-flex items-center px-3 py-1.5 rounded-full",
              "text-sm font-medium",
              "transition-colors duration-150 cursor-default",
              styles.chip,
            ].join(" ")}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
