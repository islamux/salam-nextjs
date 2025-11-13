// ContentRenderer component for displaying Khwater content
// Renders titles, texts, ayahs based on item.order or item.detailedOrder array

'use client';

import { KhwaterItem, DetailedOrderItem } from '@/lib/types/khwater';

interface ContentRendererProps {
  item: KhwaterItem;
}

export default function ContentRenderer({ item }: ContentRendererProps) {
  const renderContentByOrder = () => {
    // Use detailedOrder if available, otherwise fall back to simple order
    const shouldUseDetailedOrder = item.detailedOrder && item.detailedOrder.length > 0;

    if (shouldUseDetailedOrder) {
      return renderWithDetailedOrder(item.detailedOrder!);
    } else {
      return renderWithSimpleOrder(item.order);
    }
  };

  const renderWithDetailedOrder = (detailedOrder: DetailedOrderItem[]) => {
    return detailedOrder.map((orderItem, index) => {
      const { type, index: arrayIndex } = orderItem;

      switch (type) {
        case 'titles':
          if (!item.titles || !item.titles[arrayIndex]) return null;
          return (
            <h1
              key={`title-${index}`}
              className="arabic-title text-right mb-6 text-2xl font-bold"
            >
              {item.titles[arrayIndex]}
            </h1>
          );

        case 'subtitles':
          if (!item.subtitles || !item.subtitles[arrayIndex]) return null;
          return (
            <h2
              key={`subtitle-${index}`}
              className="text-right mb-4 text-xl font-semibold"
            >
              {item.subtitles[arrayIndex]}
            </h2>
          );

        case 'texts':
          if (!item.texts || !item.texts[arrayIndex]) return null;
          return (
            <p
              key={`text-${index}`}
              className="arabic-text text-right leading-loose mb-3"
            >
              {item.texts[arrayIndex]}
            </p>
          );

        case 'ayahs':
          if (!item.ayahs || !item.ayahs[arrayIndex]) return null;
          return (
            <p
              key={`ayah-${index}`}
              className="arabic-ayah text-right opacity-90 mb-2 leading-loose"
            >
              {item.ayahs[arrayIndex]}
            </p>
          );

        case 'footer':
          if (!item.footer) return null;
          return (
            <footer
              key={`footer-${index}`}
              className="text-right mt-8 pt-4 border-t border-gray-300 text-sm"
            >
              {item.footer}
            </footer>
          );

        default:
          return null;
      }
    });
  };

  const renderWithSimpleOrder = (order: string[]) => {
    return order.map((type, index) => {
      switch (type) {
        case 'titles':
          if (!item.titles || item.titles.length === 0) return null;
          return (
            <h1
              key={`title-${index}`}
              className="arabic-title text-right mb-6 text-2xl font-bold"
            >
              {item.titles.join(' ')}
            </h1>
          );

        case 'subtitles':
          if (!item.subtitles || item.subtitles.length === 0) return null;
          return (
            <h2
              key={`subtitle-${index}`}
              className="text-right mb-4 text-xl font-semibold"
            >
              {item.subtitles.join(' ')}
            </h2>
          );

        case 'texts':
          if (!item.texts || item.texts.length === 0) return null;
          return (
            <div key={`text-${index}`} className="mb-4">
              {item.texts.map((text, i) => (
                <p
                  key={i}
                  className="arabic-text text-right leading-loose mb-3"
                >
                  {text}
                </p>
              ))}
            </div>
          );

        case 'ayahs':
          if (!item.ayahs || item.ayahs.length === 0) return null;
          return (
            <div key={`ayah-${index}`} className="mb-4">
              {item.ayahs.map((ayah, i) => (
                <p
                  key={i}
                  className="arabic-ayah text-right opacity-90 mb-2 leading-loose"
                >
                  {ayah}
                </p>
              ))}
            </div>
          );

        case 'footer':
          if (!item.footer) return null;
          return (
            <footer
              key={`footer-${index}`}
              className="text-right mt-8 pt-4 border-t border-gray-300 text-sm"
            >
              {item.footer}
            </footer>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="content-renderer">
      {renderContentByOrder()}
    </div>
  );
}
