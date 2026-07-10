'use client';

import { KhwaterItem, ContentType } from '@/lib/types/khwater';
import Title from './Title';
import Subtitle from './Subtitle';
import Text from './Text';
import Ayah from './Ayah';
import Footer from './Footer';

interface ContentRendererProps {
  item: KhwaterItem;
}

function resolveOrder(item: KhwaterItem): ContentType[] {
  if (item.detailedOrder && item.detailedOrder.length > 0) {
    return item.detailedOrder.map((o) => o.type);
  }
  return item.order as ContentType[];
}

export default function ContentRenderer({ item }: ContentRendererProps) {
  const order = resolveOrder(item);

  return (
    <div className="content-renderer">
      {order.map((type, index) => {
        switch (type) {
          case 'title':
            return item.title ? <Title key={`title-${index}`} title={item.title} /> : null;
          case 'subtitle':
            return item.subtitle ? <Subtitle key={`subtitle-${index}`} subtitle={item.subtitle} /> : null;
          case 'text':
            return item.text ? <Text key={`text-${index}`} text={item.text} /> : null;
          case 'ayah':
            return item.ayah ? <Ayah key={`ayah-${index}`} ayah={item.ayah} /> : null;
          case 'footer':
            return item.footer ? <Footer key={`footer-${index}`} footer={item.footer} /> : null;
          default:
            return null;
        }
      })}
    </div>
  );
}
