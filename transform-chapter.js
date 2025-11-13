// Script to transform chapter JSON from plural to singular fields
const fs = require('fs');

function transformChapter(chapterPath) {
  const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));

  data.items = data.items.map(item => {
    const newItem = {};

    // Convert titles array to title string
    if (item.titles) {
      newItem.title = item.titles[0] || '';
    }

    // Convert subtitles array to subtitle string
    if (item.subtitles) {
      newItem.subtitle = item.subtitles[0] || '';
    }

    // Convert texts array to text string (join with space if multiple)
    if (item.texts) {
      if (item.texts.length === 1) {
        newItem.text = item.texts[0];
      } else {
        // For multiple texts, we need to handle based on order
        // For now, join them or we'll handle per item
        newItem.text = item.texts.join('\n\n');
      }
    }

    // Convert ayahs array to ayah string
    if (item.ayahs) {
      if (item.ayahs.length === 1) {
        newItem.ayah = item.ayahs[0];
      } else {
        // For multiple ayahs, we'll need to split this into separate items
        // For now, join them
        newItem.ayah = item.ayahs.join('\n\n');
      }
    }

    // Copy footer as is
    if (item.footer) {
      newItem.footer = item.footer;
    }

    // Transform order array from plural to singular
    if (item.order) {
      newItem.order = item.order.map(type => {
        const map = {
          'titles': 'title',
          'subtitles': 'subtitle',
          'texts': 'text',
          'ayahs': 'ayah'
        };
        return map[type] || type;
      });
    }

    return newItem;
  });

  // Update metadata
  data.metadata.totalItems = data.items.length;

  fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2));
  console.log(`✅ Transformed ${chapterPath}`);
}

module.exports = { transformChapter };
