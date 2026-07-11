import { KhwaterItem } from '@/lib/types/khwater';

const DASH_LINE_RE = /^[\s\-*]+$/;

export function stripDashes(text: string): string {
  return text
    .split('\n')
    .filter((line) => !DASH_LINE_RE.test(line))
    .join('\n')
    .trim();
}

export function cleanTitle(text: string): string {
  return stripDashes(text).split('\n')[0].trim();
}

export function findChapterTitle(items: KhwaterItem[], chapterId: string): string {
  const firstTitle = items[0]?.title ? cleanTitle(items[0].title) : '';
  if (firstTitle) return firstTitle;

  const firstSubtitle = items[0]?.subtitle ? cleanTitle(items[0].subtitle) : '';
  if (firstSubtitle) return firstSubtitle;

  for (const item of items) {
    if (item.title) {
      const t = cleanTitle(item.title);
      if (t) return t;
    }
  }

  for (const item of items) {
    if (item.subtitle) {
      const s = cleanTitle(item.subtitle);
      if (s) return s;
    }
  }

  return `الفصل ${chapterId}`;
}
