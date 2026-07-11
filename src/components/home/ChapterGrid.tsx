import type { ChapterMetadata } from '@/lib/types/khwater';
import { translations } from '@/lib/translations';
import Link from 'next/link';
import { ChapterCard } from './ChapterCard';

interface ChapterGridProps {
  khwaterChapters: ChapterMetadata[];
}

export function ChapterGrid({ khwaterChapters }: ChapterGridProps) {
  if (khwaterChapters.length === 0) {
    return (
      <section className="text-center py-20">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-amber-300 dark:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="font-arabic text-xl text-gray-600 dark:text-gray-400 mb-2">تعذر تحميل الفصول</h2>
        <Link href="/home" className="text-sm text-amber-600 dark:text-amber-400 hover:underline">
          تحديث الصفحة
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className="h-px w-8 bg-amber-200 dark:bg-amber-800" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          {translations.home.allChapters}
        </h2>
        <span className="h-px w-8 bg-amber-200 dark:bg-amber-800" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr">
        {khwaterChapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            khwaterChapter={chapter}
            featured={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
