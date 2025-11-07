// Header component with navigation and controls

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import FontSizeControl from './FontSizeControl';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for beforeinstallprompt to enable manual install
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install: Use your browser menu (⋮) and select "Add to Home screen" or "Install App"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted install');
    }

    setDeferredPrompt(null);
  };

  const checkCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        console.log('Available caches:', cacheNames);

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          console.log(`Cache "${cacheName}" has ${keys.length} items:`, keys.map(k => k.url));
        }
      } catch (error) {
        console.error('Cache check failed:', error);
      }
    } else {
      console.log('Cache API not supported');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
    {/* Logo */}
    <Link href="/home" className="flex items-center space-x-2 rtl:space-x-reverse">
    <span className="text-2xl font-bold arabic-title">خواطر</span>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center">
    <Link
    href="/home"
    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 mx-40 rtl:mx-40"
  >
    الرئيسية
    </Link>
    <Link
    href="/search"
    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4"
  >
    بحث
    </Link>
    </nav>

    {/* Controls */}
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      {/* Install Button */}
      <button
        onClick={handleInstallClick}
        className="hidden md:flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        title="Install App"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <span>تثبيت</span>
      </button>

      {/* Cache Test Button - Dev only */}
      <button
        onClick={checkCache}
        className="hidden md:flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        title="Check Cache"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </button>

      <FontSizeControl />
      <ThemeToggle />

    {/* Mobile menu button */}
    <button
    className="md:hidden p-2"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    aria-label="Toggle menu"
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
      الرئيسية
      </Link>
      <Link
      href="/search"
      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      بحث
      </Link>
      <button
        onClick={() => {
          handleInstallClick();
          setIsMenuOpen(false);
        }}
        className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <span>تثبيت التطبيق</span>
      </button>
      </nav>
      </div>
    )}
    </header>
  );
}
