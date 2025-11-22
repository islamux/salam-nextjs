# 🚀 Building "خواطر" From Scratch: A Guide for Junior Developers

Last updated: 2025-11-22

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

    # Build for SSR (Server-Side Rendering)
    NEXT_DISABLE_TURBOPACK=1 pnpm build
    NEXT_DISABLE_TURBOPACK=1 pnpm start

    # Build for static export (Hostinger, Netlify, etc.)
    pnpm build:static
    ```

    **PWA Features:** The app includes Progressive Web App capabilities:
    - Offline support with service worker
    - Installable on mobile and desktop
    - Manifest configured with icons and theme colors
    - Offline page at `/offline`

---

## Step 2: Structuring Your Project (The Blueprint)

A well-organized folder structure is key to a maintainable project. Create the following directories inside your `src` folder:

```
src/
├── app/
│   ├── (routes)/
│   │   ├── home/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── khwater/
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   └── search/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── offline/
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx (redirects to /home)
│
├── components/
│   ├── home/          # Home page components
│   ├── khwater/       # Chapter display components
│   ├── search/        # Search functionality components
│   ├── shared/        # Shared components (Header, Footer, etc.)
│   └── ui/            # Reusable UI components
│
├── hooks/
│   ├── useFontSize.ts
│   ├── useLocalStorage.ts
│   └── useTranslation.ts
│
├── lib/
│   ├── data/          # Data services
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
```

- **`app/(routes)`**: This is where our main pages will live. The `(routes)` folder is a Next.js convention for grouping pages without affecting the URL.
- **`app/offline`**: Special page shown when the app is offline (PWA feature).
- **`components`**: For our React components, organized by feature.
  - `home/`: Components specific to the home page (HeroSection, ChapterGrid).
  - `khwater/`: Components for displaying chapter content (ContentRenderer, ShareButton).
  - `search/`: Components for search functionality (SearchForm, SearchResults).
  - `shared/`: Components used across multiple pages (Header, Footer, ServiceWorkerRegistration).
  - `ui/`: Small, reusable UI components (Button, Card, Skeletons).
- **`hooks`**: For our custom React hooks.
  - `useFontSize.ts`: Hook for managing font size preferences.
  - `useLocalStorage.ts`: Hook for managing localStorage with TypeScript.
  - `useTranslation.ts`: Hook for accessing translations (can be used in client components).
- **`lib`**: For our application's core logic.
  - `data/`: For data fetching and services (khwater-service.ts).
  - `types/`: For our TypeScript types and interfaces (khwater.ts).
  - `utils/`: For utility functions (search-index.ts, etc.).

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

## Step 3.5: Centralized Translations (The Voice)

The app uses a centralized translation system to maintain consistency and follow the DRY principle.

**`src/lib/translations.ts`**

```typescript
// Centralized translation management for the entire application
export const translations = {
  app: {
    name: 'خواطر',
    nameWithSubtitle: 'خواطر - Islamic Spiritual Texts',
    description: 'Islamic spiritual texts and chapters',
    author: 'Khwater Project',
  },
  nav: {
    home: 'الرئيسية',
    search: 'بحث',
  },
  chapter: {
    title: (id: string | number) => `الفصل ${id}`,
    previous: 'الفصل السابق',
    next: 'الفصل التالي',
  },
  search: {
    title: 'بحث في المحتوى',
    placeholder: 'ابحث في النصوص والأيات...',
    noResults: 'لم يتم العثور على نتائج',
    resultsFound: (count: number) => `تم العثور على نتائج في ${count} فصل`,
  },
  // ... more translations
} as const;
```

**Key Features:**

- **Type-safe**: Using TypeScript's `as const` for autocomplete
- **Dynamic strings**: Functions like `title(id)` for parameterized text
- **Server & Client**: Works in both Server and Client components
- **Single source of truth**: All UI text in one place

**Usage:**

```typescript
// In Server Components
import { translations } from '@/lib/translations';
const title = translations.chapter.title(1); // "الفصل 1"

// In Client Components (use the hook)
import { useTranslation } from '@/hooks/useTranslation';
const { chapter } = useTranslation();
const title = chapter.title(1);
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
      return index.chapters.map((ch) => ch.id).sort((a, b) => Number(a) - Number(b));
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
    export const getChapterMetadata = (id: string) => ({
      id,
      title: `الفصل ${id}`,
      description: `محتوى الفصل ${id} من كتاب خواطر`,
    });

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
     * Search across all chapters using enhanced search index
     */
    import { buildSearchIndex, searchIndex } from '@/lib/utils/search-index';

    // Cache for search index
    let cachedSearchIndex: ReturnType<typeof buildSearchIndex> | null = null;

    export const searchChapters = async (query: string) => {
      const allKhwater = await loadAllKhwaterData();

      // Build index if not exists
      if (!cachedSearchIndex) {
        cachedSearchIndex = buildSearchIndex(allKhwater);
      }

      // Perform search
      const searchResults = searchIndex(cachedSearchIndex, query);

      // Group results by chapter
      const resultsMap = new Map<string, KhwaterItem[]>();

      searchResults.forEach((result) => {
        const chapterItems = allKhwater[result.chapterId];
        if (chapterItems && chapterItems[result.itemIndex]) {
          if (!resultsMap.has(result.chapterId)) {
            resultsMap.set(result.chapterId, []);
          }
          resultsMap.get(result.chapterId)?.push(chapterItems[result.itemIndex]);
        }
      });

      return Array.from(resultsMap.entries()).map(([chapterId, items]) => ({ chapterId, items }));
    };

    /**
     * Generate static params for Next.js SSG
     */
    export const generateStaticParams = async () => {
      const index = await loadIndex();
      return index.chapters.map((chapter) => ({
        id: chapter.id,
      }));
    };
    ```

---

## Step 5: Building the UI (The Body)

Now for the fun part! Let's build the UI, starting with the main page.

1.  **Create the Home Page:**
    Open `src/app/(routes)/home/page.tsx` and add the following code. This is a Server Component that fetches chapters and uses modular components for display.

    **`src/app/(routes)/home/page.tsx`**

    ```typescript
    // Home page - displays all 29 Khwater chapters

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
        <main className="container mx-auto px-4 py-12 max-w-7xl">
          <HeroSection chaptersCount={chapters.length} />
          <ChapterGrid khwaterChapters={chapters}/>
        </main>
      );
    }
    ```

    **Note:** The home page now uses composition with separate components:
    - `HeroSection`: Displays the book title, subtitle, and search button
    - `ChapterGrid`: Renders the grid of chapter cards with hover effects

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
    Add the following code to `src/app/(routes)/search/page.tsx`. This is now a **client component** that uses modular components.

    ```typescript
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
    ```

    **Key Changes:**
    - **Client Component:** Uses `'use client'` directive and React hooks
    - **Enhanced Search:** Uses optimized search index from `lib/utils/search-index.ts`
    - **Modular Components:** Separates concerns into SearchForm, SearchResults, NoResultMessage
    - **Loading State:** Shows spinner while searching
    - **Suspense Boundary:** Wraps SearchContent for better loading UX

2.  **Create the Loading UI:**
    Create a `loading.tsx` file in `src/app/(routes)/search` to show a loading skeleton while the search results are being fetched.

### Common pitfalls and fixes (Read this when stuck)

- **Port in use (3000)**: Change port with `pnpm dev -- -p 3001` or stop the other app.
- **Fonts not loading in dev**: Ensure `NEXT_DISABLE_TURBOPACK=1` is set before running `pnpm dev`.
- **TypeScript errors**: Run `pnpm lint` to see exact file/line; fix types or add explicit types.
- **Search shows no results**: Try a simpler Arabic term. The search uses an optimized index built from `public/khwater/*.json` files.
- **PWA install popup**: It's intentionally disabled; use the header Install button if present.
- **Build failures**: For static export, use `pnpm build:static`. For SSR, use `pnpm build` or `pnpm build:ssr`.
- **Client vs Server components**: If using hooks (useState, useEffect), add `'use client'` at the top of the file.
- **Search index not working**: The search index is built on first search and cached. Check `lib/utils/search-index.ts` for implementation.

---

## Next Steps

This guide provides a high-level overview to get you started. The current codebase already has many features implemented. Here's what to explore next:

### Already Implemented ✅

- **Header and Footer components** - Available in `src/components/shared/Header.tsx` and `Footer.tsx`
- **ContentRenderer component** - Handles different content types in `src/components/khwater/ContentRenderer.tsx`
- **Custom hooks** - `useFontSize`, `useLocalStorage`, and `useTranslation` in `src/hooks/`
- **PWA features** - Service worker registration, offline support, and install prompts
- **Search optimization** - Enhanced search index with pre-generated data
- **Modular components** - Separated by feature (home, khwater, search, shared, ui)

### Areas for Further Development 🚀

- **Testing** - Write unit tests for components and services using Vitest (configured in project)
- **Accessibility** - Enhance ARIA labels and keyboard navigation
- **Performance** - Analyze bundle size and optimize images
- **Features** - Add bookmarks, reading history, or notes functionality
- **Internationalization** - Extend the translations system to support multiple languages
- **Analytics** - Add privacy-friendly analytics to understand user behavior

### Learning Resources 📚

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **React Server Components**: [react.dev/reference/rsc/server-components](https://react.dev/reference/rsc/server-components)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)

Remember to break down each task into small, manageable steps. Good luck!
