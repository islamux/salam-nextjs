# 🚀 Building "خواطر" From Scratch: A Guide for Junior Developers

Last updated: 2025-11-16

Welcome! This guide will walk you through building the "خواطر" Islamic spiritual texts app from scratch, following modern React and Next.js best practices. We'll focus on creating a clean, maintainable, and performant application.

The existing `CODE_ARCHITECTURE_REFACTORING_PLAN.md` is a theoretical document for refactoring an old version of the app. This guide is a more practical, step-by-step approach to building the final product.

## 🎯 Our Goal

We will build a Next.js application that:
- Displays a list of chapters (`khwater`).
- Allows users to read the content of each chapter.
- Provides a search functionality to find content across all chapters.
- Is built with TypeScript for type safety.
- Follows a clean and organized code architecture.

---

## Step 0: Prerequisites (Read this first)

- Install: Node.js 20+, pnpm 9+, Git
- Verify versions:
  ```bash
  node -v && pnpm -v && git --version
  ```
- Clone the repo and install deps:
  ```bash
  git clone <your-fork-or-repo-url>
  cd salam-nextjs
  pnpm install
  ```
- Important: Next.js 16.0.1 has Turbopack font issues. Always run with NEXT_DISABLE_TURBOPACK=1.

## Step 1: Project Setup (The Foundation)

First, let's create a new Next.js project and install the necessary dependencies.

1.  **Create a new Next.js app:**
    Open your terminal and run the following command. When prompted, choose the options for TypeScript, ESLint, and Tailwind CSS.

    ```bash
    pnpm create next-app@latest salam-nextjs
    ```

2.  **Navigate into your new project:**
    ```bash
    cd salam-nextjs
    ```

3.  **Install additional dependencies:**
    We don't need any extra dependencies for now. We'll stick to what Next.js provides.

    Quickstart commands (run from project root):
    ```bash
    # Dev server (avoid Turbopack font issue)
    NEXT_DISABLE_TURBOPACK=1 pnpm dev

    # Lint and format
    pnpm lint
    pnpm prettier --write .

    # Unit tests (watch / once / coverage)
    pnpm test
    pnpm test:run
    pnpm test:coverage

    # Build and run production locally
    NEXT_DISABLE_TURBOPACK=1 pnpm build
    NEXT_DISABLE_TURBOPACK=1 pnpm start
    ```

---

## Step 2: Structuring Your Project (The Blueprint)

A well-organized folder structure is key to a maintainable project. Create the following directories inside your `src` folder:

```
src/
├── app/
│   ├── (routes)/
│   │   ├── home/
│   │   ├── khwater/
│   │   │   └── [id]/
│   │   └── search/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── shared/
│   └── ui/
│
├── hooks/
│
├── lib/
│   ├── data/
│   ├── types/
│   └── utils/
```

-   **`app/(routes)`**: This is where our main pages will live. The `(routes)` folder is a Next.js convention for grouping pages without affecting the URL.
-   **`components`**: For our React components.
    -   `shared/`: Components used across multiple pages (e.g., `Header`, `Footer`).
    -   `ui/`: Small, reusable UI components (e.g., `Button`, `Card`).
-   **`hooks`**: For our custom React hooks (e.g., `useTheme`).
-   **`lib`**: For our application's core logic.
    -   `data/`: For data fetching and services.
    -   `types/`: For our TypeScript types and interfaces.
    -   `utils/`: For utility functions.

---

## Step 3: Defining Our Data (The Language)

Before we can display anything, we need to define the shape of our data.

1.  **Create a `khwater.ts` file:**
    Inside `src/lib/types`, create a new file `khwater.ts`.

    **`src/lib/types/khwater.ts`**
    ```typescript
    // TypeScript types for Khwater data structure
    // Based on Flutter to Next.js migration plan
    
    export type ContentType = 'title' | 'subtitle' | 'text' | 'ayah' | 'footer';
    
    export interface DetailedOrderItem {
      type: ContentType;
      index: number;
    }
    
    export interface KhwaterItem {
      title?: string;
      subtitle?: string;
      text?: string;
      ayah?: string;
      footer?: string;
      order: ContentType[];
      detailedOrder?: DetailedOrderItem[];
    }
    
    export interface KhwaterData {
      version: string;
      generated: string;
      totalLists: number;
      lists: Record<string, KhwaterItem[]>;
    }
    
    export interface KhwaterChapter {
      id: string;
      title: string;
      description?: string;
      items: KhwaterItem[];
    }
    
    export interface FontSizeSettings {
      base: number;
      title: number;
      subtitle: number;
      text: number;
      ayah: number;
    }
    ```

---

## Step 4: Creating the Data Service (The Engine)

Now, let's create a service to fetch our `khwater` data. For this guide, we'll assume the data is in JSON files in the `public/khwater` directory.

1.  **Create a `khwater-service.ts` file:**
    Inside `src/lib/data`, create a new file `khwater-service.ts`.

    **`src/lib/data/khwater-service.ts`**
    ```typescript
    // Data service layer for Khwater data
    import { KhwaterItem } from '@/lib/types/khwater';
    
    // Type for chapter metadata
    interface ChapterMetadata {
      id: string;
      items: number;
      sizeKB: number;
    }
    
    // Type for chapter response
    interface ChapterResponse {
      items: KhwaterItem[];
      metadata: {
        id: string;
        version: string;
        generated: string;
        totalItems: number;
      };
    }
    
    // Type for index response
    interface KhwaterIndex {
      totalChapters: number;
      version: string;
      generated: string;
      chapters: ChapterMetadata[];
      summary: {
        totalChapters: number;
        totalItems: number;
        totalSizeKB: string;
        averageSizeKB: string;
      };
    }
    
    // In-memory cache for all Khwater data
    let cachedKhwaterData: Record<string, KhwaterItem[]> | null = null;
    
    /**
     * Load chapter metadata from index
     */
    export const loadIndex = async (): Promise<KhwaterIndex> => {
      // For SSR/SSG, use dynamic import
      if (typeof window === 'undefined') {
        const data = await import('../../../public/khwater/index.json');
        return data.default as KhwaterIndex;
      }
      // For client-side, use fetch
      const response = await fetch('/khwater/index.json');
      if (!response.ok) throw new Error('Failed to fetch chapter index');
      return response.json();
    };
    
    /**
     * Load chapter data from individual file
     */
    export const loadChapterData = async (id: string): Promise<KhwaterItem[]> => {
      // For SSR/SSG, use dynamic import
      if (typeof window === 'undefined') {
        const data = await import(`../../../public/khwater/${id}.json`);
        return (data.default as ChapterResponse).items;
      }
      // For client-side, use fetch
      const response = await fetch(`/khwater/${id}.json`);
      if (!response.ok) throw new Error(`Failed to fetch chapter ${id}`);
      const data: ChapterResponse = await response.json();
      return data.items;
    };
    
    /**
     * Load all Khwater data into cache
     */
    const loadAllKhwaterData = async (): Promise<Record<string, KhwaterItem[]>> => {
      if (cachedKhwaterData) {
        return cachedKhwaterData;
      }
    
      const index = await loadIndex();
      const allChapterData: Record<string, KhwaterItem[]> = {};
    
      // Load all chapters sequentially
      for (const chapter of index.chapters) {
        try {
          allChapterData[chapter.id] = await loadChapterData(chapter.id);
        } catch (error) {
          console.error(`Failed to load chapter ${chapter.id}:`, error);
          allChapterData[chapter.id] = [];
        }
      }
      cachedKhwaterData = allChapterData;
      return cachedKhwaterData;
    };
    
    /**
     * Get all chapter IDs from index
     */
    export const getAllChapterIds = async (): Promise<string[]> => {
      const index = await loadIndex();
      return index.chapters.map(ch => ch.id).sort((a, b) => Number(a) - Number(b));
    };
    
    /**
     * Get chapter data by ID
     */
    export const getChapterData = async (id: string): Promise<KhwaterItem[]> => {
      try {
        return await loadChapterData(id);
      } catch (error) {
        throw new Error(`Chapter ${id} not found`);
      }
    };
    
    /**
     * Get chapter metadata
     */
    export const getChapterMetadata = (id: string) => ({ id, title: `الفصل ${id}`, description: `محتوى الفصل ${id} من كتاب خواطر` });
    
    /**
     * Get all chapters with metadata
     */
    export const getAllChapters = async () => {
      const index = await loadIndex();
      const chapterDataPromises = index.chapters.map(async (chapter) => {
        try {
          const items = await loadChapterData(chapter.id);
          return {
            id: chapter.id,
            title: `الفصل ${chapter.id}`,
            chapterTitle: items[0]?.title?.split('\n')[0] || `الفصل ${chapter.id}`,
            description: `محتوى الفصل ${chapter.id}`,
            itemCount: items.length,
          };
        } catch (error) {
          console.error(`Failed to load chapter ${chapter.id}:`, error);
          return {
            id: chapter.id,
            title: `الفصل ${chapter.id}`,
            chapterTitle: `الفصل ${chapter.id}`,
            description: `محتوى الفصل ${chapter.id}`,
            itemCount: 0,
          };
        }
      });
    
      return (await Promise.all(chapterDataPromises)).sort((a, b) => Number(a.id) - Number(b.id));
    };
    
    /**
     * Search across all chapters using in-memory cache and simple string matching
     */
    export const searchChapters = async (query: string) => {
      const allKhwater = await loadAllKhwaterData();
      const lowerCaseQuery = query.toLowerCase();
      const resultsMap = new Map<string, KhwaterItem[]>();
    
      for (const chapterId in allKhwater) {
        const items = allKhwater[chapterId];
        const matchingItems: KhwaterItem[] = [];
    
        for (const item of items) {
          const textContent = `${item.title || ''} ${item.subtitle || ''} ${item.text || ''} ${item.ayah || ''}`.toLowerCase();
          if (textContent.includes(lowerCaseQuery)) {
            matchingItems.push(item);
          }
        }
    
        if (matchingItems.length > 0) {
          resultsMap.set(chapterId, matchingItems);
        }
      }
    
      return Array.from(resultsMap.entries())
        .map(([chapterId, items]) => ({ chapterId, items }))
        .sort((a, b) => Number(a.chapterId) - Number(b.chapterId));
    };
    
    /**
     * Generate static params for Next.js SSG
     */
    export const generateStaticParams = async () => {
      const index = await loadIndex();
      return index.chapters.map(chapter => ({
        id: chapter.id
      }));
    };
    ```

---

## Step 5: Building the UI (The Body)

Now for the fun part! Let's build the UI, starting with the main page.

1.  **Create the Home Page:**
    Open `src/app/(routes)/home/page.tsx` and add the following code. This will be a Server Component that fetches and displays a list of chapters.

    **`src/app/(routes)/home/page.tsx`**
    ```typescript
    // Home page - displays all 29 Khwater chapters
    import Link from 'next/link';
    import { getAllChapters } from '@/lib/data/khwater-service';
    import { translations } from '@/lib/translations';
    
    export const metadata = {
      title: translations.home.title,
      description: 'Islamic spiritual texts - All chapters',
    };
    
    // Enable ISR - revalidate every hour (3600 seconds)
    export const revalidate = 3600;
    
    export default async function HomePage() {
      const chapters = await getAllChapters();
    
      return (
        <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
        <div className="mb-8">
        <h1 className="arabic-title text-5xl md:text-6xl font-bold mb-6">
        {translations.home.bookName}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
        {translations.home.subtitle}
        </p>
        <p className="text-gray-500 dark:text-gray-500">
        {translations.home.introductionCount(chapters.length)}
        </p>
        </div>
    
        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
        <Link
        href="/search"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg
        className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
        </svg>
        {translations.home.searchInContent}
        </Link>
        </div>
        </section>
    
        {/* Chapters Grid */}
        <section>
        <h2 className="text-2xl font-bold mb-8 text-center">{translations.home.allChapters}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {chapters.map((chapter, index) => (
          <Link
          key={chapter.id}
          href={`/khwater/${chapter.id}`}
          className="group block p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
        >
          <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {chapter.id}
          </span>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg
          className="w-5 h-5 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
          />
          </svg>
          </div>
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {translations.home.chapter(Number(chapter.id))}
            </h3>
            {chapter.chapterTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {chapter.chapterTitle}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {translations.home.itemCount(chapter.itemCount)}
          </p>
          </Link>
        ))}
        </div>
        </section>
        </main>
      );
    }
    ```

2.  **Create the Chapter Page:**
    Open `src/app/(routes)/khwater/[id]/page.tsx` and add the following code. This will be a Server Component that displays the content of a single chapter.

    **`src/app/(routes)/khwater/[id]/page.tsx`**
    ```typescript
    // Dynamic Khwater chapter page
    import Link from 'next/link';
    import { notFound } from 'next/navigation';
    import { getChapterData, getAllChapterIds } from '@/lib/data/khwater-service';
    import dynamic from 'next/dynamic';
    import { Metadata } from 'next';
    import { translations } from '@/lib/translations';
    import {
      SkeletonContentItem,
      SkeletonButton,
    } from '@/components/shared/Skeletons';
    
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
              <span className="text-sm text-gray-600 dark:text-gray-400">{translations.chapter.pageTitle(Number(id))}</span>
              <ShareButton chapterId={id} chapterTitle={translations.chapter.title(id)} />
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentId / 29) * 100}%` }} />
            </div>
          </div>
    
          <header className="text-center mb-12">
            <h1 className="arabic-title text-4xl font-bold mb-4">{translations.chapter.pageHeader(Number(id))}</h1>
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
        </main>
      );
    }
    ```
    Note: Use `@/components/khwater/ContentRenderer`, which renders titles, subtitles, texts, ayahs, and footers based on `item.order` or `item.detailedOrder`.

---

## Step 6: Implementing Search (The Brains)

Now, let's implement the server-side search page.

1.  **Create the Search Page:**
    Add the following code to `src/app/(routes)/search/page.tsx`.

    ```typescript
    // Search page for finding chapters and content
    import Link from 'next/link';
    import { searchChapters } from '@/lib/data/khwater-service';
    import { KhwaterItem } from '@/lib/types/khwater';
    import ContentRenderer from '@/components/khwater/ContentRenderer';
    import { useTranslation } from '@/hooks/useTranslation';
    
    interface SearchPageProps {
      searchParams?: {
        q?: string;
      };
    }
    
    export default async function SearchPage({ searchParams }: SearchPageProps) {
      const query = searchParams?.q || '';
      const results = query ? await searchChapters(query) : [];
      const { search, chapter } = useTranslation();
    
      return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="arabic-title text-3xl font-bold mb-8 text-center">{search.title}</h1>
    
          <div className="mb-8">
            <form method="GET" action="/search" className="relative max-w-2xl mx-auto">
              <label htmlFor="search-input" className="sr-only">{search.label}</label>
              <input
                id="search-input"
                type="text"
                name="q"
                defaultValue={query}
                placeholder={search.placeholder}
                aria-label={search.ariaLabel}
                aria-describedby="search-help"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div id="search-help" className="sr-only">{search.help}</div>
              <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
    
          {query && results.length === 0 ? (
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
    ```

2.  **Create the Loading UI:**
    Create a `loading.tsx` file in `src/app/(routes)/search` to show a loading skeleton while the search results are being fetched.

### Common pitfalls and fixes (Read this when stuck)

- Port in use (3000): change port `pnpm dev -- -p 3001` or stop the other app.
- Fonts not loading in dev: ensure `NEXT_DISABLE_TURBOPACK=1` is set.
- TypeScript errors: run `pnpm lint` to see exact file/line; fix types or add explicit types.
- Search shows no results: try a simpler Arabic term; server-side search reads JSON under `public/khwater`.
- PWA install popup: it’s intentionally disabled; use the header Install button if present.

---

## Next Steps

This guide provides a high-level overview to get you started. From here, you can continue to build out the application by:

-   **Creating the `Header` and `Footer` components** in `src/components/shared`.
-   **Implementing the `ContentRenderer` component** to handle different content types.
-   **Adding custom hooks** for theme switching (`useTheme`) and font size control (`useFontSize`).
-   **Writing tests** for your components and services using a library like Vitest or Jest.
-   **Styling your components** with Tailwind CSS to match the desired design.

Remember to break down each task into small, manageable steps. Good luck!
