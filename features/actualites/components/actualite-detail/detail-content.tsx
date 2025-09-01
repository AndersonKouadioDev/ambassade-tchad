"use client";

import { Link } from "@/i18n/navigation";
import { formatEventDate } from "@/lib/events-data";
import { Button } from "@heroui/react";
import { ArrowLeft, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { IActualite } from "../../types/actualites.type";

export default function ActualiteDetailContent({
  actualite,
}: {
  actualite: IActualite;
}) {
  const t = useTranslations("news");

  return (
    <div className="relative">
      {/* Header avec breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Accueil
              </Link>
              <span className="mx-2">/</span>
              <Link
                href="/news"
                className="hover:text-gray-900 transition-colors"
              >
                Actualités
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-48">
                {actualite.title}
              </span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* En-tête de l'article */}
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {actualite.title}
          </h1>

          {/* Métadonnées de l'actualité */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                {formatEventDate(actualite.createdAt?.toString() ?? "")}
              </span>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <article className="prose prose-lg max-w-none">
          <div
            className="text-gray-700 leading-relaxed space-y-6 [&>p]:text-lg [&>p]:leading-8 [&>p]:mb-6"
            dangerouslySetInnerHTML={{ __html: actualite.content }}
          />
        </article>

        {/* Navigation de retour */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Button
            as={Link}
            href="/news"
            startContent={<ArrowLeft className="w-5 h-5" />}
            variant="solid"
            color="primary"
          >
            <span className="font-medium"> {t("backToNews")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
