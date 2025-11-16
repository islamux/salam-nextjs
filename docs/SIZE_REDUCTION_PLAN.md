# Size Reduction Plan for `src/lib/data/khwater-service.ts`

## Current State
- **Total Lines**: 186
- **Estimated Size**: ~5.8 KB
- **Issues**:
  - 35 lines of interface/type definitions mixed with business logic
  - Redundant error handling patterns
  - Duplicate conditional logic for SSR/SSG vs client-side
  - Similar functions doing overlapping tasks
  - Verbose error messages and logging

## Reduction Strategy

### 1. Extract Types to Separate File (Save ~35 lines)
**Action**: Create `src/lib/types/khwater-service.ts`
- Move `ChapterMetadata`, `ChapterResponse`, and `KhwaterIndex` interfaces
- Import `KhwaterItem` from existing `khwater.ts`

**Expected Reduction**: 35 lines → ~5% reduction

### 2. Consolidate Data Loading Logic (Save ~25 lines)
**Action**: Merge `loadIndex()` and `loadChapterData()` into single function
```typescript
const loadData = async <T>(path: string, importPath?: string): Promise<T> => {
  if (typeof window === 'undefined') {
    const data = await import(importPath || path);
    return data.default as T;
  }
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to fetch ${path}`);
  return response.json();
};
```

**Expected Reduction**: 25 lines → ~13% reduction

### 3. Merge Similar Functions (Save ~20 lines)
**Action**: Combine `getChapterMetadata()` and chapter mapping logic
```typescript
const getChapterInfo = async (id: string) => {
  const data = await loadData<ChapterResponse>(`/khwater/${id}.json`, `../../../public/khwater/${id}.json`);
  return {
    id,
    title: `الفصل ${id}`,
    chapterTitle: data.items[0]?.title?.split('\n')[0] || `الفصل ${id}`,
    description: `محتوى الفصل ${id}`,
    itemCount: data.items.length,
  };
};
```

**Expected Reduction**: 20 lines → ~11% reduction

### 4. Optimize Search Implementation (Save ~15 lines)
**Action**: Use Array.flatMap and reduce for cleaner search
```typescript
export const searchChapters = async (query: string) => {
  const allData = await loadAllKhwaterData();
  const results = Object.entries(allData)
    .map(([id, items]) => ({
      chapterId: id,
      items: items.filter(item =>
        [`${item.title}`, `${item.subtitle}`, `${item.text}`, `${item.ayah}`]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    }))
    .filter(r => r.items.length > 0);

  return results.sort((a, b) => Number(a.chapterId) - Number(b.chapterId));
};
```

**Expected Reduction**: 15 lines → ~8% reduction

### 5. Simplify Error Handling (Save ~10 lines)
**Action**: Use early returns and consistent error patterns
```typescript
export const getChapterData = async (id: string): Promise<KhwaterItem[]> => {
  if (!id) throw new Error('Chapter ID is required');
  return loadChapterData(id);
};
```

**Expected Reduction**: 10 lines → ~5% reduction

## Projected Results

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| Lines of Code | 186 | ~81 | **56%** |
| File Size | ~5.8 KB | ~2.6 KB | **55%** |
| Complexity | High | Medium | Significant |

## Implementation Order

1. ✅ Extract types to separate file
2. ✅ Consolidate data loading logic
3. ✅ Merge similar functions
4. ✅ Optimize search implementation
5. ✅ Simplify error handling
6. ✅ Test all functions

## Additional Benefits

- **Maintainability**: Separate concerns make code easier to understand
- **Reusability**: Common functions can be used elsewhere
- **Type Safety**: Centralized types improve IDE support
- **Performance**: Reduced bundle size improves load times
- **Testing**: Smaller units are easier to test

## Files to Modify

- ✏️ `src/lib/data/khwater-service.ts` (refactor)
- ➕ `src/lib/types/khwater-service.ts` (create)
- 📝 `src/lib/data/__tests__/khwater-service.test.ts` (update tests)

## Notes

- All existing functionality must be preserved
- Tests must pass after refactoring
- Consider backward compatibility if this is a public API
- Run `pnpm test` to verify functionality
