"use client";

import { useEvenementQuery } from "@/features/evenement/queries/evenement-details.query";
import { Button } from "@heroui/react";
import { ArrowLeft, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import EventDetailHero from "./event-detail-hero";
import EventDetailContent from "./event-detail-content";

export default function EventDetail({ id }: { id: string }) {
  const router = useRouter();

  const { data: event, isLoading, error } = useEvenementQuery(id);

  const t = useTranslations("event.details");

  const hasImages = event?.imageUrl && event.imageUrl.length > 0;

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
    <main>
      {hasImages && <EventDetailHero event={event} />}
      <EventDetailContent event={event} />
    </main>
  );
}
