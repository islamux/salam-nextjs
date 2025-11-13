// Custom hook for managing PWA installation

'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone {
  standalone?: boolean;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as NavigatorWithStandalone).standalone;
      const installed = isStandalone || !!isIOSStandalone;
      setIsInstalled(installed);
      return installed;
    };

    const installed = checkInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('📱 Before install prompt event fired');
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);

      // Show install prompt after a delay if not already installed
      if (!installed) {
        setTimeout(() => {
          console.log('📱 Showing install prompt');
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('✅ App installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Force show install prompt if the event already fired or on every page load
    if (!installed) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Show the install prompt
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('No deferred prompt available');
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      return true;
    } else {
      console.log('❌ User dismissed the install prompt');
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      return false;
    }
  }, [deferredPrompt]);

  // Dismiss the install prompt
  const dismissInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false);
  }, []);

  // Check if install is available
  const canInstall = useCallback((): boolean => {
    return !!deferredPrompt;
  }, [deferredPrompt]);

  return {
    deferredPrompt,
    showInstallPrompt,
    isInstalled,
    promptInstall,
    dismissInstallPrompt,
    canInstall,
  };
}
