"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, Eye, MapPin, Tag } from "lucide-react";
import { Button } from "@heroui/react";
import { formatEventDate } from "@/lib/events-data";
import { formatImageUrl } from "@/utils/image-utils";
import { useParams, useRouter } from "next/navigation";
import { useEvenementQuery } from "@/features/evenement/queries/evenement-details.query";

export default function EventDetailHero() {
  const t = useTranslations("event");
  const params = useParams();
  const router = useRouter();
  const eventId = params.slug as string;

  const { data: event, isLoading, error } = useEvenementQuery(eventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement de l'événement...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <Eye className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Événement introuvable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Cet événement n'existe pas ou a été supprimée.
          </p>
          <Button onPress={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-between w-full h-[calc(100vh-200px)]">
      {/* Image d'arrière-plan avec superposition */}
      <Image
        className="absolute inset-0 w-full h-full object-cover shrink-0"
        src={formatImageUrl(event.imageUrl[0])}
        alt={event.title}
        fill
        priority
      />
      <div className="absolute w-full h-full bg-gradient-to-r from-primary/90 to-primary/70 px-4"></div>

      <div className="absolute px-4 pt-4 inset-0 flex flex-col bottom-2 items-start justify-center text-left text-white text-xl sm:text-2xl lg:text-2xl font-semibold gap-20 lg:gap-32">
        {/* Contenu */}
        <div className="mx-auto relative right-0 lg:right-80 justify-start p-8 flex flex-col gap-6">
          {/* Fil d'Ariane */}
          <nav className="text-white font-extralight text-lg mb-4">
            <div className="flex items-center space-x-2">
              <Link href="/public" className="text-white hover:underline">
                {t("breadcrumbs.home")}
              </Link>
              <span>{">"}</span>
              <Link href="/event" className="text-white hover:underline">
                {t("breadcrumbs.event")}
              </Link>
              <span>{">"}</span>
              <span className="text-white opacity-80">{event.title}</span>
            </div>
          </nav>

          {/* En-tête de l'événement */}
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl mb-6 leading-tight">
              {event.title}
            </h1>

            {/* Métadonnées de l'événement */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-normal opacity-90">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatEventDate(event.eventDate.toString())}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{event.eventDate.toString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
