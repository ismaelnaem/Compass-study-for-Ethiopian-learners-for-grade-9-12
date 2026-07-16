// Skeleton loading placeholders — same shimmer pattern as the classic
// "Google-style" list skeleton, but colored from the active theme's CSS
// variables (see index.css .skeleton-shimmer) instead of hardcoded light
// gray, so it looks correct on Original/Dark/Gray/Compass/Black alike.

interface SkeletonRowProps {
  lines?: 2 | 3;
}

export function SkeletonRow({ lines = 2 }: SkeletonRowProps) {
  return (
    <div className="flex items-center gap-3 p-3">
      {/* Avatar circle */}
      <div className="skeleton-shimmer w-11 h-11 rounded-full flex-shrink-0" />

      {/* Title + subtitle lines, varying widths so it doesn't look like a grid */}
      <div className="flex-1 space-y-2">
        <div className="skeleton-shimmer h-3.5 rounded-md w-3/5" />
        <div className="skeleton-shimmer h-3 rounded-md w-2/5" />
        {lines === 3 && <div className="skeleton-shimmer h-3 rounded-md w-4/5" />}
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  lines?: 2 | 3;
}

// Drop this in anywhere a real list/feed is still loading:
//   {isLoading ? <SkeletonList count={5} /> : <RealList items={items} />}
export function SkeletonList({ count = 5, lines = 2 }: SkeletonListProps) {
  return (
    <div className="divide-y divide-[var(--color-border-subtle)]">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} lines={lines} />
      ))}
    </div>
  );
}
