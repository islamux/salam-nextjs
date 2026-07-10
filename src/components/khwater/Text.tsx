interface TextProps {
  text: string;
  index?: number;
}

export default function Text({ text, index = 0 }: TextProps) {
  return (
    <p
      key={`text-${index}`}
      className="arabic-text text-right leading-loose mb-4 text-gray-800 dark:text-gray-200"
    >
      {text}
    </p>
  );
}
