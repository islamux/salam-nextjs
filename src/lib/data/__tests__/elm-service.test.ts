import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadElmData,
  getAllChapterIds,
  getChapterData,
  getChapterMetadata,
  getAllChapters,
  searchChapters,
} from '../elm-service';

// Mock the JSON module
vi.mock('../elm-data.json', () => ({
  default: {
    lists: {
      '1': [
        {
          titles: ['الفصل الأول'],
          texts: ['محتوى الفصل الأول'],
          order: ['titles', 'texts'],
        },
      ],
      '2': [
        {
          titles: ['الفصل الثاني'],
          texts: ['محتوى الفصل الثاني'],
          order: ['titles', 'texts'],
        },
      ],
      '3': [
        {
          texts: ['فصل بدون عنوان'],
          order: ['texts'],
        },
      ],
    },
  },
}));

describe('elm-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadElmData', () => {
    it('should load Elm data from JSON', async () => {
      const data = await loadElmData();

      expect(data).toHaveProperty('lists');
      expect(data.lists).toHaveProperty('1');
      expect(data.lists['1']).toBeInstanceOf(Array);
    });

    it('should handle fetch from public folder when import fails', async () => {
      // Mock fetch to return data
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              lists: {
                '1': [{ texts: ['test'], order: ['texts'] }],
              },
            }),
        })
      ) as any;

      const data = await loadElmData();
      expect(data).toHaveProperty('lists');
      expect(fetch).toHaveBeenCalledWith('/elm-data.json');
    });

    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
        })
      ) as any;

      await expect(loadElmData()).rejects.toThrow('Failed to load Elm data');
    });
  });

  describe('getAllChapterIds', () => {
    it('should return sorted chapter IDs', async () => {
      const ids = await getAllChapterIds();

      expect(ids).toEqual(['1', '2', '3']);
      expect(ids).toHaveLength(3);
    });
  });

  describe('getChapterData', () => {
    it('should return chapter data by ID', async () => {
      const data = await getChapterData('1');

      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(1);
      expect(data[0]).toHaveProperty('titles');
      expect(data[0].titles?.[0]).toBe('الفصل الأول');
    });

    it('should throw error for non-existent chapter', async () => {
      await expect(getChapterData('999')).rejects.toThrow(
        'Chapter 999 not found'
      );
    });
  });

  describe('getChapterMetadata', () => {
    it('should return chapter metadata', () => {
      const metadata = getChapterMetadata('5');

      expect(metadata).toEqual({
        id: '5',
        title: 'الفصل 5',
        description: 'محتوى الفصل 5 من كتابعلم',
      });
    });
  });

  describe('getAllChapters', () => {
    it('should return all chapters with metadata', async () => {
      const chapters = await getAllChapters();

      expect(chapters).toHaveLength(3);
      expect(chapters[0]).toHaveProperty('id', '1');
      expect(chapters[0]).toHaveProperty('title', 'الفصل 1');
      expect(chapters[0]).toHaveProperty('description', 'محتوى الفصل 1');
      expect(chapters[0]).toHaveProperty('itemCount', 1);

      expect(chapters).toBeSortedBy('id', { ascending: true });
    });
  });

  describe('searchChapters', () => {
    it('should find chapters with matching content', async () => {
      const results = await searchChapters('الأول');

      expect(results).toHaveLength(1);
      expect(results[0].chapterId).toBe('1');
      expect(results[0].items).toHaveLength(1);
    });

    it('should find multiple chapters', async () => {
      const results = await searchChapters('الفصل');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array when no matches found', async () => {
      const results = await searchChapters('غير موجود');

      expect(results).toEqual([]);
    });

    it('should search in titles', async () => {
      const results = await searchChapters('الأول');

      expect(results).toHaveLength(1);
      expect(results[0].chapterId).toBe('1');
    });

    it('should search in texts', async () => {
      const results = await searchChapters('محتوى');

      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should be case insensitive', async () => {
      const results = await searchChapters('اول');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should sort results by chapter ID', async () => {
      const results = await searchChapters('الفصل');

      expect(results).toBeSortedBy('chapterId', { ascending: true });
    });
  });
});
