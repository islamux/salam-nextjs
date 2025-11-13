# Chapter Reordering & Structure Update Guide

## Overview
This guide documents the process for:
1. **Reordering** chapter content to match the original Dart file structure
2. **Updating** from plural to singular field names (arrays to strings)

## Major Change: Plural to Singular Fields

### Field Name Changes
- `titles` → `title` (string, not array)
- `subtitles` → `subtitle` (string, not array)
- `texts` → `text` (string, not array)
- `ayahs` → `ayah` (string, not array)

### Before (Plural/Arrays)
```json
{
  "items": [
    {
      "titles": ["Title text"],
      "subtitles": ["Subtitle text"],
      "texts": ["Text content"],
      "ayahs": ["Quran verse"],
      "order": ["titles", "subtitles", "texts", "ayahs"]
    }
  ]
}
```

### After (Singular/Strings)
```json
{
  "items": [
    {
      "title": "Title text",
      "subtitle": "Subtitle text",
      "text": "Text content",
      "ayah": "Quran verse",
      "order": ["title", "subtitle", "text", "ayah"]
    }
  ]
}
```

## Issue Identified

In Chapter 0, the original structure had:
- 3 items total
- Item 3 contained: 3 ayahs + 3 texts grouped together with complex alternating order

This didn't match the original Dart file which presented each ayah with its corresponding text as a separate, distinct item.

## Solution Pattern

### Original Dart Structure (from `texts-original/text/elm_text_ders_pre.dart`)
```dart
// Page 1 - Item 1
title: "مجموعة خواطر حول الدين والحياة"
ayah: "وَذَكِّرۡ فَإِنَّ ٱلذِّكۡرَىٰ تَنفَعُ ٱلۡمُؤۡمِنِينَ ۝٥٥"
text: "احببت أنشارك بها..."

// Page 2 - Item 2
title: "ادخلو في السلم كافة"
subtitle: "الإسلام منهج كامل في كل مناحي الحياة"
text: "الإسلام وحي الله إلى الأرض..."

// Page 3 - Items 3-5 (each as separate items)
ayah: "( يا ايها اللذين امنو ادخلو في السلم كافة )"
text: "كلمة كافة: تعني انه يجب أن ندخل..."

ayah: "( ادخلو في السلم )"
text: "في تعني شيئاً ضمن شيئ..."

ayah: "( ادخلو في السلم )"
text: "لايوجد أحد من بني البشر..."
```

### Before Fix (JSON structure)
```json
{
  "items": [
    // Items 1-2 correct
    {
      "ayahs": [
        "( يا ايها اللذين امنو ادخلو في السلم كافة )",
        "( ادخلو في السلم )",
        "( ادخلو في السلم )"
      ],
      "texts": [
        "كلمة كافة:...",
        "في تعني شيئاً...",
        "لايوجد أحد..."
      ],
      "order": ["ayahs", "texts", "ayahs", "texts", "ayahs", "texts"]
    }
  ]
}
```

### After Fix (JSON structure)
```json
{
  "items": [
    // Items 1-2 unchanged (but now using singular fields)
    {
      "title": "مجموعة خواطر حول الدين والحياة",
      "ayah": "وَذَكِّرۡ فَإِنَّ ٱلذِّكۡرَىٰ تَنفَعُ ٱلۡمُؤۡمِنِينَ ۝٥٥ * \nالذاريات 55 *",
      "text": "احببت أنشارك بها من باب بلغوا عني ولو ايه...",
      "order": ["title", "ayah", "text"]
    },
    {
      "title": " ادخلو في السلم كافة\n",
      "subtitle": "الإسلام منهج كامل في كل مناحي الحياة",
      "text": "الإسلام وحي الله إلى الأرض...",
      "order": ["title", "subtitle", "text"]
    },
    {
      "ayah": "( يا ايها اللذين امنو ادخلو في السلم كافة )",
      "text": "كلمة كافة: تعني انه يجب أن ندخل جميعاً في الدين...",
      "order": ["ayah", "text"]
    },
    {
      "ayah": "( ادخلو في السلم )",
      "text": "في تعني شيئاً ضمن شيئ ، أي إنك دخلت كلك في الدين...",
      "order": ["ayah", "text"]
    },
    {
      "ayah": "( ادخلو في السلم )",
      "text": "لايوجد أحد من بني البشر على الإطلاق إلا ويتمنى السلامة والسعادة...",
      "order": ["ayah", "text"]
    }
  ]
}
```

## Step-by-Step Process

### Step 1: Update TypeScript Types
Update `src/lib/types/khwater.ts`:
```typescript
// Before
export type ContentType = 'titles' | 'subtitles' | 'texts' | 'ayahs' | 'footer';

export interface KhwaterItem {
  titles?: string[];
  subtitles?: string[];
  texts?: string[];
  ayahs?: string[];
  footer?: string;
  order: ContentType[];
  detailedOrder?: DetailedOrderItem[];
}

// After
export type ContentType = 'title' | 'subtitle' | 'text' | 'ayah' | 'footer';

export interface KhwaterItem {
  title?: string;
  subtitle?: string;
  text?: string;
  ayah?: string;
  footer?: string;
  order: ContentType[];
  detailedOrder?: DetailedOrderItem[];
}
```

### Step 2: Analyze Original Structure
1. Read the Dart file: `texts-original/text/elm_text_ders_pre.dart`
2. Identify how many distinct items there should be
3. For each item, note:
   - Does it have a title?
   - Does it have a subtitle?
   - Does it have ayah?
   - Does it have text content?
   - What's the order of presentation?

### Step 3: Identify the Problem Item
1. Open the corresponding JSON file: `public/khwater/{chapter-id}.json`
2. Look for items with:
   - Multiple ayahs in array
   - Multiple texts in array
   - Complex order array with alternating ayahs/texts

### Step 4: Split into Separate Items
For each problematic item:
1. Count the ayahs
2. Each ayah should have its corresponding text
3. Create separate items where:
   - Each item has 1 ayah (or the group that belongs together)
   - Each item has 1 text (or the corresponding text)
   - Order is simple: `["ayah", "text"]`

### Step 5: Update Field Names to Singular
For each item, change:
- `titles` array → `title` string (use first/only item)
- `subtitles` array → `subtitle` string (use first/only item)
- `texts` array → `text` string (use first/only item or join with space)
- `ayahs` array → `ayah` string (use first/only item)
- Update order array from plural to singular

Example transformation:
```json
// Before
{
  "titles": ["Main Title"],
  "texts": ["First paragraph", "Second paragraph"],
  "order": ["titles", "texts"]
}

// After
{
  "title": "Main Title",
  "text": "First paragraph Second paragraph",
  "order": ["title", "text"]
}
```

### Step 6: Update Metadata
- Update `metadata.totalItems` to reflect the new count
- Example: Changed from 3 to 5 items

### Step 7: Update Code Components

#### ContentRenderer.tsx
```typescript
// Before
switch (type) {
  case 'titles':
    if (item.titles?.length) {
      return <Title key={`title-${index}`} title={item.titles.join(' ')} />;
    }
    return null;
  case 'texts':
    if (item.texts?.length) {
      return <Text key={`text-${index}`} text={item.texts[0]} />;
    }
    return null;
}

// After
switch (type) {
  case 'title':
    if (item.title) {
      return <Title key={`title-${index}`} title={item.title} />;
    }
    return null;
  case 'text':
    if (item.text) {
      return <Text key={`text-${index}`} text={item.text} />;
    }
    return null;
}
```

#### search-index.ts
```typescript
// Before
interface SearchIndexItem {
  titles?: string;
  texts?: string;
  ayahs?: string;
}

const combinedContent = [
  item.titles?.join(' ') || '',
  item.texts?.join(' ') || '',
  item.ayahs?.join(' ') || '',
];

// After
interface SearchIndexItem {
  title?: string;
  text?: string;
  ayah?: string;
}

const combinedContent = [
  item.title || '',
  item.text || '',
  item.ayah || '',
];
```

#### Other files to check:
- `src/app/(routes)/khwater/[id]/page.tsx`
- `src/lib/data/khwater-service.ts`

### Step 8: Validate
1. Validate JSON syntax:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('public/khwater/{id}.json', 'utf8')); console.log('✅ JSON is valid');"
   ```

2. Test the page loads:
   ```bash
   NEXT_DISABLE_TURBOPACK=1 pnpm dev &
   sleep 5
   curl -s http://localhost:3000/khwater/{id} | grep -o "content-pattern" | head -1
   ```

3. Build the project:
   ```bash
   NEXT_DISABLE_TURBOPACK=1 pnpm build
   ```

4. Run tests:
   ```bash
   pnpm test
   ```

## Common Patterns to Look For

### Pattern 1: Multiple Ayahs with Multiple Texts
**Problem:**
```json
{
  "ayahs": ["ayah1", "ayah2", "ayah3"],
  "texts": ["text1", "text2", "text3"],
  "order": ["ayahs", "texts", "ayahs", "texts", "ayahs", "texts"]
}
```

**Solution:** Split into 3 items
```json
[
  {"ayah": "ayah1", "text": "text1", "order": ["ayah", "text"]},
  {"ayah": "ayah2", "text": "text2", "order": ["ayah", "text"]},
  {"ayah": "ayah3", "text": "text3", "order": ["ayah", "text"]}
]
```

### Pattern 2: Title + Subtitle + Text (usually correct)
Just change field names to singular, no restructuring needed.

### Pattern 3: Single Ayah + Text (usually correct)
Just change field names to singular, no restructuring needed.

## Chapter 0 Example (Complete)

### Original Item Count: 3
### Fixed Item Count: 5

### Item Breakdown:
1. **Item 1**: Title → Ayah → Text (Introduction)
2. **Item 2**: Title → Subtitle → Text (Main article)
3. **Item 3**: Ayah → Text (Explanation of "كافة")
4. **Item 4**: Ayah → Text (Explanation of "في")
5. **Item 5**: Ayah → Text (Conclusion about salvation)

## Files Modified

### TypeScript Types
- `/media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam-nextjs/src/lib/types/khwater.ts`
  - Changed ContentType from plural to singular
  - Changed KhwaterItem fields from arrays to strings
  - Updated FontSizeSettings to match

### JSON Data
- `/media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam-nextjs/public/khwater/0.json`
  - Changed from 3 items to 5 items
  - Split ayah-text pairs into separate items
  - Updated all field names from plural to singular
  - Updated `totalItems` metadata

### Components
- `src/components/khwater/ContentRenderer.tsx`
  - Updated renderWithDetailedOrder to use singular fields
  - Updated renderWithSimpleOrder to use singular fields
  - Removed array handling logic

- `src/lib/utils/search-index.ts`
  - Updated SearchIndexItem interface
  - Updated buildSearchIndex function
  - Updated searchIndex function

### Pages & Services
- `src/app/(routes)/khwater/[id]/page.tsx`
  - Updated generateMetadata to use item.text instead of item.texts?.[0]
  - Updated JSON-LD schema to use item.text

- `src/lib/data/khwater-service.ts`
  - Updated chapterTitle extraction to use item.title

### Tests
- `src/lib/utils/__tests__/search-index.test.ts`
  - Updated mock data to use singular fields
  - Updated test assertions
  - Changed from ElmItem to KhwaterItem type

## Applying to Other Chapters

To apply this pattern to other chapters:

1. **Check all chapters** for similar issues:
   ```bash
   for i in {0..28}; do
     echo "=== Chapter $i ==="
     jq '.items[] | select(.ayahs? or .texts? or .titles? or .subtitles?)' public/khwater/$i.json 2>/dev/null
   done
   ```

2. **For each problematic chapter**:
   - Read the original Dart file
   - Follow the Step-by-Step Process above
   - Update field names to singular
   - Split items as needed
   - Validate changes

## Validation Checklist

- [ ] JSON syntax is valid
- [ ] Page loads without errors (HTTP 200)
- [ ] Content renders correctly
- [ ] Order matches original Dart file
- [ ] Field names changed from plural to singular
- [ ] TypeScript types compile without errors
- [ ] Tests pass
- [ ] Build succeeds without errors
- [ ] All ayahs and texts are present

## Lessons Learned

1. **Each ayah-text pair should be a separate item** for better readability and proper content flow
2. **Complex order arrays** often indicate items that should be split
3. **Original Dart file is the source of truth** for structure
4. **Singular field names are cleaner** than arrays when each item has at most one of each type
5. **Always update TypeScript types first** before updating JSON and components
6. **Update all components** that use the fields (ContentRenderer, search-index, services, tests)
7. **Validate after each change** to catch issues early

## Future Prevention

To prevent this issue in data migration:
- When converting from Dart to JSON, identify ayah-text pairs
- Create one JSON item per ayah-text pair
- Use singular field names (title, subtitle, text, ayah) instead of arrays
- Avoid grouping multiple ayahs/texts in single items
- Test rendering after each conversion
- Validate against original Dart file structure
