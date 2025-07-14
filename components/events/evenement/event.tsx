"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, Calendar, MapPin, Filter, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Event } from "@/lib/types";
import { eventsData } from "@/lib/events-store";
import { formatEventDate, isEventUpcoming, searchEvents, filterEventsByDate, filterEventsByStatus } from "@/lib/events-utils";

export default function Event() {
  const t = useTranslations("event");
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('published');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Récupération des événements depuis le store
  const allEvents = useMemo(() => eventsData, []);

  const filteredEvents = useMemo(() => {
    let events = allEvents;

    // Filtrage par statut de publication
    if (publishedFilter === 'published') {
      events = events.filter(event => event.published);
    } else if (publishedFilter === 'draft') {
      events = events.filter(event => !event.published);
    }

    // Filtrage par recherche textuelle
    if (search.trim()) {
      events = searchEvents(events, search);
    }

    // Filtrage par date
    if (searchDate) {
      events = filterEventsByDate(events, searchDate);
    }

    // Filtrage par période (upcoming/past)
    events = filterEventsByStatus(events, filter);

    return events;
  }, [search, searchDate, filter, publishedFilter, allEvents]);

  return (
    <div className="px-6 py-10 mb-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-secondary mb-8 font-mulish">
          {t("description")}
        </h2>

        {/* Barres de recherche et filtres */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Recherche par titre */}
            <div className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm border border-gray-200"
              />
              <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>

            {/* Recherche par date */}
            <div className="relative">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm border border-gray-200"
                title={t("filters.date")}
              />
              <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>

            {/* Filtre par période */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm border border-gray-200 appearance-none"
                title={t("filters.all")}
              >              <option value="all">{t("filters.all")}</option>
              <option value="upcoming">{t("filters.upcoming")}</option>
              <option value="past">{t("filters.past")}</option>
              </select>
              <Filter className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>

            {/* Filtre par statut de publication */}
            <div className="relative">
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value as 'all' | 'published' | 'draft')}
                className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm border border-gray-200 appearance-none"
                title={t("filters.status")}
              >
                <option value="all">{t("filters.allStatus")}</option>
                <option value="published">{t("filters.published")}</option>
                <option value="draft">{t("filters.draft")}</option>
              </select>
              <Filter className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>

          {/* Statistiques */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredEvents.length} événement(s) trouvé(s)</span>
            {(search || searchDate || filter !== 'all' || categoryFilter !== 'all') && (
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
            )}
          </div>
        </div>

        {/* Liste des événements */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const t = useTranslations("event");
  const isUpcoming = isEventUpcoming(event.eventDate);
  const eventId = event.id.toString();

  return (
    <Link href={`/event/${eventId}`} className="group">
      <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-secondary/20 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {!event.published && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {t("draft")}
              </span>
            )}
          </div>
          
          {!isUpcoming && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm font-medium">
                {t("filters.past")}
              </span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Date et heure */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatEventDate(event.eventDate)}</span>
            </div>
          </div>

          {/* Titre */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Description (remplace l'ancien extrait) */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {event.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>

          {/* Informations supplémentaires */}
          {event.location && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          )}

          {/* Call to action */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1 text-secondary font-medium text-sm group-hover:gap-2 transition-all">
              <span>{t("readMore")}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
