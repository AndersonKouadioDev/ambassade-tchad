"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@heroui/react";
import { getRelatedNews, getPreviousNews, getNextNews, type NewsItem } from "@/lib/news-data";
import ShareButton from "@/components/ui/share-button";

type Props = {
  news: NewsItem;
};

export default function NewsDetailContent({ news }: Props) {
  const relatedNews = getRelatedNews(news.id, 2);
  const previousNews = getPreviousNews(news.id);
  const nextNews = getNextNews(news.id);

  return (
    <div className="w-full bg-white">
      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Métadonnées de l'article */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{news.dateFormatted}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{news.author}</span>
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {news.category}
            </span>
          </div>
          
          <ShareButton 
            title={news.title}
            text={news.excerpt}
            variant="bordered"
            className="border-gray-300 hover:border-primary hover:text-primary"
            label="Partager"
          />
        </div>

        {/* Image principale */}
        <div className="relative w-full h-80 mb-8 rounded-xl overflow-hidden">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        {/* Contenu de l'article */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mt-12 pt-8 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-600">Tags:</span>
          {news.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-gray-100 hover:bg-primary hover:text-white transition-colors px-3 py-1 rounded-full text-sm cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Navigation vers articles précédent/suivant */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200">
          <Link href="/news">
            <Button
              variant="bordered"
              startContent={<ArrowLeft size={16} />}
              className="border-gray-300 hover:border-primary hover:text-primary"
            >
              Retour aux actualités
            </Button>
          </Link>
          
          <div className="flex gap-4">
            {previousNews ? (
              <Link href={`/news/${previousNews.slug}`}>
                <Button
                  variant="ghost"
                  startContent={<ArrowLeft size={16} />}
                  className="text-gray-600 hover:text-primary"
                  title={previousNews.title}
                >
                  Article précédent
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                startContent={<ArrowLeft size={16} />}
                className="text-gray-400 cursor-not-allowed"
                disabled
              >
                Article précédent
              </Button>
            )}
            
            {nextNews ? (
              <Link href={`/news/${nextNews.slug}`}>
                <Button
                  variant="ghost"
                  endContent={<ArrowRight size={16} />}
                  className="text-gray-600 hover:text-primary"
                  title={nextNews.title}
                >
                  Article suivant
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                endContent={<ArrowRight size={16} />}
                className="text-gray-400 cursor-not-allowed"
                disabled
              >
                Article suivant
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Articles similaires */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Articles similaires
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedNews.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span>{article.dateFormatted}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
