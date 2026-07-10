import { translations } from '@/lib/translations';
import type { ChapterMetadata } from '@/lib/types/khwater';
import Link from 'next/link';

interface ChapterCardProps {
  khwaterChapter: ChapterMetadata;
  featured?: boolean;
}

const MOTIFS = [
  'M12 4l-8 8 8 8 8-8-8-8z',
  'M12 2l-9 9 1.5 1.5L12 5l7.5 7.5L21 11l-9-9z',
  'M12 4a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z',
  'M4 4h16v16H4V4zm2 2v12h12V6H6z',
  'M3 3l18 18M3 21L21 3',
];

export function ChapterCard({ khwaterChapter, featured = false }: ChapterCardProps) {
  const chapterNum = Number(khwaterChapter.id);
  const motifIndex = chapterNum % MOTIFS.length;

  return (
    <Link
      href={`/khwater/${khwaterChapter.id}`}
      className={`group relative block overflow-hidden rounded-2xl border transition-all duration-200
        ${featured
          ? 'col-span-1 sm:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 hover:shadow-lg hover:shadow-amber-500/5'
          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-md'
        }
      `}
    >
      {/* Geometric motif */}
      <svg
        className={`absolute top-0 right-0 w-24 h-24 pointer-events-none select-none transition-opacity duration-300
          ${featured
            ? 'text-amber-300/30 dark:text-amber-600/15 opacity-100'
            : 'text-gray-50 dark:text-gray-800 opacity-0 group-hover:opacity-100'
          }`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={MOTIFS[motifIndex]} />
      </svg>

      <div className={`relative p-5 ${featured ? 'p-6 sm:p-8' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`font-amiri font-bold tabular-nums transition-colors
            ${featured
              ? 'text-5xl sm:text-6xl text-amber-600/30 dark:text-amber-400/20'
              : 'text-3xl text-amber-600 dark:text-amber-400 group-hover:text-amber-500'
            }`}>
            {chapterNum}
          </span>
          <div className={`rounded-full flex items-center justify-center transition-colors
            ${featured
              ? 'w-12 h-12 bg-amber-100/80 dark:bg-amber-900/30'
              : 'w-9 h-9 bg-amber-50 dark:bg-amber-900/20 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40'
            }`}>
            <svg
              className={`transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1
                ${featured ? 'w-5 h-5' : 'w-4 h-4'} text-amber-500 dark:text-amber-400`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="mb-2">
          <h3 className={`font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors
            ${featured ? 'text-xl' : 'text-base'}`}>
            {translations.home.chapter(chapterNum)}
          </h3>
          {khwaterChapter.chapterTitle && (
            <p className={`text-gray-500 dark:text-gray-400 mt-1 line-clamp-2
              ${featured ? 'text-sm leading-relaxed' : 'text-xs'}`}>
              {khwaterChapter.chapterTitle}
            </p>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          {translations.home.itemCount(khwaterChapter.itemCount)}
        </p>
      </div>
    </Link>
  );
}
