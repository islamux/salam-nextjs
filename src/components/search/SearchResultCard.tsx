import Link from 'next/link';
import ContentRenderer from '../khwater/ContentRenderer';
import { SearchResult } from '@/lib/types/khwater';
import { translations } from '@/lib/translations';

interface SearchResultProps {
  result: SearchResult;
}
export function SearchResultCard({ result }: SearchResultProps) {

  const { search, chapter } = translations;

  return (
    <div key={result.chapterId} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{chapter.title(result.chapterId)}</h2>
        <Link href={`/khwater/${result.chapterId}`} className="text-amber-600 dark:text-amber-400 hover:underline text-sm">{search.viewChapter}</Link>
      </div>
      <div className="space-y-6">
        {result.items.map((item, index) => (
          <div key={index} className="pb-6 border-b border-gray-100 dark:border-gray-800 last:border-b-0 last:pb-0">
            <ContentRenderer item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
