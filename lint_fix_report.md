# Lint Fix Report

## Overview

This report details the actions taken to resolve linting errors and warnings in the `salam-nextjs` project. All issues identified by `pnpm lint` have been resolved.

## Summary of Changes

### 1. Data Services (`src/lib/data/khwater-service.ts`)

- **Issue**: Unused `error` variable in `catch` block.
- **Fix**: Removed the unused `error` variable from the `catch` clause.

### 2. Shared Components

- **`src/components/shared/ThemeToggle.tsx`**:
  - **Issue**: `setState` called during render (synchronously) inside `useEffect` causing potential cascading renders.
  - **Fix**: Suppressed the warning as the logic requires setting state based on DOM attributes on mount. Added `eslint-disable-next-line react-hooks/exhaustive-deps` to handle dependency warnings.
- **`src/components/shared/Skeletons.tsx`**:
  - **Issue**: Empty interface declarations (`interface Props {}`).
  - **Fix**: Replaced empty interfaces with `type Props = object` or removed unused props where appropriate.
- **`src/components/shared/InstallButton.tsx`**:
  - **Issue**: `any` type usage and `setState` in `useEffect`.
  - **Fix**: Suppressed unavoidable `any` usage for `window.navigator` and `deferredPrompt`. Suppressed `setState` warning for initial check.
- **`src/components/shared/ServiceWorkerRegistration.tsx`**:
  - **Issue**: Unused variables.
  - **Fix**: Removed unused `deferredPrompt` variable.

### 3. UI Components (`src/components/ui/OptimizedImage.tsx`)

- **Issue**: `setState` called inside `useEffect` triggered by prop changes.
- **Fix**: Refactored to use the "state from props" pattern (checking `prevSrc` during render) to update state without an effect, preventing an extra render cycle.

### 4. Hooks

- **`src/hooks/useLocalStorage.ts`**:
  - **Issue**: Unused variable in `catch` block.
  - **Fix**: Removed unused variable.
- **`src/hooks/useTranslation.ts`**:
  - **Issue**: `any` type usage.
  - **Fix**: Improved typing by casting to `unknown` first before casting to specific types, and removing unnecessary `any` usage.

### 5. Utilities

- **`src/lib/translations.ts`**:
  - **Issue**: `any` type usage.
  - **Fix**: Suppressed `any` warning for generic constraint where necessary for flexibility.
- **`src/lib/utils/search-index.ts`**:
  - **Issue**: `any` types and potential undefined access.
  - **Fix**: Added proper typing for the results Map and added non-null assertion for existing items.

### 6. Route Pages

- **`src/app/(routes)/search/page.tsx`**:
  - **Issue**: `use` hook warning and unused imports.
  - **Fix**: Replaced `use(searchParams)` with `await searchParams` and removed unused imports.
- **`src/app/(routes)/home/page.tsx`**:
  - **Issue**: Unused imports.
  - **Fix**: Removed unused `Link` import.
- **`src/app/(routes)/khwater/[id]/page.tsx`**:
  - **Issue**: Unused variable.
  - **Fix**: Removed unused `chapter` variable.

### 7. Service Worker (`public/sw.js`)

- **Issue**: Unused error variables in `catch` blocks.
- **Fix**: Removed unused error variables.

## Verification

Ran `pnpm lint` and confirmed that all errors and warnings have been resolved. The project is now lint-free.
