'use client';

import {
  Calendar,
  ChevronRight,
  MapPin
} from "lucide-react";
import Image from "next/image";

import { formatEventDate, isEventUpcoming } from "@/lib/events-utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IEvenement } from "../../types/evenement.type";

export default function EventCard({ event }: { event: IEvenement }) {
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
              src={event.imageUrl[0]}
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
};