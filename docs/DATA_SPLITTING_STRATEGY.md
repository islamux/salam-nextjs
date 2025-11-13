# Data Splitting Strategy for khwater-data.json

## Overview

The `public/khwater-data.json` file (724KB) is currently a monolithic JSON file containing all 29 chapters of Islamic spiritual texts. This document outlines strategies and best practices for splitting this large file to improve performance, maintainability, and scalability.

## Current State

- **File Size**: 724KB (exceeds 256KB recommended limit)
- **Total Chapters**: 29 (keys '0' through '28')
- **Total Items**: 496 items across all chapters
- **Chapter Distribution**: Varies from 3 to 35 items per chapter

## Why Split the Data?

### Performance Benefits
1. **Faster Initial Load**: Only load data for the current page/route
2. **Reduced Bundle Size**: Smaller JavaScript bundles for each page
3. **Better Caching**: Browser can cache individual chapter files
4. **Parallel Loading**: Multiple files can load in parallel
5. **Improved Memory Usage**: Only one chapter in memory at a time

### Development Benefits
1. **Easier Maintenance**: Update chapters independently
2. **Better Version Control**: Smaller diffs in git
3. **Debugging**: Easier to identify issues in specific chapters
4. **Testing**: Can test individual chapters in isolation

### Production Benefits
1. **CDN Optimization**: CDN can cache and serve individual files
2. **Incremental Updates**: Update specific chapters without redeploying all
3. **Bandwidth Efficiency**: Users only download needed chapters
4. **Offline Support**: PWA can cache specific chapters on-demand

## Splitting Strategies

### Option 1: Individual Chapter Files (Recommended)

**Approach**: Split into 29 separate files (one per chapter)

**Structure**:
```
public/
  khwater/
    0.json
    1.json
    2.json
    ...
    28.json
```

**Pros**:
- ✅ Minimal data transfer (load only needed chapter)
- ✅ Excellent caching (each chapter cached independently)
- ✅ Easy to update individual chapters
- ✅ Perfect for Next.js SSG (static generation)
- ✅ Scales well (works for hundreds of chapters)

**Cons**:
- ❌ 29 HTTP requests instead of 1
- ❌ More complex file management
- ❌ Requires service layer updates

**File Sizes** (estimated):
```
Chapter 0:  ~6KB
Chapter 1:  ~75KB (largest)
Chapter 2:  ~35KB
...
Chapter 28: ~15KB
```

### Option 2: Grouped Chapters

**Approach**: Group chapters into 3-5 files

**Structure**:
```
public/
  khwater/
    chapters-1-10.json
    chapters-11-20.json
    chapters-21-29.json
```

**Pros**:
- ✅ Fewer HTTP requests (3 vs 29)
- ✅ Still reduces initial load
- ✅ Easier to manage than individual files

**Cons**:
- ❌ Users download more data than needed
- ❌ Larger per-request size
- ❌ Less granular caching

### Option 3: Hybrid Approach

**Approach**: Individual files with metadata/index file

**Structure**:
```
public/
  khwater/
    index.json      (metadata, chapter list)
    0.json          (individual chapter data)
    1.json
    ...
    28.json
```

**Pros**:
- ✅ Best of both worlds
- ✅ Quick metadata fetch
- ✅ On-demand chapter loading
- ✅ Preloading possible

**Cons**:
- ❌ More complex implementation

## Recommended Implementation: Option 1

### Implementation Steps

1. **Create Directory Structure**
   ```bash
   mkdir -p public/khwater
   ```

2. **Split Data Script**
   ```javascript
   // scripts/split-data.js
   const fs = require('fs');
   const path = require('path');

   // Read original data
   const data = JSON.parse(fs.readFileSync('public/khwater-data.json', 'utf8'));

   // Create khwater directory
   if (!fs.existsSync('public/khwater')) {
     fs.mkdirSync('public/khwater');
   }

   // Write each chapter
   Object.entries(data.lists).forEach(([chapterId, items]) => {
     fs.writeFileSync(
       `public/khwater/${chapterId}.json`,
       JSON.stringify({ items }, null, 2)
     );
   });

   // Write index/metadata
   fs.writeFileSync(
     'public/khwater/index.json',
     JSON.stringify({
       totalChapters: data.totalLists,
       version: data.version,
       generated: data.generated,
       chapters: Object.keys(data.lists).map(id => ({
         id,
         items: data.lists[id].length
       }))
     }, null, 2)
   );
   ```

3. **Update Service Layer**
   ```typescript
   // src/lib/data/khwater-service.ts

   // Load chapter data (client-side)
   export async function loadChapterData(chapterId: string): Promise<KhwaterItem[]> {
     try {
       const res = await fetch(`/khwater/${chapterId}.json`);
       if (!res.ok) throw new Error('Failed to fetch chapter');
       const data = await res.json();
       return data.items;
     } catch (error) {
       console.error(`Error loading chapter ${chapterId}:`, error);
       throw error;
     }
   }

   // Get all chapters metadata
   export async function getChaptersMetadata(): Promise<ChapterMetadata[]> {
     const res = await fetch('/khwater/index.json');
     const data = await res.json();
     return data.chapters;
   }

   // Search across all chapters
   export async function searchChapters(query: string): Promise<SearchResult[]> {
     const results: SearchResult[] = [];
     const chapters = await getChaptersMetadata();

     // Search in all chapters (or use intelligent pre-filtering)
     for (const chapter of chapters) {
       try {
         const items = await loadChapterData(chapter.id);
         // Search logic...
         results.push(...searchInItems(items, chapter.id, query));
       } catch (error) {
         console.error(`Error searching chapter ${chapter.id}:`, error);
       }
     }

     return results.sort((a, b) => b.score - a.score);
   }
   ```

4. **Update Static Generation**
   ```typescript
   // src/lib/data/khwater-service.ts

   // Generate static params for all chapters
   export async function generateStaticParams() {
     const chapters = await getChaptersMetadata();
     return chapters.map(chapter => ({
       id: chapter.id
     }));
   }

   // Load chapter for SSG/SSR
   export async function getChapterData(id: string): Promise<KhwaterItem[]> {
     // For SSG, we can import directly
     const module = await import(`../../../../public/khwater/${id}.json`);
     return module.default.items;
   }
   ```

5. **Build Configuration**
   ```typescript
   // next.config.ts
   const nextConfig = {
     // Enable static generation for all chapter routes
     output: 'standalone',
     experimental: {
       // Ensure all JSON files are bundled
       outputFileTracingIncludes: {
         '/khwater/*': ['./public/khwater/*']
       }
     }
   };
   ```

6. **Update Search Index**
   ```typescript
   // Build search index at build time
   // scripts/build-search-index.js
   const allChapters = [];

   for (let i = 0; i < 29; i++) {
     const chapter = JSON.parse(fs.readFileSync(`public/khwater/${i}.json`, 'utf8'));
     allChapters.push(...chapter.items);
   }

   // Build index and save to public/search-index.json
   const index = buildSearchIndex(allChapters);
   fs.writeFileSync('public/search-index.json', JSON.stringify(index));
   ```

## Migration Checklist

### Phase 1: Preparation
- [ ] Backup original `khwater-data.json`
- [ ] Create splitting script
- [ ] Test script on development environment
- [ ] Update service layer types

### Phase 2: Implementation
- [ ] Run splitting script to generate chapter files
- [ ] Update `khwater-service.ts` to load individual chapters
- [ ] Update `generateStaticParams()` to use new structure
- [ ] Update search functionality
- [ ] Update build scripts

### Phase 3: Testing
- [ ] Test all 29 chapter routes
- [ ] Verify search functionality works
- [ ] Test bookmarking across chapters
- [ ] Verify PWA offline functionality
- [ ] Run all unit tests
- [ ] Run E2E tests
- [ ] Test build and deployment

### Phase 4: Optimization
- [ ] Implement chapter preloading for better UX
- [ ] Add progressive loading for search
- [ ] Optimize service worker caching
- [ ] Add loading states for chapter transitions

### Phase 5: Cleanup
- [ ] Remove original `khwater-data.json`
- [ ] Update documentation
- [ ] Commit changes
- [ ] Deploy to staging
- [ ] Monitor performance metrics

## Performance Metrics

### Before Splitting
- Initial Load: 724KB (entire dataset)
- Home Page: Downloads all data
- Chapter 15: Downloads all 724KB

### After Splitting
- Initial Load: ~1KB (index/metadata only)
- Home Page: Downloads index (~1KB) + chapter list metadata
- Chapter 15: Downloads only chapter-15.json (~20KB)
- **Savings**: ~704KB per chapter view (97% reduction)

### Expected Improvements
- **FCP (First Contentful Paint)**: 30-50% faster
- **LCP (Largest Contentful Paint)**: 40-60% faster
- **Bandwidth**: 95% reduction for chapter views
- **Cache Hit Rate**: 90%+ for repeat visitors

## Rollback Plan

If issues arise, rollback is straightforward:

1. **Restore monolithic file**:
   ```bash
   mv public/khwater-data.json.backup public/khwater-data.json
   ```

2. **Revert service layer changes**:
   ```bash
   git checkout HEAD~1 -- src/lib/data/khwater-service.ts
   ```

3. **Cleanup chapter files**:
   ```bash
   rm -rf public/khwater
   ```

## Monitoring

### Metrics to Watch
- Page load times (TTFB, FCP, LCP)
- Bandwidth usage per user session
- Cache hit rates
- 404 errors for chapter files
- Search response times

### Tools
- Vercel Analytics
- Chrome DevTools Network tab
- Lighthouse CI
- Real User Monitoring (RUM)

## Conclusion

Splitting the monolithic `khwater-data.json` file into individual chapter files will significantly improve:
- **Performance**: 97% reduction in data transfer per chapter view
- **User Experience**: Faster load times and smoother navigation
- **Scalability**: Can easily handle hundreds of chapters
- **Maintainability**: Easier to update and debug

This is a **recommended best practice** for data files over 500KB in web applications.
