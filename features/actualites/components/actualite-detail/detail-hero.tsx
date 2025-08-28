"use client";

import { Link } from "@/i18n/navigation";
import { formatEventDate } from "@/lib/events-data";
import { cn } from "@/lib/utils";
import { getFullUrlFile } from "@/utils/getFullUrlFile";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { IActualite } from "../../types/actualites.type";

export default function ActualiteDetailHero({
  actualite,
}: {
  actualite: IActualite;
}) {
  const t = useTranslations("news");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const hasImages = actualite?.imageUrls && actualite?.imageUrls?.length > 0;
  const selectedImage = hasImages
    ? actualite?.imageUrls?.[selectedImageIndex]!
    : "";

  return (
    <div className="relative w-full h-[calc(100vh-100px)] lg:h-[600px] xl:h-[700px] flex flex-col items-center justify-center">
      <Image
        className="w-full h-full object-cover object-top shrink-0"
        src={getFullUrlFile(selectedImage)}
        alt={actualite.title}
        fill
        priority
      />
      <div className="absolute w-full h-full bg-gradient-to-r from-primary/90 to-transparent"></div>
      {/* Indicateur d'image */}
      {(actualite?.imageUrls?.length ?? 0) > 1 && (
        <div className="absolute  top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {selectedImageIndex + 1} / {actualite?.imageUrls?.length ?? 0}
        </div>
      )}
      {/* Contenu de la section hero */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto flex flex-col justify-end h-full py-20">
        {/* Fil d'Ariane */}
        <nav className="text-white font-light text-sm md:text-base mb-6">
          <div className="flex items-center space-x-2">
            <Link href="/" className="hover:underline">
              {t("breadcrumbs.home")}
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:underline">
              {t("breadcrumbs.news")}
            </Link>
            <span>/</span>
            <span className="opacity-80 line-clamp-1">{actualite.title}</span>
          </div>
        </nav>

        {/* En-tête de l'événement */}
        <div className="max-w-4xl text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {actualite.title}
          </h1>

          {/* Métadonnées de l'événement */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base font-medium opacity-90">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>
                {formatEventDate(actualite.createdAt?.toString() ?? "")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Miniatures */}
      {(actualite?.imageUrls?.length ?? 0) > 1 && (
        <div className="p-4 overflow-x-auto overflow-y-hidden max-w-xl mx-auto rounded-lg">
          <div className="flex gap-3 pb-2">
            {actualite?.imageUrls?.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                  selectedImageIndex === index
                    ? "border-primary shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Image
                  src={getFullUrlFile(imageUrl)}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover aspect-square"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
