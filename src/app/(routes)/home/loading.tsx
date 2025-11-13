// Loading state for home page

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section Skeleton */}
      <section className="text-center mb-16">
        <div className="mb-8 animate-pulse">
          <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6 w-3/4 mx-auto" />
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 w-1/2 mx-auto" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/3 mx-auto" />
        </div>

        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
          <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </section>

      {/* Chapters Grid Skeleton */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/4 mx-auto animate-pulse" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
