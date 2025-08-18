"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, User, Tag } from "lucide-react";
import { type NewsItem } from "@/lib/news-data";
import ShareButton from "@/components/ui/share-button";

type Props = {
  news: NewsItem;
};

export default function NewsDetailHero({ news }: Props) {
  return (
    <div className="relative flex items-center justify-between w-full h-[calc(100vh-200px)]">
      <Image
        className="absolute inset-0 w-full h-full object-cover shrink-0"
        src={news.image}
        alt={news.title}
        fill
        priority
      />
      <div className="absolute w-full h-full bg-gradient-to-r from-primary/90 to-primary/70 px-4"></div>

      <div className="absolute px-4 pt-4 inset-0 flex flex-col bottom-2 items-start justify-center text-left text-white text-xl sm:text-2xl lg:text-2xl font-semibold gap-20 lg:gap-32">
        {/* Breadcrumbs */}
        <div className="mx-auto relative right-0 lg:right-80 justify-start p-8 flex flex-col gap-6">
          <nav className="text-white font-extralight text-lg mb-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-white hover:underline">
                Accueil
              </Link>
              <span>{">"}</span>
              <Link href="/news" className="text-white hover:underline">
                Actualités
              </Link>
              <span>{">"}</span>
              <span className="text-white opacity-80">
                {news.title}
              </span>
            </div>
          </nav>
          
          {/* Titre principal */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4 text-base font-normal">
              <span className="bg-primary/80 text-white px-3 py-1 rounded-full text-sm">
                {news.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl mb-6 leading-tight">
              {news.title}
            </h1>
            
            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-normal opacity-90">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{news.dateFormatted}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{news.author}</span>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 mt-6">
              <ShareButton
                title={news.title}
                text={news.excerpt}
                label="Partager"
                variant="bordered"
                className="border-white text-white hover:bg-primary/80 hover:border-primary/80 transition-colors duration-200"
              />
            </div>
            
            {/* Excerpt */}
            <p className="text-lg font-normal opacity-90 mt-6 leading-relaxed max-w-3xl">
              {news.excerpt}
            </p>
            
            {/* Tags */}
            <div className="flex items-center gap-2 mt-6">
              <Tag size={16} />
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-primary/80 text-white px-2 py-1 rounded text-sm hover:bg-primary transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
