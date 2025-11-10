const fs = require('fs');
const path = require('path');

function updateChapter26() {
  const dataPath = path.join(__dirname, '..', 'public', 'khwater-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const chapter26Items = [
    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "subtitles", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "subtitles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "texts", "texts", "ayahs", "texts", "texts", "texts", "texts", "texts", "texts", "texts", "texts", "texts", "texts", "ayahs", "ayahs", "ayahs", "subtitles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "subtitles", "ayahs", "texts", "ayahs", "texts", "ayahs", "ayahs", "texts", "texts", "texts"],
    },

  ];

  const itemsWithDetailedOrder = chapter26Items.map((item) => {
    const detailedOrder = item.order.map((type) => ({ type, index: 0 }));
    const typeCounters = {};
    item.order.forEach((type) => { if (!typeCounters[type]) typeCounters[type] = 0; typeCounters[type]++; });
    return { ...item, detailedOrder };
  });

  data.lists['26'] = itemsWithDetailedOrder;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Chapter 26 updated!`);  
}

updateChapter26();
