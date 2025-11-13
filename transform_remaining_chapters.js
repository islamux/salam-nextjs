#!/usr/bin/env node

/**
 * Batch Transformation Script for Remaining Chapters (18-28)
 * Transforms JSON files from plural arrays to singular fields
 */

const fs = require('fs');
const path = require('path');

const CHAPTERS_DIR = '/media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam-nextjs/public/khwater';
const START_CHAPTER = 18;
const END_CHAPTER = 28;

function transformChapter(chapterNum) {
  const filePath = path.join(CHAPTERS_DIR, `${chapterNum}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Chapter ${chapterNum} not found, skipping...`);
    return { success: false, error: 'File not found' };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    const transformedItems = [];
    let validItems = 0;

    for (const item of data.items) {
      if (!item.order || item.order.length === 0) {
        continue; // Skip empty items
      }

      // Process each item in order
      for (const type of item.order) {
        let value = null;

        // Get value from appropriate field
        switch (type) {
          case 'titles':
            if (item.titles && item.titles.length > 0) value = item.titles[0];
            break;
          case 'title':
            if (item.title) value = item.title;
            break;
          case 'subtitles':
            if (item.subtitles && item.subtitles.length > 0) value = item.subtitles[0];
            break;
          case 'subtitle':
            if (item.subtitle) value = item.subtitle;
            break;
          case 'texts':
            if (item.texts && item.texts.length > 0) value = item.texts[0];
            break;
          case 'text':
            if (item.text) value = item.text;
            break;
          case 'ayahs':
            if (item.ayahs && item.ayahs.length > 0) value = item.ayahs[0];
            break;
          case 'ayah':
            if (item.ayah) value = item.ayah;
            break;
          case 'footer':
            if (item.footer) value = item.footer;
            break;
        }

        if (value && value.trim()) {
          transformedItems.push({
            [type.endsWith('s') ? type.slice(0, -1) : type]: value,
            order: [type.endsWith('s') ? type.slice(0, -1) : type]
          });
          validItems++;
        }
      }
    }

    // Create transformed data
    const transformedData = {
      items: transformedItems,
      metadata: {
        ...data.metadata,
        totalItems: validItems
      }
    };

    // Write transformed file
    fs.writeFileSync(filePath, JSON.stringify(transformedData, null, 2), 'utf8');

    console.log(`✅ Chapter ${chapterNum}: ${data.items.length} → ${validItems} items (${Math.round((validItems / data.items.length) * 100)}% increase)`);
    return { success: true, original: data.items.length, transformed: validItems };
  } catch (error) {
    console.error(`❌ Chapter ${chapterNum} error:`, error.message);
    return { success: false, error: error.message };
  }
}

function main() {
  console.log('🚀 Starting batch transformation of chapters', START_CHAPTER, 'to', END_CHAPTER);
  console.log('=' .repeat(60));

  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let chapter = START_CHAPTER; chapter <= END_CHAPTER; chapter++) {
    const result = transformChapter(chapter);
    results.push({ chapter, ...result });
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('=' .repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total chapters: ${END_CHAPTER - START_CHAPTER + 1}`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('\n✨ Batch transformation complete!');
}

if (require.main === module) {
  main();
}

module.exports = { transformChapter };
