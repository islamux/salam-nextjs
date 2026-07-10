interface AyahProps {
  ayah: string;
  index?: number;
}

export default function Ayah({ ayah, index = 0 }: AyahProps) {
  return (
    <p
      key={`ayah-${index}`}
      className="arabic-ayah text-right leading-loose mb-4 px-4 py-3 bg-amber-50/60 dark:bg-amber-900/10 rounded-lg text-gray-800 dark:text-gray-200"
    >
      {ayah}
    </p>
  );
}
