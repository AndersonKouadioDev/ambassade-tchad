"use client";

import {useTranslations} from "next-intl";
import {Calendar} from "lucide-react";
import {useEvenementList} from "@/features/evenement/hooks/useEvenementList";
import {EvenementFilters} from "@/features/evenement/components/evenement-list/evenement-filters";
import EventCard from "@/features/evenement/components/evenement-list/evenement-card";

export default function Event() {
  const { data: allEvents, isLoading, filters, handleCreatedAtFilterChange, handleTextFilterChange } = useEvenementList();

  const t = useTranslations("event");
  // const [search, setSearch] = useState("");
  // const [searchDate, setSearchDate] = useState("");
  // const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  // const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('published');
  // const [categoryFilter, setCategoryFilter] = useState('all');

  return (
    <div className="px-6 py-10 mb-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-secondary mb-8 font-mulish">
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
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
