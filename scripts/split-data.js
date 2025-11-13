#!/usr/bin/env node

/**
 * Data Splitting Script for khwater-data.json
 *
 * This script splits the monolithic khwater-data.json file (724KB)
 * into individual chapter files for better performance and maintainability.
 *
 * Usage: node scripts/split-data.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

// Main execution
function main() {
  try {
    log('\n=== Khwater Data Splitting Script ===\n', colors.cyan);

    const originalPath = path.join(process.cwd(), 'public', 'khwater-data.json');
    const outputDir = path.join(process.cwd(), 'public', 'khwater');

    // Check if original file exists
    if (!fs.existsSync(originalPath)) {
      logError(`Original file not found: ${originalPath}`);
      process.exit(1);
    }

    logInfo('Reading original data file...');
    const rawData = fs.readFileSync(originalPath, 'utf8');
    const data = JSON.parse(rawData);

    logSuccess(`Loaded data: ${data.totalLists} chapters, ${Object.values(data.lists).reduce((a, b) => a + b.length, 0)} total items`);

    // Create output directory
    if (!fs.existsSync(outputDir)) {
      logInfo('Creating output directory...');
      fs.mkdirSync(outputDir, { recursive: true });
      logSuccess('Created directory: public/khwater');
    } else {
      logWarning('Output directory already exists');
    }

    // Split data into individual chapters
    logInfo('Splitting chapters...');
    const chapterSizes = {};
    let totalSize = 0;

    Object.entries(data.lists).forEach(([chapterId, items]) => {
      const chapterData = {
        items,
        metadata: {
          id: chapterId,
          version: data.version,
          generated: data.generated,
          totalItems: items.length
        }
      };

      const outputPath = path.join(outputDir, `${chapterId}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(chapterData, null, 2), 'utf8');

      const sizeKB = fs.statSync(outputPath).size / 1024;
      chapterSizes[chapterId] = sizeKB;
      totalSize += sizeKB;

      logInfo(`Created chapter ${chapterId}: ${items.length} items (${sizeKB.toFixed(2)}KB)`);
    });

    // Create index file
    const indexData = {
      totalChapters: data.totalLists,
      version: data.version,
      generated: data.generated,
      chapters: Object.keys(data.lists).map(id => ({
        id,
        items: data.lists[id].length,
        sizeKB: chapterSizes[id]
      })),
      summary: {
        totalChapters: data.totalLists,
        totalItems: Object.values(data.lists).reduce((a, b) => a + b.length, 0),
        totalSizeKB: totalSize.toFixed(2),
        averageSizeKB: (totalSize / Object.keys(data.lists).length).toFixed(2)
      }
    };

    const indexPath = path.join(outputDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
    logSuccess(`Created index file: ${indexPath}`);

    // Create backup of original file
    const backupPath = path.join(process.cwd(), 'public', 'khwater-data.json.backup');
    fs.copyFileSync(originalPath, backupPath);
    logSuccess(`Created backup: ${backupPath}`);

    // Print summary
    log('\n=== Summary ===\n', colors.cyan);
    logInfo(`Total chapters: ${indexData.totalChapters}`);
    logInfo(`Total items: ${indexData.summary.totalItems}`);
    logInfo(`Total size: ${indexData.summary.totalSizeKB} KB`);
    logInfo(`Average chapter size: ${indexData.summary.averageSizeKB} KB`);
    logInfo(`Output directory: ${outputDir}`);

    // Largest and smallest chapters
    const sortedChapters = Object.entries(chapterSizes).sort((a, b) => b[1] - a[1]);
    log('\nChapter sizes (Top 5):', colors.blue);
    sortedChapters.slice(0, 5).forEach(([id, size]) => {
      log(`  Chapter ${id}: ${size.toFixed(2)} KB`);
    });

    log('\n=== Migration Complete ===\n', colors.green);
    logSuccess('Data successfully split into individual chapter files');
    log('\nNext steps:', colors.yellow);
    log('1. Update src/lib/data/khwater-service.ts to use new structure');
    log('2. Update generateStaticParams() for new structure');
    log('3. Test all chapter routes');
    log('4. Remove original file after verification: rm public/khwater-data.json\n');

  } catch (error) {
    logError(`Error: ${error.message}`);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();
