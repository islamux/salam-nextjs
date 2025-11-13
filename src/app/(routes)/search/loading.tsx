// Loading state for search page

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Title Skeleton */}
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/2 mx-auto mb-8 animate-pulse" />

      {/* Search Input Skeleton */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Results Skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
