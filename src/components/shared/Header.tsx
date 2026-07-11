'use client';

import Link from 'next/link';
import { useState } from 'react';
import FontSizeControl from './FontSizeControl';
import ThemeToggle from './ThemeToggle';
import InstallButton from './InstallButton';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { nav, app } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-2xl font-bold font-arabic text-gray-900 dark:text-gray-100">{app.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/home"
            className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors px-4 py-2 rounded-lg text-sm"
          >
            {nav.home}
          </Link>
          <Link
            href="/search"
            className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors px-4 py-2 rounded-lg text-sm"
          >
            {nav.search}
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <FontSizeControl />
          <ThemeToggle />
          <InstallButton />

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={nav.menuToggle}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-200 ease-out-quart"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="/home"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-3 py-2.5 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {nav.home}
            </Link>
            <Link
              href="/search"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-3 py-2.5 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {nav.search}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
