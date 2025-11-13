// Translation keys following DRY principle
// Centralized translation management for the entire application

export const translations = {
  // Application branding
  app: {
    name: 'خواطر',
    nameWithSubtitle: 'خواطر - Islamic Spiritual Texts',
    description: 'Islamic spiritual texts and chapters',
    author: 'Khwater Project',
  },

  // Navigation
  nav: {
    home: 'الرئيسية',
    search: 'بحث',
    skipToContent: 'انتقل إلى المحتوى الرئيسي',
    mainContent: 'المحتوى الرئيسي',
  },

  // Chapter navigation
  chapter: {
    label: 'الفصل',
    ofTotal: (id: string | number, total: string | number) => `الفصل ${id} من ${total}`,
    previous: 'الفصل السابق',
    next: 'الفصل التالي',
    goTo: (num: string | number) => `انتقل إلى الفصل ${num}`,
    title: (id: string | number) => `الفصل ${id}`,
    contentTitle: (id: string | number) => `الفصل ${id} - كتاب خواطر`,
    contentDescription: (id: string | number) => `اقرأ الفصل ${id} من كتاب خواطر`,
    contentOfBook: (id: string | number) => `محتوى الفصل ${id} من كتاب خواطر`,
    keywords: (id: string | number) => `كتاب خواطر, فصل ${id}, نصوص إسلامية`,
  },

  // Offline page
  offline: {
    title: 'غير متصل بالإنترنت',
    description: 'يبدو أنك غير متصل بالإنترنت. تأكد من اتصالك ثم حاول مرة أخرى.',
    retry: 'إعادة المحاولة',
    backHome: 'العودة للرئيسية',
    cachedContent: '📱 يمكنك قراءة المحتوى المحفوظ مسبقاً حتى بدون اتصال',
  },

  // Footer
  footer: {
    copyright: '© 2025 كتاب خواطر',
    bookName: 'كتاب خواطر',
    tagline: 'عن الدين والحياة',
    rightsReserved: 'جميع الحقوق محفوظة لكل مسلم',
    builtWith: 'تم التطوير باستخدام Next.js و TypeScript',
  },

  // Search
  search: {
    help: 'اكتب كلمات للبحث في جميع فصول كتاب خواطر',
  },

  // Share
  share: {
    readChapter: (id: string | number) => `اقرأ الفصل ${id} من كتاب خواطر`,
  },

  // Accessibility
  a11y: {
    chapterNavigation: 'تنقل بين الفصول',
    menuToggle: 'قائمة',
  },
} as const;

// Helper type for translation keys
export type TranslationKey = keyof typeof translations;

// Helper function to get nested translation
export function getTranslation<
  T extends Record<string, any>
>(obj: T, path: string): T[keyof T] {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) as any;
}
