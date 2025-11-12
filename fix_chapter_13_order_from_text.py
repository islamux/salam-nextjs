#!/usr/bin/env python3
"""
Fix Chapter 13 order based on the sequence in the TEXT file,
not the ElmModelNewOrder arrays.
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
    if name.startswith('ayahHadithTherteen') or name.startswith('ayahHadithThirteen'):
        return 'ayahs'
    elif name.startswith('elmTextTherteen') or name.startswith('elmTextThirteen'):
        return 'texts'
    elif name.startswith('subtitleTherteen') or name.startswith('subtitleThirteen'):
        return 'subtitles'
    elif name.startswith('titleTherteen') or name.startswith('titleThirteen'):
        return 'titles'
    elif name.startswith('titlesTherteen') or name.startswith('titlesThirteen'):
        # Handle typo in file: "titles" instead of "title"
        return 'titles'
    elif name.startswith('footerTherteen'):
        return 'footer'
    else:
        return None

def extract_item_content_and_order_from_text(constants, item_index):
    """
    Extract content and determine order based on the SEQUENCE
    constants appear in the TEXT file.
    """

    # Page numbers mapping for Chapter 13
    # Uses numbers: One, Two, Three... Thirteen
    page_numbers = [
        'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
        'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Therteen'
    ]

    page_num = page_numbers[item_index] if item_index < len(page_numbers) else str(item_index + 1)

    # Collect all constants for this page, maintaining TEXT file order
    page_items = []

    # Go through constants in the order they appear in TEXT file
    for const_name in constants:
        # Chapter 13 pattern:
        # - titleThirteen{Page} for titles
        # - subtitleTherteen{Page}_1 for subtitles
        # - elmTextTherteen{Page}_1 for texts (note "Therteen" not "Thirteen")
        # - ayahHadithThirteen{Page}_1 for ayahs
        # - titlesTherteen{Page} (typo in file) for titles

        # Handle both "Thirteen" and "Therteen" patterns
        if f'Thirteen{page_num}' in const_name or f'Therteen{page_num}' in const_name:
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

    chapter_13 = data['lists']['13']

    # Parse Dart text file
    print('Parsing Dart text file for Chapter 13...')
    constants = parse_dart_text_in_order('FIX/text/elm_text_ders_therteen.dart')
    print(f'Found {len(constants)} constants')

    print('\nFixing order based on TEXT file sequence...')
    print('=' * 70)

    # Fix each item
    for i, item in enumerate(chapter_13):
        print(f'Item {i+1} (Page {i+1}): Fixing order based on TEXT file sequence...')

        # Extract content and order from TEXT file sequence
        content, order, detailedOrder = extract_item_content_and_order_from_text(constants, i)

        # Update item
        old_order = item.get('order', [])
        item.update(content)
        item['order'] = order
        item['detailedOrder'] = detailedOrder

        print(f'       Order: {order}')
        text_count = len(content.get('texts', []))
        ayah_count = len(content.get('ayahs', []))
        subtitle_count = len(content.get('subtitles', []))
        title_count = len(content.get('titles', []))
        footer_count = len(content.get('footer', []))
        print(f'       Content: {title_count} titles, {subtitle_count} subtitles, '
              f'{text_count} texts, {ayah_count} ayahs, {footer_count} footer')

        if old_order != order:
            print(f'       ✓ Order CHANGED from {len(old_order)} to {len(order)} items')

    # Save updated JSON
    with open('public/khwater-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print('=' * 70)
    print('✓ Chapter 13 order fixed based on TEXT file sequence!')
    print('\nVisit: http://localhost:3001/khwater/13')

if __name__ == '__main__':
    main()