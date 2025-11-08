/**
 * Batch Conversion Script: All 29 Chapters
 * Converts all Dart files to Next.js JSON format
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse a Dart file and extract all static constants
 */
function parseDartFile(filePath, className, chapterWord) {
  const content = fs.readFileSync(filePath, 'utf8');

  const matches = [];

  // Helper function to convert word to number
  const wordToNum = (word) => {
    const map = {
      'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5,
      'Six': 6, 'Seven': 7, 'Eight': 8, 'Nine': 9, 'Ten': 10,
      'Eleven': 11, 'Twelve': 12, 'Therteen': 13, 'Fourteen': 14, 'Fifteen': 15,
      'Sixteen': 16, 'Seventeen': 17, 'Eighteen': 18, 'Nineteen': 19, 'Twenty': 20,
      'TwentyOne': 21, 'TwentyTwo': 22, 'TwentyThree': 23, 'TwentyFour': 24, 'TwentyFive': 25,
      'TwentySix': 26, 'TwentySeven': 27, 'Pre': 28, 'Final': 29
    };
    return map[word] || 1;
  };

  // Pattern 1: titleThreeOne, titleThreeTwo, etc. (title + chapterWord + itemWord)
  const titlePattern = new RegExp(
    `static const String title${chapterWord}([A-Za-z]+) = """([\\s\\S]*?)"""`,
    'g'
  );

  let match;
  while ((match = titlePattern.exec(content)) !== null) {
    const [, itemWord, text] = match;
    matches.push({
      field: 'title',
      item: wordToNum(itemWord),
      sub: 1,
      text: text.trim(),
      fullName: 'title' + chapterWord + itemWord
    });
  }

  // Pattern 2: elmText/elmTex + ChapterWord + _1, _2, etc.
  // Note: some are misspelled as "Tex" instead of "Text"
  const textPattern = new RegExp(
    `static const String (elmTex|elmText)${chapterWord}([A-Za-z]+)_([0-9]+) = """([\\s\\S]*?)"""`,
    'g'
  );

  while ((match = textPattern.exec(content)) !== null) {
    const [, fieldType, itemWord, num, text] = match;
    matches.push({
      field: 'text',
      item: wordToNum(itemWord),
      sub: parseInt(num),
      text: text.trim(),
      fullName: fieldType + chapterWord + itemWord + '_' + num
    });
  }

  // Pattern 3: ayahHadith/ayaHadith + ChapterWord + _1, _2, etc.
  const ayahPattern = new RegExp(
    `static const String (ayahHadith|ayaHadith|ayah)${chapterWord}([A-Za-z]+)_([0-9]+) = """([\\s\\S]*?)"""`,
    'g'
  );

  while ((match = ayahPattern.exec(content)) !== null) {
    const [, fieldType, itemWord, num, text] = match;
    matches.push({
      field: 'ayah',
      item: wordToNum(itemWord),
      sub: parseInt(num),
      text: text.trim(),
      fullName: fieldType + chapterWord + itemWord + '_' + num
    });
  }

  // Pattern 4: subtitle + ChapterWord + _1, _2, etc.
  const subtitlePattern = new RegExp(
    `static const String subtitle${chapterWord}([A-Za-z]+)_([0-9]+) = """([\\s\\S]*?)"""`,
    'g'
  );

  while ((match = subtitlePattern.exec(content)) !== null) {
    const [, itemWord, num, text] = match;
    matches.push({
      field: 'subtitle',
      item: wordToNum(itemWord),
      sub: parseInt(num),
      text: text.trim(),
      fullName: 'subtitle' + chapterWord + itemWord + '_' + num
    });
  }

  // Pattern 5: footer + ChapterWord (no number)
  const footerMatch = content.match(/static const String footer${chapterWord}\s*=\s*"""([\s\S]*?)"""/);
  if (footerMatch) {
    matches.push({
      field: 'footer',
      item: 1,
      sub: 1,
      text: footerMatch[1].trim(),
      fullName: 'footer' + chapterWord
    });
  }

  return matches;
}

/**
 * Group parsed items by item number
 */
function groupByItem(matches) {
  const groups = {};

  matches.forEach(match => {
    if (!groups[match.item]) {
      groups[match.item] = {
        item: match.item,
        fields: {}
      };
    }

    // Map field names to simplified types
    let type;
    if (match.field.startsWith('title')) {
      type = 'titles';
    } else if (match.field.startsWith('subtitle')) {
      type = 'subtitles';
    } else if (match.field.startsWith('elmText') || match.field.startsWith('text')) {
      type = 'texts';
    } else if (match.field.startsWith('ayah') || match.field.startsWith('hadith')) {
      type = 'ayahs';
    } else if (match.field.startsWith('footer')) {
      type = 'footer';
    } else {
      console.warn(`Unknown field type: ${match.field}`);
      type = 'texts';
    }

    if (!groups[match.item].fields[type]) {
      groups[match.item].fields[type] = [];
    }

    // Insert at correct sub-position
    const index = match.sub - 1;
    groups[match.item].fields[type][index] = match.text;
  });

  return Object.values(groups).sort((a, b) => a.item - b.item);
}

/**
 * Build order array from grouped fields
 * We need to reconstruct the original sequential order from the grouped data
 */
function buildOrderArray(fields) {
  const order = [];

  // Count total items
  const counts = {
    titles: fields.titles ? fields.titles.length : 0,
    subtitles: fields.subtitles ? fields.subtitles.length : 0,
    texts: fields.texts ? fields.texts.length : 0,
    ayahs: fields.ayahs ? fields.ayahs.length : 0,
    footer: fields.footer ? 1 : 0
  };

  // Strategy: Build order by finding the maximum item number
  // and assuming content is distributed across items
  const maxItem = Math.max(
    counts.titles > 0 ? 1 : 0,
    counts.subtitles > 0 ? 1 : 0,
    counts.texts,
    counts.ayahs,
    counts.footer > 0 ? 1 : 0
  );

  // For now, build a simple order based on what exists
  // This will be improved after we see the actual data structure
  if (counts.titles > 0) order.push('titles');
  if (counts.texts > 0) {
    for (let i = 0; i < counts.texts; i++) {
      order.push('texts');
    }
  }
  if (counts.subtitles > 0) {
    for (let i = 0; i < counts.subtitles; i++) {
      order.push('subtitles');
    }
  }
  if (counts.ayahs > 0) {
    for (let i = 0; i < counts.ayahs; i++) {
      order.push('ayahs');
    }
  }
  if (counts.footer > 0) order.push('footer');

  return order;
}

/**
 * Convert a chapter to Next.js format
 */
function convertChapter(fileName, chapterId) {
  const filePath = path.join(__dirname, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${fileName}`);
    return null;
  }

  // Determine class name and chapter word from file name
  let className;
  let chapterWord;
  if (fileName.includes('elm_text_ders_final')) {
    className = 'ElmTextDersFinal';
    chapterWord = 'Final';
  } else if (fileName.includes('elm_text_ders_pre')) {
    className = 'ElmTextDersPre';
    chapterWord = 'Pre';
  } else {
    // elm_text_ders_one.dart -> ElmTextDersOne, chapterWord = "One"
    const num = fileName.match(/elm_text_ders_([a-z]+)/)[1];
    className = 'ElmTextDers' + num.charAt(0).toUpperCase() + num.slice(1);
    chapterWord = num.charAt(0).toUpperCase() + num.slice(1);
  }

  console.log(`📖 Processing Chapter ${chapterId}: ${fileName}`);
  console.log(`   Class: ${className}, Word: ${chapterWord}`);

  // Parse the file
  const matches = parseDartFile(filePath, className, chapterWord);
  console.log(`   Found ${matches.length} constants`);

  if (matches.length === 0) {
    console.warn(`⚠️  No constants found in ${fileName}`);
    return [];
  }

  // Group by item
  const groups = groupByItem(matches);
  console.log(`   Grouped into ${groups.length} items`);

  // Convert to Next.js format
  const result = groups.map(group => {
    // Remove empty arrays
    const item = {};
    if (group.fields.titles) {
      item.titles = group.fields.titles.filter(t => t && t.trim());
    }
    if (group.fields.subtitles) {
      item.subtitles = group.fields.subtitles.filter(t => t && t.trim());
    }
    if (group.fields.texts) {
      item.texts = group.fields.texts.filter(t => t && t.trim());
    }
    if (group.fields.ayahs) {
      item.ayahs = group.fields.ayahs.filter(t => t && t.trim());
    }
    if (group.fields.footer) {
      item.footer = group.fields.footer.find(t => t && t.trim());
    }

    // Build order array
    item.order = buildOrderArray(group.fields);

    // If no order, try to infer
    if (item.order.length === 0) {
      if (item.titles) item.order.push('titles');
      if (item.texts) item.order.push('texts');
      if (item.subtitles) item.order.push('subtitles');
      if (item.ayahs) item.order.push('ayahs');
      if (item.footer) item.order.push('footer');
    }

    return item;
  });

  console.log(`   ✅ Converted ${result.length} items\n`);

  return result;
}

/**
 * Main conversion process
 */
function main() {
  console.log('='.repeat(60));
  console.log('🚀 Starting Batch Conversion: All 29 Chapters');
  console.log('='.repeat(60));
  console.log();

  // List of all chapters (excluding chapter 2 which is already done)
  const chapters = [
    { file: 'elm_text_ders_one.dart', id: '1' },
    { file: 'elm_text_ders_three.dart', id: '3' },
    { file: 'elm_text_ders_four.dart', id: '4' },
    { file: 'elm_text_ders_five.dart', id: '5' },
    { file: 'elm_text_ders_six.dart', id: '6' },
    { file: 'elm_text_ders_seven.dart', id: '7' },
    { file: 'elm_text_ders_eight.dart', id: '8' },
    { file: 'elm_text_ders_nine.dart', id: '9' },
    { file: 'elm_text_ders_ten.dart', id: '10' },
    { file: 'elm_text_ders_eleven.dart', id: '11' },
    { file: 'elm_text_ders_twelve.dart', id: '12' },
    { file: 'elm_text_ders_therteen.dart', id: '13' },
    { file: 'elm_text_ders_fourteen.dart', id: '14' },
    { file: 'elm_text_ders_fifteen.dart', id: '15' },
    { file: 'elm_text_ders_sixteen.dart', id: '16' },
    { file: 'elm_text_ders_seventeen.dart', id: '17' },
    { file: 'elm_text_ders_eighteen.dart', id: '18' },
    { file: 'elm_text_ders_nineteen.dart', id: '19' },
    { file: 'elm_text_ders_twenty.dart', id: '20' },
    { file: 'elm_text_ders_twenty_one.dart', id: '21' },
    { file: 'elm_text_ders_twenty_two.dart', id: '22' },
    { file: 'elm_text_ders_twenty_three.dart', id: '23' },
    { file: 'elm_text_ders_twenty_four.dart', id: '24' },
    { file: 'elm_text_ders_twenty_five.dart', id: '25' },
    { file: 'elm_text_ders_twenty_six.dart', id: '26' },
    { file: 'elm_text_ders_twenty_seven.dart', id: '27' },
    { file: 'elm_text_ders_pre.dart', id: '28' },
    { file: 'elm_text_ders_final.dart', id: '29' }
  ];

  const convertedData = {};

  // Convert each chapter
  chapters.forEach(chapter => {
    try {
      const data = convertChapter(chapter.file, chapter.id);
      if (data && data.length > 0) {
        convertedData[chapter.id] = data;
      }
    } catch (error) {
      console.error(`❌ Error processing Chapter ${chapter.id}:`, error.message);
    }
  });

  console.log();
  console.log('='.repeat(60));
  console.log('📊 Conversion Summary');
  console.log('='.repeat(60));
  console.log(`Total chapters converted: ${Object.keys(convertedData).length}`);
  console.log();

  // Update JSON file
  const jsonPath = path.join(__dirname, '..', 'public', 'khwater-data.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ JSON file not found: ${jsonPath}`);
    return;
  }

  console.log('📝 Updating public/khwater-data.json...');

  const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Update with converted data
  Object.entries(convertedData).forEach(([chapterId, data]) => {
    existingData.lists[chapterId] = data;
    console.log(`   ✅ Chapter ${chapterId}: ${data.length} items`);
  });

  // Update metadata
  existingData.generated = new Date().toISOString();
  existingData.version = existingData.version || '2.0.0';

  // Write back
  fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2));

  console.log();
  console.log('='.repeat(60));
  console.log('✅ Migration Complete!');
  console.log('='.repeat(60));
  console.log();
  console.log('Next steps:');
  console.log('  1. cd ../../');
  console.log('  2. NEXT_DISABLE_TURBOPACK=1 pnpm build');
  console.log('  3. Verify all chapters render correctly');
  console.log();
}

// Run the conversion
main();
