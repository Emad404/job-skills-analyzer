import { SearchX } from "lucide-react";

interface EmptyStateProps {
  isUnrecognized?: boolean;
  message?: string;
}

export default function EmptyState({
  isUnrecognized = false,
  message,
}: EmptyStateProps) {
  const displayMessage =
    message ??
    (isUnrecognized
      ? "We couldn't find data for that job title. Try a more common role."
      : "No results found. Try a different job title.");

  return (
    <div role="status" aria-live="polite" className="animate-fade-in-up py-14">
      <div className="flex items-start gap-4 max-w-sm">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface-3)",
          }}
        >
          <SearchX
            className="w-5 h-5"
            strokeWidth={1.5}
            style={{ color: "var(--text-muted)" }}
          />
        </div>
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            {isUnrecognized ? "Role not recognized" : "No results"}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {displayMessage}
          </p>

          {isUnrecognized && (
            <div className="mt-4">
              <p
                className="text-[0.7rem] font-medium uppercase mb-2"
                style={{ letterSpacing: "0.08em", color: "var(--text-muted)" }}
              >
                Try one of these
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Data Analyst", "UX Designer", "Software Engineer", "Product Manager"].map(
                  (s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded text-xs font-medium border"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-secondary)",
                        backgroundColor: "var(--surface-3)",
                      }}
                    >
                      {s}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
