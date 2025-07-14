'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const news = [
  { image: '/assets/images/photo-1.png', date: 'sam 16 Sep 2023 - Hôtel TIAMA, Abidjan Plateau', title: 'La Cérémonie de Remise des Prix de la Fondation Bkjd', description: '', link: '#' },
  { image: '/assets/images/cad-1.png', date: 'mer 12 Avr 2023', title: 'Visite de Monsieur S', description: '', link: '#' },
];

export default function NewsCarouselPro() {
  const [index, setIndex] = useState(0);
  const max = news.length - 1;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 w-full h-[340px] md:h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="text-base md:text-xl font-bold text-[#181F2B] dark:text-white">Actualités</div>
        <div className="flex items-center gap-1 md:gap-2">
          <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded bg-[#F6F8FA] text-[#181F2B] disabled:opacity-50"><ChevronLeft /></button>
          <button onClick={() => setIndex(i => Math.min(max, i + 1))} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded bg-[#F44C27] text-white"><ChevronRight /></button>
        </div>
      </div>
      <div className="flex gap-2 md:gap-4 overflow-x-auto flex-1 items-stretch">
        {news.slice(index, index + (window.innerWidth < 768 ? 1 : 2)).map((item, idx) => (
          <div key={idx} className="min-w-[220px] md:min-w-[320px] max-w-xs bg-white dark:bg-gray-800 rounded-lg flex flex-col h-full">
            <div className="w-full h-32 md:h-48 rounded-lg overflow-hidden mb-2 flex-shrink-0">
              <Image src={item.image} alt={item.title} width={320} height={192} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#F44C27] font-semibold mb-1">{item.date}</div>
                <div className="font-bold text-[#181F2B] dark:text-white mb-1 text-sm md:text-base">{item.title}</div>
                {item.description && <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.description}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 