# ESLint Error Solution: `Unexpected any` in `search/page.tsx`

This document provides a solution to the ESLint error `Unexpected any. Specify a different type` found in `src/app/(routes)/search/page.tsx`.

## Problem

The error occurs on line 14 of `src/app/(routes)/search/page.tsx`:

```typescript
const [results, setResults] = useState<any[]>([]);
```

Using `any` is discouraged as it disables TypeScript's type checking, which can lead to bugs.

## Solution

The `results` state should be typed according to the data it receives from the `searchChapters` function. After inspecting `src/lib/data/khwater-service.ts`, we found that `searchChapters` returns an array of objects, where each object has a `chapterId` (string) and `items` (an array of `KhwaterItem`).

To fix this, we need to:
1.  Import the `KhwaterItem` type.
2.  Update the `useState` call with the correct type: `Array<{ chapterId: string; items: KhwaterItem[] }>`.

### Code Changes

Here are the required changes for `src/app/(routes)/search/page.tsx`:

```diff
--- a/src/app/(routes)/search/page.tsx
+++ b/src/app/(routes)/search/page.tsx
@@ -5,12 +5,14 @@
 import { SearchForm } from '@/components/search/SearchForm';
 import { SearchResults } from '@/components/search/SearchResults';
 import { NoResultMessage } from '@/components/search/NoResultMessage';
+import { KhwaterItem } from '@/lib/types/khwater';
 
 function SearchContent() {
   const searchParams = useSearchParams();
   const query = searchParams.get('q') || '';
-  const [results, setResults] = useState<any[]>([]);
+  const [results, setResults] = useState<Array<{ chapterId: string; items: KhwaterItem[] }>>([]);
   const [isSearching, setIsSearching] = useState(false);
   const { search } = translations;
 
```

You can apply this change by replacing the old code block with the new one.
This will resolve the ESLint error and improve the type safety of the component.
