// Dynamic Khwater chapter page
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapterData, getAllChapterIds } from '@/lib/data/khwater-service';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const ContentRenderer = dynamic(() => import('@/components/khwater/ContentRenderer'), {
  loading: () => <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded" />,
  ssr: true,
});

const ShareButton = dynamic(() => import('@/components/khwater/ShareButton'), {
  loading: () => <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />,
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const chapters = await getAllChapterIds();
  return chapters.map((id) => ({ id }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const chapter = await getChapterData(id);
  const description =
    chapter.slice(0, 3).map((item) => item.text).filter(Boolean).join(' • ') ||
    `محتوى الفصل ${id} من كتاب خواطر`;

  return {
    title: `الفصل ${id} - كتاب خواطر`,
    description: `اقرأ الفصل ${id} من كتاب خواطر. ${description}`,
    keywords: `كتاب خواطر, فصل ${id}, نصوص إسلامية`,
    openGraph: {
      title: `الفصل ${id} - كتاب خواطر`,
      description: `اقرأ الفصل ${id} من كتاب خواطر`,
      url: `https://elm-app.vercel.app/khwater/${id}`,
      siteName: 'خواطر - Islamic Spiritual Texts',
      locale: 'ar_SA',
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: ['Khwater Project'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `الفصل ${id} - كتاب خواطر`,
      description: `اقرأ الفصل ${id} من كتاب خواطر`,
      creator: '@khwater_project',
    },
    alternates: { canonical: `/khwater/${id}` },
  };
}

export default async function KhwaterChapterPage({ params }: PageProps) {
  const { id } = await params;
  const items = await getChapterData(id).catch(() => notFound());

  if (!items?.length) notFound();

  const currentId = Number(id);
  const hasPrevious = currentId > 1;
  const hasNext = currentId < 29;

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: 'خواطر - Islamic Spiritual Texts',
            bookFormat: 'https://schema.org/EBook',
            inLanguage: 'ar',
            author: { '@type': 'Organization', name: 'Khwater Project' },
            hasPart: {
              '@type': 'Book',
              position: currentId,
              name: `الفصل ${id}`,
              url: `https://elm-app.vercel.app/khwater/${id}`,
              text: items.slice(0, 3).map((item) => item.text).filter(Boolean).join(' '),
            },
            position: currentId,
            numberOfPages: 29,
            url: `https://elm-app.vercel.app/khwater/${id}`,
            mainEntityOfPage: `https://elm-app.vercel.app/khwater/${id}`,
            keywords: 'كتاب خواطر, نصوص إسلامية',
          }),
        }}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">الفصل {id} من 29</span>
          <ShareButton chapterId={id} chapterTitle={`الفصل ${id}`} />
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentId / 29) * 100}%` }} />
        </div>
      </div>

      <header className="text-center mb-12">
        <h1 className="arabic-title text-4xl font-bold mb-4">الفصل {id}</h1>
      </header>

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <ContentRenderer item={item} />
            </div>
          ))}
        </div>
      </article>

      <nav className="flex justify-between items-center mt-12" aria-label="تنقل بين الفصول">
        <div>
          {hasPrevious && (
            <Link href={`/khwater/${currentId - 1}`} className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label={`انتقل إلى الفصل ${currentId - 1}`}>
              <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              الفصل السابق
            </Link>
          )}
        </div>
        <div>
          {hasNext && (
            <Link href={`/khwater/${currentId + 1}`} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors" aria-label={`انتقل إلى الفصل ${currentId + 1}`}>
              الفصل التالي
              <svg className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
