import { SearchX } from "lucide-react";

interface EmptyStateProps {
  /** true = triggered by a 422 EMPTY_RESULT from /api/analyze */
  isUnrecognized?: boolean;
  /** Custom message override */
  message?: string;
}

export default function EmptyState({
  isUnrecognized = false,
  message,
}: EmptyStateProps) {
  const displayMessage =
    message ??
    (isUnrecognized
      ? "Job title not recognized. Please try a different role."
      : "No results found. Try searching for a specific job title.");

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-fade-in-up flex flex-col items-center justify-center gap-5 py-16 px-6 text-center"
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <SearchX
          className="w-8 h-8 text-slate-400 dark:text-slate-500"
          strokeWidth={1.5}
        />
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-2 max-w-sm">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          {isUnrecognized ? "Role Not Recognized" : "No Results"}
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {displayMessage}
        </p>
      </div>

      {/* Suggestion pills */}
      {isUnrecognized && (
        <div className="flex flex-col items-center gap-2 mt-1">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
            Try one of these
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Data Analyst",
              "UX Designer",
              "Software Engineer",
              "Product Manager",
              "DevOps Engineer",
            ].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
