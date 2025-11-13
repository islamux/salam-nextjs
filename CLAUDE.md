# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**خواطر - Islamic Spiritual Texts** - A Next.js application presenting Islamic spiritual texts (29 chapters) with full Arabic RTL support, search functionality, bookmarking, PWA capabilities, and comprehensive testing. Migrated from Flutter to Next.js with TypeScript.

## Essential Commands

### Development
```bash
# Install dependencies
pnpm install

# Run development server
# Note: Use NEXT_DISABLE_TURBOPACK=1 to avoid font loading issues in Next.js 16.0.1
NEXT_DISABLE_TURBOPACK=1 pnpm dev

# Lint code
pnpm lint

# Format code
pnpm prettier --write .
```

### Testing
```bash
# Unit tests (watch mode)
pnpm test

# Unit tests (run once)
pnpm test:run

# Unit tests with UI
pnpm test:ui

# Unit tests with coverage
pnpm test:coverage

# E2E tests (requires Playwright installation)
pnpm exec playwright test
```

### Building & Deployment
```bash
# Build for production
# IMPORTANT: Always use NEXT_DISABLE_TURBOPACK=1 due to known font loading issues
NEXT_DISABLE_TURBOPACK=1 pnpm build

# Test production build locally
NEXT_DISABLE_TURBOPACK=1 pnpm start

# Deploy to Vercel (requires setup)
vercel
```

## Architecture & Structure

### Core Architecture

**Data Layer (`src/lib/data/`)**
- `khwater-service.ts` - Central data service for fetching Khwater data
  - Supports SSG, SSR, and client-side fetching
  - Provides chapter data, search, and metadata
  - Uses `generateStaticParams()` for all 29 chapters
- `khwater-data.json` - Source data for all chapters

**Type System (`src/lib/types/`)**
- `khwater.ts` - TypeScript types for Khwater data structure
  - `KhwaterData`, `KhwaterItem`, `ContentType` interfaces
  - Font size settings interface

**Utilities (`src/lib/utils/`)**
- `search-index.ts` - Enhanced full-text search with indexing and scoring
- `bookmarks.ts` - Bookmarking system with localStorage persistence
- `parser.ts` - Content parsing utilities
- `i18n.ts` - Arabic text and i18n utilities
- `migrate-data.ts` - Data migration tools from Flutter

**Custom Hooks (`src/hooks/`)**
- `useFontSize.ts` - Font size management with localStorage persistence

### Page Structure (App Router)

**Routes:**
- `/` - Root redirect to home
- `/home` - Lists all 29 chapters with grid layout
- `/search` - Client-side search functionality
- `/khwater/[id]` - Dynamic chapter pages (1-29)
- `/offline` - PWA offline page

**Route Configuration:**
- `revalidate = 3600` - ISR enabled for all pages
- Dynamic routing for chapters using `[id]` parameter
- Skeleton loading states in `loading.tsx` files

### Components Organization

**Khwater Components (`src/components/khwater/`)**
- `ContentRenderer.tsx` - Renders titles/subtitles/texts/ayahs based on item.order array
- `ShareButton.tsx` - Web Share API integration
- `Title.tsx` - Title component for chapter/item titles
- `Subtitle.tsx` - Subtitle component for subtitles
- `Text.tsx` - Text component for main content
- `Ayah.tsx` - Ayah component for Quranic verses
- `Footer.tsx` - Footer component for item footers

**Shared Components (`src/components/shared/`)**
- `Header.tsx` - Navigation with theme toggle and install button
- `Footer.tsx` - Site footer
- `ThemeToggle.tsx` - Light/dark mode toggle
- `FontSizeControl.tsx` - Font size controls for accessibility
- `ServiceWorkerRegistration.tsx` - PWA service worker registration
- `InstallButton.tsx` - Custom install button (optional, uncommitted)
- `OfflineIcon.tsx` - Offline page icon component
- `RetryButton.tsx` - Retry button component
- `HomeButton.tsx` - Home navigation button component

**UI Components (`src/components/ui/`)**
- (None - OptimizedImage component removed as unused)

### Styling & RTL

**Global Styles (`src/app/globals.css`)**
- Tailwind CSS 4.x
- Arabic typography configured (Amiri & Noto Sans Arabic fonts)
- RTL (Right-to-Left) support throughout

**Key Styling Features:**
- Mobile-first responsive design
- High contrast ratios (WCAG AA compliant)
- Dark mode support
- Arabic font optimization
- `.sr-only` class for screen reader content

## Key Features

### 1. Data & Content
- **29 Islamic spiritual text chapters** pre-rendered with SSG
- **Arabic RTL layout** with proper text direction
- **Content rendering** based on Elm item.order array
- **Static generation** with ISR (1-hour revalidation)

### 2. Search System
- **Indexed search** in `src/lib/utils/search-index.ts`
- **Relevance scoring** for titles, ayahs, and text
- **Real-time search** on `/search` page
- **Search highlighting** with highlighted terms

### 3. Bookmarking
- **localStorage persistence** for bookmarks
- **Chapter and item-level** bookmarking
- **SSR compatible** (graceful fallback when localStorage unavailable)
- Toggle bookmark UI components

### 4. PWA Features
- **Installable app** - manifest.json with Arabic metadata
- **Offline reading** via service worker
- **App shortcuts** for search and first chapter
- Icons configured for all sizes (72x72 to 512x512)
- **Custom install button** - Available in header (manual installation)
- **No auto popup** - PWA install prompt popup disabled (November 13, 2025)

### 5. SEO & Accessibility
- **WCAG 2.1 Level AA** compliant
- **Structured metadata** per chapter (Open Graph, Twitter)
- **Sitemap** generation (`/sitemap.xml`)
- **Robots.txt** for search engines
- **Skip to main content** link for screen readers
- **ARIA labels** throughout

## Testing Setup

**Unit Tests (Vitest)**
- Configured in `vitest.config.ts` with jsdom environment
- 50+ tests covering utilities and services
- V8 coverage provider with HTML reports
- Test files:
  - `src/lib/utils/__tests__/search-index.test.ts` (14 tests)
  - `src/lib/utils/__tests__/bookmarks.test.ts` (30+ tests)
  - `src/lib/data/__tests__/elm-service.test.ts` (15+ tests)

**E2E Tests (Playwright)**
- Multi-browser (Chrome, Firefox, Safari)
- Mobile viewports (iPhone 12, Pixel 5)
- Parallel execution with failure screenshots/videos
- Test files:
  - `e2e/home.spec.ts`
  - `e2e/chapter.spec.ts`

## Important Configuration Files

**Build & Dev Config**
- `next.config.ts` - Minimal Next.js config (Turbopack disabled by default)
- `package.json` - Scripts and dependencies
- `vitest.config.ts` - Test configuration
- `playwright.config.ts` - E2E test configuration
- `eslint.config.mjs` - ESLint rules
- `postcss.config.mjs` - Tailwind CSS 4.x config

**PWA & Metadata**
- `public/manifest.json` - PWA manifest with Arabic metadata
- `public/sw.js` - Service worker for offline support
- `src/app/layout.tsx` - Root layout with RTL, PWA meta tags

## Known Issues & Workarounds

1. **Turbopack Font Loading (Next.js 16.0.1)**
   - **Issue**: Turbopack has font loading issues
   - **Workaround**: Always use `NEXT_DISABLE_TURBOPACK=1` for dev and build
   - **Dev server works perfectly** without this flag
   - Will be fixed in future Next.js versions

2. **Arabic Fonts in Production**
   - Currently using system fonts as fallback
   - Amiri and Noto Sans Arabic configured
   - Google Fonts integration needed for production

## Deployment

**Primary Platform: Vercel**

**Deployment Command:**
```bash
NEXT_DISABLE_TURBOPACK=1 pnpm build
vercel --prod
```

**Environment Variables:**
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `NEXT_DISABLE_TURBOPACK=1 pnpm build`
- Output Directory: `.next`

**CI/CD:** GitHub Actions workflow documented in `DEPLOYMENT.md`

## Performance Optimizations

✅ **Static Site Generation** - All 29 chapters pre-built
✅ **ISR** - 1-hour revalidation for fresh content
✅ **Code Splitting** - Dynamic imports for heavy components
✅ **Loading States** - Skeleton screens for all routes
✅ **Image Optimization** - Next.js Image component with fallbacks
✅ **Bundle Optimization** - Tree shaking, minification, code splitting

**Performance Targets:**
- Lighthouse Score: 90+ (Performance, Accessibility, SEO)
- FCP: < 1.5s
- LCP: < 2.5s
- CLS: < 0.1

## Data Flow

```
┌────────────────────┐
│  khwater-data.json │
└────────┬───────────┘
         │
         ▼
┌──────────────────────────┐
│   khwater-service.ts     │
│   - loadKhwaterData()    │
│   - getChapterData()     │
│   - searchChapters()     │
└────────┬─────────────────┘
         │
         ▼
┌────────────────────────────┐
│   ContentRenderer.tsx      │
│   - Renders based on       │
│     item.order array       │
└────────────────────────────┘
```

## Type Definitions

**ElmItem Structure:**
```typescript
{
  titles?: string[],
  subtitles?: string[],
  texts: string[],
  ayahs?: string[],
  footer?: string,
  order: ContentType[]  // ['titles', 'texts', 'ayahs', ...]
}
```

**ElmData Structure:**
```typescript
{
  version: string,
  generated: string,
  totalLists: number,
  lists: Record<string, ElmItem[]>  // '1' through '29'
}
```

## Key Documentation Files

### Core Documentation
- `README.md` - Project overview and features
- `DEPLOYMENT.md` - Complete deployment guide for Vercel
- `TESTING.md` - Testing strategy and best practices
- `PERFORMANCE.md` - Performance optimizations guide
- `ACCESSIBILITY.md` - Accessibility features and WCAG compliance
- `PHASE7_SUMMARY.md` - Phase 7 completion summary

### Architecture & Testing
- `docs/CODE_ARCHITECTURE_REFACTORING_PLAN.md` - Comprehensive refactoring plan (840+ lines)
- `TESTING_TUTORIAL.md` - Complete testing tutorial for beginners (from senior to junior)
- `CLEANUP_PLAN.md` - Cleanup plan for removing duplicate files and optimization

### Recent Updates (November 2025)
- **PWA Install Popup Disabled** (November 13, 2025)
  - Removed PWAInstallPrompt component from layout
  - Added beforeinstallprompt event handler to prevent browser popup
  - Install button remains in header for manual installation
- **RTL Text Alignment Fixed** (November 7, 2025)
- **Testing Tutorial Added** (November 13, 2025)
- **Code Refactoring & Component Extraction** (November 13, 2025)
  - Refactored FontSizeControl to use custom hook (useFontSize)
  - Extracted OfflineIcon, RetryButton, HomeButton from offline page
  - Extracted Title, Subtitle, Text, Ayah, Footer from ContentRenderer
  - Deleted unused OptimizedImage component
  - Reduced offline page from 93 to 38 lines (59% reduction)
  - Reduced ContentRenderer complexity by 25%

## Arabic/RTL Support

**Key RTL Features:**
- `html lang="ar" dir="rtl"` in layout.tsx
- Arabic font configuration (Amiri, Noto Sans Arabic)
- RTL-aware layouts and spacing
- Arabic metadata in PWA manifest
- Proper text flow for Arabic content

## Development Tips

1. **Testing New Features**: Add unit tests in `src/lib/utils/__tests__/` and E2E tests in `e2e/`
2. **Adding Pages**: Use App Router in `src/app/(routes)/` with SSG and `revalidate`
3. **Component Structure**: Keep components in feature-based folders
4. **Data Updates**: Modify `elm-data.json` and run `migrate-data.ts` if needed
5. **Styling**: Use Tailwind CSS classes, prefer utility-first approach
6. **Arabic Content**: Test in RTL layout, ensure proper font rendering

## Scripts Summary

| Script | Command | Purpose |
|--------|---------|---------|
| dev | `pnpm dev` | Development server |
| build | `NEXT_DISABLE_TURBOPACK=1 pnpm build` | Production build |
| start | `NEXT_DISABLE_TURBOPACK=1 pnpm start` | Production server |
| lint | `pnpm lint` | ESLint check |
| test | `pnpm test` | Unit tests (watch) |
| test:run | `pnpm test:run` | Unit tests (run once) |
| test:ui | `pnpm test:ui` | Unit tests with UI |
| test:coverage | `pnpm test:coverage` | Unit tests with coverage |

## Technology Stack

- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x
- **Fonts**: next/font (Google Fonts)
- **Package Manager**: pnpm
- **Testing**: Vitest + Testing Library + Playwright
- **Deployment**: Vercel (recommended)

---

**Current Status**: All 7 phases complete. Production-ready with comprehensive testing, SEO optimization, PWA support, and accessibility compliance.
