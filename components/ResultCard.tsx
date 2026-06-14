"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type ColorScheme = "indigo" | "cyan" | "emerald";

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  colorScheme: ColorScheme;
  animationDelay?: number;
}

const schemeStyles: Record<ColorScheme, { stripeColor: string; iconColor: string }> = {
  indigo: {
    stripeColor: "#4F46E5",
    iconColor: "#4F46E5",
  },
  cyan: {
    stripeColor: "#0891B2",
    iconColor: "#0891B2",
  },
  emerald: {
    stripeColor: "#059669",
    iconColor: "#059669",
  },
};

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
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div
      className="flex flex-col gap-5 rounded-lg border-l-[3px] animate-fade-in-up"
      style={{
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderLeftColor: styles.stripeColor,
        borderRadius: "8px",
        padding: "20px 24px",
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span style={{ color: styles.iconColor }}>{icon}</span>
          <h2
            className="font-semibold uppercase"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              color: "var(--text-secondary)",
            }}
          >
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? `${title} copied` : `Copy ${title}`}
          title={copied ? "Copied!" : "Copy to clipboard"}
          className="w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--surface-3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} style={{ color: styles.iconColor }} />
          ) : (
            <Copy className="w-3.5 h-3.5" strokeWidth={2} />
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center cursor-default"
            style={{
              backgroundColor: "var(--surface-3)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              padding: "4px 10px",
              borderRadius: "4px",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
