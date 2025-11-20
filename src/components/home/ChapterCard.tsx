import { translations } from '@/lib/translations';
import type { ChapterMetadata } from '@/lib/types/khwater';
import Link from 'next/link';
interface ChapterCardProps {
  khwaterChapter: ChapterMetadata;
}

export function ChapterCard({ khwaterChapter }: ChapterCardProps) {

  return (
    <Link
      key={khwaterChapter.id}
      href={`/khwater/${khwaterChapter.id}`}
      className='group block p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:bg-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
    >

      <div className='flex items-center justify-between mb-4'>
        <span className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
          {khwaterChapter.id}
        </span>
        <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform'>
          <svg
            className='w-5 h-5 text-blue-600 dark:text-blue-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 517 7-7 7'
            />
          </svg>
        </div>
      </div>
      <div className='mb-2'>
        <h3 className='text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
          {translations.home.chapter(Number(khwaterChapter.id))}
        </h3>
        {khwaterChapter.chapterTitle && (
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
            {khwaterChapter.chapterTitle}
          </p>
        )}
      </div>
      <p className='text-sm text-gray-600 dark:text-gray-400'>
        {translations.home.itemCount(khwaterChapter.itemCount)}
      </p>

    </Link>
  );
}
