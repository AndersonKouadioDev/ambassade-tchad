"use client";

import { Button } from "@heroui/react";
import { ArrowLeft, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ActualiteDetailHero from "./detail-hero";
import ActualiteDetailContent from "./detail-content";
import { useActualiteDetailQuery } from "../../queries/actualite-details.query";

export default function ActualiteDetail({ id }: { id: string }) {
  const router = useRouter();

  const { data: actualite, isLoading, error } = useActualiteDetailQuery(id);

  const t = useTranslations("event.details");

  const hasImages = actualite?.imageUrls && actualite.imageUrls.length > 0;

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

  if (error || !actualite) {
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
      {hasImages && <ActualiteDetailHero actualite={actualite} />}
      <ActualiteDetailContent actualite={actualite} />
    </main>
  );
}
