"use client";

import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { useEvenementList } from "@/features/evenement/hooks/useEvenementList";
import { EvenementFilters } from "@/features/evenement/components/evenement-list/evenement-filters";
import EventCard from "@/features/evenement/components/evenement-list/evenement-card";

export default function Event() {
  const {
    data: allEvents,
    filters,
    handleCreatedAtFilterChange,
    handleTextFilterChange,
  } = useEvenementList();

  const t = useTranslations("event");

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("description")}
        </h2>

        <EvenementFilters
          filters={filters}
          onTextFilterChange={handleTextFilterChange}
          onCreatedAtFilterChange={handleCreatedAtFilterChange}
          translator={t}
          total={allEvents.length}
        />

        {/* Liste des événements */}
        {allEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {t("no_event_title")}
            </h3>
            <p className="text-gray-500">{t("no_event_description")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
            {allEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
