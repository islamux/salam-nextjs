// Translation keys following DRY principle
// Centralized translation management for the entire application

export const translations = {
  // Application branding
  app: {
    name: 'خواطر',
    nameWithSubtitle: 'خواطر - Islamic Spiritual Texts',
    description: 'Islamic spiritual texts and chapters',
    author: 'Khwater Project',
    installApp: 'تثبيت التطبيق',
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

    // Additional chapter page strings
    pageTitle: (id: number) => `الفصل ${id} من 34`,
    pageHeader: (id: number) => `الفصل ${id}`,
    ariaNavigate: 'تنقل بين الفصول',
    ariaPrevious: (num: number) => `انتقل إلى الفصل ${num}`,
    ariaNext: (num: number) => `انتقل إلى الفصل ${num}`,
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
    developedBy: 'المشروع مفتوح المصدر تحت رخصة جنو'


  },

  // Search
  search: {
    title: 'بحث في المحتوى',
    label: 'بحث في المحتوى',
    placeholder: 'ابحث في النصوص والأيات...',
    ariaLabel: 'بحث في المحتوى',
    help: 'اكتب كلمات للبحث في جميع فصول كتاب خواطر',
    loading: 'جاري البحث...',
    noResults: 'لم يتم العثور على نتائج',
    resultsFound: (count: number) => `تم العثور على نتائج في ${count} فصل`,
    viewChapter: 'عرض الفصل كاملاً ←',
  },

  // Share
  share: {
    readChapter: (id: string | number) => `اقرأ الفصل ${id} من كتاب خواطر`,
    defaultTitle: (id: string | number) => `الفصل ${id} - كتاب خواطر`,
    defaultText: (id: string | number) => `اقرأ الفصل ${id} من كتاب خواطر`,
    ariaLabel: 'مشاركة الفصل',
    label: 'مشاركة',
    copied: 'تم النسخ!',
  },

  // UI Controls
  ui: {
    fontSize: {
      decrease: 'تصغير الخط',
      increase: 'تكبير الخط',
    },
    theme: {
      toggle: {
        toDark: 'الوضع المظلم',
        toLight: 'الوضع المضيء',
      },
      ariaToggle: (mode: 'light' | 'dark') =>
        mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
    },
  },

  // Home page
  home: {
    title: 'خواطر - جميع الفصول',
    bookName: 'كتاب خواطر',
    subtitle: 'خواطر عن الدين والحياة',
    introductionCount: (count: number) => `${count} فصلاً`,
    searchInContent: 'بحث في المحتوى',
    allChapters: 'جميع الفصول',
    chapter: (id: number) => `الفصل ${id}`,
    itemCount: (count: number) => `${count} عنصر`,
  },

  // Accessibility
  a11y: {
    chapterNavigation: 'تنقل بين الفصول',
    menuToggle: 'قائمة',
  },
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elm-app.vercel.app';

// Helper type for translation keys
export type TranslationKey = keyof typeof translations;

// Helper function to get nested translation
export function getTranslation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>
>(obj: T, path: string): T[keyof T] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((acc, key) => acc?.[key], obj) as any;
}
