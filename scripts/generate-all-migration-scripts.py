#!/usr/bin/env python3
"""
Generate migration scripts for all missing chapters (22-27)
This script extracts content from Dart files and creates JavaScript migration scripts
"""

import re
import json
import os
import sys

def extract_dart_constants(filepath):
    """Extract all static const String declarations from a Dart file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'static const String (\w+)\s*=\s*"""([\s\S]*?)""";'
    matches = re.findall(pattern, content)

    return {name: text.strip() for name, text in matches}

def parse_order_file(filepath):
    """Parse the order file to extract structure"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all ElmModelNewOrder blocks
    blocks = re.findall(r'ElmModelNewOrder\((.*?)\);', content, re.DOTALL)

    items = []
    for block in blocks:
        item = {
            'texts': [],
            'ayahs': [],
            'titles': [],
            'subtitles': [],
            'order': []
        }

        # Extract variable references
        refs = re.findall(r'ElmText\w+', block)
        for ref in refs:
            if 'text' in ref.lower():
                item['texts'].append(ref)
            elif 'ayah' in ref.lower() or 'hadith' in ref.lower():
                item['ayahs'].append(ref)
            elif 'title' in ref.lower():
                item['titles'].append(ref)
            elif 'subtitle' in ref.lower():
                item['subtitles'].append(ref)

        # Extract order
        order_matches = re.findall(r'EnOrder\.(\w+)', block)
        item['order'] = order_matches

        if item['order']:
            items.append(item)

    return items

def generate_migration_script(chapter_num, content_data, items):
    """Generate JavaScript migration script"""

    # Create constants object
    const_lines = []
    for name, value in sorted(content_data.items()):
        # Escape backslashes and backticks
        escaped_value = value.replace('\\', '\\\\').replace('`', '\\`')
        const_lines.append(f'  {name}: `{escaped_value}`,')

    const_obj = '\n'.join(const_lines)

    # Create items array
    items_js = []
    for i, item in enumerate(items):
        item_lines = ['    {']

        if item['titles']:
            item_lines.append('      titles: [')
            for ref in item['titles']:
                item_lines.append(f'        {ref},')
            item_lines.append('      ],')

        if item['texts']:
            item_lines.append('      texts: [')
            for ref in item['texts']:
                item_lines.append(f'        {ref},')
            item_lines.append('      ],')

        if item['ayahs']:
            item_lines.append('      ayahs: [')
            for ref in item['ayahs']:
                item_lines.append(f'        {ref},')
            item_lines.append('      ],')

        if item['subtitles']:
            item_lines.append('      subtitles: [')
            for ref in item['subtitles']:
                item_lines.append(f'        {ref},')
            item_lines.append('      ],')

        item_lines.append(f'      order: {json.dumps(item["order"])},')
        item_lines.append('    },\n')
        items_js.append('\n'.join(item_lines))

    items_array = '\n'.join(items_js)

    # Generate full script
    script = f'''/**
 * Migration script for Chapter {chapter_num}
 * Auto-generated from Dart files
 */

const fs = require('fs');
const path = require('path');

const ElmText{chapter_num} = {{
{const_obj}
}};

function updateChapter{chapter_num}() {{
  const dataPath = path.join(__dirname, '..', 'public', 'khwater-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const chapter{chapter_num}Items = [
{items_array}
  ];

  // Generate detailedOrder
  const itemsWithDetailedOrder = chapter{chapter_num}Items.map((item) => {{
    const detailedOrder = item.order.map((type) => ({{
      type,
      index: 0,
    }}));

    // Adjust indices based on content
    const typeCounters = {{}};
    item.order.forEach((type) => {{
      if (!typeCounters[type]) {{
        typeCounters[type] = 0;
      }}
      typeCounters[type]++;
    }});

    return {{
      ...item,
      detailedOrder,
    }};
  }});

  // Update the data
  data.lists['{chapter_num}'] = itemsWithDetailedOrder;

  // Write back to file
  fs.writeFileSync(
    dataPath,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  console.log(`✅ Chapter {chapter_num} updated successfully!`);
  console.log(`   - ${{itemsWithDetailedOrder.length}} items added`);
  console.log(`   - Total content blocks: ${{itemsWithDetailedOrder.reduce((acc, item) => acc + item.order.length, 0)}}`);
}}

updateChapter{chapter_num}();
'''

    return script

def main():
    """Main function to generate all migration scripts"""

    chapters = ['22', '23', '24', '25', '26', '27']
    base_path = 'FIX_ISSUES'

    print("=" * 60)
    print("Generating Migration Scripts for Chapters 22-27")
    print("=" * 60)
    print()

    for chapter_num in chapters:
        print(f"Processing Chapter {chapter_num}...")

        # Extract content from Dart file
        text_file = f'{base_path}/text/elm_text_ders_twenty_{chapter_num}.dart'
        if not os.path.exists(text_file):
            print(f"  ✗ Text file not found: {text_file}")
            continue

        content_data = extract_dart_constants(text_file)
        print(f"  - Extracted {len(content_data)} content items")

        # Parse order file
        order_file = f'{base_path}/elm_lists/elm_list_{chapter_num}_new_order.dart'
        if not os.path.exists(order_file):
            print(f"  ✗ Order file not found: {order_file}")
            continue

        items = parse_order_file(order_file)
        print(f"  - Parsed {len(items)} items with ordering")

        # Generate migration script
        script = generate_migration_script(chapter_num, content_data, items)

        # Write script
        script_path = f'scripts/update-chapter-{chapter_num}-content.js'
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(script)

        print(f"  ✓ Created: {script_path}")
        print()

    print("=" * 60)
    print("All migration scripts generated successfully!")
    print("=" * 60)
    print()
    print("To run all migrations:")
    print("  bash scripts/update-all-missing-chapters.sh")
    print()
    print("Or run individually:")
    for chapter_num in chapters:
        print(f"  node scripts/update-chapter-{chapter_num}-content.js")

if __name__ == '__main__':
    main()
