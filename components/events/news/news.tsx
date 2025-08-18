"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActualitesList } from "@/features/actualites/queries/actualite-list.query";
import { IActualiteRechercheParams } from "@/features/actualites/types/actualites.type";
import { getNewsExcerpt } from "@/lib/news-utils";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";
import { formatNewsDate } from "@/lib/news-utils";
import { useQueryStates } from 'nuqs';
import { actualiteFiltersClient } from "@/features/actualites/filters/actualite.filters";

export default function NewsComponent() {
  const t = useTranslations("news");

  // Gestion des filtres avec nuqs
  const [filters, setFilters] = useQueryStates(
    actualiteFiltersClient.filter, 
    actualiteFiltersClient.option
  );

  // Construction des paramètres de recherche
  const currentSearchParams: IActualiteRechercheParams = {
    page: filters.page,
    limit: filters.limit,
    title: filters.title,
    createdAt: filters.createdAt,
    content: filters.content,
  };

  // Récupération des actualités via React Query
  const { data, isLoading, isError } = useActualitesList(currentSearchParams);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      title: e.target.value,
      page: 1 // Reset à la première page lors d'une nouvelle recherche
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      createdAt: e.target.value,
      page: 1 // Reset à la première page lors d'un nouveau filtre date
    });
  };

  if (isLoading) {
    return <p className="text-center py-12">{t("loading")}</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">{t("error")}</p>;
  }

  const newsList = data?.data ?? [];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Barres de recherche : Titre + Date */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20">
        {/* Recherche par titre */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={filters.title}
            onChange={handleSearchChange}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
          />
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Recherche par date */}
        <div className="relative w-full max-w-md">
          <input
            type="date"
            value={filters.createdAt}
            onChange={handleDateChange}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm appearance-none"
            aria-label={t("searchByDate")}
            title={t("searchByDate")}
          />
          <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {/* Titre */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-secondary">
          {t("title")}
        </h2>
      </div>

      {/* Grille des actualités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsList.length > 0 ? (
          newsList.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <article className="flex flex-col group cursor-pointer hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative h-64 mb-4 rounded-xl overflow-hidden">
                  {item.imageUrls?.[0] ? (
                    <Image
                      src={formatImageUrl(item.imageUrls[0])}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 bg-secondary text-white px-4 py-2 text-sm font-semibold">
                    {formatNewsDate(item.createdAt as string)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold leading-tight group-hover:text-secondary transition-colors">
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

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-4">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page <= 1}
            className="p-2 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm">
            Page {filters.page} sur {data.meta.totalPages}
          </span>
          
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page >= data.meta.totalPages}
            className="p-2 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}