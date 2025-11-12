const fs = require('fs');
const path = require('path');

function updateChapter22() {
  const dataPath = path.join(__dirname, '..', 'public', 'khwater-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const chapter22Items = [
    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "subtitles", "texts", "subtitles", "texts"],
    },

  ];

  const itemsWithDetailedOrder = chapter22Items.map((item) => {
    const detailedOrder = item.order.map((type) => ({ type, index: 0 }));
    const typeCounters = {};
    item.order.forEach((type) => { if (!typeCounters[type]) typeCounters[type] = 0; typeCounters[type]++; });
    return { ...item, detailedOrder };
  });

  data.lists['22'] = itemsWithDetailedOrder;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Chapter 22 updated!`);  
}

updateChapter22();
