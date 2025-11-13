// Text component for rendering main text content

interface TextProps {
  text: string;
  index?: number;
}

export default function Text({ text, index = 0 }: TextProps) {
  return (
    <p
      key={`text-${index}`}
      className="arabic-text text-right leading-loose mb-3"
    >
      {text}
    </p>
  );
}
