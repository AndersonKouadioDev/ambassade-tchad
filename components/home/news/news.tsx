import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function News() {
  const t = useTranslations("home.news");

  const newsItems = [0, 1, 2].map((index) => ({
    id: index + 1,
    date: t(`items.${index}.date`),
    image: `/assets/images/illustrations/page-accueil/cards-${index + 1}.png`,
    title: t(`items.${index}.title`),
    alt: t(`items.${index}.alt`),
  }));

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Titre et navigation */}
      <div className="flex justify-center md:justify-between text-center items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary">{t("title")}</h2>
        <div className="hidden md:flex gap-2">
          <button
            type="button"
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
            aria-label="Previous news"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-2 bg-secondary hover:bg-red-600 text-white rounded"
            aria-label="Next news"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Grille des actualités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((item) => (
          <article key={item.id} className="flex flex-col">
            {/* Image avec date */}
            <div className="relative h-64 mb-4">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute bottom-0 left-0 bg-secondary text-white px-4 py-2 text-sm font-semibold">
                {item.date}
              </div>
            </div>

            {/* Titre de l'actualité */}
            <h3 className="text-lg font-medium leading-tight hover:text-secondary cursor-pointer transition-colors">
              {item.title}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
