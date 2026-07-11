import { KhwaterItem, ContentType } from '@/lib/types/khwater';
import { cleanTitle } from './clean-text';

export interface TocHeading {
  id: string;
  text: string;
  type: ContentType;
  itemIndex: number;
}

export function extractHeadings(items: KhwaterItem[]): TocHeading[] {
  const headings: TocHeading[] = [];

  items.forEach((item, itemIndex) => {
    if (itemIndex === 0 && item.title) {
      headings.push({
        id: `toc-${itemIndex}-title`,
        text: cleanTitle(item.title),
        type: 'title',
        itemIndex,
      });
      return;
    }

    if (item.title && item.order.includes('title')) {
      headings.push({
        id: `toc-${itemIndex}-title`,
        text: cleanTitle(item.title),
        type: 'title',
        itemIndex,
      });
    }

    if (item.subtitle && item.order.includes('subtitle')) {
      headings.push({
        id: `toc-${itemIndex}-subtitle`,
        text: cleanTitle(item.subtitle),
        type: 'subtitle',
        itemIndex,
      });
    }
  });

  return headings;
}
