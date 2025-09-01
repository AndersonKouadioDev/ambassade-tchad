"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActualitesList } from "@/features/actualites/queries/actualite-list.query";
import { IActualiteRechercheParams } from "@/features/actualites/types/actualites.type";
import { getNewsExcerpt } from "@/lib/news-utils";
import { formatNewsDate } from "@/lib/news-utils";
import { useQueryStates } from "nuqs";
import { actualiteFiltersClient } from "@/features/actualites/filters/actualite.filters";
import { getFullUrlFile } from "@/utils/getFullUrlFile";

interface Props {
  searchParams: IActualiteRechercheParams;
}

export default function NewsComponent({ searchParams }: Props) {
  const t = useTranslations("news");

  const [filters, setFilters] = useQueryStates(
    actualiteFiltersClient.filter,
    actualiteFiltersClient.option
  );

  const currentSearchParams: IActualiteRechercheParams = {
    page: filters.page,
    limit: filters.limit,
    title: filters.title,
    createdAt: filters.createdAt,
    content: filters.content,
  };

  const { data, isLoading, isError } = useActualitesList(currentSearchParams);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      title: e.target.value,
      page: 1,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      createdAt: e.target.value,
      page: 1,
    });
  };

  const newsList = data?.data ?? [];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("description")}
        </h2>

        {/* Filtres de recherche */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={filters.title}
              onChange={handleSearchChange}
              className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white shadow-sm"
            />
            <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <div className="relative w-full max-w-md">
            <input
              type="date"
              value={filters.createdAt}
              onChange={handleDateChange}
              className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white shadow-sm appearance-none"
              aria-label={t("searchByDate")}
              title={t("searchByDate")}
            />
            <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Grille des actualités */}
        {newsList.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {t("noNewsFound")}
            </h3>
            <p className="text-gray-500">{t("noNewsFoundDescription")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
            {newsList.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="h-full">
                <article className="flex flex-col group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-64 w-full">
                    {item.imageUrls?.[0] ? (
                      <Image
                        src={getFullUrlFile(item.imageUrls[0])}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/90 text-primary px-4 py-2 rounded-full text-sm font-bold">
                      {formatNewsDate(item.createdAt as string)}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {getNewsExcerpt(item.content, 120)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-4">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page <= 1}
            className="p-3 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <span className="text-sm font-medium text-gray-700">
            {t("page")} {filters.page} {t("on")} {data.meta.totalPages}
          </span>

          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page >= data.meta.totalPages}
            className="p-3 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </section>
  );
}
