
# Khwater Chapter Page Refactoring Plan

This plan outlines the steps to refactor the `KhwaterChapterPage` component in `src/app/(routes)/khwater/[id]/page.tsx` into smaller, more manageable components.

## 1. Create New Directory

Create a new directory to house the components for the Khwater chapter page:

```bash
mkdir -p src/components/khwater/page
```

## 2. Create JsonLdScript Component

This component will encapsulate the JSON-LD script tag.

**File:** `src/components/khwater/page/JsonLdScript.tsx`

```tsx
import { translations } from '@/lib/translations';
import { KhwaterItem } from '@/lib/types/khwater';

interface JsonLdScriptProps {
  chapterId: string;
  items: KhwaterItem[];
}

export function JsonLdScript({ chapterId, items }: JsonLdScriptProps) {
  const currentId = Number(chapterId);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: translations.app.nameWithSubtitle,
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'ar',
    author: { '@type': 'Organization', name: translations.app.author },
    hasPart: {
      '@type': 'Book',
      position: currentId,
      name: translations.chapter.title(chapterId),
      url: `https://elm-app.vercel.app/khwater/${chapterId}`,
      text: items.slice(0, 3).map((item) => item.text).filter(Boolean).join(' '),
    },
    position: currentId,
    numberOfPages: 29,
    url: `https://elm-app.vercel.app/khwater/${chapterId}`,
    mainEntityOfPage: `https://elm-app.vercel.app/khwater/${chapterId}`,
    keywords: 'كتاب خواطر  ',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

## 3. Create ChapterProgress Component

This component will display the progress bar and the share button.

**File:** `src/components/khwater/page/ChapterProgress.tsx`

```tsx
import { translations } from '@/lib/translations';
import ShareButton from '@/components/khwater/ShareButton';

interface ChapterProgressProps {
  chapterId: string;
}

export function ChapterProgress({ chapterId }: ChapterProgressProps) {
  const currentId = Number(chapterId);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{translations.chapter.pageTitle(currentId)}</span>
        <ShareButton chapterId={chapterId} chapterTitle={translations.chapter.title(chapterId)} />
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentId / 29) * 100}%` }} />
      </div>
    </div>
  );
}
```

## 4. Create ChapterHeader Component

This component will display the main header of the chapter.

**File:** `src/components/khwater/page/ChapterHeader.tsx`

```tsx
import { translations } from '@/lib/translations';

interface ChapterHeaderProps {
  chapterId: string;
}

export function ChapterHeader({ chapterId }: ChapterHeaderProps) {
  return (
    <header className="text-center mb-12">
      <h1 className="arabic-title text-4xl font-bold mb-4">{translations.chapter.pageHeader(Number(chapterId))}</h1>
    </header>
  );
}
```

## 5. Create ChapterArticle Component

This component will render the content of the chapter.

**File:** `src/components/khwater/page/ChapterArticle.tsx`

```tsx
import dynamic from 'next/dynamic';
import { KhwaterItem } from '@/lib/types/khwater';
import { SkeletonContentItem } from '@/components/shared/Skeletons';

const ContentRenderer = dynamic(() => import('@/components/khwater/ContentRenderer'), {
  loading: () => <SkeletonContentItem />,
  ssr: true,
});

interface ChapterArticleProps {
  items: KhwaterItem[];
}

export function ChapterArticle({ items }: ChapterArticleProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <ContentRenderer item={item} />
          </div>
        ))}
      </div>
    </article>
  );
}
```

## 6. Create ChapterNavigation Component

This component will display the previous and next chapter navigation links.

**File:** `src/components/khwater/page/ChapterNavigation.tsx`

```tsx
import Link from 'next/link';
import { translations } from '@/lib/translations';

interface ChapterNavigationProps {
  currentId: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function ChapterNavigation({ currentId, hasPrevious, hasNext }: ChapterNavigationProps) {
  return (
    <nav className="flex justify-between items-center mt-12" aria-label={translations.chapter.ariaNavigate}>
      <div>
        {hasPrevious && (
          <Link href={`/khwater/${currentId - 1}`} className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label={translations.chapter.ariaPrevious(currentId - 1)}>
            <svg className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {translations.chapter.previous}
          </Link>
        )}
      </div>
      <div>
        {hasNext && (
          <Link href={`/khwater/${currentId + 1}`} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors" aria-label={translations.chapter.ariaNext(currentId + 1)}>
            {translations.chapter.next}
            <svg className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
```

## 7. Update KhwaterChapterPage

Finally, update the `KhwaterChapterPage` to use these new components.

**File:** `src/app/(routes)/khwater/[id]/page.tsx`

```tsx
// Dynamic Khwater chapter page
import { notFound } from 'next/navigation';
import { getChapterData, getAllChapterIds } from '@/lib/data/khwater-service';
import { Metadata } from 'next';
import { translations } from '@/lib/translations';
import { JsonLdScript } from '@/components/khwater/page/JsonLdScript';
import { ChapterProgress } from '@/components/khwater/page/ChapterProgress';
import { ChapterHeader } from '@/components/khwater/page/ChapterHeader';
import { ChapterArticle } from '@/components/khwater/page/ChapterArticle';
import { ChapterNavigation } from '@/components/khwater/page/ChapterNavigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const chapters = await getAllChapterIds();
  return chapters.map((id) => ({ id }));
}

// revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const chapter = await getChapterData(id);
  const description =
    chapter.slice(0, 3).map((item) => item.text).filter(Boolean).join(' • ') ||
    translations.chapter.contentOfBook(id);

  return {
    title: translations.chapter.contentTitle(id),
    description: translations.chapter.contentDescription(id),
    keywords: translations.chapter.keywords(id),
    openGraph: {
      title: translations.chapter.contentTitle(id),
      description: translations.share.readChapter(id),
      url: `https://elm-app.vercel.app/khwater/${id}`,
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
  const hasPrevious = currentId > 1;
  const hasNext = currentId < 29;

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <JsonLdScript chapterId={id} items={items} />
      <ChapterProgress chapterId={id} />
      <ChapterHeader chapterId={id} />
      <ChapterArticle items={items} />
      <ChapterNavigation currentId={currentId} hasPrevious={hasPrevious} hasNext={hasNext} />
    </main>
  );
}
```
