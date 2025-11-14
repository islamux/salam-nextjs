// Header component with navigation and controls

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-2xl font-bold arabic-title">{app.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <Link
            href="/home"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 mx-40 rtl:mx-40"
          >
            {nav.home}
          </Link>
          <Link
            href="/search"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4"
          >
            {nav.search}
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <FontSizeControl />
          <ThemeToggle />
          <InstallButton />

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={nav.menuToggle}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/home"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {nav.home}
            </Link>
            <Link
              href="/search"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
