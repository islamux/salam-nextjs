// Data service layer for Khwater data
import { KhwaterItem } from '@/lib/types/khwater';
import { buildSearchIndex, searchIndex } from '@/lib/utils/search-index';

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

// Legacy type for backward compatibility during migration
interface KhwaterData {
  version: string;
  generated: string;
  totalLists: number;
  lists: Record<string, KhwaterItem[]>;
}

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
 * Load all Khwater data (legacy function for backward compatibility)
 * @deprecated Use loadChapterData() for specific chapters instead
 */
export const loadKhwaterData = async (): Promise<KhwaterData> => {
  const index = await loadIndex();
  const lists: Record<string, KhwaterItem[]> = {};

  // Load all chapters sequentially
  for (const chapter of index.chapters) {
    try {
      lists[chapter.id] = await loadChapterData(chapter.id);
    } catch (error) {
      console.error(`Failed to load chapter ${chapter.id}:`, error);
      lists[chapter.id] = [];
    }
  }

  return {
    version: index.version,
    generated: index.generated,
    totalLists: index.totalChapters,
    lists
  };
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
        chapterTitle: items[0]?.titles?.[0]?.split('\n')[0] || `الفصل ${chapter.id}`,
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
 * Search across all chapters
 */
export const searchChapters = async (query: string) => {
  const index = await loadIndex();
  const chapterMap = new Map<string, KhwaterItem[]>();

  // Search in all chapters
  for (const chapter of index.chapters) {
    try {
      const items = await loadChapterData(chapter.id);
      const searchResults = searchIndex(buildSearchIndex({ [chapter.id]: items }), query);

      searchResults.forEach((result) => {
        const chapterItems = chapterMap.get(result.chapterId) || [];
        if (items[result.itemIndex]) {
          chapterItems.push(items[result.itemIndex]);
        }
        chapterMap.set(result.chapterId, chapterItems);
      });
    } catch (error) {
      console.error(`Error searching chapter ${chapter.id}:`, error);
    }
  }

  return Array.from(chapterMap.entries())
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
