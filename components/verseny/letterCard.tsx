export default function LetterCard({
  letter,
  used,
}: {
  letter: string;
  used: boolean;
}) {
  return (
    <div className="flex w-12 h-12 items-center justify-center text-xl font-mono font-bold bg-neutral-100 border-neutral-300 rounded-xl border border-border shadow capitalize text-neutral-700">
      {letter}
    </div>
  );
}
