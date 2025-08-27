"use client";

import ShareButton from "@/components/ui/share-button";
import { Link } from "@/i18n/navigation";
import { formatEventDate } from "@/lib/events-data";
import { Button } from "@heroui/react";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { IEvenement } from "../../types/evenement.type";

export default function EventDetailContent({ event }: { event: IEvenement }) {
  const t = useTranslations("event.details");

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
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
        <main className="lg:w-2/3 p-8">
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
        <Link href="/event">
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
  );
}
