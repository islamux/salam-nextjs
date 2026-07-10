import { translations } from "@/lib/translations";
import Link from "next/link";
interface HeroSectionProps {
  chaptersCount: number;
}

export function HeroSection({ chaptersCount }: HeroSectionProps) {

  return (
    <section className="relative text-center mb-20 pt-12 pb-16 overflow-hidden">
      {/* Decorative number */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[16rem] font-amiri font-bold text-amber-600/[0.03] dark:text-amber-400/[0.02] select-none leading-none pointer-events-none" aria-hidden="true">
        {chaptersCount}
      </span>

      <div className="relative">
        <div className="mb-6">
          <span className="inline-block text-5xl sm:text-7xl font-amiri font-bold text-gray-900 dark:text-gray-50 leading-tight tracking-wide">
            {translations.home.bookName}
          </span>
        </div>

        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
          {translations.home.subtitle}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            {translations.home.introductionCount(chaptersCount)}
          </span>
        </div>

        <div className="flex justify-center">
          <Link
            href="/search"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-all duration-200 shadow-lg shadow-amber-600/10 hover:shadow-amber-600/20 hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="font-medium">{translations.home.searchInContent}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
