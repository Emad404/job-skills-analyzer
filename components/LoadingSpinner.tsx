function SkeletonTag({ width }: { width: string }) {
  return (
    <div
      className={`h-6 rounded ${width}`}
      style={{ backgroundColor: "var(--surface-3)" }}
    />
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-lg border-l-[3px] flex flex-col gap-5 animate-pulse"
      style={{
        border: "1px solid var(--border)",
        borderLeftColor: "var(--border)",
        backgroundColor: "var(--surface-2)",
        borderRadius: "8px",
        padding: "20px 24px",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-4 h-4 rounded flex-shrink-0"
          style={{ backgroundColor: "var(--surface-3)" }}
        />
        <div
          className="h-3 w-16 rounded"
          style={{ backgroundColor: "var(--surface-3)" }}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <SkeletonTag width="w-14" />
        <SkeletonTag width="w-20" />
        <SkeletonTag width="w-12" />
        <SkeletonTag width="w-24" />
        <SkeletonTag width="w-16" />
        <SkeletonTag width="w-20" />
        <SkeletonTag width="w-28" />
        <SkeletonTag width="w-14" />
      </div>
    </div>
  );
}

export default function LoadingSpinner() {
  return (
    <section aria-busy="true" aria-label="Loading analysis results">
      <div
        className="flex items-center justify-between mb-1 pb-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="h-3 w-24 rounded animate-pulse"
          style={{ backgroundColor: "var(--surface-3)" }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  );
}
