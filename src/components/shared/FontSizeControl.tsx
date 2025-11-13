// Font size control component for adjusting text size

'use client';

import { useState, useEffect } from 'react';

const FONT_SIZE_KEY = 'elm-font-size';
const MIN_SIZE = 14;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 16;

export default function FontSizeControl() {
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);

  useEffect(() => {
    // Load saved font size from localStorage
    const savedSize = localStorage.getItem(FONT_SIZE_KEY);
    if (savedSize) {
      const size = parseInt(savedSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}px`;
    }
  }, []);

  const increaseFontSize = () => {
    if (fontSize < MAX_SIZE) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      localStorage.setItem(FONT_SIZE_KEY, newSize.toString());
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > MIN_SIZE) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      localStorage.setItem(FONT_SIZE_KEY, newSize.toString());
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={decreaseFontSize}
        disabled={fontSize <= MIN_SIZE}
        className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="تصغير الخط"
        title="تصغير الخط"
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
        disabled={fontSize >= MAX_SIZE}
        className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="تكبير الخط"
        title="تكبير الخط"
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
