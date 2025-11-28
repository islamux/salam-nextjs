# Footer Update Guide: Adding Developer Info

This guide outlines the steps to add a "Developed by" section to the footer, including GitHub and Email links with custom icons.

## Objective

Add a professional-looking section to the footer that credits the developer and provides contact links.

## Step 1: Create Icon Components

Since we want to keep the project lightweight, we'll create simple SVG components for the icons instead of installing a large library.

### 1. Create `src/components/shared/GithubIcon.tsx`

Create a new file at `src/components/shared/GithubIcon.tsx` and paste the following code:

```tsx
import React from 'react';

export default function GithubIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  );
}
```

### 2. Create `src/components/shared/MailIcon.tsx`

Create a new file at `src/components/shared/MailIcon.tsx` and paste the following code:

```tsx
import React from 'react';

export default function MailIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
}
```

## Step 2: Update Translations

We need to add the "Developed by" text to our translation system to maintain consistency.

### 1. Update `src/lib/translations.ts`

Open `src/lib/translations.ts` and update the `footer` object.

**Find this block:**

```typescript
  // Footer
  footer: {
    copyright: '© 2025 كتاب خواطر',
    bookName: 'كتاب خواطر',
    tagline: 'عن الدين والحياة',
    rightsReserved: 'جميع الحقوق محفوظة لكل مسلم',
    builtWith: 'تم التطوير باستخدام Next.js و TypeScript',
  },
```

**Replace it with this:**

```typescript
  // Footer
  footer: {
    copyright: '© 2025 كتاب خواطر',
    bookName: 'كتاب خواطر',
    tagline: 'عن الدين والحياة',
    rightsReserved: 'جميع الحقوق محفوظة لكل مسلم',
    builtWith: 'تم التطوير باستخدام Next.js و TypeScript',
    developedBy: 'تم التطوير بواسطة', // New key
  },
```

### 2. Update `src/hooks/useTranslation.ts`

Open `src/hooks/useTranslation.ts` and update the `footer` object in the return value to expose the new key.

**Find this block:**

```typescript
      footer: {
        copyright: translations.footer.copyright,
        bookName: translations.footer.bookName,
        tagline: translations.footer.tagline,
        rightsReserved: translations.footer.rightsReserved,
        builtWith: translations.footer.builtWith,
      },
```

**Replace it with this:**

```typescript
      footer: {
        copyright: translations.footer.copyright,
        bookName: translations.footer.bookName,
        tagline: translations.footer.tagline,
        rightsReserved: translations.footer.rightsReserved,
        builtWith: translations.footer.builtWith,
        developedBy: translations.footer.developedBy, // New key
      },
```

## Step 3: Update Footer Component

Now, let's add the new section to the Footer component.

Open `src/components/shared/Footer.tsx`.

**1. Add Imports**
Add these imports at the top of the file:

```tsx
import GithubIcon from './GithubIcon';
import MailIcon from './MailIcon';
```

**2. Update the JSX**
Locate the `return` statement. We will add the new section _after_ the `builtWith` paragraph.

**Find this block:**

```tsx
<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
  <p className="text-xs text-gray-400 dark:text-gray-500">{footer.builtWith}</p>
</div>
```

**Replace it with this:**

```tsx
<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4">
  <p className="text-xs text-gray-400 dark:text-gray-500">{footer.builtWith}</p>

  {/* New Developer Section */}
  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
    <span>{footer.developedBy}</span>
    <div className="flex items-center gap-3">
      <a
        href="https://github.com/islamux/salam-nextjs"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="GitHub"
      >
        <GithubIcon className="w-5 h-5" />
      </a>
      <a
        href="mailto:fathi733@gmail.com"
        className="hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Email"
      >
        <MailIcon className="w-5 h-5" />
      </a>
    </div>
  </div>
</div>
```

## Step 4: Verification

1.  Run the development server: `npm run dev` or `pnpm dev`.
2.  Scroll to the bottom of the page.
3.  You should see the "تم التطوير بواسطة" text along with the GitHub and Email icons.
4.  Hover over the icons to see the color change effect.
5.  Click the links to ensure they open the correct URL and email client.

Good luck! You've got this.
