// Footer component

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8 mt-16">
    <div className="container mx-auto px-4">
    <div className="text-center">
    <h3 className="arabic-title text-xl font-semibold mb-4">
    كتاب خواطر
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
    عن الدين والحياة
    </p>
    <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse text-sm text-gray-500 dark:text-gray-500">
    <span>© 2025 كتاب خواطر</span>
    <span>•</span>
    <span>جميع الحقوق محفوظة لكل مسلم</span>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
    <p className="text-xs text-gray-400 dark:text-gray-500">
    تم التطوير باستخدام Next.js و TypeScript
    </p>
    </div>
    </div>
    </div>
    </footer>
  );
}
