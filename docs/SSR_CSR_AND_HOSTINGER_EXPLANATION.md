# SSR vs CSR Fixes & Hostinger Deployment Guide

## 1. Fixing the SSR vs CSR Mismatch (Hydration Errors)

### The Problem

Hydration errors occur when the HTML generated on the server (SSR) doesn't match the HTML rendered by React on the client (CSR).

**Specific Issue in `ThemeToggle.tsx`:**

- **Server:** Doesn't know the user's local storage preference, so it defaults to one theme (e.g., 'light').
- **Client:** Reads local storage immediately and might switch to 'dark'.
- **Result:** React sees a difference in the class names or attributes and throws a hydration mismatch error.

### The Fix

We used a standard pattern to ensure the component only renders the client-specific state _after_ the component has mounted in the browser.

**Code Breakdown:**

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true); // Only set to true AFTER the first client-side render
}, []);

if (!mounted) {
  return null; // Render NOTHING on the server or first client pass
}

// Render the actual toggle only when we are sure we are on the client
return <button>...</button>;
```

This ensures the server renders "nothing" (or a skeleton), and the client also renders "nothing" initially, matching the server. Then, `useEffect` kicks in, updates the state, and the correct theme button appears without errors.

---

## 2. Is SSR Broken in the Project?

**Short Answer:** No, but it is **disabled** for the purpose of Static Export.

**Detailed Explanation:**

- **Traditional SSR (Server-Side Rendering):** A Node.js server generates HTML for _every single request_ on the fly.
- **Static Export (`output: 'export'`):** Next.js generates HTML for _every page_ **at build time**.

**Current Status:**
By setting `output: 'export'` in `next.config.ts`, we have opted out of runtime SSR (Node.js server) in favor of **SSG (Static Site Generation)**.

- **Pages are still pre-rendered:** You still get the SEO and performance benefits of pre-generated HTML.
- **Difference:** The HTML is generated _once_ when you run `npm run build`, not when a user visits the site.

**Why did we do this?**
To deploy to Hostinger's **Static** hosting (or standard Web Hosting without a Node.js server), which is cheaper, faster, and more reliable for content-heavy sites like this.

---

## 3. The Search Page Refactor

### The Issue

The Search page relied on reading URL search params (`?q=...`).

- In a **Static Export**, pages are pre-built. You cannot pre-build a page for every possible search query.
- Next.js requires components that use `useSearchParams` to be wrapped in a `<Suspense>` boundary during static export, or it will fail the build.

### The Fix

We converted `SearchPage` to a **Client Component** (`'use client'`) and wrapped the logic in `<Suspense>`.

```tsx
// src/app/(routes)/search/page.tsx

export default function SearchPage() {
  return (
    // Suspense boundary allows the static build to finish
    // while waiting for client-side params to be available
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams(); // Safe to use here now
  // ...
}
```

---

## 4. Hostinger Deployment Process Changes

### Old Process (Node.js / VPS)

1.  Upload the entire project code.
2.  Run `npm install`.
3.  Run `npm run build`.
4.  Start a Node.js server (`npm start`).
5.  **Pros:** Dynamic SSR. **Cons:** Complex setup, requires Node.js hosting, higher maintenance.

### New Process (Static Export)

1.  **Local Build:** Run `npm run build` on your machine.
    - This creates an **`out/`** folder.
    - This folder contains pure HTML, CSS, and JS files.
2.  **Upload:** You only upload the contents of the **`out/`** folder to Hostinger's `public_html`.
3.  **Pros:**
    - **Zero Config:** Works on ANY hosting plan (Shared, Cloud, VPS).
    - **Fast:** Serving static files is instant.
    - **Secure:** No server-side code to hack.
    - **Cheap:** Doesn't require a premium Node.js instance.

### Summary of Changes for Hostinger

- **`next.config.ts`:** Added `output: 'export'`.
- **`package.json`:** Updated build script (standard `next build` is fine, it detects the config).
- **`images`:** `next/image` optimization is disabled in static export (unless using a custom loader). We use standard `<img>` tags or a cloud loader if needed.
