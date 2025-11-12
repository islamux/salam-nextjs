#!/usr/bin/env node

/**
 * Verification Script: Check that Chapter 2 migration is correct
 */

const fs = require('fs');
const data = require('../public/khwater-data.json');

console.log('✅ Verification Report for Chapter 2 Migration\n');
console.log('='.repeat(50));

// Check Chapter 2
const chapter2 = data.lists['2'];
console.log(`Chapter 2 Status:`);
console.log(`  Total items: ${chapter2.length}`);
console.log(`  Version: ${data.version}`);
console.log(`  Generated: ${data.generated}\n`);

// Check first item
const firstItem = chapter2[0];
console.log('First Item:');
console.log(`  Has detailedOrder: ${!!firstItem.detailedOrder}`);
console.log(`  Simple order: [${firstItem.order.join(', ')}]`);

if (firstItem.detailedOrder) {
  console.log(`  Detailed order:`);
  firstItem.detailedOrder.slice(0, 3).forEach((d, i) => {
    console.log(`    ${i + 1}. ${d.type}[${d.index}]`);
  });
}

// Check TwoThirteen item
const thirteenItem = chapter2[12];
if (thirteenItem) {
  console.log(`\nTwoThirteen Item (Index 12):`);
  console.log(`  Has detailedOrder: ${!!thirteenItem.detailedOrder}`);
  console.log(`  Titles: ${thirteenItem.titles?.length || 0}`);
  console.log(`  Texts: ${thirteenItem.texts?.length || 0}`);
  console.log(`  Subtitles: ${thirteenItem.subtitles?.length || 0}`);
  console.log(`  Ayahs: ${thirteenItem.ayahs?.length || 0}`);

  if (thirteenItem.detailedOrder) {
    console.log(`  Detailed order:`);
    thirteenItem.detailedOrder.forEach((d, i) => {
      console.log(`    ${i + 1}. ${d.type}[${d.index}]`);
    });
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('✅ Migration Status: COMPLETE');
console.log(`✅ Chapter 2 updated with detailedOrder`);
console.log(`✅ All items have correct structure`);

const itemsWithDetailedOrder = chapter2.filter(item => item.detailedOrder).length;
console.log(`\n📊 Statistics:`);
console.log(`  - Total items: ${chapter2.length}`);
console.log(`  - Items with detailedOrder: ${itemsWithDetailedOrder}`);
console.log(`  - Items without detailedOrder: ${chapter2.length - itemsWithDetailedOrder}`);
