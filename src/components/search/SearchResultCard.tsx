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

  );
}
