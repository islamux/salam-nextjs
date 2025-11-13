// Footer component for rendering item footers

interface FooterProps {
  footer: string;
  index?: number;
}

export default function Footer({ footer, index = 0 }: FooterProps) {
  return (
    <footer
      key={`footer-${index}`}
      className="text-right mt-8 pt-4 border-t border-gray-300 text-sm"
    >
      {footer}
    </footer>
  );
}
