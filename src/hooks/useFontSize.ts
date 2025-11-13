import { useState, useEffect } from 'react';

const FONT_SIZE_KEY = 'elm-font-size';
const MIN_SIZE = 14;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 16;

export interface UseFontSizeReturn {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

export function useFontSize(): UseFontSizeReturn {
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

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    canIncrease: fontSize < MAX_SIZE,
    canDecrease: fontSize > MIN_SIZE,
  };
}
