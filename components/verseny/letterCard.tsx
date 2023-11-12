export default function LetterCard({
  letter,
  used,
}: {
  letter: string;
  used: boolean;
}) {
  return (
    <div className="flex w-10 h-10 font-mono items-center justify-center rounded-lg bg-gray-200 font-medium">
      {letter}
    </div>
  );
}
