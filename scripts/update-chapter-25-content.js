const fs = require('fs');
const path = require('path');

function updateChapter25() {
  const dataPath = path.join(__dirname, '..', 'public', 'khwater-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const chapter25Items = [
    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "subtitles", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "subtitles", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "subtitles", "ayahs", "subtitles", "ayahs", "subtitles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "subtitles", "texts", "ayahs", "subtitles", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "texts", "ayahs", "subtitles", "texts", "ayahs", "subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs"],
    },

  ];

  const itemsWithDetailedOrder = chapter25Items.map((item) => {
    const detailedOrder = item.order.map((type) => ({ type, index: 0 }));
    const typeCounters = {};
    item.order.forEach((type) => { if (!typeCounters[type]) typeCounters[type] = 0; typeCounters[type]++; });
    return { ...item, detailedOrder };
  });

  data.lists['25'] = itemsWithDetailedOrder;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Chapter 25 updated!`);  
}

updateChapter25();
