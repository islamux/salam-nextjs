import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

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
  const { value: fontSize, setValue: setFontSize } = useLocalStorage<number>(FONT_SIZE_KEY, DEFAULT_SIZE);

  // Apply font size to document when it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const increaseFontSize = () => {
    if (fontSize < MAX_SIZE) {
      setFontSize(fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > MIN_SIZE) {
      setFontSize(fontSize - 1);
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
