import { translations } from "@/lib/translations";

interface SearchFormProps {
  query: string;
}

export function SearchForm({ query }: SearchFormProps) {

  const { search } = translations;

  return (
    <div
      className="mb-8">
      <form method="GET" action="/search" className="relative max-w-2xl mx-auto">
        <label htmlFor="search-input" className="sr-only">{search.label}</label>
        <input
          id="search-input"
          type="text"
          name="q"
          defaultValue={query}
          placeholder={search.placeholder}
          aria-label={search.ariaLabel}
          aria-describedby="search-help"
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div id="search-help" className="sr-only " >{search.help} </div>
        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21L15 15M17 10a7 7 0 11-14 0 7 7 0114 0z" />

          </svg>
        </button>
      </form>
    </div>
  );
}
