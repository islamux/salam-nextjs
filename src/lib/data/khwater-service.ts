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
