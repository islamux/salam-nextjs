# Next.js Hydration Error - Complete Fix Guide

# TO SEE THE SHORT ANSWER suppressHydrationWarning in:src/app/layout.tsx
    <html lang="ar" dir="rtl" suppressHydrationWarning={true}>

## Understanding the Error

**Hydration Error** occurs when the HTML rendered on the server (SSR) doesn't match what React expects on the client side during the hydration process. This is a common issue in Next.js applications that use Server-Side Rendering (SSR) or Static Site Generation (SSG).

### Why It Happens

During SSR/SSG:
1. Next.js renders React components on the server
2. The HTML is sent to the client
3. On the client, React "hydrates" the HTML, attaching event listeners and making it interactive
4. If the server HTML doesn't match what React expects on the client, hydration fails

---

## Common Causes & Solutions

### 1. Server/Client Branch Detection

**❌ Problematic Code:**
```tsx
function Component() {
  if (typeof window !== 'undefined') {
    return <div>Client-side only</div>
  }
  return <div>Server-side</div>
}
```

**✅ Solution:**
Use `useEffect` to handle client-side logic:
```tsx
import { useEffect, useState } from 'react'

function Component() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return <div>Client-side only</div>
}
```

**Alternative - Check initialization:**
```tsx
function Component() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render the same content on both server and client
  return <div>Content</div>
}
```

---

### 2. Dynamic Values That Change on Each Render

**❌ Problematic Code:**
```tsx
function Component() {
  return <div>Current time: {Date.now()}</div>
}

function Component() {
  return <div>Random: {Math.random()}</div>
}
```

**✅ Solution:**
Use `useEffect` for client-side only dynamic values:
```tsx
import { useEffect, useState } from 'react'

function TimeComponent() {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(Date.now().toString())
  }, [])

  return <div>Time: {time}</div>
}

function RandomComponent() {
  const [random, setRandom] = useState(0)

  useEffect(() => {
    setRandom(Math.random())
  }, [])

  return <div>Random: {random}</div>
}
```

---

### 3. Date/Time Formatting with User Locale

**❌ Problematic Code:**
```tsx
function Component() {
  const date = new Date()
  return <div>{date.toLocaleDateString()}</div>
}
```

**✅ Solution:**
- Format on server only, or
- Use the same formatting on both sides

```tsx
import { useEffect, useState } from 'react'

function Component({ serverDate }: { serverDate: string }) {
  const [date, setDate] = useState(serverDate)

  useEffect(() => {
    // Only format on client if needed
    const d = new Date(serverDate)
    setDate(d.toLocaleDateString())
  }, [serverDate])

  return <div>{date}</div>
}
```

**Best practice - Format on server:**
```tsx
// In page component
export async function getServerSideProps() {
  const date = new Date().toLocaleDateString()
  return { props: { date } }
}

function Component({ date }: { date: string }) {
  return <div>{date}</div>
}
```

---

### 4. External Data Without Snapshots

**❌ Problematic Code:**
```tsx
function Component() {
  const [data, setData] = useState(null)

  // This causes hydration mismatch
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  return <div>{data?.title}</div>
}
```

**✅ Solution:**
Provide initial data from server:
```tsx
// With getStaticProps
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return { props: { initialData: data } }
}

function Component({ initialData }) {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    // Update on client if needed
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  return <div>{data?.title}</div>
}
```

---

### 5. Attributes Added by Inline Scripts Before Hydration

**❌ Problematic Code:**
```tsx
// In layout.tsx - inline script adds class before React hydrates
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isDark = localStorage.getItem('theme') === 'dark';
                document.documentElement.classList.toggle('dark', isDark);
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Why it fails:**
- Server renders `<html>` without `className="dark"`
- Inline script runs before React hydrates and adds `class="dark"` to `<html>`
- React expects `<html>` without the class, causing hydration mismatch

**✅ Solution 1 - Use `suppressHydrationWarning`:**
```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isDark = localStorage.getItem('theme') === 'dark';
                document.documentElement.classList.toggle('dark', isDark);
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**✅ Solution 2 - Use React state management (recommended):**
```tsx
'use client'

import { useEffect, useState } from 'react'

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Get theme from localStorage or system preference
    const saved = localStorage.getItem('theme')
    const initial = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  return <>{children}</>
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
```

**✅ Solution 3 - Remove inline script (if using ThemeToggle component):**
```tsx
// Remove the inline script and let ThemeToggle handle it
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  )
}
```

---

### 6. Invalid HTML Tag Nesting

**❌ Problematic Code:**
```tsx
// Invalid: p tag inside p tag
return <p>Text <p>More text</p></p>

// Invalid: block element inside inline element
return <span><div>Content</div></span>
```

**✅ Solution:**
Ensure proper HTML structure:
```tsx
// Correct nesting
return (
  <div>
    <p>Text</p>
    <p>More text</p>
  </div>
)

// Correct inline/block usage
return (
  <span>
    <span>Text</span>
    <span>More text</span>
  </span>
)
```

---

### 7. Using Browser-Only APIs on Server

**❌ Problematic Code:**
```tsx
function Component() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  return <div>{width}</div>
}
```

**✅ Solution:**
Initialize with safe default:
```tsx
function Component() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return <div>{width}px</div>
}
```

Or use a library like `react-use`:
```tsx
import { useWindowSize } from 'react-use'

function Component() {
  const { width } = useWindowSize()
  return <div>{width}px</div>
}
```

---

## Project-Specific Solutions for Khwater

### For HTML Element Hydration Mismatch (Dark Theme Script)

**Your Error:**
```
A tree hydrated but some attributes of the server rendered HTML didn't match
<html lang="ar" dir="rtl" className="dark">  <-- Mismatch here
```

**Root Cause:**
Your `layout.tsx` has an inline script that runs before React hydrates and adds the `dark` class to the HTML element. React's initial render doesn't expect this class, causing a mismatch.

**✅ Solution - Add `suppressHydrationWarning`:**
```tsx
// In src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const THEME_KEY = 'elm-theme';
                  const savedTheme = localStorage.getItem(THEME_KEY);
                  const isDark = savedTheme === 'dark' ||
                    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {
                  // Fallback to light theme
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-arabic min-h-screen flex flex-col bg-white dark:bg-gray-950">
        {/* content */}
      </body>
    </html>
  )
}
```

**Alternative - Remove inline script and let ThemeToggle handle it:**
```tsx
// Remove the script from layout.tsx, the ThemeToggle component will handle theme application
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased font-arabic min-h-screen flex flex-col bg-white dark:bg-gray-950">
        {children}
      </body>
    </html>
  )
}
```

---

### For Font Size Settings

**❌ Problematic:**
```tsx
function FontSizeControl() {
  const [size, setSize] = useState(16)

  useEffect(() => {
    const saved = localStorage.getItem('fontSize')
    if (saved) setSize(parseInt(saved))
  }, [])

  return (
    <input
      type="range"
      min="14"
      max="24"
      value={size}
      onChange={(e) => {
        setSize(parseInt(e.target.value))
        localStorage.setItem('fontSize', e.target.value)
      }}
    />
  )
}
```

**✅ Solution:**
```tsx
import { useEffect, useState } from 'react'

export function FontSizeControl() {
  const [size, setSize] = useState(16)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fontSize')
      if (saved) setSize(parseInt(saved))
    } catch (error) {
      // localStorage not available (SSR)
      console.warn('localStorage not available')
    }
  }, [])

  const handleChange = (value: number) => {
    setSize(value)
    try {
      localStorage.setItem('fontSize', value.toString())
    } catch (error) {
      console.warn('localStorage not available')
    }
  }

  return (
    <input
      type="range"
      min="14"
      max="24"
      value={size}
      onChange={(e) => handleChange(parseInt(e.target.value))}
    />
  )
}
```

**Better - Use custom hook:**
```tsx
// hooks/useFontSize.ts
import { useState, useEffect } from 'react'

export function useFontSize() {
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fontSize')
        if (saved) setFontSize(parseInt(saved))
      } catch (error) {
        console.warn('localStorage not available')
      }
    }
  }, [])

  const updateFontSize = (size: number) => {
    setFontSize(size)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fontSize', size.toString())
      } catch (error) {
        console.warn('localStorage not available')
      }
    }
  }

  return { fontSize, updateFontSize }
}

// Usage
function FontSizeControl() {
  const { fontSize, updateFontSize } = useFontSize()

  return (
    <input
      type="range"
      min="14"
      max="24"
      value={fontSize}
      onChange={(e) => updateFontSize(parseInt(e.target.value))}
    />
  )
}
```

---

### For Bookmark System

**❌ Problematic:**
```tsx
function BookmarkButton({ itemId }: { itemId: string }) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setBookmarked(bookmarks.includes(itemId))
  }, [itemId])

  return (
    <button onClick={() => setBookmarked(!bookmarked)}>
      {bookmarked ? '★' : '☆'}
    </button>
  )
}
```

**✅ Solution:**
```tsx
import { useEffect, useState } from 'react'

function BookmarkButton({ itemId }: { itemId: string }) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
      setBookmarked(bookmarks.includes(itemId))
    } catch (error) {
      console.warn('localStorage not available')
      setBookmarked(false)
    }
  }, [itemId])

  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
      const newBookmarks = bookmarked
        ? bookmarks.filter((id: string) => id !== itemId)
        : [...bookmarks, itemId]

      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
      setBookmarked(!bookmarked)
    } catch (error) {
      console.warn('localStorage not available')
    }
  }

  return (
    <button onClick={toggleBookmark}>
      {bookmarked ? '★' : '☆'}
    </button>
  )
}
```

---

## Debugging Hydration Errors

### 1. Enable React DevTools

React 18+ shows hydration warnings in development:
- Check console for detailed error messages
- Look for mismatched attributes or text content

### 2. Use `suppressHydrationWarning`

For intentional differences (lastUpdated timestamp, etc.):
```tsx
function Timestamp({ date }: { date: string }) {
  return (
    <div suppressHydrationWarning>
      {new Date(date).toLocaleString()}
    </div>
  )
}
```

**Use sparingly** - only for cases where you know the difference is intentional.

### 3. Check for Third-Party Libraries

Some libraries don't handle SSR well:
- Chart libraries (use dynamic imports)
- Libraries that check for `window`
- Date libraries (use server-side equivalents)

**Solution:**
```tsx
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-chartjs-2'), {
  ssr: false,
  loading: () => <div>Loading chart...</div>
})

function Component() {
  return <Chart data={data} />
}
```

### 4. Use `next/dynamic` for Heavy Components

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('../components/HeavyComponent'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>
  }
)
```

---

## Prevention Checklist

- ✅ Initialize state with values that don't change between server and client
- ✅ Use `useEffect` for any code that runs only on the client
- ✅ Format dates/times on the server or pass as props
- ✅ Check for `typeof window !== 'undefined'` in useEffect, not in render
- ✅ Use try-catch when accessing browser APIs (localStorage, sessionStorage)
- ✅ Validate HTML structure (no invalid nesting)
- ✅ Pass data from server to client via props or context
- ✅ Use `suppressHydrationWarning` only when intentional
- ✅ Test with `next dev` (shows errors) and `next build` (production)
- ✅ Use React Developer Tools to inspect hydration warnings

---

## Quick Reference

| Issue | Fix |
|-------|-----|
| `typeof window` check | Move to `useEffect` |
| `Date.now()` | Initialize in `useEffect` |
| `Math.random()` | Initialize in `useEffect` |
| `localStorage` access | Wrap in try-catch, check `typeof window` |
| Date formatting | Format on server or use same method |
| External data | Provide via getServerSideProps/getStaticProps |
| Invalid HTML | Fix nesting structure |
| HTML attributes added by scripts | Add `suppressHydrationWarning` or use React state |
| Browser APIs | Check `typeof window` before use |

---

## Testing for Hydration Errors

### Development Mode
```bash
npm run dev
# Look for hydration warnings in console
```

### Production Build
```bash
npm run build
npm start
# Test in production mode
```

### E2E Testing
```typescript
// Example Playwright test
import { test, expect } from '@playwright/test'

test('no hydration errors', async ({ page }) => {
  const logs: string[] = []
  page.on('console', msg => logs.push(msg.text()))

  await page.goto('/')

  const hydrationErrors = logs.filter(log =>
    log.includes('hydration') ||
    log.includes('did not match')
  )

  expect(hydrationErrors).toHaveLength(0)
})
```

---

## Additional Resources

- [Next.js Hydration Documentation](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration Docs](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Common Next.js Errors](../docs/NEXTJS_COMMON_ERRORS.md)

---

**Remember**: Hydration errors are best caught in development. Always test with `npm run dev` before deploying to production.
