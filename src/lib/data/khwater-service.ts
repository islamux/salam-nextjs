// Data service layer for Khwater data
// Supports SSG, SSR, and client-side fetching

import { KhwaterData, KhwaterItem } from '@/lib/types/khwater';
import { buildSearchIndex, searchIndex } from '@/lib/utils/search-index';

/**
 * Load Khwater data from JSON file
 */
export const loadKhwaterData = async (): Promise<KhwaterData> => {
  try {
    // During build/SSG, import directly. During runtime, fetch from public
    if (typeof window === 'undefined') {
      // Server-side: import directly
      const data = await import('../../../public/khwater-data.json');
      return data.default as KhwaterData;
    } else {
      // Client-side: fetch from public
      const response = await fetch('/khwater-data.json');
      if (!response.ok) {
        throw new Error('Failed to fetch Khwater data');
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to load Khwater data:', error);
    throw new Error('Failed to load Khwater data');
  }
};

/**
 * Get all chapter IDs (cached with revalidation)
 */
export const getAllChapterIds = async (): Promise<string[]> => {
  const data = await loadKhwaterData();
  return Object.keys(data.lists).sort((a, b) => Number(a) - Number(b));
};

/**
 * Get chapter data by ID (for dynamic pages)
 */
export const getChapterData = async (id: string): Promise<KhwaterItem[]> => {
  const data = await loadKhwaterData();
  const chapter = data.lists[id];

  if (!chapter) {
    throw new Error(`Chapter ${id} not found`);
  }

  return chapter;
};

/**
 * Get chapter metadata
 */
export const getChapterMetadata = (id: string) => {
  return {
    id,
    title: `الفصل ${id}`,
    description: `محتوى الفصل ${id} من كتاب خواطر`,
  };
};

/**
 * Get all chapters for home page (SSG)
 */
export const getAllChapters = async () => {
  const data = await loadKhwaterData();
  const chapters = Object.entries(data.lists).map(([id, items]) => {
    // Extract the chapter title from the first item's titles array
    const chapterTitle = items.length > 0 && items[0].titles && items[0].titles.length > 0
      ? items[0].titles[0].split('\n')[0] // Get the first line, remove newlines
      : `الفصل ${id}`;

    return {
      id,
      title: `الفصل ${id}`,
      chapterTitle, // Add chapter title
      description: `محتوى الفصل ${id}`,
      itemCount: items.length,
    };
  });

  return chapters.sort((a, b) => Number(a.id) - Number(b.id));
};

/**
 * Search through all chapters using enhanced search index
 */
export const searchChapters = async (query: string) => {
  const data = await loadKhwaterData();

  // Build search index from data
  const searchData: Record<string, KhwaterItem[]> = data.lists;
  const index = buildSearchIndex(searchData);

  // Search through index
  const searchResults = searchIndex(index, query);

  // Convert search results to expected format
  const results: Array<{ chapterId: string; items: KhwaterItem[] }> = [];

  // Group results by chapter
  const chapterMap = new Map<string, KhwaterItem[]>();

  searchResults.forEach((result) => {
    const chapterItems = chapterMap.get(result.chapterId) || [];
    const chapterItemIndex = result.itemIndex;

    // Get the actual item from the chapter
    const allItems = data.lists[result.chapterId];
    if (allItems && allItems[chapterItemIndex]) {
      chapterItems.push(allItems[chapterItemIndex]);
    }

    chapterMap.set(result.chapterId, chapterItems);
  });

  // Convert map to array
  chapterMap.forEach((items, chapterId) => {
    results.push({ chapterId, items });
  });

  // Sort by chapter ID
  return results.sort((a, b) => Number(a.chapterId) - Number(b.chapterId));
};
