#!/usr/bin/env node

/**
 * Transform Chapter 21 from Dart source to JSON
 * Maintains the EXACT order from Dart file
 */

const fs = require('fs');
const path = require('path');

// Read Dart source file
const dartFilePath = path.join(__dirname, 'texts-original/text/elm_text_ders_twenty_one.dart');
const dartContent = fs.readFileSync(dartFilePath, 'utf8');

// Extract content in the EXACT order they appear in the Dart file
const items = [];
const lines = dartContent.split('\n');

let currentConstant = null;
let currentValue = '';
let currentType = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if this line starts a new constant
  const titleMatch = line.match(/static const (?:String )?(title[A-Z][^=]+)= """/);
  const textMatch = line.match(/static const (?:String )?(elmText[A-Z][^=]+)= """/);
  const ayahMatch = line.match(/static const (?:String )?(ayahHadith[A-Z][^=]+)= """/);
  const subtitleMatch = line.match(/static const (?:String )?(subtitle[A-Z][^=]+)= """/);
  const footerMatch = line.match(/static const (?:String )?(footer[A-Z][^=]+)= """/);

  if (titleMatch) {
    // Save previous constant if exists
    if (currentConstant) {
      const item = createItemFromConstant(currentType, currentValue.trim());
      if (item) items.push(item);
    }
    currentConstant = { type: 'title', name: titleMatch[1].trim() };
    currentType = 'title';
    currentValue = line.substring(line.indexOf('"""') + 3);
  } else if (textMatch) {
    // Save previous constant if exists
    if (currentConstant) {
      const item = createItemFromConstant(currentType, currentValue.trim());
      if (item) items.push(item);
    }
    currentConstant = { type: 'text', name: textMatch[1].trim() };
    currentType = 'text';
    currentValue = line.substring(line.indexOf('"""') + 3);
  } else if (ayahMatch) {
    // Save previous constant if exists
    if (currentConstant) {
      const item = createItemFromConstant(currentType, currentValue.trim());
      if (item) items.push(item);
    }
    currentConstant = { type: 'ayah', name: ayahMatch[1].trim() };
    currentType = 'ayah';
    currentValue = line.substring(line.indexOf('"""') + 3);
  } else if (subtitleMatch) {
    // Save previous constant if exists
    if (currentConstant) {
      const item = createItemFromConstant(currentType, currentValue.trim());
      if (item) items.push(item);
    }
    currentConstant = { type: 'subtitle', name: subtitleMatch[1].trim() };
    currentType = 'subtitle';
    currentValue = line.substring(line.indexOf('"""') + 3);
  } else if (footerMatch) {
    // Save previous constant if exists
    if (currentConstant) {
      const item = createItemFromConstant(currentType, currentValue.trim());
      if (item) items.push(item);
    }
    currentConstant = { type: 'footer', name: footerMatch[1].trim() };
    currentType = 'footer';
    currentValue = line.substring(line.indexOf('"""') + 3);
  } else if (currentConstant && line.includes('"""')) {
    // End of current constant
    currentValue += '\n' + line.substring(0, line.indexOf('"""'));
    const item = createItemFromConstant(currentType, currentValue.trim());
    if (item) items.push(item);
    currentConstant = null;
    currentValue = '';
    currentType = null;
  } else if (currentConstant) {
    // Continuation of current constant
    currentValue += '\n' + line;
  }
}

// Helper function to create item from constant
function createItemFromConstant(constant, value) {
  if (constant === 'title') {
    return {
      title: value,
      order: ['title']
    };
  } else if (constant === 'text') {
    return {
      text: value,
      order: ['text']
    };
  } else if (constant === 'ayah') {
    return {
      ayah: value,
      order: ['ayah']
    };
  } else if (constant === 'subtitle') {
    return {
      subtitle: value,
      order: ['subtitle']
    };
  } else if (constant === 'footer') {
    return {
      footer: value,
      order: ['footer']
    };
  }
  return null;
}

// Create JSON structure
const jsonData = {
  items: items,
  metadata: {
    id: '21',
    version: '3.1.0',
    generated: new Date().toISOString(),
    totalItems: items.length
  }
};

// Write to file
const outputPath = path.join(__dirname, 'public/khwater/21.json');
fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');

console.log('✅ Chapter 21 transformation complete!');
console.log(`   Total items: ${items.length}`);
console.log(`   Output: ${outputPath}`);

// Summary by type
const titleCount = items.filter(item => item.title).length;
const subtitleCount = items.filter(item => item.subtitle).length;
const textCount = items.filter(item => item.text).length;
const ayahCount = items.filter(item => item.ayah).length;
const footerCount = items.filter(item => item.footer).length;

console.log('\n📊 Content breakdown:');
console.log(`   Titles: ${titleCount}`);
console.log(`   Subtitles: ${subtitleCount}`);
console.log(`   Texts: ${textCount}`);
console.log(`   Ayahs: ${ayahCount}`);
console.log(`   Footers: ${footerCount}`);
console.log(`   Total: ${items.length}`);
