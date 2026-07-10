'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchChapters } from '@/lib/data/khwater-service';
import { SearchResult } from '@/lib/types/khwater';
import { translations } from '@/lib/translations';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { NoResultMessage } from '@/components/search/NoResultMessage';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const { search } = translations;

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        setIsSearching(true);
        setSearchError(false);
        try {
          const searchResults = await searchChapters(query);
          setResults(searchResults);
        } catch {
          setSearchError(true);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setSearchError(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="font-amiri text-3xl font-bold mb-8 text-center">{search.title}</h1>

      <SearchForm query={query} />

      {isSearching ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="inline-block h-8 w-8 rounded-full border-2 border-amber-500/30 border-t-amber-600 animate-spin" aria-label="جاري البحث" />
          <span className="text-sm text-gray-500 dark:text-gray-400">{search.loading}</span>
        </div>
      ) : searchError ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100/60 dark:bg-amber-900/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.</p>
          <button
            onClick={() => {
              setSearchError(false);
              setIsSearching(true);
              searchChapters(query).then(setResults).catch(() => setSearchError(true)).finally(() => setIsSearching(false));
            }}
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : query && results.length === 0 ? (
        <NoResultMessage />
      ) : results.length > 0 ? (
        <SearchResults results={results} />
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{search.help}</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-8" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
