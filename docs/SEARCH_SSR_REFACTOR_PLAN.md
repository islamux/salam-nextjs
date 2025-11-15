# Plan to Refactor Search for SSR

This plan outlines the steps to refactor the search functionality to be more Server-Side Rendering (SSR) friendly.

## 1. Pre-build the Search Index

- Create a script at `scripts/build-search-index.mjs`.
- This script will:
  - Read all `khwater` JSON files from `public/khwater`.
  - Use a library like `lunr` to build a comprehensive search index.
  - Serialize and save the generated index to `public/khwater/search-index.json`.
- Add a new script to `package.json` to run this indexing process, e.g., `"build:search-index": "node scripts/build-search-index.mjs"`.
- Run this script as part of the build process.

## 2. Update Search Service

- Modify `src/lib/utils/search-index.ts`:
  - Create a function to load the pre-built `search-index.json`.
  - Update the `searchIndex` function to use the loaded index instead of building one on the fly.
- Modify `src/lib/data/khwater-service.ts`:
  - Update the `searchChapters` function to leverage the new search mechanism. It should load the pre-built index and perform the search.

## 3. Refactor the Search Page

- Convert `src/app/(routes)/search/page.tsx` to a Server Component:
  - Remove the `'use client'` directive.
  - The page will receive the search query from the `searchParams` prop.
- Fetch data on the server:
  - Call the updated `searchChapters` function directly within the `SearchPage` component, passing the query from `searchParams`.
- Update the UI:
  - Remove `useState` and `useEffect` for data fetching.
  - The search input should be part of a `<form>` with `method="GET"`. This will allow the user to submit a search query, which will be passed as a URL parameter.
  - Use a `loading.tsx` file to handle the loading state, which is automatically handled by Next.js for Server Components.

## 4. Installation of Dependencies

- Install `lunr` and `fs-extra`:
  ```bash
  pnpm add lunr fs-extra
  pnpm add -D @types/lunr @types/fs-extra
  ```
