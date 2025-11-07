// Service Worker for Khwater App - Fixed Caching
const CACHE_NAME = "khwater-v3-offline";
const OFFLINE_URL = "/offline";

// Cache version to force updates
const CACHE_VERSION = "v3";

// Files to pre-cache
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",
];

// Chapters to cache
const CHAPTER_PAGES = Array.from({ length: 29 }, (_, i) => `/khwater/${i + 1}`);

self.addEventListener("install", (event) => {
  console.log("📦 Service Worker: Installing", CACHE_VERSION);

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log("🗂️  Service Worker: Cache opened");

        // Cache root and offline page
        console.log("📄 Caching essential pages...");
        await cache.addAll(PRECACHE_URLS);
        console.log("✅ Essential pages cached");

        // Cache each chapter page individually
        console.log(`📚 Caching ${CHAPTER_PAGES.length} chapter pages...`);
        let cachedCount = 0;
        for (let i = 0; i < CHAPTER_PAGES.length; i++) {
          const url = CHAPTER_PAGES[i];
          try {
            console.log(`  Caching chapter ${i + 1}/29: ${url}`);
            const response = await fetch(url, {
              cache: "no-store",
              credentials: "same-origin",
            });
            if (response && response.ok) {
              await cache.put(url, response.clone());
              cachedCount++;
              console.log(`  ✅ Cached ${url} (${cachedCount}/29)`);
            } else {
              console.warn(`  ⚠️  Failed to cache ${url}: ${response?.status || 'no response'}`);
            }
          } catch (error) {
            console.error(`  ❌ Error caching ${url}:`, error.message);
          }
        }
        console.log(`📊 Cached ${cachedCount} out of ${CHAPTER_PAGES.length} chapters`);

        // Also cache with trailing slash versions
        for (let i = 0; i < CHAPTER_PAGES.length; i++) {
          const url = CHAPTER_PAGES[i] + "/";
          try {
            const response = await fetch(url, {
              cache: "no-store",
              credentials: "same-origin",
            });
            if (response && response.ok) {
              await cache.put(url, response.clone());
              console.log(`  ✅ Also cached ${url}`);
            }
          } catch (error) {
            // Ignore errors for trailing slash
          }
        }

        // Cache data file
        console.log("💾 Caching data file...");
        try {
          const dataResponse = await fetch("/khwater-data.json", { cache: "no-store" });
          if (dataResponse.ok) {
            await cache.put("/khwater-data.json", dataResponse.clone());
            console.log("✅ Data file cached");
          }
        } catch (error) {
          console.warn("⚠️  Data file cache failed:", error.message);
        }

        console.log("🎉 Service Worker: Install complete!");
      } catch (error) {
        console.error("💥 Service Worker: Install failed:", error);
      }
    })()
  );

  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activating", CACHE_VERSION);

  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        console.log("🧹 Service Worker: Found", cacheNames.length, "existing caches");

        await Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("🗑️  Service Worker: Deleting", cacheName);
              return caches.delete(cacheName);
            }
          })
        );

        // Take control immediately
        await self.clients.claim();
        console.log("✅ Service Worker: Activated and controlling all clients");

        // Notify all clients that SW is ready
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: "SW_ACTIVATED",
            version: CACHE_VERSION,
          });
        });
      } catch (error) {
        console.error("💥 Service Worker: Activation failed:", error);
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          console.log("🌐 SW: Network request for", url.pathname);
          const networkResponse = await fetch(request);

          if (networkResponse && networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
            console.log("💾 SW: Cached", url.pathname);
            return networkResponse;
          }

          throw new Error("Network response not ok");
        } catch (error) {
          console.log("⚠️  SW: Network failed for", url.pathname, "- trying cache");

          // Network failed, try cache
          const cache = await caches.open(CACHE_NAME);
          let cachedResponse = await cache.match(request);

          if (cachedResponse) {
            console.log("✅ SW: Serving from cache:", url.pathname);
            return cachedResponse;
          }

          // Try root page
          if (url.pathname !== "/" && url.pathname !== "/home") {
            console.log("🔄 SW: Trying root page for:", url.pathname);
            cachedResponse = await cache.match("/");
            if (cachedResponse) {
              console.log("✅ SW: Serving root page for:", url.pathname);
              return cachedResponse;
            }
          }

          // Last resort: serve offline page
          console.log("🚨 SW: Serving offline page for:", url.pathname);
          cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse || new Response("Offline - Service Worker not active", {
            status: 503,
            headers: { "Content-Type": "text/html" },
          });
        }
      })()
    );
    return;
  }

  // Handle API/data requests
  if (url.pathname === "/khwater-data.json" || CHAPTER_PAGES.some(page => url.pathname === page) || url.pathname.startsWith("/khwater/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          // Update in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.ok) {
                cache.put(request, networkResponse.clone());
                console.log("🔄 SW: Updated cache:", url.pathname);
              }
            })
            .catch(() => {
              // Failed to update, use cached
            });

          console.log("✅ SW: Serving cached data:", url.pathname);
          return cachedResponse;
        }

        // Not cached, try network
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
            console.log("💾 SW: Cached new data:", url.pathname);
          }
          return networkResponse;
        } catch (error) {
          console.error("❌ SW: Failed to fetch:", url.pathname, error.message);
          return new Response(JSON.stringify({ error: "Offline - content not available" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }
      })()
    );
    return;
  }

  // Handle other requests (assets)
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error("❌ SW: Failed asset fetch:", url.pathname);
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});

self.addEventListener("message", (event) => {
  console.log("📨 SW: Received message:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_VERSION, name: CACHE_NAME });
  }

  if (event.data && event.data.type === "GET_CACHE_STATUS") {
    checkCacheStatus(event.ports[0]);
  }
});

async function checkCacheStatus(port) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const urls = keys.map((req) => req.url);

    port.postMessage({
      type: "CACHE_STATUS",
      name: CACHE_NAME,
      version: CACHE_VERSION,
      count: urls.length,
      urls: urls,
    });
  } catch (error) {
    port.postMessage({
      type: "CACHE_ERROR",
      error: error.message,
    });
  }
}

self.addEventListener("error", (event) => {
  console.error("💥 SW Error:", event.error);
});

self.addEventListener("unhandledrejection", (event) => {
  console.error("💥 SW Unhandled Rejection:", event.reason);
});
