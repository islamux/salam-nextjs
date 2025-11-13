# TypeScript Typing Completion Plan

**Project**: خواطر - Islamic Spiritual Texts
**Date**: 2025-11-10
**Status**: ❌ NOT FULLY TYPED

## Current State Analysis

### ✅ Well-Typed Areas
- Core data types in `src/lib/types/khwater.ts`
- Most React components and pages
- Main service layer (`khwater-service.ts`)
- Utility functions with proper annotations

### ❌ Issues Found (42 total type errors)

#### 1. Test Files (16 errors)
**Location**: `e2e/`, `src/**/__tests__/`

**Problems:**
- Playwright test files have implicit `any` types for `page` parameter
- Missing type declarations for test utilities
- Custom jest matchers (`toBeSortedBy`) not properly typed
- Mock objects lack type annotations

**Files:**
- `e2e/chapter.spec.ts` - 7 errors
- `e2e/home.spec.ts` - 6 errors
- `src/lib/data/__tests__/elm-service.test.ts` - 4 errors
- `src/hooks/__tests__/index.test.ts` - 1 error
- `src/lib/utils/__tests__/bookmarks.test.ts` - 3 errors
- `src/lib/utils/__tests__/search-index.test.ts` - 1 error

#### 2. PWA Event Typing (4 errors)
**Location**: `src/components/shared/Header.tsx`

**Problem**: Using `any` type for browser event objects

```typescript
// BEFORE (untyped)
const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
const handleBeforeInstallPrompt = (e: Event) => {
  e.preventDefault();
  setDeferredPrompt(e);
};
```

#### 3. Data Migration Utility (8+ errors)
**Location**: `src/lib/utils/migrate-data.ts`

**Problem**: Heavy use of `any` type for JSON data

```typescript
// BEFORE (untyped)
export const migrateJsonData = (jsonData: any): any => {
  const migrateItem = (item: any): any => {
    // ... lots of any
  }
}
```

#### 4. Search Index Results (1+ errors)
**Location**: `src/lib/utils/search-index.ts`

**Problem**: Using `any` for search result map

```typescript
// BEFORE (untyped)
const results: Map<string, any> = new Map();
```

#### 5. Event Listener Hooks (4+ errors)
**Location**: `src/hooks/utils/useEventListener.ts`

**Problem**: Type assertions with `any` for event names

```typescript
// BEFORE (untyped)
targetElement.addEventListener(eventName as any, listener, options);
```

#### 6. Import Path Issues (2 errors)
**Location**: Test files

**Problem**: References to old module paths

```typescript
// BEFORE (wrong import)
import { ... } from '@/lib/types/elm';

// AFTER (correct import)
import { ... } from '@/lib/types/khwater';
```

---

## Implementation Plan

### Phase 1: Fix Import Paths and Test Utilities
**Priority**: High
**Estimated Time**: 30 minutes

#### 1.1 Fix Import References
Update test files to use correct module paths:
- [ ] `src/lib/utils/__tests__/bookmarks.test.ts` - Fix `@/lib/types/elm` → `@/lib/types/khwater`
- [ ] `src/lib/utils/__tests__/search-index.test.ts` - Fix `@/lib/types/elm` → `@/lib/types/khwater`
- [ ] `src/lib/data/__tests__/elm-service.test.ts` - Fix module path if needed

#### 1.2 Add Test Type Declarations
Create `src/types/testing.d.ts`:

```typescript
/// <reference types="vitest" />

// Custom jest matchers
declare global {
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {
      toBeSortedBy(key: string | ((item: T) => any), order?: 'asc' | 'desc'): void;
    }
  }
}
```

#### 1.3 Add Playwright Type Declarations
Create `src/types/playwright.d.ts`:

```typescript
/// <reference types="@playwright/test" />

import { test as base, type Page } from '@playwright/test';

declare module '@playwright/test' {
  interface TestType {
    (name: string, testFunc: (args: { page: Page }) => void): void;
  }
}
```

---

### Phase 2: Type Browser APIs and PWA Events
**Priority**: High
**Estimated Time**: 45 minutes

#### 2.1 Create Browser API Types
Create `src/types/browser.d.ts`:

```typescript
// PWA Install Prompt Event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Navigator with standalone
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// Cache API types
interface CacheStorage {
  keys(): Promise<Request[]>;
  open(cacheName: string): Promise<Cache>;
}

interface Cache {
  keys(): Promise<Request[]>;
  put(request: Request, response: Response): Promise<void>;
}

interface Request {
  url: string;
}

interface Response {
  ok: boolean;
  status: number;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
```

#### 2.2 Update Header Component
File: `src/components/shared/Header.tsx`

```typescript
// AFTER (fully typed)
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install: Use your browser menu (⋮) and select "Add to Home screen" or "Install App"');
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted install');
    }

    setDeferredPrompt(null);
  };

  const checkCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          console.log(`Cache "${cacheName}" has ${keys.length} items:`, keys.map(k => k.url));
        }
      } catch (error) {
        console.error('Cache check failed:', error);
      }
    } else {
      console.log('Cache API not supported');
    }
  };

  return (
    // ... component JSX
  );
}
```

---

### Phase 3: Type Data Migration Utility
**Priority**: Medium
**Estimated Time**: 1 hour

#### 3.1 Define Migration Types
Update or create `src/lib/types/migration.ts`:

```typescript
export interface MigrationMapping {
  [key: string]: string;
}

export interface RawKhwaterItem {
  titles?: string[];
  subtitles?: string[];
  texts?: string[];
  ayahs?: string[];
  footer?: string;
  order: string[];
}

export interface RawKhwaterData {
  version: string;
  generated: string;
  totalLists: number;
  lists: Record<string, RawKhwaterItem[]>;
}

export interface MigrationResult {
  [key: string]: string;
}
```

#### 3.2 Refactor migrate-data.ts
File: `src/lib/utils/migrate-data.ts`

```typescript
import { KhwaterItem, KhwaterData, ContentType } from '@/lib/types/khwater';
import { RawKhwaterData, RawKhwaterItem, MigrationMapping } from '@/lib/types/migration';

export const createTextMapping = (): MigrationMapping => {
  return {
    '{{ElmTextDersTen_titleTenOne}}': 'والذين جاهدوا فينا',
    // ... rest of mappings
  };
};

export const migrateJsonData = (jsonData: RawKhwaterData): KhwaterData => {
  const mapping = createTextMapping();

  const migrateItem = (item: RawKhwaterItem): KhwaterItem => {
    const migrated: KhwaterItem = {
      order: item.order as ContentType[],
    };

    // Migrate titles
    if (item.titles && Array.isArray(item.titles)) {
      migrated.titles = item.titles.map((title: string) =>
        mapping[title] || title
      );
    }

    // Migrate texts
    if (item.texts && Array.isArray(item.texts)) {
      migrated.texts = item.texts.map((text: string) =>
        mapping[text] || text
      );
    }

    // Migrate ayahs
    if (item.ayahs && Array.isArray(item.ayahs)) {
      migrated.ayahs = item.ayahs.map((ayah: string) =>
        mapping[ayah] || ayah
      );
    }

    // Migrate footer
    if (item.footer && typeof item.footer === 'string') {
      migrated.footer = mapping[item.footer] || item.footer;
    }

    // Migrate subtitles
    if (item.subtitles && Array.isArray(item.subtitles)) {
      migrated.subtitles = item.subtitles.map((subtitle: string) =>
        mapping[subtitle] || subtitle
      );
    }

    return migrated;
  };

  const migratedLists: Record<string, KhwaterItem[]> = {};

  for (const [listId, items] of Object.entries(jsonData.lists)) {
    migratedLists[listId] = items.map(migrateItem);
  }

  return {
    version: jsonData.version,
    generated: jsonData.generated,
    totalLists: jsonData.totalLists,
    lists: migratedLists,
  };
};

export const loadMigratedData = async (): Promise<KhwaterData> => {
  try {
    const response = await fetch('/khwater-data.json');
    const rawData: RawKhwaterData = await response.json();
    return migrateJsonData(rawData);
  } catch (error) {
    console.error('Error loading migrated data:', error);
    throw error;
  }
};
```

---

### Phase 4: Type Search Index Utility
**Priority**: Medium
**Estimated Time**: 30 minutes

#### 4.1 Define Search Result Types
File: `src/lib/utils/search-index.ts`

```typescript
import { KhwaterItem } from '@/lib/types/khwater';

interface SearchIndexItem {
  chapterId: string;
  itemIndex: number;
  content: string;
  titles?: string;
  texts?: string;
  ayahs?: string;
}

interface SearchResult {
  chapterId: string;
  itemIndex: number;
  matches: string[];
  score: number;
}

export const searchIndex = (
  index: SearchIndexItem[],
  query: string
): SearchResult[] => {
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  const results: Map<string, SearchResult> = new Map();

  index.forEach((item) => {
    let totalScore = 0;
    const matchedTerms: string[] = [];

    searchTerms.forEach((term) => {
      if (!term) return;

      if (item.content.includes(term)) {
        totalScore += 1;
        matchedTerms.push(term);
      }

      if (item.titles?.toLowerCase().includes(term)) {
        totalScore += 2;
      }

      if (item.ayahs?.toLowerCase().includes(term)) {
        totalScore += 1.5;
      }
    });

    if (totalScore > 0) {
      const key = `${item.chapterId}-${item.itemIndex}`;
      if (results.has(key)) {
        const existing = results.get(key)!;
        existing.score += totalScore;
        existing.matches.push(...matchedTerms);
      } else {
        results.set(key, {
          chapterId: item.chapterId,
          itemIndex: item.itemIndex,
          matches: [...new Set(matchedTerms)],
          score: totalScore,
        });
      }
    }
  });

  return Array.from(results.values()).sort((a, b) => b.score - a.score);
};
```

---

### Phase 5: Type Event Listener Hooks
**Priority**: Medium
**Estimated Time**: 45 minutes

#### 5.1 Create Event Types
File: `src/hooks/types/events.d.ts`:

```typescript
// Generic event handler type
export type EventHandler<E extends Event = Event> = (event: E) => void;

// Supported event names
export type WindowEventName = keyof WindowEventMap;

// Event listener options
export interface EventListenerOptions {
  passive?: boolean;
  once?: boolean;
  capture?: boolean;
}
```

#### 5.2 Update useEventListener Hook
File: `src/hooks/utils/useEventListener.ts`:

```typescript
import { useEffect, useRef } from 'react';
import { EventHandler, WindowEventName, EventListenerOptions } from '../types/events';

export function useEventListener<K extends WindowEventName>(
  eventName: K,
  handler: EventHandler<WindowEventMap[K]>,
  element: Window = window
): void;

export function useEventListener<K extends string>(
  eventName: K,
  handler: EventHandler,
  element: EventTarget
): void;

export function useEventListener(
  eventName: string,
  handler: EventHandler,
  element: EventTarget = window
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: Event) => {
      savedHandler.current(event);
    };

    element.addEventListener(eventName, eventListener, { passive: true });

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

export function useCustomEventListener<T = unknown>(
  eventName: string,
  handler: (data: T) => void,
  target: EventTarget = window
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: CustomEvent<T>) => {
      savedHandler.current(event.detail);
    };

    target.addEventListener(eventName, eventListener as EventListener);

    return () => {
      target.removeEventListener(eventName, eventListener as EventListener);
    };
  }, [eventName, target]);
}
```

---

### Phase 6: Add Type Check Script
**Priority**: Low
**Estimated Time**: 10 minutes

#### 6.1 Update package.json
Add type checking script:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "check": "pnpm lint && pnpm type-check && pnpm test:run"
  }
}
```

#### 6.2 Add CI Type Check
Update `.github/workflows/ci.yml`:

```yaml
- name: Type Check
  run: pnpm type-check
```

---

## Testing Plan

### 1. Run Type Checking
```bash
# Before changes
npx tsc --noEmit
# Expected: 42 errors

# After Phase 1
npx tsc --noEmit
# Expected: ~26 errors

# After Phase 2
npx tsc --noEmit
# Expected: ~22 errors

# After Phase 3
npx tsc --noEmit
# Expected: ~14 errors

# After Phase 4
npx tsc --noEmit
# Expected: ~13 errors

# After Phase 5
npx tsc --noEmit
# Expected: ~9 errors

# After Phase 6
npx tsc --noEmit
# Expected: 0 errors ✅
```

### 2. Run Unit Tests
```bash
# Ensure all tests still pass
pnpm test:run
```

### 3. Run E2E Tests
```bash
# Ensure Playwright tests work
pnpm exec playwright test
```

### 4. Build Verification
```bash
# Ensure production build works
NEXT_DISABLE_TURBOPACK=1 pnpm build
```

---

## Success Criteria

✅ **Zero TypeScript errors** when running `npx tsc --noEmit`
✅ **No `any` types** in production code (except in migration utilities where it's unavoidable)
✅ **Proper type coverage** for all components, hooks, and utilities
✅ **All tests pass** with proper type annotations
✅ **Build succeeds** without type errors
✅ **IDE intellisense** works correctly across the codebase

---

## Files to Create/Modify

### New Files to Create:
1. `src/types/testing.d.ts` - Test type declarations
2. `src/types/playwright.d.ts` - Playwright type declarations
3. `src/types/browser.d.ts` - Browser API type declarations
4. `src/hooks/types/events.d.ts` - Event listener types
5. `src/lib/types/migration.ts` - Migration type definitions

### Files to Modify:
1. `src/components/shared/Header.tsx` - Add PWA event types
2. `src/lib/utils/migrate-data.ts` - Add migration types
3. `src/lib/utils/search-index.ts` - Add search result types
4. `src/hooks/utils/useEventListener.ts` - Add event types
5. `src/hooks/utils/useLocalStorage.ts` - Review and type if needed
6. `src/hooks/usePWAInstall.ts` - Add PWA install types
7. `src/components/shared/PWAInstallPrompt.tsx` - Add types
8. `package.json` - Add type-check script
9. All test files in `e2e/` and `src/**/__tests__/` - Fix implicit any

### Import Paths to Fix:
1. `src/lib/utils/__tests__/bookmarks.test.ts`
2. `src/lib/utils/__tests__/search-index.test.ts`

---

## Estimated Total Time

| Phase | Time | Cumulative |
|-------|------|------------|
| Phase 1 | 30 min | 30 min |
| Phase 2 | 45 min | 1h 15min |
| Phase 3 | 1 hour | 2h 15min |
| Phase 4 | 30 min | 2h 45min |
| Phase 5 | 45 min | 3h 30min |
| Phase 6 | 10 min | 3h 40min |
| **Total** | **~3h 40min** | |

---

## Priority Order

1. **Phase 1** - Fix import paths (quick wins)
2. **Phase 2** - Type PWA events (affects user experience)
3. **Phase 3** - Type data migration (core functionality)
4. **Phase 4** - Type search index (key feature)
5. **Phase 5** - Type event listeners (reusable hooks)
6. **Phase 6** - Add type checking to CI (maintenance)

---

## Notes

- Test files can use `@ts-expect-error` for intentional type mismatches when testing error cases
- Migration utilities will always have some `any` usage due to dynamic JSON structure
- Consider using TypeScript's `satisfies` operator where appropriate
- Use `as const` for literal types where possible
- Document all custom types with JSDoc comments

---

**Next Steps**: Start with Phase 1 to fix import paths, then proceed through each phase in order.
