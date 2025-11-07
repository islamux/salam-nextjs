# PWA Enhancements - Install Prompt & Offline Data Download

## Overview

This document describes the enhanced PWA (Progressive Web App) features added to the Khwater application, including install prompts and offline data download functionality.

## New Features

### 1. Install Prompt (`PWAInstallPrompt.tsx`)

**Location:** `src/components/shared/PWAInstallPrompt.tsx`

**Features:**
- Bilingual prompt (English & Arabic)
- Automatic detection of PWA installability
- 5-second delay before showing prompt
- Respects user dismissal (stores in localStorage)
- Prevents re-prompting after dismissal
- Detects if app is already installed (standalone mode)

**Trigger Conditions:**
- When `beforeinstallprompt` event fires
- After 5 seconds on page load
- When user comes back online (if not installed)

**UI Messages:**
- English: "Install this app for a better experience and offline reading"
- Arabic: "ثبّت هذا التطبيق للحصول على تجربة أفضل والقراءة دون اتصال"

### 2. Offline Data Download

**Feature:** Download all 29 chapters for offline reading

**How it works:**
1. User clicks "Download / تحميل" button
2. Service Worker fetches `/khwater-data.json`
3. Progress bar shows download status
4. All data cached for offline access
5. Success message displayed

**What gets cached:**
- Main data file (`/khwater-data.json`)
- All 29 chapter pages (`/khwater/1` through `/khwater/29`)
- Static assets (manifest, offline page)

### 3. Download Status Indicator

**Location:** Header component (`src/components/shared/Header.tsx`)

**Displays:**
- Green badge with checkmark icon
- Arabic text: "متوفر دون اتصال" (Available Offline)
- Only shows when data is successfully downloaded
- Hidden on small screens (mobile)

### 4. Enhanced Service Worker (`public/sw.js`)

**New Functionality:**
- `downloadData()` - Downloads and caches data with progress tracking
- Message passing for download progress
- Progress updates via `postMessage`
- Caches individual chapter pages

**Message Types:**
- `DOWNLOAD_DATA` - Request to download data
- `DOWNLOAD_PROGRESS` - Progress update (0-100%)
- `DOWNLOAD_COMPLETE` - Download finished
- `DOWNLOAD_ERROR` - Error occurred

## User Flow

### First Visit (Not Installed)
1. User visits the app
2. After 5 seconds, install prompt appears
3. User can:
   - Click "Install" to install PWA
   - Click "Not Now" to dismiss
4. If dismissed, won't show again for 24 hours

### Download Data for Offline
1. When user is online and hasn't installed
2. Download prompt appears automatically
3. User can download all data for offline reading
4. Progress bar shows download status
5. Success indicator appears in header

### After Installation or Download
1. App icon appears on home screen (if installed)
2. "Available Offline" badge in header (if downloaded)
3. Full offline functionality available
4. Can read all chapters without internet

## Technical Implementation

### Component: PWAInstallPrompt

```typescript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}
```

**Key Methods:**
- `handleInstallClick()` - Triggers native install prompt
- `handleDownloadData()` - Downloads and caches data
- `handleDismissInstall()` - Dismisses with localStorage tracking

### Service Worker: downloadData()

```typescript
async function downloadData(url, client) {
  // 1. Fetch data with progress tracking
  // 2. Stream data in chunks
  // 3. Update progress via postMessage
  // 4. Cache main data file
  // 5. Cache individual chapter pages
  // 6. Send completion message
}
```

**Progress Tracking:**
- Calculates percentage from content-length header
- Updates every 50ms for smooth animation
- Shows in modal with progress bar

## Storage & Persistence

### localStorage Keys:
- `khwater-data-downloaded` - "true" when data is downloaded
- `install-prompt-dismissed` - Timestamp when user dismissed install
- `download-prompt-dismissed` - Timestamp when user dismissed download

### Cache Strategy:
- Cache Name: `elm-app-v1.0.0`
- Caches `/khwater-data.json` and all chapter pages
- Updates in background when online

## Browser Support

**Install Prompt:**
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited (iOS Safari shows Add to Home Screen)

**Offline Data Download:**
- All modern browsers with Service Worker support
- Requires HTTPS or localhost

## Testing

### Test Install Prompt:
1. Open app in Chrome/Edge
2. Wait 5 seconds for prompt
3. Click "Install" to test installation
4. Or click "Not Now" to test dismissal

### Test Offline Download:
1. Open app
2. When download prompt appears, click "Download"
3. Watch progress bar
4. Check header for "Available Offline" badge
5. Turn off internet, navigate to chapters
6. Verify content loads offline

### Test Service Worker:
1. Open DevTools → Application → Service Workers
2. Verify worker is registered
3. Check Cache Storage for cached data
4. Monitor console for download progress

## Code Changes

### Files Modified:
1. `src/components/shared/PWAInstallPrompt.tsx` - **NEW**
2. `src/components/shared/Header.tsx` - Added download indicator
3. `src/app/layout.tsx` - Added PWAInstallPrompt component
4. `public/sw.js` - Added download functionality

### Dependencies:
- No new dependencies added
- Uses native browser APIs: Service Worker, beforeinstallprompt, Cache API

## Best Practices

### User Experience:
- Prompts appear after user engagement (5 seconds)
- Respects user choices (dismissal)
- Clear progress indication
- Bilingual support (English/Arabic)
- Visual feedback (badges, checkmarks)

### Performance:
- Lazy loading of prompts
- Efficient progress tracking
- Background caching
- Minimal localStorage usage

### Accessibility:
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast support
- Focus management

## Security

- Service Worker scope: `/` (root)
- No sensitive data stored
- HTTPS required for PWA features
- Origin-scoped caching

## Future Enhancements

Potential improvements:
1. Add "Clear Downloaded Data" option
2. Show size of downloaded data
3. Auto-update downloaded data
4. Selective chapter download
5. Background sync for updates
6. Push notifications for new content

## Deployment Notes

- Service Worker automatically updates on new deployment
- Users will get update notification
- Downloaded data persists across updates
- Clear cache if major data structure changes

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Service Worker registration
3. Test on HTTPS only (not HTTP)
4. Clear browser cache if issues persist

---

**Last Updated:** 2025-11-07
**Version:** 1.0.0
