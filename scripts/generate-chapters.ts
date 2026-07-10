import fs from 'fs';
import path from 'path';
import { buildSearchIndex } from '../src/lib/utils/search-index';

interface SourcePage {
  index: number;
  titles?: string[];
  subtitles?: string[];
  texts?: string[];
  ayahs?: string[];
  footer?: string;
  order: string[];
}

interface SourceChapter {
  id: string;
  order_index: number;
  title: string;
  pages: SourcePage[];
}

interface SourceData {
  version: number;
  generated_at: string;
  chapters: SourceChapter[];
}

interface KhwaterItem {
  title?: string;
  subtitle?: string;
  text?: string;
  ayah?: string;
  footer?: string;
  order: string[];
}

interface ChapterResponse {
  items: KhwaterItem[];
  metadata: {
    id: string;
    version: string;
    generated: string;
    totalItems: number;
  };
}

interface ChapterMeta {
  id: string;
  items: number;
  sizeKB: number;
}

interface KhwaterIndex {
  totalChapters: number;
  version: string;
  generated: string;
  chapters: ChapterMeta[];
  summary: {
    totalChapters: number;
    totalItems: number;
    totalSizeKB: string;
    averageSizeKB: string;
  };
}

const SOURCE_FILE = path.join(process.cwd(), 'src/lib/data/khatira_content.json');
const KHWATER_DIR = path.join(process.cwd(), 'public/khwater');
const INDEX_FILE = path.join(KHWATER_DIR, 'index.json');
const SEARCH_INDEX_FILE = path.join(process.cwd(), 'public/search-index.json');
const VERSION = '4.0.0';

const ID_MAP: Record<string, string> = {
  pre: '0',
  final: '33',
};

const FIELD_MAP: Record<string, { arrayKey: string; fieldName: string }> = {
  titles: { arrayKey: 'titles', fieldName: 'title' },
  subtitles: { arrayKey: 'subtitles', fieldName: 'subtitle' },
  texts: { arrayKey: 'texts', fieldName: 'text' },
  ayahs: { arrayKey: 'ayahs', fieldName: 'ayah' },
  footer: { arrayKey: 'footer', fieldName: 'footer' },
};

function convertPagesToItems(pages: SourcePage[]): KhwaterItem[] {
  const items: KhwaterItem[] = [];
  let current: Record<string, string> = {};
  let currentOrder: string[] = [];

  for (const page of pages) {
    const arrays: Record<string, string[]> = {};
    let footerVal: string | null = null;

    if (page.titles) arrays.titles = [...page.titles];
    if (page.subtitles) arrays.subtitles = [...page.subtitles];
    if (page.texts) arrays.texts = [...page.texts];
    if (page.ayahs) arrays.ayahs = [...page.ayahs];
    if (page.footer !== undefined) footerVal = page.footer;

    for (const entryType of page.order) {
      const mapping = FIELD_MAP[entryType];
      if (!mapping) {
        console.warn(`Unknown order type: ${entryType}`);
        continue;
      }

      let value: string | undefined;
      if (entryType === 'footer') {
        value = footerVal ?? undefined;
        footerVal = null;
      } else {
        const arr = arrays[entryType];
        if (arr && arr.length > 0) {
          value = arr.shift();
        }
      }

      if (value === undefined) continue;

      const fieldName = mapping.fieldName;

      if (current[fieldName] !== undefined) {
        items.push({ ...current, order: [...currentOrder] } as KhwaterItem);
        current = {};
        currentOrder = [];
      }

      current[fieldName] = value;
      currentOrder.push(fieldName);
    }
  }

  if (Object.keys(current).length > 0) {
    items.push({ ...current, order: [...currentOrder] } as KhwaterItem);
  }

  return items;
}

function main() {
  console.log('Reading source file...');
  const raw = fs.readFileSync(SOURCE_FILE, 'utf-8');
  const source: SourceData = JSON.parse(raw);

  const generated = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const allData: Record<string, KhwaterItem[]> = {};

  if (!fs.existsSync(KHWATER_DIR)) {
    fs.mkdirSync(KHWATER_DIR, { recursive: true });
  }

  // Clean existing chapter files
  const existing = fs.readdirSync(KHWATER_DIR).filter((f) => /\.json$/.test(f) && f !== 'index.json');
  for (const f of existing) {
    fs.unlinkSync(path.join(KHWATER_DIR, f));
  }

  const chapterMetas: ChapterMeta[] = [];
  let totalItems = 0;
  let totalSizeBytes = 0;

  for (const chapter of source.chapters) {
    const items = convertPagesToItems(chapter.pages);
    const destId = ID_MAP[chapter.id] ?? chapter.id;

    const response: ChapterResponse = {
      items,
      metadata: {
        id: destId,
        version: VERSION,
        generated,
        totalItems: items.length,
      },
    };

    const filePath = path.join(KHWATER_DIR, `${destId}.json`);
    const jsonStr = JSON.stringify(response, null, 2);
    fs.writeFileSync(filePath, jsonStr);

    const fileSize = Buffer.byteLength(jsonStr, 'utf-8');
    chapterMetas.push({
      id: destId,
      items: items.length,
      sizeKB: fileSize / 1024,
    });

    totalItems += items.length;
    totalSizeBytes += fileSize;
    allData[destId] = items;

    console.log(`  ${destId}.json: ${items.length} items (${(fileSize / 1024).toFixed(1)} KB)`);
  }

  const totalSizeKB = totalSizeBytes / 1024;
  const index: KhwaterIndex = {
    totalChapters: source.chapters.length,
    version: VERSION,
    generated,
    chapters: chapterMetas,
    summary: {
      totalChapters: source.chapters.length,
      totalItems,
      totalSizeKB: totalSizeKB.toFixed(2),
      averageSizeKB: (totalSizeKB / source.chapters.length).toFixed(2),
    },
  };

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`\nIndex: ${source.chapters.length} chapters, ${totalItems} total items`);

  console.log('\nBuilding search index...');
  const searchIndex = buildSearchIndex(allData as Record<string, import('../src/lib/types/khwater').KhwaterItem[]>);
  fs.writeFileSync(SEARCH_INDEX_FILE, JSON.stringify(searchIndex));
  const searchSize = fs.statSync(SEARCH_INDEX_FILE).size;
  console.log(`Search index: ${(searchSize / 1024).toFixed(1)} KB`);

  console.log('\nDone.');
}

main();
