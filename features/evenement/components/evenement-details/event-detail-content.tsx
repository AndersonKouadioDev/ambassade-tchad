"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Calendar,
  Eye,
  MapPin,
  User,
  ArrowRight,
} from "lucide-react";
import { Button } from "@heroui/react";
import { formatEventDate } from "@/lib/events-data";
import ShareButton from "@/components/ui/share-button";
import { useParams, useRouter } from "next/navigation";
import { useEvenementQuery } from "@/features/evenement/queries/evenement-details.query";
import Image from "next/image";

export default function EventDetailContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.slug as string;
  const { data: event, isLoading, error } = useEvenementQuery(eventId);

  const t = useTranslations("event.details");

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
          <Button
            onPress={() => router.back()}
            color="primary"
            variant="bordered"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back_button")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Section Informations pratiques */}
          <aside className="lg:w-1/3 bg-gray-50 rounded-2xl p-8 sticky top-24 h-fit">
            <h3 className="text-2xl font-bold text-primary mb-6">
              {t("practicalInfo")}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <span className="text-gray-700 font-semibold">
                    {t("date")}:
                  </span>
                  <p className="text-gray-600 mt-1">
                    {formatEventDate(event.eventDate.toString())}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <span className="text-gray-700 font-semibold">
                    {t("location")}:
                  </span>
                  <p className="text-gray-600 mt-1">{event.location}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <User className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <span className="text-gray-700 font-semibold">
                    {t("organizer")}:
                  </span>
                  <p className="text-gray-600 mt-1">
                    {event.author?.firstName + " " + event.author?.lastName}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {t("actions")}
              </h4>
              <ShareButton
                title={event.title}
                text={event.title}
                className="w-full mt-2"
                label={t("share")}
              />
            </div>
          </aside>

          {/* Section Contenu de l'événement */}
          <main className="lg:w-2/3">
            <div className="prose prose-lg max-w-none text-gray-800">
              <div
                className="text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          </main>
        </div>

        {/* Navigation et lien de retour */}
        <div className="flex justify-start mt-12 pt-8 border-t border-gray-200">
          <Link href="/evenements">
            <Button
              variant="bordered"
              color="primary"
              startContent={<ArrowLeft size={16} />}
              className="hover:bg-primary-50"
            >
              {t("backToEvents")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
