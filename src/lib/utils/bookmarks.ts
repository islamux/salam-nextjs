// Bookmarking system for saving favorite content

import { KhwaterItem } from '@/lib/types/khwater';

const BOOKMARKS_KEY = 'khwater-bookmarks';

export interface Bookmark {
  id: string;
  chapterId: string;
  itemIndex: number;
  title?: string;
  content?: string;
  createdAt: number;
  notes?: string;
}

/**
 * Get all bookmarks from localStorage
 */
export const getBookmarks = (): Bookmark[] => {
  if (typeof window === 'undefined') return [];

  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Failed to load bookmarks:', error);
    return [];
  }
};

/**
 * Save bookmarks to localStorage
 */
export const saveBookmarks = (bookmarks: Bookmark[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
};

/**
 * Add a bookmark
 */
export const addBookmark = (
  chapterId: string,
  itemIndex: number,
  item: KhwaterItem
): Bookmark => {
  const bookmarks = getBookmarks();

  const newBookmark: Bookmark = {
    id: `${chapterId}-${itemIndex}-${Date.now()}`,
    chapterId,
    itemIndex,
    title: item.titles?.[0],
    content: item.texts?.[0] || item.ayahs?.[0],
    createdAt: Date.now(),
  };

  bookmarks.unshift(newBookmark);
  saveBookmarks(bookmarks);

  return newBookmark;
};

/**
 * Remove a bookmark by ID
 */
export const removeBookmark = (id: string): void => {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter((b) => b.id !== id);
  saveBookmarks(filtered);
};

/**
 * Check if a chapter/item is bookmarked
 */
export const isBookmarked = (chapterId: string, itemIndex: number): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.chapterId === chapterId && b.itemIndex === itemIndex);
};

/**
 * Toggle bookmark
 */
export const toggleBookmark = (
  chapterId: string,
  itemIndex: number,
  item: KhwaterItem
): Bookmark | null => {
  if (isBookmarked(chapterId, itemIndex)) {
    const bookmarks = getBookmarks();
    const bookmark = bookmarks.find(
      (b) => b.chapterId === chapterId && b.itemIndex === itemIndex
    );
    if (bookmark) {
      removeBookmark(bookmark.id);
    }
    return null;
  } else {
    return addBookmark(chapterId, itemIndex, item);
  }
};

/**
 * Get bookmark for specific chapter/item
 */
export const getBookmark = (chapterId: string, itemIndex: number): Bookmark | null => {
  const bookmarks = getBookmarks();
  return (
    bookmarks.find((b) => b.chapterId === chapterId && b.itemIndex === itemIndex) ||
    null
  );
};

/**
 * Update bookmark notes
 */
export const updateBookmarkNotes = (id: string, notes: string): void => {
  const bookmarks = getBookmarks();
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookmarks[index].notes = notes;
    saveBookmarks(bookmarks);
  }
};

/**
 * Clear all bookmarks
 */
export const clearAllBookmarks = (): void => {
  saveBookmarks([]);
};
