export default function WordCard({ word }: { word: string }) {
  return (
    <div className="flex px-12 py-3 text-3xl font-mono font-bold bg-neutral-100 border-neutral-300 rounded-xl border border-border shadow capitalize text-neutral-700">
      {word}
    </div>
  );
}
