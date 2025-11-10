#!/usr/bin/env node

/**
 * Migration Script for Chapter 3
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DART_LIST_FILE = path.join(__dirname, '../FIX_MODEL_ISSUE/3/elm_list_3_new_order.dart');
const DART_TEXT_FILE = path.join(__dirname, '../FIX_MODEL_ISSUE/3/elm_text_ders_three.dart');
const OUTPUT_FILE = path.join(__dirname, '../public/khwater-data-chapter3-detailed.json');

/**
 * Parse Dart text file to extract variable mappings
 */
function parseDartTextFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const mappings = {};

  // Match static const String declarations
  const regex = /static const String (\w+)\s*=\s*"""([\s\S]*?)"""/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [, varName, textValue] = match;
    mappings[varName] = textValue.trim();
  }

  return mappings;
}

/**
 * Parse Dart list file to extract ElmModelNewOrder instances
 */
function parseDartListFile(filePath, textMappings) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const items = [];

  // Match ElmModelNewOrder instances
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

    // Extract order array
    item.order = extractOrderArray(body);

    // Generate detailed order
    item.detailedOrder = generateDetailedOrder(item);

    items.push(item);
  }

  return items;
}

/**
 * Extract array of values from Dart constructor body
 */
function extractArray(body, fieldName, textMappings) {
  const regex = new RegExp(`${fieldName}:\\s*\\[([\\s\\S]*?)\\]`, 'g');
  const match = regex.exec(body);

  if (!match) return undefined;

  const arrayContent = match[1];
  const items = [];

  // Match variable references (e.g., ElmTextDersThree.titleThreeOne)
  const varRegex = /ElmTextDersThree\.(\w+)/g;
  let varMatch;

  while ((varMatch = varRegex.exec(arrayContent)) !== null) {
    const varName = varMatch[1];
    const value = textMappings[varName];

    if (value !== undefined) {
      items.push(value);
    } else {
      console.warn(`Warning: Could not find mapping for ${varName}`);
    }
  }

  return items.length > 0 ? items : undefined;
}

/**
 * Extract string value from Dart constructor body
 */
function extractString(body, fieldName, textMappings) {
  const regex = new RegExp(`${fieldName}:\\s*ElmTextDersThree\\.(\\w+)`, 'g');
  const match = regex.exec(body);

  if (!match) return undefined;

  const varName = match[1];
  const value = textMappings[varName];

  if (value !== undefined) {
    return value;
  } else {
    console.warn(`Warning: Could not find mapping for ${varName}`);
    return undefined;
  }
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
    // Map to lowercase for JSON
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
 * Convert items to JSON structure
 */
function convertToJson(items, chapterId) {
  return {
    version: "3.0.0",
    generated: new Date().toISOString(),
    totalLists: 1,
    lists: {
      [chapterId]: items
    }
  };
}

/**
 * Main migration function
 */
function migrate() {
  try {
    console.log('Starting Chapter 3 migration...\n');

    // Step 1: Parse text mappings
    console.log('1. Parsing Dart text file...');
    const textMappings = parseDartTextFile(DART_TEXT_FILE);
    console.log(`   Found ${Object.keys(textMappings).length} text mappings\n`);

    // Step 2: Parse list file
    console.log('2. Parsing Dart list file...');
    const items = parseDartListFile(DART_LIST_FILE, textMappings);
    console.log(`   Found ${items.length} items\n`);

    // Step 3: Convert to JSON
    console.log('3. Converting to JSON...');
    const jsonData = convertToJson(items, '3');

    // Step 4: Save to file
    console.log('4. Saving to file...');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
    console.log(`   Saved to: ${OUTPUT_FILE}\n`);

    // Step 5: Summary
    console.log('✅ Migration complete!');
    console.log(`\nSummary:`);
    console.log(`  - Chapter: 3`);
    console.log(`  - Total items: ${items.length}`);
    console.log(`  - Items with titles: ${items.filter(i => i.titles).length}`);
    console.log(`  - Items with texts: ${items.filter(i => i.texts).length}`);
    console.log(`  - Items with ayahs: ${items.filter(i => i.ayahs).length}`);
    console.log(`  - Items with subtitles: ${items.filter(i => i.subtitles).length}`);

    // Example of first item
    if (items.length > 0) {
      console.log(`\nExample (Item 1 - Page 1):`);
      console.log(`  Order: [${items[0].order.join(', ')}]`);
      console.log(`  Detailed Order:`);
      items[0].detailedOrder.forEach((d, i) => {
        console.log(`    ${i + 1}. ${d.type}[${d.index}]`);
      });
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrate();
