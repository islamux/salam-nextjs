// Footer component

import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { footer } = useTranslation();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8 mt-16">
    <div className="container mx-auto px-4">
    <div className="text-center">
    <h3 className="arabic-title text-xl font-semibold mb-4">
    {footer.bookName}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
    {footer.tagline}
    </p>
    <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse text-sm text-gray-500 dark:text-gray-500">
    <span>{footer.copyright}</span>
    <span>•</span>
    <span>{footer.rightsReserved}</span>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
    <p className="text-xs text-gray-400 dark:text-gray-500">
    {footer.builtWith}
    </p>
    </div>
    </div>
    </div>
    </footer>
  );
}
