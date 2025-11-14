// Theme toggle component for Light/Dark mode

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import useLocalStorage from '@/hooks/useLocalStorage';

const THEME_KEY = 'elm-theme';

export default function ThemeToggle() {
  const { ui } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { value: theme, setValue: setTheme } = useLocalStorage<'light' | 'dark'>(THEME_KEY, 'light');

  // Read initial theme from DOM (set by script in layout.tsx)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    const initialTheme = isDark ? 'dark' : 'light';
    if (theme !== initialTheme) {
      setTheme(initialTheme);
    }
    setMounted(true);
  }, []); // Only run once on mount

  // Apply theme to DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md bg-gray-100 transition-colors"
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-md transition-colors
        ${theme === 'light'
          ? 'bg-gray-100 hover:bg-gray-200'
          : 'bg-gray-800 hover:bg-gray-700'
        }
      `}
      aria-label={ui.theme.ariaToggle(theme)}
      title={theme === 'light' ? ui.theme.toggle.toDark : ui.theme.toggle.toLight}
    >
      {theme === 'light' ? (
        // Moon icon
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}
