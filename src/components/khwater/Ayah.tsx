// Ayah component for rendering Quranic verses

interface AyahProps {
  ayah: string;
  index?: number;
}

export default function Ayah({ ayah, index = 0 }: AyahProps) {
  return (
    <p
      key={`ayah-${index}`}
      className="arabic-ayah text-right opacity-90 mb-2 leading-loose"
    >
      {ayah}
    </p>
  );
}
