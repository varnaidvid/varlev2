export default function WordCard({ word }: { word: string }) {
  return (
    <div className="font-mono border-dashed border-2 border-gray-400 bg-gray-50 p-4 rounded-lg flex items-center justify-center text-semibold text-lg capitalize font-bold text-gray-600">
      {word}
    </div>
  );
}
