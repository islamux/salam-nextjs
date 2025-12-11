# Static Build Error Fix

## Problem

After running `pnpm build:static`, the browser shows:

```
Application error: a client-side exception has occurred while loading islamux.me
(see the browser console for more information).
```

## Root Causes

### Issue 1: Server-Side Redirect in Static Build (RESOLVED)

The root page ([src/app/page.tsx](file:///media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam-nextjs/src/app/page.tsx)) uses `redirect()` from `next/navigation`, which is a **server-side only** function that doesn't work with static exports (`output: 'export'`).

**Current code:**

```tsx
// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/home'); // ❌ Crashes in static builds
}
```

### Issue 2: NextRouter Not Mounted (RESOLVED - 2025-11-29)

When implementing the client-side redirect fix, using the **wrong import path** for `useRouter` causes this error:

```
NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
    at Home (src/app/page.tsx:12:27)
```

**Incorrect code:**

```tsx
// src/app/page.tsx
'use client';
import { useRouter } from 'next/router'; // ❌ WRONG - Pages Router API

export default function Home() {
  const router = useRouter(); // ❌ Crashes with "NextRouter was not mounted"
  // ...
}
```

**Root cause:** The App Router (`src/app/`) requires importing from `next/navigation`, not `next/router`.

**Correct code:**

```tsx
// src/app/page.tsx
'use client';
import { useRouter } from 'next/navigation'; // ✅ CORRECT - App Router API

export default function Home() {
  const router = useRouter(); // ✅ Works correctly
  // ...
}
```

> [!IMPORTANT]
> **App Router (`src/app/`)** uses `next/navigation`  
> **Pages Router (`src/pages/`)** uses `next/router`  
> Mixing them will cause runtime errors!

## Solution Options

### Option 1: Meta Refresh (Recommended)

Works without JavaScript, best for static sites.

```tsx
// src/app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirecting...',
};

export default function Home() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/home/" />
      </head>
      <body>
        <p>Redirecting to home page...</p>
      </body>
    </html>
  );
}
```

### Option 2: Client-Side JavaScript Redirect

Requires JavaScript enabled in browser.

```tsx
// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
```

### Option 3: Move Home Content to Root

Eliminate the redirect by moving the home page content directly to the root.

## Testing After Fix

1. **Rebuild static export:**

   ```bash
   pnpm build:static
   ```

2. **Test locally:**

   ```bash
   npx serve out
   ```

3. **Deploy to Hostinger** and verify the site loads without errors.

---

## Best Practice for Dual Deployment (Vercel + Hostinger)

### Platform Differences

| Platform      | Type         | Supports                                         |
| ------------- | ------------ | ------------------------------------------------ |
| **Vercel**    | Full Next.js | SSR, Server Components, API Routes, `redirect()` |
| **Hostinger** | Static Only  | HTML, CSS, JS (no server-side features)          |

### Recommended Solution: Option 2 (Client-Side Redirect)

For deploying to **both platforms simultaneously**, use **Option 2** (Client-Side JavaScript Redirect) because:

✅ **Works on both Vercel AND Hostinger**

- Vercel: Runs smoothly with client components
- Hostinger: Works as static JavaScript

✅ **Single codebase, no conditional logic needed**

✅ **Better UX** than meta refresh on Vercel

#### Implementation

```tsx
// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
```

### Build Commands

**For Vercel (automatic):**

```bash
pnpm build        # Standard Next.js build with all features
```

**For Hostinger (manual):**

```bash
pnpm build:static # Static export to 'out' folder
```

### Alternative: Environment-Based Configuration

If you want to use server-side `redirect()` on Vercel while keeping static compatibility:

```tsx
// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Check if we're in static export mode
  const isStatic = process.env.BUILD_TYPE === 'static';

  if (!isStatic) {
    // Use server-side redirect on Vercel
    redirect('/home');
  }

  // Fallback for static builds (Hostinger)
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/home/" />
      </head>
      <body>
        <p>Redirecting to home page...</p>
      </body>
    </html>
  );
}
```

> [!NOTE]
> This approach is more complex and not necessary. **Option 2** (client-side redirect) is simpler and works everywhere.

---

**Recommended:** Use **Option 2** (Client-Side Redirect) for universal compatibility with both Vercel and Hostinger.
