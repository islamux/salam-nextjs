import 'server-only';
import fs from 'fs';
import path from 'path';
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

/**
 * Load chapter metadata from index (Server Side)
 */
export const loadIndex = async (): Promise<KhwaterIndex> => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'khwater', 'index.json');
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as KhwaterIndex;
  } catch (error) {
    console.error('Failed to load index:', error);
    throw new Error('Failed to load chapter index');
  }
};

/**
 * Load chapter data from individual file (Server Side)
 */
export const loadChapterData = async (id: string): Promise<KhwaterItem[]> => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'khwater', `${id}.json`);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as ChapterResponse;
    return data.items;
  } catch (error) {
    console.error(`Failed to load chapter ${id}:`, error);
    throw new Error(`Failed to fetch chapter ${id}`);
  }
};
/**
 * Get chapter data by ID (Alias)
 */
export const getChapterData = loadChapterData;

/**
 * Get all chapter IDs from index
 */
export const getAllChapterIds = async (): Promise<string[]> => {
  const index = await loadIndex();
  return index.chapters.map(ch => ch.id).sort((a, b) => Number(a) - Number(b));
};

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
