// Service Worker for Elm App - Offline Reading Support
const CACHE_NAME = "elm-app-v1.0.0";
const OFFLINE_URL = "/offline";

// Files to cache for offline reading
const STATIC_CACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",
  "/elm-data.json",
];

// API routes to cache
const API_CACHE_PATTERNS = [/\/elm\//];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching static assets");
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        // If offline, return cached version or offline page
        return (
          caches.match(url.pathname) ||
          caches.match("/") ||
          caches.match(OFFLINE_URL)
        );
      })
    );
    return;
  }

  // Handle API/elm-data requests
  if (API_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          // Update cache in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }
            })
            .catch(() => {
              // Network failed, use cached version
            });

          return cachedResponse;
        }

        // Not in cache, fetch from network
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.error("Service Worker: Fetch failed", error);
          return new Response(
            JSON.stringify({ error: "Offline - content not cached" }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      })
    );
    return;
  }

  // Handle other requests (static assets)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        // Don't cache non-successful responses
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Cache successful responses for static assets
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Background sync for bookmark synchronization
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bookmarks") {
    event.waitUntil(syncBookmarks());
  }
});

async function syncBookmarks() {
  try {
    // Sync bookmarks when back online
    const bookmarks = localStorage.getItem("elm-bookmarks");
    if (bookmarks) {
      console.log("Service Worker: Bookmarks synced");
    }
  } catch (error) {
    console.error("Service Worker: Sync failed", error);
  }
}
