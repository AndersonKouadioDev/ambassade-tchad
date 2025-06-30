"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";


export default function Event() {
    const t = useTranslations("event");
    const [search, setSearch] = useState("");

//     const filteredPictures = event.filter((item) =>
//     item.title.toLowerCase().includes(search.toLowerCase())
//   );

  return (
    <div className="px-6 py-10 mb-6 bg-white">
     <h2 className="text-3xl font-bold text-center text-secondary mb-8 font-mulish">
        {t("description")}
      </h2>
      {/* Barre de recherche */}
      <div className="relative max-w-md mx-auto w-full mb-20">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
        />
        <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>
    </div>
  );
}