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
    if (e.key === "Enter" && !isLoading) onSubmit();
  };

  return (
    <div className="w-full">
      <div className="flex gap-2.5 items-stretch">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              style={{ color: "var(--text-muted)", transition: "color 150ms" }}
              className="group-focus-within:text-[var(--accent)]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
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
            className="input-app w-full h-[52px] pl-10 pr-4 rounded-lg text-sm font-medium"
          />
        </div>

        <button
          id="analyze-button"
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          aria-label="Analyze job title"
          className="btn-accent h-[52px] w-[120px] flex-shrink-0 rounded-[6px] text-[0.9rem] font-medium flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing…
            </>
          ) : (
            <>
              Analyze
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>

      {value.length > 60 && (
        <p
          className="mt-1.5 text-xs text-right tabular-nums"
          style={{ color: "var(--text-muted)" }}
        >
          {value.length}/100
        </p>
      )}
    </div>
  );
}
