interface TitleProps {
  title: string;
  index?: number;
  id?: string;
}

export default function Title({ title, index = 0, id }: TitleProps) {
  return (
    <h1
      id={id}
      key={`title-${index}`}
      className="font-arabic text-right mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100"
    >
      {title}
    </h1>
  );
}
