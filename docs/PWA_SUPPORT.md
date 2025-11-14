# Progressive Web App (PWA) Support Guide

## Table of Contents
1. [Overview](#overview)
2. [PWA Architecture](#pwa-architecture)
3. [Installation Guide](#installation-guide)
4. [Configuration](#configuration)
5. [Service Worker Implementation](#service-worker-implementation)
6. [Offline Functionality](#offline-functionality)
7. [Testing & Validation](#testing--validation)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)
11. [Monitoring & Analytics](#monitoring--analytics)

---

## Overview

The **خواطر** application is a fully-featured Progressive Web App (PWA) that provides an app-like experience across all devices. This guide covers the complete PWA implementation, configuration, and maintenance.

### Key Features
✅ **Installable** - Add to home screen on mobile and desktop
✅ **Offline Support** - Read content without internet connection
✅ **Fast Loading** - Cached resources for instant access
✅ **App-like Experience** - Standalone display mode
✅ **Background Sync** - Update content when online
✅ **App Shortcuts** - Quick access to key features
✅ **RTL Support** - Full Arabic language support
✅ **PWA Icons** - Multi-resolution icons for all devices

---

## PWA Architecture

### Component Structure
```
public/
├── manifest.json              # PWA manifest file
├── sw.js                      # Service worker
└── icons/                     # PWA icons (72x72 to 512x512)

src/components/shared/
├── ServiceWorkerRegistration.tsx  # SW registration component
└── InstallButton.tsx              # Custom install button (optional)

src/app/
├── offline/                   # Offline page
├── layout.tsx                 # Root layout with PWA meta tags
└── page.tsx                   # Home page
```

### Data Flow
```
┌─────────────────────────────────────┐
│         User Interaction            │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│      Service Worker (sw.js)         │
│  ┌──────────────────────────────┐   │
│  │  • Cache Management           │   │
│  │  • Offline Fallback          │   │
│  │  • Background Sync            │   │
│  │  • Update Detection           │   │
│  └──────────────────────────────┘   │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│        Cache Storage                │
│  • Pre-cached: All 29 chapters     │
│  • Runtime: API responses          │
│  • Static: Assets (CSS, JS, images)│
└─────────────────────────────────────┘
```

---

## Installation Guide

### Prerequisites
- HTTPS in production (required for service workers)
- Chrome/Edge 40+, Firefox 44+, Safari 11.1+
- Valid manifest.json
- Service worker registered and active

### Step-by-Step Installation

#### 1. Verify PWA Requirements
```bash
# Check if manifest exists
ls -la public/manifest.json

# Check if service worker exists
ls -la public/sw.js

# Check if registration component exists
ls -la src/components/shared/ServiceWorkerRegistration.tsx
```

#### 2. Test Manifest Validity
Visit in Chrome DevTools:
1. Open Application tab
2. Check Manifest section
3. Verify:
   - Name and short name present
   - Icons loaded (all sizes)
   - Start URL valid
   - Display mode set
   - Theme colors defined

#### 3. Test Service Worker
In Chrome DevTools Application tab:
1. Check Service Workers section
2. Verify status is "Activated"
3. Check Cache Storage for cached resources
4. Test offline mode by toggling network

#### 4. Install on Device

**Mobile (Android):**
1. Open app in Chrome
2. Tap menu (⋮)
3. Select "Add to Home screen"
4. Confirm installation
5. Launch from home screen

**Mobile (iOS):**
1. Open app in Safari
2. Tap Share button (□↑)
3. Select "Add to Home Screen"
4. Customize name if needed
5. Tap "Add"

**Desktop (Chrome/Edge):**
1. Look for install icon in address bar
2. Click "Install خواطر"
3. Or use menu → "Install خواطر..."

---

## Configuration

### 1. Web App Manifest (`public/manifest.json`)

#### Essential Properties
```json
{
  "name": "خواطر - عن الدين والحياة",           // Full app name
  "short_name": "خواطر",                         // Display name on home screen
  "description": "Islamic spiritual texts...",   // App description
  "start_url": "/",                              // Launch URL
  "display": "standalone",                       // App mode (standalone, fullscreen, etc.)
  "background_color": "#ffffff",                 // Background color
  "theme_color": "#2563eb",                      // Browser UI color
  "orientation": "portrait-primary",             // Screen orientation
  "scope": "/",                                  // App scope
  "lang": "ar",                                  // Primary language
  "dir": "rtl"                                   // Text direction
}
```

#### Icons Configuration
```json
{
  "src": "/icons/icon-192x192.png",
  "sizes": "192x192",
  "type": "image/png",
  "purpose": "any maskable"  // "any", "maskable", or both
}
```

**Required Icon Sizes:**
- 72×72 (Android)
- 96×96 (Android)
- 128×128 (Android)
- 144×144 (Android)
- 152×152 (iOS)
- 192×192 (Android)
- 384×384 (Android)
- 512×512 (Android)

**Icon Guidelines:**
- PNG format with transparent background
- Square aspect ratio
- High contrast design
- Readable at small sizes
- Maskable icons support different shapes

#### App Shortcuts
```json
{
  "shortcuts": [
    {
      "name": "بحث",                              // Shortcut name
      "short_name": "بحث",                        // Display name
      "description": "Search content",            // Description
      "url": "/search",                           // Target URL
      "icons": [
        {
          "src": "/icons/search-icon.png",
          "sizes": "96x96"
        }
      ]
    }
  ]
}
```

#### Screenshots (Optional)
```json
{
  "screenshots": [
    {
      "src": "/screenshots/desktop-home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Home page showing all chapters"
    }
  ]
}
```

### 2. Service Worker (`public/sw.js`)

#### Cache Configuration
```javascript
const CACHE_NAME = "khwater-v3-offline";
const CACHE_VERSION = "v3";

// Update version to force cache refresh
```

**Cache Strategy:**
- **Pre-cache**: Essential pages (home, offline, manifest)
- **Network First**: HTML navigation requests
- **Cache First**: API responses and chapter pages
- **Stale While Revalidate**: Static assets

#### Cache Invalidation
```javascript
// Trigger cache update by changing CACHE_VERSION
const CACHE_VERSION = "v4";  // Increment to clear old cache
```

### 3. Service Worker Registration (`src/components/shared/ServiceWorkerRegistration.tsx`)

#### Disable Auto Install Prompt
```javascript
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();  // Prevents browser popup
  deferredPrompt = e;  // Store for manual trigger
});
```

#### Manual Install Trigger
```javascript
const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
  }
};
```

---

## Service Worker Implementation

### Installation Phase
```javascript
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Pre-cache essential resources
      await cache.addAll([
        "/",
        "/offline",
        "/manifest.json"
      ]);

      // Cache all 29 chapters
      for (let i = 1; i <= 29; i++) {
        const url = `/khwater/${i}`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.error(`Failed to cache ${url}:`, error);
        }
      }

      self.skipWaiting();  // Activate immediately
    })()
  );
});
```

### Activation Phase
```javascript
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );

      await self.clients.claim();  // Take control
    })()
  );
});
```

### Fetch Handler
```javascript
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
          return response;
        })
        .catch(() => {
          // Network failed, serve from cache
          return caches.match(request)
            .then(cached => cached || caches.match("/offline"));
        })
    );
  }
});
```

### Message Handler
```javascript
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      name: CACHE_NAME
    });
  }
});
```

---

## Offline Functionality

### Offline Page (`/offline`)

**Features:**
- Arabic UI with RTL layout
- List of available offline content
- Retry connection button
- Navigation to home page
- Clear messaging about offline state

**Implementation:**
```typescript
export default function OfflinePage() {
  return (
    <div className="offline-container" dir="rtl">
      <OfflineIcon />
      <h1>غير متصل بالإنترنت</h1>
      <p>يمكنك قراءة المحتوى المحفوظ</p>
      <RetryButton />
      <HomeButton />
    </div>
  );
}
```

### Cache Management

#### Cache Storage Limits
- Chrome/Edge: ~10% of disk space
- Firefox: ~10% of disk space
- Safari: ~50 MB (iOS), ~1 GB (macOS)

#### Cache Cleanup
```javascript
// Service worker automatically cleans up old caches
const cacheNames = await caches.keys();
await Promise.all(
  cacheNames.map(name => {
    if (name !== CACHE_NAME) {
      return caches.delete(name);
    }
  })
);
```

#### Manual Cache Clear
```javascript
// Clear all caches (user action)
const clearCache = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    );
    console.log('All caches cleared');
  }
};
```

---

## Testing & Validation

### 1. Lighthouse PWA Audit

**Run in Chrome DevTools:**
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Analyze page load"
5. Review scores (target: 90+)

**Checks:**
- ✅ Registers service worker
- ✅ Uses HTTPS
- ✅ Responds with 200 when offline
- ✅ Has start URL (<link rel="manifest">)
- ✅ Has icons at 192px and 512px
- ✅ Has background color
- ✅ Has theme color
- ✅ Has HTML lang attribute
- ✅ Has viewport meta tag
- ✅ Content is sized correctly

### 2. Manual Testing Checklist

#### Installation Test
- [ ] Install prompt appears on desktop
- [ ] "Add to Home Screen" works on mobile
- [ ] App launches in standalone mode
- [ ] Splash screen displays correctly
- [ ] App name appears correctly

#### Offline Test
- [ ] Load app with internet
- [ ] Navigate to multiple chapters
- [ ] Disconnect from internet
- [ ] Verify chapters still load
- [ ] Check offline page displays
- [ ] Reconnect and verify updates

#### Cache Test
```bash
# Check cache in DevTools
# Application tab → Storage → Cache
# Verify:
# - Cache name: khwater-v3-offline
# - All 29 chapters cached
# - Static assets cached
# - Data file cached
```

#### Service Worker Test
```javascript
// Test in DevTools Console
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW registration:', reg);
});

navigator.serviceWorker.controller && console.log('SW active');
```

### 3. Automated Testing

#### Unit Tests
```javascript
// test/sw.test.ts
describe('Service Worker', () => {
  test('caches chapter pages', async () => {
    const cache = await caches.open('khwater-v3-offline');
    const response = await cache.match('/khwater/1');
    expect(response).toBeTruthy();
  });

  test('serves offline page when network fails', async () => {
    const offlineResponse = await caches.match('/offline');
    expect(offlineResponse).toBeTruthy();
  });
});
```

---

## Best Practices

### 1. Performance
- ✅ Use Cache First for static content
- ✅ Use Network First for dynamic content
- ✅ Implement stale-while-revalidate for assets
- ✅ Pre-cache critical resources
- ✅ Cache API responses intelligently
- ✅ Limit cache size (avoid unbounded growth)

### 2. Security
- ✅ Always use HTTPS (required for service workers)
- ✅ Validate cache entries
- ✅ Sanitize user inputs
- ✅ Use Content Security Policy
- ✅ Keep service worker updated
- ✅ Handle errors gracefully

### 3. User Experience
- ✅ Provide clear offline messaging
- ✅ Show loading indicators
- ✅ Indicate sync status
- ✅ Offer retry mechanisms
- ✅ Maintain app state offline
- ✅ Sync changes when online

### 4. Maintenance
- ✅ Version caches properly
- ✅ Clean up old caches on activate
- ✅ Monitor cache usage
- ✅ Test across devices regularly
- ✅ Update icons and manifest
- ✅ Document changes

### 5. Accessibility
- ✅ Provide offline alternatives
- ✅ Ensure keyboard navigation
- ✅ Support screen readers
- ✅ High contrast support
- ✅ Focus management
- ✅ Skip to main content

---

## Troubleshooting

### Common Issues

#### 1. Service Worker Not Registering
**Symptoms:**
- Console error: "Service Worker registration failed"
- Cache Storage empty
- Offline mode doesn't work

**Solutions:**
```javascript
// Check browser support
if ('serviceWorker' in navigator) {
  console.log('Service Worker supported');
} else {
  console.error('Service Worker not supported');
}

// Check HTTPS requirement
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.error('HTTPS required for Service Worker');
}
```

#### 2. Install Prompt Not Showing
**Symptoms:**
- No install button/prompt in browser
- Cannot add to home screen

**Solutions:**
- Verify manifest.json is valid
- Check all required properties
- Ensure HTTPS is enabled
- Clear browser data and reload
- Check beforeinstallprompt event isn't prevented

```javascript
// Debug install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt event fired');
  deferredPrompt = e;
});

// Manual trigger
const triggerInstall = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
  }
};
```

#### 3. Cache Not Working
**Symptoms:**
- Content not available offline
- Network requests failing

**Solutions:**
- Check cache name matches
- Verify fetch events are handled
- Check cache storage permissions
- Clear cache and re-register

```javascript
// Debug cache
caches.keys().then(names => {
  console.log('Available caches:', names);
});

caches.open('khwater-v3-offline').then(cache => {
  cache.keys().then(requests => {
    console.log('Cached requests:', requests);
  });
});
```

#### 4. Icons Not Loading
**Symptoms:**
- No icon in install prompt
- Broken icon in home screen

**Solutions:**
- Verify icon files exist in `/public/icons/`
- Check icon sizes match manifest
- Ensure icons are PNG format
- Verify icon paths in manifest

```bash
# Check icon files
ls -la public/icons/
# Should show:
# - icon-72x72.png
# - icon-96x96.png
# - icon-192x192.png
# - icon-512x512.png
```

#### 5. Old Cache Not Clearing
**Symptoms:**
- App shows outdated content
- Multiple cache versions

**Solutions:**
```javascript
// Increment CACHE_VERSION
const CACHE_VERSION = "v4";

// In activate event, delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

---

## Deployment

### Vercel Deployment

**Environment Setup:**
```bash
# Build with PWA support
NEXT_DISABLE_TURBOPACK=1 pnpm build

# Deploy to Vercel
vercel --prod
```

**Build Configuration:**
- Framework Preset: Next.js
- Build Command: `NEXT_DISABLE_TURBOPACK=1 pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

**Environment Variables:**
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**HTTPS Requirement:**
- Vercel provides automatic HTTPS
- All domains support HTTPS
- Service workers require HTTPS

### CDN Configuration

**Cache Headers:**
```javascript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache'
          }
        ]
      }
    ]
  }
}
```

### App Store Submission

**Google Play Store:**
1. Use PWA Builder
2. Generate Android package
3. Submit to Play Console
4. No native code required

**Microsoft Store:**
1. Use PWA Builder
2. Generate Windows package
3. Submit to Partner Center

---

## Monitoring & Analytics

### PWA Metrics

**Track in Google Analytics:**
- PWA installs (beforeinstallprompt events)
- Offline usage (cache hits)
- App launches (standalone mode)
- Add to home screen conversions

```javascript
// Track PWA install
window.addEventListener('beforeinstallprompt', (e) => {
  gtag('event', 'pwa_install_prompt_shown', {
    'event_category': 'PWA',
    'event_label': 'Install Prompt'
  });
});

deferredPrompt.addEventListener('choice', (choice) => {
  gtag('event', 'pwa_install_' + choice.outcome, {
    'event_category': 'PWA',
    'event_label': 'Install Choice'
  });
});
```

### Performance Monitoring

**Monitor in DevTools:**
1. Application tab → Cache Storage
2. Check cache size and usage
3. Monitor service worker updates
4. Track offline usage

**Lighthouse CI:**
```json
// .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm install -g @lhci/cli@0.8.x
      - run: lhci autorun
```

### Error Tracking

**Service Worker Errors:**
```javascript
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
  // Send to error tracking service
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
  // Send to error tracking service
});
```

---

## Quick Reference

### Essential Commands
```bash
# Development server
NEXT_DISABLE_TURBOPACK=1 pnpm dev

# Production build
NEXT_DISABLE_TURBOPACK=1 pnpm build

# Run tests
pnpm test

# Build and preview
NEXT_DISABLE_TURBOPACK=1 pnpm build && pnpm start
```

### File Locations
```
public/manifest.json              # PWA manifest
public/sw.js                      # Service worker
src/components/shared/
  ServiceWorkerRegistration.tsx   # SW registration
src/app/
  offline/page.tsx                # Offline page
  layout.tsx                      # Root layout
```

### Cache Names
```
Production: khwater-v3-offline
Version: v3
```

### Browser Support
```
✅ Chrome 40+ (full PWA support)
✅ Firefox 44+ (full PWA support)
✅ Safari 11.1+ (limited PWA support)
✅ Edge 17+ (full PWA support)
✅ iOS Safari 11.1+ (install only)
✅ Android Chrome (full PWA support)
```

### Testing URLs
```
Lighthouse: chrome://inspect/#service-workers
PWA Builder: https://www.pwabuilder.com/
PWA Audit: https://www.web.dev/measure/
```

---

## Resources

### Documentation
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Guide](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

### Tools
- [PWA Builder](https://www.pwabuilder.com/) - PWA tool and scanner
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance and PWA auditing
- [Workbox](https://developer.chrome.com/docs/workbox) - Service worker libraries

### Testing
- [PWA Testing Guide](https://web.dev/how-to-test-pwas/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## Summary

This PWA implementation provides:
- ✅ Complete offline support for all 29 chapters
- ✅ Installable experience on all devices
- ✅ App-like interface with standalone display
- ✅ Background caching and sync
- ✅ Custom offline page
- ✅ App shortcuts for quick access
- ✅ Full Arabic RTL support
- ✅ Multi-resolution icons
- ✅ Service worker update management
- ✅ Cache versioning and cleanup

**Status:** ✅ Production Ready

**Version:** 3.0

**Last Updated:** November 2025

---

For issues or questions, please refer to the troubleshooting section or open an issue in the repository.
