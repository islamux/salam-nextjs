# Code Quality Improvement Plan

## Comprehensive Plan for Best Practices, Clean Code & DRY Principles

> **Project**: Salam Next.js - Khwater Islamic Content  
> **Created**: 2025-11-20  
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
- Modern Next.js 15 App Router
- Centralized translations system
- Good component separation

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
import { useTranslation } from "@/hooks/useTranslation";
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
  import { clsx } from "clsx";
  import { twMerge } from "tailwind-merge";

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

- [ ] **Create design token constants**

  - File: `src/lib/constants/design-tokens.ts`

  ```typescript
  export const COLORS = {
    primary: "blue-600",
    primaryDark: "blue-400",
    // ...
  } as const;

  export const SPACING = {
    section: "mb-8",
    card: "p-6",
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
describe("searchIndex", () => {
  it("should find exact matches", () => {
    const results = searchIndex(mockIndex, "test");
    expect(results).toHaveLength(2);
  });

  it("should handle Arabic text", () => {
    const results = searchIndex(mockIndex, "الله");
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
import type { ChapterMetadata } from "@/lib/types";

// 2. External imports
import Link from "next/link";
import { useState } from "react";

// 3. Internal imports
import { translations } from "@/lib/translations";

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
  primary: "blue-600",
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
  logger.error("Failed to fetch", error);
  throw new DataFetchError("Chapter not found");
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
