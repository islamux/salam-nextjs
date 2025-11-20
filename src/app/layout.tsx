import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ServiceWorkerRegistration from "@/components/shared/ServiceWorkerRegistration";
import { translations } from "@/lib/translations";
// PWAInstallPrompt component removed to disable popup while keeping PWA features

export const metadata: Metadata = {
  title: translations.app.nameWithSubtitle,
  description: translations.app.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: translations.app.name,
  },
  applicationName: translations.app.name,
  authors: [{ name: translations.app.author }],
  keywords: ["Islamic", "spiritual", "texts", "Arabic", "Khwater"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://elm-app.vercel.app",
    title: translations.app.nameWithSubtitle,
    description: translations.app.description,
    siteName: translations.app.name,
  },
  twitter: {
    card: "summary_large_image",
    title: translations.app.nameWithSubtitle,
    description: translations.app.description,
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/*
*SHORTHAND OF Error: Intentional mismatch - The dark mode script must run before
  React hydrates

* **Hydration Error** occurs when the HTML rendered on the server (SSR) doesn't match what React expects on the client side during the hydration process. This is a common issue in Next.js applications that use Server-Side Rendering (SSR) or Static Site Generation (SSG).
  *
  * Fixing Error: 
  * A tree hydrated but some attributes of the server rendered HTML didn't match
<html lang="ar" dir="rtl" className="dark">  <-- Mismatch here
```

**Root Cause:**
Your `layout.tsx` has an inline script that runs before React hydrates and adds the `dark` class to the HTML element. React's initial render doesn't expect this class, causing a mismatch.

**✅ Solution - Add `suppressHydrationWarning`:**

  * */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={translations.app.name} />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Theme initialization - prevents FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const THEME_KEY = 'elm-theme';
                  const savedTheme = localStorage.getItem(THEME_KEY);
                  const isDark = savedTheme === 'dark' ||
                    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {
                  // Fallback to light theme
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased font-arabic min-h-screen flex flex-col bg-white dark:bg-gray-950"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {translations.nav.skipToContent}
        </a>

        <Header />
        <main id="main-content" className="flex-grow" role="main" aria-label={translations.nav.mainContent}>
          {children}
        </main>
        <Footer />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
