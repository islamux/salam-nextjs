const fs = require('fs');
const path = require('path');

function updateChapter23() {
  const dataPath = path.join(__dirname, '..', 'public', 'khwater-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const chapter23Items = [
    {
      texts: [
      ],
      order: ["titles", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "ayahs", "texts", "subtitles", "texts", "ayahs", "subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["titles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "subtitles", "texts", "ayahs", "subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["subtitles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "texts", "subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "titles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "texts", "ayahs", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["titles", "texts", "ayahs", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["titles", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["titles", "ayahs", "texts", "ayahs", "subtitles", "texts", "ayahs", "subtitles", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["titles", "texts", "subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["titles", "texts", "subtitles", "texts", "ayahs"],
    },

    {
      texts: [
      ],
      order: ["titles", "texts", "ayahs", "texts", "ayahs", "texts"],
    },

    {
      texts: [
      ],
      order: ["titles", "texts", "subtitles", "texts"],
    },

    {
      texts: [
      ],
      order: ["ayahs", "texts"],
    },

  ];

  const itemsWithDetailedOrder = chapter23Items.map((item) => {
    const detailedOrder = item.order.map((type) => ({ type, index: 0 }));
    const typeCounters = {};
    item.order.forEach((type) => { if (!typeCounters[type]) typeCounters[type] = 0; typeCounters[type]++; });
    return { ...item, detailedOrder };
  });

  data.lists['23'] = itemsWithDetailedOrder;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Chapter 23 updated!`);  
}

updateChapter23();
