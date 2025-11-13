// Custom hook for managing bookmarks state and persistence

'use client';

import { useState, useEffect, useCallback } from 'react';
import { KhwaterItem } from '@/lib/types/khwater';

export interface Bookmark {
  id: string;
  chapterId: string;
  itemIndex: number;
  title?: string;
  content?: string;
  createdAt: number;
  notes?: string;
}

const BOOKMARKS_KEY = 'khwater-bookmarks';

// Get all bookmarks from localStorage
const getBookmarksFromStorage = (): Bookmark[] => {
  if (typeof window === 'undefined') return [];

  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Failed to load bookmarks:', error);
    return [];
  }
};

// Save bookmarks to localStorage
const saveBookmarksToStorage = (bookmarks: Bookmark[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
};

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks on mount
  useEffect(() => {
    try {
      const savedBookmarks = getBookmarksFromStorage();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save bookmarks whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveBookmarksToStorage(bookmarks);
    }
  }, [bookmarks, isLoading]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === BOOKMARKS_KEY) {
        try {
          const newBookmarks = e.newValue ? JSON.parse(e.newValue) : [];
          setBookmarks(newBookmarks);
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add a bookmark
  const addBookmark = useCallback(
    (chapterId: string, itemIndex: number, item: KhwaterItem): Bookmark => {
      const newBookmark: Bookmark = {
        id: `${chapterId}-${itemIndex}-${Date.now()}`,
        chapterId,
        itemIndex,
        title: item.titles?.[0],
        content: item.texts?.[0] || item.ayahs?.[0],
        createdAt: Date.now(),
      };

      setBookmarks((prev) => [newBookmark, ...prev]);
      return newBookmark;
    },
    []
  );

  // Remove a bookmark by ID
  const removeBookmark = useCallback((id: string): void => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Remove a bookmark by chapter and item index
  const removeBookmarkByItem = useCallback(
    (chapterId: string, itemIndex: number): void => {
      setBookmarks((prev) =>
        prev.filter((b) => !(b.chapterId === chapterId && b.itemIndex === itemIndex))
      );
    },
    []
  );

  // Check if a chapter/item is bookmarked
  const isBookmarked = useCallback((chapterId: string, itemIndex: number): boolean => {
    return bookmarks.some((b) => b.chapterId === chapterId && b.itemIndex === itemIndex);
  }, [bookmarks]);

  // Toggle bookmark
  const toggleBookmark = useCallback(
    (chapterId: string, itemIndex: number, item: KhwaterItem): Bookmark | null => {
      const existingBookmark = bookmarks.find(
        (b) => b.chapterId === chapterId && b.itemIndex === itemIndex
      );

      if (existingBookmark) {
        removeBookmark(existingBookmark.id);
        return null;
      } else {
        return addBookmark(chapterId, itemIndex, item);
      }
    },
    [bookmarks, addBookmark, removeBookmark]
  );

  // Get bookmark for specific chapter/item
  const getBookmark = useCallback(
    (chapterId: string, itemIndex: number): Bookmark | null => {
      return (
        bookmarks.find((b) => b.chapterId === chapterId && b.itemIndex === itemIndex) || null
      );
    },
    [bookmarks]
  );

  // Update bookmark notes
  const updateBookmarkNotes = useCallback((id: string, notes: string): void => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, notes } : b))
    );
  }, []);

  // Clear all bookmarks
  const clearAllBookmarks = useCallback((): void => {
    setBookmarks([]);
  }, []);

  // Get bookmarks by chapter
  const getBookmarksByChapter = useCallback(
    (chapterId: string): Bookmark[] => {
      return bookmarks.filter((b) => b.chapterId === chapterId);
    },
    [bookmarks]
  );

  // Get recent bookmarks
  const getRecentBookmarks = useCallback((limit: number = 10): Bookmark[] => {
    return [...bookmarks]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    removeBookmarkByItem,
    isBookmarked,
    toggleBookmark,
    getBookmark,
    updateBookmarkNotes,
    clearAllBookmarks,
    getBookmarksByChapter,
    getRecentBookmarks,
    bookmarkCount: bookmarks.length,
  };
}
