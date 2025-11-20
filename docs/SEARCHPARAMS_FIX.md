# Fix for `searchParams` Promise Error

This document outlines the cause of the `Error: Route "/search" used 'searchParams.q'. 'searchParams' is a Promise...` and provides a step-by-step guide to fix it.

## The Problem

In Next.js with the App Router, page components receive a `searchParams` prop. When a page is dynamically rendered, this prop is not a simple object; it's a dynamic API that needs to be handled asynchronously.

The error occurs because the code in `src/app/(routes)/search/page.tsx` attempts to access `searchParams.q` synchronously, as if it were a plain object.

```typescript
// Incorrect usage
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || ''; // This line causes the error
  // ...
}
```

The error message `searchParams is a Promise and must be unwrapped` clearly indicates that we need to resolve this promise before accessing its properties.

## The Fix

The solution is to modify the `SearchPage` component to correctly handle the `searchParams` prop by updating the existing `SearchPageProps` interface. This ensures the component correctly awaits the resolution of the `searchParams` while maintaining the interface definition.

### Step-by-Step Guide to Fix `src/app/(routes)/search/page.tsx`

1.  **Update the `SearchPageProps` interface** to correctly type `searchParams`.
2.  **Safely access the `q` parameter** from `searchParams`, ensuring proper type assertion.

Here is the code transformation:

#### Before Fix

```typescript
// src/app/(routes)/search/page.tsx

interface SearchPageProps {
  searchParams?: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || '';
  // ...
}
```

#### After Fix

```typescript
// src/app/(routes)/search/page.tsx

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams?.q as string) || '';
  // ...
}
```

By applying this change, the component will correctly handle the `searchParams` prop, resolving the dynamic API error.
