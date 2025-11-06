/**
 * Script to convert Dart text files to JSON format
 * Converts: /salam/lib/core/data/static/text/*.dart
 * To: khwater-data.json
 *
 * Structure mapping:
 * - titleChapterNumber_Page -> titles[]
 * - subtitleChapterNumber_Page -> subtitles[]
 * - elmTextChapterNumber_Page_Index -> texts[]
 * - ayahHadithChapterNumber_Page_Index -> ayahs[]
 * - footerChapterNumber_Page -> footer
 */

import * as fs from 'fs';
import * as path from 'path';
import { KhwaterData, KhwaterItem } from './src/lib/types/khwater';

// Mapping of chapter number to file name
const CHAPTER_FILES: Record<string, string> = {
  '1': 'elm_text_ders_one.dart',
  '2': 'elm_text_ders_two.dart',
  '3': 'elm_text_ders_three.dart',
  '4': 'elm_text_ders_four.dart',
  '5': 'elm_text_ders_five.dart',
  '6': 'elm_text_ders_six.dart',
  '7': 'elm_text_ders_seven.dart',
  '8': 'elm_text_ders_eight.dart',
  '9': 'elm_text_ders_nine.dart',
  '10': 'elm_text_ders_ten.dart',
  '11': 'elm_text_ders_therteen.dart', // Note: typo in original filename
  '12': 'elm_text_ders_eleven.dart',
  '13': 'elm_text_ders_twelve.dart',
  '14': 'elm_text_ders_fourteen.dart',
  '15': 'elm_text_ders_fifteen.dart',
  '16': 'elm_text_ders_sixteen.dart',
  '17': 'elm_text_ders_seventeen.dart',
  '18': 'elm_text_ders_eighteen.dart',
  '19': 'elm_text_ders_nineteen.dart',
  '20': 'elm_text_ders_twenty.dart',
  '21': 'elm_text_ders_twenty_one.dart',
  '22': 'elm_text_ders_twenty_two.dart',
  '23': 'elm_text_ders_twenty_three.dart',
  '24': 'elm_text_ders_twenty_four.dart',
  '25': 'elm_text_ders_twenty_five.dart',
  '26': 'elm_text_ders_twenty_six.dart',
  '27': 'elm_text_ders_twenty_seven.dart',
  '28': 'elm_text_ders_final.dart', // Note: special filename
  '29': 'elm_text_ders_pre.dart', // Note: special filename
};

// Source directory
const SOURCE_DIR = '/media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam/lib/core/data/static/text';

// Output directory
const OUTPUT_DIR = '/media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam-nextjs/public';

// Parse content type from variable name
function parseVariableName(varName: string): {
  type: 'title' | 'subtitle' | 'text' | 'ayah' | 'footer' | null;
  page: string | null;
  index: number | null;
} {
  // Pattern variations:
  // - titleOneOne (early chapters)
  // - titleTwentyOneOne (later chapters)
  // - elmTextOneOne_1 (with index)
  // - titleFInalPageOne (chapter 28 - special case)

  // Special handling for chapter 28 (FInal)
  if (varName.includes('FInal')) {
    const typeMatch = varName.match(/^(title|subtitle|text|ayahHadith)(?=FInal)/);
    if (typeMatch) {
      const type = typeMatch[1];
      const pageMatch = varName.match(/Page([A-Z][a-z]+)/);
      const indexMatch = varName.match(/_(\d+)$/);

      if (pageMatch) {
        const page = pageMatch[1]; // e.g., "One", "Two"
        const index = indexMatch ? parseInt(indexMatch[1]) : 1;

        let mappedType: 'title' | 'subtitle' | 'text' | 'ayah' | 'footer' | null = null;
        if (type === 'title') mappedType = 'title';
        else if (type === 'subtitle') mappedType = 'subtitle';
        else if (type === 'text') mappedType = 'text';
        else if (type === 'ayahHadith') mappedType = 'ayah';

        return { type: mappedType, page, index };
      }
    }
  }

  // Standard pattern with optional index: ^(title|subtitle|elmText|ayahHadith|footer)([A-Z][a-z]+)+(_Index)?$
  const patterns = [
    {
      type: 'title',
      regex: /^title([A-Z][a-z]+)+(_\d+)?$/,
    },
    {
      type: 'subtitle',
      regex: /^subtitle([A-Z][a-z]+)+(_\d+)?$/,
    },
    {
      type: 'text',
      regex: /^elmText([A-Z][a-z]+)+(_\d+)?$/,
    },
    {
      type: 'ayah',
      regex: /^ayahHadith([A-Z][a-z]+)+(_\d+)?$/,
    },
    {
      type: 'footer',
      regex: /^footer([A-Z][a-z]+)+$/,
    },
  ];

  for (const pattern of patterns) {
    const match = varName.match(pattern.regex);
    if (match) {
      // Extract all the word parts (chapter + page numbers)
      // e.g., "TwentyOneOne" from ["Twenty", "One", "One"]
      const allParts = match[0].replace(pattern.type, '').replace(/_\d+$/, '');

      // Split into components (e.g., "TwentyOneOne" -> "Twenty", "One", "One")
      const components = allParts.match(/[A-Z][a-z]+/g) || [];

      if (components.length >= 2) {
        // First part is chapter number (One, Two, TwentyOne, etc.)
        // Remaining parts are page numbers
        const page = components.slice(1).join(''); // e.g., "One", "Two", etc.
        const index = match[2] ? parseInt(match[2].substring(1)) : 1;
        return { type: pattern.type as any, page, index };
      }
    }
  }

  return { type: null, page: null, index: null };
}

// Convert word number to digit
function wordToDigit(word: string): string {
  const words: Record<string, string> = {
    One: '1',
    Two: '2',
    Three: '3',
    Four: '4',
    Five: '5',
    Six: '6',
    Seven: '7',
    Eight: '8',
    Nine: '9',
    Ten: '10',
    Eleven: '11',
    Twelve: '12',
    Thirteen: '13',
    Fourteen: '14',
    Fifteen: '15',
    Sixteen: '16',
    Seventeen: '17',
    Eighteen: '18',
    Nineteen: '19',
    Twenty: '20',
    TwentyOne: '21',
    TwentyTwo: '22',
    TwentyThree: '23',
    TwentyFour: '24',
    TwentyFive: '25',
    TwentySix: '26',
    TwentySeven: '27',
    Pre: '28',
    Final: '29',
  };

  return words[word] || word;
}

// Parse Dart file content
function parseDartFile(content: string, chapterNum: string): KhwaterItem[] {
  const items: KhwaterItem[] = [];

  // Extract all static const String definitions
  const stringRegex = /static const String (\w+)\s*=\s*"""([\s\S]*?)"""/g;
  let match;

  // Group content by page
  const pageGroups: Record<
    string,
    {
      titles?: string[];
      subtitles?: string[];
      texts?: string[];
      ayahs?: string[];
      footer?: string;
    }
  > = {};

  while ((match = stringRegex.exec(content)) !== null) {
    const [, varName, varValue] = match;
    const parsed = parseVariableName(varName);

    if (!parsed.type || !parsed.page) continue;

    const page = parsed.page;
    const value = varValue.trim();

    if (!pageGroups[page]) {
      pageGroups[page] = {};
    }

    switch (parsed.type) {
      case 'title':
        if (!pageGroups[page].titles) pageGroups[page].titles = [];
        pageGroups[page].titles!.push(value);
        break;
      case 'subtitle':
        if (!pageGroups[page].subtitles) pageGroups[page].subtitles = [];
        pageGroups[page].subtitles!.push(value);
        break;
      case 'text':
        if (!pageGroups[page].texts) pageGroups[page].texts = [];
        pageGroups[page].texts!.push(value);
        break;
      case 'ayah':
        if (!pageGroups[page].ayahs) pageGroups[page].ayahs = [];
        pageGroups[page].ayahs!.push(value);
        break;
      case 'footer':
        pageGroups[page].footer = value;
        break;
    }
  }

  // Convert page groups to KhwaterItems
  const pageKeys = Object.keys(pageGroups).sort((a, b) => {
    // Sort pages numerically (OneOne, OneTwo, TwoOne, etc.)
    const getPageNumber = (page: string) => {
      const first = wordToDigit(page.substring(0, page.length / 2));
      const second = wordToDigit(page.substring(page.length / 2));
      return parseInt(first) * 100 + parseInt(second);
    };
    return getPageNumber(a) - getPageNumber(b);
  });

  for (const pageKey of pageKeys) {
    const page = pageGroups[pageKey];

    // Determine order based on what content exists
    const order: ContentType[] = [];
    if (page.titles && page.titles.length > 0) order.push('titles');
    if (page.subtitles && page.subtitles.length > 0) order.push('subtitles');
    if (page.texts && page.texts.length > 0) order.push('texts');
    if (page.ayahs && page.ayahs.length > 0) order.push('ayahs');
    if (page.footer) order.push('footer'); // Footer is rendered as part of texts usually

    const item: KhwaterItem = {
      texts: page.texts || [],
      order,
    };

    if (page.titles && page.titles.length > 0) {
      item.titles = page.titles;
    }
    if (page.subtitles && page.subtitles.length > 0) {
      item.subtitles = page.subtitles;
    }
    if (page.ayahs && page.ayahs.length > 0) {
      item.ayahs = page.ayahs;
    }
    if (page.footer) {
      item.footer = page.footer;
    }

    items.push(item);
  }

  return items;
}

// Main conversion function
async function convertToJSON() {
  console.log('Starting conversion from Dart text files to JSON...\n');

  const allLists: Record<string, KhwaterItem[]> = {};

  for (const [chapterNum, filename] of Object.entries(CHAPTER_FILES)) {
    const filePath = path.join(SOURCE_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      continue;
    }

    console.log(`📖 Processing Chapter ${chapterNum}: ${filename}`);

    const content = fs.readFileSync(filePath, 'utf8');
    const items = parseDartFile(content, chapterNum);

    allLists[chapterNum] = items;

    console.log(`   ✓ Parsed ${items.length} items\n`);
  }

  // Create KhwaterData structure
  const khwaterData: KhwaterData = {
    version: '2.0.0',
    generated: new Date().toISOString(),
    totalLists: Object.keys(allLists).length,
    lists: allLists,
  };

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write to public/khwater-data.json
  const outputPath = path.join(OUTPUT_DIR, 'khwater-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(khwaterData, null, 2), 'utf8');

  console.log(`\n✅ Conversion complete!`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Total chapters: ${khwaterData.totalLists}`);
  console.log(`   Total items: ${Object.values(allLists).flat().length}`);
  console.log(`   Version: ${khwaterData.version}`);
  console.log(`   Generated: ${khwaterData.generated}\n`);
}

// Run conversion
convertToJSON().catch((error) => {
  console.error('❌ Conversion failed:', error);
  process.exit(1);
});
