'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchChapters } from '@/lib/data/khwater-service';
import { translations } from '@/lib/translations';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { NoResultMessage } from '@/components/search/NoResultMessage';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { search } = translations;

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        setIsSearching(true);
        try {
          const searchResults = await searchChapters(query);
          setResults(searchResults);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="arabic-title text-3xl font-bold mb-8 text-center">{search.title}</h1>

      <SearchForm query={query} />
      
      {isSearching ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <>
          {query && results.length === 0 ? (
            <NoResultMessage />
          ) : results.length > 0 ? (
            <SearchResults results={results} />
          ) : null}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
