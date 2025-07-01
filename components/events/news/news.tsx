"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function News() {
  const t = useTranslations("home.news");
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const newsItems = [0, 1, 2].map((index) => ({
    id: index + 1,
    date: t(`items.${index}.date`),
    image: `/assets/images/illustrations/page-accueil/cards-${index + 1}.png`,
    title: t(`items.${index}.title`),
    alt: t(`items.${index}.alt`),
  }));

  const filteredNews = newsItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Barres de recherche : Titre + Date */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20">
        {/* Recherche par titre */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
          />
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Recherche par date */}
        <div className="relative w-full max-w-md">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm appearance-none"
          />
          <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      </div>
      {/* Titre + Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-secondary text-center md:text-left">
          {t("title")}
        </h2>
        <div className="hidden md:flex gap-2 mt-10">
          <button
            type="button"
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
            aria-label="Previous news"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 bg-secondary hover:bg-red-600 text-white rounded"
            aria-label="Next news"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grille des actualités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <article key={item.id} className="flex flex-col">
              <div className="relative h-64 mb-4 rounded-xl overflow-hidden">
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
              <h3 className="text-lg font-semibold leading-tight hover:text-secondary transition-colors cursor-pointer">
                {item.title}
              </h3>
            </article>
          ))
        ) : (
          <p className="text-center text-muted col-span-full">
            Aucune actualité trouvée.
          </p>
        )}
      </div>
    </section>
  );
}
