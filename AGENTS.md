# AGENTS.md

This file provides guidance for agentic coding agents operating in this repository.

## Project Overview

**خواطر - Islamic Spiritual Texts** - A Next.js 16 application presenting Islamic spiritual texts (29 chapters) with full Arabic RTL support, search functionality, bookmarking, PWA capabilities, and comprehensive testing. Built with TypeScript, Tailwind CSS 4.x, and App Router.

## Essential Commands

### Installation & Development

```bash
# Install dependencies
pnpm install

# Run development server (Turbopack has font issues, use dev server)
pnpm dev

# Build for production (use for Vercel deployment)
pnpm build

# Test production build locally
pnpm start
```

### Linting & Formatting

```bash
# Run ESLint
pnpm lint

# Format code with Prettier
pnpm prettier --write .
```

### Testing

```bash
# Unit tests (watch mode - recommended for development)
pnpm test

# Unit tests (run once, no watch)
pnpm test:run

# Unit tests with browser UI
pnpm test:ui

# Unit tests with coverage report
pnpm test:coverage

# Run a single test file
pnpm vitest run src/lib/utils/__tests__/search-index.test.ts

# Run a single test
pnpm vitest run -t "test name pattern"
```

### E2E Testing (Playwright)

```bash
# Run E2E tests
pnpm exec playwright test
```

## Code Style Guidelines

### TypeScript

- Strict mode enabled (`"strict": true` in tsconfig.json)
- Use explicit types for function parameters and return values
- Prefer interfaces over types for object shapes, use types for unions/primitives
- Use `Record<K, T>` instead of `{ [key: K]: T }`
- Use `string` literal types for known values (e.g., `'title' | 'subtitle'`)
- Avoid `any` - use `unknown` when type is truly uncertain
- Prefix interface fields as optional with `?` rather than `| undefined`

### Imports

- Use absolute imports with `@/` prefix (configured via `paths` in tsconfig.json)
- Group imports in this order:
  1. React/Next.js imports (`'use client'`, imports from `next/*`)
  2. Absolute imports (`@/*`)
  3. Relative imports (`./`, `../`)
- Do NOT add comments to imports unless they require special explanation

### Component Structure

- Use functional components with TypeScript interfaces for props
- Client components must have `'use client'` at the very top
- Default export for page components and feature components
- Named exports for utility components
- One component per file (filename matches component name, PascalCase)
- Keep components small and focused - extract sub-components when >100 lines

### Naming Conventions

- **Components**: PascalCase (e.g., `ContentRenderer`, `ThemeToggle`)
- **Files**: PascalCase for components, camelCase for utilities/hooks
- **Variables/functions**: camelCase (e.g., `renderContentByOrder`, `fontSize`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_FONT_SIZE`)
- **Types/Interfaces**: PascalCase (e.g., `KhwaterItem`, `ContentType`)
- **CSS classes**: kebab-case (Tailwind utilities)

### Error Handling

- Use early returns for error conditions
- Never swallow errors silently - log or return meaningful values
- Use try/catch with specific error types when async operations fail
- Provide user-friendly error messages in UI components

### Tailwind CSS

- Use utility classes for all styling (Tailwind CSS 4.x)
- RTL support: Use logical properties (e.g., `ms-4` instead of `ml-4`)
- Arabic fonts: Use `font-amiri` and `font-noto-arabic` classes
- Dark mode: Use `dark:` prefix for dark mode styles
- Responsive: Use `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Do not create custom CSS classes unless Tailwind cannot handle it

### Arabic/RTL Requirements

- All text content must be in Arabic with proper `dir="rtl"` support
- Test all pages in RTL mode
- Use Arabic fonts (Amiri for titles, Noto Sans Arabic for body)
- Ensure text alignment follows RTL conventions
- Test with actual Arabic content, not LTR placeholder text

### Testing Patterns

- Place test files alongside source files: `*.test.ts` next to `*.ts`
- Test utilities and hooks in `src/lib/utils/__tests__/`
- Follow AAA pattern: Arrange, Act, Assert
- Use `vi.mock()` for Next.js module mocks
- Test both success and error paths

### PWA Features

- Service worker at `public/sw.js` for offline support
- Manifest at `public/manifest.json` with Arabic metadata
- Do NOT trigger install prompt automatically - use manual install button
- Test offline functionality before deploying

### Performance

- Use Next.js App Router with Server Components by default
- Mark client components with `'use client'` only when needed
- Use `next/image` for optimized images (configured in next.config.ts)
- Enable ISR with `revalidate` constant for static pages (currently 3600s)

### File Organization

```
src/
├── app/              # App Router pages and layouts
├── components/       # React components
│   ├── khwater/     # Khwater-specific components
│   ├── shared/      # Shared/reusable components
│   └── home/        # Home page components
├── lib/              # Core logic
│   ├── data/        # Data service and fetching
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── hooks/            # Custom React hooks
└── types/            # Type declarations
```

### Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep commits focused and atomic
- Write clear commit messages describing the "why"
- Run `pnpm lint` and `pnpm test` before committing

### Key Files to Understand

- `src/lib/data/khwater-service.ts` - Central data fetching service
- `src/lib/types/khwater.ts` - TypeScript type definitions
- `src/components/khwater/ContentRenderer.tsx` - Content rendering logic
- `src/app/layout.tsx` - Root layout with RTL, fonts, metadata
- `public/sw.js` - Service worker for offline support
