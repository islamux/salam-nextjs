/**
 * Fix Chapter 19 by adding proper order and detailedOrder arrays
 * The content is there but order arrays are empty
 */

const fs = require('fs');
const path = require('path');

// Chapter 19 order structure from elm_list_19_new_order.ts
const chapter19Orders = [
  // page 1
  {
    order: ['titles', 'texts', 'ayahs'],
    detailedOrder: [
      { type: 'titles', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
    ],
  },
  // page 2
  {
    order: ['subtitles', 'texts', 'ayahs', 'subtitles', 'texts', 'ayahs'],
    detailedOrder: [
      { type: 'subtitles', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'subtitles', index: 1 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
    ],
  },
  // page 3
  {
    order: ['texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 1 },
    ],
  },
  // page 4
  {
    order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 2 },
    ],
  },
  // page 5
  {
    order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    detailedOrder: [
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 2 },
    ],
  },
  // page 6
  {
    order: ['texts', 'ayahs'],
    detailedOrder: [
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
    ],
  },
  // page 7
  {
    order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 2 },
      { type: 'ayahs', index: 2 },
      { type: 'texts', index: 3 },
    ],
  },
  // page 8
  {
    order: ['ayahs', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 1 },
    ],
  },
  // page 9
  {
    order: ['texts'],
    detailedOrder: [
      { type: 'texts', index: 0 },
    ],
  },
  // page 10
  {
    order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 2 },
    ],
  },
  // page 11
  {
    order: ['ayahs', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 1 },
    ],
  },
  // page 12
  {
    order: ['ayahs', 'texts', 'ayahs', 'texts', 'ayahs'],
    detailedOrder: [
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 2 },
    ],
  },
  // page 13
  {
    order: ['texts', 'ayahs', 'texts', 'ayahs', 'texts', 'ayahs', 'subtitles', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 2 },
      { type: 'ayahs', index: 2 },
      { type: 'subtitles', index: 0 },
      { type: 'texts', index: 3 },
      { type: 'ayahs', index: 3 },
      { type: 'texts', index: 4 },
    ],
  },
  // page 14
  {
    order: ['ayahs', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 1 },
    ],
  },
  // page 15
  {
    order: ['subtitles', 'texts', 'ayahs', 'texts', 'ayahs', 'texts'],
    detailedOrder: [
      { type: 'subtitles', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 2 },
    ],
  },
  // page 16
  {
    order: ['titles', 'texts', 'ayahs', 'subtitles', 'texts', 'ayahs', 'texts', 'ayahs', 'texts', 'subtitles', 'ayahs', 'texts', 'ayahs'],
    detailedOrder: [
      { type: 'titles', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'subtitles', index: 0 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 2 },
      { type: 'ayahs', index: 2 },
      { type: 'texts', index: 3 },
      { type: 'subtitles', index: 1 },
      { type: 'ayahs', index: 3 },
      { type: 'texts', index: 4 },
      { type: 'ayahs', index: 4 },
    ],
  },
  // page 17
  {
    order: ['subtitles', 'ayahs', 'texts', 'subtitles', 'texts', 'ayahs', 'texts', 'subtitles', 'texts'],
    detailedOrder: [
      { type: 'subtitles', index: 0 },
      { type: 'ayahs', index: 0 },
      { type: 'texts', index: 0 },
      { type: 'subtitles', index: 1 },
      { type: 'texts', index: 1 },
      { type: 'ayahs', index: 1 },
      { type: 'texts', index: 2 },
      { type: 'subtitles', index: 2 },
      { type: 'texts', index: 3 },
    ],
  },
];

async function fixChapter19Order() {
  try {
    console.log('🔧 Fixing Chapter 19 order arrays...\n');

    // Read the current data file
    const dataPath = path.join(__dirname, '../public/khwater-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`✅ Loaded data file: ${dataPath}`);
    console.log(`   - Chapter 19 items: ${data.lists['19'].length}`);

    // Update Chapter 19 with proper order arrays
    data.lists['19'] = data.lists['19'].map((item, index) => {
      const orderData = chapter19Orders[index];
      if (orderData) {
        return {
          ...item,
          order: orderData.order,
          detailedOrder: orderData.detailedOrder,
        };
      }
      return item;
    });

    // Update metadata
    data.generated = new Date().toISOString();

    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

    console.log('\n✅ Chapter 19 order arrays fixed!');
    console.log(`   - Updated: ${data.lists['19'].length} items`);
    console.log(`   - New data file: ${dataPath}\n`);

    console.log('📝 Verification:');
    const item0 = data.lists['19'][0];
    console.log(`   Item 0 order: ${JSON.stringify(item0.order)}`);
    console.log(`   Item 0 detailedOrder: ${JSON.stringify(item0.detailedOrder)}`);

    console.log('\n🎉 Chapter 19 should now display text!');
    console.log('   Visit: http://localhost:3000/khwater/19\n');

  } catch (error) {
    console.error('❌ Error fixing Chapter 19:', error);
    process.exit(1);
  }
}

// Run the fix
fixChapter19Order();
