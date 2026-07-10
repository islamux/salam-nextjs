import { translations } from '@/lib/translations';
import type { ChapterMetadata } from '@/lib/types/khwater';
import Link from 'next/link';
interface ChapterCardProps {
  khwaterChapter: ChapterMetadata;
}

export function ChapterCard({ khwaterChapter }: ChapterCardProps) {
  const chapterNum = Number(khwaterChapter.id);

  return (
    <Link
      key={khwaterChapter.id}
      href={`/khwater/${khwaterChapter.id}`}
      className="group block p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
          {chapterNum}
        </span>
        <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-colors">
          <svg
            className="w-4 h-4 text-amber-500 dark:text-amber-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
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
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {translations.home.chapter(chapterNum)}
        </h3>
        {khwaterChapter.chapterTitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {khwaterChapter.chapterTitle}
          </p>
        )}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {translations.home.itemCount(khwaterChapter.itemCount)}
      </p>
    </Link>
  );
}
