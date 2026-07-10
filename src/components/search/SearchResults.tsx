import { SearchResult } from '@/lib/types/khwater';
import { translations } from '@/lib/translations';
import { SearchResultCard } from './SearchResultCard';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const { search } = translations;

  const totalMatches = results.reduce((sum, r) => sum + r.items.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>{search.resultsFound(results.length)}</span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>{totalMatches} نتيجة</span>
      </div>

      {results.map((result) => (
        <SearchResultCard key={result.chapterId} result={result} />
      ))}
    </div>
  );
}
