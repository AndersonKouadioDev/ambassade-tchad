"use client";

import { Calendar, Filter, Search } from "lucide-react";
import React from "react";

interface EvenentFiltersProps {
  filters: {
    title: string;
    published: 'true' | 'false' | 'all' | null;
    eventDate: string | undefined;
  };
  onTextFilterChange: (filterName: 'title' | 'description' | 'authorId', value: string) => void;
  onCreatedAtFilterChange: (value: string) => void;
  translator: (key: string) => string;
  total: number;
}

export const EvenementFilters: React.FC<EvenentFiltersProps> = ({
  filters,
  onTextFilterChange,
  onCreatedAtFilterChange,
  translator: t,
  total
}) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Recherche par titre */}
        <div className="relative">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={filters.title}
            onChange={(e) => onTextFilterChange("title", e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm border border-gray-200"
          />
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Recherche par date */}
        <div className="relative">
          <input
            type="date"
            value={filters.eventDate || ''}
            onChange={(e) => onCreatedAtFilterChange(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm border border-gray-200"
            title={t("filters.date")}
          />
          <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Filtre par période */}
        <div className="relative">
          <select
            // value={filter}
            // onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm border border-gray-200 appearance-none"
            title={t("filters.all")}
          >              <option value="all">{t("filters.all")}</option>
            <option value="upcoming">{t("filters.upcoming")}</option>
            <option value="past">{t("filters.past")}</option>
          </select>
          <Filter className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {/* Statistiques */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{total} événement(s) trouvé(s)</span>
        {/* {(search || searchDate || filter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSearchDate('');
                  setFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-secondary hover:text-secondary/80 font-medium"
              >
                Réinitialiser les filtres
              </button>
            )} */}
      </div>
    </div>
  );
}; 