// Loading state for home page - uses shared skeleton components

import {
  SkeletonHero,
  SkeletonSectionTitle,
  SkeletonGrid,
} from '@/components/shared/Skeletons';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <SkeletonHero showButton />

      <section>
        <SkeletonSectionTitle width="25%" />
        <SkeletonGrid count={12} />
      </section>
    </div>
  );
}
