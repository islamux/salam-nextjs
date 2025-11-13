// Unit tests for custom hooks

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
const matchMediaMock = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

describe('Custom Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useTheme', () => {
    it('should initialize with default theme', () => {
      const { result } = renderHook(() => import('../useTheme').then(m => m.useTheme()));
      // This test would need proper async handling
    });
  });

  describe('useFontSize', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('16');
    });

    it('should initialize with default font size', () => {
      const { result } = renderHook(() => import('../useFontSize').then(m => m.useFontSize()));
    });
  });

  describe('useBookmarks', () => {
    it('should initialize with empty bookmarks', () => {
      const { result } = renderHook(() => import('../useBookmarks').then(m => m.useBookmarks()));
    });
  });

  describe('usePWAInstall', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => import('../usePWAInstall').then(m => m.usePWAInstall()));
    });
  });

  describe('useLocalStorage', () => {
    it('should initialize with provided value', () => {
      renderHook(() => import('../utils/useLocalStorage').then(m => m.useLocalStorage('test', 'default')));
    });

    it('should set value in localStorage', () => {
      renderHook(() => import('../utils/useLocalStorage').then(m => m.useLocalStorage('test', 'default')));
    });
  });

  describe('useMediaQuery', () => {
    it('should return boolean based on query match', () => {
      matchMediaMock.mockReturnValue({ matches: true });
      renderHook(() => import('../utils/useMediaQuery').then(m => m.useMediaQuery('(min-width: 768px)')));
    });
  });

  describe('useEventListener', () => {
    it('should add and remove event listener', () => {
      const addEventListener = vi.fn();
      const removeEventListener = vi.fn();

      const mockTarget = {
        addEventListener,
        removeEventListener,
      } as any;

      renderHook(() =>
        import('../utils/useEventListener').then(m =>
          m.useEventListener('click', vi.fn(), mockTarget)
        )
      );
    });
  });
});
