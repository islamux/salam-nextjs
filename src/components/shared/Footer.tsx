import { useTranslation } from '@/hooks/useTranslation';
import GithubIcon from './GithubIcon';
import MailIcons from './MailIcon';
import Link from 'next/link';

export default function Footer() {
  const { footer } = useTranslation();

  return (
    <footer className="relative border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 pt-12 pb-8 mt-16">
      {/* Geometric divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4" aria-hidden="true">
        <span className="h-px w-12 bg-gray-200 dark:bg-gray-700" />
        <span className="text-amber-300 dark:text-amber-600 text-sm">✦</span>
        <span className="h-px w-12 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Book info */}
          <div className="text-center sm:text-right">
            <h3 className="font-arabic text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {footer.bookName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {footer.tagline}
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="text-center">
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/home" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                الرئيسية
              </Link>
              <Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                بحث
              </Link>
            </div>
          </div>

          {/* Column 3: Connect */}
          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start items-center gap-4">
              <a href="https://github.com/islamux/salam-nextjs" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" aria-label="GitHub">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="mailto:fathi733@gmail.com" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" aria-label="Email">
                <MailIcons className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span>{footer.copyright} — {footer.rightsReserved}</span>
          <span>{footer.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
