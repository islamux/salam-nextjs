interface SubtitleProps {
  subtitle: string;
  index?: number;
}

export default function Subtitle({ subtitle, index = 0 }: SubtitleProps) {
  return (
    <h2
      key={`subtitle-${index}`}
      className="text-right mb-3 text-xl font-semibold text-gray-700 dark:text-gray-300"
    >
      {subtitle}
    </h2>
  );
}
