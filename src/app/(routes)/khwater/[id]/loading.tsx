// Loading state for Elm chapter page

export default function Loading() {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Progress Indicator Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full animate-pulse" style={{ width: '50%' }} />
        </div>
      </div>

      {/* Chapter Header Skeleton */}
      <header className="text-center mb-12">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/3 mx-auto animate-pulse" />
      </header>

      {/* Chapter Content Skeleton */}
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="space-y-4">
                {/* Title skeleton */}
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                {/* Text skeletons */}
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                  </div>
                ))}
                {/* Ayah skeleton */}
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Navigation Skeleton */}
      <nav className="flex justify-between items-center mt-12">
        <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
      </nav>
    </main>
  );
}
