// Font size control component for adjusting text size

'use client';

import { useFontSize } from '@/hooks/useFontSize';
import { useTranslation } from '@/hooks/useTranslation';

export default function FontSizeControl() {
  const { fontSize, increaseFontSize, decreaseFontSize, canIncrease, canDecrease } = useFontSize();
  const { ui } = useTranslation();

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={decreaseFontSize}
        disabled={!canDecrease}
        className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={ui.fontSize.decrease}
        title={ui.fontSize.decrease}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[2rem] text-center">
        {fontSize}
      </span>
      <button
        onClick={increaseFontSize}
        disabled={!canIncrease}
        className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={ui.fontSize.increase}
        title={ui.fontSize.increase}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
