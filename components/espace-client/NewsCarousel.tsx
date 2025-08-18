import Image from "next/image";

interface NewsItem {
  image: string;
  date: string;
  title: string;
  description: string;
}

interface NewsCarouselProps {
  news: NewsItem[];
}

export default function NewsCarousel({ news }: NewsCarouselProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="font-bold text-blue-900 mb-4">Actualités</div>
      <div className="flex gap-4 overflow-x-auto">
        {news.map((item, idx) => (
          <div key={idx} className="min-w-[220px] max-w-xs bg-gray-50 rounded-lg p-2 flex-shrink-0">
            <Image src={item.image} alt={item.title} width={220} height={100} className="w-full h-28 object-cover rounded" />
            <div className="text-xs text-gray-500 mt-2">{item.date}</div>
            <div className="font-semibold text-blue-900 mt-1">{item.title}</div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button className="text-blue-700 text-xs font-semibold">{'>'}</button>
      </div>
    </div>
  );
} 