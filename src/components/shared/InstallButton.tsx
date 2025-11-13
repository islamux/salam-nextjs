"use client";

import { useState, useEffect } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Listen for the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the automatic popup
      e.preventDefault();
      // Store the event
      setDeferredPrompt(e);
      // Show our custom button
      setShowButton(true);
      console.log("Install prompt captured for custom button");
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setShowButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the custom install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowButton(false);
  };

  // Don't render if no install prompt is available
  if (!showButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label="Install app"
    >
      <svg
        className="-ml-1 mr-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 011.894.448l-1.5 6A1 1 0 0115 12h-1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4H4a1 1 0 01-.894-1.447l1.5-6a1 1 0 011.894-.448l1.599.8L10 4.323V3a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      Install App
    </button>
  );
}
