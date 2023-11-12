export default function LetterCard({
  letter,
  used,
}: {
  letter: string;
  used: boolean;
}) {
  return (
    <div className="flex w-11 h-11 font-mono items-center justify-center rounded-lg bg-gray-200 text-lg font-bold text-gray-700">
      {letter}
    </div>
  );
}
