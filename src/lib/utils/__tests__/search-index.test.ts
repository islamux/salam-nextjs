import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchIndex, highlightSearchTerms } from '../search-index';
import { KhwaterItem } from '@/lib/types/khwater';

describe('searchIndex', () => {
  const mockData: Record<string, KhwaterItem[]> = {
    '1': [
      {
        title: 'الفصل الأول',
        text: 'هذا نص تجريبي للاختبار',
        ayah: 'بسم الله الرحمن الرحيم',
        order: ['title', 'text'],
      },
    ],
    '2': [
      {
        title: 'الفصل الثاني',
        text: 'نص آخر للاختبار',
        order: ['title', 'text'],
      },
    ],
  };

  describe('buildSearchIndex', () => {
    it('should build search index from data', () => {
      const index = buildSearchIndex(mockData);

      expect(index).toHaveLength(2);
      expect(index[0]).toHaveProperty('chapterId', '1');
      expect(index[0]).toHaveProperty('itemIndex', 0);
      expect(index[0]).toHaveProperty('content');
      expect(index[0].content).toContain('الفصل الأول');
      expect(index[0].content).toContain('نص تجريبي');
      expect(index[0].content).toContain('بسم الله');
    });

    it('should combine all searchable content', () => {
      const index = buildSearchIndex(mockData);

      const firstItem = index[0];
      expect(firstItem.content).toBe(
        `${firstItem.title} ${firstItem.text} ${firstItem.ayah}`.trim()
      );
    });

    it('should handle empty data', () => {
      const index = buildSearchIndex({});
      expect(index).toHaveLength(0);
    });
  });

  describe('searchIndex', () => {
    it('should find matching items', () => {
      const index = buildSearchIndex(mockData);
      const results = searchIndex(index, 'الله');

      expect(results).toHaveLength(1);
      expect(results[0].chapterId).toBe('1');
      expect(results[0].matches).toContain('الله');
      expect(results[0].score).toBeGreaterThan(0);
    });

    it('should score title matches higher', () => {
      const index = buildSearchIndex(mockData);
      const results = searchIndex(index, 'الفصل');

      // Title matches get +2 points
      expect(results[0].score).toBeGreaterThanOrEqual(2);
    });

    it('should score ayah matches with medium priority', () => {
      const index = buildSearchIndex(mockData);
      const results = searchIndex(index, 'بسم');

      // Ayah matches get +1.5 points
      expect(results[0].score).toBeGreaterThanOrEqual(1.5);
    });

    it('should return empty results for non-matching query', () => {
      const index = buildSearchIndex(mockData);
      const results = searchIndex(index, 'غير موجود');

      expect(results).toHaveLength(0);
    });

    it('should sort results by score (highest first)', () => {
      const testData: Record<string, KhwaterItem[]> = {
        '1': [
          {
            title: 'نص واحد',
            text: 'كلمات متعددة للبحث',
            order: ['title'],
          },
          {
            title: 'نص آخر',
            text: 'كلمة واحدة',
            order: ['title'],
          },
        ],
      };

      const index = buildSearchIndex(testData);
      const results = searchIndex(index, 'كلمات');

      expect(results).toHaveLength(1);
    });

    it('should handle multiple search terms', () => {
      const index = buildSearchIndex(mockData);
      const results = searchIndex(index, 'الفصل نص');

      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.matches).toContain('الفصل');
        expect(result.matches).toContain('نص');
      });
    });
  });

  describe('highlightSearchTerms', () => {
    it('should highlight matching terms', () => {
      const text = 'هذا نص تجريبي للاختبار';
      const highlighted = highlightSearchTerms(text, ['نص']);

      expect(highlighted).toContain('<mark');
      expect(highlighted).toContain('نص');
    });

    it('should highlight multiple terms', () => {
      const text = 'هذا نص تجريبي للاختبار';
      const highlighted = highlightSearchTerms(text, ['نص', 'اختبار']);

      expect(highlighted).toContain('<mark');
      expect(highlighted).toContain('نص');
      expect(highlighted).toContain('اختبار');
    });

    it('should not modify text when no terms match', () => {
      const text = 'هذا نص تجريبي';
      const highlighted = highlightSearchTerms(text, ['غير موجود']);

      expect(highlighted).toBe(text);
    });

    it('should handle empty search terms', () => {
      const text = 'هذا نص تجريبي';
      const highlighted = highlightSearchTerms(text, []);

      expect(highlighted).toBe(text);
    });

    it('should be case insensitive', () => {
      const text = 'This is a TEST text';
      const highlighted = highlightSearchTerms(text, ['test']);

      expect(highlighted).toContain('<mark');
      expect(highlighted).toContain('TEST');
    });
  });
});
