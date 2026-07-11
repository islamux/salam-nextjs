import Link from 'next/link';
import { translations } from '@/lib/translations';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 bg-book-page" dir="rtl">
      <div className="max-w-sm w-full text-center">
        <span className="font-arabic text-8xl font-bold text-amber-600/10 dark:text-amber-400/05 select-none leading-none block mb-2" aria-hidden="true">
          ٤٠٤
        </span>

        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-400 dark:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <h1 className="font-arabic text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-sm">
          الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.
        </p>

        <Link href="/home" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {translations.offline.backHome}
        </Link>
      </div>
    </main>
  );
}
