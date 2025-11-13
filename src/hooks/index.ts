// Barrel exports for all custom hooks

// Main hooks
export { useTheme } from './useTheme';
export type { Theme } from './useTheme';

export { useFontSize } from './useFontSize';

export { useBookmarks } from './useBookmarks';
export type { Bookmark } from './useBookmarks';

export { usePWAInstall } from './usePWAInstall';

// Utility hooks
export { useLocalStorage } from './utils/useLocalStorage';

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDark,
  usePrefersReducedMotion,
} from './utils/useMediaQuery';

export { useEventListener, useWindowEventListener, useDocumentEventListener, useCustomEventListener } from './utils/useEventListener';
