#!/usr/bin/env python3
"""
Add missing Page 5 to Chapter 6 from TEXT file.
"""

import json
import re

def parse_dart_text_in_order(file_path):
    """Parse Dart file and extract constants in the order they appear."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all constant definitions with their values
    pattern = r'static const String (\w+)\s*=\s*"""(.*?)""";'
    matches = re.findall(pattern, content, re.DOTALL)

    constants = {}
    for name, value in matches:
        constants[name] = value.strip()

    return constants

def determine_type_from_constant_name(name):
    """Determine content type from constant name."""
    if name.startswith('ayahHadithSix'):
        return 'ayahs'
    elif name.startswith('elmTextSix'):
        return 'texts'
    elif name.startswith('subtitleSix'):
        return 'subtitles'
    elif name.startswith('titleSix'):
        return 'titles'
    elif name.startswith('footerSix'):
        return 'footer'
    else:
        return None

def extract_page_5_content(constants):
    """Extract Page 5 content."""
    page_items = []

    # Go through constants in the order they appear in TEXT file
    for const_name in constants:
        # Look for Page 5 constants
        if 'Six' in const_name and 'Five' in const_name:
            const_type = determine_type_from_constant_name(const_name)
            if const_type:
                page_items.append({
                    'name': const_name,
                    'type': const_type,
                    'value': constants[const_name]
                })

    # Now organize by type
    result = {
        'titles': [],
        'subtitles': [],
        'texts': [],
        'ayahs': [],
        'footer': []
    }

    # Track indices for each type
    indices = {
        'titles': 0,
        'subtitles': 0,
        'texts': 0,
        'ayahs': 0,
        'footer': 0
    }

    # Build order array based on TEXT file sequence
    order = []
    detailedOrder = []

    for item in page_items:
        const_type = item['type']
        value = item['value']

        # Add to appropriate array
        result[const_type].append(value)

        # Add to order array
        order.append(const_type)
        detailedOrder.append({
            'type': const_type,
            'index': indices[const_type]
        })

        # Increment index
        indices[const_type] += 1

    return result, order, detailedOrder

def main():
    # Load JSON
    with open('public/khwater-data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    chapter_6 = data['lists']['6']

    print(f'Current Chapter 6 items: {len(chapter_6)}')
    print('TEXT file has 5 pages, but JSON only has 4 items.')
    print()

    # Parse Dart text file
    print('Parsing Dart text file for Chapter 6 Page 5...')
    constants = parse_dart_text_in_order('FIX/text/elm_text_ders_six.dart')

    # Extract Page 5 content
    content, order, detailedOrder = extract_page_5_content(constants)

    print(f'Found Page 5 content:')
    print(f'  Order: {order}')
    text_count = len(content['texts'])
    ayah_count = len(content['ayahs'])
    print(f'  Texts: {text_count}')
    print(f'  Ayahs: {ayah_count}')
    print()

    # Add Page 5 as new item
    new_item = {
        **content,
        'order': order,
        'detailedOrder': detailedOrder
    }

    chapter_6.append(new_item)

    print(f'Added Page 5 to Chapter 6.')
    print(f'New Chapter 6 items: {len(chapter_6)}')

    # Save updated JSON
    with open('public/khwater-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print()
    print('=' * 70)
    print('✓ Page 5 added to Chapter 6!')
    print('Visit: http://localhost:3001/khwater/6')

if __name__ == '__main__':
    main()