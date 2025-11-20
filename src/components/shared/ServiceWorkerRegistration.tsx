"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the browser's install prompt from showing
        e.preventDefault();
        console.log("Install prompt prevented (PWA features still active)");
      });

      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

          console.log("Service Worker registered successfully:", registration.scope);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;

            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("New service worker available, will use on next reload");
                }
              });
            }
          });

          // Force update service worker if a new one is waiting
          if (registration.waiting) {
            console.log("New service worker is waiting, activating...");
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("📨 Message from service worker:", event.data);
          });

          // Check cache status after registration
          setTimeout(async () => {
            try {
              const cache = await caches.open("khwater-v3-offline");
              const keys = await cache.keys();
              console.log("🔍 Cache Status:", {
                name: "khwater-v3-offline",
                totalItems: keys.length,
                urls: keys.map(k => k.url)
              });
            } catch (error) {
              console.error("Failed to check cache:", error);
            }
          }, 3000);

        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      });
    }
  }, []);

  return null;
}
