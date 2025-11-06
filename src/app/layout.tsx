import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ServiceWorkerRegistration from "@/components/shared/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "خواطر - Islamic Spiritual Texts",
  description: "Islamic spiritual texts and chapters",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "خواطر",
  },
  applicationName: "خواطر",
  authors: [{ name: "Khwater Project" }],
  keywords: ["Islamic", "spiritual", "texts", "Arabic", "Khwater"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://elm-app.vercel.app",
    title: "خواطر - Islamic Spiritual Texts",
    description: "Islamic spiritual texts and chapters",
    siteName: "خواطر",
  },
  twitter: {
    card: "summary_large_image",
    title: "خواطر - Islamic Spiritual Texts",
    description: "Islamic spiritual texts and chapters",
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="خواطر" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className="antialiased font-arabic min-h-screen flex flex-col bg-white dark:bg-gray-950"
      >
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          انتقل إلى المحتوى الرئيسي
        </a>

        <ServiceWorkerRegistration />
        <Header />
        <main id="main-content" className="flex-grow" role="main" aria-label="المحتوى الرئيسي">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
