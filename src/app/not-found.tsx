import Link from 'next/link';
import { translations } from '@/lib/translations';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="font-amiri text-8xl font-bold text-amber-500/30 dark:text-amber-400/20 select-none">
            ٤٠٤
          </span>
        </div>

        <h1 className="font-amiri text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          الصفحة غير موجودة
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.
        </p>

        <Link
          href="/home"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          <svg className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {translations.offline.backHome}
        </Link>
      </div>
    </main>
  );
}
