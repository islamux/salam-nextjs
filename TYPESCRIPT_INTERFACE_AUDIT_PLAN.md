# TypeScript Interface Audit & Implementation Plan

**Date:** November 14, 2025
**Project:** خواطر (Khwater) App
**Goal:** 100% TypeScript Interface Coverage with Best Practices

---

## Table of Contents

1. [Why This Matters](#why-this-matters)
2. [Current State Analysis](#current-state-analysis)
3. [Interface Best Practices](#interface-best-practices)
4. [Audit Checklist](#audit-checklist)
5. [Implementation Steps](#implementation-steps)
6. [Files That Need Interfaces](#files-that-need-interfaces)
7. [Interface Templates](#interface-templates)
8. [Enforcement Strategies](#enforcement-strategies)
9. [Quality Gates](#quality-gates)
10. [Maintenance Plan](#maintenance-plan)

---

## Why This Matters

### Benefits of Full Interface Coverage

✅ **Type Safety**
- Compile-time error detection
- Prevents runtime type errors
- Better refactoring confidence

✅ **Developer Experience**
- Auto-completion in IDE
- Inline documentation
- Easier onboarding

✅ **Code Quality**
- Self-documenting code
- Clear API contracts
- Reduced bugs

✅ **Maintainability**
- Single source of truth
- Easier to update
- Consistent patterns

---

## Current State Analysis

### ✅ Already Implemented

**Files WITH interfaces:**
1. `src/components/shared/UI.tsx` - 8 component interfaces ✅
2. `src/components/shared/Skeletons.tsx` - 14 skeleton interfaces ✅
3. `src/hooks/useLocalStorage.ts` - Hook return interface ✅
4. `src/hooks/useFontSize.ts` - Hook return interface ✅

### ⚠️ Need Audit

**Files that LIKELY need interfaces:**
1. **Components** - All React components
   - `src/components/khwater/*` - 7 components
   - `src/components/shared/*` - 5+ components

2. **Pages**
   - `src/app/(routes)/home/page.tsx`
   - `src/app/(routes)/search/page.tsx`
   - `src/app/(routes)/khwater/[id]/page.tsx`
   - `src/app/(routes)/offline/page.tsx`

3. **Hooks**
   - `src/hooks/useTranslation.ts`

4. **Utilities**
   - `src/lib/data/khwater-service.ts`
   - `src/lib/utils/*.ts` - All utility files

5. **Types**
   - `src/lib/types/khwater.ts`

---

## Interface Best Practices

### 1. Naming Conventions

✅ **DO:**
```typescript
// Component props - ComponentName + Props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// Hook return - HookName + Return
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
}

// Service interfaces - Descriptive name
interface KhwaterService {
  loadKhwaterData(): Promise<KhwaterData>;
}

// Event handlers - Handler or on + Action
interface ClickHandler {
  onClick: () => void;
}
```

❌ **DON'T:**
```typescript
// Vague names
interface Props {}
interface Data {}
interface Config {}

// Inconsistent casing
interface button_props {}

// Single letter (except T, K, V for generics)
interface A {}
```

### 2. Export All Interfaces

✅ **Always export interfaces:**
```typescript
// File: Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

export function Button(props: ButtonProps) {
  // ...
}

// Allows reuse in other files
import { ButtonProps } from './Button';
```

### 3. Use Specific Types

✅ **DO:**
```typescript
interface User {
  id: number;           // Specific number
  name: string;         // Specific string
  email: string;        // Specific string
  isActive: boolean;    // Specific boolean
  roles: UserRole[];    // Specific union or enum
}
```

❌ **DON'T:**
```typescript
interface User {
  id: any;              // Too generic
  name: string | null;  // Avoid union unless necessary
  [key: string]: any;   // Index signature if not needed
}
```

### 4. Required vs Optional Props

✅ **Mark optional with ?:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';  // Optional
  size?: 'sm' | 'md' | 'lg';          // Optional
  disabled?: boolean;                  // Optional
  children: React.ReactNode;           // Required
}
```

### 5. Use Union Types for Variants

✅ **DO:**
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant: ButtonVariant;
  size: Size;
}
```

❌ **DON'T:**
```typescript
interface ButtonProps {
  variant: string;  // Too generic
  size: string;     // No type safety
}
```

### 6. Prefer Interfaces for Props

✅ **Use interfaces:**
```typescript
interface ButtonProps {
  onClick: () => void;
}

function Button({ onClick }: ButtonProps) {
  // Clear contract
}
```

### 7. Document Complex Interfaces

✅ **Add JSDoc for complex types:**
```typescript
/**
 * Represents a Khwater item from the data source
 * @property order - Array defining the render order of content types
 * @property titles - Optional array of title strings (Arabic/RTL)
 * @property texts - Required array of content text
 * @property ayahs - Optional array of Quranic verses
 */
interface KhwaterItem {
  order: ContentType[];
  titles?: string[];
  texts: string[];
  ayahs?: string[];
  footer?: string;
}
```

---

## Audit Checklist

### Components Checklist

For **EVERY React component**, check:

- [ ] Has `ComponentNameProps` interface
- [ ] Interface is exported
- [ ] All props are typed
- [ ] Optional props marked with `?`
- [ ] Event handlers properly typed
- [ ] JSX elements properly typed
- [ ] Generic types properly constrained

**Example:**
```typescript
// ✅ Complete
export interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  id?: string;
}

export function Title({ children, level = 1, className, id }: TitleProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  return <Component className={className} id={id}>{children}</Component>;
}
```

### Hooks Checklist

For **EVERY custom hook**, check:

- [ ] Has `HookNameParams` interface (input params)
- [ ] Has `HookNameReturn` interface (return value)
- [ ] Generic types properly constrained
- [ ] Error types defined
- [ ] Loading states typed

**Example:**
```typescript
interface UseBookmarksParams {
  chapterId?: number;
}

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  addBookmark: (item: Bookmark) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

export function useBookmarks(
  params: UseBookmarksParams = {}
): UseBookmarksReturn {
  // Implementation
}
```

### Utilities Checklist

For **EVERY utility/service file**, check:

- [ ] Has interface for input params
- [ ] Has interface for return value
- [ ] Has interface for configuration
- [ ] Error types defined
- [ ] Generic types constrained

**Example:**
```typescript
interface SearchParams {
  query: string;
  chapters?: number[];
  limit?: number;
}

interface SearchResult {
  items: KhwaterItem[];
  total: number;
  score: number;
}

export function searchKhwater(params: SearchParams): SearchResult {
  // Implementation
}
```

---

## Implementation Steps

### Phase 1: High Priority (Week 1)

**Step 1: Audit Components**
```bash
# Find all React components
find src/components -name "*.tsx" -type f

# Create audit list
```

**Step 2: Add Interfaces to Core Components**
Priority order:
1. `src/components/khwater/ContentRenderer.tsx` - Most complex
2. `src/components/khwater/ShareButton.tsx` - Used everywhere
3. `src/components/shared/Header.tsx` - Core layout
4. `src/components/shared/Footer.tsx` - Core layout
5. `src/components/shared/FontSizeControl.tsx` - State management

**Step 3: Add Interfaces to Hooks**
1. `src/hooks/useTranslation.ts`

**Step 4: Test & Validate**
```bash
# Run type check
npx tsc --noEmit

# Run build
NEXT_DISABLE_TURBOPACK=1 pnpm build
```

### Phase 2: Medium Priority (Week 2)

**Step 1: Add Interfaces to Pages**
1. All page components in `src/app/(routes)/`

**Step 2: Add Interfaces to Utilities**
1. `src/lib/data/khwater-service.ts`
2. `src/lib/utils/search-index.ts`
3. `src/lib/utils/bookmarks.ts`
4. Other utils

**Step 3: Review & Improve**
- Refine existing interfaces
- Add missing types
- Update documentation

### Phase 3: Low Priority (Week 3)

**Step 1: Add Interfaces to Remaining Files**
- Loading states
- Error boundaries
- Context providers

**Step 2: Create Type Library**
- Centralize common types
- Create `src/types/` directory
- Export from barrel files

**Step 3: Final Review**
- Complete audit
- Update documentation
- Create style guide

---

## Files That Need Interfaces

### Components (High Priority)

#### `src/components/khwater/ContentRenderer.tsx`
```typescript
// Current: Likely inline types
// Needed:
export interface ContentRendererProps {
  items: KhwaterItem[];
  chapterId: string;
}

export interface ContentItemProps {
  item: KhwaterItem;
  index: number;
}
```

#### `src/components/khwater/ShareButton.tsx`
```typescript
// Current: Likely inline types
// Needed:
export interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
}
```

#### `src/components/khwater/Title.tsx`
```typescript
// Current: Might need enhancement
// Needed:
export interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  id?: string;
}
```

#### `src/components/shared/Header.tsx`
```typescript
// Current: Likely inline types
// Needed:
export interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  className?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}
```

#### `src/components/shared/FontSizeControl.tsx`
```typescript
// Current: Uses hook, might need interface
// Needed:
export interface FontSizeControlProps {
  className?: string;
  showLabel?: boolean;
}
```

### Hooks (High Priority)

#### `src/hooks/useTranslation.ts`
```typescript
// Current: Inline types
// Needed:
export interface TranslationMap {
  [key: string]: string | number | ((...args: any[]) => string);
}

export interface TranslationBundle {
  app: TranslationMap;
  ui: TranslationMap;
  home: TranslationMap;
  search: TranslationMap;
  share: TranslationMap;
  chapter: TranslationMap;
}

export interface UseTranslationReturn {
  app: TranslationMap;
  ui: TranslationMap;
  home: TranslationMap;
  search: TranslationMap;
  share: TranslationMap;
  chapter: TranslationMap;
}
```

### Utilities (Medium Priority)

#### `src/lib/data/khwater-service.ts`
```typescript
// Current: Might need interface
// Needed:
export interface LoadKhwaterDataParams {
  forceRefresh?: boolean;
}

export interface GetChapterDataParams {
  id: string;
}

export interface SearchChaptersParams {
  query: string;
  limit?: number;
}

export interface KhwaterService {
  loadKhwaterData(params?: LoadKhwaterDataParams): Promise<KhwaterData>;
  getChapterData(params: GetChapterDataParams): Promise<KhwaterData>;
  searchChapters(params: SearchChaptersParams): KhwaterItem[];
}
```

#### `src/lib/utils/search-index.ts`
```typescript
// Current: Might need interface
// Needed:
export interface IndexConfig {
  fields: string[];
  boost?: Record<string, number>;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
}

export interface SearchResult {
  item: KhwaterItem;
  score: number;
  matches: string[];
}
```

### Pages (Medium Priority)

#### All Page Components
Each page should have:

```typescript
// Example: src/app/(routes)/home/page.tsx
export interface HomePageProps {
  // If using props (though usually just default export)
}

export interface HomePageMetadata {
  title: string;
  description: string;
}

// Page component
export default function HomePage(props: HomePageProps) {
  // Implementation
}
```

---

## Interface Templates

### React Component Template

```typescript
// Template for React components

export interface ComponentNameProps {
  // Required props (no ?)
  children: React.ReactNode;
  onAction: () => void;

  // Optional props (with ?)
  variant?: 'option1' | 'option2';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  id?: string;
  'data-testid'?: string;
}

/**
 * Component description
 * @param props - Component props
 * @returns JSX element
 */
export function ComponentName({
  children,
  onAction,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  id,
  'data-testid': testId,
}: ComponentNameProps) {
  return (
    <div
      id={id}
      className={className}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
```

### Custom Hook Template

```typescript
// Template for custom hooks

export interface UseHookNameParams {
  param1?: string;
  param2?: number;
  options?: HookOptions;
}

export interface HookOptions {
  enabled?: boolean;
  retry?: boolean;
}

export interface UseHookNameReturn {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook description
 * @param params - Hook parameters
 * @returns Hook return value
 */
export function useHookName(
  params: UseHookNameParams = {}
): UseHookNameReturn {
  const { param1 = 'default', param2 = 0 } = params;

  // Implementation

  return {
    data,
    loading,
    error,
    refetch,
  };
}
```

### Utility Function Template

```typescript
// Template for utility functions

export interface UtilityFunctionParams {
  input: string | number;
  config?: UtilityConfig;
}

export interface UtilityConfig {
  format?: 'json' | 'xml';
  validate?: boolean;
  transform?: boolean;
}

export interface UtilityFunctionReturn {
  result: string;
  success: boolean;
  errors?: string[];
}

/**
 * Function description
 * @param params - Function parameters
 * @returns Function result
 */
export function utilityFunction(
  params: UtilityFunctionParams
): UtilityFunctionReturn {
  const { input, config } = params;

  // Implementation

  return {
    result: '',
    success: true,
  };
}
```

### Service Class Template

```typescript
// Template for service classes

export interface ServiceConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

export interface ServiceMethodParams {
  id: string;
  data?: any;
}

export interface ServiceMethodReturn {
  data: any;
  status: number;
  message?: string;
}

export interface ServiceInterface {
  methodName(params: ServiceMethodParams): Promise<ServiceMethodReturn>;
}

/**
 * Service class description
 */
export class ServiceName implements ServiceInterface {
  private config: ServiceConfig;

  constructor(config: ServiceConfig) {
    this.config = config;
  }

  async methodName(params: ServiceMethodParams): Promise<ServiceMethodReturn> {
    // Implementation
  }
}
```

---

## Enforcement Strategies

### 1. ESLint Rules

Add to `eslint.config.mjs`:

```javascript
// Enforce interface usage
{
  rules: {
    // Require interface declarations
    '@typescript-eslint/prefer-interface': 'error',

    // Require explicit return types
    '@typescript-eslint/explicit-function-return-type': 'error',

    // Require explicit prop types
    '@typescript-eslint/explicit-module-boundary-types': 'error',

    // Require consistent type definitions
    '@typescript-eslint/typedef': [
      'error',
      {
        'arrowParameter': true,
        'memberVariableDeclaration': true,
        'objectLiteralProperty': true,
        'parameter': true,
        'propertyDeclaration': true,
        'variableDeclaration': true,
      },
    ],
  },
}
```

### 2. Pre-Commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run TypeScript compiler check
npx tsc --noEmit

# If fails, prevent commit
if [ $? -ne 0 ]; then
  echo "TypeScript check failed. Commit aborted."
  exit 1
fi
```

### 3. CI/CD Check

Add to GitHub Actions workflow:

```yaml
- name: TypeScript Check
  run: |
    npx tsc --noEmit
    # Fail if any errors
```

### 4. Code Review Checklist

Require reviewers to check:

- [ ] All components have interfaces
- [ ] All props are typed
- [ ] All return types are explicit
- [ ] No `any` types used
- [ ] Interfaces are exported
- [ ] Naming conventions followed

---

## Quality Gates

### Gate 1: TypeScript Strict Mode

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true
  }
}
```

### Gate 2: Build Success

```bash
# Must pass
NEXT_DISABLE_TURBOPACK=1 pnpm build

# TypeScript compilation
npx tsc --noEmit
```

### Gate 3: Zero Type Errors

```bash
# Check for type errors
npx tsc --noEmit --pretty

# Should output: Found 0 errors.
```

### Gate 4: Interface Coverage Report

Create script to audit interface coverage:

```typescript
// scripts/check-interface-coverage.ts
import { readFileSync } from 'fs';
import { glob } from 'glob';

async function checkInterfaceCoverage() {
  const files = await glob('src/**/*.{ts,tsx}');
  let filesWithInterfaces = 0;
  let totalFiles = 0;

  for (const file of files) {
    totalFiles++;
    const content = readFileSync(file, 'utf-8');
    if (content.includes('export interface')) {
      filesWithInterfaces++;
    }
  }

  const percentage = (filesWithInterfaces / totalFiles) * 100;
  console.log(`Interface Coverage: ${percentage.toFixed(1)}%`);
  console.log(`${filesWithInterfaces}/${totalFiles} files have interfaces`);

  if (percentage < 100) {
    console.log('❌ Failed: Not all files have interfaces');
    process.exit(1);
  } else {
    console.log('✅ Passed: 100% interface coverage');
  }
}

checkInterfaceCoverage();
```

Run with:
```bash
npx tsx scripts/check-interface-coverage.ts
```

---

## Maintenance Plan

### Weekly Tasks

- [ ] Review new components for interface compliance
- [ ] Check TypeScript compilation
- [ ] Update interface coverage metrics
- [ ] Review PRs for interface usage

### Monthly Tasks

- [ ] Complete audit of all files
- [ ] Update interface templates
- [ ] Review and refine existing interfaces
- [ ] Update documentation

### Quarterly Tasks

- [ ] Major refactoring of interfaces
- [ ] Update best practices guide
- [ ] Team training on TypeScript best practices
- [ ] Evaluate new TypeScript features

### Tools to Use

```bash
# TypeScript compiler
npx tsc --noEmit

# TypeScript checker
npx typescript --version

# Prettier for formatting
pnpm prettier --write .

# ESLint for linting
pnpm lint

# Bundle analyzer
npx webpack-bundle-analyzer
```

---

## Success Metrics

### Target Goals

✅ **Interface Coverage: 100%**
- All components have interfaces
- All hooks have interfaces
- All utilities have interfaces
- All services have interfaces

✅ **Type Safety: Zero Errors**
- TypeScript compilation passes
- No implicit any types
- No implicit any returns

✅ **Code Quality: Improved**
- Better documentation
- Easier refactoring
- Fewer bugs

✅ **Developer Experience: Enhanced**
- Better IDE support
- Faster development
- Easier onboarding

---

## Quick Start Checklist

### For This Project (Complete Within 2 Weeks)

**Week 1: High Priority Files**

- [ ] Audit all files needing interfaces
- [ ] Add interfaces to `src/components/khwater/*.tsx`
- [ ] Add interfaces to `src/components/shared/*.tsx`
- [ ] Add interfaces to `src/hooks/useTranslation.ts`
- [ ] Test and validate

**Week 2: Remaining Files**

- [ ] Add interfaces to page components
- [ ] Add interfaces to utility functions
- [ ] Add interfaces to services
- [ ] Create type library in `src/types/`
- [ ] Final testing and validation

**Ongoing: Maintenance**

- [ ] Add interface to every new component
- [ ] Use TypeScript strict mode
- [ ] Run type checks before commits
- [ ] Review code for interface compliance

---

## Resources

### Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Interface Best Practices](https://typescript-eslint.io/docs/linting/configs#strict)

### Tools

- [TypeScript Playground](https://www.typescriptlang.org/play)
- [JSON to TS](https://quicktype.io/typescript)
- [TypeScript Error Translator](https://ts-error-translator.vercel.app/)

---

**Plan Created:** November 14, 2025
**Estimated Completion:** 2 weeks
**Priority:** High
**Status:** Ready to Execute

---

## Next Actions

1. ✅ Review this plan
2. ✅ Create audit spreadsheet
3. ⏳ Start Phase 1 implementation
4. ⏳ Track progress weekly
5. ⏳ Validate at each milestone
6. ⏳ Celebrate 100% coverage!

---

For questions or support, refer to:
- Project README
- TypeScript documentation
- Team lead or senior developer
