// Custom hook for managing theme state and persistence

'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
const THEME_KEY = 'elm-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Update the document theme
  const updateTheme = (newTheme: Theme) => {
    if (typeof document === 'undefined') return;

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load theme from localStorage or system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
      let initialTheme: Theme;

      if (savedTheme) {
        initialTheme = savedTheme;
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? 'dark' : 'light';
      }

      setTheme(initialTheme);
      updateTheme(initialTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to light theme
      setTheme('light');
      updateTheme('light');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateTheme(newTheme);

    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Set specific theme
  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    updateTheme(newTheme);

    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Listen for system theme changes (if user hasn't set a preference)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a manual preference
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (!savedTheme) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
        updateTheme(systemTheme);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return {
    theme,
    isLoading,
    toggleTheme,
    setTheme: setThemeValue,
  };
}
