#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function transformChapter(chapterPath) {
  try {
    const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
    const newItems = [];

    data.items.forEach((item) => {
      // Handle items with multiple texts or ayahs by creating separate items
      const texts = item.texts || [];
      const ayahs = item.ayahs || [];

      // If there's a title, it goes with the first text
      if (item.titles && texts.length > 0) {
        newItems.push({
          title: item.titles[0],
          order: ['title']
        });

        // Add remaining items
        for (let i = 0; i < texts.length; i++) {
          newItems.push({
            text: texts[i],
            order: ['text']
          });
        }
      }
      // If there's a subtitle
      else if (item.subtitles && texts.length > 0) {
        newItems.push({
          subtitle: item.subtitles[0],
          text: texts[0],
          order: ['subtitle', 'text']
        });

        // Add remaining texts
        for (let i = 1; i < texts.length; i++) {
          newItems.push({
            text: texts[i],
            order: ['text']
          });
        }
      }
      // If there's a title with no texts
      else if (item.titles) {
        newItems.push({
          title: item.titles[0],
          order: ['title']
        });
      }
      // If there's only texts
      else if (texts.length > 0) {
        texts.forEach(text => {
          newItems.push({
            text: text,
            order: ['text']
          });
        });
      }

      // Handle ayahs - create separate items for each ayah
      ayahs.forEach(ayah => {
        newItems.push({
          ayah: ayah,
          order: ['ayah']
        });
      });

      // Handle footer
      if (item.footer) {
        newItems.push({
          footer: item.footer,
          order: ['footer']
        });
      }

      // Handle combinations of texts and ayahs
      if (texts.length > 0 && ayahs.length > 0) {
        // Clear previous items and create proper alternation
        newItems.length = 0; // Clear

        const maxLen = Math.max(texts.length, ayahs.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < texts.length && texts[i]) {
            newItems.push({
              text: texts[i],
              order: ['text']
            });
          }
          if (i < ayahs.length && ayahs[i]) {
            newItems.push({
              ayah: ayahs[i],
              order: ['ayah']
            });
          }
        }
      }

      // Handle subtitle + text + ayah combinations
      if (item.subtitle && texts.length > 0 && ayahs.length > 0) {
        newItems.length = 0; // Clear
        newItems.push({
          subtitle: item.subtitles[0],
          text: texts[0],
          order: ['subtitle', 'text']
        });

        // Add ayahs
        ayahs.forEach(ayah => {
          newItems.push({
            ayah: ayah,
            order: ['ayah']
          });
        });
      }
    });

    // Remove empty items
    const filteredItems = newItems.filter(item => {
      return item.title || item.subtitle || item.text || item.ayah || item.footer;
    });

    data.items = filteredItems;
    data.metadata.totalItems = filteredItems.length;

    // Remove detailedOrder as we're using simple structure
    delete data.detailedOrder;

    fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2));
    console.log(`✅ Transformed ${chapterPath} - ${filteredItems.length} items`);
  } catch (error) {
    console.error(`❌ Error transforming ${chapterPath}:`, error.message);
  }
}

// Transform chapters 1-27
for (let i = 1; i <= 27; i++) {
  const chapterPath = path.join(__dirname, 'public', 'khwater', `${i}.json`);
  if (fs.existsSync(chapterPath)) {
    transformChapter(chapterPath);
  } else {
    console.log(`⚠️  Chapter ${i} not found`);
  }
}

console.log('\n✨ Transformation complete!');
