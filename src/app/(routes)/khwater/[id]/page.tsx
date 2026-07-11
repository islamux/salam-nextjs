import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapterData, getAllChapterIds } from '@/lib/data/khwater-service';
import dynamic from 'next/dynamic';
import { translations, SITE_URL } from '@/lib/translations';
import { SkeletonContentItem, SkeletonButton } from '@/components/shared/Skeletons';

const ContentRenderer = dynamic(() => import('@/components/khwater/ContentRenderer'), {
  loading: () => <SkeletonContentItem />,
  ssr: true,
});

const ShareButton = dynamic(() => import('@/components/khwater/ShareButton'), {
  loading: () => <SkeletonButton width={96} height={40} />,
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

  return {
    title: translations.chapter.contentTitle(id),
    description: translations.chapter.contentDescription(id),
    keywords: translations.chapter.keywords(id),
    openGraph: {
      title: translations.chapter.contentTitle(id),
      description: translations.share.readChapter(id),
      url: `${SITE_URL}/khwater/${id}`,
      siteName: translations.app.nameWithSubtitle,
      locale: 'ar_SA',
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: [translations.app.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.chapter.contentTitle(id),
      description: translations.share.readChapter(id),
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
  const allIds = await getAllChapterIds();
  const totalChapters = allIds.length;
  const lastNumericId = Math.max(...allIds.filter(i => !isNaN(Number(i))).map(Number));
  const hasPrevious = currentId > 0;
  const hasNext = currentId < lastNumericId;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: translations.app.nameWithSubtitle,
            bookFormat: 'https://schema.org/EBook',
            inLanguage: 'ar',
            author: { '@type': 'Organization', name: translations.app.author },
            hasPart: {
              '@type': 'Book',
              position: currentId,
              name: translations.chapter.title(id),
              url: `${SITE_URL}/khwater/${id}`,
              text: items.slice(0, 3).map((item) => item.text).filter(Boolean).join(' '),
            },
            position: currentId,
            numberOfPages: totalChapters,
            url: `${SITE_URL}/khwater/${id}`,
            mainEntityOfPage: `${SITE_URL}/khwater/${id}`,
            keywords: 'كتاب خواطر  ',
          }),
        }}
      />

      <main className="min-h-screen bg-book-page">

        {/* Vertical reading progress */}
        <div className="fixed right-0 top-0 bottom-0 w-1 bg-gray-100 dark:bg-gray-800/50 z-30">
          <div
            className="w-full bg-amber-500/60 rounded-full transition-all duration-500 ease-out-quart"
            style={{ height: `${((currentId + 1) / totalChapters) * 100}%` }}
          />
        </div>

        <div className="max-w-4xl lg:max-w-5xl xl:max-w-prose mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-16">

          {/* Chapter header */}
          <header className="text-center mb-16">
            <span className="text-6xl font-amiri font-bold text-amber-600/20 dark:text-amber-400/10 select-none leading-none block mb-4">
              {currentId}
            </span>
            <h1 className="font-amiri text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {translations.chapter.pageHeader(currentId)}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400 dark:text-gray-500">
              <span>{translations.chapter.pageTitle(currentId)}</span>
              <span className="text-amber-300 dark:text-amber-600" aria-hidden="true">•</span>
              <ShareButton chapterId={id} chapterTitle={translations.chapter.title(id)} />
            </div>
          </header>

          {/* Content */}
          <article className="prose-reader">
            {items.map((item, index) => (
              <div key={index}>
                <ContentRenderer item={item} />
                {index < items.length - 1 && (
                  <div className="flex items-center justify-center my-10" aria-hidden="true">
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                    <span className="mx-4 text-amber-400/40 dark:text-amber-500/30 text-lg">✦</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </article>

          {/* Page-flip navigation */}
          <nav className="mt-20 flex justify-between items-stretch gap-4" aria-label={translations.chapter.ariaNavigate}>
            <div className="flex-1">
              {hasPrevious && (
                <Link
                  href={`/khwater/${currentId - 1}`}
                  className="group flex items-center justify-center gap-2 h-full px-4 py-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all duration-200"
                  aria-label={translations.chapter.ariaPrevious(currentId - 1)}
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {translations.chapter.previous}
                  </span>
                </Link>
              )}
            </div>

            <Link
              href="/home"
              className="flex items-center justify-center px-4 py-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 group"
              aria-label="العودة للفهرس"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            <div className="flex-1">
              {hasNext && (
                <Link
                  href={`/khwater/${currentId + 1}`}
                  className="group flex items-center justify-center gap-2 h-full px-4 py-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200"
                  aria-label={translations.chapter.ariaNext(currentId + 1)}
                >
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors">
                    {translations.chapter.next}
                  </span>
                  <svg className="w-5 h-5 text-amber-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </main>
    </>
  );
}
