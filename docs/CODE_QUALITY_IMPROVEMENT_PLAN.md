# Code Quality Improvement Plan

## Comprehensive Plan for Best Practices, Clean Code & DRY Principles

> **Project**: Salam Next.js - Khwater Islamic Content  
> **Created**: 2025-11-20  
> **Last Updated**: 2025-11-22  
> **Scope**: Refactor entire codebase to follow senior-level best practices

---

## Executive Summary

This plan transforms the Khwater Next.js application from its current state to a production-ready, maintainable codebase following industry best practices. The project currently has a 70/100 SSR score and contains code quality issues including:

- ❌ React hooks used incorrectly in Server Components
- ❌ Code duplication in translation usage patterns
- ❌ Inconsistent TypeScript type definitions
- ❌ Repeated className patterns without utility abstraction
- ❌ Missing prop type interfaces in several components
- ⚠️ No comprehensive testing strategy

**Timeline**: 4 weeks (20 working days)  
**Effort**: ~80-100 hours total  
**Impact**: Production-ready, maintainable, scalable codebase

---

## Current State Assessment

### ✅ Strengths

- Good SSR/SSG implementation (70/100 score)
- Proper data service layer with caching
- TypeScript throughout the codebase
- Modern Next.js 16.0 App Router
- Centralized translations system
- Good component separation
- **Static build export capability** configured ✅
- **Optimized search index** pre-generation ✅
- **Hostinger deployment ready** with static export ✅

### ❌ Issues Identified

#### 1. Server Component Hook Violation

**Location**: `src/app/(routes)/search/page.tsx`  
**Issue**: Using `useTranslation()` hook in async Server Component  
**Impact**: Runtime errors, breaks SSR
**Priority**: CRITICAL

#### 2. Code Duplication

**Pattern**: Repeated translation imports and usage  
**Files Affected**: 11+ components  
**Impact**: Maintenance burden, inconsistency
**Priority**: HIGH

#### 3. Type Safety Gaps

**Issue**: Missing interfaces, loose typing in several areas  
**Impact**: Runtime errors, poor DX
**Priority**: MEDIUM

#### 4. CSS Duplication

**Pattern**: Repeated Tailwind className strings  
**Impact**: Bundle size, maintenance
**Priority**: MEDIUM

#### 5. No Testing Strategy

**Current**: Basic E2E tests only  
**Missing**: Unit tests, integration tests, coverage reports  
**Priority**: HIGH

---

## Implementation Phases

### Phase 1: Critical Fixes & Foundation (Week 1)

**Duration**: 5 days  
**Focus**: Fix breaking issues, establish patterns

#### Phase 1.1: Fix Server Component Issues (Day 1)

**Priority**: CRITICAL 🔴

**Tasks**:

- [x] **Identify all async Server Components using hooks**
  - Grep search for `'use client'` to map client components
  - Find async functions using hooks
  - Document violations

- [ ] **Fix search page hook violation**
  - File: `src/app/(routes)/search/page.tsx`
  - Replace `useTranslation()` with direct `translations` import
  - Test: Verify search page renders without errors
  - Verify SEO: Check HTML includes search results

- [ ] **Create Server Component guidelines**
  - Document: When to use Server vs Client Components
  - Add to: `docs/CODING_STANDARDS.md` (new file)
  - Include code examples

**Acceptance Criteria**:

- ✅ All Server Components compile without errors
- ✅ Search page returns full HTML with results
- ✅ No React hook errors in console
- ✅ Lighthouse SEO score remains 100

---

#### Phase 1.2: Establish Type System (Days 2-3)

**Priority**: HIGH 🟠

**Tasks**:

- [ ] **Create comprehensive type definitions**
  - File: `src/lib/types/index.ts` (consolidate types)
  - Define strict interfaces for:
    - Component props (PropsWithClassName, PropsWithChildren)
    - API responses
    - Translation keys
    - Theme types
- [ ] **Audit and fix existing types**
  - `src/lib/types/khwater.ts` - Already good ✅
  - Add missing prop interfaces to components
  - Enable strict TypeScript mode

- [ ] **Create type utilities**
  - File: `src/lib/types/utils.ts`
  ```typescript
  // Common type utilities
  export type PropsWithClassName<P = {}> = P & { className?: string };
  export type PropsWithChildren<P = {}> = P & { children: React.ReactNode };
  ```

**Files to Update**:

- `tsconfig.json` - Enable strict mode
- All component files without proper prop types
- `src/lib/translations.ts` - Add strict typing

**Acceptance Criteria**:

- ✅ Zero TypeScript errors with strict mode
- ✅ All components have explicit prop interfaces
- ✅ Autocomplete works for all props in IDE

---

#### Phase 1.3: DRY - Translation Layer (Days 4-5)

**Priority**: HIGH 🟠

**Current Problem**:

```tsx
// ❌ Duplicated in 11+ files
import { useTranslation } from '@/hooks/useTranslation';
const { search, chapter } = useTranslation();
```

**Solution**:

- [ ] **Strategy 1: Server Components**
  - Direct import: `import { translations } from '@/lib/translations'`
  - No hooks needed
  - Better performance

- [ ] **Strategy 2: Create translation utilities**
  - File: `src/lib/utils/translation-helpers.ts`

  ```typescript
  // For server components
  export const t = translations;

  // Type-safe translation getter
  export function getTranslation(key: string) {
    // Implementation
  }
  ```

- [ ] **Update all components**
  - Server components: Use direct import
  - Client components: Keep `useTranslation()` hook
  - Update 11 affected files

**Files to Update**:

1. ✅ `src/components/home/ChapterCard.tsx` - Already correct!
2. ❌ `src/components/shared/Header.tsx`
3. ❌ `src/app/(routes)/search/page.tsx`
4. (+ 8 more files)

**Acceptance Criteria**:

- ✅ No duplicate translation logic
- ✅ Type-safe translation access
- ✅ Clear pattern: Server (direct) vs Client (hook)

---

### Phase 2: Clean Code Principles (Week 2)

**Duration**: 5 days  
**Focus**: Code organization, readability, maintainability

#### Phase 2.1: Component Refactoring (Days 6-8)

**Priority**: MEDIUM 🟡

**Tasks**:

- [ ] **Extract repeated UI patterns**
  - Create: `src/lib/utils/cn.ts` (className utility)

  ```typescript
  import { clsx } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

- [ ] **Create design token constants**
  - File: `src/lib/constants/design-tokens.ts`

  ```typescript
  export const COLORS = {
    primary: 'blue-600',
    primaryDark: 'blue-400',
    // ...
  } as const;

  export const SPACING = {
    section: 'mb-8',
    card: 'p-6',
  } as const;
  ```

- [ ] **Refactor components with repeated patterns**
  - Before: 150+ instances of repeated className strings
  - After: Centralized utilities
  - Target files:
    - `src/components/home/ChapterCard.tsx`
    - `src/components/shared/Header.tsx`
    - `src/components/khwater/*`

- [ ] **Apply Single Responsibility Principle**
  - Break down large components (>150 lines)
  - Extract business logic to custom hooks
  - Example: `Header.tsx` → Extract mobile menu logic

**Acceptance Criteria**:

- ✅ All components under 150 lines
- ✅ className utilities reduce duplication by 60%+
- ✅ Each component has single, clear responsibility

---

#### Phase 2.2: Service Layer Enhancement (Day 9)

**Priority**: MEDIUM 🟡

**Current**: `src/lib/data/khwater-service.ts` is mostly good ✅

**Improvements**:

- [ ] **Add error handling utilities**
  - File: `src/lib/utils/error-handlers.ts`
  - Consistent error messages
  - Type-safe error classes

- [ ] **Implement proper logging**
  - Development vs Production logging
  - Error tracking preparation
  - File: `src/lib/utils/logger.ts`

- [ ] **Add request caching metadata**
  - Use Next.js `unstable_cache`
  - Document cache strategy
  - Add cache invalidation

**Acceptance Criteria**:

- ✅ All errors handled consistently
- ✅ Cache hit rate > 90% for repeat requests
- ✅ Clear logging for debugging

---

#### Phase 2.3: Code Documentation (Day 10)

**Priority**: MEDIUM 🟡

**Tasks**:

- [ ] **Add JSDoc comments to all exported functions**
  - Service layer functions
  - Utility functions
  - Custom hooks
  - Format:

  ```typescript
  /**
   * Searches across all Khwater chapters
   * @param query - Search query string
   * @returns Array of matching chapters with items
   * @example
   * const results = await searchChapters('الله');
   */
  ```

- [ ] **Create README for each major directory**
  - `src/components/README.md`
  - `src/lib/README.md`
  - `src/hooks/README.md`
  - Document purpose, patterns, examples

- [ ] **Update main README with architecture**
  - Add architecture diagram
  - Document folder structure
  - Add contribution guidelines

**Acceptance Criteria**:

- ✅ All public APIs documented
- ✅ New developers can onboard from READMEs
- ✅ Examples for all patterns

---

### Phase 3: Testing Strategy (Week 3)

**Duration**: 5 days  
**Focus**: Comprehensive testing coverage

#### Phase 3.1: Unit Testing Setup (Days 11-12)

**Priority**: HIGH 🟠

**Current**: Vitest already configured ✅

**Tasks**:

- [ ] **Create test utilities**
  - File: `src/test/utils/test-helpers.tsx`
  - Mock providers (theme, translations)
  - Custom render function

  ```typescript
  export function renderWithProviders(ui: ReactElement, options?) {
    // Wrap with necessary providers
  }
  ```

- [ ] **Write utility function tests**
  - Test: `src/lib/utils/search-index.test.ts`
  - Test: `src/lib/data/khwater-service.test.ts`
  - Coverage target: 80%+

- [ ] **Write component unit tests**
  - Priority components:
    - `ChapterCard.test.tsx`
    - `ThemeToggle.test.tsx`
    - `SearchForm.test.tsx`
  - Test props, rendering, interactions

**Test Examples**:

```typescript
// src/lib/utils/__tests__/search-index.test.ts
describe('searchIndex', () => {
  it('should find exact matches', () => {
    const results = searchIndex(mockIndex, 'test');
    expect(results).toHaveLength(2);
  });

  it('should handle Arabic text', () => {
    const results = searchIndex(mockIndex, 'الله');
    expect(results.length).toBeGreaterThan(0);
  });
});
```

**Acceptance Criteria**:

- ✅ 80%+ code coverage on utilities
- ✅ All critical components tested
- ✅ Tests run in <10 seconds

---

#### Phase 3.2: Integration Testing (Days 13-14)

**Priority**: MEDIUM 🟡

**Tasks**:

- [ ] **Test data fetching flows**
  - Test: Server-side search
  - Test: Chapter data loading
  - Test: Error states

- [ ] **Test user workflows**
  - Browse chapters → View chapter
  - Search → View results → View chapter
  - Theme persistence
  - Font size persistence

- [ ] **Test SSR/SSG correctness**
  - Verify HTML includes content
  - Check metadata generation
  - Test static params generation

**Acceptance Criteria**:

- ✅ All user workflows tested
- ✅ SSR verified in tests
- ✅ Error boundaries tested

---

#### Phase 3.3: E2E Enhancement (Day 15)

**Priority**: MEDIUM 🟡

**Current**: Basic Playwright tests exist ✅

**Tasks**:

- [ ] **Expand E2E coverage**
  - Add: Search flow with real queries
  - Add: Navigation between chapters
  - Add: Theme toggle persistence
  - Add: Font size control

- [ ] **Add visual regression tests**
  - Screenshot key pages
  - Compare on changes
  - Tools: Playwright screenshot comparison

- [ ] **Performance testing**
  - Lighthouse CI integration
  - Performance budgets
  - Core Web Vitals tracking

**Acceptance Criteria**:

- ✅ Critical user paths covered
- ✅ Visual regressions caught
- ✅ Performance metrics automated

---

### Phase 4: Advanced Optimizations (Week 4)

**Duration**: 5 days  
**Focus**: Performance, scalability, best practices

#### Phase 4.1: Performance Optimization (Days 16-17)

**Priority**: MEDIUM 🟡

**Tasks**:

- [ ] **Bundle size optimization**
  - Analyze bundle with `@next/bundle-analyzer`
  - Implement code splitting
  - Remove unused dependencies
  - Target: <100KB First Load JS

- [ ] **Image optimization**
  - Audit all images
  - Use Next.js Image component
  - Add proper sizing
  - WebP format

- [ ] **Font optimization**
  - Use `next/font` for Arabic fonts
  - Preload critical fonts
  - Font subsetting

- [ ] **CSS optimization**
  - PurgeCSS configuration
  - Remove unused Tailwind classes
  - Critical CSS extraction

**Acceptance Criteria**:

- ✅ Lighthouse Performance: 95+
- ✅ First Load JS < 100KB
- ✅ LCP < 2s, CLS < 0.1

---

#### Phase 4.2: Accessibility (WCAG 2.1 AA) (Day 18)

**Priority**: MEDIUM 🟡

**Tasks**:

- [ ] **Semantic HTML audit**
  - Proper heading hierarchy
  - ARIA labels where needed
  - Landmark regions

- [ ] **Keyboard navigation**
  - Test all interactive elements
  - Focus management
  - Skip links

- [ ] **Screen reader testing**
  - Test with NVDA/JAWS
  - Arabic content pronunciation
  - Alt text for all images

- [ ] **Contrast & readability**
  - Color contrast checker
  - Min font sizes
  - Focus indicators

**Acceptance Criteria**:

- ✅ WCAG 2.1 AA compliant
- ✅ Lighthouse Accessibility: 100
- ✅ All interactive elements keyboard accessible

---

#### Phase 4.3: Code Quality Automation (Day 19)

**Priority**: MEDIUM 🟡

**Tasks**:

- [ ] **ESLint configuration enhancement**
  - Add `eslint-plugin-react-hooks`
  - Add `eslint-plugin-jsx-a11y`
  - Custom rules for project patterns
  - File: `eslint.config.mjs`

- [ ] **Prettier configuration**
  - Already exists ✅
  - Add pre-commit hook
  - Format all files

- [ ] **Husky + lint-staged setup**

  ```json
  {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
  ```

- [ ] **GitHub Actions CI/CD**
  - Lint on PR
  - Type check on PR
  - Run tests on PR
  - Build verification

**Acceptance Criteria**:

- ✅ No manual linting needed
- ✅ All PRs auto-checked
- ✅ Consistent code style

---

#### Phase 4.4: Documentation & Knowledge Transfer (Day 20)

**Priority**: HIGH 🟠

**Tasks**:

- [ ] **Create comprehensive documentation**
  - `docs/ARCHITECTURE.md` - System architecture
  - `docs/CODING_STANDARDS.md` - Code patterns
  - `docs/TESTING_GUIDE.md` - Testing approach
  - `docs/DEPLOYMENT.md` - Deploy process

- [ ] **Code review checklist**
  - File: `.github/PULL_REQUEST_TEMPLATE.md`
  - Checklist items for reviewers

- [ ] **Component library documentation**
  - Storybook setup (optional)
  - Or: Simple component showcase page

- [ ] **Performance documentation**
  - Document caching strategy
  - CDN configuration
  - Monitoring setup

**Acceptance Criteria**:

- ✅ All patterns documented
- ✅ Onboarding guide complete
- ✅ Future developers can contribute easily

---

## Detailed Task Breakdown by File

### Critical Files to Modify

#### 1. Server Component Fixes

| File                               | Issue                    | Fix                                            | Priority    |
| ---------------------------------- | ------------------------ | ---------------------------------------------- | ----------- |
| `src/app/(routes)/search/page.tsx` | Hook in Server Component | Replace `useTranslation()` with `translations` | CRITICAL 🔴 |

#### 2. Type Safety Improvements

| File                      | Issue              | Fix                 | Priority  |
| ------------------------- | ------------------ | ------------------- | --------- |
| `src/lib/types/index.ts`  | Doesn't exist      | Create common types | HIGH 🟠   |
| `tsconfig.json`           | Not strict         | Enable strict mode  | HIGH 🟠   |
| `src/components/**/*.tsx` | Missing prop types | Add interfaces      | MEDIUM 🟡 |

#### 3. DRY Violations - Translations

| File                               | Current            | After         | Priority    |
| ---------------------------------- | ------------------ | ------------- | ----------- |
| `src/components/shared/Header.tsx` | `useTranslation()` | Keep (client) | HIGH 🟠     |
| `src/app/(routes)/search/page.tsx` | `useTranslation()` | Direct import | CRITICAL 🔴 |
| 9 other files                      | Mixed              | Standardize   | MEDIUM 🟡   |

#### 4. CSS/Styling DRY

| Pattern           | Occurrences | Solution                | Priority  |
| ----------------- | ----------- | ----------------------- | --------- |
| Button classes    | 12+         | Create Button component | MEDIUM 🟡 |
| Card classes      | 8+          | Create Card component   | MEDIUM 🟡 |
| Container classes | 15+         | Utility constant        | MEDIUM 🟡 |

---

## Success Metrics

### Code Quality Metrics

| Metric                   | Current | Target  | Measurement     |
| ------------------------ | ------- | ------- | --------------- |
| TypeScript Coverage      | ~85%    | 100%    | `tsc --noEmit`  |
| Test Coverage            | 0%      | 80%+    | Vitest coverage |
| ESLint Errors            | ~0      | 0       | `pnpm lint`     |
| Bundle Size (First Load) | ~87 KB  | <100 KB | `pnpm build`    |
| Lighthouse Performance   | N/A     | 95+     | Lighthouse CI   |
| Lighthouse SEO           | 100     | 100     | Maintain        |
| Lighthouse Accessibility | N/A     | 100     | Lighthouse      |

### Development Metrics

| Metric             | Current | Target |
| ------------------ | ------- | ------ |
| Build Time         | Fast    | <30s   |
| Hot Reload         | <1s     | <1s    |
| Type Check Time    | ~5s     | <10s   |
| Test Suite Runtime | N/A     | <10s   |

### SSR/Performance Metrics

| Metric    | Current | Target |
| --------- | ------- | ------ |
| SSR Score | 70/100  | 95/100 |
| FCP       | ~1.2s   | <1.5s  |
| LCP       | ~1.8s   | <2.0s  |
| CLS       | ~0.05   | <0.1   |
| TTI       | ~2.8s   | <3.5s  |

---

## Verification Plan

### Automated Verification

#### 1. Unit Tests

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Expected: 80%+ coverage on utils/services
```

#### 2. Type Checking

```bash
# TypeScript strict mode verification
pnpm tsc --noEmit

# Expected: Zero errors
```

#### 3. Linting

```bash
# ESLint verification
pnpm lint

# Expected: Zero errors, zero warnings
```

#### 4. Build Verification

```bash
# Production build
pnpm build

# Verify:
# - All pages build successfully
# - Static generation works for all 29 chapters
# - Bundle size < 100KB First Load
```

#### 5. E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Verify:
# - Search functionality works
# - Chapter navigation works
# - Theme toggle persists
```

### Manual Verification

#### 1. Server Component Fix Verification

**Steps**:

1. Start dev server: `pnpm dev`
2. Navigate to `/search?q=test`
3. View page source (Ctrl+U)
4. Verify: HTML contains search results (not empty)
5. Check console: No React hook errors

**Expected Result**:

- ✅ Page loads without errors
- ✅ Search results visible in HTML source
- ✅ No hydration warnings

#### 2. SSR Verification

**Steps**:

1. Build: `pnpm build`
2. Start: `pnpm start`
3. Open DevTools → Network
4. Navigate to `/khwater/1`
5. Check initial HTML response size
6. Disable JavaScript
7. Reload page

**Expected Result**:

- ✅ Initial HTML contains full content
- ✅ Page works without JavaScript
- ✅ Content visible before JS loads

#### 3. Performance Verification

**Steps**:

1. Build production: `pnpm build`
2. Start: `pnpm start`
3. Run Lighthouse (Desktop)
4. Check Core Web Vitals

**Expected Scores**:

- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

#### 4. Accessibility Verification

**Steps**:

1. Test keyboard navigation (Tab, Enter, Esc)
2. Test screen reader (NVDA/JAWS)
3. Check color contrast
4. Test with browser zoom (200%)

**Expected Result**:

- ✅ All interactive elements keyboard accessible
- ✅ Screen reader announces content correctly
- ✅ Contrast ratios meet WCAG AA
- ✅ Layout doesn't break at 200% zoom

---

## Deployment Strategy Analysis: SSR vs Static on Hostinger

### Overview

For deploying the Salam Next.js application to Hostinger, we have two primary architectural choices: Server-Side Rendering (SSR) or Static Site Generation (SSG/Export).

### 1. Server-Side Rendering (SSR)

- **How it works**: A Node.js server runs the application, generating HTML for each request on the fly.
- **Pros**:
  - **Dynamic Content**: Can render personalized content (e.g., user dashboards) based on cookies/headers.
  - **Real-time Data**: Always shows the latest data without rebuilding.
  - **Middleware**: Supports Next.js middleware for redirects, auth, etc.
- **Cons**:
  - **Hosting Requirements**: Requires a Node.js environment (VPS or Hostinger's Node.js support).
  - **Complexity**: Harder to configure on shared hosting (requires `.htaccess` tweaks, port management).
  - **Performance**: Slower TTFB (Time to First Byte) as the server must render the page.
- **Hostinger Context**: Hostinger's shared hosting supports Node.js, but it can be finicky. You often need to restart the server manually after updates, and resource limits are stricter.

### 2. Static Export (`out` folder)

- **How it works**: Next.js builds all pages into static HTML, CSS, and JS files in the `out` folder.
- **Pros**:
  - **Simplicity**: Works on **any** hosting plan (Shared, Cloud, VPS). Just upload files to `public_html`.
  - **Performance**: Fastest possible delivery (served as static assets).
  - **Reliability**: No server-side code to crash.
  - **Cost**: Can run on the cheapest hosting tiers.
- **Cons**:
  - **No Dynamic Server Logic**: API routes and Middleware are not supported.
  - **Build Time**: Content updates require a full rebuild and re-upload.
- **Hostinger Context**: **Recommended**. Hostinger's file manager handles static files perfectly. It's "upload and forget".

### Recommendation: Static Export

Given that "Khwater Islamic Content" is primarily content-driven and doesn't appear to require real-time user-specific server rendering:

1. **Use the `build:static` script**: This is already configured in `package.json` and `next.config.ts`.
2. **Workflow**:
   - Run `pnpm build:static` locally.
   - The `out` folder is generated.
   - Upload the **contents** of the `out` folder to Hostinger's `public_html` directory.
3. **Search Functionality**: Since API routes don't work in static export, ensure search logic is client-side (using pre-generated indices), which we have already planned.

### Action Plan for Static Deployment

1. **Verify `next.config.ts`**: Ensure `output: 'export'` is conditionally applied (Done).
2. **Verify Image Optimization**: Ensure `images: { unoptimized: true }` is set (Done).
3. **Build**: Run `pnpm build:static`.
4. **Deploy**: Upload `out/` contents to Hostinger.

---

## Risk Assessment & Mitigation

### High-Risk Changes

| Change                        | Risk                        | Mitigation                         |
| ----------------------------- | --------------------------- | ---------------------------------- |
| Enable TypeScript strict mode | May reveal hidden bugs      | Gradual rollout, fix incrementally |
| Refactor translation system   | Could break many components | Comprehensive tests first          |
| Bundle optimization           | Could break production      | Test build thoroughly              |

### Medium-Risk Changes

| Change                | Risk            | Mitigation                |
| --------------------- | --------------- | ------------------------- |
| Component refactoring | Could affect UI | Visual regression tests   |
| Add testing           | Time-consuming  | Prioritize critical paths |

### Dependencies to Add

```json
{
  "devDependencies": {
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@next/bundle-analyzer": "^15.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

---

## Timeline & Milestones

### Week 1: Foundation (Days 1-5)

- **Milestone**: Critical fixes complete, patterns established
- **Deliverables**:
  - ✅ Server component issues fixed
  - ✅ Type system established
  - ✅ Translation DRY implemented
  - ✅ Zero TypeScript errors

### Week 2: Clean Code (Days 6-10)

- **Milestone**: Code refactored, documented
- **Deliverables**:
  - ✅ Components refactored (<150 lines each)
  - ✅ Service layer enhanced
  - ✅ Documentation complete
  - ✅ Reduced code duplication 60%+

### Week 3: Testing (Days 11-15)

- **Milestone**: Comprehensive testing in place
- **Deliverables**:
  - ✅ Unit tests (80%+ coverage)
  - ✅ Integration tests
  - ✅ E2E tests expanded
  - ✅ Visual regression tests

### Week 4: Optimization (Days 16-20)

- **Milestone**: Production-ready, optimized
- **Deliverables**:
  - ✅ Performance optimized (95+ Lighthouse)
  - ✅ Accessibility WCAG AA
  - ✅ CI/CD automation
  - ✅ Complete documentation

---

## Best Practices to Enforce

### 1. Code Organization

```
src/
├── app/           # Next.js app router
├── components/    # React components
│   ├── shared/    # Shared components
│   ├── home/      # Page-specific components
│   └── ui/        # Reusable UI primitives
├── hooks /        # Custom React hooks (client only)
├── lib/
│   ├── data/      # Data fetching services
│   ├── utils/     # Pure utility functions
│   ├── constants/ # Constants & config
│   └── types/     # TypeScript types
└── test/          # Test utilities
```

### 2. Naming Conventions

- **Components**: PascalCase (`ChapterCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CHAPTERS`)
- **Types**: PascalCase with suffix (`ChapterMetadata`)
- **Hooks**: camelCase with `use` prefix (`useFontSize`)

### 3. File Structure

```typescript
// 1. Type imports
import type { ChapterMetadata } from '@/lib/types';

// 2. External imports
import Link from 'next/link';
import { useState } from 'react';

// 3. Internal imports
import { translations } from '@/lib/translations';

// 4. Type definitions
interface ComponentProps {
  // ...
}

// 5. Component implementation
export function Component({}: ComponentProps) {
  // ...
}
```

### 4. Component Patterns

#### Server Component (Default)

```typescript
// No 'use client' directive
// Can be async
// No hooks

export default async function PageComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

#### Client Component (When Needed)

```typescript
'use client';

// Can use hooks
// Cannot be async
// For interactivity

export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### 5. TypeScript Patterns

```typescript
// ✅ Good: Explicit types
interface Props {
  title: string;
  count: number;
  onClick: () => void;
}

// ❌ Bad: Any types
interface Props {
  data: any; // Never use 'any'
}

// ✅ Good: Const assertions
export const COLORS = {
  primary: 'blue-600',
} as const;

// ✅ Good: Discriminated unions
type Result = { success: true; data: Data } | { success: false; error: Error };
```

### 6. Error Handling

```typescript
// ✅ Good: Explicit error handling
try {
  const data = await fetchData();
  return data;
} catch (error) {
  logger.error('Failed to fetch', error);
  throw new DataFetchError('Chapter not found');
}

// ❌ Bad: Silent failures
try {
  const data = await fetchData();
} catch (e) {
  // Silent failure
}
```

---

## Code Review Checklist

Before merging any code, verify:

### Functionality

- [ ] Code works as expected
- [ ] Edge cases handled
- [ ] Error states tested

### Code Quality

- [ ] Follows naming conventions
- [ ] No code duplication (DRY)
- [ ] Single Responsibility Principle
- [ ] Proper TypeScript types

### Performance

- [ ] No unnecessary re-renders
- [ ] Proper memoization where needed
- [ ] Bundle size impact checked

### Testing

- [ ] Unit tests added/updated
- [ ] E2E tests cover changes
- [ ] Manual testing completed

### Documentation

- [ ] JSDoc comments added
- [ ] README updated if needed
- [ ] Breaking changes documented

### Accessibility

- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Proper semantic HTML
- [ ] Color contrast meets WCAG AA

---

## Tools & Technologies

### Development

- **Next.js 15.0**: App Router, SSR/SSG, ISR
- **React 19**: Server/Client Components
- **TypeScript 5.9**: Strict mode
- **Tailwind CSS 4.1**: Utility-first styling

### Testing

- **Vitest 4.0**: Unit/integration testing
- **@testing-library/react**: Component testing
- **Playwright**: E2E testing
- **Lighthouse CI**: Performance monitoring

### Code Quality

- **ESLint 9**: Linting
- **Prettier 3**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit checks

### Bundle Analysis

- **@next/bundle-analyzer**: Bundle size analysis
- **Webpack Bundle Analyzer**: Visual analysis

---

## Static Build for Hostinger Deployment

### Overview

This section describes how to create a static version of the project for deployment on Hostinger premium hosting. The application is fully compatible with static hosting because it uses Static Site Generation (SSG) and client-side features.

### Why Static Export?

**Benefits**:

- ✅ **Hostinger Compatible**: Premium hosting supports static HTML perfectly
- ✅ **Better Performance**: Pre-rendered pages load instantly
- ✅ **Lower Cost**: No need for Node.js hosting
- ✅ **Better SEO**: Full HTML in initial response
- ✅ **CDN Ready**: All files can be cached globally
- ✅ **Zero Runtime Errors**: No server crashes possible

**What Works**:

- ✅ All 29 static chapter pages (pre-generated)
- ✅ Client-side search functionality
- ✅ Theme toggle with localStorage
- ✅ Font size controls
- ✅ Bookmark system (localStorage)
- ✅ PWA capabilities
- ✅ Client-side routing

**What Doesn't Work** (Not used in this app):

- ❌ Server-Side Rendering (SSR) with dynamic data
- ❌ API routes (`/api/*`)
- ❌ Middleware
- ❌ Server Actions
- ❌ Incremental Static Regeneration (ISR)

---

### Phase 1: Build Configuration

#### Task 1: Next.js Configuration

**File**: `next.config.ts`

The configuration supports both SSR and static builds using an environment variable:

```typescript
import type { NextConfig } from 'next';

const isStaticBuild = process.env.BUILD_TYPE === 'static';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    // Add any experimental features here
  },
};

// Apply static export settings only when BUILD_TYPE=static
if (isStaticBuild) {
  nextConfig.output = 'export';
  nextConfig.trailingSlash = true; // Important for hosting compatibility
}

export default nextConfig;
```

**Key Settings Explained**:

- `output: 'export'`: Generates static HTML files
- `trailingSlash: true`: Ensures URLs work on static hosting (e.g., `/khwater/1/` → `khwater/1/index.html`)
- `images.unoptimized: true`: Disables Next.js Image optimization (not available in static export)

**✅ Success Criteria**: Configuration supports both SSR (`pnpm build:ssr`) and static (`pnpm build:static`)

---

#### Task 2: Package Scripts

**File**: `package.json`

The package.json includes dedicated build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "pnpm build:ssr",
    "build:ssr": "next build",
    "build:static": "BUILD_TYPE=static next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest"
  }
}
```

**Scripts Explained**:

- `build:ssr`: Normal Next.js build for Vercel/production with SSR
- `build:static`: Static export for Hostinger (sets `BUILD_TYPE=static`)
- `build`: Default to SSR build

**✅ Success Criteria**: Both build types can be executed independently

---

### Phase 2: Build Optimization

#### Task 3: Pre-generate Search Index

**Current Implementation**: ✅ Already optimized

The project uses a pre-build script to generate a search index, avoiding large bundle sizes:

**File**: `scripts/generate-search-index.js`

This script:

1. Reads all 29 chapter JSON files
2. Extracts searchable text
3. Generates a compact search index
4. Saves to `public/search-index.json`

**Why This Matters**:

- **Before**: Loading all 29 JSON files in client bundle = ~500KB+ JavaScript
- **After**: Small search index = ~50KB, loaded on-demand

**Run manually** (if needed):

```bash
node scripts/generate-search-index.js
```

**✅ Success Criteria**: Search index is generated and search works offline

---

#### Task 4: Font Optimization

**Issue**: Turbopack has font loading issues

**Solution**: Disable Turbopack during build

```bash
# Always use this for production builds
NEXT_DISABLE_TURBOPACK=1 pnpm build:static
```

**Alternative**: The `build:static` script can be updated:

```json
{
  "scripts": {
    "build:static": "NEXT_DISABLE_TURBOPACK=1 BUILD_TYPE=static next build"
  }
}
```

**✅ Success Criteria**: Fonts load correctly in production build

---

### Phase 3: Building for Production

#### Task 5: Create Static Build

**Steps**:

1. **Clean previous builds**:

   ```bash
   rm -rf .next out
   ```

2. **Generate search index** (if modified):

   ```bash
   node scripts/generate-search-index.js
   ```

3. **Build static export**:

   ```bash
   NEXT_DISABLE_TURBOPACK=1 pnpm build:static
   ```

   Or on Windows (PowerShell):

   ```powershell
   $env:NEXT_DISABLE_TURBOPACK="1"
   $env:BUILD_TYPE="static"
   pnpm next build
   ```

4. **Verify output**:

   ```bash
   ls -lh out/
   ```

   Expected structure:

   ```
   out/
   ├── index.html              # Home page
   ├── search/
   │   └── index.html          # Search page
   ├── khwater/
   │   ├── 1/index.html        # Chapter 1
   │   ├── 2/index.html        # Chapter 2
   │   └── ...                 # Chapters 3-29
   ├── _next/
   │   ├── static/             # CSS, JS bundles
   │   └── ...
   ├── images/                 # Static images
   ├── fonts/                  # Web fonts
   └── search-index.json       # Pre-built search index
   ```

**Build Output Analysis**:

Check the build summary:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    8.5 kB         95 kB
├ ○ /khwater/[id]                        142 B          87 kB
└ ○ /search                              5.2 kB         92 kB

○  (Static)  automatically rendered as static HTML
```

**Target Metrics**:

- First Load JS: < 100 KB ✅
- Total page size: < 200 KB
- Build time: < 2 minutes

**✅ Success Criteria**: `out/` directory contains all static files and is under 10 MB total

---

#### Task 6: Test Static Build Locally

Before uploading to Hostinger, test locally:

**Option A: Using Python**:

```bash
cd out
python3 -m http.server 8000
```

**Option B: Using Node.js serve**:

```bash
npx serve out -l 8000
```

**Option C: Using pnpm dlx**:

```bash
pnpm dlx serve out -l 8000
```

**Test Checklist**:

- [ ] Home page loads (http://localhost:8000/)
- [ ] All 29 chapters accessible (/khwater/1/, /khwater/2/, etc.)
- [ ] Search functionality works
- [ ] Theme toggle persists
- [ ] Font size controls work
- [ ] All Arabic text displays correctly
- [ ] Navigation between pages works
- [ ] No console errors

**✅ Success Criteria**: All features work in static build

---

### Phase 4: Deployment to Hostinger

#### Task 7: Prepare for Upload

**What to Upload**: Contents of `out/` directory (not the folder itself)

**Preparation**:

1. **Create deployment archive** (optional, for backup):

   ```bash
   cd out
   tar -czf ../salam-nextjs-static-$(date +%Y%m%d).tar.gz .
   cd ..
   ```

2. **Verify file count**:

   ```bash
   find out -type f | wc -l
   # Should be ~35+ files (29 chapters + assets)
   ```

3. **Check total size**:
   ```bash
   du -sh out/
   # Should be ~5-10 MB
   ```

**✅ Success Criteria**: Deployment package is ready and verified

---

#### Task 8: Upload to Hostinger

**Method 1: FTP Upload (Recommended)**

**Requirements**:

- FTP client (FileZilla, WinSCP, or command-line FTP)
- Hostinger FTP credentials from hPanel

**Steps**:

1. **Get FTP credentials** from hPanel:
   - Go to hPanel → Files → FTP Accounts
   - Note: Hostname, Username, Password, Port (21)

2. **Connect with FileZilla**:
   - Host: `ftp.yourdomain.com` or provided hostname
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21

3. **Navigate to public_html**:
   - Remote site: `/public_html/`
   - **Delete default files** (default.php, index.html)

4. **Upload files**:
   - Local site: Navigate to `out/` directory
   - Select ALL contents (not the `out` folder itself)
   - Drag to `public_html/`
   - Wait for upload to complete

5. **Verify upload**:
   - Check that `index.html` is directly in `public_html/`
   - Check that `_next/` folder exists
   - Check that `khwater/` folder exists with subdirectories

**Method 2: Hostinger File Manager**

**Steps**:

1. **Login to hPanel**
2. **Go to File Manager**
3. **Navigate to public_html**
4. **Delete default files**
5. **Upload Archive**:
   - Click "Upload"
   - Upload the `.tar.gz` archive
   - Right-click → Extract
6. **Move files**:
   - Move all extracted files to `public_html/` root
   - Delete the archive and extraction folder

**Method 3: Git Deployment (Advanced)**

**Steps**:

1. **Enable Git in hPanel**:
   - Go to Advanced → Git
   - Create deployment

2. **Set up GitHub Action** (create `.github/workflows/deploy.yml`):

   ```yaml
   name: Deploy to Hostinger

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20'

         - name: Install pnpm
           uses: pnpm/action-setup@v2
           with:
             version: 8

         - name: Install dependencies
           run: pnpm install

         - name: Generate search index
           run: node scripts/generate-search-index.js

         - name: Build static site
           run: NEXT_DISABLE_TURBOPACK=1 pnpm build:static

         - name: Deploy to Hostinger via FTP
           uses: SamKirkland/FTP-Deploy-Action@4.3.3
           with:
             server: ${{ secrets.FTP_HOST }}
             username: ${{ secrets.FTP_USERNAME }}
             password: ${{ secrets.FTP_PASSWORD }}
             local-dir: ./out/
             server-dir: /public_html/
   ```

3. **Add Secrets** to GitHub repository:
   - Go to Settings → Secrets → Actions
   - Add: `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`

**✅ Success Criteria**: All files uploaded successfully to Hostinger

---

#### Task 9: Configure Hostinger for Optimal Performance

**1. Enable SSL** (if not already):

- hPanel → SSL
- Install Free SSL (Let's Encrypt)
- Enable "Force HTTPS"

**2. Add `.htaccess` for optimization**:

Create `public_html/.htaccess`:

```apache
# Enable GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On

  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"

  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"

  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"

  # HTML (shorter cache for content updates)
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Disable Directory Browsing
Options -Indexes

# Custom Error Pages (optional)
ErrorDocument 404 /index.html
```

**3. Enable Hostinger CDN** (if available):

- hPanel → Performance → CDN
- Enable CDN for faster global delivery

**✅ Success Criteria**: HTTPS enabled, caching configured, security headers active

---

### Phase 5: Verification and Testing

#### Task 10: Post-Deployment Verification

**Test Checklist**:

1. **Basic Functionality**:
   - [ ] Visit https://yourdomain.com
   - [ ] Click on each section (Home, Chapters, Search)
   - [ ] Verify all 29 chapters load correctly
   - [ ] Test search with Arabic text
   - [ ] Test theme toggle (light/dark)
   - [ ] Test font size controls
   - [ ] Add/remove bookmarks
   - [ ] Refresh page - verify settings persist

2. **Cross-Browser Testing**:
   - [ ] Chrome/Edge (Chromium)
   - [ ] Firefox
   - [ ] Safari (if available)
   - [ ] Mobile browsers (Chrome, Safari iOS)

3. **Performance Testing**:
   - Run Google PageSpeed Insights: https://pagespeed.web.dev/
   - Target scores:
     - Performance: 90+
     - Accessibility: 95+
     - Best Practices: 95+
     - SEO: 100

4. **Mobile Responsiveness**:
   - [ ] Test on actual mobile devices
   - [ ] Verify all UI elements are accessible
   - [ ] Check that Arabic text renders properly
   - [ ] Test touch interactions

5. **SEO Verification**:
   - [ ] View page source - verify HTML includes content
   - [ ] Check meta tags are present
   - [ ] Verify canonical URLs
   - [ ] Test with Google Search Console

6. **PWA Testing** (if implemented):
   - [ ] Install as PWA
   - [ ] Test offline functionality
   - [ ] Verify app manifest

**✅ Success Criteria**: All tests pass, site is fully functional

---

### Phase 6: Maintenance and Updates

#### Task 11: Update Workflow

When you need to update the site:

**1. Make Changes Locally**:

```bash
# Make code changes
# Test locally: pnpm dev
```

**2. Test Changes**:

```bash
# Build and test static version
NEXT_DISABLE_TURBOPACK=1 pnpm build:static
pnpm dlx serve out -l 8000
```

**3. Deploy Updates**:

```bash
# Upload new out/ contents to Hostinger
# via FTP or File Manager
```

**4. Verify Deployment**:

- Clear browser cache (Ctrl+Shift+R)
- Test updated functionality
- Check that old cached content is replaced

**Quick Update Script** (create `deploy.sh`):

```bash
#!/bin/bash
set -e

echo "🔨 Building static site..."
NEXT_DISABLE_TURBOPACK=1 pnpm build:static

echo "📦 Creating deployment archive..."
cd out
tar -czf ../deployment-$(date +%Y%m%d-%H%M%S).tar.gz .
cd ..

echo "✅ Deployment package ready!"
echo "📤 Upload 'deployment-*.tar.gz' to Hostinger and extract to public_html/"
```

Make executable:

```bash
chmod +x deploy.sh
```

Run:

```bash
./deploy.sh
```

**✅ Success Criteria**: Updates can be deployed quickly and reliably

---

### Common Issues and Solutions

#### Issue 1: 404 Errors on Direct URL Access

**Symptom**: `/khwater/1/` works when navigating from home, but returns 404 on direct access or refresh

**Cause**: Server not configured for single-page app routing

**Solution 1** - Verify `trailingSlash: true`:

```typescript
// next.config.ts
if (isStaticBuild) {
  nextConfig.output = 'export';
  nextConfig.trailingSlash = true; // ← Must be true
}
```

**Solution 2** - Add to `.htaccess`:

```apache
# Handle trailing slashes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /$1/ [L,R=301]
```

---

#### Issue 2: Images Not Loading

**Symptom**: Images show broken icon

**Cause**: Next.js Image optimization not available in static export

**Solution**: Ensure `images.unoptimized: true` in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ← Required for static export
  },
};
```

Use standard `<img>` tags or Next.js `<Image>` with `unoptimized` prop.

---

#### Issue 3: Search Not Working

**Symptom**: Search returns no results

**Cause**: Search index not generated or not uploaded

**Solution**:

1. Regenerate search index:

   ```bash
   node scripts/generate-search-index.js
   ```

2. Verify `public/search-index.json` exists

3. Rebuild:

   ```bash
   NEXT_DISABLE_TURBOPACK=1 pnpm build:static
   ```

4. Ensure `search-index.json` is in `out/` directory

5. Upload to Hostinger's `public_html/`

---

#### Issue 4: Fonts Not Loading

**Symptom**: Text appears in fallback font

**Cause**: Font files not uploaded or CORS issue

**Solution**:

1. Verify fonts are in `out/fonts/` or `out/_next/static/media/`

2. Check `.htaccess` allows font loading:

   ```apache
   <FilesMatch "\.(ttf|otf|woff|woff2|eot)$">
     Header set Access-Control-Allow-Origin "*"
   </FilesMatch>
   ```

3. Always disable Turbopack:
   ```bash
   NEXT_DISABLE_TURBOPACK=1 pnpm build:static
   ```

---

#### Issue 5: Theme/Settings Not Persisting

**Symptom**: Theme resets on page refresh

**Cause**: localStorage not working or blocked

**Solution**:

1. Check browser console for errors

2. Verify localStorage is supported:

   ```javascript
   if (typeof window !== 'undefined' && window.localStorage) {
     // localStorage is available
   }
   ```

3. Check that HTTPS is enabled (some browsers restrict localStorage on HTTP)

4. Ensure no Content-Security-Policy blocking storage

---

### Build Size Optimization Tips

**Current Build**: ~87 KB First Load JS ✅

**If bundle size increases**:

1. **Analyze bundle**:

   ```bash
   ANALYZE=true pnpm build:static
   ```

2. **Common fixes**:
   - Remove unused dependencies
   - Use dynamic imports for large components
   - Optimize JSON data files
   - Minimize inline styles
   - Use font subsetting for Arabic fonts

3. **Check for duplicates**:
   ```bash
   npx bundle-wizard@latest
   ```

**Target**: Keep First Load JS under 100 KB

---

### Static Export Best Practices

✅ **DO**:

- Use Static Site Generation (SSG) for all pages
- Pre-generate search indexes
- Use client-side state management (localStorage, etc.)
- Optimize images before building
- Test static build locally before deploying
- Use environment variables for configuration
- Version your deployments (keep backups)

❌ **DON'T**:

- Use Server-Side Rendering (SSR) - won't work in static export
- Use API routes - not available
- Use Incremental Static Regeneration (ISR) - requires server
- Use Middleware - requires server
- Use Server Actions - requires server
- Rely on server-side environment variables at runtime

---

### Deployment Checklist

Before each deployment:

- [ ] Run tests: `pnpm test`
- [ ] Lint code: `pnpm lint`
- [ ] Clean build: `rm -rf .next out`
- [ ] Generate search index: `node scripts/generate-search-index.js`
- [ ] Build static: `NEXT_DISABLE_TURBOPACK=1 pnpm build:static`
- [ ] Test locally: `pnpm dlx serve out -l 8000`
- [ ] Verify all features work
- [ ] Check bundle size is under 100 KB
- [ ] Create backup of current live site
- [ ] Upload to Hostinger
- [ ] Clear CDN cache (if using)
- [ ] Test live site
- [ ] Verify HTTPS works
- [ ] Test on mobile devices
- [ ] Run PageSpeed Insights
- [ ] Check Search Console for errors

---

### Performance Optimization for Static Build

#### 1. Image Optimization

**Manual optimization** (since Next.js Image optimization is disabled):

```bash
# Install image optimization tool
pnpm add -D sharp

# Create optimization script
node -e "
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const imageDir = './public/images';
  const files = fs.readdirSync(imageDir);

  for (const file of files) {
    if (file.match(/\.(jpg|png)$/)) {
      const input = path.join(imageDir, file);
      const output = path.join(imageDir, file.replace(/\.(jpg|png)$/, '.webp'));

      await sharp(input)
        .webp({ quality: 80 })
        .toFile(output);

      console.log(\`Optimized \${file} → \${path.basename(output)}\`);
    }
  }
}

optimizeImages();
"
```

#### 2. Font Subsetting

For Arabic fonts, create a subset with only used characters:

```bash
# Install pyftsubset (requires Python)
pip install fonttools brotli

# Create subset (include common Arabic range)
pyftsubset input-font.ttf \
  --unicodes="U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF" \
  --output-file="output-font-subset.woff2" \
  --flavor=woff2
```

#### 3. JSON Minification

Ensure JSON data files are minified:

```bash
# For all JSON files in public/
find public -name "*.json" -exec sh -c '
  jq -c . "$1" > "$1.tmp" && mv "$1.tmp" "$1"
' sh {} \;
```

---

### Monitoring Static Site

#### Set Up Uptime Monitoring

**Free Options**:

1. **UptimeRobot** (uptimerobot.com):
   - Free: 50 monitors, 5-minute intervals
   - Email/SMS alerts

2. **Freshping** (freshping.io):
   - Free: unlimited checks, 1-minute intervals

3. **StatusCake** (statuscake.com):
   - Free: unlimited tests, 5-minute intervals

#### Set Up Analytics

**Google Analytics 4**:

1. Create GA4 property

2. Add to app using `next/script`:

   ```tsx
   // app/layout.tsx
   import Script from 'next/script'

   export default function RootLayout({ children }) {
     return (
       <html>
         <head>
           <Script
             src={\`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX\`}
             strategy="afterInteractive"
           />
           <Script id="google-analytics" strategy="afterInteractive">
             {\`
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', 'G-XXXXXXXXXX');
             \`}
           </Script>
         </head>
         <body>{children}</body>
       </html>
     )
   }
   ```

3. Rebuild and redeploy

---

### Summary

This comprehensive static build guide ensures:

✅ **Optimized Configuration**: Dual-mode support (SSR + Static)  
✅ **Production Ready**: Pre-generated search index, optimized fonts  
✅ **Hostinger Compatible**: Perfect static export with trailing slashes  
✅ **High Performance**: <100KB bundles, optimized caching  
✅ **Easy Deployment**: Clear FTP upload process  
✅ **Maintainable**: Simple update workflow  
✅ **Well Tested**: Comprehensive verification checklist

**Quick Reference**:

```bash
# Build for Hostinger
NEXT_DISABLE_TURBOPACK=1 pnpm build:static

# Test locally
pnpm dlx serve out -l 8000

# Upload 'out/' contents to Hostinger's public_html/
```

**For detailed Hostinger deployment steps**, see: [HOSTINGER_DEPLOYMENT_PLAN.md](file:///media/islamux/Variety/JavaScriptProjects/salam-minimaxm2/salam-nextjs/docs/HOSTINGER_DEPLOYMENT_PLAN.md)

---

## Long-Term Maintenance Strategy

### 1. Continuous Monitoring

- Weekly Lighthouse CI runs
- Bundle size budget alerts
- Error tracking (future: Sentry)
- Performance monitoring (future: Vercel Analytics)

### 2. Regular Audits

- Monthly dependency updates
- Quarterly security audits
- Bi-annual architecture review

### 3. Documentation Updates

- Update docs with new patterns
- Maintain changelog
- Document breaking changes

### 4. Team Knowledge Sharing

- Code review sessions
- Architecture decision records (ADRs)
- Brown bag sessions for new patterns

---

## Appendix

### A. Useful Commands

```bash
# Development
pnpm dev                  # Start dev server
pnpm build                # Production build
pnpm start                # Start production server

# Code Quality
pnpm lint                 # Run ESLint
pnpm lint:fix             # Fix ESLint errors
pnpm format               # Format with Prettier
pnpm type-check           # TypeScript check

# Testing
pnpm test                 # Run unit tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # Coverage report
pnpm test:e2e             # E2E tests

# Analysis
pnpm analyze              # Bundle analysis
```

### B. Key Files Reference

| File                 | Purpose                   |
| -------------------- | ------------------------- |
| `next.config.ts`     | Next.js configuration     |
| `tsconfig.json`      | TypeScript configuration  |
| `eslint.config.mjs`  | ESLint rules              |
| `.prettierrc.json`   | Prettier formatting       |
| `tailwind.config.ts` | Tailwind configuration    |
| `vitest.config.ts`   | Vitest test configuration |

### C. Learning Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Guide](https://vitest.dev/guide/)
- [Web Vitals](https://web.dev/vitals/)

---

## Summary

This comprehensive plan transforms the Khwater Next.js application into a production-ready, maintainable codebase following senior-level best practices:

**Key Improvements**:

- ✅ Fix critical SSR issues
- ✅ Establish strong type safety
- ✅ Eliminate code duplication (DRY)
- ✅ Implement comprehensive testing (80%+ coverage)
- ✅ Optimize performance (95+ Lighthouse)
- ✅ Ensure WCAG AA accessibility
- ✅ Automate code quality checks
- ✅ Complete documentation

**Timeline**: 4 weeks (20 working days)

**Next Steps**:

1. Review and approve this plan
2. Prioritize phase 1 critical fixes
3. Execute phase by phase
4. Regular check-ins and progress reviews
