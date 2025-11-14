// Loading state for Khwater chapter page - uses shared skeleton components

import {
  SkeletonProgress,
  SkeletonTitle,
  SkeletonContentItem,
  SkeletonNavigation,
} from '@/components/shared/Skeletons';

export default function Loading() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <SkeletonProgress showLabel labelWidth="25%" />

      <header className="text-center mb-12">
        <SkeletonTitle width="33%" className="mx-auto" />
      </header>

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <SkeletonContentItem />
            </div>
          ))}
        </div>
      </article>

      <SkeletonNavigation />
    </main>
  );
}
