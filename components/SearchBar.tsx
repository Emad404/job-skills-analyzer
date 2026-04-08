"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Label */}
      <label
        htmlFor="job-title-input"
        className="block text-sm font-medium text-slate-700 dark:text-white mb-2 tracking-wide uppercase"
      >
        Enter a Job Title
      </label>

      {/* Input + Button row */}
      <div className="flex gap-3 items-stretch">
        {/* Text Input */}
        <div className="relative flex-1 group">
          {/* Search icon */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-200 group-focus-within:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </div>

          <input
            id="job-title-input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={100}
            placeholder="e.g. Data Analyst, UX Designer, DevOps Engineer..."
            autoComplete="off"
            spellCheck={false}
            className={[
              // Layout
              "w-full h-14 pl-12 pr-4 rounded-xl",
              // Typography
              "text-base font-medium",
              // Light mode
              "bg-slate-100 border border-slate-300",
              "text-slate-900 placeholder-slate-400",
              // Dark mode
              "dark:bg-slate-800 dark:border-slate-700",
              "dark:text-slate-50 dark:placeholder-slate-500",
              // Focus ring — blue glow
              "outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500",
              "dark:focus:ring-blue-400/40 dark:focus:border-blue-400",
              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Transition
              "transition-all duration-200",
            ].join(" ")}
          />
        </div>

        {/* Analyze Button */}
        <button
          id="analyze-button"
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          aria-label="Analyze job title"
          className={[
            // Layout
            "h-14 px-7 rounded-xl",
            // Typography
            "text-base font-semibold text-white whitespace-nowrap",
            // Gradient background
            "bg-gradient-to-r from-blue-600 to-violet-600",
            "dark:from-blue-500 dark:to-violet-500",
            // Hover — slight brightness lift
            "hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/30",
            // Active — press-down feel
            "active:scale-[0.97]",
            // Disabled
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100",
            "disabled:hover:shadow-none disabled:active:scale-100",
            // Transitions
            "transition-all duration-200",
            "flex items-center gap-2",
          ].join(" ")}
        >
          {isLoading ? (
            <>
              {/* Mini spinner inside button */}
              <svg
                className="w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing…
            </>
          ) : (
            <>
              Analyze
              {/* Arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Character count hint */}
      {value.length > 60 && (
        <p className="mt-2 text-xs text-right text-slate-500 dark:text-slate-400">
          {value.length}/100
        </p>
      )}
    </div>
  );
}
