import Link from 'next/link';
import ContentRenderer from '../khwater/ContentRenderer';
import { SearchResult } from '@/lib/types/khwater';
import { translations } from '@/lib/translations';

interface SearchResultProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultProps) {
  const { search, chapter } = translations;
  const matchCount = result.items.length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="font-amiri text-xl font-bold text-amber-600 dark:text-amber-400">
            {result.chapterId}
          </span>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {chapter.title(result.chapterId)}
          </h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
            {search.resultsFound(matchCount)}
          </span>
        </div>

        <Link
          href={`/khwater/${result.chapterId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
        >
          <span>{search.viewChapter}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Content previews */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
        {result.items.map((item, index) => (
          <div key={index} className="px-6 py-5 hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors">
            <ContentRenderer item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
