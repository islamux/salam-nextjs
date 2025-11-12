#!/usr/bin/env node

/**
 * Comprehensive Migration Script: Migrate ALL chapters with detailed order
 * Processes text and list files from FIX_MODEL_ISSUE directories
 *
 * Usage:
 *   node scripts/migrate-all-chapters-comprehensive.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TEXT_DIR = path.join(__dirname, '../FIX_MODEL_ISSUE/static/text');
const LIST_DIR = path.join(__dirname, '../FIX_MODEL_ISSUE/elm_lists');
const MAIN_DATA_FILE = path.join(__dirname, '../public/khwater-data.json');
const OUTPUT_FILE = path.join(__dirname, '../public/khwater-data-all-migrated.json');

/**
 * Map chapter names to numbers
 */
const CHAPTER_MAP = {
  'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
  'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
  'eleven': '11', 'twelve': '12', 'therteen': '13', 'thirteen': '13',
  'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
  'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'twenty_one': '21',
  'twenty_two': '22', 'twenty_three': '23', 'twenty_four': '24',
  'twenty_five': '25', 'twenty_six': '26', 'twenty_seven': '27',
  'pre': 'pre', 'final': 'final'
};

/**
 * Parse all text files
 */
function parseAllTextFiles() {
  const mappings = {};
  const files = fs.readdirSync(TEXT_DIR);

  console.log('1. Parsing all text files...\n');

  for (const file of files) {
    if (!file.endsWith('.dart')) continue;

    const filePath = path.join(TEXT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract chapter name from filename
    const match = file.match(/elm_text_ders_(\w+)\.dart/);
    if (!match) continue;

    const chapterKey = match[1];
    const chapterNum = CHAPTER_MAP[chapterKey];

    if (!chapterNum) continue;

    console.log(`  Processing ${file} (Chapter ${chapterNum})...`);

    // Parse text mappings
    const textRegex = /static const String (\w+)\s*=\s*"""([\s\S]*?)"""/g;
    let textMatch;

    while ((textMatch = textRegex.exec(content)) !== null) {
      const [, varName, textValue] = textMatch;
      const fullVarName = `${chapterKey}.${varName}`;
      mappings[fullVarName] = textValue.trim();
    }
  }

  console.log(`\n✅ Found ${Object.keys(mappings).length} text mappings across all chapters\n`);
  return mappings;
}

/**
 * Parse a single list file
 */
function parseListFile(fileName, textMappings) {
  const filePath = path.join(LIST_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  const items = [];

  // Extract chapter number from filename
  const match = fileName.match(/elm_list_(\d+)_new_order\.dart/);
  if (!match) return { chapterId: null, items: [] };

  const chapterId = match[1];

  // Parse ElmModelNewOrder instances
  const itemRegex = /ElmModelNewOrder\s*\(\s*([\s\S]*?)\s*\),/g;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(content)) !== null) {
    const body = itemMatch[1];
    const item = {};

    // Extract arrays
    item.titles = extractArray(body, 'titles', textMappings, chapterId);
    item.subtitles = extractArray(body, 'subtitles', textMappings, chapterId);
    item.texts = extractArray(body, 'texts', textMappings, chapterId);
    item.ayahs = extractArray(body, 'ayahs', textMappings, chapterId);
    item.footer = extractString(body, 'footer', textMappings, chapterId);

    // Extract order
    item.order = extractOrderArray(body);

    // Generate detailed order
    item.detailedOrder = generateDetailedOrder(item);

    items.push(item);
  }

  return { chapterId, items };
}

/**
 * Extract array of values from Dart constructor body
 */
function extractArray(body, fieldName, textMappings, chapterId) {
  const regex = new RegExp(`${fieldName}:\\s*\\[([\\s\\S]*?)\\]`, 'g');
  const match = regex.exec(body);

  if (!match) return undefined;

  const arrayContent = match[1];
  const items = [];

  // Match variable references - need to try multiple patterns
  const patterns = [
    /ElmTextDers\w+\.(\w+)/g,  // General pattern
    new RegExp(`ElmTextDers${chapterId}\\.(\\w+)`, 'g')  // Specific chapter
  ];

  for (const pattern of patterns) {
    let varMatch;
    while ((varMatch = pattern.exec(arrayContent)) !== null) {
      const varName = varMatch[1];
      // Try different key formats
      const keysToTry = [
        `${chapterId}.${varName}`,
        varName,
        `${getChapterKey(chapterId)}.${varName}`
      ];

      for (const key of keysToTry) {
        if (textMappings[key]) {
          items.push(textMappings[key]);
          break;
        }
      }
    }
  }

  return items.length > 0 ? items : undefined;
}

/**
 * Extract string value from Dart constructor body
 */
function extractString(body, fieldName, textMappings, chapterId) {
  const regex = new RegExp(`${fieldName}:\\s*ElmTextDers\\w+\\.(\\w+)`, 'g');
  const match = regex.exec(body);

  if (!match) return undefined;

  const varName = match[1];
  const keysToTry = [
    `${chapterId}.${varName}`,
    varName,
    `${getChapterKey(chapterId)}.${varName}`
  ];

  for (const key of keysToTry) {
    if (textMappings[key]) {
      return textMappings[key];
    }
  }

  console.warn(`Warning: Could not find mapping for ${varName} in chapter ${chapterId}`);
  return undefined;
}

/**
 * Get chapter key from number
 */
function getChapterKey(chapterNum) {
  const reverseMap = {
    '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten',
    '11': 'eleven', '12': 'twelve', '13': 'thirteen', '14': 'fourteen',
    '15': 'fifteen', '16': 'sixteen', '17': 'seventeen', '18': 'eighteen',
    '19': 'nineteen', '20': 'twenty', '21': 'twenty_one', '22': 'twenty_two',
    '23': 'twenty_three', '24': 'twenty_four', '25': 'twenty_five',
    '26': 'twenty_six', '27': 'twenty_seven'
  };
  return reverseMap[chapterNum] || chapterNum;
}

/**
 * Extract order array from Dart constructor body
 */
function extractOrderArray(body) {
  const orderMatch = body.match(/order:\s*\[([\s\S]*?)\]/g);
  if (!orderMatch) return [];

  const orderStr = orderMatch[0];
  const orderItems = orderStr.match(/EnOrder\.\w+/g) || [];

  return orderItems.map(item => {
    const type = item.replace('EnOrder.', '');
    return type.toLowerCase();
  });
}

/**
 * Generate detailed order from simple order
 */
function generateDetailedOrder(item) {
  const detailedOrder = [];
  const counters = {
    titles: 0,
    subtitles: 0,
    texts: 0,
    ayahs: 0,
    footer: 0,
  };

  for (const type of item.order) {
    const index = counters[type] !== undefined ? counters[type] : 0;
    detailedOrder.push({
      type: type,
      index: index
    });
    if (counters[type] !== undefined) {
      counters[type]++;
    }
  }

  return detailedOrder;
}

/**
 * Main migration function
 */
function migrateAll() {
  try {
    console.log('='.repeat(70));
    console.log('🚀 COMPREHENSIVE MIGRATION - ALL CHAPTERS');
    console.log('='.repeat(70));
    console.log('');

    // Load existing data
    console.log('Loading existing khwater-data.json...');
    const mainData = JSON.parse(fs.readFileSync(MAIN_DATA_FILE, 'utf-8'));
    console.log(`✅ Loaded ${Object.keys(mainData.lists).length} existing chapters\n`);

    // Parse all text files
    const textMappings = parseAllTextFiles();

    // Parse all list files
    console.log('2. Parsing all list files...\n');
    const migratedChapters = {};
    const files = fs.readdirSync(LIST_DIR).filter(f => f.endsWith('.dart'));

    for (const file of files) {
      console.log(`  Processing ${file}...`);
      const { chapterId, items } = parseListFile(file, textMappings);

      if (chapterId && items.length > 0) {
        migratedChapters[chapterId] = items;
        console.log(`    ✅ Chapter ${chapterId}: ${items.length} items migrated`);
      } else {
        console.log(`    ⚠️  Skipped (no items found)`);
      }
    }

    // Merge with existing data
    console.log('\n3. Merging migrated chapters with existing data...\n');
    const updatedLists = { ...mainData.lists };

    let migratedCount = 0;
    for (const [chapterId, items] of Object.entries(migratedChapters)) {
      updatedLists[chapterId] = items;
      migratedCount += items.length;
      console.log(`  ✅ Chapter ${chapterId}: Updated with ${items.length} items (detailedOrder)`);
    }

    // Create final data structure
    const finalData = {
      version: '3.0.0',
      generated: new Date().toISOString(),
      totalLists: Object.keys(updatedLists).length,
      lists: updatedLists
    };

    // Save to file
    console.log('\n4. Saving migrated data...\n');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
    console.log(`✅ Saved to: ${OUTPUT_FILE}\n`);

    // Summary
    console.log('='.repeat(70));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Total chapters: ${Object.keys(updatedLists).length}`);
    console.log(`Newly migrated chapters: ${Object.keys(migratedChapters).length}`);
    console.log(`Total items migrated: ${migratedCount}`);
    console.log('');

    console.log('Chapter Status:');
    for (let i = 1; i <= 29; i++) {
      const chapterId = i.toString();
      const items = updatedLists[chapterId] || [];
      const withDetailed = items.filter(item => item.detailedOrder).length;
      const withoutDetailed = items.length - withDetailed;

      if (withDetailed > 0) {
        console.log(`  Chapter ${i}: ${items.length} items (${withDetailed} detailed) ✅`);
      } else {
        console.log(`  Chapter ${i}: ${items.length} items (simple order) ⚠️`);
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('✅ COMPREHENSIVE MIGRATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log('Next Steps:');
    console.log('  1. Review the migrated data in khwater-data-all-migrated.json');
    console.log('  2. Test rendering for a few migrated chapters');
    console.log('  3. Replace main khwater-data.json if satisfied:');
    console.log('     cp public/khwater-data-all-migrated.json public/khwater-data.json');
    console.log('  4. Build and deploy: NEXT_DISABLE_TURBOPACK=1 pnpm build');
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration
migrateAll();
