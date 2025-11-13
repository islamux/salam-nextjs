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
      const { type } = orderItem;

      switch (type) {
        case 'title':
          if (item.title) {
            return <Title key={`title-${index}`} title={item.title} />;
          }
          return null;

        case 'subtitle':
          if (item.subtitle) {
            return <Subtitle key={`subtitle-${index}`} subtitle={item.subtitle} />;
          }
          return null;

        case 'text':
          if (item.text) {
            return <Text key={`text-${index}`} text={item.text} />;
          }
          return null;

        case 'ayah':
          if (item.ayah) {
            return <Ayah key={`ayah-${index}`} ayah={item.ayah} />;
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
        case 'title':
          if (item.title) {
            return <Title key={`title-${index}`} title={item.title} />;
          }
          return null;

        case 'subtitle':
          if (item.subtitle) {
            return <Subtitle key={`subtitle-${index}`} subtitle={item.subtitle} />;
          }
          return null;

        case 'text':
          if (item.text) {
            return <Text key={`text-${index}`} text={item.text} />;
          }
          return null;

        case 'ayah':
          if (item.ayah) {
            return <Ayah key={`ayah-${index}`} ayah={item.ayah} />;
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
