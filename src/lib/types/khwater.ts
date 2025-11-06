// TypeScript types for Khwater data structure
// Based on Flutter to Next.js migration plan

export type ContentType = 'titles' | 'subtitles' | 'texts' | 'ayahs' | 'footer';

export interface KhwaterItem {
  titles?: string[];
  subtitles?: string[];
  texts: string[];
  ayahs?: string[];
  footer?: string;
  order: ContentType[];
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

export interface FontSizeSettings {
  base: number;
  titles: number;
  subtitles: number;
  texts: number;
  ayahs: number;
}
