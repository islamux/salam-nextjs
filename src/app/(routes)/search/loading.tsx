import { Skeleton, SkeletonSearchResult } from '@/components/shared/Skeletons';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <Skeleton height={40} width="50%" rounded className="mx-auto" />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonSearchResult key={i} />
        ))}
      </div>
    </div>
  );
}