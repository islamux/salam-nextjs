// Internationalization utilities for Arabic text

/**
 * Check if text is Arabic
 */
export const isArabic = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

/**
 * Normalize Arabic text
 */
export const normalizeArabic = (text: string): string => {
  return text
    .replace(/ي/g, 'ی') // Persian yeh instead of Arabic yeh
    .replace(/ك/g, 'ک') // Persian kaf instead of Arabic kaf
    .trim();
};

/**
 * Get text direction (RTL for Arabic, LTR for others)
 */
export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
  return isArabic(text) ? 'rtl' : 'ltr';
};

/**
 * Format Arabic numbers (optional)
 */
export const formatArabicNumbers = (text: string): string => {
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let result = text;
  for (let i = 0; i < englishNumbers.length; i++) {
    result = result.replace(
      new RegExp(englishNumbers[i], 'g'),
      arabicNumbers[i]
    );
  }
  return result;
};

/**
 * Language configuration
 */
export const LANGUAGE_CONFIG = {
  arabic: {
    dir: 'rtl',
    fontFamily: 'Noto Sans Arabic, Amiri, serif',
    textAlign: 'right' as const,
  },
  default: {
    dir: 'ltr',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'left' as const,
  },
};
