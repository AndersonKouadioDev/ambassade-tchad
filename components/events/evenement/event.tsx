"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Calendar } from "lucide-react";

export default function Event() {
  const t = useTranslations("event");

  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");

  return (
    <div className="px-6 py-10 mb-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-secondary mb-8 font-mulish">
        {t("description")}
      </h2>

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

      {/* Tu peux filtrer ensuite selon le titre et la date ici */}
    </div>
  );
}
