import { SearchResult } from '@/lib/types/khwater';
import { translations } from '@/lib/translations';
import { SearchResultCard } from './SearchResultCard';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {

  const { search } = translations;
  return (
    <div className="space-y-8">
      <p className="text-center text-gray-600 dark:text-gray-400">{search.resultsFound(results.length)}</p>
      {results.map((result) => (
        <SearchResultCard key={result.chapterId} result={result} />
      ))}
    </div>
  );
}
