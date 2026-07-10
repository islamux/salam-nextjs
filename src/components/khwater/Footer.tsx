interface FooterProps {
  footer: string;
  index?: number;
}

export default function Footer({ footer, index = 0 }: FooterProps) {
  return (
    <footer
      key={`footer-${index}`}
      className="text-right mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400"
    >
      {footer}
    </footer>
  );
}
