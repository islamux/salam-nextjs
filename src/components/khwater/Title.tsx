// Title component for rendering chapter/item titles

interface TitleProps {
  title: string;
  index?: number;
}

export default function Title({ title, index = 0 }: TitleProps) {
  return (
    <h1
      key={`title-${index}`}
      className="arabic-title text-right mb-6 text-2xl font-bold"
    >
      {title}
    </h1>
  );
}
