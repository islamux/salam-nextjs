/**
 * Data Migration Utility
 * This script helps migrate Flutter JSON data with template strings to clean Arabic text
 *
 * Usage:
 * 1. Copy your Flutter Dart text files to src/lib/data/text-files/
 * 2. Copy your elm_all_data.json to src/lib/data/
 * 3. Run: node scripts/migrate-data.js
 */

interface MigrationMapping {
  [key: string]: string;
}

/**
 * Mapping of template strings to actual Arabic text
 * This would be generated from parsing the Dart files
 */
export const createTextMapping = (): MigrationMapping => {
  // This is a placeholder - in real migration, you'd parse Dart files
  // For now, we'll use a sample
  return {
    '{{ElmTextDersTen_titleTenOne}}': 'والذين جاهدوا فينا',
    '{{ElmTextDersTen_elmTexTenOne_1}}':
      'طاقته، نشاطه، تفكيره، وقته، خبرته، علمه، عضلاته، كل شيئ يملكه أنفقه في سبيل الله',
    '{{ElmTextDersTen_ayahHadithTenOne_1}}': 'وَٱلَّذِینَ جَـٰهَدُوا۟ فِینَا',
    '{{ElmTextDersTen_elmTextTenOne_2}}':
      'وقته، إمكاناته، ماله، صحته، مكانته، وجاهته، ذكائه، معلوماته، كل عضلاته، كل خبراته، علمه، وحرفته، كل شيئ بذله رخيصآ في سبيل الله',
    '{{ElmTextDersTen_ayahHadithTenOne_2}}':
      'وَٱلَّذِینَ جَـٰهَدُوا۟ فِینَا لَنَهۡدِیَنَّهُمۡ سُبُلَنَاۚ وَإِنَّ ٱللَّهَ لَمَعَ ٱلۡمُحۡسِنِینَ',
  };
};

/**
 * Replace template strings with actual Arabic text
 */
export const migrateJsonData = (jsonData: any): any => {
  const mapping = createTextMapping();

  const migrateItem = (item: any): any => {
    const migrated = { ...item };

    // Migrate titles
    if (migrated.titles && Array.isArray(migrated.titles)) {
      migrated.titles = migrated.titles.map((title: string) =>
        mapping[title] || title
      );
    }

    // Migrate texts
    if (migrated.texts && Array.isArray(migrated.texts)) {
      migrated.texts = migrated.texts.map((text: string) =>
        mapping[text] || text
      );
    }

    // Migrate ayahs
    if (migrated.ayahs && Array.isArray(migrated.ayahs)) {
      migrated.ayahs = migrated.ayahs.map((ayah: string) =>
        mapping[ayah] || ayah
      );
    }

    // Migrate footer
    if (migrated.footer && typeof migrated.footer === 'string') {
      migrated.footer = mapping[migrated.footer] || migrated.footer;
    }

    return migrated;
  };

  const migratedLists: Record<string, any[]> = {};

  for (const [listId, items] of Object.entries(jsonData.lists)) {
    migratedLists[listId] = (items as any[]).map(migrateItem);
  }

  return {
    ...jsonData,
    lists: migratedLists,
  };
};

/**
 * Load and migrate JSON data
 */
export const loadMigratedData = async () => {
  try {
    // In production, this would fetch from your cleaned JSON file
    const response = await fetch('/khwater-data.json');
    const rawData = await response.json();
    return migrateJsonData(rawData);
  } catch (error) {
    console.error('Error loading migrated data:', error);
    throw error;
  }
};
