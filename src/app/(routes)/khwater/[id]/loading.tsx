import { SkeletonTitle, SkeletonContentItem } from '@/components/shared/Skeletons';

export default function Loading() {
  return (
    <main className="min-h-screen bg-book-page">
      <div className="fixed right-0 top-0 bottom-0 w-1 bg-gray-100 dark:bg-gray-800/50 z-30">
        <div className="w-full h-1/3 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-12 py-8 sm:py-16">
        <header className="text-center mb-16">
          <div className="text-6xl font-arabic font-bold text-amber-600/20 dark:text-amber-400/10 select-none leading-none block mb-4 relative overflow-hidden w-20 h-24 mx-auto rounded-lg">
            <div className="absolute inset-0 skeleton-shimmer bg-gray-200 dark:bg-gray-800" />
          </div>
          <SkeletonTitle width="33%" className="mx-auto mb-3" />
        </header>

        <article className="prose-reader">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <SkeletonContentItem />
              {i < 4 && (
                <div className="flex items-center justify-center my-10">
                  <span className="text-amber-400/20 dark:text-amber-500/10 text-lg">✦</span>
                </div>
              )}
            </div>
          ))}
        </article>
      </div>
    </main>
  );
}
