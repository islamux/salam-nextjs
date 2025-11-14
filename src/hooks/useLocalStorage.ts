// Custom hook for localStorage following DRY principle
// Eliminates localStorage duplication across the app

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: SetValue<T>) => void;
  removeValue: () => void;
  isLoading: boolean;
}

/**
 * Custom hook to manage localStorage with type safety
 *
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue, isLoading]
 *
 * @example
 * const [theme, setTheme, removeTheme, isLoading] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get value from localStorage
  const getValueFromStorage = useCallback((storageKey: string): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${storageKey}":`, error);
      return initialValue;
    }
  }, [initialValue]);

  // Function to set value in localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Function to remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Initialize value on mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const value = getValueFromStorage(key);
      setStoredValue(value);
    } finally {
      setIsLoading(false);
    }
  }, [key, getValueFromStorage]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
  };
}

export default useLocalStorage;
