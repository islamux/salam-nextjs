// useTranslation hook - lightweight i18n hook following best practices
// Zero dependencies, type-safe, tree-shakeable

import { useMemo } from 'react';
import { translations, TranslationKey, getTranslation } from '@/lib/translations';

type TranslationValue = string | ((...args: any[]) => string);

export function useTranslation() {
  const t = useMemo(() => {
    return {
      // Get translation by key path (e.g., 'chapter.previous' or 'nav.home')
      get: (key: string): string => {
        const value = getTranslation(translations, key) as any;
        if (typeof value === 'function') {
          throw new Error(`Translation "${key}" is a function, use t.getFunc instead`);
        }
        return value || key;
      },

      // Get function-based translation (for dynamic strings)
      getFunc: (key: string, ...args: any[]): string => {
        const value = getTranslation(translations, key) as any;
        if (typeof value === 'function') {
          return value(...args);
        }
        if (typeof value === 'string') {
          return value;
        }
        return key;
      },

      // Convenience methods for common translations
      app: {
        name: translations.app.name,
        nameWithSubtitle: translations.app.nameWithSubtitle,
        description: translations.app.description,
        author: translations.app.author,
      },

      nav: {
        home: translations.nav.home,
        search: translations.nav.search,
        skipToContent: translations.nav.skipToContent,
        mainContent: translations.nav.mainContent,
        menuToggle: translations.a11y.menuToggle,
      },

      chapter: {
        label: translations.chapter.label,
        ofTotal: translations.chapter.ofTotal,
        previous: translations.chapter.previous,
        next: translations.chapter.next,
        goTo: translations.chapter.goTo,
        title: translations.chapter.title,
        contentTitle: translations.chapter.contentTitle,
        contentDescription: translations.chapter.contentDescription,
        contentOfBook: translations.chapter.contentOfBook,
        keywords: translations.chapter.keywords,
      },

      offline: {
        title: translations.offline.title,
        description: translations.offline.description,
        retry: translations.offline.retry,
        backHome: translations.offline.backHome,
        cachedContent: translations.offline.cachedContent,
      },

      footer: {
        copyright: translations.footer.copyright,
        bookName: translations.footer.bookName,
        tagline: translations.footer.tagline,
        rightsReserved: translations.footer.rightsReserved,
        builtWith: translations.footer.builtWith,
      },

      search: {
        help: translations.search.help,
      },

      share: {
        readChapter: translations.share.readChapter,
      },

      a11y: {
        chapterNavigation: translations.a11y.chapterNavigation,
        menuToggle: translations.a11y.menuToggle,
      },
    };
  }, []);

  return t;
}
