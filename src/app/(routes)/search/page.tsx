// Search page for finding chapters and content
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchChapters } from '@/lib/data/khwater-service';
import { KhwaterItem } from '@/lib/types/khwater';
import ContentRenderer from '@/components/khwater/ContentRenderer';
import { useTranslation } from '@/hooks/useTranslation';

interface SearchResult {
  chapterId: string;
  items: KhwaterItem[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { search, chapter } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setIsLoading(true);
      setHasSearched(true);
      try {
        setResults(await searchChapters(query));
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="arabic-title text-3xl font-bold mb-8 text-center">{search.title}</h1>

      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <label htmlFor="search-input" className="sr-only">{search.label}</label>
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={search.placeholder}
            aria-label={search.ariaLabel}
            aria-describedby="search-help"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div id="search-help" className="sr-only">{search.help}</div>
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{search.loading}</p>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{search.noResults}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-8">
          <p className="text-center text-gray-600 dark:text-gray-400">{search.resultsFound(results.length)}</p>
          {results.map((result) => (
            <div key={result.chapterId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{chapter.title(result.chapterId)}</h2>
                <Link href={`/khwater/${result.chapterId}`} className="text-blue-600 dark:text-blue-400 hover:underline">{search.viewChapter}</Link>
              </div>
              <div className="space-y-4">
                {result.items.map((item, index) => (
                  <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <ContentRenderer item={item} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
