// Content parser utilities for Khwater data

import { KhwaterItem, ContentType } from '@/lib/types/khwater';

/**
 * Render content based on item.order array
 * Note: This is a utility function. The actual rendering is done in ContentRenderer component
 */
export const renderContentByOrder = (item: KhwaterItem) => {
  // This function returns content structure for parsing
  // Actual JSX rendering is handled in ContentRenderer component
  return item.order.map((type, index) => {
    switch (type) {
      case 'titles':
        return {
          type: 'title',
          content: item.titles?.join(' ') || '',
          key: `title-${index}`,
        };
      case 'subtitles':
        return {
          type: 'subtitle',
          content: item.subtitles?.join(' ') || '',
          key: `subtitle-${index}`,
        };
      case 'texts':
        return {
          type: 'text',
          content: item.texts?.join(' ') || '',
          key: `text-${index}`,
        };
      case 'ayahs':
        return {
          type: 'ayah',
          content: item.ayahs || [],
          key: `ayah-${index}`,
        };
      case 'footer':
        return {
          type: 'footer',
          content: item.footer || '',
          key: `footer-${index}`,
        };
      default:
        return null;
    }
  });
};

/**
 * Parse text content with proper handling
 */
export const parseText = (text: string): string => {
  // Handle Arabic text normalization
  return text.trim();
};

/**
 * Get chapter metadata
 */
export const getChapterMetadata = (listId: string) => {
  // This will be expanded when we have the actual 29 chapters
  return {
    id: listId,
    title: `الفصل ${listId}`,
    description: `محتوى الفصل ${listId}`,
  };
};
