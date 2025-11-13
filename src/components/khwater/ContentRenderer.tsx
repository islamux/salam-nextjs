// ContentRenderer component for displaying Khwater content
// Renders titles, texts, ayahs based on item.order or item.detailedOrder array

'use client';

import { KhwaterItem, DetailedOrderItem } from '@/lib/types/khwater';
import Title from './Title';
import Subtitle from './Subtitle';
import Text from './Text';
import Ayah from './Ayah';
import Footer from './Footer';

interface ContentRendererProps {
  item: KhwaterItem;
}

export default function ContentRenderer({ item }: ContentRendererProps) {
  const renderContentByOrder = () => {
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
          if (item.titles?.[arrayIndex]) {
            return <Title key={`title-${index}`} title={item.titles[arrayIndex]} />;
          }
          return null;

        case 'subtitles':
          if (item.subtitles?.[arrayIndex]) {
            return <Subtitle key={`subtitle-${index}`} subtitle={item.subtitles[arrayIndex]} />;
          }
          return null;

        case 'texts':
          if (item.texts?.[arrayIndex]) {
            return <Text key={`text-${index}`} text={item.texts[arrayIndex]} />;
          }
          return null;

        case 'ayahs':
          if (item.ayahs?.[arrayIndex]) {
            return <Ayah key={`ayah-${index}`} ayah={item.ayahs[arrayIndex]} />;
          }
          return null;

        case 'footer':
          if (item.footer) {
            return <Footer key={`footer-${index}`} footer={item.footer} />;
          }
          return null;

        default:
          return null;
      }
    });
  };

  const renderWithSimpleOrder = (order: string[]) => {
    return order.map((type, index) => {
      switch (type) {
        case 'titles':
          if (item.titles?.length) {
            return <Title key={`title-${index}`} title={item.titles.join(' ')} />;
          }
          return null;

        case 'subtitles':
          if (item.subtitles?.length) {
            return <Subtitle key={`subtitle-${index}`} subtitle={item.subtitles.join(' ')} />;
          }
          return null;

        case 'texts':
          if (item.texts?.length) {
            return (
              <div key={`text-${index}`} className="mb-4">
                {item.texts.map((text, i) => (
                  <Text key={i} text={text} />
                ))}
              </div>
            );
          }
          return null;

        case 'ayahs':
          if (item.ayahs?.length) {
            return (
              <div key={`ayah-${index}`} className="mb-4">
                {item.ayahs.map((ayah, i) => (
                  <Ayah key={i} ayah={ayah} />
                ))}
              </div>
            );
          }
          return null;

        case 'footer':
          if (item.footer) {
            return <Footer key={`footer-${index}`} footer={item.footer} />;
          }
          return null;

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
