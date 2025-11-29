# How to Clean Up Next.js Initial Template and Use a Separated Component

This guide explains how to remove the default Next.js template code from `src/app/page.tsx` and replace it with a clean, separated component.

## Step 1: Create Your Component

First, create a new component file. It is best practice to keep your components in a dedicated directory like `src/components`.

**File:** `src/components/HomePage.tsx` (or any name you prefer)

```tsx
import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <p className="mt-4 text-xl">This is my clean, separated component.</p>
    </main>
  );
}
```

## Step 2: Clean and Update `src/app/page.tsx`

Now, open `src/app/page.tsx`. Delete everything in it and replace it with the following code to import and render your new component.

**File:** `src/app/page.tsx`

```tsx
import HomePage from '@/components/HomePage';

export default function Page() {
  return <HomePage />;
}
```

## Summary of Changes

1.  **Created** `src/components/HomePage.tsx` to hold the UI logic.
2.  **Cleared** `src/app/page.tsx` of all default template code (styles, logos, docs links).
3.  **Imported** the `HomePage` component into `src/app/page.tsx` to serve as the main entry point.

This approach keeps your routing logic (`page.tsx`) separate from your UI logic (`HomePage.tsx`), which is a clean and scalable pattern.
