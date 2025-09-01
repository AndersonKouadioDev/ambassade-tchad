"use client";

import { Link } from "@/i18n/navigation";
import { formatEventDate, formatEventTime } from "@/lib/events-data";
import { Button } from "@heroui/react";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { IEvenement } from "../../types/evenement.type";

export default function EventDetailContent({ event }: { event: IEvenement }) {
  const t = useTranslations("event.details");

  return (
    <div className="relative">
      {/* Header avec breadcrumb et actions */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-600">
              <button className="hover:text-gray-900 transition-colors">
                Accueil
              </button>
              <span className="mx-2">/</span>
              <button className="hover:text-gray-900 transition-colors">
                Événements
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-48">
                {event.title}
              </span>
            </nav>

            {/* Actions */}
            {/* <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
              <Heart className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Sauvegarder</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <Share2 className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Partager</span>
            </button>
          </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* En-tête de l'article */}
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {event.title}
          </h1>

          {/* Métadonnées de l'événement */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                {formatEventDate(event.eventDate.toString())}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium">
                {formatEventTime(event.eventDate.toString())}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>

          {/* Informations sur l'organisateur */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("organizer")}:</p>
              <p className="font-semibold text-gray-900">
                {event.author?.firstName} {event.author?.lastName}
              </p>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <article className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-6 [&>p]:text-lg [&>p]:leading-8 [&>p]:mb-6">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
        </article>

        {/* Section d'engagement */}
        {/* <div className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Prêt à participer ?
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Ne manquez pas cette opportunité unique de rencontrer des experts et
            de découvrir les dernières innovations technologiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              S'inscrire maintenant
            </button>
            <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md">
              Plus d'informations
            </button>
          </div>
        </div> */}

        {/* Navigation de retour */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Button
            as={Link}
            href="/event"
            startContent={<ArrowLeft className="w-5 h-5" />}
            variant="solid"
            color="primary"
          >
            <span className="font-medium"> {t("backToEvents")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
