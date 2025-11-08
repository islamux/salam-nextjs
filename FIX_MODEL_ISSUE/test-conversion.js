/**
 * Test Conversion: Chapter 1
 * Simple test to verify the conversion approach
 */

const fs = require('fs');
const path = require('path');

function extractChapter1() {
  const filePath = path.join(__dirname, 'elm_text_ders_one.dart');
  const content = fs.readFileSync(filePath, 'utf8');

  // Improved regex to match all patterns
  const matches = [];

  // Match titleOneOne (no number suffix)
  let titleMatch = content.match(/static const String titleOneOne = """([\s\S]*?)"""/);
  if (titleMatch) {
    matches.push({
      type: 'title',
      item: 1,
      sub: 1,
      text: titleMatch[1].trim(),
      field: 'titleOneOne'
    });
  }

  // Match other patterns: elmTextOneOne_1, ayahHadithOneTwo_1, etc.
  const pattern = /static const String (elmText|ayahHadith|elmTextText|subtitle|footer)One([A-Za-z]+)_([0-9]+) = """([\s\S]*?)"""/g;

  let match;
  while ((match = pattern.exec(content)) !== null) {
    const [, fieldType, subName, subNum, text] = match;

    // Map field types
    let type;
    if (fieldType === 'elmText' || fieldType === 'elmTextText') {
      type = 'text';
    } else if (fieldType === 'ayahHadith') {
      type = 'ayah';
    } else if (fieldType === 'subtitle') {
      type = 'subtitle';
    } else if (fieldType === 'footer') {
      type = 'footer';
    }

    // Extract item number from subName
    // e.g., "One" -> 1, "Two" -> 2, "Three" -> 3, etc.
    const itemNum = wordToNumber(subName);

    matches.push({
      type: type,
      item: itemNum,
      sub: parseInt(subNum),
      text: text.trim(),
      field: fieldType + subName + '_' + subNum
    });
  }

  return matches;
}

function wordToNumber(word) {
  const numbers = {
    'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5,
    'Six': 6, 'Seven': 7, 'Eight': 8, 'Nine': 9, 'Ten': 10,
    'Eleven': 11, 'Twelve': 12, 'Thirteen': 13, 'Fourteen': 14, 'Fifteen': 15,
    'Sixteen': 16, 'Seventeen': 17, 'Eighteen': 18, 'Nineteen': 19, 'Twenty': 20
  };
  return numbers[word] || 1;
}

function groupByItem(matches) {
  const groups = {};

  matches.forEach(match => {
    if (!groups[match.item]) {
      groups[match.item] = [];
    }
    groups[match.item].push(match);
  });

  // Sort by sub-number within each item
  Object.values(groups).forEach(group => {
    group.sort((a, b) => a.sub - b.sub);
  });

  return groups;
}

function buildOrderArray(items) {
  // For each position in the items array, determine the type
  return items.map(item => {
    if (item.type === 'title') return 'titles';
    if (item.type === 'subtitle') return 'subtitles';
    if (item.type === 'text') return 'texts';
    if (item.type === 'ayah') return 'ayahs';
    if (item.type === 'footer') return 'footer';
    return 'texts';
  });
}

// Run test
console.log('🧪 Testing Chapter 1 Conversion\n');
console.log('='.repeat(60));

const matches = extractChapter1();
console.log(`\n📊 Found ${matches.length} constants`);

const groups = groupByItem(matches);
console.log(`📚 Grouped into ${Object.keys(groups).length} items\n`);

// Build Next.js format
const result = [];

Object.entries(groups).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).forEach(([itemNum, items]) => {
  console.log(`\nItem ${itemNum}:`);
  items.forEach(item => {
    console.log(`  - ${item.type}: ${item.text.substring(0, 50)}...`);
  });

  // Group by type
  const grouped = {
    titles: [],
    subtitles: [],
    texts: [],
    ayahs: [],
    footer: null
  };

  items.forEach(item => {
    if (item.type === 'title') {
      grouped.titles.push(item.text);
    } else if (item.type === 'subtitle') {
      grouped.subtitles.push(item.text);
    } else if (item.type === 'text') {
      grouped.texts.push(item.text);
    } else if (item.type === 'ayah') {
      grouped.ayahs.push(item.text);
    } else if (item.type === 'footer') {
      grouped.footer = item.text;
    }
  });

  // Build order array
  const order = buildOrderArray(items);

  // Create item
  const item = {};
  if (grouped.titles.length > 0) item.titles = grouped.titles;
  if (grouped.subtitles.length > 0) item.subtitles = grouped.subtitles;
  if (grouped.texts.length > 0) item.texts = grouped.texts;
  if (grouped.ayahs.length > 0) item.ayahs = grouped.ayahs;
  if (grouped.footer) item.footer = grouped.footer;
  item.order = order;

  result.push(item);
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ Conversion successful!');
console.log(`\nGenerated ${result.length} items`);

// Show first item as example
console.log('\n📄 First item structure:');
console.log(JSON.stringify(result[0], null, 2));
