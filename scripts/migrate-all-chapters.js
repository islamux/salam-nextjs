#!/usr/bin/env node

/**
 * Migration Script: Migrate all chapters with detailed order
 * This script will:
 * 1. Migrate chapters with Dart files (1, 2) using detailed order
 * 2. Keep other chapters with simple order (backward compatible)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MAIN_DATA_FILE = path.join(__dirname, '../public/khwater-data.json');
const DART_DIR = path.join(__dirname, '../FIX_MODEL_ISSUE');
const OUTPUT_FILE = path.join(__dirname, '../public/khwater-data-updated.json');

/**
 * Migrate a single chapter from Dart file
 */
function migrateChapterFromDart(chapterNum) {
  const chapterDir = path.join(DART_DIR, chapterNum.toString());
  const listFile = path.join(chapterDir, 'elm_list_new_order.dart');
  const textFile = path.join(chapterDir, `elm_text_ders_${chapterNum === 1 ? 'one' : 'two'}.dart`);

  // Check if files exist
  if (!fs.existsSync(listFile) || !fs.existsSync(textFile)) {
    console.log(`  ⚠️  Chapter ${chapterNum}: Dart files not found, skipping`);
    return null;
  }

  console.log(`  📝 Chapter ${chapterNum}: Migrating from Dart...`);

  // Parse text mappings
  const textContent = fs.readFileSync(textFile, 'utf-8');
  const mappings = parseTextMappings(textContent);

  // Parse list file
  const listContent = fs.readFileSync(listFile, 'utf-8');
  const items = parseListContent(listContent, mappings);

  console.log(`     ✅ Chapter ${chapterNum}: ${items.length} items migrated`);

  return items;
}

/**
 * Parse text mappings from Dart text file
 */
function parseTextMappings(content) {
  const mappings = {};
  const regex = /static const String (\w+)\s*=\s*"""([\s\S]*?)"""/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [, varName, textValue] = match;
    mappings[varName] = textValue.trim();
  }

  return mappings;
}

/**
 * Parse list content and extract items
 */
function parseListContent(content, textMappings) {
  const items = [];
  const regex = /ElmModelNewOrder\s*\(\s*([\s\S]*?)\s*\),/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const body = match[1];
    const item = {};

    // Extract arrays
    item.titles = extractArray(body, 'titles', textMappings);
    item.subtitles = extractArray(body, 'subtitles', textMappings);
    item.texts = extractArray(body, 'texts', textMappings);
    item.ayahs = extractArray(body, 'ayahs', textMappings);
    item.footer = extractString(body, 'footer', textMappings);

    // Extract order
    item.order = extractOrderArray(body);

    // Generate detailed order
    item.detailedOrder = generateDetailedOrder(item);

    items.push(item);
  }

  return items;
}

function extractArray(body, fieldName, textMappings) {
  const regex = new RegExp(`${fieldName}:\\s*\\[([\\s\\S]*?)\\]`, 'g');
  const match = regex.exec(body);

  if (!match) return undefined;

  const arrayContent = match[1];
  const items = [];
  const varRegex = /ElmTextDers\w+\.(\w+)/g;
  let varMatch;

  while ((varMatch = varRegex.exec(arrayContent)) !== null) {
    const varName = varMatch[1];
    const value = textMappings[varName];
    if (value !== undefined) items.push(value);
  }

  return items.length > 0 ? items : undefined;
}

function extractString(body, fieldName, textMappings) {
  const regex = new RegExp(`${fieldName}:\\s*ElmTextDers\\w+\\.(\\w+)`, 'g');
  const match = regex.exec(body);
  if (!match) return undefined;
  return textMappings[match[1]];
}

function extractOrderArray(body) {
  const orderMatch = body.match(/order:\s*\[([\s\S]*?)\]/g);
  if (!orderMatch) return [];
  const orderStr = orderMatch[0];
  const orderItems = orderStr.match(/EnOrder\.\w+/g) || [];
  return orderItems.map(item => item.replace('EnOrder.', '').toLowerCase());
}

function generateDetailedOrder(item) {
  const detailedOrder = [];
  const counters = { titles: 0, subtitles: 0, texts: 0, ayahs: 0, footer: 0 };

  for (const type of item.order) {
    const index = counters[type] !== undefined ? counters[type] : 0;
    detailedOrder.push({ type, index });
    if (counters[type] !== undefined) counters[type]++;
  }

  return detailedOrder;
}

/**
 * Main migration function
 */
function migrateAll() {
  console.log('🚀 Starting Full Migration of All Chapters\n');
  console.log('='.repeat(60));

  // Load main data
  console.log('\n1. Loading main khwater-data.json...');
  const mainData = JSON.parse(fs.readFileSync(MAIN_DATA_FILE, 'utf-8'));
  console.log(`   ✅ Loaded ${Object.keys(mainData.lists).length} chapters`);

  // Migrate chapters with Dart files
  console.log('\n2. Migrating chapters with Dart files...');
  const chaptersToMigrate = [1, 2]; // We have Dart files for these

  for (const chapterNum of chaptersToMigrate) {
    const items = migrateChapterFromDart(chapterNum);
    if (items) {
      mainData.lists[chapterNum.toString()] = items;
    }
  }

  // Update metadata
  mainData.version = '3.0.0';
  mainData.generated = new Date().toISOString();

  // Save updated file
  console.log('\n3. Saving updated data...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mainData, null, 2));
  console.log(`   ✅ Saved to: ${OUTPUT_FILE}`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Migration Summary:');

  for (const [chapterId, items] of Object.entries(mainData.lists)) {
    const withDetailed = items.filter(item => item.detailedOrder).length;
    const withoutDetailed = items.length - withDetailed;
    const status = withDetailed > 0 ? '✅ Detailed Order' : '⚠️  Simple Order';
    console.log(`   Chapter ${chapterId}: ${items.length} items (${withDetailed} detailed, ${withoutDetailed} simple) - ${status}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Migration Complete!');
  console.log('\nNext Steps:');
  console.log('  1. Review the migrated data');
  console.log('  2. Test rendering for migrated chapters');
  console.log('  3. Replace main khwater-data.json if satisfied');
  console.log('  4. Build and deploy the application\n');
}

// Run migration
migrateAll();
