import { MetadataRoute } from 'next';
import { getAllChapterIds } from '@/lib/data/khwater-service';
import { SITE_URL } from '@/lib/translations';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const chapterIds = await getAllChapterIds();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/offline`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const chapterPages: MetadataRoute.Sitemap = chapterIds.map((id) => ({
    url: `${baseUrl}/khwater/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticPages, ...chapterPages];
}
