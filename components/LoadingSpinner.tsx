// Three skeleton cards that pulse while the API call is in flight.
// Uses Tailwind's built-in animate-pulse — no custom keyframes needed.

function SkeletonChip({ width }: { width: string }) {
  return (
    <div
      className={`h-7 rounded-full bg-slate-200 dark:bg-slate-700 ${width}`}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-6 flex flex-col gap-5 animate-pulse">
      {/* Header row */}
      <div className="flex items-center gap-3">
        {/* Icon badge placeholder */}
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
        {/* Title placeholder */}
        <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Item count placeholder */}
      <div className="h-3 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />

      {/* Chip placeholders — varied widths for realistic skeleton */}
      <div className="flex flex-wrap gap-2">
        <SkeletonChip width="w-20" />
        <SkeletonChip width="w-28" />
        <SkeletonChip width="w-16" />
        <SkeletonChip width="w-24" />
        <SkeletonChip width="w-20" />
        <SkeletonChip width="w-32" />
      </div>
    </div>
  );
}

export default function LoadingSpinner() {
  return (
    <section aria-busy="true" aria-label="Loading analysis results">
      {/* Status message */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 font-medium animate-pulse">
        Analyzing job market data…
      </p>

      {/* Three skeleton cards matching the ResultsSection layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  );
}
