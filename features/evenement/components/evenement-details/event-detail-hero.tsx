"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, Eye, MapPin } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Eye className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("not_found_title")}
          </h2>
          <p className="text-gray-600">{t("not_found_description")}</p>
          <Button onPress={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back_button")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-100px)] lg:h-[600px] xl:h-[700px] flex items-center justify-center">
      {/* Image d'arrière-plan avec superposition */}
      <Image
        className="absolute inset-0 w-full h-full object-cover shrink-0"
        src={formatImageUrl(event.imageUrl[0])}
        alt={event.title}
        fill
        priority
      />
      <div className="absolute w-full h-full bg-gradient-to-r from-primary/90 to-transparent"></div>

      {/* Contenu de la section hero */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto flex flex-col justify-end h-full py-20">
        {/* Fil d'Ariane */}
        <nav className="text-white font-light text-sm md:text-base mb-6">
          <div className="flex items-center space-x-2">
            <Link href="/" className="hover:underline">
              {t("breadcrumbs.home")}
            </Link>
            <span>/</span>
            <Link href="/evenements" className="hover:underline">
              {t("breadcrumbs.event")}
            </Link>
            <span>/</span>
            <span className="opacity-80 line-clamp-1">{event.title}</span>
          </div>
        </nav>

        {/* En-tête de l'événement */}
        <div className="max-w-4xl text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Métadonnées de l'événement */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base font-medium opacity-90">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{formatEventDate(event.eventDate.toString())}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{event.eventDate.toString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
