import { translations } from "@/lib/translations";
import Link from "next/link";
interface HeroSectionProps {
  chaptersCount: number;
}

export function HeroSection({ chaptersCount }: HeroSectionProps) {

  return (
    <section className="text-center mb-16">
      <div className="mb-8">
        <h1 className="arabic-title text-5xl md:text-6xl font-bold mb-6">
          {translations.home.bookName}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {translations.home.subtitle}
        </p>
        <p className="text-gray-500 dark:text-gray-500">
          {translations.home.introductionCount(chaptersCount)}
        </p>
      </div>

      <div className="flex justify-center space-x-4 rtl: space-x-reverse">
        <Link
          href={"/search"}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 211-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {translations.home.searchInContent}
        </Link>
      </div>
    </section>
  );
}
