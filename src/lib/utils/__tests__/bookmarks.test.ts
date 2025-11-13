import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getBookmarks,
  saveBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
  getBookmark,
  updateBookmarkNotes,
  clearAllBookmarks,
} from '../bookmarks';
import { ElmItem } from '@/lib/types/elm';

const mockItem: ElmItem = {
  titles: ['عنوان تجريبي'],
  texts: ['نص تجريبي'],
  order: ['titles', 'texts'],
};

describe('bookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getBookmarks', () => {
    it('should return empty array when no bookmarks exist', () => {
      const bookmarks = getBookmarks();
      expect(bookmarks).toEqual([]);
    });

    it('should return bookmarks from localStorage', () => {
      const mockBookmarks = [
        {
          id: '1-0-1234567890',
          chapterId: '1',
          itemIndex: 0,
          title: 'عنوان',
          content: 'محتوى',
          createdAt: 1234567890,
        },
      ];

      localStorage.setItem('elm-bookmarks', JSON.stringify(mockBookmarks));

      const bookmarks = getBookmarks();
      expect(bookmarks).toEqual(mockBookmarks);
      expect(bookmarks).toHaveLength(1);
    });

    it('should return empty array when localStorage throws error', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Test error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const bookmarks = getBookmarks();

      expect(bookmarks).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load bookmarks:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('saveBookmarks', () => {
    it('should save bookmarks to localStorage', () => {
      const bookmarks = [
        {
          id: '1-0-1234567890',
          chapterId: '1',
          itemIndex: 0,
          title: 'عنوان',
          content: 'محتوى',
          createdAt: 1234567890,
        },
      ];

      saveBookmarks(bookmarks);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'elm-bookmarks',
        JSON.stringify(bookmarks)
      );
    });

    it('should handle save errors gracefully', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Test error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const bookmarks = [];

      expect(() => saveBookmarks(bookmarks)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save bookmarks:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('addBookmark', () => {
    it('should add a new bookmark', () => {
      const bookmark = addBookmark('1', 0, mockItem);

      expect(bookmark.chapterId).toBe('1');
      expect(bookmark.itemIndex).toBe(0);
      expect(bookmark.title).toBe('عنوان تجريبي');
      expect(bookmark.content).toBe('نص تجريبي');
      expect(bookmark.createdAt).toBeDefined();
      expect(bookmark.id).toMatch(/^1-0-\d+$/);
    });

    it('should save bookmark to localStorage', () => {
      addBookmark('1', 0, mockItem);

      expect(localStorage.setItem).toHaveBeenCalled();
      const saved = localStorage.getItem('elm-bookmarks');
      const bookmarks = JSON.parse(saved || '[]');

      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].chapterId).toBe('1');
    });

    it('should add to beginning of array', () => {
      const firstBookmark = addBookmark('1', 0, mockItem);
      const secondBookmark = addBookmark('2', 0, mockItem);

      const bookmarks = getBookmarks();
      expect(bookmarks[0].id).toBe(secondBookmark.id);
      expect(bookmarks[1].id).toBe(firstBookmark.id);
    });
  });

  describe('removeBookmark', () => {
    it('should remove bookmark by id', () => {
      addBookmark('1', 0, mockItem);
      addBookmark('2', 0, mockItem);

      const bookmarks = getBookmarks();
      expect(bookmarks).toHaveLength(2);

      removeBookmark(bookmarks[0].id);

      const remaining = getBookmarks();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].chapterId).toBe('2');
    });

    it('should handle non-existent bookmark', () => {
      expect(() => removeBookmark('non-existent-id')).not.toThrow();
    });
  });

  describe('isBookmarked', () => {
    it('should return true if bookmarked', () => {
      addBookmark('1', 0, mockItem);

      expect(isBookmarked('1', 0)).toBe(true);
    });

    it('should return false if not bookmarked', () => {
      expect(isBookmarked('1', 0)).toBe(false);
    });

    it('should return false for different chapter/item', () => {
      addBookmark('1', 0, mockItem);

      expect(isBookmarked('1', 1)).toBe(false);
      expect(isBookmarked('2', 0)).toBe(false);
    });
  });

  describe('toggleBookmark', () => {
    it('should add bookmark if not bookmarked', () => {
      const result = toggleBookmark('1', 0, mockItem);

      expect(result).not.toBeNull();
      expect(result?.chapterId).toBe('1');
      expect(isBookmarked('1', 0)).toBe(true);
    });

    it('should remove bookmark if already bookmarked', () => {
      addBookmark('1', 0, mockItem);

      const result = toggleBookmark('1', 0, mockItem);

      expect(result).toBeNull();
      expect(isBookmarked('1', 0)).toBe(false);
    });
  });

  describe('getBookmark', () => {
    it('should return bookmark if exists', () => {
      const added = addBookmark('1', 0, mockItem);
      const found = getBookmark('1', 0);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(added.id);
    });

    it('should return null if bookmark not found', () => {
      const found = getBookmark('1', 0);
      expect(found).toBeNull();
    });
  });

  describe('updateBookmarkNotes', () => {
    it('should update bookmark notes', () => {
      const bookmark = addBookmark('1', 0, mockItem);
      const notes = 'هذه ملاحظة تجريبية';

      updateBookmarkNotes(bookmark.id, notes);

      const updated = getBookmark('1', 0);
      expect(updated?.notes).toBe(notes);
    });

    it('should handle non-existent bookmark', () => {
      expect(() =>
        updateBookmarkNotes('non-existent-id', 'notes')
      ).not.toThrow();
    });
  });

  describe('clearAllBookmarks', () => {
    it('should remove all bookmarks', () => {
      addBookmark('1', 0, mockItem);
      addBookmark('2', 0, mockItem);

      expect(getBookmarks()).toHaveLength(2);

      clearAllBookmarks();

      expect(getBookmarks()).toHaveLength(0);
    });
  });

  describe('localStorage not available', () => {
    it('should handle server-side rendering', () => {
      const originalWindow = globalThis.window;
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
      });

      const bookmarks = getBookmarks();
      expect(bookmarks).toEqual([]);

      expect(() => saveBookmarks([])).not.toThrow();

      const bookmark = addBookmark('1', 0, mockItem);
      expect(bookmark).toBeDefined();

      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        writable: true,
      });
    });
  });
});
