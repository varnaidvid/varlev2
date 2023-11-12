export default function WordCard({ word }: { word: string }) {
  return (
    <div className="font-mono bg-gray-200 p-4 rounded-lg flex items-center justify-center text-semibold text-base">
      {word}
    </div>
  );
}
