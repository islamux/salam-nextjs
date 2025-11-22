
import fs from 'fs';
import path from 'path';
import { KhwaterItem } from '../src/lib/types/khwater';
import { buildSearchIndex } from '../src/lib/utils/search-index';

// Define types locally to avoid importing from src which might cause issues with ts-node
interface ChapterResponse {
  items: KhwaterItem[];
  metadata: {
    id: string;
    version: string;
    generated: string;
    totalItems: number;
  };
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const KHWATER_DIR = path.join(PUBLIC_DIR, 'khwater');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'search-index.json');

async function generateIndex() {
  console.log('Generating search index...');

  if (!fs.existsSync(KHWATER_DIR)) {
    console.error(`Directory not found: ${KHWATER_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(KHWATER_DIR).filter(file => /^\d+\.json$/.test(file));
  const allData: Record<string, KhwaterItem[]> = {};

  console.log(`Found ${files.length} chapter files.`);

  for (const file of files) {
    const chapterId = path.basename(file, '.json');
    const filePath = path.join(KHWATER_DIR, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content) as ChapterResponse;
      allData[chapterId] = data.items;
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  }

  console.log('Building index...');
  const index = buildSearchIndex(allData);

  console.log(`Writing index to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));
  
  console.log(`Done! Index size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
}

generateIndex().catch(console.error);
