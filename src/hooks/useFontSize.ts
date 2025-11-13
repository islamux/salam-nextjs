// Custom hook for managing font size state and persistence

'use client';

import { useState, useEffect, useCallback } from 'react';

const FONT_SIZE_KEY = 'elm-font-size';
const MIN_SIZE = 14;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 16;

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_SIZE);

  // Update document font size
  const updateDocumentFontSize = useCallback((size: number) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${size}px`;
    }
  }, []);

  // Load font size from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedSize = localStorage.getItem(FONT_SIZE_KEY);
      if (savedSize) {
        const size = parseInt(savedSize, 10);
        if (!isNaN(size) && size >= MIN_SIZE && size <= MAX_SIZE) {
          setFontSizeState(size);
          updateDocumentFontSize(size);
        }
      } else {
        // Set default size
        setFontSizeState(DEFAULT_SIZE);
        updateDocumentFontSize(DEFAULT_SIZE);
      }
    } catch (error) {
      console.error('Error loading font size:', error);
      setFontSizeState(DEFAULT_SIZE);
      updateDocumentFontSize(DEFAULT_SIZE);
    }
  }, [updateDocumentFontSize]);

  // Set font size with validation
  const setFontSize = useCallback((size: number) => {
    const clampedSize = Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
    setFontSizeState(clampedSize);
    updateDocumentFontSize(clampedSize);

    try {
      localStorage.setItem(FONT_SIZE_KEY, clampedSize.toString());
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  }, [updateDocumentFontSize]);

  // Increase font size
  const increaseFontSize = useCallback(() => {
    if (fontSize < MAX_SIZE) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
    }
  }, [fontSize, setFontSize]);

  // Decrease font size
  const decreaseFontSize = useCallback(() => {
    if (fontSize > MIN_SIZE) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
    }
  }, [fontSize, setFontSize]);

  // Reset to default
  const resetFontSize = useCallback(() => {
    setFontSize(DEFAULT_SIZE);
  }, [setFontSize]);

  return {
    fontSize,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    defaultSize: DEFAULT_SIZE,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    canIncrease: fontSize < MAX_SIZE,
    canDecrease: fontSize > MIN_SIZE,
  };
}
