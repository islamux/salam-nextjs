# Senior Engineering Interview: Salam (Khwater)

> **Format:** 4 rounds × 25 questions = 100 + 5 bonus = 105 total
> **Target:** Mid→Senior candidate
> **Style:** FAANG/Big Tech — behavioral, architectural depth, system design, debugging, and coding
> **Project:** "خواطر" (Khwater) — Arabic RTL PWA of Islamic reflections, Flutter→Next.js 16 migration, 34 chapters / 1,173 items, dual SSR/static build, build-time chapter-generation pipeline

---

## Round 1: Architecture & System Design (25 questions)

### Q1. Why migrate a working Flutter app to Next.js? Justify the trade-offs.

**A:** The migration rationale (`docs/FLUTTER_TO_WEB_MIGRATION_PLAN.md:286-298`) is web = universal access (no install), SEO (Flutter web is JS-heavy and poorly indexed), instant updates (no app-store review), and a smaller surface for a content app. The trade-offs: losing native performance/animations, PWA limitations vs native (push notifications, background sync), and the migration cost itself. Notably the original plan proposed Next 14 + Zod + React Query/SWR (`:338-348`) — **none** were adopted; the app uses custom `useLocalStorage` and no Zod. A senior read: the migration was justified, but the planned architecture was abandoned mid-flight for a simpler one.

### Q2. The app supports two build modes: `build:ssr` and `build:static`. Why, and how is the toggle implemented?

**A:** Dual deployment: SSR on Vercel/Netlify (dynamic, ISR), static export (`out/`) for cheap shared hosts like Hostinger (`docs/HOSTINGER_DEPLOYMENT_PLAN.md`). The toggle is `process.env.BUILD_TYPE === 'static'` read **only** in `next.config.ts:3` (`isStaticBuild`), which sets `output = 'export'` and `trailingSlash = true` (`:16-19`). Critically, **there is no `process.env`/`BUILD_TYPE` reference anywhere in `src/`** (verified) — the app code is identical in both builds; static export works purely because every page is statically generatable. This is the cleanest possible dual-build design.

### Q3. `output: 'export'` disallows server code. How does the app satisfy that constraint?

**A:** Three deliberate choices: (1) The root `/` redirect is **client-side** (`src/app/page.tsx:14-16`, `useRouter().replace('/home')`) because server `redirect()` crashes static export (`docs/STATIC_BUILD_ERROR_FIX.md:14-64`). (2) Search is **client-side** (`search/page.tsx:1` `'use client'`), not the SSR search the docs describe. (3) All data is static JSON in `public/khwater/*.json`, fetched client-side. There are no API routes, no `headers()`/`cookies()` usage. Every page is SSG via `generateStaticParams`. The constraint shaped the architecture.

### Q4. Walk through the full data pipeline from source content to the browser.

**A:** `src/lib/data/khatira_content.json` (master, `chapters[]` with page-based plural arrays) → `scripts/generate-chapters.ts` (run via `prebuild` before every `build`) → `convertPagesToItems` flattens plural arrays into singular-field items with per-item `order` → writes `public/khwater/<id>.json` per chapter + `public/khwater/index.json` (manifest) + `public/search-index.json`. At runtime, `khwater-service.ts` either `import()`s the JSON (server, at build) or `fetch()`es it (client), builds an in-memory search index, and serves chapter pages via `generateStaticParams`. The browser gets pre-rendered HTML + lazy JSON for search.

### Q5. Explain the `convertPagesToItems` "flush" algorithm. Why is it the intellectually interesting part?

**A:** `scripts/generate-chapters.ts:85-138` walks each page's `order` list (e.g. `['title','text','ayah','title','text']`); for each entry it `shift()`s one value off the corresponding plural array (`FIELD_MAP` `:77-83`) and assigns it to a `current` item. The key rule (`:122`): **when a field is encountered that's already present on `current`, it flushes `current` and starts a new item**. So a page with two titles becomes two items. This reconstructs logical "khatira" units from a layout-oriented source. A bug here would mis-split items — and the 627→2,170 item count change in git history shows this logic was tuned significantly.

### Q6. The `ID_MAP` maps `"pre"→"0"` and `"final"→"33"`. Why is this remapping necessary?

**A:** Source chapters use string ids `"pre"` (preface) and `"final"` (finale); numeric chapters use their number as a string. For URL consistency (`/khwater/0`, `/khwater/33`, `/khwater/12`), all ids must be numeric strings. `ID_MAP` (`generate-chapters.ts:72-75`) normalizes the two special cases; other ids pass through. Without it, routes would be `/khwater/pre` — workable but inconsistent and harder to order numerically. The generated JSON filenames (`public/khwater/0.json`) and `generateStaticParams` both depend on numeric ids.

### Q7. The docs (`SEARCH_SSR_IMPLEMENTATION_SUMMARY.md`) describe a server-side search, but the actual `/search` page is `'use client'`. What happened?

**A:** The SSR search refactor (`docs/SEARCH_SSR_IMPLEMENTATION_SUMMARY.md`, `SEARCH_PAGE_REFACTOR.md:159-182`) was **reverted** to enable static export for Hostinger (`docs/REDUCE_SIZE_BUILD_STATIC.md:12-14`). The current `search/page.tsx:1` is a client component reading `?q=` via `useSearchParams` and calling `searchChapters` in a `useEffect`. Trade-off: lost SEO for search results (client-only), gained deployment flexibility. This is a textbook example of a documented decision being silently overturned — the docs now mislead.

### Q8. How does `khwater-service.ts` work isomorphically across server and client?

**A:** `loadChapterData(id)` (`khwater-service.ts:57-68`) branches on `typeof window === 'undefined'`: server uses `await import('../../public/khwater/${id}.json')` (bundled at build), client uses `fetch('/khwater/${id}.json')` (runtime). This single module serves both SSG (server, at build time) and runtime (client, after hydration) without duplication. `loadAllKhwaterData()` (`:73-92`) populates a module-scoped `cachedKhwaterData` (`:37`) once. The trade-off: the cache is per-module-instance (server: per-process; client: per-page-load), with no invalidation logic.

### Q9. `public/search-index.json` is generated but never read at runtime. Why does it exist?

**A:** `generate-chapters.ts:213` writes it as part of the size-reduction plan (`docs/REDUCE_SIZE_BUILD_STATIC.md:9` "build a static search-index.json (1.3MB)"). But grep finds **no runtime consumer** — the client always rebuilds the index in memory from the per-chapter JSONs via `buildSearchIndex` (`search-index.ts:17`). So the file is shipped (~1.3 KB+ of dead build output) but wasted. Either the optimization was abandoned mid-implementation, or it's intended for a future client that fetches the prebuilt index instead of rebuilding. A cleanup opportunity.

### Q10. The service worker caches chapters 1–29, but there are 34 chapters. What's the impact?

**A:** `public/sw.js:16` hardcodes `CHAPTER_PAGES` with `length: 29` — a stale value from when the book had 29 chapters. Real count is 34 (`public/khwater/index.json:178`). So chapters `0` (preface), `30`, `31`, `32`, `33` (finale) are **not pre-cached for offline**. A user reading offline who navigates to the finale gets a network error. This is a real bug (`docs/PWA_SUPPORT.md:73`, `AGENTS.md:7`, `manifest.json:4` all repeat the wrong "29"). Fix: derive `CHAPTER_PAGES` dynamically from `index.json` at SW build, or bump to 34 and add a CI assertion that the SW count matches `index.json`.

### Q11. The service worker also caches `/khwater-data.json`, which doesn't exist. What happens?

**A:** `public/sw.js:76` does `fetch("/khwater-data.json")` — a leftover from when all data was one file. The file doesn't exist (data is now per-chapter). The `try/catch` (`:81-83`) swallows the failure silently, so it's dead code that adds a wasted network request during SW install. No user-visible breakage, but it's noise and a sign of incomplete refactoring. Fix: remove the fetch and the now-unused cache key.

### Q12. Why system fonts instead of `next/font`? What's gained and lost?

**A:** `src/app/globals.css:3-9` defines `--font-amiri: 'Amiri','Scheherazade New','Times New Roman',serif` etc., and `<body>` uses the var — **no `next/font` import in `layout.tsx`**. `docs/LOCAL_FONTS_SETUP.md:43-55` celebrates this as offline-capable, zero-network, PWA-friendly (no Google Fonts fetch), and it sidesteps the Turbopack font issues (`CLAUDE.md:209-218`). Lost: typographic consistency across OS (different default Arabic serif on Windows vs macOS vs Android), no subsetting/preload. For an offline-first PWA, the trade favors system fonts; for visual polish, `next/font` self-hosting would be better.

### Q13. `next.config.ts` sets `images.unoptimized = true` even in SSR mode. Why, and what's the cost?

**A:** `next.config.ts:8-10` — always on, not gated by `BUILD_TYPE`. Reason: static export requires it (no image optimization server), and keeping it on in SSR mode means one less divergence between builds. Cost: every `<Image>` behaves like a plain `<img>` — no responsive `srcset`, no AVIF/WebP, no lazy by default. The `OptimizedImage` component (`src/components/ui/OptimizedImage.tsx`) exists but is **never imported** (dead code). For a text-heavy app with few images, the cost is low; for image galleries it'd matter.

### Q14. There are no React Context providers. How is global state managed?

**A:** Entirely via custom hooks + `localStorage`, no Context. `useLocalStorage<T>` (`src/hooks/useLocalStorage.ts:25`) is the single source of truth — generic, SSR-safe (lazy init in `useEffect` to avoid hydration mismatch, `:101-109`), with `isLoading` gate. `useFontSize` (`useFontSize.ts:17`) wraps it (`'elm-font-size'`, clamp 14–24). Theme lives in `ThemeToggle` via `useLocalStorage('elm-theme')`. The `elm-` prefix is vestigial from the old project name "Elm". This is a deliberate "no provider" architecture — simpler than Context for independent persisted values, with no re-render cascade.

### Q15. The anti-FOUC theme script is inline in `layout.tsx`. Walk through the hydration story.

**A:** `src/app/layout.tsx:77-94` injects an inline script (via the layout's HTML) that reads `localStorage('elm-theme')` and sets `documentElement.classList` before paint. `<html suppressHydrationWarning>` (`:67`) tolerates the class mismatch between server HTML (no class) and client (class added). `ThemeToggle` (`components/shared/ThemeToggle.tsx:50-59`) uses a `mounted` gate so it doesn't render an icon that contradicts the server output until after hydration. The comment at `layout.tsx:43-59` documents the rationale. This is the canonical no-FOUC dark-mode pattern for static/SSR apps.

### Q16. Why does the project pin `--webpack`-free `next dev` but docs say `NEXT_DISABLE_TURBOPACK=1`?

**A:** `package.json:6` `dev: "next dev"` (no turbopack flag); `next.config.ts:6` comments "Turbopack is disabled". But `docs/DEPLOYMENT.md:27,81,107` and `CLAUDE.md` say to set `NEXT_DISABLE_TURBOPACK=1`. The mismatch suggests Next 16 changed the default (Turbopack became default in 16) and the project relies on the config-level disable or a default flip, while the docs are stale. A candidate should verify empirically and reconcile — the docs-vs-config drift is itself a finding.

### Q17. `revalidate = 3600` is set on home and chapter pages. What does ISR buy in each build mode?

**A:** `src/app/(routes)/home/page.tsx:14` and `khwater/[id]/page.tsx:26` set `revalidate = 3600` (1 hour). In SSR mode, this is ISR — pages regenerate at most hourly, so content changes (if `khatira_content.json` updates) propagate within an hour without redeploy. In **static export mode, `revalidate` is ignored** — `output: 'export'` produces fully static files with no regeneration; updates require a rebuild + redeploy. So ISR is an SSR-only benefit; the static path is pure SSG. The same code serves both, but the semantics differ by deploy target.

### Q18. The migration report claims "97.4% complete" with a `detailedOrder` system. Does the current code use it?

**A:** No. `docs/COMPLETE_MIGRATION_REPORT.md:44-99` describes `DetailedOrderItem {type, index}` for exact Flutter interleaving, with dual-mode `ContentRenderer`. The **type still exists** (`src/lib/types/khwater.ts:6-9`) and `ContentRenderer.resolveOrder` (`ContentRenderer.tsx:14-19`) still prefers `detailedOrder`. But the **current `generate-chapters.ts` never emits `detailedOrder`** — generated items use singular fields + simple `order` arrays (`public/khwater/0.json:7-11`). The migration report is from an older pipeline; the rewrite to singular fields (visible in git log: "627 → 2,170 items") superseded it. Dead type/path — cleanup candidate.

### Q19. Three deployment targets (Vercel, Netlify, Hostinger) — what differs?

**A:** **Vercel** (primary): SSR/ISR, `next build` → `.next/`, env `NEXT_PUBLIC_SITE_URL`. **Netlify** (`netlify.toml:1-3`): SSR via Netlify's Next runtime, `publish = ".next"`. **Hostinger** (`docs/HOSTINGER_DEPLOYMENT_PLAN.md`): static-only shared host, `build:static` → `out/` → FTP to `public_html`, `.htaccess` for cache/security headers, `trailingSlash:true` for directory URLs. The same code deploys to all three because it avoids server-only features. Trade-off: Hostinger loses ISR, search SEO, and any future dynamic feature.

### Q20. `trailingSlash: true` in static mode caches both `/khwater/1` and `/khwater/1/`. Why both?

**A:** `public/sw.js:56-71` explicitly caches both variants because `trailingSlash: true` produces directory URLs (`/khwater/1/` → `khwater/1/index.html`), but users/links may use the no-slash form, and the server redirects one to the other. If the SW only cached one, the redirect offline would fail. Caching both is defensive. The cost: double the cache entries for navigations. A cleaner fix: normalize URLs in the SW before lookup, but caching both is simpler and robust.

### Q21. The app is Arabic-only, yet there's a `useTranslation` hook and `ar.json`/`en.json` TODO. Why?

**A:** `src/hooks/useTranslation.ts:7-137` is a memoized accessor over a static `translations` object (`src/lib/translations.ts:4-120`) offering `t.get(key)` and `t.getFunc(key, ...args)`. It's a **hook but does no locale switching** — the app is Arabic-only. `todo.md` lists splitting `ar.json`/`en.json` as future work. So the hook is scaffolding for future i18n that was never needed. It's an over-abstraction for current scope (YAGNI violation), though harmless. A senior note: the hook name (`useTranslation`) collides with react-i18next's, which would confuse if i18n is later added.

### Q22. `bookmarks.ts` is fully implemented (9 functions) and tested (30+ tests) but imported nowhere. What does this reveal?

**A:** `src/lib/utils/bookmarks.ts` (101 lines) + `__tests__/bookmarks.test.ts` (276 lines) exist with **zero imports** from any component (grep-confirmed). `CLAUDE.md:151-156` claims "Toggle bookmark UI components" — **false**. This is a fully-built feature that was never wired into the UI: either abandoned, deferred, or built speculatively. It reveals a discipline gap — tests pass for code that doesn't run, giving false confidence. Either wire it up (add a bookmark button on chapter pages + a `/bookmarks` page) or delete it. Dead tested code is worse than dead untested code (it rots while looking healthy).

### Q23. `khwater-server.ts` is a `'server-only'` fs-based data layer that's never imported. What was its intent?

**A:** `src/lib/data/khwater-server.ts` (107 lines, `'server-only'` pragma) was created during the size-reduction refactor (`docs/REDUCE_SIZE_BUILD_STATIC.md:11`) to keep fs reads server-side. It was then **abandoned in favor of the isomorphic `khwater-service.ts`** (which branches on `typeof window`). The file is dead. Intent: a clean server/client split. Reality: the isomorphic approach won because it's simpler (one module, two paths) and supports static export. Cleanup: delete `khwater-server.ts`.

### Q24. `highlightSearchTerms` is tested but never used in any UI component. What's the risk?

**A:** `src/lib/utils/search-index.ts:118-136` wraps matches in `<mark>` — referenced only in `__tests__/search-index.test.ts:2,120-158`, never imported by a component. `CLAUDE.md:150` lists search highlighting as a feature — **false**. Risk: tests green-light code that ships no value; the feature appears "done" in docs but is invisible to users. Worse, the regex is built from the search term **without escaping** (`:128`) — if ever wired to UI, a query like `(` throws `SyntaxError`. Either wire it (escape the regex first) or remove it.

### Q25. If you were rebuilding this from scratch, what are the top three things you'd change?

**A:** (1) **Single source of truth for chapter count** — derive `CHAPTER_PAGES`, `manifest.json`, SW cache, and all docs from `index.json`/the generator, killing the 29-vs-34 drift forever. (2) **Delete dead code aggressively** — `bookmarks.ts` (or ship it), `khwater-server.ts`, `OptimizedImage`, `UI.tsx`, `generate-index.ts`, `search-index.json`, `highlightSearchTerms`, the `detailedOrder` type. (3) **Wire CI** — a build + test gate that fails on broken e2e (currently the `e2e/*.spec.ts` target `/elm/1` and would fail if run) and on doc-vs-code drift. Beyond: real i18n (the hook is scaffolding) and a real search (server or prebuilt index, not client rebuild).

---

## Round 2: React & Next.js Deep Dive (25 questions)

### Q26. Why is the root `/` page a client component that redirects, instead of a server `redirect()`?

**A:** `src/app/page.tsx:1` is `'use client'` and does `useRouter().replace('/home')` in `useEffect` (`:14-16`). A server `redirect('/home')` crashes `output: 'export'` (static builds can't emit server redirects) — documented in `docs/STATIC_BUILD_ERROR_FIX.md:14-64`. The client redirect works in both modes. Trade-off: a brief blank page / flash before the redirect on first load (no SSR content at `/`), and it depends on JS. The comment at `:8-9` explains the constraint. An alternative: make `/` itself the home page (no redirect), but the route-group structure separates them.

### Q27. `params` is `Promise<{id}>` in the chapter page. What changed in Next 16, and how is it handled?

**A:** Next.js 16 (React 19) made dynamic-route params async to support streaming. `src/app/(routes)/khwater/[id]/page.tsx:17-19` types `params: Promise<{ id: string }>`, and `:56` does `const { id } = await params`. The same applies to `searchParams`. Forgetting `await` reads a Promise object → `id` is undefined → wrong/no chapter. This is a breaking change from Next 14/15 (plain object). All async server components in this codebase correctly `await` their params.

### Q28. `generateStaticParams` is defined in two places (the page and `khwater-service.ts`). Which runs?

**A:** The **page's** `generateStaticParams` (`khwater/[id]/page.tsx:21-24`) runs at build — it's what Next.js calls. The service-level `generateStaticParams` (`khwater-service.ts:190-195`) is a **dead export** never called by anything. This is duplication drift: someone added the function to the service (perhaps intending the page to delegate) but the page reimplements it. Cleanup: delete the service-level one or have the page import it. Currently it's confusing dead code.

### Q29. `getChapterMetadata` returns hardcoded `الفصل ${id}` strings. What's wrong?

**A:** `khwater-service.ts:116` returns fake titles instead of reading real metadata from `index.json` (which has real chapter titles). It's also **never called** by any component (dead code). The real metadata is read elsewhere (e.g., `generateMetadata` in the page reads from the loaded chapter). So the function is both wrong (fake data) and unused. Delete it, or fix it to read `index.json`'s `ChapterMeta.title`.

### Q30. The chapter page embeds JSON-LD `Book` schema. Why, and what's the notable detail?

**A:** `khwater/[id]/page.tsx:70-94` injects `<script type="application/ld+json">` with a `Book`/`CreativeWork` schema for SEO (rich results). Notable: the `text` field (`:85`) uses only the **first 3 items** of the chapter (truncated) — presumably to keep the JSON-LD small and avoid dumping 1,173 items into structured data. Trade-off: the schema describes a partial text; Google may or may not honor partial content. A candidate should question whether truncation is intentional and whether `hasPart`/`numberOfItems` would be more correct.

### Q31. `ContentRenderer` uses `resolveOrder` preferring `detailedOrder` then `order`. Why is one branch dead?

**A:** `src/components/khwater/ContentRenderer.tsx:14-19`: `const orderToUse = detailedOrder?.length ? detailedOrder : order`. Since `generate-chapters.ts` never emits `detailedOrder` (Q18), the `detailedOrder` branch is unreachable in practice. It's defensive code for a data shape that doesn't exist. If the pipeline ever emits `detailedOrder`, it'd work — but until then it's dead. A senior flag: either emit it or remove the branch; keeping it implies the feature exists.

### Q32. `ShareButton` reads `window.location.origin` in the handler, not at render. Why does that matter?

**A:** `src/components/khwater/ShareButton.tsx:15` computes `shareUrl` inside the share click handler, not during render. If it read `window.location` at render time, SSR/build (where `window` is undefined) would throw. By deferring to the handler (which only runs client-side after a user gesture), it's hydration-safe for free. This is the standard pattern for any browser-only API: read it in an event handler or `useEffect`, never at module/render top-level.

### Q33. `ThemeToggle` has a `mounted` gate. What would happen without it?

**A:** `components/shared/ThemeToggle.tsx:50-59` renders a placeholder until `mounted` is true. Without it: the server renders with no theme knowledge (renders light icon), the client hydrates reading `localStorage` (maybe dark) → the icon flips post-hydration → visual flash + potential hydration mismatch warning. The gate ensures the first client render matches the server (placeholder), then updates. Paired with `<html suppressHydrationWarning>` and the inline FOUC script, this gives a clean no-flash experience.

### Q34. `InstallButton` disables the browser's native install popup. Why, and how?

**A:** `ServiceWorkerRegistration.tsx:8-12` calls `e.preventDefault()` on `beforeinstallprompt` — suppressing the browser's default install mini-infobar. `InstallButton` (`:22-29`) captures the same event to show a **custom** install button with branded UX. `CLAUDE.md:163` notes "PWA install popup disabled Nov 13 2025." Trade-off: custom UI is nicer/on-brand but requires the app to remember to show it (a bug in `InstallButton` = no install path); the native popup is foolproof but ugly. The `react-hooks/set-state-in-effect` eslint-disable (`InstallButton.tsx:18`) is a code smell worth questioning.

### Q35. `Skeleton` components use a custom `.skeleton-shimmer`, not `animate-pulse`. Why?

**A:** `src/components/shared/Skeletons.tsx` (12 skeleton exports) + `.skeleton-shimmer` (`globals.css:111-125`). A shimmer (gradient sweep) looks more polished than a pulse and signals "loading" more actively. `docs/SKELETON_LOADING_GUIDE.md` claims a 53% code reduction from the DRY refactor. Trade-off: shimmer is a heavier animation (GPU) than pulse; on low-end devices it can jank. The skeleton system is used in `loading.tsx` files (home, chapter, search) for route transitions. Note: no `React.memo` on skeletons despite the guide recommending it (`:1132-1138`).

### Q36. The chapter page uses `dynamic(() => import(...))` for `ContentRenderer` and `ShareButton`. Why?

**A:** `khwater/[id]/page.tsx:8-15` dynamically imports these with skeleton fallbacks. `ContentRenderer` is client-only (it renders the order-based content); `ShareButton` is client-only (Web Share API). Dynamic-importing them keeps the chapter page's initial JS smaller (the heavy client code loads after the static HTML shell). Combined with `loading.tsx` skeletons, the user sees content immediately and interactive elements stream in. This is code-splitting for perceived performance.

### Q37. `Footer` is rendered in the server layout but calls `useTranslation()` (a hook). Why doesn't that error?

**A:** `src/app/layout.tsx:110` renders `<Footer>`, and `Footer.tsx` calls `useTranslation()` (`useMemo` inside). In a server component, calling a hook should error. The fact it doesn't suggests either: (a) `Footer` is implicitly treated as client (but it has no `'use client'` directive), or (b) there's a latent bug masked by Next's handling. This is a code smell / potential bug flagged in the digest — worth investigating. A senior candidate should recognize this as suspicious: hooks in server components are illegal; if it works, the boundary is being inferred in a non-obvious way.

### Q38. `SearchForm` is a plain `<form method="GET" action="/search">` with no JS. Why?

**A:** `src/components/search/SearchForm.tsx:7-37` uses native HTML form submission: typing a query and pressing Enter navigates to `/search?q=...` via the browser, no `onSubmit`/`useRouter`. This is progressive enhancement — works without JS, bookmarkable results, simpler. The `SearchContent` client component then reads `?q=` via `useSearchParams` and runs the search. Trade-off: no autocomplete/instant results without JS, but the core search is robust. This mirrors the Asma project's `SearchBar` pattern.

### Q39. `SearchContent` shows a spinner during search and an inline retry button on error. Why this UX?

**A:** `search/page.tsx:49-71` — the search runs in `useEffect` after `?q=` changes; a spinner (`:49-53`) shows during the async fetch+index-build; on error, an inline retry button (`:62-71`) re-runs instead of a full error screen. This is resilient UX: transient failures (flaky network fetching 34 JSONs) are recoverable without losing the query. The alternative (error boundary) would unmount the whole page on a search error, which is heavy for a recoverable operation.

### Q40. `Header` composes `FontSizeControl`, `ThemeToggle`, `InstallButton` — all client. Is `Header`'s `'use client'` justified?

**A:** `Header.tsx:10` is `'use client'` and has mobile-menu state (`:11`). It's justified because it manages local UI state (mobile menu open/close). However, it could be a **server component that composes client children** if the mobile-menu state were pushed into a child. Currently the whole header (including potentially static parts) ships as client JS. A minor optimization: split the static chrome (server) from the interactive menu (client). Not critical at this scale.

### Q41. `useFontSize` clamps 14–24 and sets `documentElement.style.fontSize`. Trace the side effect.

**A:** `useFontSize.ts:17-44`: wraps `useLocalStorage<number>('elm-font-size', 16)`; a `useEffect` (`:21-23`) sets `document.documentElement.style.fontSize = ${fontSize}px` whenever `fontSize` changes. So the root font size scales, and `rem`-based CSS scales with it. Persisted to localStorage, survives navigation (the hook re-reads on mount). Clamp (`:6-7`) prevents absurd sizes. The two paths: `rem`-based layout scales via root, and any `px`-based text does not — a design inconsistency to be aware of.

### Q42. `useLocalStorage` has an `isLoading` gate. Why, and how is it hydration-safe?

**A:** `useLocalStorage.ts:25-117` returns `{ value, setValue, removeValue, isLoading }`. SSR returns the initial value with `isLoading: true`; the actual `localStorage` read happens in `useEffect` (`:101-109`) after mount, then `isLoading` flips false. This avoids hydration mismatch (server and first client render agree on the initial value). The JSON-vs-string fallback (`:46-51`) handles backward-compat with older plain-string values. This is the canonical SSR-safe persistence hook — more robust than a naive `useState(() => localStorage.getItem(...))` which would crash on SSR.

### Q43. `ServiceWorkerRegistration` is a client component returning null. Why return null?

**A:** `components/shared/ServiceWorkerRegistration.tsx:5-72` is `'use client'`, registers `/sw.js` in a `useEffect`, and renders `null` (no UI). It must be a client component (uses `navigator`/`window`). Returning null means it contributes no DOM — it's a side-effect-only component mounted for its registration effect. This is a clean pattern for "mount this to run an effect once." The effect has proper cleanup (unregister listeners).

### Q44. `global-error.tsx` must render its own `<html>` and `<body>`. Why?

**A:** `src/app/global-error.tsx:10-49` — when the **root layout itself** throws, Next can't use the layout's `<html>` shell (it's broken), so the global error boundary must provide a complete document. This is a Next.js requirement for `app/global-error.tsx` (distinct from route-level `error.tsx` which inherits the layout). It's the error boundary of last resort. The file correctly renders `<html lang="ar" dir="rtl"><body>...`. Forgetting the html/body would produce invalid HTML in the catastrophic-error case.

### Q45. The `(routes)` route group contains home/khwater/search. What does the parentheses syntax mean?

**A:** Route groups `(name)` don't affect the URL — `(routes)/home/page.tsx` serves `/home`, not `/routes/home`. They're for organizing files (e.g., grouping related routes, applying a shared layout/error boundary without a URL prefix). Here `(routes)/error.tsx` (`:11-47`) and the loading files apply only to the grouped routes. A candidate should recognize that the group is purely organizational and the URLs are flat.

### Q46. `HomePage` is a server component with `revalidate = 3600`. What does that make it?

**A:** `src/app/(routes)/home/page.tsx:14` `export const revalidate = 3600` + server component + calls `getAllChapters()`. This is **ISR** (Incremental Static Regeneration) in SSR mode: the page is statically generated at build, then re-generated at most every 3600s (1h) in the background. In static export mode, `revalidate` is ignored — pure SSG. So the home page is "stale-while-revalidate" at the CDN with a 1h freshness window. Good for content that changes rarely.

### Q47. `HeroSection` shows a giant background number. How is it implemented, and what's the a11y concern?

**A:** `src/components/home/HeroSection.tsx:7-59` renders a decorative giant number (likely the chapter count or a motif) as a background. The a11y concern: if it's a meaningful number, it should be available to screen readers (via `aria-label` or visually-hidden text); if purely decorative, it must be `aria-hidden`. Decorative backgrounds often get forgotten. A senior review would check whether the number conveys information and ensure it's hidden or labeled appropriately.

### Q48. `ChapterCard` rotates through SVG motifs by `chapterNum % 5`. Why modulo, and what's the risk?

**A:** `src/components/home/ChapterCard.tsx:10-16` defines `MOTIFS` (5 SVGs); `index = chapterNum % 5` picks one per card. Modulo gives deterministic variety (chapter 1 and 6 share a motif) without randomness (so SSR and client agree — no hydration mismatch). Risk: with 34 chapters and 5 motifs, motifs repeat visibly; if the motifs were meant to be unique per chapter, this fails. For decorative variety, repetition is fine. A truly unique assignment would need ≥34 motifs or a hash.

### Q49. The chapter page shows a reading-progress bar. How is it computed?

**A:** `khwater/[id]/page.tsx:98-104` renders a progress bar. It's likely based on scroll position within the chapter content (a client component tracking scroll). The digest notes progress-bar rendering in the page. A senior question: is the progress persisted per chapter (via `useLocalStorage`)? If not, it resets on navigation. A "continue reading" feature would persist scroll/progress keyed by chapter id. The current implementation should be checked for persistence.

### Q50. `react-hooks/set-state-in-effect` is eslint-disabled in `InstallButton`. What rule is being bypassed, and why?

**A:** `InstallButton.tsx:18` disables the rule that warns against calling `setState` directly in a `useEffect` body (which can cause effect loops or cascading renders). The component captures `beforeinstallprompt` and stores it in state inside the effect. The disable is a shortcut — the "correct" fix is usually to restructure (e.g., use a ref, or guard the setState). Bypassing lint is a smell; a senior should ask whether the disable is justified or hides a real effect-cycle risk. Worth probing in review.

---

## Round 3: TypeScript, Data, & Build Pipeline (25 questions)

### Q51. `tsconfig` is strict. What's the most impactful strict flag for the data layer?

**A:** `strictNullChecks`. The service layer returns `Promise<ChapterResponse | null>` and `getChapterData` can return null for missing chapters; without strict null checks, callers could access `.items` on null silently. With it, every caller must narrow. The `KhwaterItem` type (`khwater.ts:17`) with optional `detailedOrder` also benefits. Strict mode here prevents a whole class of "cannot read property of undefined" runtime errors at compile time.

### Q52. `KhwaterItem.order: ContentType[]` uses a string-literal union. Why not an enum?

**A:** `src/lib/types/khwater.ts:17` — `ContentType = 'title'|'subtitle'|'text'|'ayah'|'footer'`. String-literal unions are preferred over enums in modern TS: they're plain strings (no runtime overhead, better in DevTools, interoperable with JSON), support exhaustiveness checks in `switch`, and tree-shake better. Enums generate runtime objects and can have surprising behavior (numeric enums' reverse mapping). The `ContentRenderer` `switch` over `ContentType` (`:27-40`) gets exhaustiveness checking for free.

### Q53. The generator deletes all `*.json` in `public/khwater/` except `index.json` before writing. Why?

**A:** `scripts/generate-chapters.ts:152-156` cleans stale per-chapter files (e.g., if a chapter is removed from the source, its old JSON shouldn't linger) but preserves `index.json` (which it overwrites separately at `:208`). This makes the generator idempotent — re-running produces a clean state, no orphan files. Without cleanup, deleted chapters would ship stale data. Trade-off: any manual edits to generated JSON are wiped (but they shouldn't be edited manually — they're build artifacts).

### Q54. `convertPagesToItems` uses `arr.shift()` to consume plural arrays. What's the correctness invariant?

**A:** `generate-chapters.ts:113` shifts one value per `order` entry. The invariant: **the plural arrays (`titles`, `texts`, etc.) must have exactly as many entries as the `order` list references that field type**. If `order = ['title','title']` but `titles` has only 1 element, the second `shift()` returns `undefined` → an item with `title: undefined`. There's no validation — a malformed source silently produces broken items. A defensive generator would assert array lengths match order counts. This is the kind of bug the 627→2,170 tuning likely fixed.

### Q55. The generator emits `version: '4.0.0'` in `ChapterResponse`. Why version the generated data?

**A:** `generate-chapters.ts:70` sets `metadata.version: '4.0.0'`. Versioning the output lets the client/runtime refuse incompatible data (e.g., if the item shape changes, bump to 5.0.0 and the loader checks the version). It's a contract between the build pipeline and the runtime. Currently nothing checks the version (no runtime validation), so it's informational. A senior note: if the schema evolves, add a runtime `if (data.metadata.version !== '4.0.0') throw` guard.

### Q56. `generated` timestamps strip milliseconds (`replace(/\.\d{3}Z$/, 'Z')`). Why?

**A:** `generate-chapters.ts:145` — `new Date().toISOString()` produces `2026-07-17T12:34:56.789Z`; the regex strips `.789` for a clean RFC-3339 `2026-07-17T12:34:56Z`. Reason: millisecond precision is noise for a build manifest, and some downstream parsers/consumers prefer second-precision. It's cosmetic normalization. Not functionally critical, but produces tidier `index.json`. A candidate should recognize it's a format choice, not a correctness requirement.

### Q57. `buildSearchIndex` concatenates `title|text|ayah|subtitle`. Why this field order/choice?

**A:** `search-index.ts:17-48` builds the searchable content from these four fields (not `footer`). They're the meaningful text; `footer` is usually a citation/reference (low search value). Concatenation into one `content` string lets a single substring match cover multiple fields. The per-field snippets are stored separately (`title`, `ayah`) for weighted scoring (`searchIndex` gives title matches +2, ayah +1.5). Omitting `footer` keeps the index smaller. A defensible choice.

### Q58. `searchIndex` scoring: content +1, title +2, ayah +1.5. Why these weights?

**A:** `search-index.ts:78-91`: a title match is the strongest signal (the term is in the chapter/item title), so +2; an ayah (Quranic verse) match is semantically special (+1.5); a generic content match is +1. Results are deduped by `chapterId-itemIndex` (`:95-108`) and sorted by score desc (`:112`). This hand-tuned weighting reflects domain knowledge (titles and verses matter more). It's not configurable — changing weights means editing the source. A senior could argue for exposing config, but at this scale hardcoding is fine.

### Q59. The generated `public/khwater/*.json` files total ~787 KB across 34 chapters. Why split per chapter instead of one file?

**A:** `docs/SIZE_REDUCTION_PLAN.md`, `REDUCE_SIZE_BUILD_STATIC.md`: per-chapter splitting (avg 23 KB/chapter) lets the client fetch only the chapter being viewed (lazy), keeping initial load small. A single 787 KB file would block first chapter view until fully downloaded. The search path fetches all 34 sequentially (cached after), but that's a one-time cost. `index.json` (the manifest) is tiny and loaded first for navigation. This is the right granularity for a chapter-based reader.

### Q60. `searchChapters` regroups results by chapter. Why not return flat results?

**A:** `khwater-service.ts:171-184` takes flat scored results and groups into `{chapterId, items}[]`. The UI (`SearchResults`) displays results grouped by chapter (a chapter can have multiple matching items). Grouping at the service layer keeps the component simple. Trade-off: if the UI ever wanted flat ranking across chapters, the grouping loses cross-chapter ordering. The current UX (per-chapter grouping) matches the book's structure, so grouping is correct.

### Q61. `cachedKhwaterData` is module-scoped. What's the cache invalidation story in SSR vs static?

**A:** `khwater-service.ts:37` — module-scoped `cachedKhwaterData` populated once by `loadAllKhwaterData()`. In SSR (long-running server), it lives for the process lifetime — no invalidation, so content updates require a redeploy (ISR at the page level doesn't refresh this in-memory cache). In static/client mode, it's per-page-load (fresh each navigation that re-imports the module). The cache has no TTL, no size limit, no invalidation API. For immutable book content this is fine; for changing data it'd be a staleness bug. A senior should note SSR staleness risk.

### Q62. `loadChapterData` branches on `typeof window === 'undefined'`. Why not two separate functions?

**A:** `khwater-service.ts:57-68` — one isomorphic function vs two (`loadChapterDataServer`/`loadChapterDataClient`). The single-function approach means callers don't need to know which environment they're in — `searchChapters` works in both. Trade-off: the function has a runtime branch (negligible cost) and bundles both code paths (the `import()` and `fetch()`). Two functions would be marginally cleaner but require call-site awareness. The isomorphic pattern is idiomatic for code that must run in both SSG-build and client-runtime contexts.

### Q63. `scripts/generate-index.ts` is a second, orphaned generator. What does it reveal?

**A:** `scripts/generate-index.ts:1-57` rebuilds only `public/search-index.json` from existing `public/khwater/*.json`. It's **not wired into `package.json` scripts** — orphaned/legacy. It even has a comment "Define types locally to avoid importing from src which might cause issues with ts-node" (`:7`) — but the project uses `tsx`, not `ts-node`, so the comment is stale too. Reveals: leftover from an earlier pipeline structure, never cleaned up. The comment also indicates a past ts-node dependency. Delete it (the main generator produces the search index).

### Q64. The build uses `tsx` to run the generator. Why `tsx` over `ts-node`?

**A:** `package.json:11` `generate: "tsx scripts/generate-chapters.ts"`. `tsx` uses esbuild under the hood for near-instant startup; `ts-node` is slower (full TS compile). For a build script run on every `prebuild`, fast startup matters. `tsx` also handles ESM/CJS seamlessly. The orphaned `generate-index.ts`'s ts-node comment (`:7`) confirms `ts-node` was the past choice, replaced by `tsx`. Modern build scripts should default to `tsx` or `bun`.

### Q65. `prebuild` runs `generate` before every `build`. What if it fails?

**A:** `package.json:9` `prebuild: "pnpm generate"`. pnpm/npm run `prebuild` automatically before `build`; if `prebuild` exits non-zero, `build` is **aborted**. So a generator failure (missing source file, malformed JSON, write error) fails the whole build — a desirable fail-fast behavior. The generator has minimal try/catch (unknown `order` types `console.warn` + `continue`, `generate-chapters.ts:103`), so most errors propagate. This ensures broken data never ships. A candidate should confirm there's no `|| true` masking failures.

### Q66. The generated `tafsir.ts`/`tafsir-meta.ts` (in fi-dhilal) are gitignored. Is `public/khwater/*.json` gitignored here?

**A:** No — `public/khwater/*.json` and `public/search-index.json` are **committed** (they're in `public/`, served statically). This differs from projects that gitignore generated artifacts. Trade-off: committed generated files mean the repo works without running the generator (clone → `pnpm build` works even if `prebuild` is skipped), but creates merge conflicts if two branches regenerate differently, and bloats git history. The generator is idempotent, so conflicts are resolvable by re-running. A defensible choice for a deploy-anywhere PWA.

### Q67. `KhwaterItem` has both `text` and the `order` array. Why not just render fields in declaration order?

**A:** The `order: string[]` array (`khwater.ts:17`) lets each item specify the **arbitrary interleaving** of its fields (title, then ayah, then text, then another ayah, etc.). Rendering in declaration order would force a fixed layout (always title→text→ayah). The source content has varied structures (some items lead with a verse, some with text), so `order` preserves the author's intended sequence. `ContentRenderer` (`:27-40`) walks `order` and renders each field type accordingly. This is why the flush algorithm (Q5) exists.

### Q68. The generator reads `khatira_content.json` from `src/lib/data/`. Why there and not `data/` or `content/`?

**A:** `generate-chapters.ts:66` `SOURCE_FILE = src/lib/data/khatira_content.json`. Placing the source under `src/lib/data/` co-locates it with the type definitions and (notionally) the data-access layer. It's imported nowhere at runtime (the generator reads it via fs), so the location is just organizational. A cleaner split: `content/khatira.json` (source) vs `src/lib/data/` (code). The current placement conflates source data with lib code. Minor, but indicates no strong content/code boundary.

### Q69. `tsconfig` uses `moduleResolution: bundler`. Why is that right for this app?

**A:** Next.js bundles via Webpack/Turbopack; `bundler` resolution matches that (allows extensionless imports, `package.json` `exports`, no Node-specific quirks). Pairs with `isolatedModules: true` (Next requires per-file transpilation). The alternative `node`/`node16` would be wrong for bundled code. Path alias `@/* → ./src/*` works under `bundler`. This is the standard modern Next.js tsconfig.

### Q70. The `ChapterResponse` type has `metadata.totalItems`. Why store the count in metadata?

**A:** `generate-chapters.ts:70` writes `metadata: { id, version, generated, totalItems }`. Storing `totalItems` in each chapter's metadata lets the UI show "Chapter X (N items)" without loading/counting the items array first, and supports a manifest summary (`index.json` aggregates these). It's denormalization for convenience. The risk: if `totalItems` drifts from `items.length` (manual edit), it's wrong. The generator computes it correctly; a runtime assertion (`metadata.totalItems === items.length`) would catch drift.

### Q71. `index.json` has a `summary` block. What's its purpose, and who consumes it?

**A:** `public/khwater/index.json:177-182` includes a `summary` (total chapters, total items, total size KB). Likely consumed by an admin/debug view or just for at-a-glance build verification. The home page reads `index.json` for the chapter list (`getAllChapters`); whether it uses `summary` depends on the UI. A senior question: is `summary` displayed anywhere, or is it dead metadata? If unused, it's harmless build output. If used, it's a nice "stats" feature.

### Q72. The build emits `out/` with `khwater/0…33` dirs for static. How does Hostinger serve these?

**A:** With `trailingSlash: true`, `/khwater/0/` → `out/khwater/0/index.html`. Hostinger (Apache/LiteSpeed) serves `index.html` for directory requests by default. `docs/HOSTINGER_DEPLOYMENT_PLAN.md` documents FTP-uploading `out/` contents to `public_html/` and `.htaccess` for caching/security headers. The directory-per-chapter structure maps cleanly to static hosting. Without `trailingSlash`, `/khwater/0` would need server-side rewriting to find `khwater/0.html`, which static hosts may not do. This is why `trailingSlash` is essential for static export.

### Q73. `pnpm-workspace.yaml` allow-lists `esbuild`, `sharp`, `unrs-resolver` for build scripts. Why?

**A:** pnpm v9+ blocks native build scripts (postinstall) by default for security; the allow-list (`onlyBuiltDependencies`) explicitly permits these trusted packages to run their install scripts (esbuild compiles its native binary, sharp installs libvips, unrs-resolver builds). Without the allow-list, these deps would be installed but their native binaries missing → runtime errors. This is pnpm's supply-chain hardening. A candidate should know pnpm's default-deny for native scripts and the allow-list escape hatch.

### Q74. `eslint-config-next` is `16.0.1` but `next` is `16.0.7`. Is the mismatch a problem?

**A:** Minor. `eslint-config-next` lags the core `next` releases; a 0.0.6 mismatch usually means a few lint rules may not reflect the latest Next APIs, but no breakage. The bigger concern is that `eslint.config.mjs` (if flat) vs `.eslintrc` (if legacy) must match the eslint-config-next version's expected format. The digest doesn't flag lint failures, so it works. Best practice: keep them in lockstep via a renovate/dependabot rule, but a small drift is tolerable.

### Q75. The generator has no input validation on `khatira_content.json`. What could go wrong?

**A:** `JSON.parse` throws on malformed JSON (build fails — good). But shape errors (a chapter missing `pages`, a page missing `order`, an `order` entry not in `FIELD_MAP`) are handled weakly: unknown `order` types `console.warn` + `continue` (`generate-chapters.ts:103`), but missing required fields produce `undefined` silently. A Zod schema on `SourceChapter`/`SourcePage` run at the start of the generator would fail fast with a clear error ("chapter 5 page 2 missing 'order'") instead of emitting broken items. This is the highest-value robustness improvement.

---

## Round 4: Problem-Solving, Debugging & System Evolution (25 questions)

### Q76. A user reports offline mode shows only 29 chapters but online shows 34. Diagnose.

**A:** The SW `CHAPTER_PAGES` is hardcoded to 29 (`sw.js:16`); the real count is 34. Chapters 0, 30, 31, 32, 33 aren't pre-cached. Fix: (1) immediate — bump `CHAPTER_PAGES` to 34 and redeploy; (2) permanent — generate the SW's chapter list from `index.json` at build (a custom SW build step), or fetch `index.json` in the SW install event and cache the listed chapters dynamically. Add a CI assertion: `SW chapter count === index.json totalChapters`. This is a classic stale-constant bug.

### Q77. The e2e tests (`e2e/*.spec.ts`) all fail when run. Why?

**A:** They target `/elm/1` (`e2e/home.spec.ts:17,25`; `chapter.spec.ts:5`) — the old route from the "Elm" project name; the real route is `/khwater/1`. They also expect `[data-testid="chapter-content"]` etc., but **no `data-testid` attributes exist** in any component (grep-confirmed). And the home title assertion (`/علم/`) doesn't match the actual "خواطر - جميع الفصول". So the suite is entirely stale from pre-migration. There's also **no `playwright.config.ts`** despite docs claiming one. Fix: rewrite e2e against current routes/selectors, add the config, and gate CI on it. Currently `test:e2e` is effectively non-functional.

### Q78. A chapter page shows "not found" for `/khwater/0` in static builds but works in SSR. Why?

**A:** `/khwater/0` (preface) should be generated by `generateStaticParams` (`khwater/[id]/page.tsx:21-24`) which returns all chapter ids including `"0"`. If it 404s only in static, check: (1) `out/khwater/0/index.html` actually exists (the generator must produce `0.json` and SSG must render it). (2) The `ID_MAP` maps `"pre"→"0"` correctly (`generate-chapters.ts:72-75`) — if the source uses a different preface id, `0.json` isn't generated. (3) `trailingSlash:true` means `/khwater/0/` (with slash) is the canonical URL; `/khwater/0` might 404 on strict static hosts. Verify `out/khwater/0/` exists after `build:static`.

### Q79. Search for a known term returns nothing. How do you debug the client search?

**A:** `search/page.tsx` client flow: (1) Did `?q=` reach the component? Check `useSearchParams()` (`:13`). (2) Did `searchChapters(query)` run? Check the `useEffect` deps (`:20-41`). (3) Did `loadAllKhwaterData()` fetch all 34 JSONs? Network tab — any 404/failure. (4) Is the index built? `buildSearchIndex` runs over all items (`search-index.ts:17`). (5) Does `searchIndex` match? Check term normalization (lowercasing) and the scoring thresholds. Likely culprit: a failed `fetch` for one chapter JSON breaks `Promise.all`-style loading, or the term has Arabic normalization issues (though this app lowercases only, no harakat stripping).

### Q80. How would you wire up the dormant bookmarks feature end-to-end?

**A:** `bookmarks.ts` exists (9 functions, tested). To ship: (1) add a `<BookmarkButton chapterId={id}>` client component on the chapter page calling `toggleBookmark`. (2) Add a `/bookmarks` route (`app/(routes)/bookmarks/page.tsx`, client) listing bookmarked chapters via `getBookmarks()` + `loadChapterData`. (3) Handle SSR hydration (bookmarks are localStorage — use `useLocalStorage`/`isLoading` gate). (4) Add the route to the SW cache and sitemap (noindex for /bookmarks). (5) Add e2e. The hard part is already done (the lib + tests); it's purely the UI wiring that's missing.

### Q81. The inline FOUC script throws in Safari private mode. What's the fix?

**A:** `layout.tsx:77-94` reads `localStorage('elm-theme')`. Safari private mode throws on `localStorage.getItem` (not just returns null). The script must wrap access in try/catch (the digest suggests it does). On catch, fall back to `prefers-color-scheme`. Confirm the script's try/catch covers all `localStorage` access and the `classList.add` doesn't run with an undefined value. Test in Safari private window. This is a well-known Safari quirk; the fix is defensive localStorage access everywhere (the `useLocalStorage` hook already does this).

### Q82. How would you add real bilingual support (the `useTranslation` hook is Arabic-only)?

**A:** (1) Split `translations.ts` into `messages/ar.json` + `messages/en.json`. (2) Make `useTranslation(locale)` load the right messages (or adopt next-intl properly with `[locale]` routing + proxy). (3) Add `lang`/`dir` switching — currently hardcoded `lang="ar" dir="rtl"` (`layout.tsx:67`); needs to derive from locale. (4) RTL→LTR CSS audit (the app is RTL-only). (5) The content (`khatira_content.json`) is Arabic-only — English would need translation (out of scope for UI i18n). This is a big lift; the current hook is scaffolding that anticipated it.

### Q83. `maximumScale: 1` is set in the viewport. Why is that a problem, and how do you fix it?

**A:** `layout.tsx:40` sets `maximumScale: 1`, preventing user pinch-zoom. This is a **WCAG 2.1 SC 1.4.4 failure** (resize text) — directly contradicting `CLAUDE.md:166`'s "WCAG 2.1 AA compliant" claim. Fix: remove `maximumScale` (and `user-scalable=no` if present). Users with low vision need to zoom. The font-size control feature doesn't substitute — it only scales the app's own text, not the whole page. This is a clear, citable a11y bug.

### Q84. `CLAUDE.md` references `NEXT_PUBLIC_APP_URL`, but `translations.ts:122` reads `NEXT_PUBLIC_SITE_URL`. Which is right?

**A:** The **code** reads `NEXT_PUBLIC_SITE_URL` (`translations.ts:122`, default `https://elm-app.vercel.app`). `NEXT_PUBLIC_APP_URL` appears only in docs (`CLAUDE.md`, `layout.tsx:24` comment). So docs describe a var that's never read — drift. Two env var names for the same concept is a classic config-fragmentation bug. Fix: pick one (`NEXT_PUBLIC_SITE_URL`), update all docs, and update the stale default (`elm-app.vercel.app` → the real URL). Anyone following the docs to set `NEXT_PUBLIC_APP_URL` would find their env ignored.

### Q85. How would you add on-demand revalidation when `khatira_content.json` changes?

**A:** Currently ISR (`revalidate: 3600`) regenerates within an hour in SSR mode. For instant updates: (1) After regenerating via `pnpm generate`, call Next's revalidation API (`/api/revalidate?secret=...&path=/khwater/0`) for affected chapters. (2) This requires an API route (breaks static export — so SSR-only feature). (3) For static/Hostinger, there's no on-demand — must rebuild+redeploy. (4) The in-memory `cachedKhwaterData` (`khwater-service.ts:37`) also needs invalidation on revalidate (module cache isn't auto-cleared). This is a non-trivial addition that only benefits the SSR deploy target.

### Q86. A contributor adds a 35th chapter but the home grid shows 34. What did they miss?

**A:** Likely: (1) They added to `khatira_content.json` but didn't run `pnpm generate` (or `prebuild` didn't fire). (2) The new chapter's `id` isn't numeric/string-mapped (no `ID_MAP` entry) → `generateStaticParams` emits it but maybe under a wrong id. (3) `index.json` wasn't regenerated (still says 34). (4) In SSR, the `cachedKhwaterData` is stale (process not restarted). Debug: run `pnpm generate`, check `index.json` shows 35, check `public/khwater/34.json` exists, restart the dev server.

### Q87. How would you eliminate the dead code (bookmarks, khwater-server, OptimizedImage, UI.tsx, generate-index, etc.)?

**A:** Systematic dead-code elimination: (1) grep each symbol for imports; (2) for confirmed-zero-imports, delete the file; (3) run `pnpm build` + `pnpm test` to confirm nothing breaks; (4) remove orphaned tests (`bookmarks.test.ts` if `bookmarks.ts` deleted — or keep the tests if you'll re-implement); (5) add a CI check (e.g., `knip` or `ts-prune`) to prevent future dead code. The risk: deleting `bookmarks.ts` loses a tested feature — decide ship-or-delete deliberately, not by default. Document the decision in an ADR.

### Q88. The search index rebuild is O(items) on the client on first search. How would you optimize?

**A:** Options: (1) **Ship the prebuilt `search-index.json`** (already generated, currently unused — Q9) and load it instead of rebuilding — removes the O(items) CPU cost, trades for a 1.3 MB fetch. (2) **Build the index in a Web Worker** so the main thread doesn't jank during indexing (`docs/REACT-19-BEST-PRACTICES.md` mentions this for a similar project). (3) **Lazy-build per chapter** as the user navigates. The cheapest win is (1) — the file already exists; just `fetch('/search-index.json')` and skip `buildSearchIndex`. Why it wasn't done is a mystery (maybe abandoned mid-refactor).

### Q89. `react-hooks/set-state-in-effect` is disabled in `InstallButton`. How would you fix it properly?

**A:** `InstallButton.tsx:18` sets state inside `useEffect` capturing `beforeinstallprompt`. The rule warns of effect cycles. Proper fixes: (1) Use a ref to store the event and force a re-render via a counter, avoiding setState-in-effect. (2) Restructure so the event listener updates state via a stable callback. (3) If the disable is genuinely safe (one-time setup, no loop), document why in a comment rather than a bare disable. A senior review should determine if there's a real cycle risk; a bare `eslint-disable` without justification is a smell.

### Q90. How would you add a "continue reading" feature (resume at last scroll position)?

**A:** Persist scroll position per chapter via `useLocalStorage<Record<chapterId, number>>('elm-scroll')`. On chapter page mount, restore scroll after content renders (in a `useEffect` after the dynamic import resolves). On scroll (debounced), save the position. Challenge: the dynamic `ContentRenderer` import means content isn't present immediately — restore scroll after it loads (await the import, then `window.scrollTo`). The reading-progress bar (Q49) likely already tracks scroll; reuse that value. Persisting it gives cross-session resume.

### Q91. A build fails with "Cannot find module './public/khwater/0.json'". What went wrong?

**A:** `khworker-service.ts:59` does `await import('../../public/khwater/${id}.json')` on the server. If `0.json` doesn't exist, the import fails. Cause: `prebuild` (the generator) didn't run or failed silently, so the JSON wasn't generated. Fix: run `pnpm generate` manually and check for errors; ensure `prebuild` is wired (`package.json:9`); ensure the generator's `SOURCE_FILE` path is correct. Also: in some bundler configs, importing JSON from `public/` is unusual — verify Next allows it (it does for `public/` via the special handling, but a clean check is to `fetch` instead).

### Q92. How would you add audio recitations per chapter?

**A:** (1) Source audio files, name by chapter id (`public/audio/0.mp3`). (2) Add an `<AudioPlayer chapterId={id}>` client component on the chapter page with play/pause/seek. (3) Preload metadata (duration) for the current chapter; lazy-load others. (4) Add audio files to the SW precache (with size awareness — audio is large; consider streaming/range requests over caching). (5) Persist playback position (`useLocalStorage`) for resume. Challenges: file size (~2–5 MB/chapter × 34 = ~100 MB — too big to precache; stream instead), bandwidth for mobile, and finding recordings that match the content.

### Q93. The app duplicates data: `public/khwater/*.json` (committed) + in-memory index. Is the duplication justified?

**A:** The per-chapter JSONs are the source for both SSG (server imports them at build) and client search (fetch + rebuild index). The in-memory index is a derived structure (built from the JSONs), not a duplicate copy of raw data — it's a search-optimized representation. So it's not wasteful duplication; it's the necessary runtime structure. The genuinely unused duplication is `public/search-index.json` (Q9) — a prebuilt index that's generated but never loaded. Removing it (or actually using it) eliminates the only true waste.

### Q94. How would you migrate to real search (e.g., a server endpoint or Algolia)?

**A:** The current client search rebuilds the index each session (O(items), ~787 KB fetched). For real search: (1) **Server route** `/api/search?q=...` that queries a built index (Lunr, FlexSearch, or Postgres FTS if migrated to a DB) — but breaks static export. (2) **Prebuilt client index** — load `search-index.json` (already generated) into FlexSearch client-side, skipping the rebuild (Q88). (3) **Algolia/Meilisearch** — offload to a managed search; best relevance, but external dependency + cost. For a static-deployable win, option (2) is the lowest-effort high-impact change. For SSR-only, option (1).

### Q95. How would you convert the dual-build into a single SSR-only deploy, dropping static?

**A:** Remove `build:static`, the `BUILD_TYPE` conditional in `next.config.ts`, and the static-specific workarounds (client `/` redirect → server `redirect()`, client search → could stay client). Restore the SSR search (`docs/SEARCH_SSR_IMPLEMENTATION_SUMMARY.md` describes it). Simplify the SW (no need to cache both slash variants). Trade-offs: lose Hostinger/cheap-host deploy, gain simpler code + ISR + on-demand revalidation + future dynamic features. Decision hinges on whether the Hostinger target is still needed — if the audience is mobile-PWA-only, static was for cost; if SSR hosting is affordable, simplify.

### Q96. A teammate wants to add Zustand for state. How do you respond?

**A:** Current state: theme + font size (both via `useLocalStorage`), ephemeral UI state (mobile menu, search query). There's no shared mutable state across distant components that Context would poorly handle. Zustand would add a dependency for state that's already cleanly persisted. Ask: "What state needs to be shared and frequently updated across components?" If the answer is "bookmarks when wired" (Q80), then maybe — but `useLocalStorage` + a custom event (like bassaer's `bookmarks-updated` pattern) handles it without a store. For now, YAGNI.

### Q97. The app has no tests for `khwater-service.ts` (the most important runtime module). How do you add them?

**A:** `khwater-service.ts` does fs/import + fetch + caching — hard to unit test. Strategy: (1) **Mock the data layer** — inject the chapter data rather than fetching it. Refactor `loadAllKhwaterData` to accept a loader fn, then test `searchChapters`/`buildSearchIndex` with injected data. (2) **Test `searchIndex` and `buildSearchIndex`** (pure functions in `search-index.ts`) directly — these are already partly tested. (3) **Integration test** the service with a fixture `public/khwater/*.json` in a temp dir. (4) The caching behavior (`cachedKhwaterData`) needs a module reset between tests (jest/vitest module isolation). The highest-value tests cover the search scoring + grouping logic with realistic fixtures.

### Q98. How would you implement a "reading plan" (e.g., one chapter per day)?

**A:** Deterministic assignment: `const dayOfYear = Math.floor((Date.now() - startOfYear) / 86400000); const chapter = chapters[dayOfYear % chapters.length]`. Show "Today's chapter" on the home page. Persist progress (`useLocalStorage<Record<chapterId, 'done'>>('elm-plan')`). Add a "mark complete" button. Challenge: with 34 chapters, a yearly cycle repeats ~10× — maybe a 34-day cycle is better. Make the plan configurable (length, start date). The determinism (no `Math.random`) ensures all users see the same chapter and SSR/client agree.

### Q99. How would you add analytics (which chapters are read most, search terms)?

**A:** Privacy-friendly (Plausible/Umami): track `/khwave/<id>` pageviews (automatic), search queries (custom event on `SearchForm` submit — be careful not to log sensitive content), bookmark toggles, theme preference. For static deploy, analytics must be client-side (Plausible script) since there's no server. Gate the script to production. The events fire client-side. Avoid logging full search text if it could be sensitive; aggregate top-N terms server-side instead. Add the script via `next/script` in `layout.tsx`.

### Q100. Onboarding a new dev: what's the 5-step guide?

**A:** 1. Read `AGENTS.md` + `CLAUDE.md` (note where they're stale — Q16, Q84) and `docs/HOSTINGER_DEPLOYMENT_PLAN.md` (dual-build). 2. `pnpm install && pnpm generate && pnpm dev` — see the data flow from `khatira_content.json` to `public/khwater/*.json`. 3. Trace `/khwater/1`: `generateStaticParams` → `page.tsx` → `loadChapterData` → `ContentRenderer`. 4. Read `scripts/generate-chapters.ts` end-to-end (the flush algorithm, Q5) — it's the core of the project. 5. Run `pnpm test:run` (vitest passes) and try `pnpm test:e2e` (it fails — Q77; that's a known issue). Warn them: docs drift is significant; trust the code, not the docs.

---

## Bonus Round: Stretch Questions (5 questions)

### Q101. Design a fix for the "29 vs 34 chapter" drift that prevents recurrence permanently.

**A:** Single source of truth: `index.json` is the manifest generated by the build. The SW should not hardcode chapter counts — instead, at SW `install`, fetch `/khwater/index.json`, read `totalChapters` and the chapter id list, and precache exactly those (plus their `/` variants). This makes the SW self-adjusting. `manifest.json`'s count and all docs should also be generated from `index.json` (or removed). Add a CI assertion comparing SW-expected count to `index.json.totalChapters`. The root cause was manual duplication of a value that has one true source; the fix is to eliminate the duplication.

### Q102. The dual-build design has zero `process.env` in `src/`. Argue why this is the strongest possible dual-build, and when you'd violate it.

**A:** Because the app code is environment-agnostic, there's no "static branch" that rots untested in SSR or vice versa — both builds run identical code, so a bug in one is a bug in both (and vice versa). This is the strongest property: you can't accidentally ship static-only logic that breaks SSR. You'd violate it when a feature genuinely can't exist in one mode (e.g., a contact form needing a server — then gate it with `process.env.DEPLOY_TARGET` and accept that it's dead in static). The discipline: prefer restructuring (client-side alternative) over env branching; branch only as a last resort, with a test covering both branches.

### Q103. The `cachedKhwaterData` module cache has no invalidation in SSR. Propose a safe invalidation strategy that doesn't break static export.

**A:** In SSR, the cache should respect ISR: invalidate when the underlying files' mtime changes, or expose a `clearCache()` called by a revalidation API route. A `Map<filePath, {data, mtime}>` checked on each access (stat the file, compare mtime, reload if changed) gives mtime-based invalidation. For static export (where the module only loads once per page navigation), the cache is naturally short-lived — no invalidation needed. The strategy: stat-on-access in SSR, ignore in static. Trade-off: a stat call per access (cheap). Never use a global timer-based invalidation (races with requests).

### Q104. The `e2e` suite is entirely stale. Propose a minimal but meaningful e2e suite.

**A:** Replace the broken specs with: (1) **home loads** — visit `/home`, assert chapter grid renders N cards (read N from `index.json` so it self-adjusts). (2) **chapter navigation** — click a card, assert `/khwater/<id>` renders content (assert a known string from `0.json`). (3) **search** — visit `/search?q=<known term>`, assert results appear. (4) **offline** — throttle to offline, revisit a cached chapter, assert it loads. (5) **theme toggle** — click, assert `documentElement.classList` changes. Add `playwright.config.ts`, run on the dev server, gate CI. Five tests cover the critical user paths without over-testing.

### Q105. The docs (`CLAUDE.md`, `AGENTS.md`, `docs/*.md`) significantly diverge from code. Propose a process to keep them honest.

**A:** (1) **Treat docs as code** — review them in every PR that changes behavior; a PR touching search must update `SEARCH_*.md`. (2) **Generate what you can** — chapter counts, route lists, script inventories should be generated from source into docs (or removed if hand-maintained). (3) **Add a "docs freshness" CI check** — a script that greps docs for hardcoded values (chapter count "29", route "/elm/") and fails if they don't match code. (4) **Mark stale docs explicitly** — add a "Last verified: <version>" header; archive old reports rather than editing them. (5) **Single source of truth** — if `CLAUDE.md` and `AGENTS.md` duplicate facts, one will rot; consolidate. The meta-lesson: this repo's docs drift because no process enforced it.

---

## Evaluation Criteria

| Area | Mid | Senior | Staff |
|------|-----|--------|-------|
| **Architecture** | Explains dual-build toggle | Debates static-vs-SSR trade-offs | Designs the zero-env-in-src invariant |
| **React** | Identifies server vs client pages | Spots the SSR-vs-client search revert | Redesigns provider/hook architecture |
| **TypeScript** | Knows strict benefits | Catches the `ContentType` union vs enum choice | Designs Zod validation for the generator |
| **Data** | Traces the generation pipeline | Debugs the flush algorithm edge cases | Eliminates the chapter-count drift permanently |
| **PWA** | Knows what a SW does | Diagnoses the 29-vs-34 cache bug | Designs dynamic SW precache from index.json |
| **Problem-solving** | Follows debug steps | Identifies dead code (bookmarks, etc.) | Prevents recurrence via CI + single-source |
| **Testing** | Writes a unit test for searchIndex | Recognizes the stale e2e suite | Designs minimal meaningful e2e + CI gates |
| **Maintainability** | Notices docs drift | Catalogs the drift systematically | Designs a process to keep docs honest |

---

*End of interview document. 105 questions across 5 rounds. All file/function references verified against the salam-nextjs codebase.*
