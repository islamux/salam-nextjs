// Home page - displays all 29 Khwater chapters
import Link from 'next/link';
import { getAllChapters } from '@/lib/data/khwater-service';

export const metadata = {
  title: 'خواطر - جميع الفصول',
  description: 'Islamic spiritual texts - All chapters',
};

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function HomePage() {
  const chapters = await getAllChapters();

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
    {/* Hero Section */}
    <section className="text-center mb-16">
    <div className="mb-8">
    <h1 className="arabic-title text-5xl md:text-6xl font-bold mb-6">
    كتاب خواطر
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
    خواطر عن الدين والحياة
    </p>
    <p className="text-gray-500 dark:text-gray-500">
    {chapters.length} مقدمة 
    </p>
    </div>

    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
    <Link
    href="/search"
    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    <svg
    className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
    </svg>
    بحث في المحتوى
    </Link>
    </div>
    </section>

    {/* Chapters Grid */}
    <section>
    <h2 className="text-2xl font-bold mb-8 text-center">جميع الفصول</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {chapters.map((chapter, index) => (
      <Link
      key={chapter.id}
      href={`/khwater/${chapter.id}`}
      className="group block p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
    >
      <div className="flex items-center justify-between mb-4">
      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
      {chapter.id}
      </span>
      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
      <svg
      className="w-5 h-5 text-blue-600 dark:text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
      />
      </svg>
      </div>
      </div>
      <div className="mb-2">
        <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          الفصل {chapter.id}
        </h3>
        {chapter.chapterTitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {chapter.chapterTitle}
          </p>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {chapter.itemCount} عنصر
      </p>
      </Link>
    ))}
    </div>
    </section>
    </main>
  );
}
