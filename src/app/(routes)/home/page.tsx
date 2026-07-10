// Home page - displays all 34 Khwater chapters

import { getAllChapters } from '@/lib/data/khwater-service';
import { translations } from '@/lib/translations';
import { HeroSection } from '@/components/home/HeroSection';
import { ChapterGrid } from '@/components/home/ChapterGrid';

export const metadata = {
  title: translations.home.title,
  description: 'Islamic spiritual texts - All chapters',
};

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function HomePage() {
  const chapters = await getAllChapters();

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl bg-islamic-pattern min-h-[calc(100vh-64px)]">
      <HeroSection chaptersCount={chapters.length} />
      <ChapterGrid khwaterChapters={chapters}/>
    </main>
  );
}
