// Offline page - displayed when user is offline

'use client';

import OfflineIcon from '@/components/shared/OfflineIcon';
import RetryButton from '@/components/shared/RetryButton';
import HomeButton from '@/components/shared/HomeButton';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-6">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <OfflineIcon />
        </div>

        <h1 className="arabic-title text-3xl font-bold mb-4">
          غير متصل بالإنترنت
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-loose">
          يبدو أنك غير متصل بالإنترنت. تأكد من اتصالك ثم حاول مرة أخرى.
        </p>

        <div className="space-y-4">
          <RetryButton />
          <HomeButton />
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            📱 يمكنك قراءة المحتوى المحفوظ مسبقاً حتى بدون اتصال
          </p>
        </div>
      </div>
    </main>
  );
}
