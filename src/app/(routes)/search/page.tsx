// Search page for finding chapters and content

import { searchChapters } from '@/lib/data/khwater-service';
// import { useTranslation } from '@/hooks/useTranslation'; not SSR
import { translations } from '@/lib/translations';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { NoResultMessage } from '@/components/search/NoResultMessage';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams.q as string) || '';
  const results = query ? await searchChapters(query) : [];
  //  useTranslation is clinet side rendering not server side rendering.
  // const { search, chapter } = useTranslation(); // NOT SSR
  const { search } = translations; // SSR 

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="arabic-title text-3xl font-bold mb-8 text-center">{search.title}</h1>

      <SearchForm query={query} />
      {query && results.length === 0 ? (<NoResultMessage />) : results.length > 0 ? (<SearchResults results={results} />) : null}
    </div>
  );
}
