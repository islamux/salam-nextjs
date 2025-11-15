# 🚀 Building "خواطر" From Scratch: A Guide for Junior Developers

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
    export interface KhwaterItem {
      title?: string;
      subtitle?: string;
      text?: string;
      ayah?: string;
      footer?: string;
      order: Array<'title' | 'subtitle' | 'text' | 'ayah' | 'footer'>;
    }
    ```

---

## Step 4: Creating the Data Service (The Engine)

Now, let's create a service to fetch our `khwater` data. For this guide, we'll assume the data is in JSON files in the `public/khwater` directory.

1.  **Create a `khwater-service.ts` file:**
    Inside `src/lib/data`, create a new file `khwater-service.ts`.

    **`src/lib/data/khwater-service.ts`**
    ```typescript
    import { KhwaterItem } from '@/lib/types/khwater';

    // In-memory cache for all Khwater data
    let cachedKhwaterData: Record<string, KhwaterItem[]> | null = null;

    /**
     * Load chapter data from individual file
     */
    export const loadChapterData = async (id: string): Promise<KhwaterItem[]> => {
      // In a real app, you'd fetch this from a server or a local file.
      // For this guide, we'll use dynamic imports.
      const data = await import(`../../../public/khwater/${id}.json`);
      return data.default.items;
    };

    /**
     * Load all Khwater data into cache
     */
    const loadAllKhwaterData = async (): Promise<Record<string, KhwaterItem[]>> => {
      if (cachedKhwaterData) {
        return cachedKhwaterData;
      }

      // In a real app, you'd fetch an index file first.
      // For simplicity, we'll assume we have a list of chapter IDs.
      const chapterIds = ['0', '1', '2', /* ...and so on */];
      const allChapterData: Record<string, KhwaterItem[]> = {};

      for (const id of chapterIds) {
        allChapterData[id] = await loadChapterData(id);
      }
      cachedKhwaterData = allChapterData;
      return cachedKhwaterData;
    };

    /**
     * Search across all chapters
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
    ```

---

## Step 5: Building the UI (The Body)

Now for the fun part! Let's build the UI, starting with the main page.

1.  **Create the Home Page:**
    Open `src/app/(routes)/home/page.tsx` and add the following code. This will be a Server Component that fetches and displays a list of chapters.

    **`src/app/(routes)/home/page.tsx`**
    ```typescript
    import Link from 'next/link';
    import { getAllChapters } from '@/lib/data/khwater-service'; // You'll need to create this function

    export default async function HomePage() {
      // You'll need to implement getAllChapters to fetch metadata for all chapters.
      const chapters = await getAllChapters();

      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">خواطر</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map(chapter => (
              <Link href={`/khwater/${chapter.id}`} key={chapter.id}>
                <div className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <h2 className="text-xl font-semibold">{chapter.chapterTitle}</h2>
                  <p className="text-gray-500">{chapter.itemCount} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }
    ```
    **Note:** You will need to implement the `getAllChapters` function in your `khwater-service.ts` file.

2.  **Create the Chapter Page:**
    Open `src/app/(routes)/khwater/[id]/page.tsx` and add the following code. This will be a Server Component that displays the content of a single chapter.

    **`src/app/(routes)/khwater/[id]/page.tsx`**
    ```typescript
    import { getChapterData } from '@/lib/data/khwater-service';
    import { KhwaterItem } from '@/lib/types/khwater';
    // You'll need to create this component
    import ContentRenderer from '@/components/shared/ContentRenderer';

    interface ChapterPageProps {
      params: {
        id: string;
      };
    }

    export default async function ChapterPage({ params }: ChapterPageProps) {
      const items = await getChapterData(params.id);

      return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {items.map((item, index) => (
            <div key={index} className="mb-8">
              <ContentRenderer item={item} />
            </div>
          ))}
        </div>
      );
    }
    ```
    **Note:** You will need to create the `ContentRenderer` component, which will be responsible for rendering the different types of content (`title`, `text`, `ayah`, etc.).

---

## Step 6: Implementing Search (The Brains)

Now, let's implement the server-side search page.

1.  **Create the Search Page:**
    Open `src/app/(routes)/search/page.tsx` and add the code from the `SEARCH_IMPLEMENTATION_GUIDE.md`. This will create a Server Component that fetches search results based on a URL query parameter.

2.  **Create the Loading UI:**
    Create a `loading.tsx` file in `src/app/(routes)/search` to show a loading skeleton while the search results are being fetched.

---

## Next Steps

This guide provides a high-level overview to get you started. From here, you can continue to build out the application by:

-   **Creating the `Header` and `Footer` components** in `src/components/shared`.
-   **Implementing the `ContentRenderer` component** to handle different content types.
-   **Adding custom hooks** for theme switching (`useTheme`) and font size control (`useFontSize`).
-   **Writing tests** for your components and services using a library like Vitest or Jest.
-   **Styling your components** with Tailwind CSS to match the desired design.

Remember to break down each task into small, manageable steps. Good luck!
