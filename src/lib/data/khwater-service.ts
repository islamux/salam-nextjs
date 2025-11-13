// Data service layer for Khwater data
import { KhwaterData, KhwaterItem } from '@/lib/types/khwater';
import { buildSearchIndex, searchIndex } from '@/lib/utils/search-index';

export const loadKhwaterData = async (): Promise<KhwaterData> => {
  if (typeof window === 'undefined') {
    const data = await import('../../../public/khwater-data.json');
    return data.default as KhwaterData;
  }
  const response = await fetch('/khwater-data.json');
  if (!response.ok) throw new Error('Failed to fetch Khwater data');
  return response.json();
};

export const getAllChapterIds = async (): Promise<string[]> => {
  const data = await loadKhwaterData();
  return Object.keys(data.lists).sort((a, b) => Number(a) - Number(b));
};

export const getChapterData = async (id: string): Promise<KhwaterItem[]> => {
  const data = await loadKhwaterData();
  const chapter = data.lists[id];
  if (!chapter) throw new Error(`Chapter ${id} not found`);
  return chapter;
};

export const getChapterMetadata = (id: string) => ({ id, title: `الفصل ${id}`, description: `محتوى الفصل ${id} من كتاب خواطر` });

export const getAllChapters = async () => {
  const data = await loadKhwaterData();
  return Object.entries(data.lists)
    .map(([id, items]) => ({
      id,
      title: `الفصل ${id}`,
      chapterTitle: items[0]?.titles?.[0]?.split('\n')[0] || `الفصل ${id}`,
      description: `محتوى الفصل ${id}`,
      itemCount: items.length,
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
};

export const searchChapters = async (query: string) => {
  const data = await loadKhwaterData();
  const index = buildSearchIndex(data.lists);
  const searchResults = searchIndex(index, query);
  const chapterMap = new Map<string, KhwaterItem[]>();

  searchResults.forEach((result) => {
    const items = chapterMap.get(result.chapterId) || [];
    const allItems = data.lists[result.chapterId];
    if (allItems?.[result.itemIndex]) items.push(allItems[result.itemIndex]);
    chapterMap.set(result.chapterId, items);
  });

  return Array.from(chapterMap.entries()).map(([chapterId, items]) => ({ chapterId, items })).sort((a, b) => Number(a.chapterId) - Number(b.chapterId));
};
