// Enhanced search index for fast full-text search

import { KhwaterItem } from '@/lib/types/khwater';

interface SearchIndexItem {
  chapterId: string;
  itemIndex: number;
  content: string;
  title?: string;
  text?: string;
  ayah?: string;
}

/**
 * Build search index from Khwater data
 */
export const buildSearchIndex = (data: Record<string, KhwaterItem[]>): SearchIndexItem[] => {
  const index: SearchIndexItem[] = [];

  for (const [chapterId, items] of Object.entries(data)) {
    items.forEach((item, itemIndex) => {
      // Combine all searchable content
      const combinedContent = [
        item.title || '',
        item.text || '',
        item.ayah || '',
        item.subtitle || '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .trim();

      if (combinedContent) {
        index.push({
          chapterId,
          itemIndex,
          content: combinedContent,
          title: item.title,
          text: item.text,
          ayah: item.ayah,
        });
      }
    });
  }

  return index;
};

/**
 * Search through indexed data
 */
export const searchIndex = (
  index: SearchIndexItem[],
  query: string
): Array<{
  chapterId: string;
  itemIndex: number;
  matches: string[];
  score: number;
}> => {
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  const results = new Map<string, {
    chapterId: string;
    itemIndex: number;
    matches: string[];
    score: number;
  }>();

  index.forEach((item) => {
    let totalScore = 0;
    const matchedTerms: string[] = [];

    searchTerms.forEach((term) => {
      if (!term) return;

      // Check if term appears in content
      if (item.content.includes(term)) {
        totalScore += 1;
        matchedTerms.push(term);
      }

      // Title matches get higher score
      if (item.title?.toLowerCase().includes(term)) {
        totalScore += 2;
      }

      // Ayah matches get medium score
      if (item.ayah?.toLowerCase().includes(term)) {
        totalScore += 1.5;
      }
    });

    if (totalScore > 0) {
      const key = `${item.chapterId}-${item.itemIndex}`;
      if (results.has(key)) {
        const existing = results.get(key)!;
        existing.score += totalScore;
        existing.matches.push(...matchedTerms);
      } else {
        results.set(key, {
          chapterId: item.chapterId,
          itemIndex: item.itemIndex,
          matches: [...new Set(matchedTerms)],
          score: totalScore,
        });
      }
    }
  });

  // Sort by score (highest first)
  return Array.from(results.values()).sort((a, b) => b.score - a.score);
};

/**
 * Highlight search terms in text
 */
export const highlightSearchTerms = (
  text: string,
  searchTerms: string[]
): string => {
  if (!searchTerms.length || !text) return text;

  let highlightedText = text;

  searchTerms.forEach((term) => {
    if (!term) return;
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
    );
  });

  return highlightedText;
};
