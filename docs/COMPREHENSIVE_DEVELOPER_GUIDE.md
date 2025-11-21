# 📚 Comprehensive Developer Guide: Khwater Project

> **A complete guide from Senior to Junior developers**  
> Learn Next.js, TypeScript, and Tailwind CSS through this production-ready Islamic spiritual texts application

**Last Updated:** 2025-11-20  
**Project Version:** 0.1.0  
**Target Audience:** Junior to Senior developers - From Next.js basics to production deployment

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack Fundamentals](#technology-stack-fundamentals)
3. [Getting Started](#getting-started)
4. [Project Architecture](#project-architecture)
5. [Core Concepts Explained](#core-concepts-explained)
6. [Component Breakdown](#component-breakdown)
7. [Data Flow & State Management](#data-flow--state-management)
8. [Styling with Tailwind CSS](#styling-with-tailwind-css)
9. [Common Development Tasks](#common-development-tasks)
10. [Best Practices & Patterns](#best-practices--patterns)
11. [Testing Guide](#testing-guide)
12. [Deployment Guide](#deployment-guide)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What is Khwater?

**Khwater (خواطر)** is a Next.js web application that presents Islamic spiritual reflections and texts. It was migrated from Flutter to create a modern, accessible, and performant web experience.

### Key Features

- **29 Chapters** of spiritual content in Arabic
- **Server-Side Rendering (SSR)** for optimal performance and SEO
- **Search Functionality** across all content
- **Progressive Web App (PWA)** with offline support
- **Dark/Light Theme** with persistent user preferences
- **Responsive Design** for all device sizes
- **RTL Support** for Arabic text
- **Accessibility** compliant with WCAG 2.1 AA

### Project Goals

1. Deliver rich Arabic content with beautiful typography
2. Ensure fast loading and excellent performance
3. Provide an accessible experience for all users
4. Maintain clean, maintainable code architecture

---

## 🛠️ Technology Stack Fundamentals

### Next.js 16.0.1

**What is Next.js?**
Next.js is a React framework that provides:

- **Server-Side Rendering (SSR)** - Generate HTML on the server for better SEO and initial load
- **Static Site Generation (SSG)** - Pre-render pages at build time
- **File-based Routing** - Automatic routing based on file structure
- **API Routes** - Built-in backend capabilities

**Why Next.js for this project?**

- Excellent SEO for spiritual content discovery
- Fast initial page loads with SSR/SSG
- Built-in optimization for images and fonts
- Great developer experience

### TypeScript 5.9.3

**What is TypeScript?**
TypeScript is JavaScript with type safety:

```typescript
// JavaScript (no types)
function getChapter(id) {
  return chapters[id];
}

// TypeScript (with types)
function getChapter(id: string): KhwaterItem[] {
  return chapters[id];
}
```

**Benefits:**

- Catch errors before runtime
- Better IDE autocomplete and intellisense
- Self-documenting code
- Easier refactoring

### Tailwind CSS 4.x

**What is Tailwind CSS?**
A utility-first CSS framework:

```html
<!-- Traditional CSS -->
<div class="chapter-card">...</div>
<style>
  .chapter-card {
    padding: 1.5rem;
    background: white;
  }
</style>

<!-- Tailwind CSS -->
<div class="p-6 bg-white">...</div>
```

**Benefits:**

- Rapid UI development
- Consistent design system
- No CSS naming conflicts
- Small production bundle (unused styles removed)

### React 19.2.0

React is the UI library that powers Next.js. You'll use:

- **Components** - Reusable UI pieces
- **Hooks** - State and side effects (`useState`, `useEffect`)
- **Server Components** - New in Next.js 13+ for better performance

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required versions
Node.js: 20.x or higher
pnpm: 9.x or higher
Git: Latest version

# Verify installations
node -v    # Should show v20.x.x
pnpm -v    # Should show 9.x.x
git --version
```

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd salam-nextjs

# 2. Install dependencies
pnpm install

# 3. Run development server (Note: Disable Turbopack due to font issues)
NEXT_DISABLE_TURBOPACK=1 pnpm dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Available Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
prettier --write .    # Format code

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once
pnpm test:coverage    # Generate coverage report
pnpm test:ui          # Open Vitest UI
```

---

## 📁 Project Architecture

### Directory Structure

```
salam-nextjs/
├── public/                    # Static assets
│   ├── khwater/              # JSON data files
│   │   ├── index.json        # Chapter index
│   │   ├── 1.json - 29.json  # Individual chapters
│   ├── icons/                # PWA icons
│   └── manifest.json         # PWA manifest
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (routes)/         # Route group (doesn't affect URL)
│   │   │   ├── home/         # Home page
│   │   │   ├── khwater/[id]/ # Dynamic chapter pages
│   │   │   └── search/       # Search page
│   │   ├── layout.tsx        # Root layout (shell)
│   │   ├── page.tsx          # Root page (redirects)
│   │   ├── globals.css       # Global styles
│   │   ├── robots.ts         # SEO robots.txt
│   │   └── sitemap.ts        # SEO sitemap
│   │
│   ├── components/           # React components
│   │   ├── home/             # Home page components
│   │   ├── khwater/          # Chapter page components
│   │   ├── search/           # Search components
│   │   ├── shared/           # Reusable components
│   │   └── ui/               # Base UI components
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useTheme.ts       # Theme management
│   │   └── useFontSize.ts    # Font size control
│   │
│   └── lib/                  # Core application logic
│       ├── data/             # Data fetching services
│       │   └── khwater-service.ts
│       ├── types/            # TypeScript interfaces
│       │   └── khwater.ts
│       ├── utils/            # Utility functions
│       │   └── search-index.ts
│       └── translations.ts   # i18n translations
│
├── docs/                     # Documentation
├── e2e/                      # End-to-end tests
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
└── next.config.ts            # Next.js configuration
```

### Architecture Patterns

**1. Server-First Architecture**

- Pages are Server Components by default (faster, better SEO)
- Client Components only when needed (interactivity)

**2. Service Layer Pattern**

- `khwater-service.ts` handles all data operations
- Components don't access data directly

**3. Component Organization**

- Domain-specific components in feature folders
- Shared components for reuse
- UI components for base elements

---

## 💡 Core Concepts Explained

### 1. Server vs Client Components

**Server Components (Default):**

```typescript
// src/app/(routes)/home/page.tsx
// No 'use client' = Server Component
export default async function HomePage() {
  const chapters = await getAllChapters(); // Fetch on server
  return <div>{/* Render */}</div>;
}
```

**Benefits:**

- Run on server, send HTML to client
- Can directly access databases/files
- Zero JavaScript sent to browser
- Better performance and SEO

**Client Components:**

```typescript
// src/components/shared/ThemeToggle.tsx
'use client'; // Required for interactivity

import { useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  return <button onClick={() => setTheme('dark')}>Toggle</button>;
}
```

**When to use:**

- Need useState, useEffect, or other hooks
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)

### 2. File-Based Routing

Next.js creates routes from your file structure:

```
app/
├── (routes)/
│   ├── home/
│   │   └── page.tsx          → /home
│   ├── khwater/
│   │   └── [id]/
│   │       └── page.tsx      → /khwater/1, /khwater/2, etc.
│   └── search/
│       └── page.tsx          → /search
```

**Special Files:**

- `page.tsx` - Page component (required for route)
- `layout.tsx` - Shared layout wrapper
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 page

### 3. Dynamic Routes

```typescript
// app/(routes)/khwater/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>; // Dynamic segment
}

export default async function ChapterPage({ params }: PageProps) {
  const { id } = await params;
  const chapter = await getChapterData(id);
  return <div>{/* Render chapter */}</div>;
}

// Generate static pages at build time
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    // ... up to 29
  ];
}
```

### 4. Data Fetching Strategies

**Static Site Generation (SSG):**

```typescript
// Generated at build time, cached
export default async function Page() {
  const data = await fetchData(); // Runs at build
  return <div>{data}</div>;
}
```

**Incremental Static Regeneration (ISR):**

```typescript
// Regenerate every hour
export const revalidate = 3600;

export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**Server-Side Rendering (SSR):**

```typescript
// Fresh data on every request
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await fetchData(); // Runs per request
  return <div>{data}</div>;
}
```

### 5. TypeScript Interfaces

**Why Types Matter:**

```typescript
// src/lib/types/khwater.ts

// Content can be: title, subtitle, text, ayah, or footer
export type ContentType = 'title' | 'subtitle' | 'text' | 'ayah' | 'footer';

// Each content item structure
export interface KhwaterItem {
  title?: string;
  subtitle?: string;
  text?: string;
  ayah?: string;
  footer?: string;
  order: ContentType[]; // Order to render content
  detailedOrder?: DetailedOrderItem[];
}

// Chapter metadata
export interface ChapterMetadata {
  id: string;
  title: string;
  chapterTitle: string;
  description: string;
  itemCount: number;
}
```

**Using Types:**

```typescript
// Type-safe function
async function getChapterData(id: string): Promise<KhwaterItem[]> {
  // Implementation
}

// TypeScript ensures we use it correctly
const items: KhwaterItem[] = await getChapterData('1');
console.log(items[0].title); // ✓ OK
console.log(items[0].invalid); // ✗ Error: Property doesn't exist
```

---

## 🧩 Component Breakdown

### Key Components Explained

#### 1. ContentRenderer

**Purpose:** Renders different content types (title, text, ayah, etc.)

```typescript
// src/components/khwater/ContentRenderer.tsx
'use client';

export default function ContentRenderer({ item }: { item: KhwaterItem }) {
  const renderByOrder = () => {
    return item.order.map((type, index) => {
      switch (type) {
        case 'title':
          return <Title key={index} text={item.title} />;
        case 'text':
          return <Text key={index} text={item.text} />;
        case 'ayah':
          return <Ayah key={index} text={item.ayah} />;
        // ... other types
      }
    });
  };

  return <div>{renderByOrder()}</div>;
}
```

**Key Concepts:**

- Uses `item.order` array to determine render sequence
- Delegates to specialized components (Title, Text, Ayah)
- Client component for font size adjustments

#### 2. Header Component

**Purpose:** Navigation and controls

```typescript
// src/components/shared/Header.tsx
'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <HomeButton />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <FontSizeControl />
          <InstallButton />
        </div>
      </nav>
    </header>
  );
}
```

#### 3. ThemeToggle

**Purpose:** Switch between light and dark modes

```typescript
// src/components/shared/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';

const THEME_KEY = 'elm-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) setTheme(saved as 'light' | 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

**Key Concepts:**

- `useState` for component state
- `useEffect` for side effects (reading localStorage)
- `localStorage` for persistence
- Toggles `dark` class on `<html>` element

---

## 🔄 Data Flow & State Management

### Data Service Layer

All data operations go through `khwater-service.ts`:

```typescript
// src/lib/data/khwater-service.ts

// Load index (list of chapters)
export const loadIndex = async (): Promise<KhwaterIndex> => {
  if (typeof window === 'undefined') {
    // Server: use dynamic import
    const data = await import('../../../public/khwater/index.json');
    return data.default;
  }
  // Client: use fetch
  const response = await fetch('/khwater/index.json');
  return response.json();
};

// Load chapter by ID
export const loadChapterData = async (id: string): Promise<KhwaterItem[]> => {
  if (typeof window === 'undefined') {
    const data = await import(`../../../public/khwater/${id}.json`);
    return data.default.items;
  }
  const response = await fetch(`/khwater/${id}.json`);
  const data = await response.json();
  return data.items;
};

// Get all chapters with metadata
export const getAllChapters = async () => {
  const index = await loadIndex();
  // ... process and return chapter list
};

// Search across all chapters
export const searchChapters = async (query: string) => {
  const allKhwater = await loadAllKhwaterData();
  // ... perform search and return results
};
```

**Why This Pattern?**

- Single source of truth for data operations
- Easy to swap data sources (API, database, etc.)
- Consistent error handling
- Server/client compatibility

### Client State

**Local State (Component-specific):**

```typescript
const [fontSize, setFontSize] = useState(16);
const [theme, setTheme] = useState('light');
```

**Persistent State (Survives refresh):**

```typescript
// Save to localStorage
localStorage.setItem('elm-theme', theme);
localStorage.setItem('elm-fontSize', fontSize.toString());

// Load on component mount
useEffect(() => {
  const saved = localStorage.getItem('elm-theme');
  if (saved) setTheme(saved);
}, []);
```

---

## 🎨 Styling with Tailwind CSS

### Basic Concepts

**Utility Classes:**

```html
<!-- Padding -->
<div class="p-4">
  <!-- padding: 1rem (16px) -->
  <div class="px-6 py-3">
    <!-- padding-left/right: 1.5rem, top/bottom: 0.75rem -->

    <!-- Colors -->
    <div class="bg-blue-600 text-white">
      <!-- Flexbox -->
      <div class="flex items-center justify-between">
        <!-- Responsive -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <!-- Mobile: 1 column, Tablet: 3 columns, Desktop: 4 columns -->
        </div>
      </div>
    </div>
  </div>
</div>
```

### Dark Mode

Tailwind includes built-in dark mode:

```html
<!-- Light mode: white bg, dark text -->
<!-- Dark mode: gray-800 bg, gray-100 text -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"></div>
```

The `dark:` prefix applies styles only when `<html>` has class="dark".

### RTL Support

For Arabic text direction:

```html
<!-- Margin right in LTR, margin left in RTL -->
<div class="mr-4 rtl:mr-0 rtl:ml-4">
  <!-- Automatic text alignment -->
  <div class="text-right" dir="rtl"></div>
</div>
```

### Custom Styles

**CSS Variables (globals.css):**

```css
:root {
  --font-amiri: 'Amiri', 'Scheherazade New', serif;
  --font-noto-arabic: 'Noto Sans Arabic', sans-serif;
}

@theme inline {
  --font-arabic: var(--font-amiri), serif;
  --font-arabic-sans: var(--font-noto-arabic), sans-serif;
}

.arabic-title {
  font-family: var(--font-amiri), serif;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.6;
}
```

**Usage:**

```html
<h1 class="arabic-title">خواطر</h1>
<p class="font-arabic">النص العربي</p>
```

---

## ⚙️ Common Development Tasks

### Task 1: Add a New Page

1. **Create route folder:**

```bash
mkdir -p src/app/(routes)/about
```

2. **Create page.tsx:**

```typescript
// src/app/(routes)/about/page.tsx
export const metadata = {
  title: 'About - Khwater',
  description: 'About this project',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Khwater</h1>
      <p>This is an Islamic spiritual texts application...</p>
    </div>
  );
}
```

3. **Add navigation link:**

```typescript
// src/components/shared/Header.tsx
<Link href="/about">About</Link>
```

### Task 2: Create a New Component

1. **Create component file:**

```typescript
// src/components/shared/MyButton.tsx
'use client'; // Only if needs interactivity

interface MyButtonProps {
  label: string;
  onClick: () => void;
}

export default function MyButton({ label, onClick }: MyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {label}
    </button>
  );
}
```

2. **Use the component:**

```typescript
import MyButton from '@/components/shared/MyButton';

<MyButton label="Click Me" onClick={() => console.log('Clicked!')} />
```

### Task 3: Add a New Data Field

1. **Update TypeScript interface:**

```typescript
// src/lib/types/khwater.ts
export interface KhwaterItem {
  title?: string;
  subtitle?: string;
  text?: string;
  ayah?: string;
  footer?: string;
  author?: string; // ← New field
  order: ContentType[];
}
```

2. **Update ContentRenderer:**

```typescript
// src/components/khwater/ContentRenderer.tsx
case 'author':
  return <Author key={index} text={item.author} />;
```

3. **Update data files:**

```json
// public/khwater/1.json
{
  "title": "Chapter Title",
  "author": "Author Name",
  "order": ["title", "author", "text"]
}
```

### Task 4: Write a Test

```typescript
// src/lib/utils/__tests__/my-function.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../my-function';

describe('myFunction', () => {
  it('should return correct result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('');
    expect(myFunction(null)).toBe(null);
  });
});
```

Run tests:

```bash
pnpm test
```

---

## ✅ Best Practices & Patterns

### 1. Component Design

**✓ DO:**

- Keep components small and focused
- Use TypeScript interfaces for props
- Separate server and client components
- Use descriptive names

**✗ DON'T:**

- Make components do too many things
- Use `any` type
- Make everything a client component
- Use vague names like `Component1`

### 2. Type Safety

**✓ DO:**

```typescript
interface UserProps {
  name: string;
  age: number;
}

function User({ name, age }: UserProps) {
  return <div>{name} is {age} years old</div>;
}
```

**✗ DON'T:**

```typescript
function User(props: any) { // ← Avoid 'any'
  return <div>{props.name}</div>;
}
```

### 3. Performance

**✓ DO:**

- Use Server Components when possible
- Lazy load heavy components with `dynamic()`
- Optimize images with Next.js Image component
- Use `revalidate` for ISR

**Example:**

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Client-only if needed
});
```

### 4. Accessibility

**✓ DO:**

- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Add ARIA labels for screen readers
- Ensure keyboard navigation works
- Maintain color contrast ratios

**Example:**

```tsx
<button aria-label="Toggle dark mode" onClick={toggleTheme}>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

### 5. Code Organization

```typescript
// ✓ Good: Clear structure
// src/components/search/SearchForm.tsx
// src/components/search/SearchResults.tsx
// src/components/search/NoResults.tsx

// ✗ Bad: Everything in one file
// src/components/search/index.tsx (500 lines)
```

---

## 🧪 Testing Guide

### Unit Tests (Vitest)

Test individual functions and components:

```typescript
// src/lib/utils/__tests__/search-index.test.ts
import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchIndex } from '../search-index';

describe('Search Index', () => {
  const mockData = {
    '1': [{ title: 'Test', text: 'Content', order: ['title', 'text'] }],
  };

  it('builds search index correctly', () => {
    const index = buildSearchIndex(mockData);
    expect(index.entries).toHaveLength(1);
  });

  it('finds matching results', () => {
    const index = buildSearchIndex(mockData);
    const results = searchIndex(index, 'Test');
    expect(results).toHaveLength(1);
    expect(results[0].chapterId).toBe('1');
  });
});
```

### Component Tests

```typescript
// src/components/shared/__tests__/ThemeToggle.test.tsx
import { render, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('toggles theme on click', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
```

### Running Tests

```bash
# Watch mode (recommended during development)
pnpm test

# Run once
pnpm test:run

# With coverage
pnpm test:coverage

# UI mode
pnpm test:ui
```

---

## 🚀 Deployment Guide

### Overview

This section covers deploying your Next.js application to production using Hostinger premium hosting. The deployment process is organized into phases for systematic implementation.

### Prerequisites for Deployment

Before deploying, ensure you have:

- ✅ Hostinger premium hosting account
- ✅ Domain name (included or purchased separately)
- ✅ Production-ready Next.js application
- ✅ Git repository (GitHub/GitLab)
- ✅ Environment variables documented

---

### Phase 1: Initial Hosting Setup

**Timeline: Week 1 (5-7 days)**

#### Task 1.1: Access Your Hosting Account

**Time Required: 30 minutes**

1. Check your email for Hostinger welcome message
2. Note down your:
   - Control Panel (hPanel) login URL: `https://hpanel.hostinger.com`
   - Username
   - Password
3. Log into hPanel and familiarize yourself with the dashboard

**✅ Success Criteria:** You can successfully log into hPanel

#### Task 1.2: Domain Configuration

**Time Required: 1-2 hours**

**If you have an existing domain:**

1. Go to "Domains" section in hPanel
2. Click "Add Domain"
3. Enter your domain name
4. Update nameservers at your domain registrar to:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`
5. Wait 24-48 hours for DNS propagation

**If you need a new domain:**

1. Check if your plan includes a free domain
2. Go to "Domains" → "Register New Domain"
3. Search and register your desired domain
4. Domain will be automatically configured

**✅ Success Criteria:** Domain is added to your hosting account

#### Task 1.3: SSL Certificate Setup

**Time Required: 30 minutes**

1. In hPanel, go to "SSL" section
2. Select your domain
3. Click "Install SSL"
4. Choose "Free SSL" (Let's Encrypt)
5. Wait 10-15 minutes for installation
6. Verify SSL is active (look for padlock icon)

**✅ Success Criteria:** Your domain shows HTTPS with a valid certificate

#### Task 1.4: Email Accounts Setup

**Time Required: 1 hour**

1. Go to "Email" → "Email Accounts"
2. Create professional email addresses:
   - `info@yourdomain.com`
   - `support@yourdomain.com`
   - `admin@yourdomain.com`
3. Set strong passwords (use password generator)
4. Configure email client settings:
   - **IMAP:** `imap.hostinger.com:993` (SSL/TLS)
   - **SMTP:** `smtp.hostinger.com:465` (SSL/TLS)

**✅ Success Criteria:** You can send and receive emails from your custom domain

---

### Phase 2: Application Deployment

**Timeline: Week 2 (5-7 days)**

#### Task 2.1: Prepare Your Next.js Application

**Time Required: 2-4 hours**

1. **Review your project structure:**

```bash
cd /media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam-nextjs
```

2. **Update environment variables:**

Create `.env.production` file:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
# Add your other environment variables
```

3. **Test production build locally:**

```bash
pnpm build
pnpm start
```

4. **Fix any build errors or warnings**

5. **Optimize for production:**
   - Enable image optimization in `next.config.js`
   - Configure caching headers
   - Minimize bundle size

**✅ Success Criteria:** Production build runs successfully on your local machine

#### Task 2.2: Choose Deployment Method

**Time Required: 1 hour**

Hostinger supports multiple deployment methods:

**Option A: Node.js Application Hosting (Recommended)**

Best for full Next.js features (SSR, API routes)

1. In hPanel, go to "Advanced" → "Node.js"
2. Click "Create Application"
3. Configure:
   - Application mode: `Production`
   - Application root: `/public_html`
   - Application URL: `yourdomain.com`
   - Node.js version: `18.x` or higher
   - Entry point: `server.js` or `npm start`

**Option B: Git Deployment**

Best for automatic deployments with version control

1. In hPanel, go to "Advanced" → "Git"
2. Click "Create Repository"
3. Connect your GitHub/GitLab account
4. Select your repository
5. Configure:
   - Branch: `main` or `production`
   - Build command: `pnpm install && pnpm build`
   - Output directory: `.next`

**Option C: FTP/SFTP Upload**

Best for simple static sites or manual control

1. In hPanel, go to "Files" → "FTP Accounts"
2. Note down FTP credentials
3. Use FileZilla or similar FTP client
4. Upload built files to `public_html` directory

**✅ Success Criteria:** You've selected and understand your deployment method

#### Task 2.3: Deploy Your Application

**Time Required: 3-5 hours**

**For Node.js Deployment (Recommended):**

1. **Create a custom server file** (`server.js`):

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

2. **Update `package.json`:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

3. **Upload via Git or FTP:**
   - Push to your Git repository (if using Git deployment)
   - Or upload all files via FTP to `public_html`

4. **Install dependencies on server:**
   - Access SSH (if available in your plan)
   - Or use hPanel terminal

```bash
cd public_html
pnpm install --production
pnpm build
```

5. **Start the application:**
   - In hPanel Node.js section, click "Start Application"
   - Or via terminal: `pnpm start`

6. **Configure reverse proxy** (if needed):
   - In hPanel, go to "Advanced" → "Redirects"
   - Set up proxy from port 3000 to your domain

**✅ Success Criteria:** Your website is live and accessible at your domain

#### Task 2.4: Database Setup (If Needed)

**Time Required: 2-3 hours**

If your application uses a database:

1. **Create MySQL Database:**
   - Go to "Databases" → "MySQL Databases"
   - Click "Create Database"
   - Note down:
     - Database name
     - Username
     - Password
     - Host: usually `localhost`

2. **Import existing data:**
   - Go to "phpMyAdmin"
   - Select your database
   - Click "Import"
   - Upload your SQL dump file

3. **Update environment variables:**

```env
DATABASE_URL=mysql://username:password@localhost:3306/database_name
```

4. **Test database connection:**
   - Run a test query from your application
   - Verify data is accessible

**✅ Success Criteria:** Database is configured and accessible from your application

---

### Phase 3: Optimization & Performance

**Timeline: Week 3 (5-7 days)**

#### Task 3.1: Enable Caching

**Time Required: 1-2 hours**

1. **Browser Caching:**
   - In hPanel, go to "Advanced" → "Cache Manager"
   - Enable "Browser Cache"
   - Set cache duration: 1 month for static assets

2. **Server-Side Caching:**
   - Enable "LiteSpeed Cache" (if available)
   - Configure cache rules in `.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**✅ Success Criteria:** Caching is enabled and working (check with browser dev tools)

#### Task 3.2: CDN Configuration

**Time Required: 2 hours**

1. **Enable Hostinger CDN:**
   - Go to "Performance" → "CDN"
   - Click "Enable CDN"
   - Select regions closest to your target audience

2. **Configure Next.js for CDN:**

Update `next.config.js`:

```javascript
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',
  images: {
    domains: ['cdn.yourdomain.com'],
  },
};
```

**✅ Success Criteria:** Static assets are served from CDN (check network tab)

#### Task 3.3: Image Optimization

**Time Required: 2-3 hours**

1. **Use Next.js Image component:**

Replace all `<img>` tags with `<Image>`:

```jsx
import Image from 'next/image';

<Image src="/path/to/image.jpg" width={800} height={600} alt="Description" loading="lazy" />;
```

2. **Compress existing images:**
   - Use tools like TinyPNG or ImageOptim
   - Aim for <200KB per image

3. **Implement WebP format:**

```jsx
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Description" />
</picture>
```

**✅ Success Criteria:** Images load faster and use less bandwidth

#### Task 3.4: Performance Monitoring Setup

**Time Required: 1-2 hours**

1. **Set up Google Analytics:**
   - Create GA4 property
   - Add tracking code to your Next.js app
   - Install `@next/third-parties` for optimized loading

2. **Configure uptime monitoring:**
   - Use Hostinger's built-in monitoring
   - Or set up UptimeRobot (free)
   - Get alerts if site goes down

3. **Run performance tests:**
   - Test with Google PageSpeed Insights
   - Test with GTmetrix
   - Aim for scores >90

**✅ Success Criteria:** Monitoring tools are active and reporting data

---

### Phase 4: Security & Backup

**Timeline: Week 4 (3-5 days)**

#### Task 4.1: Security Hardening

**Time Required: 2-3 hours**

1. **Enable Firewall:**
   - In hPanel, go to "Security" → "Firewall"
   - Enable "Web Application Firewall (WAF)"
   - Configure rules to block malicious traffic

2. **Set up Cloudflare (Optional but Recommended):**
   - Sign up at cloudflare.com
   - Add your domain
   - Update nameservers to Cloudflare's
   - Enable:
     - DDoS protection
     - SSL/TLS encryption
     - Bot protection

3. **Secure environment variables:**
   - Never commit `.env` files to Git
   - Use hPanel to set environment variables
   - Rotate secrets regularly

4. **Add security headers:**

Create/update `.htaccess`:

```apache
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
```

**✅ Success Criteria:** Security scan shows no major vulnerabilities

#### Task 4.2: Automated Backups

**Time Required: 1 hour**

1. **Enable automatic backups:**
   - Go to "Files" → "Backups"
   - Enable "Automatic Backups"
   - Set frequency: Daily
   - Retention: 30 days (or as per your plan)

2. **Manual backup:**
   - Create a manual backup now
   - Download and store locally
   - Test restoration process

3. **Database backups:**

Set up automated MySQL dumps with a cron job (if available):

```bash
0 2 * * * mysqldump -u username -p'password' database_name > /backup/db_$(date +\%Y\%m\%d).sql
```

**✅ Success Criteria:** Backups are running automatically and can be restored

---

### Phase 5: Email & Communication

**Timeline: Week 5 (2-3 days)**

#### Task 5.1: Professional Email Setup

**Time Required: 2-3 hours**

1. **Configure email forwarding:**
   - Forward `info@` to your main email
   - Set up auto-responders for common queries

2. **Set up email signatures:**
   - Create professional HTML signatures
   - Include:
     - Name and title
     - Company logo
     - Contact information
     - Social media links

3. **Configure SPF, DKIM, DMARC:**
   - In hPanel, go to "Email" → "Email Authentication"
   - Enable all three:
     - SPF: Prevents email spoofing
     - DKIM: Verifies email authenticity
     - DMARC: Defines email handling policy
   - This improves email deliverability

**✅ Success Criteria:** Emails don't go to spam, authentication passes

#### Task 5.2: Transactional Emails

**Time Required: 2 hours**

If your app sends emails (password resets, notifications, etc.):

1. **Configure SMTP in your Next.js app:**

```javascript
// lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: '"Your App" <noreply@yourdomain.com>',
    to,
    subject,
    html,
  });
}
```

2. **Test email sending:**
   - Send a test email
   - Check delivery time
   - Verify formatting

3. **Set up email templates:**
   - Create reusable HTML templates
   - Use a library like `react-email` or `mjml`

**✅ Success Criteria:** Transactional emails are sent successfully

---

### Phase 6: Monitoring & Maintenance

**Timeline: Ongoing**

#### Task 6.1: Set Up Monitoring Dashboard

**Time Required: 2 hours**

1. **Resource monitoring:**
   - Check hPanel dashboard daily
   - Monitor:
     - CPU usage
     - RAM usage
     - Disk space
     - Bandwidth

2. **Application monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor API response times
   - Track user sessions

3. **Create alerts:**
   - Set up email alerts for:
     - High resource usage (>80%)
     - Downtime
     - SSL expiration
     - Backup failures

**✅ Success Criteria:** You receive alerts when issues occur

#### Task 6.2: Regular Maintenance Schedule

**Daily Tasks (5 minutes):**

- Check uptime status
- Review error logs
- Monitor traffic spikes

**Weekly Tasks (30 minutes):**

- Review analytics
- Check backup status
- Update dependencies:
  ```bash
  pnpm update
  ```
- Security scan

**Monthly Tasks (2 hours):**

- Performance audit
- Review and optimize database
- Update SSL certificates (if needed)
- Review and clean up old files
- Analyze costs vs. usage

**Quarterly Tasks (4 hours):**

- Full security audit
- Review and update documentation
- Test disaster recovery
- Optimize hosting plan (upgrade/downgrade as needed)

**✅ Success Criteria:** Site runs smoothly with minimal issues

---

### Deployment Troubleshooting

#### Issue: Site Not Loading

**Solutions:**

1. Check DNS propagation (use dnschecker.org)
2. Verify domain is pointing to correct nameservers
3. Check SSL certificate status
4. Review error logs in hPanel

#### Issue: Slow Performance

**Solutions:**

1. Enable caching
2. Optimize images
3. Use CDN
4. Check resource usage
5. Optimize database queries

#### Issue: Email Not Sending

**Solutions:**

1. Verify SMTP credentials
2. Check SPF/DKIM/DMARC records
3. Review spam folder
4. Test with different email provider

#### Issue: High Resource Usage

**Solutions:**

1. Optimize code
2. Enable caching
3. Use CDN for static assets
4. Consider upgrading plan
5. Check for infinite loops or memory leaks

---

### Success Metrics

Track these metrics to measure deployment success:

1. **Uptime:** Target 99.9%
2. **Page Load Time:** Target <3 seconds
3. **Performance Score:** Target >90 (PageSpeed Insights)
4. **Email Deliverability:** Target >95%
5. **Security Score:** No critical vulnerabilities
6. **Backup Success Rate:** 100%

---

### Deployment Best Practices

**Remember:**

- Take it one phase at a time
- Don't rush through setup
- Document your configuration
- Test everything thoroughly
- Ask for help when stuck
- Keep learning and improving

**Your investment in Hostinger Premium is maximized when you:**

- Use all available features
- Maintain regular backups
- Keep your application optimized
- Monitor performance consistently
- Stay updated with security patches

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Port 3000 already in use"

**Solution:**

```bash
# Option 1: Use different port
pnpm dev -- -p 3001

# Option 2: Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### 2. Fonts not loading in development

**Cause:** Turbopack has font issues in Next.js 16.0.1

**Solution:**

```bash
# Always use this command
NEXT_DISABLE_TURBOPACK=1 pnpm dev
```

#### 3. TypeScript errors

**Solution:**

```bash
# Check for errors
pnpm lint

# Common fix: Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

#### 4. Hydration errors

**Symptoms:** "Text content does not match server-rendered HTML"

**Common causes:**

- Using browser APIs during render (localStorage, window)
- Random values or dates without consistency
- Conditional rendering based on client state

**Solution:**

```typescript
// ✗ Bad: Causes hydration error
export default function Component() {
  const randomId = Math.random(); // Different on server/client
  return <div id={randomId}>...</div>;
}

// ✓ Good: Consistent
export default function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;

  return <div>{/* Now safe to use browser APIs */}</div>;
}
```

#### 5. Search returns no results

**Check:**

1. Data files exist in `public/khwater/`
2. Query is in Arabic (content is Arabic)
3. Try simpler search terms

#### 6. Dark mode doesn't persist

**Solution:** Check localStorage key matches:

```typescript
const THEME_KEY = 'elm-theme'; // Must match everywhere
```

---

## 📚 Additional Resources

### Official Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

### Project-Specific Docs

- [TESTING_TUTORIAL.md](./docs/TESTING_TUTORIAL.md) - Comprehensive testing guide
- [BEST_PRACTICES.md](./docs/BEST_PRACTICES.md) - Code quality guidelines
- [ACCESSIBILITY.md](./docs/ACCESSIBILITY.md) - Accessibility compliance
- [PWA_SUPPORT.md](./docs/PWA_SUPPORT.md) - Progressive Web App features
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide
- [HOSTINGER_DEPLOYMENT_PLAN.md](./HOSTINGER_DEPLOYMENT_PLAN.md) - Detailed Hostinger hosting deployment plan

### Learning Path

**Week 1: Fundamentals**

1. Understand Next.js routing and file structure
2. Learn TypeScript basics (types, interfaces)
3. Get familiar with Tailwind utility classes

**Week 2: Components**

1. Study existing components in `src/components/`
2. Create simple components
3. Learn when to use server vs client components

**Week 3: Data & State**

1. Understand data fetching in `khwater-service.ts`
2. Practice with useState and useEffect
3. Implement localStorage persistence

**Week 4: Advanced**

1. Write tests for your code
2. Optimize performance
3. Ensure accessibility compliance

---

## 🎓 Key Takeaways

### For Junior Developers

1. **Start Small:** Don't try to understand everything at once
2. **Read Code:** The best way to learn is by reading existing code
3. **Ask Questions:** Don't hesitate to ask when stuck
4. **Test Your Changes:** Always test before committing
5. **Follow Patterns:** Use existing code as templates

### Next.js Essentials

- Server Components are default (fast, SEO-friendly)
- Use Client Components for interactivity
- File structure = Route structure
- Fetch data server-side when possible

### TypeScript Benefits

- Catches errors early
- Better IDE experience
- Self-documenting code
- Easier to refactor

### Tailwind CSS Philosophy

- Utility-first approach
- Rapid prototyping
- Consistent design
- No naming conflicts

---

## 🤝 Contributing

When contributing to this project:

1. **Understand the change:** Read relevant documentation
2. **Follow patterns:** Use existing code as examples
3. **Type everything:** No `any` types
4. **Test your code:** Write tests for new features
5. **Update docs:** Keep documentation current

---

## 📞 Getting Help

- **Email:** fathi733@gmail.com
- **GitHub:** [github.com/islamux](https://github.com/islamux)
- **Documentation:** Check the `docs/` folder
- **Issues:** Search existing issues or create new ones

---

**Happy Coding! 🚀**
