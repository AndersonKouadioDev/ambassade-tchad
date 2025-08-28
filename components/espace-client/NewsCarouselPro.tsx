'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useActualitesList } from '@/features/actualites/queries/actualite-list.query';
import { Skeleton } from '@heroui/react';
import { formatNewsDate } from '@/lib/news-utils';
import { getFullUrlFile } from '@/utils/getFullUrlFile';

export default function NewsCarouselPro() {
  const t = useTranslations('espaceClient.dashboard.newsCarousel');
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const { data, isLoading, isError } = useActualitesList({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestion des données
  const newsItems = data?.data || [];
  const max = Math.max(0, newsItems.length - (isMobile ? 1 : 2));
  const visibleItems = newsItems.slice(index, index + (isMobile ? 1 : 2));

  const handlePrev = () => setIndex(i => Math.max(0, i - 1));
  const handleNext = () => setIndex(i => Math.min(max, i + 1));

  if (isLoading) {
    return (
      <div className="bg-white  rounded-xl shadow-sm p-4 md:p-6 w-full h-[340px] md:h-[500px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
        <div className="flex gap-4 flex-1">
          <Skeleton className="w-full md:w-1/2 h-full rounded-lg" />
          {!isMobile && <Skeleton className="w-1/2 h-full rounded-lg" />}
        </div>
      </div>
    );
  }

  if (isError || newsItems.length === 0) {
    return (
      <div className="bg-white  rounded-xl shadow-sm p-4 md:p-6 w-full h-[340px] md:h-[500px] flex flex-col items-center justify-center">
        <p className="text-gray-500  text-center">
          {t('noNews')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white  rounded-xl shadow-sm p-4 md:p-6 w-full h-[340px] md:h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <h2 className="text-base md:text-xl font-bold text-gray-900 ">
          {t('title')}
        </h2>
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={handlePrev} 
            disabled={index <= 0}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded bg-gray-50 text-gray-900 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            aria-label={t('previous')}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNext} 
            disabled={index >= max}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            aria-label={t('next')}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 md:gap-4 overflow-x-auto flex-1 items-stretch pb-2">
        {visibleItems.map((item) => {
          const imageUrl = item.imageUrls?.[0] ? getFullUrlFile(item.imageUrls[0]) : '/placeholder-news.jpg';
          
          return (
            <article 
              key={item.id} 
              className="min-w-[220px] md:min-w-[320px] max-w-xs bg-white  rounded-lg flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full h-32 md:h-48 rounded-lg overflow-hidden mb-2 flex-shrink-0 relative">
                <Image 
                  src={imageUrl} 
                  alt={item.title} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between p-2">
                <div>
                  <time className="text-xs text-orange-500 font-semibold mb-1">
                    {formatNewsDate(item.createdAt as string)}
                  </time>
                  <h3 className="font-bold text-gray-900  mb-1 text-sm md:text-base line-clamp-2">
                    {item.title}
                  </h3>
                  {item.content && (
                    <p className="text-xs text-gray-500  line-clamp-3">
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}