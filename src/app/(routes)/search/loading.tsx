// Loading state for search page - uses shared skeleton components

import {
  Skeleton,
  SkeletonSearchInput,
  SkeletonSearchResult,
} from '@/components/shared/Skeletons';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Title Skeleton */}
      <Skeleton height={40} width="50%" rounded className="mx-auto mb-8" />

      {/* Search Input Skeleton */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <SkeletonSearchInput />
        </div>
      </div>

      {/* Results Skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonSearchResult key={i} />
        ))}
      </div>
    </div>
  );
}
