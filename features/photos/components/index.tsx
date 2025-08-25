"use client";

import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { usePhotosList } from "@/features/photos/queries/photo-list.query";
import { useState } from "react";
import { photoFiltersClient } from "@/features/photos/filters/photo.filters";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";
import { DotLoader } from "react-spinners";
import { IPhotoRechercheParams } from "@/features/photos/types/photo.type";

interface IProps {
  searchParams: IPhotoRechercheParams;
}

export default function GaleryPhotos({ searchParams }: IProps) {
  const t = useTranslations("gallery.photo");

  const [filters, setFilters] = useQueryStates(
    photoFiltersClient.filter,
    photoFiltersClient.option
  );

  const currentSearchParams: IPhotoRechercheParams = {
    page: Number(filters.page) || 1,
    limit: Number(filters.limit) || 12,
    title: filters.title,
    createdAt: filters.createdAt,
  };

  const { data, isLoading, isError } = usePhotosList(currentSearchParams);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      title: e.target.value,
      page: 1,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      createdAt: e.target.value,
      page: 1,
    });
  };

  const handleNext = () => {
    if (data?.meta && filters.page < data.meta.totalPages) {
      setFilters({ ...filters, page: Number(filters.page) + 1 });
    }
  };

  const handlePrev = () => {
    if (Number(filters.page) > 1) {
      setFilters({ ...filters, page: Number(filters.page) - 1 });
    }
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("description")}
        </h2>

        {/* Filtres de recherche */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={filters.title || ""}
              onChange={handleSearchChange}
              className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white shadow-sm"
            />
            <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <div className="relative w-full max-w-md">
            <input
              type="date"
              value={filters.createdAt || ""}
              onChange={handleDateChange}
              className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white shadow-sm appearance-none"
              aria-label={t("searchByDate")}
              title={t("searchByDate")}
            />
            <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Galerie de photos */}
        {data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 mt-8">
            {data.data.map((photo) => {
              const imageUrl = photo.imageUrl?.[0]
                ? formatImageUrl(photo.imageUrl[0])
                : "/placeholder-image.jpg";

              return (
                <div
                  key={photo.id}
                  className="bg-card shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group h-full"
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={imageUrl}
                      alt={photo.title || t("untitled")}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-center text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                      {photo.title || t("untitled")}
                    </h3>
                    {photo.description && (
                      <p className="text-xs text-gray-600 text-center line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {t("noPhotos")}
            </h3>
            <p className="text-gray-500">{t("noPhotosDescription")}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-4">
          <button
            onClick={handlePrev}
            disabled={Number(filters.page) <= 1}
            className="p-3 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <span className="text-sm font-medium text-gray-700">
            {t("pagination", {
              current: filters.page,
              total: data.meta.totalPages,
            })}
          </span>

          <button
            onClick={handleNext}
            disabled={Number(filters.page) >= data.meta.totalPages}
            className="p-3 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 z-50"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative aspect-video w-full">
              <Image
                src={selectedImage}
                alt={t("fullImage")}
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
