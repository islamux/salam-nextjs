"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone {
  standalone?: boolean;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isCaching, setIsCaching] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone = (window.navigator as NavigatorWithStandalone).standalone;
      if (isStandalone || isIOSStandalone) {
        setIsInstalled(true);
        console.log("✅ App is running in standalone mode");
      }
    };

    // Listen for service worker activation
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SW_ACTIVATED") {
        console.log("✅ Service Worker activated:", event.data.version);
        setIsCaching(false);
      }
    };

    checkInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("📱 Before install prompt event fired");
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);

      // Show install prompt after a delay if not already installed
      if (!isInstalled) {
        setTimeout(() => {
          console.log("📱 Showing install prompt");
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("✅ App installed");
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setIsCaching(true);
    };

    // Force show install prompt if the event already fired or on every page load
    if (!isInstalled) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    navigator.serviceWorker.addEventListener("message", handleSWMessage);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      navigator.serviceWorker.removeEventListener("message", handleSWMessage);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.warn("No deferred prompt available");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    } else {
      console.log("❌ User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  // Show caching banner if installing
  if (isCaching && isInstalled) {
    return createPortal(
      <div className="fixed top-16 left-0 right-0 z-50 p-4 bg-blue-600 text-white shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold">تثبيت التطبيق وحفظ البيانات...</p>
              <p className="text-sm opacity-90">Installing app and saving data for offline use</p>
              <p className="text-xs opacity-75 mt-1">Please wait, caching all 29 chapters...</p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Don't render if not needed
  if (!showInstallPrompt) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        {/* Install Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Install App
        </h2>
        <h3 className="text-xl font-bold text-center mb-4 text-blue-600 dark:text-blue-400 arabic-title">
          تثبيت التطبيق
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-2">
          Install this app for a better experience and offline reading
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6 arabic-text">
          ثبّت هذا التطبيق للحصول على تجربة أفضل والقراءة دون اتصال
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleInstallClick}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Install / تثبيت
          </button>
          <button
            onClick={handleDismissInstall}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Not Now / لاحقاً
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
