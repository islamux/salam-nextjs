# Plan to Fix ESLint Issues

This document outlines a plan to address the errors and warnings reported by the `eslint` command. The goal is to improve code quality, remove unused code, and ensure adherence to best practices.

## Summary of Issues

The linting process identified several categories of issues:

1.  **Unused Variables**: Numerous variables and imports are defined but never used, leading to code clutter.
2.  **Disallowed `any` Type**: The `any` type is used in some components, which compromises type safety.
3.  **Improper `useEffect` Usage**: A `setState` call is made synchronously within a `useEffect`, which can cause performance issues.
4.  **Empty Interfaces**: Empty interfaces are used, which do not provide meaningful type constraints.

## Detailed Fix Plan

The following is a file-by-file breakdown of the necessary fixes.

### 1. `public/sw.js`

*   **Issue**: The `error` variable is defined but never used in three separate `catch` blocks.
*   **Fix**: Prefix the `error` variable with an underscore (e.g., `_error`) in each `catch` block to indicate that it is intentionally unused.

### 2. `src/app/(routes)/home/page.tsx`

*   **Issue**: The `Link` component is imported but never used.
*   **Fix**: Remove the unused `import Link from 'next/link';` statement.

### 3. `src/app/(routes)/khwater/[id]/page.tsx`

*   **Issue**:
    1.  The `Metadata` type from `next` is imported but never used.
    2.  The `description` variable is assigned a value but never used.
*   **Fix**:
    1.  Remove `Metadata` from the `import type { Metadata } from 'next';` statement.
    2.  Remove the `description` variable declaration and its usage.

### 4. `src/app/(routes)/search/page.tsx`

*   **Issue**: The `Link` and `ContentRenderer` components are imported but never used.
*   **Fix**: Remove the unused `import Link from 'next/link';` and `import ContentRenderer from '@/components/khwater/ContentRenderer';` statements.

### 5. `src/components/shared/InstallButton.tsx`

*   **Issue**:
    1.  Unexpected `any` is used for `window.navigator`.
    2.  `setIsInstalled` is called directly within a `useEffect` hook.
*   **Fix**:
    1.  Define a custom interface for the `navigator` object to include the `standalone` property, avoiding the use of `any`.
    2.  The check for `isStandalone` and `isInWebAppiOS` only needs to run once. The `setIsInstalled` call can remain in the `useEffect`, but the hook's dependency array should be empty (`[]`) to ensure it runs only on the initial mount.

### 6. `src/components/shared/ServiceWorkerRegistration.tsx`

*   **Issue**:
    1.  The `deferredPrompt` variable is assigned a value but never used.
    2.  Unexpected `any` is used for the `deferredPrompt` state.
*   **Fix**:
    1.  If the `deferredPrompt` is intended for future use, prefix it with an underscore (`_deferredPrompt`). Otherwise, remove the variable and its corresponding state.
    2.  Provide a proper type for the `deferredPrompt` state, such as `Event | null`.

### 7. `src/components/shared/Skeletons.tsx`

*   **Issue**:
    1.  Three components use empty interfaces (`{}`).
    2.  The `_props` variable is assigned a value but never used in three components.
*   **Fix**:
    1.  Replace the empty interfaces (`{}`) with `React.HTMLAttributes<HTMLDivElement>` or a more specific prop type if applicable. If no props are accepted, the type can be removed.
    2.  The `_props` variable is likely a result of destructuring to omit props. If it's not needed, remove the destructuring. If it is, this warning can be ignored as it's a common pattern. Given the context, it's likely safe to keep as is, but we can remove it if it's truly not needed.
