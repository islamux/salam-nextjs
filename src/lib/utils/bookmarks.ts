import { Bookmark, ElmItem } from '@/lib/types/elm';

const STORAGE_KEY = 'elm-bookmarks';

const isClient = () => typeof window !== 'undefined';

export const getBookmarks = (): Bookmark[] => {
  if (!isClient()) return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load bookmarks:', error);
    return [];
  }
};

export const saveBookmarks = (bookmarks: Bookmark[]): void => {
  if (!isClient()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
};

export const addBookmark = (chapterId: string, itemIndex: number, item: ElmItem): Bookmark => {
  const bookmark: Bookmark = {
    id: `${chapterId}-${itemIndex}-${Date.now()}`,
    chapterId,
    itemIndex,
    title: item.titles[0] || '',
    content: item.texts[0] || '',
    createdAt: Date.now(),
  };

  const bookmarks = getBookmarks();
  bookmarks.unshift(bookmark);
  saveBookmarks(bookmarks);

  return bookmark;
};

export const removeBookmark = (id: string): void => {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter((b) => b.id !== id);
  saveBookmarks(filtered);
};

export const isBookmarked = (chapterId: string, itemIndex: number): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some(
    (b) => b.chapterId === chapterId && b.itemIndex === itemIndex
  );
};

export const toggleBookmark = (
  chapterId: string,
  itemIndex: number,
  item: ElmItem
): Bookmark | null => {
  if (isBookmarked(chapterId, itemIndex)) {
    const bookmarks = getBookmarks();
    const existing = bookmarks.find(
      (b) => b.chapterId === chapterId && b.itemIndex === itemIndex
    );
    if (existing) {
      removeBookmark(existing.id);
    }
    return null;
  }

  return addBookmark(chapterId, itemIndex, item);
};

export const getBookmark = (
  chapterId: string,
  itemIndex: number
): Bookmark | null => {
  const bookmarks = getBookmarks();
  return (
    bookmarks.find(
      (b) => b.chapterId === chapterId && b.itemIndex === itemIndex
    ) || null
  );
};

export const updateBookmarkNotes = (id: string, notes: string): void => {
  const bookmarks = getBookmarks();
  const bookmark = bookmarks.find((b) => b.id === id);
  if (bookmark) {
    bookmark.notes = notes;
    saveBookmarks(bookmarks);
  }
};

export const clearAllBookmarks = (): void => {
  saveBookmarks([]);
};
