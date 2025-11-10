#!/usr/bin/env node

/**
 * Quick migration for Chapter 1
 */

const fs = require('fs');
const path = require('path');

const textFile = path.join(__dirname, '../FIX_MODEL_ISSUE/1/elm_text_ders_one.dart');
const listFile = path.join(__dirname, '../FIX_MODEL_ISSUE/1/elm_list_1_new_order.dart');

// Parse text mappings
console.log('Parsing Chapter 1...');
const textContent = fs.readFileSync(textFile, 'utf-8');
const mappings = {};

let match;
const regex = /static const String (\w+)\s*=\s*"""([\s\S]*?)"""/g;
while ((match = regex.exec(textContent)) !== null) {
  const [, varName, textValue] = match;
  mappings[varName] = textValue.trim();
}

console.log(`Found ${Object.keys(mappings).length} text mappings`);

// Parse list and create simplified output
const listContent = fs.readFileSync(listFile, 'utf-8');
const items = [];

const itemRegex = /ElmModelNewOrder\s*\(([\s\S]*?)\)/g;
while ((match = itemRegex.exec(listContent)) !== null) {
  const body = match[1];
  const item = { order: [] };

  // Extract titles
  const titleMatch = body.match(/titles:\s*\[([\s\S]*?)\]/);
  if (titleMatch) {
    item.titles = [];
    const varRefs = titleMatch[1].match(/ElmTextDersOne\.(\w+)/g) || [];
    varRefs.forEach(ref => {
      const varName = ref.replace('ElmTextDersOne.', '');
      if (mappings[varName]) item.titles.push(mappings[varName]);
    });
  }

  // Extract texts
  const textMatches = body.match(/texts:\s*\[([\s\S]*?)\]/g) || [];
  if (textMatches.length > 0) {
    item.texts = [];
    textMatches.forEach(match => {
      const varRefs = match.match(/ElmTextDersOne\.(\w+)/g) || [];
      varRefs.forEach(ref => {
        const varName = ref.replace('ElmTextDersOne.', '');
        if (mappings[varName]) item.texts.push(mappings[varName]);
      });
    });
  }

  // Extract ayahs
  const ayahMatch = body.match(/ayahs:\s*\[([\s\S]*?)\]/);
  if (ayahMatch) {
    item.ayahs = [];
    const varRefs = ayahMatch[1].match(/ElmTextDersOne\.(\w+)/g) || [];
    varRefs.forEach(ref => {
      const varName = ref.replace('ElmTextDersOne.', '');
      if (mappings[varName]) item.ayahs.push(mappings[varName]);
    });
  }

  // Extract order
  const orderMatch = body.match(/order:\s*\[([\s\S]*?)\]/);
  if (orderMatch) {
    const orderItems = orderMatch[1].match(/EnOrder\.\w+/g) || [];
    item.order = orderItems.map(o => o.replace('EnOrder.', '').toLowerCase());
  }

  // Generate detailed order
  const counters = { titles: 0, texts: 0, ayahs: 0 };
  item.detailedOrder = item.order.map(type => ({
    type,
    index: counters[type]++
  }));

  items.push(item);
}

console.log(`Created ${items.length} items`);

// Create output
const output = {
  version: "3.0.0",
  generated: new Date().toISOString(),
  totalLists: 1,
  lists: { "1": items }
};

fs.writeFileSync('./public/khwater-data-chapter1-detailed.json', JSON.stringify(output, null, 2));
console.log('✅ Chapter 1 migrated to public/khwater-data-chapter1-detailed.json');
