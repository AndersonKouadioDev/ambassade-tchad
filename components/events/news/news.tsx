"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { News } from "@/lib/types";
import { newsData } from "@/lib/news-store";
import {
  formatNewsDate,
  searchNews,
  filterNewsByDate,
  getNewsExcerpt,
} from "@/lib/news-utils";

export default function NewsComponent() {
  const t = useTranslations("news");

  console.log("Traductions filters:", t); // <== ici

  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<
    "all" | "published" | "draft"
  >("published");

  // Récupération des actualités depuis le store
  const allNews = useMemo(() => newsData, []);

  // Filtrage des actualités
  const filteredNews = useMemo(() => {
    let news = allNews;

    // Filtrage par statut de publication
    if (publishedFilter === "published") {
      news = news.filter((item) => item.published);
    } else if (publishedFilter === "draft") {
      news = news.filter((item) => !item.published);
    }

    // Filtrage par recherche textuelle
    if (search.trim()) {
      news = searchNews(news, search);
    }

    // Filtrage par date
    if (searchDate) {
      news = filterNewsByDate(news, searchDate);
    }

    return news;
  }, [allNews, search, searchDate, publishedFilter]);

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
            aria-label={t("searchByDate")}
            title={t("searchByDate")}
          />
          <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Filtre par statut de publication */}
        <div className="relative w-full max-w-md">
          <select
            value={publishedFilter}
            onChange={(e) =>
              setPublishedFilter(
                e.target.value as "all" | "published" | "draft"
              )
            }
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm appearance-none"
            aria-label={t("filterByStatus")}
            title={t("filterByStatus")}
          >
            <option value="all">{t("allStatus")}</option>
            <option value="published">{t("published")}</option>
            <option value="draft">{t("draft")}</option>
          </select>
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
            aria-label={t("previousPage")}
            title={t("previousPage")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 bg-secondary hover:bg-red-600 text-white rounded"
            aria-label={t("nextPage")}
            title={t("nextPage")}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grille des actualités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <article className="flex flex-col group cursor-pointer hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative h-64 mb-4 rounded-xl overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 bg-secondary text-white px-4 py-2 text-sm font-semibold">
                    {formatNewsDate(item.createdAt)}
                  </div>

                  {/* Badge pour les actualités non publiées */}
                  {!item.published && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {t("draft")}
                      </span>
                    </div>
                  )}

                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-lg font-semibold leading-tight group-hover:text-secondary transition-colors cursor-pointer">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {getNewsExcerpt(item.content, 100)}
                </p>
              </article>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full py-12">
            {t("noNewsFound")}
          </p>
        )}
      </div>
    </section>
  );
}
