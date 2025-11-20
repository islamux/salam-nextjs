// TypeScript types for Khwater data structure
// Based on Flutter to Next.js migration plan

export type ContentType = 'title' | 'subtitle' | 'text' | 'ayah' | 'footer';

export interface DetailedOrderItem {
  type: ContentType;
  index: number;
}

export interface KhwaterItem {
  title?: string;
  subtitle?: string;
  text?: string;
  ayah?: string;
  footer?: string;
  order: ContentType[];
  detailedOrder?: DetailedOrderItem[];
}

export interface KhwaterData {
  version: string;
  generated: string;
  totalLists: number;
  lists: Record<string, KhwaterItem[]>;
}

export interface KhwaterChapter {
  id: string;
  title: string;
  description?: string;
  items: KhwaterItem[];
}

export interface ChapterMetadata {
  id: string;
  title: string;        // The "الفصل X" title
  chapterTitle: string; // The actual title from the first item
  description: string;
  itemCount: number;
}

export interface FontSizeSettings {
  base: number;
  title: number;
  subtitle: number;
  text: number;
  ayah: number;
}

export interface SearchResult {
  chapterId: string;
  items: KhwaterItem[];
}
