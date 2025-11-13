// Subtitle component for rendering chapter/item subtitles

interface SubtitleProps {
  subtitle: string;
  index?: number;
}

export default function Subtitle({ subtitle, index = 0 }: SubtitleProps) {
  return (
    <h2
      key={`subtitle-${index}`}
      className="text-right mb-4 text-xl font-semibold"
    >
      {subtitle}
    </h2>
  );
}
