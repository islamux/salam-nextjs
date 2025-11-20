import type { ChapterMetadata } from '@/lib/types/khwater';
import { translations } from '@/lib/translations';
import { ChapterCard } from './ChapterCard';
interface ChapterGridProps {
  khwaterChapters: ChapterMetadata[];
}

export function ChapterGrid({ khwaterChapters }: ChapterGridProps) {

  return (
    <section >
      <h1 className='text-2xl font-bold mb-8 text-center'>{translations.home.allChapters}</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {khwaterChapters.map((chapter) => (
          <ChapterCard key={chapter.id} khwaterChapter={chapter} />
        ))}
      </div>
    </section>
  );

}
