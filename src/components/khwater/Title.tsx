interface TitleProps {
  title: string;
  index?: number;
}

export default function Title({ title, index = 0 }: TitleProps) {
  return (
    <h1
      key={`title-${index}`}
      className="font-amiri text-right mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100"
    >
      {title}
    </h1>
  );
}
